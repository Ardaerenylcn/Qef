"use client";

import { useEffect, useState } from "react";

const TARGET = new Date("2026-07-12T10:45:00");

function getTimeLeft() {
  const diff = TARGET.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

export default function DedoPage() {
  const [time, setTime] = useState(getTimeLeft());
  const [swing, setSwing] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setTime(getTimeLeft());
      setSwing((s) => !s);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center overflow-hidden relative"
      style={{
        background: "radial-gradient(ellipse at top, #1a0a00 0%, #0a0a0a 60%, #000 100%)",
      }}
    >
      {/* Tavan çizgisi */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-900/40 to-transparent" />

      {/* Halat */}
      <div className="flex flex-col items-center mb-8">
        <div
          className="w-px bg-gradient-to-b from-amber-800/80 to-amber-900/60 transition-all duration-700"
          style={{
            height: "80px",
            transform: swing ? "rotate(1.5deg)" : "rotate(-1.5deg)",
            transformOrigin: "top center",
          }}
        />
        {/* İlmek */}
        <div
          className="transition-all duration-700"
          style={{
            transform: swing ? "rotate(1.5deg)" : "rotate(-1.5deg)",
            transformOrigin: "top center",
          }}
        >
          <svg width="48" height="52" viewBox="0 0 48 52" fill="none">
            <ellipse cx="24" cy="20" rx="14" ry="18" stroke="#92400e" strokeWidth="2.5" fill="none" opacity="0.8"/>
            <line x1="24" y1="38" x2="24" y2="52" stroke="#92400e" strokeWidth="2.5" opacity="0.8"/>
            <line x1="10" y1="20" x2="24" y2="2" stroke="#92400e" strokeWidth="2.5" opacity="0.8"/>
            <line x1="38" y1="20" x2="24" y2="2" stroke="#92400e" strokeWidth="2.5" opacity="0.8"/>
            <line x1="24" y1="2" x2="24" y2="0" stroke="#92400e" strokeWidth="2.5" opacity="0.8"/>
          </svg>
        </div>
      </div>

      {/* Sayaç */}
      <div className="flex gap-5 sm:gap-10 mb-10">
        {[
          { label: "GÜN", value: time.days },
          { label: "SAAT", value: time.hours },
          { label: "DAKİKA", value: time.minutes },
          { label: "SANİYE", value: time.seconds },
        ].map(({ label, value }, i) => (
          <div key={label} className="flex flex-col items-center gap-3">
            {i > 0 && (
              <span
                className="absolute text-amber-900/50 text-5xl font-thin select-none"
                style={{ marginLeft: "-2.8rem", marginTop: "0.1rem" }}
              >
                :
              </span>
            )}
            <div
              className="relative flex items-center justify-center"
              style={{
                width: "80px",
                height: "88px",
                background: "linear-gradient(160deg, #1a0e00 0%, #0d0800 100%)",
                border: "1px solid #3d1f00",
                borderRadius: "6px",
                boxShadow: "0 0 30px rgba(120,50,0,0.15), inset 0 1px 0 rgba(255,150,50,0.05)",
              }}
            >
              <span
                className="text-5xl sm:text-6xl font-black tabular-nums"
                style={{
                  color: "#d97706",
                  textShadow: "0 0 20px rgba(217,119,6,0.4), 0 0 60px rgba(217,119,6,0.1)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {String(value).padStart(2, "0")}
              </span>
              {/* Alt çizgi / ahşap doku efekti */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-amber-900/30" />
            </div>
            <span
              className="text-xs tracking-[0.3em]"
              style={{ color: "#5c3317" }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Tarih */}
      <p
        className="text-xs tracking-[0.4em] uppercase"
        style={{ color: "#4a2010" }}
      >
        12 · 07 · 2026 &nbsp;·&nbsp; 10:45
      </p>

      {/* Zemin gölgesi */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)",
        }}
      />

      {/* Ahşap zemin çizgisi */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, #3d1f00 30%, #3d1f00 70%, transparent)" }}
      />
    </main>
  );
}
