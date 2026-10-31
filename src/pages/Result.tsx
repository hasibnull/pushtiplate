import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BadgeCheck, Check, ChevronDown, Flame, HeartHandshake, PlusCircle, RotateCcw, Volume2 } from 'lucide-react';
import { FOOD_GROUPS, GROUP_IDS, scorePlate } from '../lib/scoring';
import { getPlate } from '../lib/store';
import { saveAudit } from '../lib/supabase';
import { tomorrowPlate } from '../lib/api';
import { speak } from '../lib/speak';
import { useLang } from '../lib/i18n';
import { GROUP_BENEFIT, GROUP_LABEL, GROUP_PORTION, foodById } from '../lib/library';
import { calorieTarget, plateNutrition } from '../lib/nutrition';
import FoodIcon from '../components/FoodIcon';
import ScoreRing from '../components/ScoreRing';
import CompareSlider from '../components/CompareSlider';
import Mascot from '../components/Mascot';
import Confetti from '../components/Confetti';

/** Soft tint per food group (tiles). */
const TINTS: Record<string, { bg: string; chip: string; fg: string }> = {
  breast_milk: { bg: '#FCE7F3', chip: '#F9A8D4', fg: '#9D174D' },
  grains: { bg: '#FEF3C7', chip: '#FCD34D', fg: '#92400E' },
  legumes: { bg: '#FFEDD5', chip: '#FDBA74', fg: '#9A3412' },
  dairy: { bg: '#E0F2FE', chip: '#7DD3FC', fg: '#075985' },
  flesh: { bg: '#FFE4E6', chip: '#FDA4AF', fg: '#9F1239' },
  eggs: { bg: '#FEF9C3', chip: '#FDE047', fg: '#854D0E' },
  vit_a_fruits_veg: { bg: '#FFEDD5', chip: '#FDBA74', fg: '#7C2D12' },
  other_fruits_veg: { bg: '#DCFCE7', chip: '#86EFAC', fg: '#166534' },
};

/** Display-only count-up (0 → score). Scoring itself is unchanged. */
function useCountUp(target: number, ms = 800) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / ms);
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return value;
}

export default function Result() {
  const { t, num, prefs } = useLang();
  const lang = prefs.lang;
  const navigate = useNavigate();
  const initial = useMemo(getPlate, []);
  const [groups, setGroups] = useState<string[]>(initial?.groups ?? []);
  const [speaking, setSpeaking] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [tomorrowUrl, setTomorrowUrl] = useState<string | null>(initial?.tomorrowUrl ?? null);
  const savedOnce = useRef(false);

  const { score, verdict, foodToAdd } = scorePlate(groups);
  const displayScore = useCountUp(score);
  const nutrition = useMemo(() => plateNutrition(initial?.foods ?? []), [initial]);
  const kcalTarget = calorieTarget(initial?.ageMonths ?? 14);
  const missing = GROUP_IDS.filter((g) => !groups.includes(g));
  const portionPhrase = foodToAdd ? GROUP_PORTION[foodToAdd.group][lang] : '';

  useEffect(() => {
    if (!initial) navigate('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save once when first shown (§6 Prompt 4); silent on failure
  useEffect(() => {
    if (!initial || savedOnce.current) return;
    savedOnce.current = true;
    saveAudit({
      child_age_months: initial.ageMonths,
      photo_url: initial.photoPath ?? initial.photoUrl,
      groups_found: initial.groups,
      score: scorePlate(initial.groups).score,
      verdict: scorePlate(initial.groups).verdict,
      food_to_add: scorePlate(initial.groups).foodToAdd?.group ?? null,
      tomorrow_image_url: initial.tomorrowUrl ?? null,
      source: initial.source,
    }).then(() => setSaved(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Tomorrow's plate (§6 Prompt 8) — live plates only; demo has baked-in image
  useEffect(() => {
    if (!initial || initial.source === 'demo') return;
    if (verdict !== 'add_food' && verdict !== 'see_worker') return;
    if (!foodToAdd) return;
    let live = true;
    tomorrowPlate(initial.photoDescription ?? 'rice, dal', foodToAdd.group).then((u) => {
      if (live) setTomorrowUrl(u);
    });
    return () => {
      live = false;
    };
  }, [initial, verdict, foodToAdd]);

  if (!initial) return null;

  const toggle = (id: string) =>
    setGroups((g) => (g.includes(id) ? g.filter((x) => x !== id) : [...g, id]));

  const banner =
    verdict === 'good'
      ? {
          cls: 'text-white',
          bg: 'linear-gradient(100deg, #14532D, #1E7A46)',
          text: t('verdictGood'),
          Icon: BadgeCheck,
          ring: '#1E7A46',
        }
      : verdict === 'see_worker'
        ? {
            cls: 'text-white',
            bg: 'linear-gradient(100deg, #B03A2E, #DC4A3A)',
            text: t('verdictAdd'),
            Icon: HeartHandshake,
            ring: '#DC4A3A',
          }
        : {
            cls: 'text-ink',
            bg: 'linear-gradient(100deg, #FBBF24, #F59E0B)',
            text: t('verdictAdd'),
            Icon: PlusCircle,
            ring: '#F59E0B',
          };

  const showTomorrow = verdict !== 'good' && foodToAdd;
  const foodName = foodToAdd ? (foodById(foodToAdd.group === 'eggs' ? 'egg' : foodToAdd.group === 'legumes' ? 'dal' : foodToAdd.group === 'flesh' ? 'small-fish' : foodToAdd.group === 'dairy' ? 'milk' : 'sweet-potato')?.name[lang] ?? GROUP_LABEL[foodToAdd.group][lang]) : '';

  return (
    <div className="w-full px-4 sm:px-8 lg:px-16 2xl:px-24 py-5 lg:py-10 flex flex-col gap-5 lg:gap-8 relative">
      <Confetti show={verdict === 'good'} />
      <div className="grid gap-5 lg:gap-8 lg:grid-cols-2 lg:items-stretch">
        {/* Left: plate photo */}
        <figure className="glass-card rounded-3xl p-3 flex min-w-0">
          <img
            src={initial.photoUrl}
            alt={t('today')}
            className="w-full h-full min-h-72 object-cover rounded-2xl"
          />
        </figure>

        {/* Right: banner, score, tiles, listen */}
        <section className="flex flex-col gap-5">
          <div className="glass-card rounded-3xl p-5 flex flex-col sm:flex-row items-center gap-5">
            <ScoreRing score={score} color={banner.ring} displayScore={displayScore} />
            <div
              className={`rounded-3xl px-5 py-4 flex sm:flex-col items-center gap-3 text-center grow w-full ${banner.cls}`}
              style={{ background: banner.bg }}
            >
              <banner.Icon size={52} strokeWidth={1.6} aria-hidden />
              <span className="text-2xl lg:text-3xl font-bold">{banner.text}</span>
            </div>
            <Mascot mood={score >= 5 ? 'happy' : score >= 3 ? 'encourage' : 'caring'} size={92} />
          </div>

          <div>
            <div className="grid grid-cols-4 gap-2 lg:gap-3">
              {FOOD_GROUPS.map((g, i) => {
                const present = groups.includes(g.id);
                const tint = TINTS[g.id];
                return (
                  <button
                    key={g.id}
                    onClick={() => toggle(g.id)}
                    style={{
                      animationDelay: `${i * 70}ms`,
                      ...(present ? { background: tint.bg } : {}),
                    }}
                    className={`tile-pop tile-tap btn-press relative h-full min-h-[84px] lg:min-h-[104px] rounded-2xl p-2 flex flex-col items-center justify-center gap-1.5 ${
                      present
                        ? 'shadow-sm border border-white/70'
                        : 'bg-white/70 border-2 border-dashed border-ink/20'
                    }`}
                    aria-pressed={present}
                  >
                    {present && (
                      <span className="check-pop absolute top-1.5 right-1.5 bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center z-10">
                        <Check size={13} strokeWidth={3.5} aria-hidden />
                      </span>
                    )}
                    <span
                      className="w-11 h-11 lg:w-12 lg:h-12 rounded-2xl flex items-center justify-center"
                      style={{
                        background: present ? tint.chip : 'rgba(31,41,55,0.06)',
                        color: present ? tint.fg : 'rgba(31,41,55,0.38)',
                      }}
                    >
                      <FoodIcon group={g.id} size={28} />
                    </span>
                    <span
                      className={`text-[11px] lg:text-xs leading-tight text-center font-medium ${
                        present ? 'text-ink' : 'text-ink/45'
                      }`}
                    >
                      {GROUP_LABEL[g.id][lang]}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-sm text-ink/60 text-center mt-3">{t('tapToFix')}</p>
          </div>

          <button
            onClick={() => speak(verdict, score, foodToAdd, setSpeaking, lang, portionPhrase)}
            className={`btn-press btn-lift btn-primary-glow w-full min-h-16 rounded-3xl text-white text-2xl font-bold flex items-center justify-center gap-3 ${speaking ? 'speaking' : ''}`}
          >
            <Volume2 size={30} aria-hidden /> {t('listen')}
          </button>
        </section>
      </div>

      {/* Calorie meter — static data only, always labelled approximate (Phase 3) */}
      <section className="glass-card rounded-3xl p-5 lg:p-6 flex flex-col gap-3">
        <h2 className="text-xl font-bold text-leaf flex items-center gap-2">
          <Flame size={26} className="text-amber-warm" aria-hidden /> {t('calorieTitle')}
        </h2>
        <div className="h-7 rounded-full bg-primary/10 overflow-hidden" role="img" aria-label={`${num(nutrition.kcal)} / ${num(kcalTarget)}`}>
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${Math.min(100, kcalTarget ? (nutrition.kcal / kcalTarget) * 100 : 0)}%`,
              background: 'linear-gradient(90deg, #F59E0B, #1E7A46)',
            }}
          />
        </div>
        <p className="text-lg font-semibold">
          {num(nutrition.kcal)} / {num(kcalTarget)} {t('kcalPerDay')}
          <span className="block text-sm font-medium text-ink/60">{t('approxIdea')} · {t('protein')}: {num(nutrition.proteinG)} g</span>
        </p>

        {missing.length > 0 && (
          <div className="mt-1">
            <h3 className="font-bold text-lg">{t('stillNeeded')}</h3>
            <ul className="flex flex-col gap-2 mt-2">
              {missing.map((g) => {
                const isNext = foodToAdd?.group === g;
                return (
                  <li
                    key={g}
                    className={`rounded-2xl px-4 py-3 min-h-14 flex items-center gap-3 ${
                      isNext ? 'bg-amber-warm/20 border-2 border-amber-warm font-semibold added-glow' : 'bg-white/60 border border-ink/10'
                    }`}
                  >
                    <FoodIcon group={g} size={24} className={isNext ? 'text-amber-warm' : 'text-ink/50'} />
                    <span className="grow">
                      {GROUP_LABEL[g][lang]} — {GROUP_PORTION[g][lang]}
                    </span>
                    {isNext && <span className="text-xs bg-amber-warm text-ink font-bold rounded-full px-2.5 py-1">{t('nextStep')}</span>}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <button
          onClick={() => setShowDetails((v) => !v)}
          className="btn-press self-start min-h-14 px-4 rounded-2xl border-2 border-primary/30 text-primary font-bold flex items-center gap-2 bg-white/70"
          aria-expanded={showDetails}
        >
          <ChevronDown size={22} className={`transition-transform ${showDetails ? 'rotate-180' : ''}`} aria-hidden />
          {t('details')}
        </button>
        {showDetails && (
          <ul className="flex flex-col gap-2 fade-in-soft">
            {GROUP_IDS.map((g) => {
              const present = groups.includes(g);
              const foundNames = (initial.foods ?? [])
                .filter((f) => f.group === g)
                .map((f) => f.name)
                .join(', ');
              return (
                <li key={g} className="rounded-2xl bg-white/60 border border-ink/10 px-4 py-3">
                  <p className="font-semibold flex items-center gap-2">
                    <FoodIcon group={g} size={20} className={present ? 'text-primary' : 'text-ink/40'} />
                    {GROUP_LABEL[g][lang]}
                    <span className={`text-xs font-bold rounded-full px-2 py-0.5 ${present ? 'bg-primary/15 text-leaf' : 'bg-ink/10 text-ink/50'}`}>
                      {present ? t('foundOnPlate') : t('notOnPlate')}
                    </span>
                  </p>
                  {foundNames && <p className="text-sm text-ink/70 mt-0.5">{foundNames}</p>}
                  <p className="text-sm text-ink/70">{GROUP_BENEFIT[g][lang]}</p>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {showTomorrow && (
        <section className="glass-card rounded-3xl p-4 lg:p-6 fade-in-soft">
          <CompareSlider
            beforeSrc={initial.photoUrl}
            beforeLabel={t('today')}
            afterLabel={t('tomorrow')}
            after={
              tomorrowUrl ? (
                <img src={tomorrowUrl} alt={t('tomorrow')} className="w-full h-full object-cover" draggable={false} />
              ) : (
                <div className="w-full h-full bg-cream text-amber-warm flex items-center justify-center">
                  <FoodIcon group={foodToAdd.group} size={96} />
                </div>
              )
            }
          />
          <p className="flex items-center justify-center gap-2 text-center text-xl font-semibold mt-4">
            {t('addTomorrow')}
            <span className="text-amber-warm inline-flex">
              <FoodIcon group={foodToAdd.group} size={26} />
            </span>
            {foodName}
          </p>
        </section>
      )}

      {verdict === 'see_worker' && (
        <div className="bg-[#FDECEA] border border-soft-red/40 rounded-3xl p-5 text-center fade-in-soft">
          <HeartHandshake size={44} className="mx-auto text-soft-red" aria-hidden />
          <p className="text-lg font-semibold text-soft-red mt-2">{t('showWorker')}</p>
        </div>
      )}

      <p className="text-xs text-center text-ink/60">{t('disclaimer')}</p>

      <div className="flex items-center justify-between gap-3 pb-4">
        <Link
          to="/"
          className="btn-press btn-lift flex-1 min-h-14 rounded-3xl border-2 border-primary text-primary font-bold text-lg flex items-center justify-center gap-2 bg-white"
        >
          <RotateCcw size={22} aria-hidden /> {t('anotherPlate')}
        </Link>
        {saved && (
          <span className="text-primary font-semibold">{t('saved')}</span>
        )}
      </div>
    </div>
  );
}
