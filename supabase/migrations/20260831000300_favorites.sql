-- Per-user favorites (wishlist) for logged-in QuickBuy users.
-- Guests have no favorites at all (no localStorage, no merge).

create table public.favorites (
  user_id    uuid   not null references auth.users (id) on delete cascade,
  product_id bigint not null references public.products (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);
create index favorites_user_created_idx on public.favorites (user_id, created_at desc);

-- RLS: each user may only read/write their own rows.
alter table public.favorites enable row level security;

create policy "Own favorites" on public.favorites for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
