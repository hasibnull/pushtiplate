// Food Library + static nutrition — NO API calls. The AI never invents numbers:
// calories/protein come only from this table, summed in code (lib/nutrition.ts).
import type { GroupId } from './scoring';
import type { Lang } from './i18n';

export interface LibraryFood {
  id: string;
  group: GroupId;
  image: string | null; // null = icon tile (breast milk — no photo by design)
  /** Approximate kcal per typical baby serving (static, labelled approximate) */
  kcal: number;
  /** Approximate protein grams per serving */
  proteinG: number;
  startMonths: number;
  name: Record<Lang, string>;
  why: Record<Lang, string>;
  serving: Record<Lang, string>;
}

const img = (id: string) => `/library/${id}.webp`;
type L3 = Record<Lang, string>;
const F = (id: string, group: GroupId, kcal: number, proteinG: number, startMonths: number,
  name: L3, why: L3, serving: L3, image: string | null = img(id)): LibraryFood =>
  ({ id, group, kcal, proteinG, startMonths, name, why, serving, image });

export const LIBRARY_FOODS: LibraryFood[] = [
  F('breast-milk', 'breast_milk', 70, 1, 0,
    { bn: 'মায়ের দুধ', en: 'Breast milk', hi: 'माँ का दूध' },
    { bn: 'শিশুর প্রথম ও সেরা খাবার; রোগ থেকে বাঁচতে সাহায্য করে।', en: "The baby's first and best food; helps protect from illness.", hi: 'बच्चे का पहला और सबसे अच्छा खाना; बीमारी से बचाता है।' },
    { bn: '১০০ মিলি', en: '100 ml', hi: '१०० मिली' }, null),
  F('egg', 'eggs', 70, 6, 6,
    { bn: 'ডিম', en: 'Egg', hi: 'अंडा' },
    { bn: 'প্রোটিনে ভরপুর; মস্তিষ্ক ও শরীর বাড়তে সাহায্য করে।', en: 'Full of protein; helps the brain and body grow.', hi: 'प्रोटीन से भरपूर; दिमाग और शरीर बढ़ने में मदद करता है।' },
    { bn: '১টি ডিম', en: '1 egg', hi: '१ अंडा' }),
  F('dal', 'legumes', 110, 8, 6,
    { bn: 'ডাল', en: 'Lentil dal', hi: 'दाल' },
    { bn: 'প্রোটিন ও আয়রন দেয়; রক্ত বাড়তে সাহায্য করে।', en: 'Gives protein and iron; helps make blood.', hi: 'प्रोटीन और आयरन देता है; खून बढ़ने में मदद करता है।' },
    { bn: 'আধা কাপ রান্না ডাল', en: '½ cup cooked dal', hi: 'आधा कप पकी दाल' }),
  F('small-fish', 'flesh', 60, 5, 6,
    { bn: 'ছোট মাছ', en: 'Small fish', hi: 'छोटी मछली' },
    { bn: 'কাঁটাসহ খেলে ক্যালসিয়াম ও আয়রন পাওয়া যায়।', en: 'Eaten with bones, it gives calcium and iron.', hi: 'हड्डी समेत खाने से कैल्शियम और आयरन मिलता है।' },
    { bn: '৩০ গ্রাম মাছ', en: '30 g fish', hi: '३० ग्राम मछली' }),
  F('chicken', 'flesh', 55, 7, 6,
    { bn: 'মুরগির মাংস', en: 'Chicken', hi: 'मुर्गी का मांस' },
    { bn: 'প্রোটিন ও আয়রন দেয়; পেশি বাড়তে সাহায্য করে।', en: 'Gives protein and iron; helps muscles grow.', hi: 'प्रोटीन और आयरन देता है; मांसपेशियाँ बढ़ने में मदद करता है।' },
    { bn: '৩০ গ্রাম মাংস', en: '30 g chicken', hi: '३० ग्राम मांस' }),
  F('rice', 'grains', 100, 2, 6,
    { bn: 'ভাত', en: 'Rice', hi: 'चावल' },
    { bn: 'শক্তি দেয়; পেট ভরাতে সাহায্য করে।', en: 'Gives energy; helps fill the tummy.', hi: 'ऊर्जा देता है; पेट भरने में मदद करता है।' },
    { bn: 'আধা কাপ ভাত', en: '½ cup rice', hi: 'आधा कप चावल' }),
  F('shak', 'vit_a_fruits_veg', 20, 1, 6,
    { bn: 'শাক', en: 'Leafy greens (shak)', hi: 'साग' },
    { bn: 'ভিটামিন এ ও আয়রন দেয়; চোখ ভালো রাখে।', en: 'Gives vitamin A and iron; keeps eyes healthy.', hi: 'विटामिन ए और आयरन देता है; आँखें अच्छी रखता है।' },
    { bn: 'আধা কাপ রান্না শাক', en: '½ cup cooked greens', hi: 'आधा कप पका साग' }),
  F('pumpkin', 'vit_a_fruits_veg', 30, 1, 6,
    { bn: 'মিষ্টি কুমড়া', en: 'Pumpkin', hi: 'कद्दू' },
    { bn: 'ভিটামিন এ দেয়; চোখ ও ত্বক ভালো রাখে।', en: 'Gives vitamin A; keeps eyes and skin healthy.', hi: 'विटामिन ए देता है; आँखें और त्वचा अच्छी रखता है।' },
    { bn: 'আধা কাপ কুমড়া', en: '½ cup pumpkin', hi: 'आधा कप कद्दू' }),
  F('banana', 'other_fruits_veg', 90, 1, 6,
    { bn: 'কলা', en: 'Banana', hi: 'केला' },
    { bn: 'শক্তি দেয়; সহজে হজম হয়।', en: 'Gives energy; easy to digest.', hi: 'ऊर्जा देता है; आसानी से पचता है।' },
    { bn: '১টি কলা', en: '1 banana', hi: '१ केला' }),
  F('papaya', 'vit_a_fruits_veg', 55, 1, 6,
    { bn: 'পাকা পেঁপে', en: 'Ripe papaya', hi: 'पका पपीता' },
    { bn: 'ভিটামিন এ দেয়; হজমে সাহায্য করে।', en: 'Gives vitamin A; helps digestion.', hi: 'विटामिन ए देता है; पाचन में मदद करता है।' },
    { bn: 'আধা কাপ পেঁপে', en: '½ cup papaya', hi: 'आधा कप पपीता' }),
  F('mango', 'vit_a_fruits_veg', 60, 1, 6,
    { bn: 'পাকা আম', en: 'Ripe mango', hi: 'पका आम' },
    { bn: 'ভিটামিন এ দেয়; চোখ ভালো রাখে।', en: 'Gives vitamin A; keeps eyes healthy.', hi: 'विटामिन ए देता है; आँखें अच्छी रखता है।' },
    { bn: 'আধা কাপ আম', en: '½ cup mango', hi: 'आधा कप आम' }),
  F('yogurt', 'dairy', 65, 4, 6,
    { bn: 'দই', en: 'Yogurt', hi: 'दही' },
    { bn: 'ক্যালসিয়াম দেয়; হাড় ও দাঁত মজবুত করে।', en: 'Gives calcium; makes bones and teeth strong.', hi: 'कैल्शियम देता है; हड्डियाँ और दाँत मजबूत करता है।' },
    { bn: '১০০ গ্রাম দই', en: '100 g yogurt', hi: '१०० ग्राम दही' }),
  F('milk', 'dairy', 65, 3, 12,
    { bn: 'দুধ', en: 'Milk', hi: 'दूध' },
    { bn: 'ক্যালসিয়াম ও প্রোটিন দেয়; হাড় বাড়তে সাহায্য করে।', en: 'Gives calcium and protein; helps bones grow.', hi: 'कैल्शियम और प्रोटीन देता है; हड्डियाँ बढ़ने में मदद करता है।' },
    { bn: '১০০ মিলি দুধ', en: '100 ml milk', hi: '१०० मिली दूध' }),
  F('potato', 'grains', 80, 2, 6,
    { bn: 'আলু', en: 'Potato', hi: 'आलू' },
    { bn: 'শক্তি দেয়; ওজন বাড়তে সাহায্য করে।', en: 'Gives energy; helps weight gain.', hi: 'ऊर्जा देता है; वजन बढ़ने में मदद करता है।' },
    { bn: '১টি মাঝারি আলু', en: '1 medium potato', hi: '१ मध्यम आलू' }),
  F('chickpea', 'legumes', 130, 7, 8,
    { bn: 'ছোলা', en: 'Chickpea', hi: 'चना' },
    { bn: 'প্রোটিন ও আয়রন দেয়; শক্তি বাড়ায়।', en: 'Gives protein and iron; adds energy.', hi: 'प्रोटीन और आयरन देता है; ऊर्जा बढ़ाता है।' },
    { bn: 'আধা কাপ রান্না ছোলা', en: '½ cup cooked chickpea', hi: 'आधा कप पका चना' }),
  F('peanut', 'legumes', 95, 4, 6,
    { bn: 'বাদাম বাটা', en: 'Peanut paste', hi: 'मूंगफली का पेस्ट' },
    { bn: 'প্রোটিন ও ভালো চর্বি দেয়; শক্তি বাড়ায়।', en: 'Gives protein and good fat; adds energy.', hi: 'प्रोटीन और अच्छी चर्बी देता है; ऊर्जा बढ़ाता है।' },
    { bn: '১ চামচ বাটা', en: '1 spoon paste', hi: '१ चम्मच पेस्ट' }),
  F('sweet-potato', 'vit_a_fruits_veg', 90, 2, 6,
    { bn: 'মিষ্টি আলু', en: 'Orange sweet potato', hi: 'शकरकंद' },
    { bn: 'ভিটামিন এ দেয়; চোখ ভালো রাখে।', en: 'Gives vitamin A; keeps eyes healthy.', hi: 'विटामिन ए देता है; आँखें अच्छी रखता है।' },
    { bn: '১টি মিষ্টি আলু', en: '1 sweet potato', hi: '१ शकरकंद' }),
  F('guava', 'other_fruits_veg', 35, 2, 8,
    { bn: 'পেয়ারা', en: 'Guava', hi: 'अमरूद' },
    { bn: 'ভিটামিন সি দেয়; রোগ থেকে বাঁচতে সাহায্য করে।', en: 'Gives vitamin C; helps protect from illness.', hi: 'विटामिन सी देता है; बीमारी से बचाता है।' },
    { bn: 'আধা পেয়ারা', en: '½ guava', hi: 'आधा अमरूद' }),
  F('suji', 'grains', 110, 3, 6,
    { bn: 'সুজি', en: 'Suji / oats porridge', hi: 'सूजी' },
    { bn: 'শক্তি দেয়; নরম বলে খাওয়া সহজ।', en: 'Gives energy; soft and easy to eat.', hi: 'ऊर्जा देता है; नरम होने से खाना आसान है।' },
    { bn: 'আধা কাপ সুজি', en: '½ cup porridge', hi: 'आधा कप सूजी' }),
];

export const foodById = (id: string) => LIBRARY_FOODS.find((f) => f.id === id);

/** Localized names of the 8 scoring groups (Result tiles, filters, details). */
export const GROUP_LABEL: Record<string, Record<Lang, string>> = {
  breast_milk: { bn: 'মায়ের দুধ', en: 'Breast milk', hi: 'माँ का दूध' },
  grains: { bn: 'ভাত / রুটি', en: 'Rice / bread', hi: 'चावल / रोटी' },
  legumes: { bn: 'ডাল / বাদাম', en: 'Dal / nuts', hi: 'दाल / मेवे' },
  dairy: { bn: 'দুধ / দই', en: 'Milk / yogurt', hi: 'दूध / दही' },
  flesh: { bn: 'মাছ / মাংস', en: 'Fish / meat', hi: 'मछली / मांस' },
  eggs: { bn: 'ডিম', en: 'Egg', hi: 'अंडा' },
  vit_a_fruits_veg: { bn: 'কমলা শাকসবজি ও ফল', en: 'Orange veg & fruit', hi: 'नारंगी सब्ज़ी और फल' },
  other_fruits_veg: { bn: 'অন্য ফল ও সবজি', en: 'Other fruit & veg', hi: 'अन्य फल और सब्ज़ी' },
};

/** What each group does for the child — very simple language (Details section). */
export const GROUP_BENEFIT: Record<string, Record<Lang, string>> = {
  breast_milk: { bn: 'রোগ থেকে বাঁচায়, সহজে হজম হয়।', en: 'Protects from illness, easy to digest.', hi: 'बीमारी से बचाता है, आसानी से पचता है।' },
  grains: { bn: 'খেলার ও বাড়ার শক্তি দেয়।', en: 'Gives energy to play and grow.', hi: 'खेलने और बढ़ने की ऊर्जा देता है।' },
  legumes: { bn: 'শরীর গড়ে, রক্ত বাড়ায়।', en: 'Builds the body and blood.', hi: 'शरीर बनाता है, खून बढ़ाता है।' },
  dairy: { bn: 'হাড় ও দাঁত মজবুত করে।', en: 'Makes bones and teeth strong.', hi: 'हड्डियाँ और दाँत मजबूत करता है।' },
  flesh: { bn: 'পেশি ও রক্ত বাড়ায়।', en: 'Grows muscles and blood.', hi: 'मांसपेशियाँ और खून बढ़ाता है।' },
  eggs: { bn: 'মস্তিষ্ক ও শরীর বাড়ায়।', en: 'Grows the brain and body.', hi: 'दिमाग और शरीर बढ़ाता है।' },
  vit_a_fruits_veg: { bn: 'চোখ ভালো রাখে, রোগ ঠেকায়।', en: 'Keeps eyes healthy, fights illness.', hi: 'आँखें अच्छी रखता है, बीमारी रोकता है।' },
  other_fruits_veg: { bn: 'হজম ভালো করে, শরীর সতেজ রাখে।', en: 'Helps digestion, keeps the body fresh.', hi: 'पाचन अच्छा करता है, शरीर ताज़ा रखता है।' },
};

/** Home-measure portion for each group ("আর কতটুকু লাগবে"). */
export const GROUP_PORTION: Record<string, Record<Lang, string>> = {
  breast_milk: { bn: 'মায়ের দুধ খাওয়ানো চালিয়ে যান', en: 'keep breastfeeding', hi: 'माँ का दूध जारी रखें' },
  grains: { bn: 'আধা কাপ নরম ভাত', en: '½ cup soft rice', hi: 'आधा कप नरम चावल' },
  legumes: { bn: 'আধা কাপ ডাল', en: '½ cup dal', hi: 'आधा कप दाल' },
  dairy: { bn: 'আধা গ্লাস দুধ বা দই', en: '½ glass milk or yogurt', hi: 'आधा गिलास दूध या दही' },
  flesh: { bn: '২–৩ টুকরো ছোট মাছ', en: '2–3 pieces of small fish', hi: 'छोटी मछली के २–३ टुकड़े' },
  eggs: { bn: '১টা ডিম', en: '1 egg', hi: '१ अंडा' },
  vit_a_fruits_veg: { bn: 'আধা কাপ মিষ্টি আলু বা পাকা পেঁপে', en: '½ cup sweet potato or ripe papaya', hi: 'आधा कप शकरकंद या पका पपीता' },
  other_fruits_veg: { bn: '১টা কলা বা আধা পেয়ারা', en: '1 banana or ½ guava', hi: '१ केला या आधा अमरूद' },
};

/** Age-band feeding guidance cards (Library top, Phase 4). */
export const AGE_GUIDANCE: { months: string; meals: Record<Lang, string>; key: Record<Lang, string> }[] = [
  {
    months: '6-8',
    meals: { bn: '২–৩ বেলা নরম খাবার', en: '2–3 meals of soft food', hi: '२–३ बार नरम खाना' },
    key: { bn: 'নরম ও ঘন খাবার শুরু করুন; মায়ের দুধ চলবে।', en: 'Start soft, thick food; keep breastfeeding.', hi: 'नरम, गाढ़ा खाना शुरू करें; माँ का दूध जारी रखें।' },
  },
  {
    months: '9-11',
    meals: { bn: '৩–৪ বেলা খাবার', en: '3–4 meals', hi: '३–४ बार खाना' },
    key: { bn: 'নানা রঙের খাবার; ডিম ও ডাল প্রতিদিন চেষ্টা করুন।', en: 'Many colours; try egg and dal every day.', hi: 'कई रंगों का खाना; रोज़ अंडा और दाल दें।' },
  },
  {
    months: '12-23',
    meals: { bn: '৩–৪ বেলা খাবার + ১–২ বার হালকা নাশতা', en: '3–4 meals + 1–2 snacks', hi: '३–४ बार खाना + १–२ बार नाश्ता' },
    key: { bn: 'পরিবারের খাবার ছোট টুকরো করে দিন; ৫ ধরনের খাবার লক্ষ্য রাখুন।', en: "Family food in small pieces; aim for 5 kinds.", hi: 'परिवार का खाना छोटे टुकड़ों में दें; ५ तरह का लक्ष्य रखें।' },
  },
];
