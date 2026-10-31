import { toBangla, type PriorityFood, type Verdict } from './scoring';
import { SPOKEN, localizeNumber, type Lang } from './i18n';

// Locked templates (§8.1) in 3 languages — code fills {score} and {portion} only.
export function spokenMessage(
  verdict: Verdict,
  score: number,
  food: PriorityFood | null,
  lang: Lang = 'bn',
  portionPhrase = '',
): string {
  const portion = portionPhrase || (food ? foodName(food, lang) : '');
  return SPOKEN[lang][verdict]
    .replace('{score}', localizeNumber(score, lang))
    .replace('{portion}', portion);
}

function foodName(food: PriorityFood, lang: Lang): string {
  // Priority food names in 3 languages (display names only)
  const names: Record<string, Record<Lang, string>> = {
    eggs: { bn: 'ডিম', en: 'egg', hi: 'अंडा' },
    legumes: { bn: 'ডাল', en: 'dal', hi: 'दाल' },
    flesh: { bn: 'ছোট মাছ', en: 'small fish', hi: 'छोटी मछली' },
    vit_a_fruits_veg: { bn: 'মিষ্টি আলু / পেঁপে', en: 'sweet potato / papaya', hi: 'शकरकंद / पपीता' },
    dairy: { bn: 'দুধ', en: 'milk', hi: 'दूध' },
  };
  return names[food.group]?.[lang] ?? food.bangla;
}

let currentAudio: HTMLAudioElement | null = null;

function playBengaliMp3(verdict: Verdict, food: PriorityFood | null, onState: (s: boolean) => void) {
  const src =
    verdict === 'add_food' && food ? `/audio/add_food_${food.group}.mp3` : `/audio/${verdict}.mp3`;
  const audio = new Audio(src);
  currentAudio = audio;
  onState(true);
  audio.onended = audio.onerror = () => { currentAudio = null; onState(false); };
  audio.play().catch(() => { currentAudio = null; onState(false); });
}

/** Stop whatever is playing (result or library). Returns true if it stopped something. */
function stopAll(onState: (s: boolean) => void): boolean {
  if (currentAudio) { currentAudio.pause(); currentAudio = null; window.speechSynthesis?.cancel(); onState(false); return true; }
  if (window.speechSynthesis?.speaking) { window.speechSynthesis.cancel(); onState(false); return true; }
  return false;
}

function trySpeak(text: string, lang: Lang, onState: (s: boolean) => void): boolean {
  try {
    const voices = window.speechSynthesis?.getVoices() ?? [];
    const prefix = lang === 'bn' ? 'bn' : lang;
    const voice = voices.find((v) => v.lang?.toLowerCase().startsWith(prefix));
    if (!voice || !window.speechSynthesis) return false;
    const utter = new SpeechSynthesisUtterance(text);
    utter.voice = voice;
    utter.lang = lang === 'bn' ? 'bn-BD' : lang === 'hi' ? 'hi-IN' : 'en-US';
    utter.rate = 0.95;
    utter.onend = utter.onerror = () => onState(false);
    onState(true);
    window.speechSynthesis.speak(utter);
    return true;
  } catch { return false; }
}

export function speak(
  verdict: Verdict,
  score: number,
  food: PriorityFood | null,
  onState: (speaking: boolean) => void,
  lang: Lang = 'bn',
  portionPhrase = '',
) {
  if (stopAll(onState)) return;
  window.speechSynthesis?.cancel();
  const text = spokenMessage(verdict, score, food, lang, portionPhrase);
  if (trySpeak(text, lang, onState)) return;
  // No voice for the selected language → fall back to Bangla audio (§Phase 1)
  playBengaliMp3(verdict, food, onState);
}

/** Speak arbitrary text (library / home) in the selected language; Bangla audio has no
 *  generic MP3, so without a matching device voice it simply does nothing. */
export function speakText(text: string, onState: (speaking: boolean) => void, lang: Lang = 'bn') {
  if (stopAll(onState)) return;
  window.speechSynthesis?.cancel();
  trySpeak(text, lang, onState);
}

export { toBangla };
