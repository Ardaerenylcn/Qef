"use client";

import { useState } from "react";
import Image from "next/image";
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
  const { gradient, textColor, accentColor, emoji, isFlagDay, hasLantern, heroImage } = day.banner;

  return (
    <div className="rounded-2xl overflow-hidden relative" style={{ background: gradient }}>

      {/* Flag day — prominent flag bar */}
      {isFlagDay && (
        <div
          className="flex items-center justify-center gap-3 py-3"
          style={{ borderBottom: `1px solid ${accentColor}30` }}
        >
          <span className="text-3xl leading-none select-none" role="img" aria-label="Türk Bayrağı">🇹🇷</span>
          <div style={{ flex: 1, height: "1px", background: `${accentColor}40`, maxWidth: "40px" }} />
          <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: textColor, opacity: 0.8 }}>
            {isEn ? day.nameEn : day.name}
          </span>
          <div style={{ flex: 1, height: "1px", background: `${accentColor}40`, maxWidth: "40px" }} />
          <span className="text-3xl leading-none select-none" role="img" aria-label="Türk Bayrağı">🇹🇷</span>
        </div>
      )}

      {/* Ramazan — moon + lantern label */}
      {hasLantern && !isFlagDay && (
        <div
          className="flex items-center justify-center gap-2 py-2.5"
          style={{ borderBottom: `1px solid ${accentColor}30` }}
        >
          <span className="text-base leading-none select-none">🌙</span>
          <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: textColor, opacity: 0.7 }}>
            {isEn ? day.nameEn : day.name}
          </span>
          <span className="text-base leading-none select-none">🌙</span>
        </div>
      )}

      {/* Standard top label (non-flag, non-lantern) */}
      {!isFlagDay && !hasLantern && (
        <div
          className="flex items-center justify-center py-2"
          style={{ borderBottom: `1px solid ${accentColor}20` }}
        >
          <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: textColor, opacity: 0.6 }}>
            {isEn ? day.nameEn : day.name}
          </span>
        </div>
      )}

      {/* Main content */}
      <div className="px-4 py-3.5 flex items-start gap-3">
        {/* Hero image (ör: Atatürk portresi) — varsa emoji yerine göster */}
        {heroImage ? (
          <Image
            src={heroImage}
            alt={day.name}
            width={52}
            height={52}
            className="rounded-full object-cover object-top shrink-0 border-2"
            style={{ borderColor: `${accentColor}60` }}
          />
        ) : (
          <span className="text-3xl leading-none shrink-0 mt-0.5 select-none" role="img" aria-label={day.name}>
            {emoji}
          </span>
        )}

        <p className="text-sm leading-relaxed font-medium flex-1 min-w-0" style={{ color: textColor }}>
          {text}
        </p>

        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 opacity-40 hover:opacity-80 transition-opacity mt-0.5"
          aria-label="Kapat"
          style={{ color: textColor }}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom accent line */}
      <div
        className="h-0.5 w-full"
        style={{ background: `linear-gradient(90deg, transparent, ${accentColor}60, transparent)` }}
      />
    </div>
  );
}
