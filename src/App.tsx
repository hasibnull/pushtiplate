import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import Result from './pages/Result';
import History from './pages/History';
import Library from './pages/Library';
import LibraryDetail from './pages/LibraryDetail';

function Shell({ children }: { children: ReactNode }) {
  const location = useLocation();
  return (
    <div key={location.pathname} className="screen-enter w-full">
      {children}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="w-full min-h-svh bg-cream">
        <Header />
        <main className="w-full">
          <Shell>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/result" element={<Result />} />
              <Route path="/history" element={<History />} />
              <Route path="/library" element={<Library />} />
              <Route path="/library/:id" element={<LibraryDetail />} />
            </Routes>
          </Shell>
        </main>
      </div>
    </BrowserRouter>
  );
}
