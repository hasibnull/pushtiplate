import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FOOD_GROUPS } from '../lib/scoring';
import { LIBRARY_FOODS } from '../lib/library';
import FoodIcon from '../components/FoodIcon';

export default function Library() {
  const [filter, setFilter] = useState<string>('all');
  const foods = useMemo(
    () => (filter === 'all' ? LIBRARY_FOODS : LIBRARY_FOODS.filter((f) => f.group === filter)),
    [filter],
  );
  const groupLabel = (id: string) => FOOD_GROUPS.find((g) => g.id === id)?.label ?? '';

  return (
    <div className="w-full px-4 sm:px-8 lg:px-16 2xl:px-24 py-5 lg:py-10">
      <h1 className="text-3xl lg:text-4xl font-bold text-leaf">খাবারের লাইব্রেরি</h1>

      <div className="flex gap-2 mt-5 overflow-x-auto pb-2 -mx-1 px-1">
        <button
          onClick={() => setFilter('all')}
          className={`btn-press shrink-0 min-h-14 px-4 rounded-full font-semibold border-2 ${
            filter === 'all' ? 'bg-primary text-white border-primary' : 'bg-white border-primary/30 text-ink'
          }`}
        >
          সব
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
            {g.label}
          </button>
        ))}
      </div>

      <div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5 mt-4"
      >
        {foods.map((f, i) => (
          <Link
            key={f.id}
            to={`/library/${f.id}`}
            style={{ animationDelay: `${Math.min(i, 10) * 50}ms` }}
            className="tile-pop elev-card bg-white rounded-3xl overflow-hidden flex flex-col min-w-0"
          >
            {f.image ? (
              <img src={f.image} alt={f.english} className="w-full aspect-square object-cover" loading="lazy" />
            ) : (
              <div className="w-full aspect-square bg-primary/10 text-primary flex items-center justify-center">
                <FoodIcon group={f.group} size={84} />
              </div>
            )}
            <div className="p-3 lg:p-4 flex flex-col gap-1.5 grow">
              <p className="font-bold text-lg leading-tight">{f.bangla}</p>
              <p className="text-sm text-ink/60">{f.english}</p>
              <span className="self-start bg-primary/10 text-leaf text-xs font-semibold rounded-full px-2.5 py-1 flex items-center gap-1">
                <FoodIcon group={f.group} size={14} /> {groupLabel(f.group)}
              </span>
              <p className="text-sm leading-snug">{f.why}</p>
              <p className="text-sm text-ink/70 mt-auto">
                প্রোটিন: আনুমানিক {f.proteinApprox} · {f.startAge}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <p className="text-sm text-center text-ink/60 mt-8">এটি সাধারণ পুষ্টি তথ্য, চিকিৎসা পরামর্শ নয়</p>
    </div>
  );
}
