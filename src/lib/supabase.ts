import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase: SupabaseClient | null =
  url && anon ? createClient(url, anon) : null;

export interface AuditInput {
  child_age_months: number;
  photo_url: string;
  groups_found: string[];
  score: number;
  verdict: string;
  food_to_add: string | null;
  tomorrow_image_url: string | null;
  source: 'live' | 'demo';
}

async function currentUserId(): Promise<string | null> {
  if (!supabase) return null;
  try {
    const { data } = await supabase.auth.getSession();
    return data.session?.user?.id ?? null;
  } catch { return null; }
}

export async function saveAudit(audit: AuditInput): Promise<void> {
  if (!supabase) return; // result screen must still work if saving fails
  try {
    const user_id = await currentUserId();
    // user_id column arrives with supabase/phase2.sql; if absent, retry without it
    const { error } = await supabase.from('audits').insert({ ...audit, user_id });
    if (error) await supabase.from('audits').insert(audit);
  } catch {
    try { await supabase.from('audits').insert(audit); } catch { /* silent by design */ }
  }
}

export interface AuditRow extends AuditInput {
  id: string;
  created_at: string;
  user_id?: string | null;
}

export async function fetchAudits(): Promise<AuditRow[]> {
  if (!supabase) return [];
  const uid = await currentUserId();
  try {
    let query = supabase.from('audits').select('*').order('created_at', { ascending: false }).limit(50);
    if (uid) query = query.eq('user_id', uid); // logged in: only their own plates
    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []) as AuditRow[];
  } catch {
    // phase2.sql not run yet / column missing — fall back to the guest flow
    const { data } = await supabase.from('audits').select('*').order('created_at', { ascending: false }).limit(50);
    return (data ?? []) as AuditRow[];
  }
}

/** Upload a downscaled JPEG to the private `plates` bucket; returns { path, signedUrl }. */
export async function uploadPlate(blob: Blob): Promise<{ path: string; signedUrl: string } | null> {
  if (!supabase) return null;
  const path = `${crypto.randomUUID()}.jpg`;
  const { error } = await supabase.storage
    .from('plates')
    .upload(path, blob, { contentType: 'image/jpeg' });
  if (error) return null;
  const { data } = await supabase.storage.from('plates').createSignedUrl(path, 3600);
  return data?.signedUrl ? { path, signedUrl: data.signedUrl } : null;
}

export async function signedUrlFor(path: string): Promise<string | null> {
  if (!supabase || path.startsWith('/') || path.startsWith('http')) return path;
  const { data } = await supabase.storage.from('plates').createSignedUrl(path, 3600);
  return data?.signedUrl ?? null;
}

// ---------- Auth (OPTIONAL layer — guest flow never needs this) ----------
export type { User };

export async function signUp(email: string, password: string) {
  if (!supabase) return { error: 'offline' as const };
  const { data, error } = await supabase.auth.signUp({ email, password });
  return { data, error: error?.message ?? null, needsConfirm: !error && !data.session };
}
export async function signIn(email: string, password: string) {
  if (!supabase) return { error: 'offline' as const };
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error: error?.message ?? null };
}
export async function signInGoogle() {
  if (!supabase) return { error: 'offline' as const };
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin },
  });
  return { error: error?.message ?? null };
}
export async function signOut() {
  try { await supabase?.auth.signOut(); } catch { /* ignore */ }
}
export function onAuthChange(cb: (user: User | null) => void): () => void {
  if (!supabase) { cb(null); return () => {}; }
  supabase.auth.getSession().then(({ data }) => cb(data.session?.user ?? null)).catch(() => cb(null));
  const { data } = supabase.auth.onAuthStateChange((_e, session) => cb(session?.user ?? null));
  return () => data.subscription.unsubscribe();
}
