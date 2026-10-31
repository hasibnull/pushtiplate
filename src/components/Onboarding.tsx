import { useState } from 'react';
import { Check, ChevronRight, Globe2, Languages } from 'lucide-react';
import { COUNTRIES, LANGS, useLang, type Lang } from '../lib/i18n';

export default function Onboarding({ onDone }: { onDone: () => void }) {
  const { prefs, setPrefs, t } = useLang();
  const [step, setStep] = useState(1);
  const [country, setCountry] = useState(prefs.country);
  const [lang, setLang] = useState<Lang>(prefs.lang);

  const finish = () => {
    setPrefs({ country, lang, onboarded: true });
    onDone();
  };

  return (
    <div className="w-full px-4 sm:px-8 lg:px-16 2xl:px-24 py-10 lg:py-16 flex flex-col items-center">
      <div className="w-full max-w-2xl flex flex-col gap-6">
        <div className="flex items-center gap-2 justify-center" aria-hidden>
          {[1, 2].map((s) => (
            <span key={s} className={`h-2.5 rounded-full transition-all ${step >= s ? 'w-10 bg-primary' : 'w-4 bg-primary/20'}`} />
          ))}
        </div>

        {step === 1 ? (
          <section className="glass-card rounded-3xl p-5 lg:p-8 flex flex-col gap-5 screen-enter">
            <h1 className="text-3xl font-bold text-leaf flex items-center gap-3">
              <Globe2 size={34} className="text-primary" aria-hidden /> {t('chooseCountry')}
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {COUNTRIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCountry(c)}
                  className={`btn-press min-h-16 rounded-2xl border-2 px-4 text-lg font-semibold flex items-center justify-between ${
                    country === c ? 'bg-primary text-white border-primary' : 'bg-white/70 border-primary/25'
                  }`}
                  aria-pressed={country === c}
                >
                  {c}
                  {country === c && <Check size={22} aria-hidden />}
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(2)}
              className="btn-press btn-lift btn-primary-glow min-h-16 rounded-3xl text-white text-xl font-bold flex items-center justify-center gap-2"
            >
              {t('continue')} <ChevronRight size={24} aria-hidden />
            </button>
          </section>
        ) : (
          <section className="glass-card rounded-3xl p-5 lg:p-8 flex flex-col gap-5 screen-enter">
            <h1 className="text-3xl font-bold text-leaf flex items-center gap-3">
              <Languages size={34} className="text-primary" aria-hidden /> {t('chooseLanguage')}
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {LANGS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLang(l.id)}
                  className={`btn-press min-h-24 rounded-3xl border-2 text-2xl font-bold flex flex-col items-center justify-center gap-1 ${
                    lang === l.id ? 'bg-primary text-white border-primary' : 'bg-white/70 border-primary/25'
                  }`}
                  aria-pressed={lang === l.id}
                >
                  {l.label}
                  {lang === l.id && <Check size={22} aria-hidden />}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="btn-press min-h-16 px-5 rounded-3xl border-2 border-primary text-primary font-bold bg-white/70"
              >
                {t('back')}
              </button>
              <button
                onClick={finish}
                className="btn-press btn-lift btn-primary-glow flex-1 min-h-16 rounded-3xl text-white text-xl font-bold flex items-center justify-center gap-2"
              >
                {t('continue')} <ChevronRight size={24} aria-hidden />
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
