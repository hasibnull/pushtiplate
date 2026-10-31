import type { PlateState } from './store';

// Cached demo data (§5.5) — full flow with no network.
export const SAMPLES: Record<'hero' | 'good' | 'low', PlateState> = {
  hero: {
    photoUrl: '/samples/hero.webp',
    ageMonths: 14,
    groups: ['grains', 'legumes'],
    source: 'demo',
    tomorrowUrl: '/samples/hero-tomorrow.webp',
    photoDescription: 'rice, potato, dal',
    foods: [
      { name: 'rice', group: 'grains' },
      { name: 'potato', group: 'grains' },
      { name: 'dal', group: 'legumes' },
    ],
  },
  good: {
    photoUrl: '/samples/good.webp',
    ageMonths: 14,
    groups: ['grains', 'legumes', 'eggs', 'vit_a_fruits_veg', 'other_fruits_veg', 'dairy'],
    source: 'demo',
    tomorrowUrl: null,
    photoDescription: 'rice, dal, egg, spinach, banana, milk',
    foods: [
      { name: 'rice', group: 'grains' },
      { name: 'dal', group: 'legumes' },
      { name: 'egg', group: 'eggs' },
      { name: 'spinach', group: 'vit_a_fruits_veg' },
      { name: 'banana', group: 'other_fruits_veg' },
      { name: 'milk', group: 'dairy' },
    ],
  },
  low: {
    photoUrl: '/samples/low.webp',
    ageMonths: 14,
    groups: ['grains'],
    source: 'demo',
    tomorrowUrl: '/samples/low-tomorrow.webp',
    photoDescription: 'rice, potato',
    foods: [
      { name: 'rice', group: 'grains' },
      { name: 'potato', group: 'grains' },
    ],
  },
};
