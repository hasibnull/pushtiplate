import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Camera, Check, Images, Lock, Search, Volume2 } from 'lucide-react';
import { getAge, setAge, setPlate, isDemo } from '../lib/store';
import { SAMPLES } from '../lib/demo';
import { downscale, analyzePlate } from '../lib/api';
import { uploadPlate } from '../lib/supabase';
import AnalysingOverlay from '../components/AnalysingOverlay';

const AGES = [
  { label: '৬–১১ মাস', months: 9 },
  { label: '১২–১৭ মাস', months: 14 },
  { label: '১৮–২৩ মাস', months: 20 },
];

const STEPS = [
  { icon: Camera, text: 'থালার ছবি তুলুন' },
  { icon: Search, text: 'খাবার খুঁজছি…' },
  { icon: Volume2, text: 'শুনুন' },
];

type Phase = 'idle' | 'uploading' | 'analysing' | 'error';

export default function Home() {
  const navigate = useNavigate();
  const [age, setAgeState] = useState(getAge());
  const [phase, setPhase] = useState<Phase>('idle');
  const [localPhoto, setLocalPhoto] = useState<string | null>(null);
  const [slow, setSlow] = useState(false);
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const pendingFile = useRef<File | null>(null);

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
      let groups: string[] = [];
      if (uploaded) {
        // Validate → retry once → correction-tap fallback (§5.3)
        groups =
          (await analyzePlate(uploaded.signedUrl, age)) ??
          (await analyzePlate(uploaded.signedUrl, age)) ??
          [];
        setPlate({
          photoUrl: uploaded.signedUrl,
          photoPath: uploaded.path,
          ageMonths: age,
          groups,
          source: 'live',
        });
      } else {
        // Supabase not connected yet: still show result, user can tap icons
        setPlate({ photoUrl: objectUrl, ageMonths: age, groups: [], source: 'live' });
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
          text={phase === 'uploading' ? 'ছবি পাঠানো হচ্ছে…' : slow ? 'আরেকটু অপেক্ষা করুন…' : 'খাবার খুঁজছি…'}
        />
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-8 lg:px-16 2xl:px-24 py-5 lg:py-12 grid gap-8 lg:grid-cols-2 lg:gap-12 lg:items-start">
      {/* Left: intro + how it works (desktop hero) */}
      <section className="hidden lg:flex flex-col gap-6 lg:pt-4">
        <div>
          <h1 className="text-4xl lg:text-5xl font-bold text-leaf leading-tight">পুষ্টি থালা</h1>
          <p className="text-lg text-ink/70 mt-1">আজকের থালা, কালকের শক্তি</p>
        </div>
        <ol className="flex flex-col gap-3">
          {STEPS.map((s, i) => (
            <li
              key={s.text}
              className="flex items-center gap-4 bg-white rounded-3xl shadow-sm px-4 py-3 min-h-16"
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
          <Lock size={16} aria-hidden /> শুধু থালার ছবি তুলুন — শিশুর ছবি নয়।
        </p>

        <Link
          to="/library"
          className="elev-card btn-press hidden lg:flex items-center gap-4 bg-white rounded-3xl px-5 py-4 min-h-16"
        >
          <span className="w-12 h-12 shrink-0 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <BookOpen size={26} aria-hidden />
          </span>
          <span className="font-bold text-xl text-leaf">খাবারের লাইব্রেরি</span>
        </Link>
      </section>

      {/* Right: camera / upload card */}
      <section className="bg-white rounded-3xl elev-card p-4 lg:p-6 flex flex-col gap-5 min-w-0">
        <div>
          <p className="text-lg font-semibold text-leaf mb-3">শিশুর বয়স কত?</p>
          <div className="flex gap-2">
            {AGES.map((a) => (
              <button
                key={a.label}
                onClick={() => pickAge(a.months)}
                className={`btn-press flex-1 min-h-14 rounded-2xl text-lg font-semibold border-2 transition-colors ${
                  age === a.months
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-ink border-primary/30 hover:border-primary'
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => cameraRef.current?.click()}
          className="btn-press btn-lift w-full h-24 rounded-3xl bg-primary text-white text-2xl font-bold shadow-lg flex items-center justify-center gap-3"
        >
          <Camera size={38} aria-hidden /> থালার ছবি তুলুন
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
          <Images size={24} aria-hidden /> গ্যালারি থেকে ছবি নিন
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
            আবার চেষ্টা করুন
          </button>
        )}

        <p className="lg:hidden text-sm text-ink/70 flex items-center gap-2">
          <Lock size={16} aria-hidden /> শুধু থালার ছবি তুলুন — শিশুর ছবি নয়।
        </p>

        <div>
          <p className="text-lg font-semibold text-leaf mb-3">নমুনা থালা দেখুন</p>
          <div className="grid grid-cols-3 gap-3">
            {(Object.keys(SAMPLES) as (keyof typeof SAMPLES)[]).map((key) => (
              <button
                key={key}
                onClick={() => onSample(key)}
                className="btn-press rounded-3xl overflow-hidden bg-white shadow min-h-14 ring-1 ring-black/5"
                aria-label={`নমুনা ${key}`}
              >
                <img
                  src={SAMPLES[key].photoUrl}
                  alt=""
                  className="w-full aspect-square object-cover"
                  onError={(e) => ((e.target as HTMLImageElement).style.opacity = '0.25')}
                />
              </button>
            ))}
          </div>
          {isDemo() && <p className="text-xs mt-2 text-ink/60">DEMO চালু আছে</p>}
        </div>

        <Link
          to="/library"
          className="btn-press lg:hidden flex items-center justify-center gap-3 w-full min-h-16 rounded-3xl bg-leaf text-white text-xl font-bold shadow"
        >
          <BookOpen size={26} aria-hidden /> খাবারের লাইব্রেরি
        </Link>

        <p className="text-center text-sm text-ink/60">WHO/UNICEF খাদ্য-বৈচিত্র্য নিয়ম অনুসারে</p>
      </section>
    </div>
  );
}
