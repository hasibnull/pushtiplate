// Scoring engine — pure code, NO AI, NO network. The AI only looks; this decides.
// Rule: WHO/UNICEF dietary diversity for 6–23 months — at least 5 of 8 food groups.

export const GROUP_IDS = [
  'breast_milk',
  'grains',
  'legumes',
  'dairy',
  'flesh',
  'eggs',
  'vit_a_fruits_veg',
  'other_fruits_veg',
] as const;

export type GroupId = (typeof GROUP_IDS)[number];
export type Verdict = 'good' | 'add_food' | 'see_worker';

export interface FoodGroup {
  id: GroupId;
  label: string;
  icon: string;
}

export const FOOD_GROUPS: FoodGroup[] = [
  { id: 'breast_milk', label: 'মায়ের দুধ', icon: '🤱' },
  { id: 'grains', label: 'ভাত / রুটি', icon: '🍚' },
  { id: 'legumes', label: 'ডাল / বাদাম', icon: '🫘' },
  { id: 'dairy', label: 'দুধ / দই', icon: '🥛' },
  { id: 'flesh', label: 'মাছ / মাংস', icon: '🐟' },
  { id: 'eggs', label: 'ডিম', icon: '🥚' },
  { id: 'vit_a_fruits_veg', label: 'কমলা শাকসবজি ও ফল', icon: '🥭' },
  { id: 'other_fruits_veg', label: 'অন্য ফল ও সবজি', icon: '🍌' },
];

export interface PriorityFood {
  group: GroupId;
  bangla: string;
  englishPhrase: string;
  icon: string;
}

// Fixed, affordability-ordered. Never let the AI reorder this.
export const PRIORITY: PriorityFood[] = [
  { group: 'eggs', bangla: 'ডিম', englishPhrase: 'one boiled egg', icon: '🥚' },
  { group: 'legumes', bangla: 'ডাল', englishPhrase: 'a small bowl of lentil dal', icon: '🫘' },
  { group: 'flesh', bangla: 'ছোট মাছ', englishPhrase: 'a small fried fish', icon: '🐟' },
  { group: 'vit_a_fruits_veg', bangla: 'মিষ্টি আলু / পেঁপে', englishPhrase: 'orange sweet potato pieces', icon: '🍠' },
  { group: 'dairy', bangla: 'দুধ', englishPhrase: 'a small glass of milk', icon: '🥛' },
];

export interface ScoreResult {
  score: number;
  verdict: Verdict;
  foodToAdd: PriorityFood | null;
}

export function scorePlate(groupsPresent: string[]): ScoreResult {
  const present = new Set(groupsPresent.filter((g) => (GROUP_IDS as readonly string[]).includes(g)));
  const score = present.size;
  let verdict: Verdict;
  if (score >= 5) verdict = 'good';
  else if (score <= 2) verdict = 'see_worker';
  else verdict = 'add_food';
  const foodToAdd =
    verdict === 'good' ? null : (PRIORITY.find((p) => !present.has(p.group)) ?? null);
  return { score, verdict, foodToAdd };
}

const ALLOWED_KEYS = new Set(['foods', 'groups_present', 'confidence']);

/** Validate Muse Spark JSON. Returns cleaned unique group ids, or null if invalid. */
export function validateSparkJson(data: unknown): string[] | null {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return null;
  const obj = data as Record<string, unknown>;
  if (Object.keys(obj).some((k) => !ALLOWED_KEYS.has(k))) return null;
  if (!Array.isArray(obj.foods)) return null;
  const groups = new Set<string>();
  for (const item of obj.foods) {
    if (!item || typeof item !== 'object') return null;
    const group = (item as Record<string, unknown>).group;
    if (typeof group !== 'string' || !(GROUP_IDS as readonly string[]).includes(group)) return null;
    groups.add(group); // recompute groups_present from foods — never trust it
  }
  return [...groups];
}

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
export function toBangla(n: number | string): string {
  return String(n).replace(/\d/g, (d) => BN_DIGITS[Number(d)]);
}
