import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, Clock3, LogIn, LogOut, Settings, UtensilsCrossed } from 'lucide-react';
import { isDemo, setDemo } from '../lib/store';
import { onAuthChange, signOut, type User } from '../lib/supabase';
import { useLang } from '../lib/i18n';

export default function Header() {
  const { t } = useLang();
  const [demo, setDemoState] = useState(isDemo());
  const [user, setUser] = useState<User | null>(null);
  const timer = useRef<number | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => onAuthChange(setUser), []);

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

  const navBtn =
    'min-w-14 h-14 px-2 flex flex-col sm:flex-row items-center justify-center sm:gap-2 rounded-2xl hover:bg-white/10 transition-colors';

  return (
    <header className="text-white sticky top-0 z-20 shadow-md w-full" style={{ background: 'linear-gradient(100deg, #14532D 0%, #1E7A46 90%)' }}>
      <div className="w-full px-4 sm:px-8 lg:px-16 2xl:px-24 h-16 lg:h-20 flex items-center justify-between gap-2">
        <button
          onPointerDown={startPress}
          onPointerUp={endPress}
          onPointerLeave={endPress}
          onClick={() => navigate('/')}
          className="text-left min-h-14 flex items-center gap-3 select-none btn-press"
          aria-label={t('appName')}
        >
          <span className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
            <UtensilsCrossed size={24} aria-hidden />
          </span>
          <span className="flex flex-col justify-center">
            <span className="text-xl lg:text-3xl font-bold leading-tight">
              {t('appName')}{' '}
              {demo && (
                <span className="text-xs bg-amber-warm text-ink rounded px-1.5 py-0.5 align-middle">DEMO</span>
              )}
            </span>
            <span className="text-xs opacity-90 leading-tight">{t('tagline')}</span>
          </span>
        </button>

        <nav className="flex items-center gap-1 shrink-0">
          {location.pathname !== '/library' && !location.pathname.startsWith('/library/') && (
            <Link to="/library" className={navBtn} aria-label={t('library')}>
              <BookOpen size={24} aria-hidden />
              <span className="text-[11px] sm:text-base font-semibold leading-none">{t('libraryShort')}</span>
            </Link>
          )}
          {location.pathname !== '/history' && (
            <Link to="/history" className={navBtn} aria-label={t('history')}>
              <Clock3 size={24} aria-hidden />
              <span className="text-[11px] sm:text-base font-semibold leading-none">{t('history')}</span>
            </Link>
          )}
          <Link to="/settings" className={navBtn} aria-label={t('settings')}>
            <Settings size={24} aria-hidden />
            <span className="text-[11px] sm:text-base font-semibold leading-none hidden sm:inline">{t('settings')}</span>
          </Link>
          {user ? (
            <span className="flex items-center gap-1">
              <span
                className="w-11 h-11 rounded-full bg-amber-warm text-ink font-black flex items-center justify-center"
                title={user.email ?? ''}
                aria-label={user.email ?? 'user'}
              >
                {(user.email?.[0] ?? 'U').toUpperCase()}
              </span>
              <button
                onClick={async () => { await signOut(); }}
                className={navBtn}
                aria-label={t('logout')}
              >
                <LogOut size={24} aria-hidden />
                <span className="text-[11px] sm:text-base font-semibold leading-none">{t('logout')}</span>
              </button>
            </span>
          ) : (
            location.pathname !== '/login' && (
              <Link to="/login" className={navBtn} aria-label={t('login')}>
                <LogIn size={24} aria-hidden />
                <span className="text-[11px] sm:text-base font-semibold leading-none">{t('login')}</span>
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  );
}
