// Food Library — static data only, NO API calls. General nutrition info, not medical advice.
import type { GroupId } from './scoring';

export interface LibraryFood {
  id: string;
  bangla: string;
  english: string;
  group: GroupId;
  /** One Bangla line: why it is good, nutrients in plain words */
  why: string;
  /** Approximate protein per normal serving (labelled আনুমানিক in UI) */
  proteinApprox: string;
  serving: string;
  startAge: string;
  image: string | null; // null = icon tile (breast milk — no photo by design)
}

const img = (id: string) => `/library/${id}.webp`;

export const LIBRARY_FOODS: LibraryFood[] = [
  { id: 'breast-milk', bangla: 'মায়ের দুধ', english: 'Breast milk', group: 'breast_milk', why: 'শিশুর প্রথম ও সেরা খাবার; রোগ থেকে বাঁচতে সাহায্য করে।', proteinApprox: '১ গ্রাম', serving: '১০০ মিলি', startAge: 'জন্ম থেকে', image: null },
  { id: 'egg', bangla: 'ডিম', english: 'Egg', group: 'eggs', why: 'প্রোটিনে ভরপুর; মস্তিষ্ক ও শরীর বাড়তে সাহায্য করে।', proteinApprox: '৬ গ্রাম', serving: '১টি ডিম', startAge: '৬ মাস থেকে', image: img('egg') },
  { id: 'dal', bangla: 'ডাল', english: 'Lentil dal', group: 'legumes', why: 'প্রোটিন ও আয়রন দেয়; রক্ত বাড়তে সাহায্য করে।', proteinApprox: '৮ গ্রাম', serving: 'আধা কাপ রান্না ডাল', startAge: '৬ মাস থেকে', image: img('dal') },
  { id: 'small-fish', bangla: 'ছোট মাছ', english: 'Small fish', group: 'flesh', why: 'কাঁটাসহ খেলে ক্যালসিয়াম ও আয়রন পাওয়া যায়।', proteinApprox: '৫ গ্রাম', serving: '৩০ গ্রাম মাছ', startAge: '৬ মাস থেকে', image: img('small-fish') },
  { id: 'chicken', bangla: 'মুরগির মাংস', english: 'Chicken', group: 'flesh', why: 'প্রোটিন ও আয়রন দেয়; পেশি বাড়তে সাহায্য করে।', proteinApprox: '৭ গ্রাম', serving: '৩০ গ্রাম মাংস', startAge: '৬ মাস থেকে', image: img('chicken') },
  { id: 'rice', bangla: 'ভাত', english: 'Rice', group: 'grains', why: 'শক্তি দেয়; পেট ভরাতে সাহায্য করে।', proteinApprox: '২ গ্রাম', serving: 'আধা কাপ ভাত', startAge: '৬ মাস থেকে', image: img('rice') },
  { id: 'shak', bangla: 'শাক', english: 'Leafy greens (shak)', group: 'vit_a_fruits_veg', why: 'ভিটামিন এ ও আয়রন দেয়; চোখ ভালো রাখে।', proteinApprox: '১ গ্রাম', serving: 'আধা কাপ রান্না শাক', startAge: '৬ মাস থেকে', image: img('shak') },
  { id: 'pumpkin', bangla: 'মিষ্টি কুমড়া', english: 'Pumpkin', group: 'vit_a_fruits_veg', why: 'ভিটামিন এ দেয়; চোখ ও ত্বক ভালো রাখে।', proteinApprox: '১ গ্রাম', serving: 'আধা কাপ কুমড়া', startAge: '৬ মাস থেকে', image: img('pumpkin') },
  { id: 'banana', bangla: 'কলা', english: 'Banana', group: 'other_fruits_veg', why: 'শক্তি দেয়; সহজে হজম হয়।', proteinApprox: '১ গ্রাম', serving: '১টি কলা', startAge: '৬ মাস থেকে', image: img('banana') },
  { id: 'papaya', bangla: 'পাকা পেঁপে', english: 'Ripe papaya', group: 'vit_a_fruits_veg', why: 'ভিটামিন এ দেয়; হজমে সাহায্য করে।', proteinApprox: '১ গ্রাম', serving: 'আধা কাপ পেঁপে', startAge: '৬ মাস থেকে', image: img('papaya') },
  { id: 'mango', bangla: 'পাকা আম', english: 'Ripe mango', group: 'vit_a_fruits_veg', why: 'ভিটামিন এ দেয়; চোখ ভালো রাখে।', proteinApprox: '১ গ্রাম', serving: 'আধা কাপ আম', startAge: '৬ মাস থেকে', image: img('mango') },
  { id: 'yogurt', bangla: 'দই', english: 'Yogurt', group: 'dairy', why: 'ক্যালসিয়াম দেয়; হাড় ও দাঁত মজবুত করে।', proteinApprox: '৪ গ্রাম', serving: '১০০ গ্রাম দই', startAge: '৬ মাস থেকে', image: img('yogurt') },
  { id: 'milk', bangla: 'দুধ', english: 'Milk', group: 'dairy', why: 'ক্যালসিয়াম ও প্রোটিন দেয়; হাড় বাড়তে সাহায্য করে।', proteinApprox: '৩ গ্রাম', serving: '১০০ মিলি দুধ', startAge: '১২ মাস থেকে', image: img('milk') },
  { id: 'potato', bangla: 'আলু', english: 'Potato', group: 'grains', why: 'শক্তি দেয়; ওজন বাড়তে সাহায্য করে।', proteinApprox: '২ গ্রাম', serving: '১টি মাঝারি আলু', startAge: '৬ মাস থেকে', image: img('potato') },
  { id: 'chickpea', bangla: 'ছোলা', english: 'Chickpea', group: 'legumes', why: 'প্রোটিন ও আয়রন দেয়; শক্তি বাড়ায়।', proteinApprox: '৭ গ্রাম', serving: 'আধা কাপ রান্না ছোলা', startAge: '৮ মাস থেকে', image: img('chickpea') },
  { id: 'peanut', bangla: 'বাদাম বাটা', english: 'Peanut paste', group: 'legumes', why: 'প্রোটিন ও ভালো চর্বি দেয়; শক্তি বাড়ায়।', proteinApprox: '৪ গ্রাম', serving: '১ চামচ বাটা', startAge: '৬ মাস থেকে', image: img('peanut') },
  { id: 'sweet-potato', bangla: 'মিষ্টি আলু', english: 'Orange sweet potato', group: 'vit_a_fruits_veg', why: 'ভিটামিন এ দেয়; চোখ ভালো রাখে।', proteinApprox: '২ গ্রাম', serving: '১টি মিষ্টি আলু', startAge: '৬ মাস থেকে', image: img('sweet-potato') },
  { id: 'guava', bangla: 'পেয়ারা', english: 'Guava', group: 'other_fruits_veg', why: 'ভিটামিন সি দেয়; রোগ থেকে বাঁচতে সাহায্য করে।', proteinApprox: '২ গ্রাম', serving: 'আধা পেয়ারা', startAge: '৮ মাস থেকে', image: img('guava') },
  { id: 'suji', bangla: 'সুজি', english: 'Suji / oats porridge', group: 'grains', why: 'শক্তি দেয়; নরম বলে খাওয়া সহজ।', proteinApprox: '৩ গ্রাম', serving: 'আধা কাপ সুজি', startAge: '৬ মাস থেকে', image: img('suji') },
];
