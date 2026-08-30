-- Per-user data for logged-in QuickBuy users: cart, recent products, recent searches.
-- Guests keep using localStorage; on first login the local copy is merged in (app-side).

create table public.cart_items (
  user_id    uuid   not null references auth.users (id) on delete cascade,
  product_id bigint not null references public.products (id) on delete cascade,
  quantity   integer not null check (quantity between 1 and 10),
  updated_at timestamptz not null default now(),
  primary key (user_id, product_id)
);
create index cart_items_user_id_idx on public.cart_items (user_id);
create trigger cart_items_set_updated_at before update on public.cart_items
  for each row execute function extensions.moddatetime (updated_at);

create table public.recent_products (
  user_id    uuid   not null references auth.users (id) on delete cascade,
  product_id bigint not null references public.products (id) on delete cascade,
  viewed_at  timestamptz not null default now(),
  primary key (user_id, product_id)
);
create index recent_products_user_viewed_idx on public.recent_products (user_id, viewed_at desc);

create table public.recent_searches (
  id          bigint generated always as identity primary key,
  user_id     uuid not null references auth.users (id) on delete cascade,
  query       text not null check (char_length(query) between 1 and 100),
  query_key   text generated always as (lower(query)) stored,  -- case-insensitive dedup, keeps display case
  searched_at timestamptz not null default now(),
  unique (user_id, query_key)
);
create index recent_searches_user_searched_idx on public.recent_searches (user_id, searched_at desc);

-- Keep only the newest N rows per user (8 searches / 10 products), server-side.
create function public.prune_recent_searches() returns trigger language plpgsql as $$
begin
  delete from public.recent_searches r
  where r.user_id = new.user_id
    and r.id not in (
      select id from public.recent_searches
      where user_id = new.user_id order by searched_at desc limit 8
    );
  return null;
end $$;
create trigger recent_searches_prune after insert or update on public.recent_searches
  for each row execute function public.prune_recent_searches();

create function public.prune_recent_products() returns trigger language plpgsql as $$
begin
  delete from public.recent_products r
  where r.user_id = new.user_id
    and r.product_id not in (
      select product_id from public.recent_products
      where user_id = new.user_id order by viewed_at desc limit 10
    );
  return null;
end $$;
create trigger recent_products_prune after insert or update on public.recent_products
  for each row execute function public.prune_recent_products();

-- RLS: each user may only read/write their own rows.
alter table public.cart_items      enable row level security;
alter table public.recent_products enable row level security;
alter table public.recent_searches enable row level security;

create policy "Own cart" on public.cart_items for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Own recent products" on public.recent_products for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Own recent searches" on public.recent_searches for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
