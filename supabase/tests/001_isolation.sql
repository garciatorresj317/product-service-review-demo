-- Run after 001_foundation.sql in Supabase SQL Editor as postgres.
-- Test users and records exist only inside this transaction. Nothing is retained.
-- If a statement fails, show the error before changing SQL, then run ROLLBACK.
begin;

do $$
begin
  if (select count(*) from pg_class c join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public' and c.relname in ('companies','company_users','employees','reviews') and c.relrowsecurity) <> 4 then
    raise exception 'FAIL: all four private tables must have RLS enabled';
  end if;
end $$;

select set_config('test.owner_a', gen_random_uuid()::text, true);
select set_config('test.owner_b', gen_random_uuid()::text, true);
insert into auth.users (id, email) values
  (current_setting('test.owner_a')::uuid, 'foundation-a-' || current_setting('test.owner_a') || '@example.invalid'),
  (current_setting('test.owner_b')::uuid, 'foundation-b-' || current_setting('test.owner_b') || '@example.invalid');

set local role authenticated;
select set_config('request.jwt.claims', json_build_object('sub', current_setting('test.owner_a'), 'role', 'authenticated')::text, true);
select set_config('test.company_a', public.create_company('Foundation Company A')::text, true);
with employee as (
  insert into public.employees(company_id, name) values(current_setting('test.company_a')::uuid, 'John') returning id
) select set_config('test.employee_a', id::text, true) from employee;

select set_config('request.jwt.claims', json_build_object('sub', current_setting('test.owner_b'), 'role', 'authenticated')::text, true);
select set_config('test.company_b', public.create_company('Foundation Company B')::text, true);
with employee as (
  insert into public.employees(company_id, name) values(current_setting('test.company_b')::uuid, 'Jane') returning id
) select set_config('test.employee_b', id::text, true) from employee;

reset role;
insert into public.reviews(company_id, employee_id, rating, feedback) values
  (current_setting('test.company_a')::uuid, current_setting('test.employee_a')::uuid, 5, 'Private test feedback A'),
  (current_setting('test.company_b')::uuid, current_setting('test.employee_b')::uuid, 3, 'Private test feedback B');

do $$
begin
  begin
    insert into public.reviews(company_id, employee_id, rating, feedback)
      values(current_setting('test.company_a')::uuid, current_setting('test.employee_b')::uuid, 4, 'Wrong company');
    raise exception 'FAIL: mismatched employee and company accepted';
  exception when foreign_key_violation then null;
  end;
  begin
    insert into public.reviews(company_id, employee_id, rating, feedback)
      values(current_setting('test.company_a')::uuid, current_setting('test.employee_a')::uuid, 6, 'Invalid rating');
    raise exception 'FAIL: invalid rating accepted';
  exception when check_violation then null;
  end;
  begin
    insert into public.reviews(company_id, employee_id, rating, feedback)
      values(current_setting('test.company_a')::uuid, current_setting('test.employee_a')::uuid, 4, '   ');
    raise exception 'FAIL: empty feedback accepted';
  exception when check_violation then null;
  end;
end $$;

-- Verify both owners, including reads and attempts to mutate the other tenant.
set local role authenticated;
do $$
declare own_company uuid; other_company uuid; own_employee uuid; affected integer; owner_key text;
begin
  foreach owner_key in array array['a', 'b'] loop
    perform set_config('request.jwt.claims', json_build_object('sub', current_setting('test.owner_' || owner_key), 'role', 'authenticated')::text, true);
    own_company := current_setting('test.company_' || owner_key)::uuid;
    other_company := current_setting('test.company_' || case when owner_key = 'a' then 'b' else 'a' end)::uuid;
    own_employee := current_setting('test.employee_' || owner_key)::uuid;
    if (select count(*) from public.companies where id = own_company) <> 1 or exists(select 1 from public.companies where id = other_company) then raise exception 'FAIL: company isolation'; end if;
    if (select count(*) from public.company_users where company_id = own_company) <> 1 or exists(select 1 from public.company_users where company_id = other_company) then raise exception 'FAIL: membership isolation'; end if;
    if (select count(*) from public.employees where company_id = own_company) <> 1 or exists(select 1 from public.employees where company_id = other_company) then raise exception 'FAIL: employee isolation'; end if;
    if (select count(*) from public.reviews where company_id = own_company) <> 1 or exists(select 1 from public.reviews where company_id = other_company) then raise exception 'FAIL: review isolation'; end if;

    update public.companies set name = 'Not allowed' where id = other_company;
    get diagnostics affected = row_count;
    if affected <> 0 then raise exception 'FAIL: foreign company update'; end if;
    update public.employees set active = false where company_id = other_company;
    get diagnostics affected = row_count;
    if affected <> 0 then raise exception 'FAIL: foreign employee update'; end if;
    delete from public.reviews where company_id = other_company;
    get diagnostics affected = row_count;
    if affected <> 0 then raise exception 'FAIL: foreign review deletion'; end if;

    update public.employees set name = 'Updated employee', active = false where id = own_employee;
    get diagnostics affected = row_count;
    if affected <> 1 then raise exception 'FAIL: owner cannot edit own employee'; end if;
    update public.employees set active = true where id = own_employee;

    begin
      insert into public.employees(company_id, name) values(other_company, 'Intruder');
      raise exception 'FAIL: foreign employee insert accepted';
    exception when insufficient_privilege then null;
    end;
    begin
      insert into public.company_users(company_id, user_id) values(other_company, auth.uid());
      raise exception 'FAIL: self-enrollment accepted';
    exception when insufficient_privilege then null;
    end;
    begin
      update public.companies set owner_id = auth.uid() where id = other_company;
      raise exception 'FAIL: ownership change accepted';
    exception when insufficient_privilege then null;
    end;
    begin
      update public.employees set review_token = gen_random_uuid() where id = own_employee;
      raise exception 'FAIL: stable review token was mutable';
    exception when insufficient_privilege then null;
    end;
    begin
      insert into public.reviews(company_id, employee_id, rating, feedback) values(own_company, own_employee, 5, 'Owner fabricating a customer review');
      raise exception 'FAIL: direct review insert accepted';
    exception when insufficient_privilege then null;
    end;
    begin
      perform public.create_company('   ');
      raise exception 'FAIL: blank company name accepted';
    exception when invalid_parameter_value then null;
    end;
  end loop;
end $$;

set local role anon;
select set_config('request.jwt.claims', '{"role":"anon"}', true);
do $$
declare table_name text;
begin
  if public.foundation_version() <> '001' then raise exception 'FAIL: public probe'; end if;
  foreach table_name in array array['companies', 'company_users', 'employees', 'reviews'] loop
    begin
      execute format('select count(*) from public.%I', table_name);
      raise exception 'FAIL: anonymous read permitted on %', table_name;
    exception when insufficient_privilege then null;
    end;
  end loop;
  begin
    perform public.create_company('Anonymous company');
    raise exception 'FAIL: anonymous company creation';
  exception when insufficient_privilege then null;
  end;
end $$;

reset role;
rollback;
select 'PASS: RLS enabled; both owners isolated; anonymous private reads denied; ownership and stable links protected; company/employee consistency and feedback validation enforced. All test data rolled back.' as result;
