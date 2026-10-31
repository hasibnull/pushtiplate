import { supabase } from './supabase';
import { validateSparkJson, PRIORITY } from './scoring';

async function invoke<T>(name: string, body: Record<string, unknown>): Promise<T | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.functions.invoke(name, { body });
    if (error) return null;
    return data as T;
  } catch {
    return null;
  }
}

export interface AnalysisResult {
  groups: string[];
  foods: { name: string; group: string }[];
}

/** Call analyze-plate once; caller retries/validates (§5.3). Returns groups+foods or null. */
export async function analyzePlate(
  photoUrl: string,
  ageMonths: number,
  voiceFoods?: string[],
): Promise<AnalysisResult | null> {
  const data = await invoke<Record<string, unknown>>('analyze-plate', {
    photoUrl,
    ageMonths,
    voiceFoods: voiceFoods ?? [],
  });
  if (!data || (data as { fallback?: boolean }).fallback) return null;
  const groups = validateSparkJson(data);
  if (!groups) return null;
  const foods = Array.isArray(data.foods)
    ? (data.foods as { name?: unknown; group?: unknown }[])
        .filter((f) => typeof f?.name === 'string' && typeof f?.group === 'string')
        .map((f) => ({ name: f.name as string, group: f.group as string }))
    : [];
  return { groups, foods };
}

export async function tomorrowPlate(
  photoDescription: string,
  foodToAddGroup: string,
): Promise<string | null> {
  const data = await invoke<{ imageUrl?: string; fallback?: boolean }>('tomorrow-plate', {
    photoDescription,
    foodToAdd: foodToAddGroup,
  });
  if (!data || data.fallback || !data.imageUrl) {
    // Fallback illustration for that food — never a broken image (§3.3 Screen 4)
    const known = PRIORITY.some((p) => p.group === foodToAddGroup);
    return known ? `/fallback-plates/${foodToAddGroup}.webp` : null;
  }
  return data.imageUrl;
}

/** Downscale to max 1024px wide, JPEG 0.8 (§1.2 step 1). */
export function downscale(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, 1024 / img.width);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('no canvas'));
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error('encode failed'))),
        'image/jpeg',
        0.8,
      );
    };
    img.onerror = reject;
    img.src = url;
  });
}
