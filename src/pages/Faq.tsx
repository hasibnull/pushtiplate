import { useLang } from '../lib/i18n';

export default function Faq() {
  const { t } = useLang();
  const items = [1, 2, 3, 4, 5].map((n) => ({ q: t(`faqQ${n}`), a: t(`faqA${n}`) }));
  return (
    <div className="w-full px-4 sm:px-8 lg:px-16 2xl:px-24 py-6 lg:py-10">
      <div className="max-w-3xl mx-auto flex flex-col gap-4">
        <h1 className="text-3xl lg:text-4xl font-extrabold text-leaf">{t('faqTitle')}</h1>
        {items.map((it) => (
          <section key={it.q} className="glass-card rounded-3xl px-5 py-4">
            <h2 className="font-bold text-lg text-leaf">{it.q}</h2>
            <p className="text-ink/75 leading-relaxed mt-1">{it.a}</p>
          </section>
        ))}
        <p className="text-center text-sm text-ink/60">{t('workerNote')}</p>
      </div>
    </div>
  );
}
