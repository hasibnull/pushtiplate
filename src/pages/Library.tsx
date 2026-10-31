import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Baby, Flame, Salad, UtensilsCrossed, Volume2, type LucideIcon } from 'lucide-react';
import { FOOD_GROUPS } from '../lib/scoring';
import { AGE_GUIDANCE, GROUP_LABEL, LIBRARY_FOODS } from '../lib/library';
import { speakText } from '../lib/speak';
import { useLang } from '../lib/i18n';
import FoodIcon from '../components/FoodIcon';

const AGE_ICONS: LucideIcon[] = [Baby, Salad, UtensilsCrossed];

export default function Library() {
  const { t, num, prefs } = useLang();
  const lang = prefs.lang;
  const [filter, setFilter] = useState<string>('all');
  const [speaking, setSpeaking] = useState(false);
  const foods = useMemo(
    () => (filter === 'all' ? LIBRARY_FOODS : LIBRARY_FOODS.filter((f) => f.group === filter)),
    [filter],
  );

  return (
    <div className="w-full px-4 sm:px-8 lg:px-16 2xl:px-24 py-5 lg:py-10">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-3xl lg:text-4xl font-bold text-leaf">{t('library')}</h1>
        <button
          onClick={() => speakText(`${t('library')}. ${t('guidanceTitle')}.`, setSpeaking, lang)}
          className={`btn-press btn-lift btn-primary-glow min-h-14 px-5 rounded-3xl text-white text-lg font-bold flex items-center gap-2 ${speaking ? 'speaking' : ''}`}
        >
          <Volume2 size={24} aria-hidden /> {t('listen')}
        </button>
      </div>

      {/* Age-band feeding guidance (Phase 4) */}
      <section aria-label={t('guidanceTitle')} className="mt-5">
        <h2 className="text-xl font-bold text-leaf">{t('guidanceTitle')}</h2>
        <div className="grid gap-3 sm:grid-cols-3 mt-3">
          {AGE_GUIDANCE.map((g, i) => {
            const Icon = AGE_ICONS[i];
            return (
              <article key={g.months} className="glass-card rounded-3xl p-4 flex flex-col gap-1.5">
                <span className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <Icon size={24} aria-hidden />
                </span>
                <p className="font-bold text-lg">{num(g.months)} {t('months')}</p>
                <p className="font-semibold text-primary">{g.meals[lang]}</p>
                <p className="text-sm text-ink/70">{g.key[lang]}</p>
              </article>
            );
          })}
        </div>
      </section>

      <div className="flex gap-2 mt-6 overflow-x-auto pb-2 -mx-1 px-1">
        <button
          onClick={() => setFilter('all')}
          className={`btn-press shrink-0 min-h-14 px-4 rounded-full font-semibold border-2 ${
            filter === 'all' ? 'bg-primary text-white border-primary' : 'bg-white border-primary/30 text-ink'
          }`}
        >
          {t('all')}
        </button>
        {FOOD_GROUPS.map((g) => (
          <button
            key={g.id}
            onClick={() => setFilter(g.id)}
            className={`btn-press shrink-0 min-h-14 px-4 rounded-full font-semibold border-2 flex items-center gap-2 ${
              filter === g.id ? 'bg-primary text-white border-primary' : 'bg-white border-primary/30 text-ink'
            }`}
          >
            <FoodIcon group={g.id} size={20} />
            {GROUP_LABEL[g.id][lang]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5 mt-4">
        {foods.map((f, i) => (
          <Link
            key={f.id}
            to={`/library/${f.id}`}
            style={{ animationDelay: `${Math.min(i, 10) * 50}ms` }}
            className="tile-pop elev-card glass-card rounded-3xl overflow-hidden flex flex-col min-w-0"
          >
            {f.image ? (
              <img src={f.image} alt={f.name.en} className="w-full aspect-square object-cover" loading="lazy" />
            ) : (
              <div className="w-full aspect-square bg-primary/10 text-primary flex items-center justify-center">
                <FoodIcon group={f.group} size={84} />
              </div>
            )}
            <div className="p-3 lg:p-4 flex flex-col gap-1.5 grow">
              <p className="font-bold text-lg leading-tight">{f.name[lang]}</p>
              <p className="text-sm text-ink/60">{lang === 'en' ? f.name.bn : f.name.en}</p>
              <span className="self-start bg-primary/10 text-leaf text-xs font-semibold rounded-full px-2.5 py-1 flex items-center gap-1">
                <FoodIcon group={f.group} size={14} /> {GROUP_LABEL[f.group][lang]}
              </span>
              <p className="text-sm leading-snug">{f.why[lang]}</p>
              <p className="text-sm text-ink/70 mt-auto flex items-center gap-1 flex-wrap">
                <Flame size={15} className="text-amber-warm" aria-hidden />
                {num(f.kcal)} kcal · {t('protein')} {num(f.proteinG)} g
                <span className="text-ink/50">({t('approx')})</span>
              </p>
            </div>
          </Link>
        ))}
      </div>

      <p className="text-sm text-center text-ink/60 mt-8">{t('disclaimerLibrary')}</p>
    </div>
  );
}
