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

  return (
    <div
      className="rounded-2xl px-4 py-3.5 flex items-start gap-3 relative"
      style={{ backgroundColor: day.banner.bg, color: day.banner.textColor }}
    >
      <span className="text-2xl leading-none shrink-0 mt-0.5" role="img" aria-label={day.name}>
        {day.banner.emoji}
      </span>
      <p className="text-sm leading-relaxed flex-1 font-medium">{text}</p>
      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 opacity-50 hover:opacity-100 transition-opacity mt-0.5"
        aria-label="Kapat"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
