import { Check, Globe2, Languages } from 'lucide-react';
import { COUNTRIES, LANGS, useLang, type Lang } from '../lib/i18n';

export default function Settings() {
  const { prefs, setPrefs, t } = useLang();
  return (
    <div className="w-full px-4 sm:px-8 lg:px-16 2xl:px-24 py-5 lg:py-10 flex flex-col gap-6">
      <h1 className="text-3xl lg:text-4xl font-bold text-leaf">{t('settings')}</h1>

      <section className="glass-card rounded-3xl p-5 flex flex-col gap-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Globe2 size={24} className="text-primary" aria-hidden /> {t('country')}
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {COUNTRIES.map((c) => (
            <button
              key={c}
              onClick={() => setPrefs({ country: c })}
              className={`btn-press min-h-16 rounded-2xl border-2 px-3 font-semibold flex items-center justify-between gap-2 ${
                prefs.country === c ? 'bg-primary text-white border-primary' : 'bg-white/70 border-primary/25'
              }`}
              aria-pressed={prefs.country === c}
            >
              {c}
              {prefs.country === c && <Check size={20} aria-hidden />}
            </button>
          ))}
        </div>
      </section>

      <section className="glass-card rounded-3xl p-5 flex flex-col gap-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Languages size={24} className="text-primary" aria-hidden /> {t('language')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {LANGS.map((l) => (
            <button
              key={l.id}
              onClick={() => setPrefs({ lang: l.id as Lang })}
              className={`btn-press min-h-20 rounded-3xl border-2 text-2xl font-bold flex items-center justify-center gap-2 ${
                prefs.lang === l.id ? 'bg-primary text-white border-primary' : 'bg-white/70 border-primary/25'
              }`}
              aria-pressed={prefs.lang === l.id}
            >
              {l.label}
              {prefs.lang === l.id && <Check size={22} aria-hidden />}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
