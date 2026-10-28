import { useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
    <header className="bg-leaf text-white sticky top-0 z-20 shadow">
      <div className="mx-auto max-w-[480px] px-4 h-16 flex items-center justify-between">
        <button
          onPointerDown={startPress}
          onPointerUp={endPress}
          onPointerLeave={endPress}
          onClick={() => navigate('/')}
          className="text-left min-h-14 flex flex-col justify-center select-none"
          aria-label="পুষ্টি থালা"
        >
          <span className="text-xl font-bold leading-tight">
            পুষ্টি থালা {demo && <span className="text-xs bg-amber-warm text-ink rounded px-1.5 py-0.5 align-middle">DEMO</span>}
          </span>
          <span className="text-xs opacity-90 leading-tight">আজকের থালা, কালকের শক্তি</span>
        </button>
        {location.pathname !== '/history' && (
          <Link
            to="/history"
            className="w-14 h-14 flex items-center justify-center text-2xl"
            aria-label="আগের থালা"
          >
            🕐
          </Link>
        )}
      </div>
    </header>
  );
}
