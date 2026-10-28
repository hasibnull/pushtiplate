import { useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Clock3, UtensilsCrossed } from 'lucide-react';
import { isDemo, setDemo } from '../lib/store';

export default function Header() {
  const [demo, setDemoState] = useState(isDemo());
  const timer = useRef<number | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Demo Mode: long-press (800ms) the logo (§6 Prompt 10)
  const startPress = () => {
    timer.current = window.setTimeout(() => {
      const next = !isDemo();
      setDemo(next);
      setDemoState(next);
    }, 800);
  };
  const endPress = () => {
    if (timer.current) window.clearTimeout(timer.current);
  };

  return (
    <header className="bg-leaf text-white sticky top-0 z-20 shadow-md">
      <div className="mx-auto w-full px-4 lg:px-8 h-16 flex items-center justify-between">
        <button
          onPointerDown={startPress}
          onPointerUp={endPress}
          onPointerLeave={endPress}
          onClick={() => navigate('/')}
          className="text-left min-h-14 flex items-center gap-3 select-none btn-press"
          aria-label="পুষ্টি থালা"
        >
          <span className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
            <UtensilsCrossed size={24} aria-hidden />
          </span>
          <span className="flex flex-col justify-center">
            <span className="text-xl font-bold leading-tight">
              পুষ্টি থালা{' '}
              {demo && (
                <span className="text-xs bg-amber-warm text-ink rounded px-1.5 py-0.5 align-middle">DEMO</span>
              )}
            </span>
            <span className="text-xs opacity-90 leading-tight">আজকের থালা, কালকের শক্তি</span>
          </span>
        </button>
        {location.pathname !== '/history' && (
          <Link
            to="/history"
            className="w-14 h-14 flex items-center justify-center rounded-2xl hover:bg-white/10 transition-colors"
            aria-label="আগের থালা"
          >
            <Clock3 size={26} aria-hidden />
          </Link>
        )}
      </div>
    </header>
  );
}
