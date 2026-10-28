import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, HeartHandshake, RotateCcw, Volume2 } from 'lucide-react';
import { FOOD_GROUPS, scorePlate, toBangla } from '../lib/scoring';
import { getPlate } from '../lib/store';
import { saveAudit } from '../lib/supabase';
import { tomorrowPlate } from '../lib/api';
import { speak } from '../lib/speak';
import FoodIcon from '../components/FoodIcon';

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
  const navigate = useNavigate();
  const initial = useMemo(getPlate, []);
  const [groups, setGroups] = useState<string[]>(initial?.groups ?? []);
  const [speaking, setSpeaking] = useState(false);
  const [saved, setSaved] = useState(false);
  const [tomorrowUrl, setTomorrowUrl] = useState<string | null>(initial?.tomorrowUrl ?? null);
  const savedOnce = useRef(false);

  const { score, verdict, foodToAdd } = scorePlate(groups);
  const displayScore = useCountUp(score);

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
      ? { cls: 'bg-primary text-white', text: 'দারুণ!' }
      : verdict === 'see_worker'
        ? { cls: 'bg-[#FDECEA] text-soft-red', text: 'আর একটু হলেই হবে' }
        : { cls: 'bg-amber-warm text-ink', text: 'আর একটু হলেই হবে' };

  const showTomorrow = verdict !== 'good' && foodToAdd;

  return (
    <div className="w-full px-4 sm:px-8 lg:px-16 2xl:px-24 py-5 lg:py-10 flex flex-col gap-5 lg:gap-8">
      <div className="grid gap-5 lg:gap-8 lg:grid-cols-2 lg:items-stretch">
        {/* Left: plate photo */}
        <figure className="bg-white rounded-3xl elev-card p-3 flex min-w-0">
          <img
            src={initial.photoUrl}
            alt="থালা"
            className="w-full h-full min-h-72 object-cover rounded-2xl"
          />
        </figure>

        {/* Right: banner, score, tiles, listen */}
        <section className="flex flex-col gap-5">
          <div className={`rounded-3xl px-4 py-4 text-center text-2xl font-bold shadow-sm ${banner.cls}`}>
            {banner.text}
          </div>

          <div className="text-center bg-white rounded-3xl shadow-sm py-4">
            <div className="text-[64px] lg:text-[88px] leading-none font-bold text-leaf tabular-nums">
              {toBangla(displayScore)} / {toBangla(8)}
            </div>
            <p className="text-lg text-ink/60 mt-1">ধরনের খাবার</p>
          </div>

          <div>
            <div className="grid grid-cols-4 gap-2 lg:gap-3">
              {FOOD_GROUPS.map((g, i) => {
                const present = groups.includes(g.id);
                return (
                  <button
                    key={g.id}
                    onClick={() => toggle(g.id)}
                    style={{ animationDelay: `${i * 70}ms` }}
                    className={`tile-pop btn-press relative h-full min-h-[84px] lg:min-h-[104px] rounded-2xl bg-white shadow-sm p-2 flex flex-col items-center justify-center gap-1 text-leaf ${
                      present ? '' : 'opacity-40 grayscale'
                    }`}
                    aria-pressed={present}
                  >
                    {present && (
                      <span className="check-pop absolute top-1.5 right-1.5 bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center">
                        <Check size={13} strokeWidth={3.5} aria-hidden />
                      </span>
                    )}
                    <FoodIcon group={g.id} size={32} />
                    <span className="text-[11px] lg:text-xs leading-tight text-center font-medium text-ink">
                      {g.label}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-sm text-ink/60 text-center mt-3">যে আইকনে ভুল আছে, চাপ দিন</p>
          </div>

          <button
            onClick={() => speak(verdict, score, foodToAdd, setSpeaking)}
            className={`btn-press btn-lift w-full min-h-16 rounded-3xl bg-primary text-white text-2xl font-bold shadow-lg flex items-center justify-center gap-3 ${speaking ? 'speaking' : ''}`}
          >
            <Volume2 size={30} aria-hidden /> শুনুন
          </button>
        </section>
      </div>

      {showTomorrow && (
        <section className="bg-white rounded-3xl elev-card p-4 lg:p-6 fade-in-soft">
          <div className="grid grid-cols-2 gap-3 lg:gap-5">
            <figure>
              <img src={initial.photoUrl} alt="আজ" className="w-full aspect-square lg:aspect-[16/10] object-cover rounded-2xl" />
              <figcaption className="text-center font-bold text-lg mt-2">আজ</figcaption>
            </figure>
            <figure>
              {tomorrowUrl ? (
                <img
                  src={tomorrowUrl}
                  alt="কাল"
                  className="added-glow w-full aspect-square lg:aspect-[16/10] object-cover rounded-2xl"
                />
              ) : (
                <div className="added-glow w-full aspect-square lg:aspect-[16/10] rounded-2xl bg-cream text-amber-warm flex items-center justify-center">
                  <FoodIcon group={foodToAdd.group} size={72} />
                </div>
              )}
              <figcaption className="text-center font-bold text-lg mt-2">কাল</figcaption>
            </figure>
          </div>
          <p className="flex items-center justify-center gap-2 text-center text-xl font-semibold mt-4">
            কাল যোগ করুন:
            <span className="text-amber-warm inline-flex">
              <FoodIcon group={foodToAdd.group} size={26} />
            </span>
            {foodToAdd.bangla}
          </p>
        </section>
      )}

      {verdict === 'see_worker' && (
        <div className="bg-[#FDECEA] border border-soft-red/40 rounded-3xl p-5 text-center fade-in-soft">
          <HeartHandshake size={44} className="mx-auto text-soft-red" aria-hidden />
          <p className="text-lg font-semibold text-soft-red mt-2">এই কার্ডটি আপনার স্বাস্থ্য সেবিকাকে দেখান</p>
        </div>
      )}

      <p className="text-xs text-center text-ink/60">এটি সাধারণ খাওয়ানোর তথ্য। চিকিৎসা পরামর্শ নয়।</p>

      <div className="flex items-center justify-between gap-3 pb-4">
        <Link
          to="/"
          className="btn-press btn-lift flex-1 min-h-14 rounded-3xl border-2 border-primary text-primary font-bold text-lg flex items-center justify-center gap-2 bg-white"
        >
          <RotateCcw size={22} aria-hidden /> আরেকটি থালা
        </Link>
        {saved && (
          <span className="text-primary font-semibold">সংরক্ষণ হয়েছে ✓</span>
        )}
      </div>
    </div>
  );
}
