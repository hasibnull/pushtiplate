import { useEffect, useState } from 'react';
import { toBangla } from '../lib/scoring';

/** Circular score ring: fills to score/8 over 1.2s, number counts up inside. */
export default function ScoreRing({
  score,
  color,
  displayScore,
}: {
  score: number;
  color: string;
  displayScore: number;
}) {
  const R = 84;
  const C = 2 * Math.PI * R;
  const [filled, setFilled] = useState(0);
  useEffect(() => {
    setFilled(0);
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => setFilled(score / 8)),
    );
    return () => cancelAnimationFrame(raf);
  }, [score]);

  return (
    <div className="relative w-44 h-44 lg:w-56 lg:h-56 shrink-0 mx-auto">
      <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
        <circle cx="100" cy="100" r={R} fill="none" stroke="rgba(20,83,45,0.10)" strokeWidth="14" />
        <circle
          cx="100"
          cy="100"
          r={R}
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - filled)}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1), stroke 0.3s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl lg:text-6xl font-bold text-leaf tabular-nums leading-none">
          {toBangla(displayScore)} / {toBangla(8)}
        </span>
        <span className="text-base text-ink/60 mt-1.5">ধরনের খাবার</span>
      </div>
    </div>
  );
}
