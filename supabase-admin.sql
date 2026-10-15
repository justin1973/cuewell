-- Cuewell — migration for the admin console & account improvements.
-- Run this ONCE in the Supabase SQL editor (Dashboard → SQL Editor → New query → paste → Run).
-- Safe to re-run: every statement uses "if not exists".

-- 1. A user can be suspended by an admin. Suspended users can't sign in to the
--    dashboard (middleware blocks them) and the engine skips their watches.
alter table public.profiles
  add column if not exists suspended boolean not null default false;

-- 2. Optional note the admin can attach to a user (e.g. why they were suspended).
alter table public.profiles
  add column if not exists admin_note text;

-- 3. Make sure deleting an auth user cleans up everything they own.
--    (These re-create the foreign keys with ON DELETE CASCADE if they aren't already.)
do $$
begin
  -- watches.user_id -> auth.users
  if exists (
    select 1 from information_schema.table_constraints
    where constraint_name = 'watches_user_id_fkey' and table_name = 'watches'
  ) then
    alter table public.watches drop constraint watches_user_id_fkey;
  end if;
  alter table public.watches
    add constraint watches_user_id_fkey
    foreign key (user_id) references auth.users(id) on delete cascade;

  -- leads.user_id -> auth.users
  if exists (
    select 1 from information_schema.table_constraints
    where constraint_name = 'leads_user_id_fkey' and table_name = 'leads'
  ) then
    alter table public.leads drop constraint leads_user_id_fkey;
  end if;
  alter table public.leads
    add constraint leads_user_id_fkey
    foreign key (user_id) references auth.users(id) on delete cascade;
end $$;
