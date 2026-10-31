// Static fun-feature content — NO APIs. Challenges + quiz bank in 3 languages.
import type { Lang } from './i18n';

type L3 = Record<Lang, string>;

// ---------- Feature 2: Daily Challenge (14 rotating missions) ----------
export interface Mission {
  id: string;
  text: L3;
  /** all of these groups must be present on the analysed plate */
  groups: string[];
  /** ...or this minimum diversity score */
  minScore?: number;
}

export const MISSIONS: Mission[] = [
  { id: 'm-egg', groups: ['eggs'], text: { bn: 'আজ প্লেটে ডিম যোগ করো', en: 'Add an egg to the plate today', hi: 'आज थाली में अंडा जोड़ो' } },
  { id: 'm-shak', groups: ['vit_a_fruits_veg'], text: { bn: 'আজ শাক রাখো', en: 'Put leafy greens on the plate today', hi: 'आज थाली में साग रखो' } },
  { id: 'm-dal', groups: ['legumes'], text: { bn: 'আজ ডাল খাওয়াও', en: 'Serve dal today', hi: 'आज दाल खिलाओ' } },
  { id: 'm-fish', groups: ['flesh'], text: { bn: 'আজ ছোট মাছ দাও', en: 'Give small fish today', hi: 'आज छोटी मछली दो' } },
  { id: 'm-5', groups: [], minScore: 5, text: { bn: 'আজ ৫ রকম খাবার একসাথে করো', en: 'Put 5 kinds of food together today', hi: 'आज ५ तरह के खाने एक साथ करो' } },
  { id: 'm-4', groups: [], minScore: 4, text: { bn: 'আজ ৪ রকম খাবার একসাথে করো', en: 'Put 4 kinds of food together today', hi: 'आज ४ तरह के खाने एक साथ करो' } },
  { id: 'm-milk', groups: ['dairy'], text: { bn: 'আজ দুধ বা দই দাও', en: 'Give milk or yogurt today', hi: 'आज दूध या दही दो' } },
  { id: 'm-banana', groups: ['other_fruits_veg'], text: { bn: 'আজ কলা বা ফল দাও', en: 'Give banana or fruit today', hi: 'आज केला या फल दो' } },
  { id: 'm-orange', groups: ['vit_a_fruits_veg'], text: { bn: 'আজ কমলা রঙের খাবার দাও', en: 'Give an orange-coloured food today', hi: 'आज नारंगी रंग का खाना दो' } },
  { id: 'm-egg-dal', groups: ['eggs', 'legumes'], text: { bn: 'আজ ডিম আর ডাল একসাথে দাও', en: 'Give egg and dal together today', hi: 'आज अंडा और दाल साथ दो' } },
  { id: 'm-rice-dal', groups: ['grains', 'legumes'], text: { bn: 'আজ ভাতের সাথে ডাল দাও', en: 'Give dal with rice today', hi: 'आज चावल के साथ दाल दो' } },
  { id: 'm-fish-rice', groups: ['flesh', 'grains'], text: { bn: 'আজ ভাতের সাথে মাছ দাও', en: 'Give fish with rice today', hi: 'आज चावल के साथ मछली दो' } },
  { id: 'm-3', groups: [], minScore: 3, text: { bn: 'আজ অন্তত ৩ রকম খাবার করো', en: 'Make at least 3 kinds of food today', hi: 'आज कम से कम ३ तरह के खाने बनाओ' } },
  { id: 'm-mango', groups: ['vit_a_fruits_veg'], text: { bn: 'আজ পাকা আম বা পেঁপে দাও', en: 'Give ripe mango or papaya today', hi: 'आज पका आम या पपीता दो' } },
];

export function todaysMission(date = new Date()): Mission {
  const day = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
  return MISSIONS[day % MISSIONS.length];
}

export function missionSatisfied(m: Mission, groups: string[], score: number): boolean {
  if (m.minScore != null) return score >= m.minScore;
  return m.groups.every((g) => groups.includes(g));
}

const CH_KEY = 'pushtiplate:challenge';
export function challengeDoneToday(): boolean {
  try {
    const raw = JSON.parse(localStorage.getItem(CH_KEY) ?? '{}');
    return raw.date === new Date().toDateString() && !!raw.done;
  } catch { return false; }
}
export function markChallengeDone() {
  localStorage.setItem(CH_KEY, JSON.stringify({ date: new Date().toDateString(), done: true }));
}

// ---------- Feature 3: Nutrition Quiz (bank of 15, 5 per round) ----------
export interface QuizQ {
  q: L3;
  options: L3[];      // 3 options
  answer: number;     // index of correct option
  fact: L3;           // one simple line shown after answering
  health?: boolean;   // append health-worker guidance line
}

const Q = (q: L3, options: L3[], answer: number, fact: L3, health = false): QuizQ =>
  ({ q, options, answer, fact, health });

export const QUIZ_BANK: QuizQ[] = [
  Q(
    { bn: 'কোন খাবারে প্রোটিন বেশি?', en: 'Which food has more protein?', hi: 'किस खाने में प्रोटीन ज़्यादा है?' },
    [{ bn: 'ডিম', en: 'Egg', hi: 'अंडा' }, { bn: 'ভাত', en: 'Rice', hi: 'चावल' }, { bn: 'আলু', en: 'Potato', hi: 'आलू' }], 0,
    { bn: 'ডিমে প্রোটিন বেশি; শরীর ও মস্তিষ্ক বাড়তে সাহায্য করে।', en: 'Egg has lots of protein; it helps the body and brain grow.', hi: 'अंडे में प्रोटीन ज़्यादा है; शरीर और दिमाग बढ़ने में मदद करता है।' }),
  Q(
    { bn: '১২ মাসের শিশুকে দিনে কয়বার খাবার দেওয়া উচিত?', en: 'How many meals a day for a 12-month-old?', hi: '१२ महीने के बच्चे को दिन में कितनी बार खाना देना चाहिए?' },
    [{ bn: '১ বার', en: '1 time', hi: '१ बार' }, { bn: '৩–৪ বার + নাশতা', en: '3–4 times + snacks', hi: '३–४ बार + नाश्ता' }, { bn: 'শুধু দুধ', en: 'Only milk', hi: 'सिर्फ़ दूध' }], 1,
    { bn: '১২–২৩ মাসে ৩–৪ বেলা খাবার আর ১–২ বার হালকা নাশতা ভালো।', en: 'At 12–23 months, 3–4 meals plus 1–2 small snacks is good.', hi: '१२–२३ महीने में ३–४ बार खाना और १–२ बार हल्का नाश्ता अच्छा है।' }),
  Q(
    { bn: 'চোখ ভালো রাখতে কোন খাবার সাহায্য করে?', en: 'Which food helps keep eyes healthy?', hi: 'आँखें अच्छी रखने में कौन-सा खाना मदद करता है?' },
    [{ bn: 'সাদা ভাত', en: 'White rice', hi: 'सफेद चावल' }, { bn: 'মিষ্টি আলু', en: 'Orange sweet potato', hi: 'शकरकंद' }, { bn: 'লবণ', en: 'Salt', hi: 'नमक' }], 1,
    { bn: 'কমলা রঙের খাবারে ভিটামিন এ থাকে, চোখের জন্য ভালো।', en: 'Orange foods have vitamin A, good for the eyes.', hi: 'नारंगी खाने में विटामिन ए होता है, आँखों के लिए अच्छा है।' }),
  Q(
    { bn: 'ভালো থালায় কম করে কয় রকম খাবার থাকা উচিত?', en: 'At least how many kinds of food on a good plate?', hi: 'अच्छी थाली में कम से कम कितने तरह के खाने होने चाहिए?' },
    [{ bn: '২ রকম', en: '2 kinds', hi: '२ तरह' }, { bn: '৫ রকম', en: '5 kinds', hi: '५ तरह' }, { bn: '১ রকম', en: '1 kind', hi: '१ तरह' }], 1,
    { bn: 'WHO বলে অন্তত ৫ রকম খাবার থাকলে থালা ভালো।', en: 'WHO says a plate is good with at least 5 kinds of food.', hi: 'WHO कहता है कम से कम ५ तरह के खाने वाली थाली अच्छी है।' }),
  Q(
    { bn: 'হাড় মজবুত করতে কোন খাবার ভালো?', en: 'Which food makes bones strong?', hi: 'हड्डियाँ मजबूत करने के लिए कौन-सा खाना अच्छा है?' },
    [{ bn: 'দই', en: 'Yogurt', hi: 'दही' }, { bn: 'চিনি', en: 'Sugar', hi: 'चीनी' }, { bn: 'তেল', en: 'Oil', hi: 'तेल' }], 0,
    { bn: 'দুধ আর দইয়ে ক্যালসিয়াম থাকে; হাড় ও দাঁত মজবুত হয়।', en: 'Milk and yogurt have calcium; bones and teeth get strong.', hi: 'दूध और दही में कैल्शियम होता है; हड्डियाँ और दाँत मजबूत होते हैं।' }),
  Q(
    { bn: 'রক্ত বাড়াতে কোন খাবার সাহায্য করে?', en: 'Which food helps make blood?', hi: 'खून बढ़ाने में कौन-सा खाना मदद करता है?' },
    [{ bn: 'ছোট মাছ', en: 'Small fish', hi: 'छोटी मछली' }, { bn: 'ঠান্ডা পানি', en: 'Cold water', hi: 'ठंडा पानी' }, { bn: 'মিষ্টি', en: 'Sweets', hi: 'मिठाई' }], 0,
    { bn: 'মাছ, ডিম আর ডালে আয়রন থাকে; রক্ত বাড়তে সাহায্য করে।', en: 'Fish, egg and dal have iron; they help make blood.', hi: 'मछली, अंडे और दाल में आयरन होता है; खून बढ़ने में मदद करता है।' }),
  Q(
    { bn: 'শিশু নতুন খাবার খেতে না চাইলে কী করবে?', en: 'The baby refuses a new food. What to do?', hi: 'बच्चा नया खाना न खाए तो क्या करें?' },
    [{ bn: 'জোর করে খাওয়াবে', en: 'Force-feed', hi: 'ज़बरदस्ती खिलाएँ' }, { bn: 'আর কখনো দেবে না', en: 'Never give it again', hi: 'फिर कभी न दें' }, { bn: 'অল্প অল্প করে বারবার দেবে', en: 'Give a little, again and again', hi: 'थोड़ा-थोड़ा करके बार-बार दें' }], 2,
    { bn: 'নতুন খাবারে অভ্যস্ত হতে সময় লাগে; অল্প করে বারবার দাও।', en: 'New foods take time; give a little, again and again.', hi: 'नए खाने की आदत पड़ने में समय लगता है; थोड़ा करके बार-बार दो।' }),
  Q(
    { bn: '৬ মাসের আগে শিশুর সেরা খাবার কোনটি?', en: 'Best food before 6 months?', hi: '६ महीने से पहले बच्चे का सबसे अच्छा खाना कौन-सा है?' },
    [{ bn: 'শুধু মায়ের দুধ', en: "Only mother's milk", hi: 'सिर्फ़ माँ का दूध' }, { bn: 'ভাতের মাড়', en: 'Rice water', hi: 'चावल का पानी' }, { bn: 'মধু', en: 'Honey', hi: 'शहद' }], 0,
    { bn: '৬ মাস পর্যন্ত শুধু মায়ের দুধই যথেষ্ট।', en: "Only mother's milk is enough until 6 months.", hi: '६ महीने तक सिर्फ़ माँ का दूध ही काफी है।' }),
  Q(
    { bn: 'শক্তি (ক্যালরি) সবচেয়ে বেশি কোন খাবারে?', en: 'Which food gives the most energy?', hi: 'किस खाने से सबसे ज़्यादा ऊर्जा मिलती है?' },
    [{ bn: 'শাক', en: 'Leafy greens', hi: 'साग' }, { bn: 'ছোলা', en: 'Chickpea', hi: 'चना' }, { bn: 'পেয়ারা', en: 'Guava', hi: 'अमरूद' }], 1,
    { bn: 'ছোলা আর ডালে শক্তি ও প্রোটিন দুটোই বেশি।', en: 'Chickpea and dal give both energy and protein.', hi: 'चने और दाल में ऊर्जा और प्रोटीन दोनों ज़्यादा हैं।' }),
  Q(
    { bn: 'রোগ থেকে বাঁচতে কোন ভিটামিন সাহায্য করে?', en: 'Which vitamin helps protect from illness?', hi: 'बीमारी से बचाने में कौन-सा विटामिन मदद करता है?' },
    [{ bn: 'পেয়ারা (ভিটামিন সি)', en: 'Guava (vitamin C)', hi: 'अमरूद (विटामिन सी)' }, { bn: 'লবণ', en: 'Salt', hi: 'नमक' }, { bn: 'চিনি', en: 'Sugar', hi: 'चीनी' }], 0,
    { bn: 'পেয়ারায় ভিটামিন সি থাকে; রোগ থেকে বাঁচতে সাহায্য করে।', en: 'Guava has vitamin C; it helps protect from illness.', hi: 'अमरूद में विटामिन सी होता है; बीमारी से बचाता है।' }),
  Q(
    { bn: 'শিশুর ওজন না বাড়লে কী করা উচিত?', en: "The baby's weight is not growing. What to do?", hi: 'बच्चे का वज़न न बढ़े तो क्या करें?' },
    [{ bn: 'কিছু না', en: 'Nothing', hi: 'कुछ नहीं' }, { bn: 'স্বাস্থ্য সেবিকাকে দেখানো', en: 'Show the health worker', hi: 'स्वास्थ्य सेविका को दिखाना' }, { bn: 'খাবার কম দেওয়া', en: 'Give less food', hi: 'खाना कम देना' }], 1,
    { bn: 'ওজন না বাড়লে দেরি না করে সাহায্য নাও।', en: 'If weight does not grow, get help without delay.', hi: 'वज़न न बढ़े तो देर किए बिना मदद लो।' }, true),
  Q(
    { bn: 'কাঁটাসহ ছোট মাছ খেলে কী পাওয়া যায়?', en: 'Eating small fish with bones gives what?', hi: 'हड्डी समेत छोटी मछली खाने से क्या मिलता है?' },
    [{ bn: 'ক্যালসিয়াম', en: 'Calcium', hi: 'कैल्शियम' }, { bn: 'চিনি', en: 'Sugar', hi: 'चीनी' }, { bn: 'কিছুই না', en: 'Nothing', hi: 'कुछ नहीं' }], 0,
    { bn: 'কাঁটাসহ ছোট মাছে ক্যালসিয়াম ও আয়রন থাকে।', en: 'Small fish with bones has calcium and iron.', hi: 'हड्डी समेत छोटी मछली में कैल्शियम और आयरन होता है।' }),
  Q(
    { bn: 'খাবার নরম ও ঘন হলে ভালো কেন?', en: 'Why is soft, thick food good?', hi: 'नरम और गाढ़ा खाना अच्छा क्यों है?' },
    [{ bn: 'খাওয়া সহজ, পেট ভরে', en: 'Easy to eat, fills the tummy', hi: 'खाना आसान, पेट भरता है' }, { bn: 'দেখতে সুন্দর', en: 'Looks nice', hi: 'दिखने में अच्छा' }, { bn: 'ঠান্ডা থাকে', en: 'Stays cold', hi: 'ठंडा रहता है' }], 0,
    { bn: 'নরম ঘন খাবার শিশু সহজে খেতে পারে, শক্তিও বেশি পায়।', en: 'Soft thick food is easy to eat and gives more energy.', hi: 'नरम गाढ़ा खाना बच्चा आसानी से खाता है और ऊर्जा भी ज़्यादा मिलती है।' }),
  Q(
    { bn: 'কোনটি ফলের মধ্যে পড়ে?', en: 'Which one is a fruit?', hi: 'इनमें से फल कौन-सा है?' },
    [{ bn: 'আলু', en: 'Potato', hi: 'आलू' }, { bn: 'পাকা পেঁপে', en: 'Ripe papaya', hi: 'पका पपीता' }, { bn: 'ভাত', en: 'Rice', hi: 'चावल' }], 1,
    { bn: 'পাকা পেঁপে কমলা ফল; ভিটামিন এ থাকে।', en: 'Ripe papaya is an orange fruit with vitamin A.', hi: 'पका पपीता नारंगी फल है; इसमें विटामिन ए होता है।' }),
  Q(
    { bn: 'জ্বর হলে শিশুকে খাওয়ানো উচিত?', en: 'Should a baby with fever be fed?', hi: 'बुखार होने पर बच्चे को खिलाना चाहिए?' },
    [{ bn: 'না, বন্ধ রাখো', en: 'No, stop feeding', hi: 'नहीं, बंद कर दो' }, { bn: 'হ্যাঁ, অল্প অল্প করে', en: 'Yes, little by little', hi: 'हाँ, थोड़ा-थोड़ा करके' }, { bn: 'শুধু ওষুধ', en: 'Only medicine', hi: 'सिर्फ़ दवाई' }], 1,
    { bn: 'অসুস্থ হলেও অল্প অল্প করে খাওয়ানো চালিয়ে যাও।', en: 'Even when sick, keep feeding little by little.', hi: 'बीमार होने पर भी थोड़ा-थोड़ा खिलाते रहो।' }, true),
];

export function quizRound(count = 5): QuizQ[] {
  const shuffled = [...QUIZ_BANK].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
