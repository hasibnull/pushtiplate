import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, UserRound } from 'lucide-react';
import { signIn, signInGoogle, signUp } from '../lib/supabase';
import { useLang } from '../lib/i18n';

export default function Login() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    setMsg(null);
    if (mode === 'signup') {
      const r = await signUp(email.trim(), password);
      setBusy(false);
      if (r.error) return setMsg(t('authError'));
      if ((r as { needsConfirm?: boolean }).needsConfirm) return setMsg(t('checkEmail'));
      navigate('/');
    } else {
      const r = await signIn(email.trim(), password);
      setBusy(false);
      if (r.error) return setMsg(t('authError'));
      navigate('/');
    }
  };

  return (
    <div className="w-full px-4 sm:px-8 lg:px-16 2xl:px-24 py-8 lg:py-14 flex flex-col items-center">
      <div className="w-full max-w-xl glass-card rounded-3xl p-5 lg:p-8 flex flex-col gap-4 screen-enter">
        <h1 className="text-3xl font-bold text-leaf flex items-center gap-3">
          {mode === 'login' ? <LogIn size={32} className="text-primary" aria-hidden /> : <UserPlus size={32} className="text-primary" aria-hidden />}
          {mode === 'login' ? t('login') : t('signUp')}
        </h1>

        <label className="flex flex-col gap-1.5 font-semibold">
          {t('email')}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="min-h-14 rounded-2xl border-2 border-primary/25 px-4 text-lg bg-white/80 font-normal"
            autoComplete="email"
          />
        </label>
        <label className="flex flex-col gap-1.5 font-semibold">
          {t('password')}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="min-h-14 rounded-2xl border-2 border-primary/25 px-4 text-lg bg-white/80 font-normal"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />
        </label>

        {msg && <p className="bg-amber-warm/20 border border-amber-warm rounded-2xl px-4 py-3 font-medium">{msg}</p>}

        <button
          onClick={submit}
          disabled={busy || !email || password.length < 6}
          className="btn-press btn-lift btn-primary-glow min-h-16 rounded-3xl text-white text-xl font-bold disabled:opacity-50"
        >
          {mode === 'login' ? t('login') : t('signUp')}
        </button>

        <button
          onClick={async () => { const r = await signInGoogle(); if (r.error) setMsg(t('authError')); }}
          className="btn-press min-h-16 rounded-3xl border-2 border-primary/30 bg-white/80 font-bold text-lg flex items-center justify-center gap-2"
        >
          <span className="font-black text-primary">G</span> {t('continueGoogle')}
        </button>

        <button
          onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setMsg(null); }}
          className="btn-press min-h-14 rounded-2xl text-primary font-semibold"
        >
          {mode === 'login' ? t('noAccount') : t('haveAccount')}
        </button>

        <button
          onClick={() => navigate('/')}
          className="btn-press min-h-16 rounded-3xl bg-leaf text-white text-lg font-bold flex items-center justify-center gap-2"
        >
          <UserRound size={24} aria-hidden /> {t('continueGuest')}
        </button>
      </div>
    </div>
  );
}
