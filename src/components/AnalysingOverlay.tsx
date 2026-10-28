export default function AnalysingOverlay({ photoUrl, text }: { photoUrl: string; text: string }) {
  return (
    <div className="flex flex-col items-center gap-5 py-6 lg:py-10 max-w-xl mx-auto">
      <div className="analysing-pulse relative rounded-3xl overflow-hidden w-full shadow-lg">
        <img src={photoUrl} alt="থালা" className="w-full aspect-square object-cover" />
        <span className="scan-line" aria-hidden />
      </div>
      <div className="w-full space-y-3" aria-hidden>
        <div className="shimmer h-5 rounded-full w-3/4 mx-auto" />
        <div className="shimmer h-5 rounded-full w-1/2 mx-auto" />
      </div>
      <p className="text-xl font-semibold text-leaf">{text}</p>
    </div>
  );
}
