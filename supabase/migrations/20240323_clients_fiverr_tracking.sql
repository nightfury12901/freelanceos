-- Migration: detailed client project tracking (Fiverr-like)
-- Run this in Supabase SQL editor

alter table public.clients 
add column if not exists project_title       text,
add column if not exists project_description text,
add column if not exists project_deadline    date,
add column if not exists progress_percent    integer default 0 check (progress_percent >= 0 and progress_percent <= 100),
add column if not exists milestones          jsonb default '[]'::jsonb;

-- Comment for clarity
comment on column public.clients.milestones is 'Array of objects: [{"id": 1, "label": "Phase 1", "done": true}]';
