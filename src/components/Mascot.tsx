export type MascotMood = 'idle' | 'happy' | 'encourage' | 'caring';

/** পুষ্টি বন্ধু — pure SVG/CSS mascot, no image files. Reactions by mood. */
export default function Mascot({ mood = 'idle', size = 96 }: { mood?: MascotMood; size?: number }) {
  const happy = mood === 'happy';
  const caring = mood === 'caring';
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      role="img"
      aria-label="পুষ্টি বন্ধু"
      className={`mascot mascot-${mood} shrink-0`}
    >
      <defs>
        <radialGradient id="mascotBody" cx="38%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#3FA45B" />
          <stop offset="100%" stopColor="#1E7A46" />
        </radialGradient>
      </defs>
      {/* waving arm (happy) */}
      <g className="mascot-arm">
        <path d="M100 74 q16 -6 15 -22" fill="none" stroke="#1E7A46" strokeWidth="9" strokeLinecap="round" />
        <circle cx="115" cy="50" r="7" fill="#2E9E57" />
      </g>
      {/* body */}
      <circle cx="60" cy="66" r="42" fill="url(#mascotBody)" />
      {/* belly highlight */}
      <ellipse cx="60" cy="82" rx="22" ry="16" fill="rgba(255,255,255,0.16)" />
      {/* leaf on head */}
      <g className="mascot-leaf">
        <path d="M60 26 C 52 10, 68 4, 78 8 C 80 20, 70 27, 60 26 Z" fill="#F59E0B" />
        <path d="M60 26 C 60 18, 64 12, 72 9" fill="none" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />
      </g>
      {/* eyes */}
      {happy ? (
        <>
          <path d="M38 60 q7 -8 14 0" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
          <path d="M68 60 q7 -8 14 0" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
        </>
      ) : caring ? (
        <>
          <path d="M38 58 q7 5 14 0" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
          <path d="M68 58 q7 5 14 0" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="45" cy="58" r="5" fill="#fff" />
          <circle cx="75" cy="58" r="5" fill="#fff" />
          <circle cx="46.5" cy="59.5" r="2.2" fill="#14532D" />
          <circle cx="76.5" cy="59.5" r="2.2" fill="#14532D" />
        </>
      )}
      {/* cheeks */}
      <circle cx="36" cy="72" r="6" fill="rgba(245,158,11,0.5)" />
      <circle cx="84" cy="72" r="6" fill="rgba(245,158,11,0.5)" />
      {/* mouth */}
      {happy ? (
        <path d="M46 72 q14 14 28 0 q-4 12 -14 12 q-10 0 -14 -12Z" fill="#fff" />
      ) : caring ? (
        <path d="M50 76 q10 6 20 0" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
      ) : (
        <path d="M48 72 q12 10 24 0" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
      )}
    </svg>
  );
}
