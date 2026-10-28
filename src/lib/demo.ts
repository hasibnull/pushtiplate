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
  },
  good: {
    photoUrl: '/samples/good.webp',
    ageMonths: 14,
    groups: ['grains', 'legumes', 'eggs', 'vit_a_fruits_veg', 'other_fruits_veg', 'dairy'],
    source: 'demo',
    tomorrowUrl: null,
    photoDescription: 'rice, dal, egg, spinach, banana, milk',
  },
  low: {
    photoUrl: '/samples/low.webp',
    ageMonths: 14,
    groups: ['grains'],
    source: 'demo',
    tomorrowUrl: '/samples/low-tomorrow.webp',
    photoDescription: 'rice, potato',
  },
};
