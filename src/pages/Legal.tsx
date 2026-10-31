import type { ReactNode } from 'react';
import { Info } from 'lucide-react';
import { useLang } from '../lib/i18n';

function LegalShell({ titleKey, summaryKey, children }: { titleKey: string; summaryKey: string; children: ReactNode }) {
  const { t } = useLang();
  return (
    <div className="w-full px-4 sm:px-8 lg:px-16 2xl:px-24 py-6 lg:py-10">
      <div className="max-w-3xl mx-auto flex flex-col gap-5">
        <h1 className="text-3xl lg:text-4xl font-extrabold text-leaf">{t(titleKey)}</h1>
        <div className="glass-card rounded-3xl px-5 py-4 flex gap-3">
          <Info size={22} className="text-primary shrink-0 mt-0.5" aria-hidden />
          <p className="font-semibold leading-relaxed">{t(summaryKey)}</p>
        </div>
        <article className="glass-card rounded-[2rem] px-5 py-6 lg:px-8 flex flex-col gap-5 text-[15px] leading-relaxed text-ink/85">
          {children}
        </article>
      </div>
    </div>
  );
}

function H({ children }: { children: ReactNode }) {
  return <h2 className="text-lg font-bold text-leaf -mb-3">{children}</h2>;
}

export function DisclaimerPage() {
  return (
    <LegalShell titleKey="disclaimerPageTitle" summaryKey="disclaimerSummary">
      <H>General information only</H>
      <p>PushtiPlate provides general nutrition education for parents and caregivers of children aged 6–23 months. It is based on the WHO/UNICEF dietary diversity guidance (at least 5 of 8 food groups per day). It is not a medical service.</p>
      <H>AI can make mistakes — always check</H>
      <p>The plate analysis is done by an AI model looking at your photo. It can misread a food, especially in poor light or when foods are mixed. Always look at the result, check it against the real plate, and tap any food-group icon that is wrong to correct it before relying on the score.</p>
      <H>Calories are approximate</H>
      <p>Calorie and protein numbers are rough estimates calculated from standard food data and typical serving sizes. Your child's actual portion may be larger or smaller, so treat these numbers as a general idea only — never as a measurement.</p>
      <H>No diagnosis or treatment</H>
      <p>This app does not diagnose, treat, or prevent any illness or condition, and it does not replace a doctor, nurse, nutritionist, or community health worker.</p>
      <H>When to see a health worker</H>
      <p>If your child is ill, has fever or diarrhoea, refuses food, is losing weight, or is not growing well, please consult a doctor or community health worker promptly. Do not wait for the app.</p>
    </LegalShell>
  );
}

export function PrivacyPage() {
  return (
    <LegalShell titleKey="privacyPageTitle" summaryKey="privacySummary">
      <H>What we collect</H>
      <p>Only what the app needs to work: the plate photos you take, your child's age band (6–11, 12–17, or 18–23 months — never a birth date), your language and country preference, and your plate history (scores and dates). If — and only if — you choose to register, we also store your email address so you can log in and see your own history.</p>
      <H>Why we collect it</H>
      <p>To analyse the plate, show your result, and save your history so you can follow progress over time. We do not collect data for advertising, and we do not build profiles of you or your child.</p>
      <H>Where photos live</H>
      <p>Plate photos are stored in a private Supabase storage bucket. They are not public: the app opens them through short-lived signed links. Your photos are never sold, rented, or shared with advertisers or any third party for marketing.</p>
      <H>Guest mode</H>
      <p>Everything in PushtiPlate works without an account. Guest mode asks for no name, no email, and no personal details.</p>
      <H>Only the plate — never the child</H>
      <p>The app is designed for photos of food only and asks you to photograph just the plate. Please never take or upload photos of your child or any person.</p>
      <H>Deleting your data</H>
      <p>You can ask us to delete your photos, history, and account at any time. Send a request to [CONTACT EMAIL] from the email you registered with (guests can simply stop using the app — guest photos are not linked to any identity).</p>
    </LegalShell>
  );
}

export function TermsPage() {
  return (
    <LegalShell titleKey="termsPageTitle" summaryKey="termsSummary">
      <H>A free hackathon demo</H>
      <p>PushtiPlate is a free demonstration built for the Meta Global AI Developer Hackathon 2026. It is provided "as is", without warranties of any kind. The service may change, pause, or stop at any time without notice.</p>
      <H>Guidance, not professional advice</H>
      <p>Use the app as everyday feeding guidance only. It is not a substitute for professional medical, nutritional, or health advice, and it never overrides what your doctor or community health worker tells you.</p>
      <H>Acceptable use</H>
      <p>Please use the app honestly and kindly. Do not misuse it, try to break or overload it, or upload unlawful content. Never upload photos of people — especially children. Plate photos only.</p>
      <H>Your responsibility</H>
      <p>You are responsible for checking the AI's result against the real plate and for your child's feeding decisions. If anything about your child's health worries you, a health worker — not an app — is the right next step.</p>
    </LegalShell>
  );
}
