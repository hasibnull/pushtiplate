import { useMemo } from 'react';

const COLORS = ['#1E7A46', '#F59E0B', '#7BC79B', '#FBBF24', '#14532D'];

/** Small tasteful green/amber burst (pure CSS particles, no library). Renders once. */
export default function Confetti({ show }: { show: boolean }) {
  const parts = useMemo(
    () =>
      Array.from({ length: 42 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 340,
        y: -(60 + Math.random() * 260),
        rot: Math.random() * 540 - 270,
        delay: Math.random() * 0.25,
        dur: 1.5 + Math.random() * 1.1,
        color: COLORS[i % COLORS.length],
        round: Math.random() > 0.5,
      })),
    [],
  );
  if (!show) return null;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-24 z-30 flex justify-center overflow-visible">
      {parts.map((p) => (
        <span
          key={p.id}
          className="confetti-bit"
          style={{
            background: p.color,
            borderRadius: p.round ? '50%' : '2px',
            ['--cx' as string]: `${p.x}px`,
            ['--cy' as string]: `${p.y}px`,
            ['--cr' as string]: `${p.rot}deg`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
          }}
        />
      ))}
    </div>
  );
}
