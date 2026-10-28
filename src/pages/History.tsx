import { useEffect, useState } from 'react';
import { fetchAudits, signedUrlFor, type AuditRow } from '../lib/supabase';
import { PRIORITY, toBangla } from '../lib/scoring';

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
    <div className="px-4 py-5">
      <h1 className="text-2xl font-bold text-leaf mb-4">আগের থালা</h1>
      {loaded && rows.length === 0 && (
        <p className="text-center text-lg text-ink/70 py-10">এখনো কোনো থালা দেখা হয়নি</p>
      )}
      <div className="flex flex-col gap-3">
        {rows.map((r) => {
          const food = PRIORITY.find((p) => p.group === r.food_to_add);
          return (
            <div key={r.id} className="bg-white rounded-[20px] shadow p-3 flex items-center gap-3 min-h-[72px]">
              {thumbs[r.id] ? (
                <img src={thumbs[r.id]} alt="" className="w-16 h-16 rounded-xl object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-cream flex items-center justify-center text-2xl">🍽️</div>
              )}
              <div className="flex-1">
                <p className="font-semibold">{new Date(r.created_at).toLocaleDateString('bn-BD')}</p>
                {food && <p className="text-sm text-ink/70">কাল: {food.icon} {food.bangla}</p>}
              </div>
              <span className="bg-primary/10 text-leaf font-bold rounded-full px-3 py-1.5">
                {toBangla(r.score)}/{toBangla(8)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
