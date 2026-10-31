import { useCallback, useRef, useState, type ReactNode } from 'react';
import { ChevronsLeftRight } from 'lucide-react';

/** Before/after comparison: drag the handle (mouse, touch, or keyboard) to reveal tomorrow. */
export default function CompareSlider({
  beforeSrc,
  after,
}: {
  beforeSrc: string;
  after: ReactNode;
}) {
  const [pos, setPos] = useState(55);
  const ref = useRef<HTMLDivElement>(null);

  const setFromClientX = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.min(96, Math.max(4, ((clientX - r.left) / r.width) * 100)));
  }, []);

  const onPointer = (e: React.PointerEvent) => {
    if (e.type === 'pointerdown') (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    if (e.buttons || e.type === 'pointerdown') setFromClientX(e.clientX);
  };

  return (
    <div
      ref={ref}
      className="relative w-full aspect-square lg:aspect-[16/9] rounded-2xl overflow-hidden select-none touch-none cursor-ew-resize bg-cream"
      onPointerDown={onPointer}
      onPointerMove={onPointer}
    >
      {/* After (tomorrow) — full layer underneath */}
      <div className="absolute inset-0">{after}</div>
      {/* Before (today) — clipped from the right */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <img src={beforeSrc} alt="আজ" className="w-full h-full object-cover" draggable={false} />
      </div>

      <span className="absolute top-3 left-3 bg-black/55 text-white font-bold px-3 py-1 rounded-full backdrop-blur-sm">
        আজ
      </span>
      <span className="absolute top-3 right-3 bg-primary/85 text-white font-bold px-3 py-1 rounded-full backdrop-blur-sm">
        আগামীকাল
      </span>

      {/* Handle */}
      <div className="absolute top-0 bottom-0 z-10" style={{ left: `calc(${pos}% - 1px)` }}>
        <div className="w-0.5 h-full bg-white shadow-[0_0_12px_rgba(0,0,0,0.45)]" />
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-white shadow-xl border border-black/5 text-primary flex items-center justify-center">
          <ChevronsLeftRight size={28} aria-hidden />
        </div>
      </div>

      <input
        type="range"
        min={4}
        max={96}
        value={Math.round(pos)}
        onChange={(e) => setPos(Number(e.target.value))}
        className="absolute inset-x-4 bottom-3 w-[calc(100%-2rem)] opacity-0 h-14 cursor-ew-resize"
        aria-label="আজ / আগামীকাল"
      />
    </div>
  );
}
