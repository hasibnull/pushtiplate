import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, Flame, Volume2 } from 'lucide-react';
import { LIBRARY_FOODS, GROUP_LABEL } from '../lib/library';
import { speakText } from '../lib/speak';
import { useLang } from '../lib/i18n';
import FoodIcon from '../components/FoodIcon';

export default function LibraryDetail() {
  const { t, num, prefs } = useLang();
  const lang = prefs.lang;
  const { id } = useParams();
  const [speaking, setSpeaking] = useState(false);
  const food = LIBRARY_FOODS.find((f) => f.id === id);
  if (!food) return <Navigate to="/library" replace />;

  const groupLabel = GROUP_LABEL[food.group][lang];
  const spoken = `${food.name[lang]}. ${food.why[lang]} ${t('protein')}: ${t('approx')} ${num(food.proteinG)} g. ${num(food.kcal)} kcal. ${food.serving[lang]}. ${t('startAge')} ${num(food.startMonths)} ${t('months')}.`;

  return (
    <div className="w-full px-4 sm:px-8 lg:px-16 2xl:px-24 py-5 lg:py-10">
      <Link
        to="/library"
        className="btn-press inline-flex items-center gap-2 min-h-14 px-4 rounded-full bg-white shadow-sm font-semibold text-primary"
      >
        <ArrowLeft size={22} aria-hidden /> {t('library')}
      </Link>

      <div className="grid gap-5 lg:gap-8 lg:grid-cols-2 mt-5 items-start">
        {food.image ? (
          <img src={food.image} alt={food.name.en} className="w-full aspect-square object-cover rounded-3xl elev-card" />
        ) : (
          <div className="w-full aspect-square bg-primary/10 text-primary rounded-3xl elev-card flex items-center justify-center">
            <FoodIcon group={food.group} size={160} />
          </div>
        )}

        <section className="glass-card rounded-3xl p-5 lg:p-8 flex flex-col gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-leaf">{food.name[lang]}</h1>
            <p className="text-lg text-ink/60">{lang === 'en' ? food.name.bn : food.name.en}</p>
          </div>
          <span className="self-start bg-primary/10 text-leaf font-semibold rounded-full px-3 py-1.5 flex items-center gap-2">
            <FoodIcon group={food.group} size={18} /> {groupLabel}
          </span>
          <p className="text-xl leading-relaxed max-w-prose">{food.why[lang]}</p>
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-cream rounded-2xl p-3">
              <dt className="text-sm text-ink/60 flex items-center justify-center gap-1">
                <Flame size={14} className="text-amber-warm" aria-hidden /> kcal ({t('approx')})
              </dt>
              <dd className="font-bold text-lg">{num(food.kcal)}</dd>
            </div>
            <div className="bg-cream rounded-2xl p-3">
              <dt className="text-sm text-ink/60">{t('protein')} ({t('approx')})</dt>
              <dd className="font-bold text-lg">{num(food.proteinG)} g</dd>
            </div>
            <div className="bg-cream rounded-2xl p-3">
              <dt className="text-sm text-ink/60">{t('perServing')}</dt>
              <dd className="font-bold text-lg">{food.serving[lang]}</dd>
            </div>
            <div className="bg-cream rounded-2xl p-3">
              <dt className="text-sm text-ink/60">{t('startAge')}</dt>
              <dd className="font-bold text-lg">{num(food.startMonths)} {t('months')}</dd>
            </div>
          </dl>
          <button
            onClick={() => speakText(spoken, setSpeaking, lang)}
            className={`btn-press btn-lift btn-primary-glow w-full min-h-16 rounded-3xl text-white text-2xl font-bold flex items-center justify-center gap-3 ${speaking ? 'speaking' : ''}`}
          >
            <Volume2 size={30} aria-hidden /> {t('listen')}
          </button>
        </section>
      </div>

      <p className="text-sm text-center text-ink/60 mt-8">{t('disclaimerLibrary')}</p>
    </div>
  );
}
