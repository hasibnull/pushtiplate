import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Camera, Check, Images, Lock, Search, Volume2 } from 'lucide-react';
import { getAge, setAge, setPlate, isDemo } from '../lib/store';
import { SAMPLES } from '../lib/demo';
import { downscale, analyzePlate } from '../lib/api';
import { uploadPlate } from '../lib/supabase';
import { speakText } from '../lib/speak';
import { useLang } from '../lib/i18n';
import AnalysingOverlay from '../components/AnalysingOverlay';

const AGES = [
  { range: '6–11', months: 9 },
  { range: '12–17', months: 14 },
  { range: '18–23', months: 20 },
];

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

  const STEPS = [
    { icon: Camera, text: t('takePhoto') },
    { icon: Search, text: t('findingFoods') },
    { icon: Volume2, text: t('listen') },
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
    <div className="w-full px-4 sm:px-8 lg:px-16 2xl:px-24 py-5 lg:py-12 grid gap-8 lg:grid-cols-2 lg:gap-12 lg:items-start">
      {/* Left: intro + how it works (desktop hero) */}
      <section className="hidden lg:flex flex-col gap-6 lg:pt-4">
        <div>
          <h1 className="text-4xl lg:text-5xl font-bold text-leaf leading-tight">{t('appName')}</h1>
          <p className="text-lg text-ink/70 mt-1">{t('tagline')}</p>
        </div>
        <ol className="flex flex-col gap-3">
          {STEPS.map((s, i) => (
            <li
              key={s.text}
              className="flex items-center gap-4 glass-card rounded-3xl px-4 py-3 min-h-16"
            >
              <span className="w-11 h-11 shrink-0 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <s.icon size={24} aria-hidden />
              </span>
              <span className="font-semibold text-lg">{s.text}</span>
              <span className="ml-auto w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
                <Check size={16} aria-hidden />
              </span>
              <span className="sr-only">{i + 1}</span>
            </li>
          ))}
        </ol>
        <p className="hidden lg:flex text-sm text-ink/70 items-center gap-2 max-w-prose">
          <Lock size={16} aria-hidden /> {t('privacyLine')}
        </p>

        <button
          onClick={() => speakText(t('stepsListen'), setSpeaking, prefs.lang)}
          className={`btn-press btn-lift btn-primary-glow hidden lg:flex items-center justify-center gap-3 w-full min-h-16 rounded-3xl text-white text-xl font-bold ${speaking ? 'speaking' : ''}`}
        >
          <Volume2 size={26} aria-hidden /> {t('listen')}
        </button>

        <Link
          to="/library"
          className="elev-card btn-press hidden lg:flex items-center gap-4 glass-card rounded-3xl px-5 py-4 min-h-16"
        >
          <span className="w-12 h-12 shrink-0 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <BookOpen size={26} aria-hidden />
          </span>
          <span className="font-bold text-xl text-leaf">{t('library')}</span>
        </Link>
      </section>

      {/* Right: camera / upload card */}
      <section className="glass-card rounded-3xl p-4 lg:p-6 flex flex-col gap-5 min-w-0">
        <div>
          <p className="text-lg font-semibold text-leaf mb-3">{t('ageQuestion')}</p>
          <div className="flex gap-2">
            {AGES.map((a) => (
              <button
                key={a.range}
                onClick={() => pickAge(a.months)}
                className={`btn-press flex-1 min-h-14 rounded-2xl text-lg font-semibold border-2 transition-colors ${
                  age === a.months
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-ink border-primary/30 hover:border-primary'
                }`}
              >
                {num(a.range)} {t('months')}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => cameraRef.current?.click()}
          className="btn-press btn-lift btn-primary-glow w-full h-24 rounded-3xl text-white text-2xl font-bold flex items-center justify-center gap-3"
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
          className={`btn-press btn-lift btn-primary-glow lg:hidden w-full min-h-16 rounded-3xl text-white text-xl font-bold flex items-center justify-center gap-3 ${speaking ? 'speaking' : ''}`}
        >
          <Volume2 size={26} aria-hidden /> {t('listen')}
        </button>

        <div>
          <p className="text-lg font-semibold text-leaf mb-3">{t('samplePlates')}</p>
          <div className="grid grid-cols-3 gap-3">
            {(Object.keys(SAMPLES) as (keyof typeof SAMPLES)[]).map((key) => (
              <button
                key={key}
                onClick={() => onSample(key)}
                className="btn-press group rounded-3xl overflow-hidden bg-white shadow min-h-14 ring-primary/0 hover:ring-4 hover:ring-primary/50 focus-visible:ring-4 focus-visible:ring-primary/60 transition-shadow"
                aria-label={key}
              >
                <img
                  src={SAMPLES[key].photoUrl}
                  alt=""
                  className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => ((e.target as HTMLImageElement).style.opacity = '0.25')}
                />
              </button>
            ))}
          </div>
          {isDemo() && <p className="text-xs mt-2 text-ink/60">DEMO</p>}
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
  );
}
