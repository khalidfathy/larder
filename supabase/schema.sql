-- Larder — cloud sync schema
-- Run this once in your Supabase project: Dashboard → SQL Editor → New query → paste → Run.
--
-- It stores each user's entire app state as one JSON row, protected by Row Level
-- Security so an account can only read/write its own data.

create table if not exists public.app_state (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  data       jsonb       not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.app_state enable row level security;

-- One policy covering select/insert/update/delete: you may only touch your own row.
drop policy if exists "app_state is private to its owner" on public.app_state;
create policy "app_state is private to its owner"
  on public.app_state
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
