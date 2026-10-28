# PushtiPlate (পুষ্টি থালা) — One photo of today's plate. One food to add tomorrow.

A mother photographs her 6–23-month-old child's meal plate. Muse Spark identifies the
foods, the WHO/UNICEF dietary-diversity rule scores them in plain code, and Muse Image
shows tomorrow's plate with one affordable food added — explained as a picture and a
spoken Bangla sentence. No reading, no typing.

## The problem
MICS 2025: only 29.5% of Bangladeshi children 6–23 months get a minimum acceptable diet;
64.8% face child food poverty; stunting is 24%. Damage in the first 1,000 days is permanent.

## Who it's for
Mothers of 6–23-month-olds (health workers as second operator). Designed for users who
cannot read well: photo in, picture + voice out. Plate-only photos (never the child).

## How it works
1. Photo of the plate → downscaled → private Supabase Storage (signed URL).
2. `analyze-plate` Edge Function → Muse Spark vision → strict JSON of food groups.
3. Scoring engine in plain TypeScript (no AI): ≥5 of 8 WHO groups = good; ≤2 routes to a
   health worker; otherwise suggest the first missing food from a fixed priority table
   (egg → dal → small fish → orange veg → milk).
4. Result card: big Bangla score (৩/৮), 8 tappable icons (tap to correct), 🔊 spoken
   Bangla (TTS with pre-recorded MP3 fallback), today/tomorrow plate side-by-side.
5. Audit saved to Supabase for History. Demo Mode (long-press logo): 3 cached sample
   plates run the full flow with no network.

**The AI only looks. The WHO rule decides.**

## Meta AI stack — smoke-test level: L0 (verified)
- Muse Spark `muse-spark-1.3` — vision → strict JSON (verified HTTP 200).
- Muse Image `muse-image-1.0` — tomorrow's plate (verified HTTP 200).
- SAM 3.1 — **not shipped** (optional overlay, cut per plan §10.1 cut order; score never
  depended on it). Everything goes through Supabase Edge Functions, so the Meta API key
  never reaches the browser (verified: 0 hits in the built JS).

## Run it locally
```bash
npm install
# .env.local with: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY (anon key only)
npm run dev
```
Database: run `supabase/setup.sql` once in the Supabase SQL Editor.
Edge Functions: deploy `supabase/functions/analyze-plate` and `tomorrow-plate`;
set secrets `META_API_KEY`, `META_BASE_URL=https://api.meta.ai/v1` in Supabase only.

## Safety & limits
General feeding information, not medical advice (shown on every result). Score ≤2 routes
to a Shasthya Shebika — the app never diagnoses. Deliberate demo trade-offs: open RLS
policies (no login in the hackathon demo), plate-only photo rule, no accounts.
WhatsApp delivery is roadmap only, not built.

## Built by
Solo, in exam week, ~12 hours.
