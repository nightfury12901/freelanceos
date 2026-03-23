-- Migration: add clients table for FreelanceOS
-- Run this in Supabase SQL editor

create type client_status as enum ('active', 'on_hold', 'completed', 'prospect');

create table if not exists public.clients (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.users(id) on delete cascade,
  name          text not null,
  company       text,
  email         text,
  phone         text,
  role          text,                          -- e.g. "Product Designer at Acme"
  status        client_status not null default 'active',
  notes         text,
  tags          text[],
  total_billed  numeric(12,2) not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- RLS
alter table public.clients enable row level security;

create policy "Users manage their own clients"
  on public.clients for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Auto-update updated_at
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger clients_updated_at
  before update on public.clients
  for each row execute procedure public.touch_updated_at();

-- Index
create index clients_user_id_idx on public.clients(user_id);
