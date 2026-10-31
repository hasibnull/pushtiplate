import { useEffect, useState } from 'react';
import { UtensilsCrossed } from 'lucide-react';
import { fetchAudits, signedUrlFor, type AuditRow } from '../lib/supabase';
import { PRIORITY, toBangla } from '../lib/scoring';
import FoodIcon from '../components/FoodIcon';

export default function History() {
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [thumbs, setThumbs] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);

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

  return (
    <div className="w-full px-4 sm:px-8 lg:px-16 2xl:px-24 py-5 lg:py-10">
      <h1 className="text-3xl font-bold text-leaf mb-5">আগের থালা</h1>
      {loaded && rows.length === 0 && (
        <p className="text-center text-lg text-ink/70 py-10">এখনো কোনো থালা দেখা হয়নি</p>
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
                <p className="font-semibold truncate">{new Date(r.created_at).toLocaleDateString('bn-BD')}</p>
                {food && (
                  <p className="text-sm text-ink/60 flex items-center gap-1.5 mt-0.5">
                    কাল: <FoodIcon group={food.group} size={17} className="text-amber-warm" /> {food.bangla}
                  </p>
                )}
              </div>
              <span className="bg-primary/10 text-leaf font-bold rounded-full px-3 py-1.5 shrink-0">
                {toBangla(r.score)}/{toBangla(8)}
              </span>
            </article>
          );
        })}
      </div>
    </div>
  );
}
