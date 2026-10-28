import { createClient, type SupabaseClient } from '@supabase/supabase-js';

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

export async function saveAudit(audit: AuditInput): Promise<void> {
  if (!supabase) return; // result screen must still work if saving fails
  try {
    await supabase.from('audits').insert(audit);
  } catch {
    /* silent by design (§6 Prompt 4) */
  }
}

export interface AuditRow extends AuditInput {
  id: string;
  created_at: string;
}

export async function fetchAudits(): Promise<AuditRow[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('audits')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) return [];
  return (data ?? []) as AuditRow[];
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
