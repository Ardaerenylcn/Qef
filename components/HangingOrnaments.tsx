"use client";

interface Ornament {
  color: string;
  highlight: string;
  size: number;
  stringLen: number;
  delay: number;
  duration: number;
}

const XMAS: Ornament[] = [
  { color: "#dc2626", highlight: "#ff8a80", size: 22, stringLen: 52, delay: 0,    duration: 3.2 },
  { color: "#15803d", highlight: "#4ade80", size: 17, stringLen: 68, delay: 0.6,  duration: 2.8 },
  { color: "#d97706", highlight: "#fde68a", size: 25, stringLen: 40, delay: 1.3,  duration: 3.5 },
  { color: "#7c3aed", highlight: "#c4b5fd", size: 16, stringLen: 78, delay: 0.9,  duration: 2.6 },
  { color: "#b91c1c", highlight: "#fca5a5", size: 20, stringLen: 46, delay: 0.3,  duration: 3.0 },
  { color: "#1d4ed8", highlight: "#93c5fd", size: 26, stringLen: 36, delay: 2.0,  duration: 3.8 },
  { color: "#d97706", highlight: "#fde68a", size: 18, stringLen: 62, delay: 0.7,  duration: 2.9 },
  { color: "#15803d", highlight: "#4ade80", size: 21, stringLen: 44, delay: 1.6,  duration: 3.3 },
  { color: "#c0c0c0", highlight: "#f1f5f9", size: 14, stringLen: 74, delay: 1.1,  duration: 2.7 },
];

const NY: Ornament[] = [
  { color: "#6366f1", highlight: "#a5b4fc", size: 22, stringLen: 52, delay: 0,    duration: 3.2 },
  { color: "#d97706", highlight: "#fde68a", size: 17, stringLen: 68, delay: 0.6,  duration: 2.8 },
  { color: "#8b5cf6", highlight: "#ddd6fe", size: 25, stringLen: 40, delay: 1.3,  duration: 3.5 },
  { color: "#d1d5db", highlight: "#f9fafb", size: 16, stringLen: 78, delay: 0.9,  duration: 2.6 },
  { color: "#818cf8", highlight: "#c7d2fe", size: 20, stringLen: 46, delay: 0.3,  duration: 3.0 },
  { color: "#fbbf24", highlight: "#fef9c3", size: 26, stringLen: 36, delay: 2.0,  duration: 3.8 },
  { color: "#a78bfa", highlight: "#ede9fe", size: 18, stringLen: 62, delay: 0.7,  duration: 2.9 },
  { color: "#e5e7eb", highlight: "#ffffff", size: 21, stringLen: 44, delay: 1.6,  duration: 3.3 },
  { color: "#7c3aed", highlight: "#c4b5fd", size: 14, stringLen: 74, delay: 1.1,  duration: 2.7 },
];

// Valentine's hanging hearts
const HEARTS: Ornament[] = [
  { color: "#f43f5e", highlight: "#fda4af", size: 20, stringLen: 55, delay: 0,    duration: 3.4 },
  { color: "#fb7185", highlight: "#fecdd3", size: 16, stringLen: 70, delay: 0.7,  duration: 2.9 },
  { color: "#e11d48", highlight: "#fda4af", size: 24, stringLen: 42, delay: 1.4,  duration: 3.6 },
  { color: "#f9a8d4", highlight: "#fce7f3", size: 14, stringLen: 80, delay: 1.0,  duration: 2.7 },
  { color: "#f43f5e", highlight: "#fda4af", size: 22, stringLen: 48, delay: 0.4,  duration: 3.1 },
  { color: "#be185d", highlight: "#f9a8d4", size: 27, stringLen: 38, delay: 2.1,  duration: 3.9 },
  { color: "#fb7185", highlight: "#fecdd3", size: 17, stringLen: 64, delay: 0.8,  duration: 2.8 },
  { color: "#e11d48", highlight: "#fda4af", size: 19, stringLen: 46, delay: 1.7,  duration: 3.2 },
  { color: "#fda4af", highlight: "#fce7f3", size: 13, stringLen: 76, delay: 1.2,  duration: 2.6 },
];

interface Props {
  variant: "christmas" | "new-year" | "hearts";
}

export default function HangingOrnaments({ variant }: Props) {
  const orbs = variant === "christmas" ? XMAS : variant === "hearts" ? HEARTS : NY;
  const isHearts = variant === "hearts";
  const ropeColor = variant === "christmas" ? "#4e342e" : variant === "hearts" ? "#fb7185" : "#374151";

  return (
    <>
      <style>{`
        @keyframes ho-sway {
          0%, 100% { transform: rotate(-4deg); }
          50%       { transform: rotate(4deg); }
        }
        @keyframes ho-sparkle {
          0%, 100% { opacity: 0; transform: scale(0.5) rotate(0deg); }
          50%       { opacity: 1; transform: scale(1.2) rotate(180deg); }
        }
      `}</style>

      <div
        className="w-full pointer-events-none"
        style={{ height: `${Math.max(...orbs.map(o => o.stringLen + o.size + 10))}px` }}
        aria-hidden="true"
      >
        {/* Rope */}
        <div
          className="absolute top-0 left-0 right-0"
          style={{ height: "2px", background: `linear-gradient(90deg, transparent, ${ropeColor}80, ${ropeColor}, ${ropeColor}80, transparent)` }}
        />

        {/* Ornaments */}
        <div className="flex justify-around px-1 absolute top-0 left-0 right-0">
          {orbs.map((o, i) => (
            <div
              key={i}
              className="flex flex-col items-center"
              style={{
                transformOrigin: "top center",
                animation: `ho-sway ${o.duration}s ${o.delay}s ease-in-out infinite`,
              }}
            >
              {/* String */}
              <div style={{ width: "1px", height: `${o.stringLen}px`, background: ropeColor, opacity: 0.5 }} />

              {/* Cap */}
              <div style={{
                width: `${Math.max(6, o.size * 0.28)}px`,
                height: "5px",
                background: `linear-gradient(180deg, #9e7c4a, #6b4d23)`,
                borderRadius: "1px",
                marginBottom: "1px",
              }} />

              {/* Ball / Heart */}
              {isHearts ? (
                <div style={{
                  fontSize: `${o.size + 4}px`,
                  lineHeight: 1,
                  color: o.color,
                  filter: `drop-shadow(0 2px 4px ${o.color}80)`,
                  userSelect: "none",
                }}>
                  ♥
                </div>
              ) : (
                <div style={{
                  width: `${o.size}px`,
                  height: `${o.size}px`,
                  borderRadius: "50%",
                  background: `radial-gradient(circle at 35% 30%, ${o.highlight}, ${o.color} 70%)`,
                  boxShadow: `inset -3px -3px 8px rgba(0,0,0,0.25), inset 2px 2px 5px rgba(255,255,255,0.15), 0 4px 10px rgba(0,0,0,0.3)`,
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Golden sparkles around orbs (non-heart variants) */}
        {!isHearts && [14, 30, 48, 65, 82].map((left, i) => (
          <div
            key={i}
            className="absolute text-yellow-300"
            style={{
              left: `${left}%`,
              top: `${20 + (i % 3) * 15}px`,
              fontSize: "10px",
              animation: `ho-sparkle ${1.5 + i * 0.4}s ${i * 0.3}s ease-in-out infinite`,
              userSelect: "none",
            }}
            aria-hidden="true"
          >
            ✦
          </div>
        ))}
      </div>
    </>
  );
}
