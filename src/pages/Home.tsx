import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Camera, Gamepad2, Images, Languages, Lock, Play, Puzzle, Search, Trophy, UtensilsCrossed, Volume2 } from 'lucide-react';
import { getAge, setAge, setPlate, isDemo } from '../lib/store';
import { SAMPLES } from '../lib/demo';
import { downscale, analyzePlate } from '../lib/api';
import { uploadPlate } from '../lib/supabase';
import { speakText } from '../lib/speak';
import { useLang } from '../lib/i18n';
import AnalysingOverlay from '../components/AnalysingOverlay';
import Mascot from '../components/Mascot';
import FoodIcon from '../components/FoodIcon';
import { challengeDoneToday, todaysMission } from '../lib/fun';
import { foodById } from '../lib/library';

const AGES = [
  { range: '6–11', months: 9 },
  { range: '12–17', months: 14 },
  { range: '18–23', months: 20 },
];

const SAMPLE_NAMES: Record<keyof typeof SAMPLES, string> = {
  hero: 'sampleHero',
  good: 'sampleGood',
  low: 'sampleLow',
};

/** Orbiting food chips around the mascot stage (accent palette lives here only). */
const FLOATERS = [
  { group: 'eggs', bg: '#FEF9C3', fg: '#854D0E', cls: 'left-1/2 -translate-x-1/2 -top-1' },
  { group: 'flesh', bg: '#FFE4E6', fg: '#9F1239', cls: 'top-1/2 -translate-y-1/2 -right-1' },
  { group: 'other_fruits_veg', bg: '#DCFCE7', fg: '#166534', cls: 'left-1/2 -translate-x-1/2 -bottom-1' },
  { group: 'vit_a_fruits_veg', bg: '#FFEDD5', fg: '#9A3412', cls: 'top-1/2 -translate-y-1/2 -left-1' },
] as const;

type Phase = 'idle' | 'uploading' | 'analysing' | 'error';

export default function Home() {
  const { t, num, prefs } = useLang();
  const navigate = useNavigate();
  const [age, setAgeState] = useState(getAge());
  const [phase, setPhase] = useState<Phase>('idle');
  const [localPhoto, setLocalPhoto] = useState<string | null>(null);
  const [slow, setSlow] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const pendingFile = useRef<File | null>(null);

  // Scroll-triggered reveals (premium motion, no library)
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) || els.length === 0) {
      els.forEach((el) => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }),
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const STEPS = [
    { icon: Camera, bg: '#E0F2FE', fg: '#0284C7', title: t('takePhoto'), desc: t('stepPhotoDesc') },
    { icon: Search, bg: '#EDE9FE', fg: '#7C3AED', title: t('findingFoods'), desc: t('stepFindDesc') },
    { icon: Volume2, bg: '#FFE4E6', fg: '#E11D48', title: t('listen'), desc: t('stepListenDesc') },
  ];

  const STATS = [
    { icon: UtensilsCrossed, bg: '#DCFCE7', fg: '#15803D', value: num(8), label: t('statGroups') },
    { icon: Languages, bg: '#EDE9FE', fg: '#7C3AED', value: num(3), label: t('statLangs') },
    { icon: Camera, bg: '#E0F2FE', fg: '#0284C7', value: num(1), label: t('statPhoto') },
  ];

  const pickAge = (months: number) => {
    setAge(months);
    setAgeState(months);
  };

  async function handleFile(file: File) {
    pendingFile.current = file;
    const objectUrl = URL.createObjectURL(file);
    setLocalPhoto(objectUrl);
    setPhase('uploading');
    setSlow(false);
    const slowTimer = window.setTimeout(() => setSlow(true), 10000);
    try {
      const blob = await downscale(file);
      const uploaded = await uploadPlate(blob);
      setPhase('analysing');
      if (uploaded) {
        // Validate → retry once → correction-tap fallback (§5.3)
        const result =
          (await analyzePlate(uploaded.signedUrl, age)) ??
          (await analyzePlate(uploaded.signedUrl, age));
        setPlate({
          photoUrl: uploaded.signedUrl,
          photoPath: uploaded.path,
          ageMonths: age,
          groups: result?.groups ?? [],
          foods: result?.foods ?? [],
          photoDescription: (result?.foods ?? []).map((f) => f.name).join(', ') || undefined,
          source: 'live',
        });
      } else {
        // Supabase not connected yet: still show result, user can tap icons
        setPlate({ photoUrl: objectUrl, ageMonths: age, groups: [], foods: [], source: 'live' });
      }
      navigate('/result');
    } catch {
      setPhase('error'); // photo kept locally, retry only (§5.6)
    } finally {
      window.clearTimeout(slowTimer);
    }
  }

  const onSample = (key: keyof typeof SAMPLES) => {
    setPlate({ ...SAMPLES[key], ageMonths: age });
    navigate('/result');
  };

  if (phase === 'uploading' || phase === 'analysing') {
    return (
      <div className="w-full px-4 sm:px-8 lg:px-16 2xl:px-24">
        <AnalysingOverlay
          photoUrl={localPhoto ?? ''}
          text={phase === 'uploading' ? t('uploading') : slow ? t('waitMore') : t('findingFoods')}
        />
      </div>
    );
  }

  return (
    <div className="w-full">
    <div className="w-full px-4 sm:px-8 lg:px-16 2xl:px-24 py-5 lg:py-12 grid gap-8 lg:grid-cols-2 lg:gap-12 lg:items-start">
      {/* Left: intro, how-it-works step cards, impact strip (desktop hero) */}
      <section className="hidden lg:flex flex-col gap-6 lg:pt-2">
        <div className="screen-enter" style={{ animationDelay: '0ms' }}>
          <h1 className="text-[56px] xl:text-[64px] font-extrabold leading-[1.04]">
            <span className="gradient-text">{t('appName')}</span>
          </h1>
          <p className="text-xl text-ink/70 mt-3 max-w-md leading-relaxed">{t('tagline')}</p>
          <p className="text-sm text-ink/60 flex items-center gap-2 mt-4">
            <Lock size={15} aria-hidden /> {t('privacyLine')}
          </p>
        </div>

        {/* Mascot stage: glow disc + slow orbit ring + floating result preview */}
        <div className="screen-enter relative self-start ml-2" style={{ animationDelay: '80ms' }}>
          <div aria-hidden className="absolute inset-4 rounded-full" style={{ background: 'radial-gradient(circle at 50% 42%, rgba(245,158,11,0.28), rgba(30,122,70,0.14) 55%, transparent 72%)' }} />
          <div className="relative w-[228px] h-[228px]">
            <div aria-hidden className="absolute inset-0 rounded-full border-2 border-dashed border-primary/20" />
            <div aria-hidden className="orbit-ring absolute inset-0">
              {FLOATERS.map((f) => (
                <span key={f.group} className={`absolute ${f.cls} w-11 h-11`}>
                  <span className="orbit-chip w-11 h-11 rounded-2xl flex items-center justify-center shadow-l1 border border-white/70" style={{ background: f.bg, color: f.fg }}>
                    <FoodIcon group={f.group} size={23} />
                  </span>
                </span>
              ))}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Mascot mood="idle" size={124} />
            </div>
          </div>
          <div className="absolute -bottom-3 left-[132px] z-10 glass-card rounded-2xl px-3.5 py-2.5 shadow-l3 flex items-center gap-2.5 whitespace-nowrap">
            <span className="tnum text-lg font-extrabold text-leaf leading-none">{num(6)}/{num(8)}</span>
            <span className="text-xs text-ink/60 font-medium leading-tight">{t('kindsOfFood')}</span>
            <span className="text-xs font-bold rounded-full px-2 py-1" style={{ background: '#FEF9C3', color: '#854D0E' }}>
              {t('addNext')}: {foodById('egg')?.name[prefs.lang]}
            </span>
          </div>
        </div>

        <div className="relative">
          <div aria-hidden className="absolute left-[30px] top-8 bottom-8 border-l-2 border-dashed border-primary/30" />
          <ol className="flex flex-col gap-3 relative">
            {STEPS.map((s, i) => (
              <li
                key={s.title}
                style={{ animationDelay: `${160 + i * 75}ms` }}
                className="screen-enter glass-card rounded-3xl p-4 flex items-center gap-4 min-h-20"
              >
                <span
                  className="w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center shadow-inner"
                  style={{ background: s.bg, color: s.fg }}
                >
                  <s.icon size={29} aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block font-bold text-xl text-leaf">
                    {num(i + 1)}. {s.title}
                  </span>
                  <span className="block text-sm text-ink/60">{s.desc}</span>
                </span>
                <span
                  className="check-pop ml-auto w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shrink-0"
                  style={{ animationDelay: `${0.35 + i * 0.18}s` }}
                  aria-hidden
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                </span>
              </li>
            ))}
          </ol>
        </div>

        <button
          onClick={() => speakText(t('stepsListen'), setSpeaking, prefs.lang)}
          className={`btn-press self-start min-h-14 pl-2 pr-6 rounded-full border-2 border-[#FB7185]/50 bg-[#FFE4E6] text-[#9F1239] font-bold text-lg flex items-center gap-3 ${speaking ? 'speaking' : ''}`}
        >
          <span className="w-10 h-10 rounded-full bg-[#FB7185] text-white flex items-center justify-center">
            <Volume2 size={21} aria-hidden />
          </span>
          {t('listenHow')}
        </button>

        <div className="grid grid-cols-3 gap-3">
          {STATS.map((s) => (
            <div key={s.label} className="glass-card rounded-3xl p-3.5 flex flex-col items-center gap-1 text-center">
              <span className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: s.bg, color: s.fg }}>
                <s.icon size={23} aria-hidden />
              </span>
              <span className="text-2xl font-bold text-leaf leading-none mt-1">{s.value}</span>
              <span className="text-xs text-ink/60 font-medium">{s.label}</span>
            </div>
          ))}
        </div>

        <Link
          to="/library"
          className="elev-card btn-press flex items-center gap-4 glass-card rounded-3xl px-5 py-4 min-h-16"
        >
          <span className="w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center" style={{ background: '#FFEDD5', color: '#EA580C' }}>
            <BookOpen size={26} aria-hidden />
          </span>
          <span className="font-bold text-xl text-leaf">{t('library')}</span>
        </Link>
      </section>

      {/* Right: camera / upload card */}
      <section className="screen-enter expensive-card rounded-[2rem] p-4 lg:p-6 flex flex-col gap-5 min-w-0 relative overflow-hidden" style={{ animationDelay: '240ms' }}>
        <div className="lg:hidden flex justify-center -mb-1 pt-1"><Mascot mood="idle" size={76} /></div>
        <div>
          <p className="text-lg font-semibold text-leaf mb-3">{t('ageQuestion')}</p>
          <div className="flex gap-2">
            {AGES.map((a) => (
              <button
                key={a.range}
                onClick={() => pickAge(a.months)}
                className={`btn-press flex-1 min-h-14 rounded-2xl text-lg font-semibold border-2 transition-all ${
                  age === a.months
                    ? 'text-white border-transparent shadow-[0_10px_24px_-8px_rgba(30,122,70,0.65)]'
                    : 'bg-white text-ink border-primary/30 hover:border-amber-warm hover:bg-[#FFF7E8]'
                }`}
                style={age === a.months ? { background: 'linear-gradient(180deg, #249653, #14532D)' } : undefined}
              >
                {num(a.range)} {t('months')}
              </button>
            ))}
          </div>
        </div>

        <button
          id="camera-btn"
          onClick={() => cameraRef.current?.click()}
          className="btn-press btn-lift btn-shine btn-primary-glow w-full h-24 rounded-3xl text-white text-2xl font-bold flex items-center justify-center gap-3"
        >
          <Camera size={38} aria-hidden /> {t('takePhoto')}
        </button>
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        <button
          onClick={() => galleryRef.current?.click()}
          className="btn-press btn-lift w-full min-h-14 rounded-3xl border-2 border-primary text-primary text-lg font-semibold bg-white flex items-center justify-center gap-2"
        >
          <Images size={24} aria-hidden /> {t('fromGallery')}
        </button>
        <input
          ref={galleryRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        {phase === 'error' && (
          <button
            onClick={() => pendingFile.current && handleFile(pendingFile.current)}
            className="btn-press w-full min-h-14 rounded-3xl bg-amber-warm text-ink text-lg font-bold"
          >
            {t('tryAgain')}
          </button>
        )}

        <p className="lg:hidden text-sm text-ink/70 flex items-center gap-2">
          <Lock size={16} aria-hidden /> {t('privacyLine')}
        </p>

        <button
          onClick={() => speakText(t('stepsListen'), setSpeaking, prefs.lang)}
          className={`btn-press lg:hidden self-center min-h-14 pl-2 pr-6 rounded-full border-2 border-[#FB7185]/50 bg-[#FFE4E6] text-[#9F1239] font-bold text-lg flex items-center gap-3 ${speaking ? 'speaking' : ''}`}
        >
          <span className="w-10 h-10 rounded-full bg-[#FB7185] text-white flex items-center justify-center">
            <Volume2 size={21} aria-hidden />
          </span>
          {t('listenHow')}
        </button>

        <div>
          <p className="text-lg font-semibold text-leaf mb-3">{t('samplePlates')}</p>
          <div className="grid grid-cols-3 gap-3">
            {(Object.keys(SAMPLES) as (keyof typeof SAMPLES)[]).map((key) => (
              <button
                key={key}
                onClick={() => onSample(key)}
                className="btn-press group relative rounded-3xl overflow-hidden bg-white shadow elev-card min-h-14 text-left"
                aria-label={t(SAMPLE_NAMES[key])}
              >
                <span className="relative block overflow-hidden">
                  <img
                    src={SAMPLES[key].photoUrl}
                    alt=""
                    className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => ((e.target as HTMLImageElement).style.opacity = '0.25')}
                  />
                  <span className="tnum absolute top-2 left-2 bg-white/70 backdrop-blur-md border border-white/70 text-ink text-xs font-black rounded-full px-2 py-0.5 shadow-l1">
                    {num(SAMPLES[key].groups.length)}/{num(8)}
                  </span>
                </span>
                <span className="block px-2.5 py-2 text-[13px] font-semibold leading-tight text-leaf">
                  {t(SAMPLE_NAMES[key])}
                </span>
              </button>
            ))}
          </div>
          {isDemo() && <p className="text-xs mt-2 text-ink/60">DEMO</p>}
        </div>

        <button
          onClick={() => onSample('hero')}
          className="btn-press btn-lift btn-primary-glow w-full min-h-16 rounded-3xl text-white text-xl font-bold flex items-center justify-center gap-3"
        >
          <Play size={26} aria-hidden /> {t('demoButton')}
        </button>

        {/* Daily challenge (Feature 2) */}
        {(() => {
          const mission = todaysMission();
          const done = challengeDoneToday();
          return (
            <section className={`rounded-3xl p-4 flex items-center gap-4 border-2 ${done ? 'bg-primary/10 border-primary/40' : 'bg-amber-warm/10 border-amber-warm/50'}`}>
              <Mascot mood={done ? 'happy' : 'encourage'} size={58} />
              <div className="grow min-w-0">
                <p className="font-bold text-leaf flex items-center gap-2">
                  <Trophy size={19} className="text-amber-warm" aria-hidden /> {t('challengeTitle')}
                </p>
                <p className="font-semibold">{done ? t('challengeDone') : mission.text[prefs.lang]}</p>
              </div>
              {!done && (
                <button
                  onClick={() => document.getElementById('camera-btn')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  className="btn-press shrink-0 min-h-14 px-4 rounded-2xl btn-primary-glow text-white font-bold flex items-center gap-2"
                >
                  <Camera size={20} aria-hidden /> {t('takePhoto')}
                </button>
              )}
            </section>
          );
        })()}

        {/* Playground + Quiz links (Features 1 & 3) */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/play"
            className="btn-press btn-lift elev-card min-h-16 rounded-3xl bg-white border border-primary/20 text-leaf font-bold text-lg flex items-center justify-center gap-2.5"
          >
            <span className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0" style={{ background: '#EDE9FE', color: '#7C3AED' }}>
              <Puzzle size={22} aria-hidden />
            </span>
            {t('playTitle')}
          </Link>
          <Link
            to="/quiz"
            className="btn-press btn-lift elev-card min-h-16 rounded-3xl bg-white border border-primary/20 text-leaf font-bold text-lg flex items-center justify-center gap-2.5"
          >
            <span className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0" style={{ background: '#E0F2FE', color: '#0284C7' }}>
              <Gamepad2 size={22} aria-hidden />
            </span>
            {t('quizTitle')}
          </Link>
        </div>

        <Link
          to="/library"
          className="btn-press lg:hidden flex items-center justify-center gap-3 w-full min-h-16 rounded-3xl bg-leaf text-white text-xl font-bold shadow"
        >
          <BookOpen size={26} aria-hidden /> {t('library')}
        </Link>

        <p className="text-center text-sm text-ink/60">{t('whoFooter')}</p>
      </section>
    </div>

    {/* Contrast band: deep green, white/gold stats */}
    <section className="reveal w-full mt-2 lg:mt-4" style={{ background: 'linear-gradient(120deg, #0B2E1D, #14532D 70%)' }}>
      <div className="w-full px-4 sm:px-8 lg:px-16 2xl:px-24 py-10 lg:py-14 grid grid-cols-3 gap-4 lg:gap-8 text-center">
        {STATS.map((s) => (
          <div key={s.label} className="flex flex-col items-center gap-1.5">
            <span className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-amber-warm">
              <s.icon size={24} aria-hidden />
            </span>
            <span className="tnum text-3xl lg:text-5xl font-extrabold text-white leading-none mt-1">{s.value}</span>
            <span className="text-xs lg:text-sm text-white/70 font-medium">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
    </div>
  );
}
