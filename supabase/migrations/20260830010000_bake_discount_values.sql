-- Store the *applied* discount percent (0/5/10/15/20) in products.discount_percentage
-- instead of the raw DummyJSON promo number. This is exactly what the UI shows:
--   in stock AND floor(raw) in {4,9,14,19} -> 5/10/15/20 ; everything else -> 0
update public.products
set discount_percentage = case
  when stock > 0 then case floor(discount_percentage)
    when 4 then 5 when 9 then 10 when 14 then 15 when 19 then 20 else 0 end
  else 0
end;

alter table public.products
  drop constraint if exists products_discount_percentage_check,
  alter column discount_percentage type smallint using discount_percentage::smallint,
  alter column discount_percentage set default 0,
  add constraint products_discount_percentage_check
    check (discount_percentage in (0, 5, 10, 15, 20));
