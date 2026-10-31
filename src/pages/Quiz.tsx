import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Check, RotateCcw, Volume2, X } from 'lucide-react';
import { quizRound, type QuizQ } from '../lib/fun';
import { speakText } from '../lib/speak';
import { useLang } from '../lib/i18n';
import Mascot from '../components/Mascot';
import Confetti from '../components/Confetti';

export default function Quiz() {
  const { t, num, prefs } = useLang();
  const lang = prefs.lang;
  const [round, setRound] = useState(0); // bump to reshuffle
  const questions = useMemo<QuizQ[]>(() => quizRound(5), [round]); // eslint-disable-line react-hooks/exhaustive-deps
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [speaking, setSpeaking] = useState(false);

  const done = idx >= questions.length;
  const q = questions[idx];

  const restart = () => { setRound((r) => r + 1); setIdx(0); setChosen(null); setScore(0); };
  const choose = (i: number) => {
    if (chosen !== null) return;
    setChosen(i);
    if (i === q.answer) setScore((s) => s + 1);
  };
  const next = () => { setChosen(null); setIdx((i) => i + 1); };

  if (done) {
    return (
      <div className="w-full px-4 sm:px-8 lg:px-16 2xl:px-24 py-8 lg:py-12 flex flex-col items-center gap-5 relative">
        <Confetti show={score >= 4} />
        <Mascot mood={score >= 4 ? 'happy' : score >= 2 ? 'encourage' : 'caring'} size={120} />
        <p className="text-3xl lg:text-4xl font-bold text-leaf text-center">
          {t('youGot')} {num(score)} {t('of')} {num(questions.length)}
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          <button
            onClick={restart}
            className="btn-press btn-lift btn-primary-glow min-h-16 px-7 rounded-3xl text-white text-xl font-bold flex items-center gap-2"
          >
            <RotateCcw size={24} aria-hidden /> {t('playAgain')}
          </button>
          <Link
            to="/library"
            className="btn-press btn-lift min-h-16 px-7 rounded-3xl bg-leaf text-white text-xl font-bold flex items-center gap-2"
          >
            <BookOpen size={24} aria-hidden /> {t('seeLibraryLine')}
          </Link>
        </div>
      </div>
    );
  }

  const correct = chosen === q.answer;
  return (
    <div className="w-full px-4 sm:px-8 lg:px-16 2xl:px-24 py-5 lg:py-10 flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-3xl lg:text-4xl font-bold text-leaf">{t('quizTitle')}</h1>
        <span className="bg-primary/10 text-leaf font-bold rounded-full px-4 py-2">
          {num(idx + 1)} {t('of')} {num(questions.length)} · ★ {num(score)}
        </span>
      </div>

      <section className="glass-card rounded-3xl p-5 lg:p-7 flex flex-col gap-5 screen-enter" key={`${round}-${idx}`}>
        <div className="flex items-start gap-4">
          <Mascot mood={chosen === null ? 'idle' : correct ? 'happy' : 'caring'} size={72} />
          <h2 className="text-2xl lg:text-3xl font-bold leading-snug grow">{q.q[lang]}</h2>
          <button
            onClick={() => speakText(q.q[lang], setSpeaking, lang)}
            className={`btn-press shrink-0 min-h-14 px-4 rounded-full text-white font-bold flex items-center gap-2 btn-primary-glow ${speaking ? 'speaking' : ''}`}
            aria-label={t('listen')}
          >
            <Volume2 size={22} aria-hidden /> {t('listen')}
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {q.options.map((opt, i) => {
            const isAnswer = i === q.answer;
            const isChosen = i === chosen;
            return (
              <button
                key={i}
                onClick={() => choose(i)}
                disabled={chosen !== null}
                className={`btn-press min-h-20 rounded-3xl border-2 p-4 text-lg font-bold flex items-center justify-between gap-2 ${
                  chosen === null
                    ? 'bg-white/80 border-primary/25 hover:border-primary'
                    : isAnswer
                      ? 'bg-primary text-white border-primary'
                      : isChosen
                        ? 'bg-[#FDECEA] border-soft-red text-soft-red'
                        : 'bg-white/60 border-ink/10 opacity-60'
                }`}
                aria-pressed={isChosen}
              >
                {opt[lang]}
                {chosen !== null && isAnswer && <Check size={24} aria-hidden />}
                {chosen !== null && isChosen && !isAnswer && <X size={24} aria-hidden />}
              </button>
            );
          })}
        </div>

        {chosen !== null && (
          <div className="fade-in-soft flex flex-col gap-3">
            <p className={`text-xl font-bold ${correct ? 'text-primary' : 'text-soft-red'}`}>
              {correct ? t('correct') : `${t('rightAnswer')} ${q.options[q.answer][lang]}`}
            </p>
            <p className="text-lg text-ink/75 max-w-prose">
              {q.fact[lang]}
              {q.health ? ` ${t('workerNote')}` : ''}
            </p>
            <button
              onClick={next}
              className="btn-press btn-lift btn-primary-glow self-start min-h-14 px-7 rounded-3xl text-white text-lg font-bold"
            >
              {t('continue')}
            </button>
          </div>
        )}
      </section>

      <p className="text-xs text-center text-ink/60">{t('disclaimerLibrary')}</p>
    </div>
  );
}
