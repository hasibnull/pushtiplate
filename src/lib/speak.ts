import { toBangla, type PriorityFood, type Verdict } from './scoring';

// Locked templates (§8.1) — code fills {score} and {food} only. Never AI-written.
export function spokenMessage(verdict: Verdict, score: number, food: PriorityFood | null): string {
  const s = toBangla(score);
  if (verdict === 'good')
    return `দারুণ! আজকের থালায় ${s} ধরনের খাবার আছে। এভাবেই চালিয়ে যান। প্রতিদিন নানা রঙের খাবার দিন।`;
  if (verdict === 'see_worker')
    return `আজকের থালায় মাত্র ${s} ধরনের খাবার আছে। পরের সাক্ষাতে এই কার্ডটি স্বাস্থ্য সেবিকাকে দেখান। তিনি সাহায্য করবেন।`;
  return `আজকের থালায় ${s} ধরনের খাবার আছে। কাল ${food?.bangla ?? ''} যোগ করুন। একটু একটু করে নতুন খাবারে অভ্যস্ত করুন।`;
}

let currentAudio: HTMLAudioElement | null = null;

export function speak(
  verdict: Verdict,
  score: number,
  food: PriorityFood | null,
  onState: (speaking: boolean) => void,
) {
  // Tapping again stops (§6 Prompt 7)
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
    window.speechSynthesis?.cancel();
    onState(false);
    return;
  }
  window.speechSynthesis?.cancel();

  const fallback = () => {
    const src =
      verdict === 'add_food' && food
        ? `/audio/add_food_${food.group}.mp3`
        : `/audio/${verdict}.mp3`;
    const audio = new Audio(src);
    currentAudio = audio;
    onState(true);
    audio.onended = audio.onerror = () => {
      currentAudio = null;
      onState(false);
    };
    audio.play().catch(() => {
      currentAudio = null;
      onState(false);
    });
  };

  try {
    const voices = window.speechSynthesis?.getVoices() ?? [];
    const bn = voices.find((v) => v.lang?.toLowerCase().startsWith('bn'));
    if (!bn || !window.speechSynthesis) return fallback();
    const utter = new SpeechSynthesisUtterance(spokenMessage(verdict, score, food));
    utter.voice = bn;
    utter.lang = 'bn-BD';
    utter.rate = 0.95;
    utter.onend = utter.onerror = () => onState(false);
    onState(true);
    window.speechSynthesis.speak(utter);
  } catch {
    fallback();
  }
}
