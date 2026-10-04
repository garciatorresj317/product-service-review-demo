-- Run ONCE in a fresh Supabase project's SQL Editor. All changes are atomic.
begin;

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 120),
  created_at timestamptz not null default now(),
  unique (id, owner_id)
);

-- Initial scope: one owner role; no invitations or extra roles yet.
create table public.company_users (
  company_id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'owner' check (role = 'owner'),
  created_at timestamptz not null default now(),
  foreign key (company_id, user_id) references public.companies(id, owner_id) on delete cascade
);
create index company_users_user_idx on public.company_users(user_id);
create index companies_owner_idx on public.companies(owner_id);

create table public.employees (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 120),
  active boolean not null default true,
  -- Stable token: future normal URL will be /review/<review_token>.
  review_token uuid not null unique default gen_random_uuid(),
  created_at timestamptz not null default now(),
  unique (company_id, id)
);
create index employees_company_idx on public.employees(company_id);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  employee_id uuid not null,
  rating smallint not null check (rating between 1 and 5),
  feedback text not null check (char_length(btrim(feedback)) between 1 and 5000),
  created_at timestamptz not null default now(),
  -- Reject even privileged inserts that mismatch employee and company.
  foreign key (company_id, employee_id) references public.employees(company_id, id) on delete restrict
);
create index reviews_company_date_idx on public.reviews(company_id, created_at desc);
create index reviews_employee_date_idx on public.reviews(employee_id, created_at desc);

alter table public.companies enable row level security;
alter table public.company_users enable row level security;
alter table public.employees enable row level security;
alter table public.reviews enable row level security;

-- Remove Supabase's default grants. Customer access will later use narrow RPCs,
-- never public SELECT access to these private tables.
revoke all on public.companies, public.company_users, public.employees, public.reviews from public, anon, authenticated;
grant select on public.companies, public.company_users, public.employees, public.reviews to authenticated;
grant update (name) on public.companies to authenticated;
grant insert (company_id, name), update (name, active) on public.employees to authenticated;
grant delete on public.reviews to authenticated;

create policy company_owner_read on public.companies for select to authenticated
  using (owner_id = (select auth.uid()));
create policy company_owner_update on public.companies for update to authenticated
  using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
create policy own_membership_read on public.company_users for select to authenticated
  using (user_id = (select auth.uid()));
create policy employee_owner_read on public.employees for select to authenticated
  using (exists (select 1 from public.company_users m where m.company_id = employees.company_id and m.user_id = (select auth.uid())));
create policy employee_owner_insert on public.employees for insert to authenticated
  with check (exists (select 1 from public.company_users m where m.company_id = employees.company_id and m.user_id = (select auth.uid())));
create policy employee_owner_update on public.employees for update to authenticated
  using (exists (select 1 from public.company_users m where m.company_id = employees.company_id and m.user_id = (select auth.uid())))
  with check (exists (select 1 from public.company_users m where m.company_id = employees.company_id and m.user_id = (select auth.uid())));
create policy review_owner_read on public.reviews for select to authenticated
  using (exists (select 1 from public.company_users m where m.company_id = reviews.company_id and m.user_id = (select auth.uid())));
create policy review_owner_delete on public.reviews for delete to authenticated
  using (exists (select 1 from public.company_users m where m.company_id = reviews.company_id and m.user_id = (select auth.uid())));

-- This creates the company and membership together, preventing self-enrollment
-- into another company. Caller cannot supply an owner ID.
create function public.create_company(company_name text) returns uuid
language plpgsql security definer set search_path = '' as $$
declare new_id uuid; caller uuid := auth.uid();
begin
  if caller is null then raise exception 'Authentication required' using errcode = '42501'; end if;
  if company_name is null or char_length(btrim(company_name)) not between 1 and 120 then
    raise exception 'Company name must contain 1 to 120 characters' using errcode = '22023';
  end if;
  insert into public.companies (owner_id, name) values (caller, btrim(company_name)) returning id into new_id;
  insert into public.company_users (company_id, user_id) values (new_id, caller);
  return new_id;
end;
$$;
revoke all on function public.create_company(text) from public, anon, authenticated;
grant execute on function public.create_company(text) to authenticated;

-- Safe public connection probe. Returns no companies, employees, or reviews.
create function public.foundation_version() returns text
language sql immutable security invoker set search_path = '' as $$ select '001'::text $$;
revoke all on function public.foundation_version() from public, anon, authenticated;
grant execute on function public.foundation_version() to anon, authenticated;

commit;
