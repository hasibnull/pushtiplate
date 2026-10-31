// i18n — one file, Bangla is source/default. Keys for every UI string.
import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Lang = 'bn' | 'en' | 'hi';
export const LANGS: { id: Lang; label: string; voiceLang: string }[] = [
  { id: 'bn', label: 'বাংলা', voiceLang: 'bn-BD' },
  { id: 'en', label: 'English', voiceLang: 'en-US' },
  { id: 'hi', label: 'हिन्दी', voiceLang: 'hi-IN' },
];

const DIGITS: Record<Lang, string[]> = {
  bn: ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'],
  en: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  hi: ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'],
};
export function localizeNumber(n: number | string, lang: Lang): string {
  return String(n).replace(/\d/g, (d) => DIGITS[lang][Number(d)]);
}

type Dict = Record<string, string>;
const bn: Dict = {
  appName: 'পুষ্টি থালা', tagline: 'আজকের থালা, কালকের শক্তি',
  chooseCountry: 'আপনি কোথা থেকে?', chooseLanguage: 'ভাষা বেছে নিন', continue: 'এগিয়ে যান', back: 'পেছনে',
  settings: 'সেটিংস', country: 'দেশ', language: 'ভাষা',
  history: 'আগের থালা', library: 'খাবারের লাইব্রেরি', libraryShort: 'লাইব্রেরি',
  ageQuestion: 'শিশুর বয়স কত?', months: 'মাস',
  takePhoto: 'থালার ছবি তুলুন', fromGallery: 'গ্যালারি থেকে ছবি নিন', tryAgain: 'আবার চেষ্টা করুন',
  privacyLine: 'শুধু থালার ছবি তুলুন — শিশুর ছবি নয়।',
  samplePlates: 'নমুনা থালা দেখুন', whoFooter: 'WHO/UNICEF খাদ্য-বৈচিত্র্য নিয়ম অনুসারে',
  uploading: 'ছবি পাঠানো হচ্ছে…', findingFoods: 'খাবার খুঁজছি…', waitMore: 'আরেকটু অপেক্ষা করুন…',
  listen: 'শুনুন', stepsListen: 'থালার ছবি তুলুন। তারপর শুনুন বোতামে চাপ দিন।',
  verdictGood: 'দারুণ!', verdictAdd: 'আর একটু হলেই হবে',
  kindsOfFood: 'ধরনের খাবার', tapToFix: 'যে আইকনে ভুল আছে, চাপ দিন',
  today: 'আজ', tomorrow: 'আগামীকাল', addTomorrow: 'কাল যোগ করুন:',
  showWorker: 'এই কার্ডটি আপনার স্বাস্থ্য সেবিকাকে দেখান',
  disclaimer: 'এটি সাধারণ খাওয়ানোর তথ্য। চিকিৎসা পরামর্শ নয়।',
  disclaimerLibrary: 'এটি সাধারণ পুষ্টি তথ্য, চিকিৎসা পরামর্শ নয়',
  anotherPlate: 'আরেকটি থালা', saved: 'সংরক্ষণ হয়েছে ✓',
  noPlatesYet: 'এখনো কোনো থালা দেখা হয়নি', tomorrowAddPrefix: 'কাল:',
  calorieTitle: 'শক্তি (ক্যালরি)', approxIdea: 'আনুমানিক ধারণা / Approximate idea',
  kcalPerDay: 'কিলোক্যালরি / দিন', stillNeeded: 'আর কতটুকু লাগবে', nextStep: 'পরের ধাপ',
  details: 'বিস্তারিত দেখুন', foundOnPlate: 'থালায় পাওয়া গেছে', notOnPlate: 'থালায় নেই',
  all: 'সব', protein: 'প্রোটিন', approx: 'আনুমানিক', perServing: 'পরিমাণ', startAge: 'শুরু',
  login: 'লগইন', logout: 'লগ আউট', email: 'ইমেইল', password: 'পাসওয়ার্ড',
  signUp: 'অ্যাকাউন্ট খুলুন', haveAccount: 'আগে থেকে অ্যাকাউন্ট আছে? লগইন করুন', noAccount: 'অ্যাকাউন্ট নেই? নতুন খুলুন',
  continueGuest: 'অতিথি হিসেবে চালিয়ে যান', continueGoogle: 'Google দিয়ে চালিয়ে যান',
  authError: 'কিছু ভুল হয়েছে। আবার চেষ্টা করুন।', checkEmail: 'আপনার ইমেইল দেখুন — নিশ্চিত করার লিংক পাঠানো হয়েছে।',
  mealsPerDay: 'বেলা খাবার', guidanceTitle: 'বয়স অনুযায়ী খাওয়ানো',
};
const en: Dict = {
  appName: 'PushtiPlate', tagline: "Today's plate, tomorrow's strength",
  chooseCountry: 'Where are you from?', chooseLanguage: 'Choose your language', continue: 'Continue', back: 'Back',
  settings: 'Settings', country: 'Country', language: 'Language',
  history: 'Past plates', library: 'Food Library', libraryShort: 'Library',
  ageQuestion: "How old is your child?", months: 'months',
  takePhoto: 'Take a photo of the plate', fromGallery: 'Choose from gallery', tryAgain: 'Try again',
  privacyLine: 'Photograph only the plate — not the child.',
  samplePlates: 'See a sample plate', whoFooter: 'Based on the WHO/UNICEF dietary diversity rule',
  uploading: 'Sending photo…', findingFoods: 'Finding the foods…', waitMore: 'One more moment…',
  listen: 'Listen', stepsListen: 'Take a photo of the plate. Then tap the Listen button.',
  verdictGood: 'Great!', verdictAdd: 'Almost there',
  kindsOfFood: 'kinds of food', tapToFix: "Tap an icon if it's wrong",
  today: 'Today', tomorrow: 'Tomorrow', addTomorrow: 'Tomorrow add:',
  showWorker: 'Show this card to your health worker',
  disclaimer: 'This is general feeding information. It is not medical advice.',
  disclaimerLibrary: 'This is general nutrition information, not medical advice',
  anotherPlate: 'Another plate', saved: 'Saved ✓',
  noPlatesYet: 'No plates yet', tomorrowAddPrefix: 'Tomorrow:',
  calorieTitle: 'Energy (calories)', approxIdea: 'Approximate idea',
  kcalPerDay: 'kcal / day', stillNeeded: 'What is still needed', nextStep: 'Next step',
  details: 'See details', foundOnPlate: 'Found on the plate', notOnPlate: 'Not on the plate',
  all: 'All', protein: 'Protein', approx: 'approximate', perServing: 'Serving', startAge: 'From',
  login: 'Log in', logout: 'Log out', email: 'Email', password: 'Password',
  signUp: 'Sign up', haveAccount: 'Already have an account? Log in', noAccount: 'No account? Sign up',
  continueGuest: 'Continue as guest', continueGoogle: 'Continue with Google',
  authError: 'Something went wrong. Please try again.', checkEmail: 'Check your email — a confirmation link was sent.',
  mealsPerDay: 'meals a day', guidanceTitle: 'Feeding by age',
};
const hi: Dict = {
  appName: 'पुष्टि थाली', tagline: 'आज की थाली, कल की ताकत',
  chooseCountry: 'आप कहाँ से हैं?', chooseLanguage: 'भाषा चुनें', continue: 'आगे बढ़ें', back: 'पीछे',
  settings: 'सेटिंग्स', country: 'देश', language: 'भाषा',
  history: 'पिछली थालियाँ', library: 'खाने की लाइब्रेरी', libraryShort: 'लाइब्रेरी',
  ageQuestion: 'आपके बच्चे की उम्र कितनी है?', months: 'महीने',
  takePhoto: 'थाली की फोटो लें', fromGallery: 'गैलरी से फोटो लें', tryAgain: 'फिर कोशिश करें',
  privacyLine: 'सिर्फ़ थाली की फोटो लें — बच्चे की नहीं।',
  samplePlates: 'नमूना थाली देखें', whoFooter: 'WHO/UNICEF आहार-विविधता नियम के अनुसार',
  uploading: 'फोटो भेजी जा रही है…', findingFoods: 'खाना ढूँढ रहे हैं…', waitMore: 'थोड़ा और रुकें…',
  listen: 'सुनें', stepsListen: 'थाली की फोटो लें। फिर सुनें बटन दबाएँ।',
  verdictGood: 'बहुत बढ़िया!', verdictAdd: 'बस थोड़ा और',
  kindsOfFood: 'तरह का खाना', tapToFix: 'जो आइकन गलत है, उसे दबाएँ',
  today: 'आज', tomorrow: 'कल', addTomorrow: 'कल जोड़ें:',
  showWorker: 'यह कार्ड अपनी स्वास्थ्य सेविका को दिखाएँ',
  disclaimer: 'यह सामान्य खान-पान की जानकारी है। यह चिकित्सा सलाह नहीं है।',
  disclaimerLibrary: 'यह सामान्य पोषण जानकारी है, चिकित्सा सलाह नहीं',
  anotherPlate: 'एक और थाली', saved: 'सहेजा गया ✓',
  noPlatesYet: 'अभी तक कोई थाली नहीं', tomorrowAddPrefix: 'कल:',
  calorieTitle: 'ऊर्जा (कैलोरी)', approxIdea: 'अनुमानित अंदाज़ा',
  kcalPerDay: 'किलोकैलोरी / दिन', stillNeeded: 'और कितना चाहिए', nextStep: 'अगला कदम',
  details: 'विवरण देखें', foundOnPlate: 'थाली में मिला', notOnPlate: 'थाली में नहीं',
  all: 'सब', protein: 'प्रोटीन', approx: 'अनुमानित', perServing: 'मात्रा', startAge: 'शुरू',
  login: 'लॉग इन', logout: 'लॉग आउट', email: 'ईमेल', password: 'पासवर्ड',
  signUp: 'खाता बनाएँ', haveAccount: 'पहले से खाता है? लॉग इन करें', noAccount: 'खाता नहीं है? नया बनाएँ',
  continueGuest: 'मेहमान के रूप में जारी रखें', continueGoogle: 'Google से जारी रखें',
  authError: 'कुछ गलत हो गया। फिर कोशिश करें।', checkEmail: 'अपना ईमेल देखें — पुष्टि लिंक भेजा गया है।',
  mealsPerDay: 'बार खाना', guidanceTitle: 'उम्र के अनुसार खिलाना',
};
const STRINGS: Record<Lang, Dict> = { bn, en, hi };

/** Spoken locked templates — {score} localized numeral, {portion} = next-step portion phrase. */
export const SPOKEN: Record<Lang, Record<string, string>> = {
  bn: {
    good: 'দারুণ! আজকের থালায় {score} ধরনের খাবার আছে। এভাবেই চালিয়ে যান। প্রতিদিন নানা রঙের খাবার দিন।',
    add_food: 'আজকের থালায় {score} ধরনের খাবার আছে। কাল {portion} যোগ করুন। একটু একটু করে নতুন খাবারে অভ্যস্ত করুন।',
    see_worker: 'আজকের থালায় মাত্র {score} ধরনের খাবার আছে। কাল {portion} যোগ করুন। পরের সাক্ষাতে এই কার্ডটি স্বাস্থ্য সেবিকাকে দেখান। তিনি সাহায্য করবেন।',
  },
  en: {
    good: "Great! Today's plate has {score} kinds of food. Keep it up. Give many-coloured foods every day.",
    add_food: "Today's plate has {score} kinds of food. Tomorrow add {portion}. Let the baby get used to new foods little by little.",
    see_worker: "Today's plate has only {score} kinds of food. Tomorrow add {portion}. At the next visit, show this card to the health worker. She will help.",
  },
  hi: {
    good: 'बहुत बढ़िया! आज की थाली में {score} तरह का खाना है। ऐसे ही जारी रखें। हर दिन कई रंगों का खाना दें।',
    add_food: 'आज की थाली में {score} तरह का खाना है। कल {portion} जोड़ें। बच्चे को नए खाने की आदत धीरे-धीरे डालें।',
    see_worker: 'आज की थाली में सिर्फ़ {score} तरह का खाना है। कल {portion} जोड़ें। अगली मुलाकात में यह कार्ड स्वास्थ्य सेविका को दिखाएँ। वे मदद करेंगी।',
  },
};

export const COUNTRIES = ['Bangladesh', 'India', 'Pakistan', 'Nepal', 'Sri Lanka', 'Myanmar', 'Other'] as const;

const PREFS_KEY = 'pushtiplate:prefs';
export interface Prefs { lang: Lang; country: string; onboarded: boolean }
export function loadPrefs(): Prefs {
  try {
    const p = JSON.parse(localStorage.getItem(PREFS_KEY) ?? '{}');
    return { lang: p.lang ?? 'bn', country: p.country ?? 'Bangladesh', onboarded: !!p.onboarded };
  } catch { return { lang: 'bn', country: 'Bangladesh', onboarded: false }; }
}
export function savePrefs(p: Prefs) { localStorage.setItem(PREFS_KEY, JSON.stringify(p)); }

interface LangCtx { prefs: Prefs; setPrefs: (p: Partial<Prefs>) => void; t: (k: string) => string; num: (n: number | string) => string }
const Ctx = createContext<LangCtx>({ prefs: loadPrefs(), setPrefs: () => {}, t: (k) => k, num: (n) => String(n) });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [prefs, setState] = useState<Prefs>(loadPrefs);
  const setPrefs = (p: Partial<Prefs>) => setState((prev) => { const next = { ...prev, ...p }; savePrefs(next); return next; });
  useEffect(() => { document.documentElement.lang = prefs.lang === 'bn' ? 'bn' : prefs.lang; }, [prefs.lang]);
  const value: LangCtx = {
    prefs, setPrefs,
    t: (k) => STRINGS[prefs.lang][k] ?? STRINGS.bn[k] ?? k,
    num: (n) => localizeNumber(n, prefs.lang),
  };
  return React.createElement(Ctx.Provider, { value }, children);
}
export function useLang() { return useContext(Ctx); }
