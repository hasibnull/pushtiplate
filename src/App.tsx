import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Result from './pages/Result';
import History from './pages/History';

export default function App() {
  return (
    <BrowserRouter>
      <div className="mx-auto max-w-[480px] min-h-svh bg-cream shadow-xl">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/result" element={<Result />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
