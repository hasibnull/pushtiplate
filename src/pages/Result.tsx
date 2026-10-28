import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FOOD_GROUPS, scorePlate, toBangla } from '../lib/scoring';
import { getPlate } from '../lib/store';
import { saveAudit } from '../lib/supabase';
import { tomorrowPlate } from '../lib/api';
import { speak } from '../lib/speak';

export default function Result() {
  const navigate = useNavigate();
  const initial = useMemo(getPlate, []);
  const [groups, setGroups] = useState<string[]>(initial?.groups ?? []);
  const [speaking, setSpeaking] = useState(false);
  const [saved, setSaved] = useState(false);
  const [tomorrowUrl, setTomorrowUrl] = useState<string | null>(initial?.tomorrowUrl ?? null);
  const savedOnce = useRef(false);

  const { score, verdict, foodToAdd } = scorePlate(groups);

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
    <div className="px-4 py-5 flex flex-col gap-4">
      <div className={`rounded-[20px] px-4 py-3 text-center text-2xl font-bold ${banner.cls}`}>
        {banner.text}
      </div>

      <img src={initial.photoUrl} alt="থালা" className="w-full aspect-[4/3] object-cover rounded-[20px] shadow" />

      <div className="text-center">
        <div className="text-[64px] leading-none font-bold text-leaf">
          {toBangla(score)} / {toBangla(8)}
        </div>
        <p className="text-lg text-ink/70">ধরনের খাবার</p>
      </div>

      <div>
        <div className="grid grid-cols-4 gap-2">
          {FOOD_GROUPS.map((g) => {
            const present = groups.includes(g.id);
            return (
              <button
                key={g.id}
                onClick={() => toggle(g.id)}
                className={`min-h-[76px] rounded-2xl bg-white shadow p-1.5 flex flex-col items-center justify-center relative ${
                  present ? '' : 'opacity-40 grayscale'
                }`}
                aria-pressed={present}
              >
                {present && (
                  <span className="absolute top-1 right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    ✓
                  </span>
                )}
                <span className="text-3xl">{g.icon}</span>
                <span className="text-[11px] leading-tight text-center font-medium">{g.label}</span>
              </button>
            );
          })}
        </div>
        <p className="text-sm text-ink/60 text-center mt-2">যে আইকনে ভুল আছে, চাপ দিন</p>
      </div>

      <button
        onClick={() => speak(verdict, score, foodToAdd, setSpeaking)}
        className={`w-full min-h-16 rounded-[20px] bg-primary text-white text-2xl font-bold shadow-lg ${speaking ? 'speaking' : ''}`}
      >
        🔊 শুনুন
      </button>

      {showTomorrow && (
        <div className="bg-white rounded-[20px] shadow p-3">
          <div className="grid grid-cols-2 gap-2">
            <figure>
              <img src={initial.photoUrl} alt="আজ" className="w-full aspect-square object-cover rounded-xl" />
              <figcaption className="text-center font-bold mt-1">আজ</figcaption>
            </figure>
            <figure>
              {tomorrowUrl ? (
                <img src={tomorrowUrl} alt="কাল" className="w-full aspect-square object-cover rounded-xl" />
              ) : (
                <div className="w-full aspect-square rounded-xl bg-cream flex items-center justify-center text-5xl">
                  {foodToAdd.icon}
                </div>
              )}
              <figcaption className="text-center font-bold mt-1">কাল</figcaption>
            </figure>
          </div>
          <p className="text-center text-xl font-semibold mt-2">
            কাল যোগ করুন: {foodToAdd.icon} {foodToAdd.bangla}
          </p>
        </div>
      )}

      {verdict === 'see_worker' && (
        <div className="bg-[#FDECEA] border border-soft-red/40 rounded-[20px] p-4 text-center">
          <div className="text-4xl mb-1">👩‍⚕️</div>
          <p className="text-lg font-semibold text-soft-red">এই কার্ডটি আপনার স্বাস্থ্য সেবিকাকে দেখান</p>
        </div>
      )}

      <p className="text-xs text-center text-ink/60">
        এটি সাধারণ খাওয়ানোর তথ্য। চিকিৎসা পরামর্শ নয়।
      </p>

      <div className="flex items-center justify-between gap-3">
        <Link
          to="/"
          className="flex-1 min-h-14 rounded-[20px] border-2 border-primary text-primary font-bold text-lg flex items-center justify-center bg-white"
        >
          আরেকটি থালা
        </Link>
        {saved && <span className="text-primary font-semibold">সংরক্ষণ হয়েছে ✓</span>}
      </div>
    </div>
  );
}
