"use client";

export default function WavingFlag() {
  return (
    <>
      <style>{`
        @keyframes wf-wave {
          0%   { transform: perspective(300px) rotateY(0deg) skewY(0deg); }
          25%  { transform: perspective(300px) rotateY(-8deg) skewY(-1deg); }
          50%  { transform: perspective(300px) rotateY(0deg) skewY(0deg); }
          75%  { transform: perspective(300px) rotateY(8deg) skewY(1deg); }
          100% { transform: perspective(300px) rotateY(0deg) skewY(0deg); }
        }
        @keyframes wf-pole {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-2px); }
        }
      `}</style>

      <div
        className="fixed pointer-events-none"
        style={{ top: "72px", right: "12px", zIndex: 20 }}
        aria-hidden="true"
      >
        {/* Pole */}
        <div style={{
          width: "4px",
          height: "70px",
          background: "linear-gradient(180deg, #d1d5db, #9ca3af)",
          borderRadius: "2px",
          position: "absolute",
          right: 0,
          top: 0,
          animation: "wf-pole 3s ease-in-out infinite",
        }} />

        {/* Flag */}
        <div
          style={{
            width: "60px",
            height: "40px",
            background: "#E30A17",
            marginRight: "4px",
            transformOrigin: "right center",
            animation: "wf-wave 2.4s ease-in-out infinite",
            position: "relative",
            borderRadius: "1px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            overflow: "hidden",
          }}
        >
          {/* Crescent */}
          <div style={{
            position: "absolute",
            left: "6px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "22px",
            height: "22px",
            borderRadius: "50%",
            border: "6px solid white",
            clipPath: "inset(0 0 0 5px)",
          }} />
          {/* Star */}
          <div style={{
            position: "absolute",
            left: "22px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "white",
            fontSize: "13px",
            lineHeight: 1,
            userSelect: "none",
          }}>
            ★
          </div>

          {/* Fabric sheen */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 50%, rgba(0,0,0,0.08) 100%)",
          }} />
        </div>
      </div>
    </>
  );
}
