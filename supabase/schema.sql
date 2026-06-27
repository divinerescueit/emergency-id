-- Run this in Supabase SQL Editor (Project -> SQL Editor -> New query)
-- If you already ran the previous schema, run only the ALTER TABLE line at the bottom.

create table if not exists public.emergency_profiles (
  id text primary key,
  name text not null,
  age text,
  gender text,
  mobile text,
  blood text,
  donor text default 'No',
  allergies text,
  conditions text,
  meds text,
  privacy text default 'public',
  contacts jsonb not null default '[]',
  acknowledged_by text,
  acknowledged_at timestamptz,
  created_at timestamptz default now()
);

alter table public.emergency_profiles enable row level security;

-- If you already created the table earlier, just run this line to add the mobile column:
alter table public.emergency_profiles add column if not exists mobile text;
