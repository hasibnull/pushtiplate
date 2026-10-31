import { useMemo, useRef, useState } from 'react';
import { Eraser, Sparkles, Volume2 } from 'lucide-react';
import { GROUP_IDS, scorePlate } from '../lib/scoring';
import { GROUP_LABEL, GROUP_PORTION, LIBRARY_FOODS, foodById } from '../lib/library';
import { speak } from '../lib/speak';
import { useLang } from '../lib/i18n';
import FoodIcon from '../components/FoodIcon';
import ScoreRing from '../components/ScoreRing';
import Mascot, { type MascotMood } from '../components/Mascot';
import Confetti from '../components/Confetti';

const GROUP_TILE: Record<string, string> = {
  breast_milk: '#FCE7F3', grains: '#FEF3C7', legumes: '#FFEDD5', dairy: '#E0F2FE',
  flesh: '#FFE4E6', eggs: '#FEF9C3', vit_a_fruits_veg: '#FFEDD5', other_fruits_veg: '#DCFCE7',
};

export default function Playground() {
  const { t, num, prefs } = useLang();
  const lang = prefs.lang;
  const [picked, setPicked] = useState<string[]>([]);
  const [mood, setMood] = useState<MascotMood>('idle');
  const [party, setParty] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const moodTimer = useRef<number | null>(null);

  const groups = useMemo(
    () => [...new Set(picked.map((id) => foodById(id)?.group).filter(Boolean) as string[])],
    [picked],
  );
  const { score, verdict, foodToAdd } = scorePlate(groups);
  const kcal = picked.reduce((s, id) => s + (foodById(id)?.kcal ?? 0), 0);
  const protein = picked.reduce((s, id) => s + (foodById(id)?.proteinG ?? 0), 0);

  const flashMood = (m: MascotMood, ms = 1600) => {
    setMood(m);
    if (moodTimer.current) window.clearTimeout(moodTimer.current);
    moodTimer.current = window.setTimeout(() => setMood('idle'), ms);
  };

  const add = (id: string) => {
    if (picked.includes(id)) return;
    const next = [...picked, id];
    setPicked(next);
    const newGroups = [...new Set(next.map((x) => foodById(x)?.group).filter(Boolean) as string[])];
    if (next.length === 1) flashMood('happy');                    // first food → wave
    if (scorePlate(newGroups).score >= 5) {                        // 5/8 → celebration
      flashMood('happy', 2400);
      setParty(true);
      window.setTimeout(() => setParty(false), 2400);
    }
  };
  const remove = (id: string) => {
    setPicked(picked.filter((x) => x !== id));
    flashMood('caring', 1400);                                     // removal → gentle
  };

  const addSuggested = () => {
    if (!foodToAdd) return;
    const candidate = LIBRARY_FOODS.find((f) => f.group === foodToAdd.group && !picked.includes(f.id));
    if (candidate) add(candidate.id);
  };

  return (
    <div className="w-full px-4 sm:px-8 lg:px-16 2xl:px-24 py-5 lg:py-10 flex flex-col gap-5 relative">
      <Confetti show={party} />
      <h1 className="text-3xl lg:text-4xl font-bold text-leaf">{t('playTitle')}</h1>

      <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
        {/* The plate */}
        <section className="glass-card rounded-3xl p-5 flex flex-col items-center gap-4">
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full bg-white shadow-[inset_0_0_0_10px_#F3EAD9,inset_0_10px_30px_rgba(20,83,45,0.10)] flex items-center justify-center">
            {picked.length === 0 ? (
              <div className="flex flex-col items-center gap-1 px-8 text-center">
                <Mascot mood={mood} size={92} />
                <p className="text-ink/60 font-medium">{t('tapFoodHint')}</p>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-center gap-2 p-8 max-w-[17rem]">
                {picked.map((id) => {
                  const f = foodById(id)!;
                  return (
                    <button
                      key={id}
                      onClick={() => remove(id)}
                      className="tile-pop btn-press flex flex-col items-center gap-0.5 w-[4.4rem]"
                      aria-label={f.name[lang]}
                    >
                      {f.image ? (
                        <img src={f.image} alt="" className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow" />
                      ) : (
                        <span className="w-14 h-14 rounded-full flex items-center justify-center ring-2 ring-white shadow" style={{ background: GROUP_TILE[f.group], color: '#14532D' }}>
                          <FoodIcon group={f.group} size={26} />
                        </span>
                      )}
                      <span className="text-[11px] font-semibold leading-tight text-center">{f.name[lang]}</span>
                    </button>
                  );
                })}
              </div>
            )}
            {picked.length > 0 && (
              <span className="absolute -top-1 -right-1"><Mascot mood={mood} size={62} /></span>
            )}
          </div>

          <div className="flex gap-2 flex-wrap justify-center">
            <button
              onClick={() => { setPicked([]); flashMood('caring', 1200); }}
              className="btn-press min-h-14 px-5 rounded-full border-2 border-soft-red/50 bg-[#FFE4E6] text-[#9F1239] font-bold flex items-center gap-2"
            >
              <Eraser size={21} aria-hidden /> {t('clearPlate')}
            </button>
            <button
              onClick={() => speak(verdict, score, foodToAdd, setSpeaking, lang, foodToAdd ? GROUP_PORTION[foodToAdd.group][lang] : '')}
              className={`btn-press btn-lift btn-primary-glow min-h-14 px-6 rounded-full text-white text-lg font-bold flex items-center gap-2 ${speaking ? 'speaking' : ''}`}
            >
              <Volume2 size={23} aria-hidden /> {t('listen')}
            </button>
          </div>
        </section>

        {/* Live feedback — same scorer as the real result */}
        <section className="flex flex-col gap-4">
          <div className="glass-card rounded-3xl p-5 flex items-center gap-5">
            <ScoreRing score={score} color={score >= 5 ? '#1E7A46' : score >= 3 ? '#F59E0B' : '#DC4A3A'} displayScore={score} />
            <div className="flex flex-col gap-1">
              <p className="text-lg font-semibold">
                {num(kcal)} kcal · {t('protein')} {num(protein)} g
                <span className="block text-xs font-medium text-ink/50">{t('approxIdea')}</span>
              </p>
              {foodToAdd ? (
                <button
                  onClick={addSuggested}
                  className="btn-press added-glow mt-2 min-h-14 px-4 rounded-2xl bg-amber-warm/20 border-2 border-amber-warm font-bold flex items-center gap-2 text-left"
                >
                  <Sparkles size={21} className="text-amber-warm shrink-0" aria-hidden />
                  {t('addNext')}: {GROUP_LABEL[foodToAdd.group][lang]}
                </button>
              ) : (
                <p className="font-bold text-primary text-lg mt-1">{t('verdictGood')}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {GROUP_IDS.map((g) => {
              const on = groups.includes(g);
              return (
                <div
                  key={g}
                  className={`rounded-2xl p-2 min-h-[74px] flex flex-col items-center justify-center gap-1 text-center transition-all duration-300 ${
                    on ? 'shadow-sm' : 'bg-white/60 border-2 border-dashed border-ink/15 opacity-60'
                  }`}
                  style={on ? { background: GROUP_TILE[g] } : undefined}
                >
                  <FoodIcon group={g} size={24} className={on ? 'text-leaf' : 'text-ink/40'} />
                  <span className="text-[11px] font-medium leading-tight">{GROUP_LABEL[g][lang]}</span>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Food tray */}
      <section>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-8 gap-3">
          {LIBRARY_FOODS.map((f) => {
            const on = picked.includes(f.id);
            return (
              <button
                key={f.id}
                onClick={() => (on ? remove(f.id) : add(f.id))}
                aria-pressed={on}
                className={`btn-press elev-card glass-card rounded-3xl overflow-hidden flex flex-col text-left ${
                  on ? 'ring-4 ring-primary/60' : ''
                }`}
              >
                {f.image ? (
                  <img src={f.image} alt="" className="w-full aspect-square object-cover" loading="lazy" />
                ) : (
                  <span className="w-full aspect-square flex items-center justify-center" style={{ background: GROUP_TILE[f.group], color: '#14532D' }}>
                    <FoodIcon group={f.group} size={44} />
                  </span>
                )}
                <span className="px-2.5 py-2 flex flex-col">
                  <span className="font-bold text-sm leading-tight">{f.name[lang]}</span>
                  <span className="text-[11px] text-ink/55">{num(f.kcal)} kcal</span>
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
