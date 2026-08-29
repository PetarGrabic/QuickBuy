-- QuickBuy product catalogue: categories, products, product_reviews.
-- Public read-only data (RLS: anon/authenticated SELECT only; writes via service_role).

create extension if not exists moddatetime schema extensions;
create extension if not exists pg_trgm    schema extensions;

create table public.categories (
  slug text primary key,
  name text not null
);

create table public.products (
  id                   bigint primary key,          -- DummyJSON id (natural key, used in /products/[id] routes)
  title                text not null,
  description          text not null,
  category             text not null references public.categories (slug),
  price                numeric(10,2) not null check (price >= 0),
  discount_percentage  numeric not null default 0 check (discount_percentage >= 0),
  rating               numeric(3,2) not null default 0 check (rating >= 0 and rating <= 5),
  stock                integer not null default 0 check (stock >= 0),
  brand                text,
  sku                  text not null,
  thumbnail            text not null,
  images               text[] not null default '{}',
  dimensions           jsonb not null,
  warranty_information text not null,
  shipping_information text not null,
  return_policy        text not null,
  search_text          text generated always as (
                         lower(coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(brand, ''))
                       ) stored,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);
create index products_category_idx     on public.products (category);
create index products_search_trgm_idx  on public.products using gin (search_text extensions.gin_trgm_ops);

create trigger products_set_updated_at
  before update on public.products
  for each row execute function extensions.moddatetime (updated_at);

create table public.product_reviews (
  id             bigint generated always as identity primary key,
  product_id     bigint not null references public.products (id) on delete cascade,
  rating         smallint not null check (rating >= 0 and rating <= 5),
  comment        text not null,
  reviewer_name  text not null,
  reviewer_email text not null,
  review_date    timestamptz not null,
  created_at     timestamptz not null default now()
);
create index product_reviews_product_id_idx on public.product_reviews (product_id);

alter table public.categories      enable row level security;
alter table public.products        enable row level security;
alter table public.product_reviews enable row level security;

create policy "Categories are publicly readable"
  on public.categories for select to anon, authenticated using (true);
create policy "Products are publicly readable"
  on public.products for select to anon, authenticated using (true);
create policy "Product reviews are publicly readable"
  on public.product_reviews for select to anon, authenticated using (true);
