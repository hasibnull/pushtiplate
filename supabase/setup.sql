-- ============================================================
-- PushtiPlate — ONE-CLICK DATABASE SETUP
-- How: Supabase Dashboard → SQL Editor → New query → paste ALL → Run
-- Safe to run more than once (idempotent).
-- ============================================================

-- 1) audits table (§4.1)
create table if not exists public.audits (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  child_age_months int not null check (child_age_months between 6 and 23),
  photo_url text not null,
  groups_found text[] not null,
  score int not null check (score between 0 and 8),
  verdict text not null check (verdict in ('good','add_food','see_worker')),
  food_to_add text,
  tomorrow_image_url text,
  source text not null default 'live' check (source in ('live','demo'))
);

alter table public.audits enable row level security;

-- DEMO policies (no login — deliberate hackathon trade-off, documented in README)
drop policy if exists "demo read" on public.audits;
drop policy if exists "demo insert" on public.audits;
create policy "demo read"   on public.audits for select using (true);
create policy "demo insert" on public.audits for insert with check (true);

-- 2) tomorrow_cache table (§6 Prompt 8)
create table if not exists public.tomorrow_cache (
  cache_key text primary key,
  image_url text not null,
  created_at timestamptz not null default now()
);

alter table public.tomorrow_cache enable row level security;

drop policy if exists "demo read cache" on public.tomorrow_cache;
drop policy if exists "demo insert cache" on public.tomorrow_cache;
create policy "demo read cache"   on public.tomorrow_cache for select using (true);
create policy "demo insert cache" on public.tomorrow_cache for insert with check (true);

-- 3) Private storage bucket: plates (§4.2)
insert into storage.buckets (id, name, public)
values ('plates', 'plates', false)
on conflict (id) do nothing;

-- Storage policies for the plates bucket
drop policy if exists "demo upload" on storage.objects;
drop policy if exists "demo read own file" on storage.objects;
create policy "demo upload" on storage.objects
  for insert with check (bucket_id = 'plates');
create policy "demo read own file" on storage.objects
  for select using (bucket_id = 'plates');

-- Done. Next: Edge Functions + secrets — see supabase/functions/README in repo.
