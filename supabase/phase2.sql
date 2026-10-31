-- ============================================================
-- PushtiPlate PHASE 2 — optional accounts (run AFTER setup.sql)
-- Supabase Dashboard → SQL Editor → New query → paste ALL → Run
-- Safe to run more than once.
-- ============================================================

-- Nullable user_id: guest rows keep working (null = guest)
alter table public.audits add column if not exists user_id uuid references auth.users(id) on delete set null;

-- Replace the old demo read policy: guests (anon / null owner) stay readable,
-- logged-in users read only their own rows.
drop policy if exists "demo read" on public.audits;
create policy "read own or guest" on public.audits
  for select using (user_id is null or auth.uid() = user_id);

-- Insert stays allowed for the anonymous demo flow (unchanged):
-- policy "demo insert" from setup.sql remains in place.

-- Done. Google login also needs: Authentication → Providers → Google ON
-- (with a Google Cloud OAuth client) — optional, email login works without it.
