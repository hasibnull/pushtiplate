import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Onboarding from './components/Onboarding';
import Mascot from './components/Mascot';
import { AlertTriangle, X } from 'lucide-react';
import Home from './pages/Home';
import Result from './pages/Result';
import History from './pages/History';
import Library from './pages/Library';
import LibraryDetail from './pages/LibraryDetail';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Playground from './pages/Playground';
import Quiz from './pages/Quiz';
import Faq from './pages/Faq';
import { DisclaimerPage, PrivacyPage, TermsPage } from './pages/Legal';
import { LanguageProvider, useLang } from './lib/i18n';

function Shell({ children }: { children: ReactNode }) {
  const location = useLocation();
  return (
    <div key={location.pathname} className="screen-enter w-full">
      {children}
    </div>
  );
}

function Root() {
  const { prefs, t } = useLang();
  const [, setDoneTick] = useState(0);
  const [splash, setSplash] = useState(() => !sessionStorage.getItem('pushtiplate:splashed'));
  const [notice, setNotice] = useState(() => !sessionStorage.getItem('pushtiplate:notice-closed'));

  // Theme + big text + once-a-day local reminder (Phase 4)
  useEffect(() => {
    document.documentElement.classList.toggle('dark', prefs.theme === 'dark');
    document.documentElement.classList.toggle('big-text', prefs.bigText);
  }, [prefs.theme, prefs.bigText]);

  useEffect(() => {
    if (!splash) return;
    sessionStorage.setItem('pushtiplate:splashed', '1');
    const id = window.setTimeout(() => setSplash(false), 1750);
    return () => window.clearTimeout(id);
  }, [splash]);

  useEffect(() => {
    if (!prefs.reminder || !('Notification' in window)) return;
    const today = new Date().toDateString();
    if (localStorage.getItem('pushtiplate:reminded') === today) return;
    if (Notification.permission === 'granted') {
      try {
        new Notification(t('reminderText'), { body: t('reminderBody') });
        localStorage.setItem('pushtiplate:reminded', today);
      } catch { /* ignore */ }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefs.reminder]);

  return (
    <div className="w-full min-h-svh app-bg relative">
      {splash && (
        <div
          aria-hidden
          className="splash-hide fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 text-white"
          style={{ background: 'linear-gradient(140deg, #14532D 0%, #1E7A46 80%)' }}
        >
          <div className="splash-logo flex flex-col items-center gap-3">
            <Mascot mood="happy" size={120} />
            <p className="text-4xl font-bold">{t('appName')}</p>
            <p className="opacity-90">{t('tagline')}</p>
          </div>
        </div>
      )}
      {/* Hackathon demo notice — scrolls away, closable for this session only */}
      {notice && (
        <div
          className="relative z-30 w-full text-ink"
          style={{ background: 'linear-gradient(90deg, #FBBF24, #F59E0B)' }}
          role="note"
        >
          <div className="w-full px-3 sm:px-8 lg:px-16 2xl:px-24 min-h-9 py-1 flex items-center gap-1.5 sm:gap-2">
            <AlertTriangle size={15} className="shrink-0" aria-hidden />
            <p className="flex-1 text-center whitespace-nowrap text-[10px] min-[420px]:text-xs sm:text-sm leading-tight font-bold">
              This project is built for the Meta AI Developer Hackathon — Demo
            </p>
            <button
              onClick={() => { sessionStorage.setItem('pushtiplate:notice-closed', '1'); setNotice(false); }}
              className="btn-press shrink-0 w-8 h-8 -my-1 rounded-full flex items-center justify-center hover:bg-black/10"
              aria-label="Close"
            >
              <X size={16} aria-hidden />
            </button>
          </div>
        </div>
      )}
      {/* soft hero color blobs (decorative) */}
      <div aria-hidden className="absolute inset-x-0 top-16 h-[420px] overflow-hidden pointer-events-none">
        <div className="blob w-96 h-96 -left-24 top-0" style={{ background: 'rgba(30,122,70,0.13)' }} />
        <div className="blob w-80 h-80 right-[-4rem] top-16" style={{ background: 'rgba(245,158,11,0.12)', animationDelay: '-6s' }} />
      </div>
      <Header />
      <main className="w-full relative">
        {!prefs.onboarded ? (
          <Onboarding onDone={() => setDoneTick((n) => n + 1)} />
        ) : (
          <Shell>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/result" element={<Result />} />
              <Route path="/history" element={<History />} />
              <Route path="/library" element={<Library />} />
              <Route path="/library/:id" element={<LibraryDetail />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/login" element={<Login />} />
              <Route path="/play" element={<Playground />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/disclaimer" element={<DisclaimerPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
            </Routes>
          </Shell>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Root />
      </BrowserRouter>
    </LanguageProvider>
  );
}
