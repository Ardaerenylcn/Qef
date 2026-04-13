"use client";

export default function RamazanDecor() {
  return (
    <>
      <style>{`
        @keyframes rd-sway {
          0%, 100% { transform: rotate(-6deg); }
          50%       { transform: rotate(6deg); }
        }
        @keyframes rd-glow {
          0%, 100% { opacity: 0.7; box-shadow: 0 0 12px 4px #d9770680, 0 0 24px 8px #d9770630; }
          50%       { opacity: 1;   box-shadow: 0 0 20px 8px #d97706cc, 0 0 40px 16px #d9770650; }
        }
        @keyframes rd-flicker {
          0%, 100% { opacity: 0.8; transform: scaleX(1) scaleY(1); }
          25%       { opacity: 1;   transform: scaleX(0.9) scaleY(1.1); }
          75%       { opacity: 0.9; transform: scaleX(1.05) scaleY(0.95); }
        }
      `}</style>

      <div
        className="fixed pointer-events-none"
        style={{ bottom: "90px", right: "16px", zIndex: 20 }}
        aria-hidden="true"
      >
        {/* Hanging string */}
        <div style={{
          width: "1px",
          height: "24px",
          background: "#d9770680",
          margin: "0 auto",
        }} />

        {/* Lantern body */}
        <div
          style={{
            width: "32px",
            height: "48px",
            background: "linear-gradient(180deg, #92400e 0%, #b45309 30%, #d97706 60%, #b45309 85%, #78350f 100%)",
            borderRadius: "4px 4px 8px 8px",
            position: "relative",
            transformOrigin: "top center",
            animation: "rd-sway 3s ease-in-out infinite, rd-glow 2s ease-in-out infinite",
            margin: "0 auto",
          }}
        >
          {/* Top cap */}
          <div style={{
            position: "absolute",
            top: "-6px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "28px",
            height: "8px",
            background: "linear-gradient(180deg, #6b4d23, #92400e)",
            borderRadius: "3px 3px 0 0",
          }} />

          {/* Vertical ribs */}
          {[8, 16, 24].map((x, i) => (
            <div key={i} style={{
              position: "absolute",
              top: 0, bottom: 0,
              left: `${x}px`,
              width: "1px",
              background: "rgba(0,0,0,0.25)",
            }} />
          ))}

          {/* Inner glow / candle flame */}
          <div style={{
            position: "absolute",
            left: "50%",
            bottom: "10px",
            transform: "translateX(-50%)",
            width: "8px",
            height: "12px",
            background: "linear-gradient(180deg, #fef3c7, #fbbf24, #f97316)",
            borderRadius: "50% 50% 30% 30%",
            animation: "rd-flicker 0.8s ease-in-out infinite",
            filter: "blur(1px)",
          }} />

          {/* Bottom cap */}
          <div style={{
            position: "absolute",
            bottom: "-6px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "24px",
            height: "8px",
            background: "linear-gradient(180deg, #92400e, #78350f)",
            borderRadius: "0 0 4px 4px",
          }} />
        </div>

        {/* Crescent below */}
        <div style={{
          textAlign: "center",
          fontSize: "14px",
          marginTop: "6px",
          color: "#fde68a",
          opacity: 0.8,
          lineHeight: 1,
        }}>
          ☪
        </div>
      </div>
    </>
  );
}
