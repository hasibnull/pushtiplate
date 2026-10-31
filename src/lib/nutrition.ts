// Calories from STATIC data only (§Phase 3). AI names a food → code matches it to
// the library dataset → sums that food's static kcal/protein. No match = not counted.
import { foodById } from './library';

export interface FoundFood { name: string; group: string }

const ALIASES: Record<string, string> = {
  rice: 'rice', khichuri: 'rice', suji: 'suji', oats: 'suji', porridge: 'suji', potato: 'potato',
  dal: 'dal', lentil: 'dal', lentils: 'dal',
  egg: 'egg', eggs: 'egg',
  fish: 'small-fish', 'small fish': 'small-fish', chicken: 'chicken', meat: 'chicken',
  spinach: 'shak', shak: 'shak', 'leafy greens': 'shak', greens: 'shak',
  pumpkin: 'pumpkin', banana: 'banana', papaya: 'papaya', mango: 'mango',
  yogurt: 'yogurt', yoghurt: 'yogurt', doi: 'yogurt', milk: 'milk',
  chickpea: 'chickpea', chickpeas: 'chickpea', peanut: 'peanut', peanuts: 'peanut',
  'sweet potato': 'sweet-potato', guava: 'guava',
};

export function matchFoodId(name: string): string | null {
  const n = name.toLowerCase().trim();
  if (ALIASES[n]) return ALIASES[n];
  for (const key of Object.keys(ALIASES)) if (n.includes(key)) return ALIASES[key];
  return null;
}

export function plateNutrition(foods: FoundFood[]): { kcal: number; proteinG: number; matchedIds: string[] } {
  const ids = new Set<string>();
  for (const f of foods) {
    const id = matchFoodId(f.name);
    if (id) ids.add(id);
  }
  let kcal = 0, proteinG = 0;
  for (const id of ids) {
    const food = foodById(id);
    if (food) { kcal += food.kcal; proteinG += food.proteinG; }
  }
  return { kcal, proteinG, matchedIds: [...ids] };
}

/** WHO complementary-food energy guidance (kcal/day from food) by age in months. */
export function calorieTarget(ageMonths: number): number {
  if (ageMonths <= 8) return 200;
  if (ageMonths <= 11) return 300;
  return 550;
}
