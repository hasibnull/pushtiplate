import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import Result from './pages/Result';
import History from './pages/History';

function Shell({ children }: { children: ReactNode }) {
  const location = useLocation();
  return (
    <div key={location.pathname} className="screen-enter">
      {children}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="mx-auto w-full max-w-[480px] md:max-w-[640px] lg:max-w-[1200px] min-h-svh bg-cream lg:shadow-xl">
        <Header />
        <main className="w-full">
          <Shell>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/result" element={<Result />} />
              <Route path="/history" element={<History />} />
            </Routes>
          </Shell>
        </main>
      </div>
    </BrowserRouter>
  );
}
