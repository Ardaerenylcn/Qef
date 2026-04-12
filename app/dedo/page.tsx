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

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-10 px-6">
      <p className="text-gray-400 text-sm tracking-widest uppercase">12 Temmuz 2026 · 10:45</p>
      <div className="flex gap-6 sm:gap-10">
        {[
          { label: "Gün", value: time.days },
          { label: "Saat", value: time.hours },
          { label: "Dakika", value: time.minutes },
          { label: "Saniye", value: time.seconds },
        ].map(({ label, value }) => (
          <div key={label} className="flex flex-col items-center gap-2">
            <span className="text-6xl sm:text-8xl font-extrabold tabular-nums text-white">
              {String(value).padStart(2, "0")}
            </span>
            <span className="text-xs text-gray-500 tracking-widest uppercase">{label}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
