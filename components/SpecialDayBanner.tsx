"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { SpecialDay } from "@/lib/specialDays";

interface Props {
  day: SpecialDay;
  isEn: boolean;
}

export default function SpecialDayBanner({ day, isEn }: Props) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const text = isEn ? day.banner.textEn : day.banner.text;
  const { gradient, textColor, accentColor, deco, emoji } = day.banner;

  return (
    <div
      className="rounded-2xl overflow-hidden relative"
      style={{ background: gradient }}
    >
      {/* Dekoratif emoji satırı */}
      <div
        className="flex items-center justify-center gap-1.5 px-3 py-2 text-base overflow-hidden"
        style={{ borderBottom: `1px solid ${accentColor}33` }}
        aria-hidden="true"
      >
        {deco.map((e, i) => (
          <span key={i} className="shrink-0 leading-none select-none">{e}</span>
        ))}
      </div>

      {/* Ana içerik */}
      <div className="px-4 py-3.5 flex items-start gap-3 relative">
        <span
          className="text-3xl leading-none shrink-0 mt-0.5 select-none"
          role="img"
          aria-label={day.name}
        >
          {emoji}
        </span>

        <div className="flex-1 min-w-0 space-y-0.5">
          <p
            className="text-[11px] font-bold uppercase tracking-widest opacity-70"
            style={{ color: textColor }}
          >
            {isEn ? day.nameEn : day.name}
          </p>
          <p
            className="text-sm leading-relaxed font-medium"
            style={{ color: textColor }}
          >
            {text}
          </p>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 opacity-40 hover:opacity-80 transition-opacity mt-0.5"
          aria-label="Kapat"
          style={{ color: textColor }}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Alt dekoratif çizgi */}
      <div
        className="h-0.5 w-full opacity-30"
        style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
      />
    </div>
  );
}
