-- Demo-only: 3 fixed fake accounts so the login flow can be exercised.
-- There is no sign-up flow in QuickBuy; these are the only user accounts.
-- All passwords: quickbuy123
do $$
declare
  rec record;
  new_id uuid;
begin
  for rec in (
    select * from (values
      ('ava.mitchell@quickbuy.test', 'Ava',  'Mitchell'),
      ('noah.bennett@quickbuy.test', 'Noah', 'Bennett'),
      ('mia.torres@quickbuy.test',   'Mia',  'Torres')
    ) as t(email, first_name, last_name)
  )
  loop
    if not exists (select 1 from auth.users where email = rec.email) then
      new_id := gen_random_uuid();

      insert into auth.users (
        instance_id, id, aud, role, email, encrypted_password,
        email_confirmed_at, created_at, updated_at,
        raw_app_meta_data, raw_user_meta_data,
        confirmation_token, recovery_token, email_change_token_new, email_change
      ) values (
        '00000000-0000-0000-0000-000000000000', new_id, 'authenticated', 'authenticated',
        rec.email, extensions.crypt('quickbuy123', extensions.gen_salt('bf')),
        now(), now(), now(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        jsonb_build_object(
          'first_name', rec.first_name,
          'last_name',  rec.last_name,
          'full_name',  rec.first_name || ' ' || rec.last_name,
          'email_verified', true
        ),
        '', '', '', ''
      );

      insert into auth.identities (
        id, user_id, provider_id, provider, identity_data,
        last_sign_in_at, created_at, updated_at
      ) values (
        gen_random_uuid(), new_id, new_id::text, 'email',
        jsonb_build_object(
          'sub', new_id::text, 'email', rec.email,
          'email_verified', true, 'phone_verified', false
        ),
        now(), now(), now()
      );
    end if;
  end loop;
end $$;
