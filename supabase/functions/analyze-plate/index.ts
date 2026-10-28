// analyze-plate — Muse Spark vision → strict JSON. Holds META_API_KEY server-side (§5.2).
// Deploy: Supabase → Edge Functions → Create function "analyze-plate" → paste → Deploy
const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM = `You are a food-identification engine for a child-nutrition app. You receive a photo
of a young child's meal plate from Bangladesh. Identify the foods you can actually
see. Map every food to exactly one of these 8 group ids:
breast_milk, grains, legumes, dairy, flesh, eggs, vit_a_fruits_veg, other_fruits_veg.
Rules: output ONLY the JSON object, no prose, no markdown fences. Never give advice,
health claims, calories, or quantities. If you are unsure a food is present, leave it
out. Mixed dishes (e.g. khichuri) count for each group clearly present in them.
Bangladesh mapping rules: plain potato, rice, roti, suji = grains. Orange sweet
potato, pumpkin, carrot, ripe mango, ripe papaya, dark leafy greens (shak) =
vit_a_fruits_veg. Banana, guava, cucumber, gourd = other_fruits_veg. A food counts
once, in its most specific group.`;

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const json = (body: unknown) =>
    new Response(JSON.stringify(body), {
      headers: { ...cors, 'Content-Type': 'application/json' },
    });
  try {
    const { photoUrl, voiceFoods } = await req.json();
    const key = Deno.env.get('META_API_KEY');
    const base = Deno.env.get('META_BASE_URL') ?? 'https://api.meta.ai/v1';
    if (!key || !photoUrl) return json({ error: 'upstream', fallback: true });

    const res = await fetch(`${base}/chat/completions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'muse-spark-1.3',
        messages: [
          { role: 'system', content: SYSTEM },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Output ONLY JSON of shape {"foods":[{"name":"...","group":"..."}],"groups_present":["..."],"confidence":"high|medium|low"}',
              },
              { type: 'image_url', image_url: { url: photoUrl } },
            ],
          },
        ],
      }),
    });
    if (!res.ok) return json({ error: 'upstream', fallback: true });
    const data = await res.json();
    const content: string = data?.choices?.[0]?.message?.content ?? '';
    const parsed = JSON.parse(content.replace(/```json|```/g, '').trim());

    // Merge voice-added groups (§5.2)
    if (Array.isArray(voiceFoods) && voiceFoods.length) {
      const set = new Set<string>(parsed.groups_present ?? []);
      voiceFoods.forEach((g: string) => set.add(g));
      parsed.groups_present = [...set];
    }
    return json(parsed);
  } catch {
    return json({ error: 'upstream', fallback: true });
  }
});
