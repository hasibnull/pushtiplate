import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
      <div className="px-4">
        <AnalysingOverlay
          photoUrl={localPhoto ?? ''}
          text={phase === 'uploading' ? 'ছবি পাঠানো হচ্ছে…' : slow ? 'আরেকটু অপেক্ষা করুন…' : 'খাবার খুঁজছি…'}
        />
      </div>
    );
  }

  return (
    <div className="px-4 py-5 flex flex-col gap-5">
      <div>
        <p className="text-lg font-semibold text-leaf mb-2">শিশুর বয়স কত?</p>
        <div className="flex gap-2">
          {AGES.map((a) => (
            <button
              key={a.label}
              onClick={() => pickAge(a.months)}
              className={`flex-1 min-h-14 rounded-2xl text-lg font-semibold border-2 ${
                age === a.months
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-ink border-primary/30'
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => cameraRef.current?.click()}
        className="w-full h-24 rounded-[20px] bg-primary text-white text-2xl font-bold shadow-lg flex items-center justify-center gap-3"
      >
        <span className="text-4xl">📷</span> থালার ছবি তুলুন
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
        className="w-full min-h-14 rounded-[20px] border-2 border-primary text-primary text-lg font-semibold bg-white"
      >
        গ্যালারি থেকে ছবি নিন
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
          className="w-full min-h-14 rounded-[20px] bg-amber-warm text-ink text-lg font-bold"
        >
          আবার চেষ্টা করুন
        </button>
      )}

      <p className="text-sm text-ink/70 flex items-center gap-2">
        <span>🔒</span> শুধু থালার ছবি তুলুন — শিশুর ছবি নয়।
      </p>

      <div>
        <p className="text-lg font-semibold text-leaf mb-2">নমুনা থালা দেখুন</p>
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(SAMPLES) as (keyof typeof SAMPLES)[]).map((key) => (
            <button
              key={key}
              onClick={() => onSample(key)}
              className="rounded-2xl overflow-hidden bg-white shadow min-h-14"
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
        {isDemo() && <p className="text-xs mt-1 text-ink/60">DEMO চালু আছে</p>}
      </div>

      <p className="text-center text-sm text-ink/60 mt-2">
        WHO/UNICEF খাদ্য-বৈচিত্র্য নিয়ম অনুসারে
      </p>
    </div>
  );
}
