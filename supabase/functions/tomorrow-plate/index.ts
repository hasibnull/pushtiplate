// tomorrow-plate — Muse Image: same plate + one added food. Cached (§11 Round 10).
// Deploy: Supabase → Edge Functions → Create function "tomorrow-plate" → paste → Deploy
import { createClient } from 'jsr:@supabase/supabase-js@2';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FOOD_PHRASE: Record<string, string> = {
  eggs: 'one boiled egg',
  legumes: 'a small bowl of lentil dal',
  flesh: 'a small fried fish',
  vit_a_fruits_veg: 'orange sweet potato pieces',
  dairy: 'a small glass of milk',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const json = (body: unknown) =>
    new Response(JSON.stringify(body), {
      headers: { ...cors, 'Content-Type': 'application/json' },
    });
  try {
    const { photoDescription, foodToAdd } = await req.json();
    const phrase = FOOD_PHRASE[foodToAdd];
    if (!phrase) return json({ fallback: true });

    const cacheKey = `${(photoDescription ?? '').toLowerCase().trim()}|${foodToAdd}`;
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
    const { data: hit } = await supabase
      .from('tomorrow_cache')
      .select('image_url')
      .eq('cache_key', cacheKey)
      .maybeSingle();
    if (hit?.image_url) return json({ imageUrl: hit.image_url, cached: true });

    const key = Deno.env.get('META_API_KEY');
    const base = Deno.env.get('META_BASE_URL') ?? 'https://api.meta.ai/v1';
    if (!key) return json({ fallback: true });

    const res = await fetch(`${base}/images/generations`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'muse-image-1.0',
        prompt: `Overhead photo of a simple Bangladeshi child's meal on a small steel plate: ${photoDescription} plus ${phrase}. Plain background, warm natural light, realistic, no people, no text.`,
      }),
    });
    if (!res.ok) return json({ fallback: true });
    const data = await res.json();
    const item = data?.data?.[0] ?? {};
    const imageUrl: string | undefined =
      item.url ?? (item.b64_json ? `data:image/png;base64,${item.b64_json}` : undefined);
    if (!imageUrl) return json({ fallback: true });

    await supabase.from('tomorrow_cache').insert({ cache_key: cacheKey, image_url: imageUrl });
    return json({ imageUrl });
  } catch {
    return json({ fallback: true });
  }
});
