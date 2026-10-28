export default function AnalysingOverlay({ photoUrl, text }: { photoUrl: string; text: string }) {
  return (
    <div className="flex flex-col items-center gap-5 py-6">
      <div className="analysing-pulse rounded-[20px] overflow-hidden w-full">
        <img src={photoUrl} alt="থালা" className="w-full aspect-square object-cover" />
      </div>
      <p className="text-xl font-semibold text-leaf">{text}</p>
    </div>
  );
}
