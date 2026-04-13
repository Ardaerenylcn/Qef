"use client";

export default function WavingFlag() {
  return (
    <>
      <style>{`
        @keyframes wf-wave {
          0%,100% { transform: perspective(200px) rotateY(0deg); }
          30%      { transform: perspective(200px) rotateY(-12deg) scaleX(0.96); }
          70%      { transform: perspective(200px) rotateY(10deg)  scaleX(0.97); }
        }
        @keyframes wf-rope {
          0%,100% { transform: rotate(-2deg); }
          50%      { transform: rotate(2deg); }
        }
      `}</style>

      {/* z-45 — header z-40'ın üstünde */}
      <div
        className="fixed pointer-events-none"
        style={{ top: "52px", right: "10px", zIndex: 45 }}
        aria-hidden="true"
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          {/* Pole */}
          <div style={{
            width: "3px",
            height: "56px",
            background: "linear-gradient(180deg, #e5e7eb, #9ca3af 60%, #6b7280)",
            borderRadius: "2px",
            position: "absolute",
            right: 0,
            top: 0,
          }} />

          {/* Flag — attached to pole, waves */}
          <div
            style={{
              width: "56px",
              height: "37px",
              marginRight: "3px",
              transformOrigin: "right center",
              animation: "wf-wave 2.8s ease-in-out infinite",
              position: "relative",
              borderRadius: "1px 2px 2px 1px",
              boxShadow: "1px 2px 8px rgba(0,0,0,0.35)",
              overflow: "hidden",
              background: "#E30A17",
            }}
          >
            {/* ── Crescent: white disc + red disc offset to the right ── */}
            {/* White circle */}
            <div style={{
              position: "absolute",
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              background: "white",
              left: "8px",
              top: "50%",
              transform: "translateY(-50%)",
            }} />
            {/* Red overlay circle — creates crescent */}
            <div style={{
              position: "absolute",
              width: "15px",
              height: "15px",
              borderRadius: "50%",
              background: "#E30A17",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
            }} />

            {/* Star */}
            <div style={{
              position: "absolute",
              left: "27px",
              top: "50%",
              transform: "translateY(-50%) rotate(18deg)",
              color: "white",
              fontSize: "11px",
              lineHeight: 1,
              userSelect: "none",
              fontWeight: "bold",
            }}>
              ★
            </div>

            {/* Fabric sheen */}
            <div style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 40%, rgba(0,0,0,0.06) 100%)",
              pointerEvents: "none",
            }} />
          </div>
        </div>
      </div>
    </>
  );
}
