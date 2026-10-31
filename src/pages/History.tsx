import { useEffect, useState } from 'react';
import { UtensilsCrossed, Volume2 } from 'lucide-react';
import { fetchAudits, signedUrlFor, type AuditRow } from '../lib/supabase';
import { PRIORITY } from '../lib/scoring';
import { GROUP_LABEL } from '../lib/library';
import { speakText } from '../lib/speak';
import { useLang } from '../lib/i18n';
import FoodIcon from '../components/FoodIcon';
import Mascot from '../components/Mascot';

export default function History() {
  const { t, num, prefs } = useLang();
  const lang = prefs.lang;
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [thumbs, setThumbs] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    fetchAudits().then(async (data) => {
      setRows(data);
      setLoaded(true);
      const map: Record<string, string> = {};
      for (const r of data) {
        const u = await signedUrlFor(r.photo_url);
        if (u) map[r.id] = u;
      }
      setThumbs(map);
    });
  }, []);

  const locale = lang === 'bn' ? 'bn-BD' : lang === 'hi' ? 'hi-IN' : 'en-US';

  return (
    <div className="w-full px-4 sm:px-8 lg:px-16 2xl:px-24 py-5 lg:py-10">
      <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
        <h1 className="text-3xl font-bold text-leaf">{t('history')}</h1>
        <button
          onClick={() => speakText(rows.length ? `${t('history')}: ${num(rows.length)}` : t('noPlatesYet'), setSpeaking, lang)}
          className={`btn-press btn-lift btn-primary-glow min-h-14 px-5 rounded-3xl text-white text-lg font-bold flex items-center gap-2 ${speaking ? 'speaking' : ''}`}
        >
          <Volume2 size={24} aria-hidden /> {t('listen')}
        </button>
      </div>
      {loaded && rows.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-10">
          <Mascot mood="caring" size={96} />
          <p className="text-center text-lg text-ink/70">{t('noPlatesYet')}</p>
        </div>
      )}
      {!loaded && (
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))]" aria-hidden>
          {[0, 1, 2].map((i) => (
            <div key={i} className="shimmer rounded-3xl min-h-24" />
          ))}
        </div>
      )}
      <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))]">
        {rows.map((r, i) => {
          const food = PRIORITY.find((p) => p.group === r.food_to_add);
          return (
            <article
              key={r.id}
              style={{ animationDelay: `${i * 60}ms` }}
              className="tile-pop elev-card glass-card rounded-3xl p-3 flex items-center gap-3 min-h-[88px]"
            >
              {thumbs[r.id] ? (
                <img src={thumbs[r.id]} alt="" className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl object-cover shrink-0" />
              ) : (
                <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-cream text-leaf flex items-center justify-center shrink-0">
                  <UtensilsCrossed size={28} aria-hidden />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{new Date(r.created_at).toLocaleDateString(locale)}</p>
                {food && (
                  <p className="text-sm text-ink/60 flex items-center gap-1.5 mt-0.5">
                    {t('tomorrowAddPrefix')} <FoodIcon group={food.group} size={17} className="text-amber-warm" /> {GROUP_LABEL[food.group][lang]}
                  </p>
                )}
              </div>
              <span className="bg-primary/10 text-leaf font-bold rounded-full px-3 py-1.5 shrink-0">
                {num(r.score)}/{num(8)}
              </span>
            </article>
          );
        })}
      </div>
    </div>
  );
}
