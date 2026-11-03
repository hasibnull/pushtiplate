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
  demoButton: 'ডেমো দেখুন', badgesTitle: 'আপনার ব্যাজ', badgeUnlocked: 'নতুন ব্যাজ পেয়েছেন!',
  badgeFirstPlate: 'প্রথম ছবি', badgeStar: 'পুষ্টি তারকা', badgeStreak: 'ধারাবাহিক মা', badgeExplorer: 'লাইব্রেরি অন্বেষক',
  chartTitle: 'শেষ ১০টি থালার স্কোর', avgScore: 'গড় স্কোর',
  trendUp: 'বাহ! থালা দিন দিন ভালো হচ্ছে।', trendFlat: 'ভালো চলছে — এভাবেই চালিয়ে যান।', trendDown: 'চিন্তা নেই — একটু একটু করে আবার ভালো হবে।',
  tipTitle: 'আজকের টিপস', weeklyTitle: 'এই সপ্তাহের হিসাব', platesThisWeek: 'এই সপ্তাহে থালা', mostMissed: 'বেশি বাদ পড়েছে',
  faqTitle: 'মায়ের প্রশ্ন', seasonalTitle: 'এখন সস্তা ও ভালো',
  workerMode: 'স্বাস্থ্যকর্মী ভিউ', workerModeHint: 'ইতিহাস সহজ তালিকায় দেখায়',
  darkMode: 'ডার্ক মোড', bigText: 'বড় অক্ষর',
  childrenTitle: 'আপনার শিশু', addChild: 'শিশু যোগ করুন', nickname: 'ডাকনাম',
  reminderTitle: 'মনে করিয়ে দেওয়া', reminderText: 'কাল আবার প্লেটের ছবি তুলুন', reminderBody: 'আজকের থালার ছবি তুলে শিশুর খাবার দেখে নিন।',
  guideTitle: 'ছবি তোলার আগে', guideLight: 'ভালো আলোতে তুলুন', guideFill: 'থালা পুরো ফ্রেমে রাখুন', guideTop: 'ঠিক ওপর থেকে তুলুন', guideGo: 'ক্যামেরা খুলুন',
  shareButton: 'শেয়ার করুন', copied: 'কপি হয়েছে ✓', workerNote: 'সন্দেহ হলে স্বাস্থ্য সেবিকাকে দেখান।',
  on: 'চালু', off: 'বন্ধ', child: 'শিশু',
  stepPhotoDesc: 'থালার একটি ছবিই যথেষ্ট।', stepFindDesc: 'আমরা ৮ ধরনের খাবার খুঁজে দেখি।', stepListenDesc: 'ফলাফল শুনুন আপনার নিজের ভাষায়।',
  listenHow: 'শুনুন: কীভাবে কাজ করে', statGroups: 'ধরনের খাবার', statLangs: 'ভাষা', statPhoto: 'ছবিই যথেষ্ট',
  sampleHero: 'ভাত ও ডালের থালা', sampleGood: 'নানা রঙের থালা', sampleLow: 'শুধু ভাত-আলুর থালা',
  playTitle: 'নিজের প্লেট সাজাও', clearPlate: 'পরিষ্কার করো', addNext: 'এরপর যোগ করো', tapFoodHint: 'নিচের খাবারে চাপ দাও',
  challengeTitle: 'আজকের চ্যালেঞ্জ', challengeDone: 'চ্যালেঞ্জ শেষ!',
  quizTitle: 'পুষ্টি কুইজ', correct: 'ঠিক হয়েছে!', rightAnswer: 'সঠিক উত্তর:', playAgain: 'আবার খেলো',
  seeLibraryLine: 'আরও জানতে লাইব্রেরি দেখো', youGot: 'তুমি পেয়েছ', of: '/',
  missionLine: 'একটি ছবি থেকেই শিশুর থালা যাচাই করুন।',
  footerDisclaimer: 'পুষ্টি থালা শুধু সাধারণ পুষ্টি তথ্য দেয় — এটি চিকিৎসা পরামর্শ নয়। শিশু অসুস্থ হলে বা ঠিকমতো না বাড়লে অনুগ্রহ করে স্বাস্থ্যকর্মীকে দেখান।',
  exploreTitle: 'ঘুরে দেখুন', legalTitle: 'আইনি তথ্য', aboutTitle: 'আমাদের কথা',
  aboutLine1: 'Meta Global AI Developer Hackathon 2026-এর জন্য একা হাতে তৈরি।',
  aboutLine2: 'নির্দেশনা WHO/UNICEF খাদ্য-বৈচিত্র্য নিয়মে; তথ্য: BBS-UNICEF MICS 2025।',
  disclaimerPageTitle: 'দায়-অস্বীকার', privacyPageTitle: 'গোপনীয়তা নীতি', termsPageTitle: 'ব্যবহারের শর্ত',
  disclaimerSummary: 'সহজ কথায়: এই অ্যাপ শুধু শেখার জন্য। ডাক্তারের পরামর্শের বদলে নয়। ফলাফল নিজে মিলিয়ে নিন, আর শিশু অসুস্থ হলে স্বাস্থ্যকর্মীকে দেখান।',
  privacySummary: 'সহজ কথায়: থালার ছবি ও বয়সের দলই শুধু লাগে। অতিথি হিসেবে কোনো অ্যাকাউন্ট ছাড়াই চলবে। শুধু থালার ছবি তুলুন, শিশুর নয়।',
  termsSummary: 'সহজ কথায়: এটি ফ্রি হ্যাকাথন ডেমো, যেমন আছে তেমনই দেওয়া। শুধু পথ দেখানোর জন্য ব্যবহার করুন, মানুষের ছবি তুলবেন না।',
  footerRights: '© ২০২৬ পুষ্টি থালা', footerBuilt: 'Meta Global AI Developer Hackathon-এর জন্য তৈরি', footerMade: 'Muse Spark, SAM 3.1 ও Muse Image দিয়ে তৈরি',
  faqQ1: 'কীভাবে ব্যবহার করব?', faqA1: 'শিশুর বয়স বেছে নিয়ে থালার ছবি তুলুন। ফলাফল ছবি ও আওয়াজে পাবেন।',
  faqQ2: 'শিশুর ছবি তুলতে হবে কি?', faqA2: 'না। শুধু থালার ছবি তুলুন — শিশুর ছবি কখনো নয়।',
  faqQ3: 'এটা কি ডাক্তারের পরামর্শ?', faqA3: 'না। এটি সাধারণ পুষ্টি তথ্য। অসুখ বা বাড়ন্ত সমস্যা হলে ডাক্তার বা স্বাস্থ্যকর্মীকে দেখান।',
  faqQ4: 'ক্যালরি কি একদম ঠিক?', faqA4: 'না, ক্যালরি আনুমানিক ধারণা মাত্র — সাধারণ খাবারের তথ্য থেকে হিসাব করা।',
  faqQ5: 'অ্যাকাউন্ট কি লাগবেই?', faqA5: 'না। অতিথি হিসেবে সব ব্যবহার করা যায়। অ্যাকাউন্ট শুধু নিজের ইতিহাস রাখতে চাইলে।',
  fullDetailsTitle: 'সব বিস্তারিত', fdOnPlate: 'থালায় যা আছে', fdMissing: 'যা কমতি আছে', fdAddNow: 'এখন যোগ করো',
  fdNextMeal: 'পরের বেলার খাবার', fdSummary: 'সারকথা', fdAlternatives: 'অথবা দিতে পারো:',
  fdNextMealLine: 'পরের বেলা:', fdNoneMissing: 'কিছুই কমতি নেই — সব ধরনের খাবার আছে!',
  fdAddNowGood: 'আজ আর কিছু যোগ করতে হবে না। প্রতিদিন এভাবেই নানা রঙের খাবার দাও।',
  fdNextMealGood: 'পরের বেলায়ও এভাবেই নানা রঙের খাবার দাও।',
  fdEmptyFoods: 'কোনো খাবার চেনা যায়নি — ওপরের আইকনে চাপ দিয়ে ঠিক করে নাও।',
  fdSummaryGood: 'দারুণ! আজকের থালায় {score} ধরনের খাবার আছে। এভাবেই চালিয়ে যাও।',
  fdSummaryAdd: 'আজকের থালায় {score} ধরনের খাবার আছে। সবচেয়ে জরুরি কাজ: {fix} যোগ করা।',
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
  demoButton: 'See a demo', badgesTitle: 'Your badges', badgeUnlocked: 'New badge earned!',
  badgeFirstPlate: 'First photo', badgeStar: 'Nutrition star', badgeStreak: 'Steady mother', badgeExplorer: 'Library explorer',
  chartTitle: 'Last 10 plate scores', avgScore: 'Average score',
  trendUp: 'Wow! Plates are getting better day by day.', trendFlat: 'Going well — keep it up.', trendDown: 'Do not worry — it will get better little by little.',
  tipTitle: "Today's tip", weeklyTitle: 'This week', platesThisWeek: 'Plates this week', mostMissed: 'Most often missed',
  faqTitle: "Mother's questions", seasonalTitle: 'Cheap & in season now',
  workerMode: 'Health worker view', workerModeHint: 'Shows history as a simple list',
  darkMode: 'Dark mode', bigText: 'Big text',
  childrenTitle: 'Your children', addChild: 'Add a child', nickname: 'Nickname',
  reminderTitle: 'Daily reminder', reminderText: 'Take a plate photo again tomorrow', reminderBody: "Take a photo of today's plate and check your child's food.",
  guideTitle: 'Before you take the photo', guideLight: 'Use good light', guideFill: 'Fill the frame with the plate', guideTop: 'Take it from directly above', guideGo: 'Open camera',
  shareButton: 'Share', copied: 'Copied ✓', workerNote: 'If unsure, show your health worker.',
  on: 'On', off: 'Off', child: 'Child',
  stepPhotoDesc: 'One photo of the plate is enough.', stepFindDesc: 'We look for 8 kinds of food.', stepListenDesc: 'Hear the result in your own language.',
  listenHow: 'Listen: how it works', statGroups: 'food groups', statLangs: 'languages', statPhoto: 'photo is enough',
  sampleHero: 'Rice & dal plate', sampleGood: 'Colourful plate', sampleLow: 'Only rice & potato',
  playTitle: 'Build your own plate', clearPlate: 'Clear', addNext: 'Add next', tapFoodHint: 'Tap a food below',
  challengeTitle: "Today's challenge", challengeDone: 'Challenge done!',
  quizTitle: 'Nutrition Quiz', correct: 'Correct!', rightAnswer: 'Right answer:', playAgain: 'Play again',
  seeLibraryLine: 'See the Library to learn more', youGot: 'You got', of: '/',
  missionLine: 'Check your child\'s plate from a single photo.',
  footerDisclaimer: 'PushtiPlate gives general nutrition information only — it is not medical advice. If your child is ill or not growing well, please see a health worker.',
  exploreTitle: 'Explore', legalTitle: 'Legal', aboutTitle: 'About',
  aboutLine1: 'Solo-built for the Meta Global AI Developer Hackathon 2026.',
  aboutLine2: 'Guidance based on WHO/UNICEF dietary diversity rules; data: BBS-UNICEF MICS 2025.',
  disclaimerPageTitle: 'Disclaimer', privacyPageTitle: 'Privacy Policy', termsPageTitle: 'Terms of Use',
  disclaimerSummary: 'In short: this app is for learning only, not instead of a doctor. Always check the result, and see a health worker if your child is ill.',
  privacySummary: 'In short: we only need the plate photo and the age band. Guest mode works with no account. Photograph only the plate, never the child.',
  termsSummary: 'In short: this is a free hackathon demo, provided as-is. Use it as guidance only, and never upload photos of people.',
  footerRights: '© 2026 PushtiPlate', footerBuilt: 'Built for the Meta Global AI Developer Hackathon', footerMade: 'Made with Muse Spark, SAM 3.1 & Muse Image',
  faqQ1: 'How do I use it?', faqA1: 'Choose your child\'s age and take a photo of the plate. You get the result as a picture and as voice.',
  faqQ2: 'Do I need a photo of my child?', faqA2: 'No. Photograph only the plate — never the child.',
  faqQ3: 'Is this medical advice?', faqA3: 'No. This is general nutrition information. For illness or poor growth, see a doctor or health worker.',
  faqQ4: 'Are the calories exact?', faqA4: 'No, calories are an approximate idea, worked out from standard food data.',
  faqQ5: 'Do I need an account?', faqA5: 'No. Everything works as a guest. An account is only for keeping your own history.',
  fullDetailsTitle: 'Full details', fdOnPlate: 'On the plate', fdMissing: "What's missing", fdAddNow: 'Add now',
  fdNextMeal: 'Next meal idea', fdSummary: 'Summary', fdAlternatives: 'Or you can give:',
  fdNextMealLine: 'Next meal:', fdNoneMissing: 'Nothing is missing — every kind of food is here!',
  fdAddNowGood: 'No need to add anything today. Keep giving many-coloured foods like this every day.',
  fdNextMealGood: 'Keep giving many-coloured foods like this at the next meal too.',
  fdEmptyFoods: 'No food was recognised — tap the icons above to fix it.',
  fdSummaryGood: "Great! Today's plate has {score} kinds of food. Keep it up.",
  fdSummaryAdd: "Today's plate has {score} kinds of food. The most important step: add {fix}.",
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
  demoButton: 'डेमो देखें', badgesTitle: 'आपके बैज', badgeUnlocked: 'नया बैज मिला!',
  badgeFirstPlate: 'पहली फोटो', badgeStar: 'पोषण सितारा', badgeStreak: 'नियमित माँ', badgeExplorer: 'लाइब्रेरी खोजी',
  chartTitle: 'पिछली १० थालियों का स्कोर', avgScore: 'औसत स्कोर',
  trendUp: 'वाह! थालियाँ दिन-ब-दिन बेहतर हो रही हैं।', trendFlat: 'अच्छा चल रहा है — ऐसे ही जारी रखें।', trendDown: 'चिंता न करें — धीरे-धीरे फिर अच्छा होगा।',
  tipTitle: 'आज का टिप', weeklyTitle: 'इस सप्ताह', platesThisWeek: 'इस सप्ताह थालियाँ', mostMissed: 'सबसे ज़्यादा छूटा',
  faqTitle: 'माँ के सवाल', seasonalTitle: 'अभी सस्ता और अच्छा',
  workerMode: 'स्वास्थ्य कर्मी व्यू', workerModeHint: 'इतिहास आसान सूची में दिखता है',
  darkMode: 'डार्क मोड', bigText: 'बड़े अक्षर',
  childrenTitle: 'आपके बच्चे', addChild: 'बच्चा जोड़ें', nickname: 'प्यार का नाम',
  reminderTitle: 'रोज़ याद दिलाना', reminderText: 'कल फिर थाली की फोटो लें', reminderBody: 'आज की थाली की फोटो लेकर बच्चे का खाना देखें।',
  guideTitle: 'फोटो लेने से पहले', guideLight: 'अच्छी रोशनी में लें', guideFill: 'थाली पूरे फ्रेम में रखें', guideTop: 'बिल्कुल ऊपर से लें', guideGo: 'कैमरा खोलें',
  shareButton: 'शेयर करें', copied: 'कॉपी हुआ ✓', workerNote: 'संदेह हो तो स्वास्थ्य सेविका को दिखाएँ।',
  on: 'चालू', off: 'बंद', child: 'बच्चा',
  stepPhotoDesc: 'थाली की एक फोटो ही काफी है।', stepFindDesc: 'हम ८ तरह के खाने ढूँढते हैं।', stepListenDesc: 'नतीजा अपनी भाषा में सुनें।',
  listenHow: 'सुनें: यह कैसे काम करता है', statGroups: 'तरह के खाने', statLangs: 'भाषाएँ', statPhoto: 'फोटो ही काफी',
  sampleHero: 'चावल-दाल की थाली', sampleGood: 'रंग-बिरंगी थाली', sampleLow: 'सिर्फ़ चावल-आलू',
  playTitle: 'अपनी थाली सजाओ', clearPlate: 'साफ़ करो', addNext: 'अगला जोड़ो', tapFoodHint: 'नीचे खाने पर दबाओ',
  challengeTitle: 'आज की चुनौती', challengeDone: 'चुनौती पूरी!',
  quizTitle: 'पोषण क्विज़', correct: 'सही जवाब!', rightAnswer: 'सही उत्तर:', playAgain: 'फिर खेलो',
  seeLibraryLine: 'और जानने के लिए लाइब्रेरी देखो', youGot: 'तुम्हें मिले', of: '/',
  missionLine: 'एक ही फोटो से अपने बच्चे की थाली जाँचें।',
  footerDisclaimer: 'पुष्टि थाली सिर्फ़ सामान्य पोषण जानकारी देती है — यह चिकित्सा सलाह नहीं है। बच्चा बीमार हो या ठीक से न बढ़ रहा हो, तो कृपया स्वास्थ्य कर्मी को दिखाएँ।',
  exploreTitle: 'देखें', legalTitle: 'कानूनी जानकारी', aboutTitle: 'हमारे बारे में',
  aboutLine1: 'Meta Global AI Developer Hackathon 2026 के लिए अकेले बनाया गया।',
  aboutLine2: 'मार्गदर्शन WHO/UNICEF आहार-विविधता नियमों पर; आँकड़े: BBS-UNICEF MICS 2025।',
  disclaimerPageTitle: 'अस्वीकरण', privacyPageTitle: 'गोपनीयता नीति', termsPageTitle: 'उपयोग की शर्तें',
  disclaimerSummary: 'सार में: यह ऐप सिर्फ़ सीखने के लिए है, डॉक्टर का विकल्प नहीं। नतीजा हमेशा जाँचें, और बच्चा बीमार हो तो स्वास्थ्य कर्मी को दिखाएँ।',
  privacySummary: 'सार में: हमें सिर्फ़ थाली की फोटो और उम्र का समूह चाहिए। मेहमान मोड बिना खाते के चलता है। सिर्फ़ थाली की फोटो लें, बच्चे की नहीं।',
  termsSummary: 'सार में: यह एक मुफ़्त हैकाथॉन डेमो है, जैसा है वैसा दिया गया है। इसे सिर्फ़ मार्गदर्शन के लिए इस्तेमाल करें, लोगों की फोटो कभी न डालें।',
  footerRights: '© २०२६ पुष्टि थाली', footerBuilt: 'Meta Global AI Developer Hackathon के लिए बनाया गया', footerMade: 'Muse Spark, SAM 3.1 और Muse Image से बनाया गया',
  faqQ1: 'इसे कैसे इस्तेमाल करें?', faqA1: 'बच्चे की उम्र चुनकर थाली की फोटो लें। नतीजा तस्वीर और आवाज़ दोनों में मिलेगा।',
  faqQ2: 'क्या बच्चे की फोटो चाहिए?', faqA2: 'नहीं। सिर्फ़ थाली की फोटो लें — बच्चे की कभी नहीं।',
  faqQ3: 'क्या यह डॉक्टर की सलाह है?', faqA3: 'नहीं। यह सामान्य पोषण जानकारी है। बीमारी या कम बढ़त पर डॉक्टर या स्वास्थ्य कर्मी को दिखाएँ।',
  faqQ4: 'क्या कैलोरी बिल्कुल सही है?', faqA4: 'नहीं, कैलोरी एक अनुमानित अंदाज़ा है — सामान्य खाद्य आँकड़ों से हिसाब किया गया।',
  faqQ5: 'क्या खाता ज़रूरी है?', faqA5: 'नहीं। सब कुछ मेहमान के रूप में चलता है। खाता सिर्फ़ अपना इतिहास रखने के लिए है।',
  fullDetailsTitle: 'पूरी जानकारी', fdOnPlate: 'थाली में क्या है', fdMissing: 'क्या कमी है', fdAddNow: 'अभी जोड़ो',
  fdNextMeal: 'अगली बार का खाना', fdSummary: 'सारांश', fdAlternatives: 'या दे सकते हो:',
  fdNextMealLine: 'अगली बार:', fdNoneMissing: 'कोई कमी नहीं — हर तरह का खाना है!',
  fdAddNowGood: 'आज कुछ और जोड़ने की ज़रूरत नहीं। हर दिन ऐसे ही कई रंगों का खाना दो।',
  fdNextMealGood: 'अगली बार भी ऐसे ही कई रंगों का खाना दो।',
  fdEmptyFoods: 'कोई खाना पहचाना नहीं गया — ऊपर के आइकन दबाकर ठीक करो।',
  fdSummaryGood: 'बहुत बढ़िया! आज की थाली में {score} तरह का खाना है। ऐसे ही जारी रखो।',
  fdSummaryAdd: 'आज की थाली में {score} तरह का खाना है। सबसे ज़रूरी काम: {fix} जोड़ना।',
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
export interface Prefs {
  lang: Lang; country: string; onboarded: boolean;
  theme: 'light' | 'dark'; bigText: boolean; workerMode: boolean; reminder: boolean;
}
export function loadPrefs(): Prefs {
  try {
    const p = JSON.parse(localStorage.getItem(PREFS_KEY) ?? '{}');
    return {
      lang: p.lang ?? 'bn', country: p.country ?? 'Bangladesh', onboarded: !!p.onboarded,
      theme: p.theme === 'dark' ? 'dark' : 'light', bigText: !!p.bigText,
      workerMode: !!p.workerMode, reminder: !!p.reminder,
    };
  } catch {
    return { lang: 'bn', country: 'Bangladesh', onboarded: false, theme: 'light', bigText: false, workerMode: false, reminder: false };
  }
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
