import { useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import Header from './components/Header';
import Onboarding from './components/Onboarding';
import Home from './pages/Home';
import Result from './pages/Result';
import History from './pages/History';
import Library from './pages/Library';
import LibraryDetail from './pages/LibraryDetail';
import Settings from './pages/Settings';
import Login from './pages/Login';
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
  const { prefs } = useLang();
  const [, setDoneTick] = useState(0);
  return (
    <div className="w-full min-h-svh app-bg relative overflow-x-clip">
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
            </Routes>
          </Shell>
        )}
      </main>
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
