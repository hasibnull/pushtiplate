import { Link } from 'react-router-dom';
import { AlertTriangle, UtensilsCrossed } from 'lucide-react';
import Mascot from './Mascot';
import { useLang } from '../lib/i18n';

export default function Footer() {
  const { t } = useLang();
  const linkCls =
    'block py-1.5 text-white/75 hover:text-white link-slide w-fit text-[15px] leading-snug';
  const headCls = 'text-xs font-bold uppercase tracking-[0.14em] text-amber-warm mb-2';

  return (
    <footer className="relative w-full text-white" style={{ background: '#0B2E1D', borderTop: '2px solid rgba(245,158,11,0.65)' }}>
      <div className="w-full px-4 sm:px-8 lg:px-16 2xl:px-24 pt-10 pb-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <span className="w-11 h-11 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                <UtensilsCrossed size={23} aria-hidden />
              </span>
              <div>
                <p className="font-bold text-xl leading-tight">{t('appName')}</p>
                <p className="text-sm text-white/60 leading-tight">{t('tagline')}</p>
              </div>
              <Mascot mood="happy" size={46} />
            </div>
            <p className="text-white/75 text-[15px] leading-relaxed mt-3 max-w-xs">{t('missionLine')}</p>
          </div>

          {/* Explore */}
          <nav aria-label={t('exploreTitle')}>
            <p className={headCls}>{t('exploreTitle')}</p>
            <Link to="/library" className={linkCls}>{t('library')}</Link>
            <Link to="/history" className={linkCls}>{t('history')}</Link>
            <Link to="/play" className={linkCls}>{t('playTitle')}</Link>
            <Link to="/quiz" className={linkCls}>{t('quizTitle')}</Link>
            <Link to="/faq" className={linkCls}>{t('faqTitle')}</Link>
          </nav>

          {/* Legal */}
          <nav aria-label={t('legalTitle')}>
            <p className={headCls}>{t('legalTitle')}</p>
            <Link to="/disclaimer" className={linkCls}>{t('disclaimerPageTitle')}</Link>
            <Link to="/privacy" className={linkCls}>{t('privacyPageTitle')}</Link>
            <Link to="/terms" className={linkCls}>{t('termsPageTitle')}</Link>
          </nav>

          {/* About */}
          <div>
            <p className={headCls}>{t('aboutTitle')}</p>
            <p className="text-white/75 text-[15px] leading-relaxed">{t('aboutLine1')}</p>
            <p className="text-white/75 text-[15px] leading-relaxed mt-2">{t('aboutLine2')}</p>
          </div>
        </div>

        {/* Visible disclaimer — always on screen, in the selected language */}
        <p className="mt-8 rounded-2xl bg-white/[0.06] border border-white/10 px-4 py-3 text-sm leading-relaxed text-white/85 flex gap-2.5">
          <AlertTriangle size={18} className="text-amber-warm shrink-0 mt-0.5" aria-hidden />
          <span>{t('footerDisclaimer')}</span>
        </p>

        {/* Bottom bar */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3 text-center text-[13px] text-white/55">
          <span>{t('footerRights')}</span>
          <span aria-hidden className="hidden sm:inline text-amber-warm">•</span>
          <span>{t('footerBuilt')}</span>
          <span aria-hidden className="hidden sm:inline text-amber-warm">•</span>
          <span>{t('footerMade')}</span>
        </div>
      </div>
    </footer>
  );
}
