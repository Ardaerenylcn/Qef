"use client";

import { useState, useEffect } from "react";
import type { OpeningHour } from "@/types/menu";

interface Props {
  hours: OpeningHour[];
  isEn?: boolean;
}

export default function OpenStatusBadge({ hours, isEn = false }: Props) {
  const [isOpen, setIsOpen] = useState<boolean | null>(null);

  useEffect(() => {
    function compute() {
      const now = new Date();
      const jsDay = now.getDay(); // 0=Sun, 1=Mon, ...
      const ourDay = (jsDay + 6) % 7; // 0=Mon, ..., 6=Sun

      const todayHours = hours.find((h) => h.day === ourDay);
      if (!todayHours || todayHours.closed) {
        setIsOpen(false);
        return;
      }

      const pad = (n: number) => String(n).padStart(2, "0");
      const currentTime = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
      setIsOpen(currentTime >= todayHours.open && currentTime <= todayHours.close);
    }

    compute();
    // Recompute every minute
    const interval = setInterval(compute, 60_000);
    return () => clearInterval(interval);
  }, [hours]);

  if (isOpen === null) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
        isOpen
          ? "bg-green-50 text-green-600"
          : "bg-red-50 text-red-500"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${isOpen ? "bg-green-500" : "bg-red-400"}`}
      />
      {isOpen
        ? (isEn ? "Open" : "Açık")
        : (isEn ? "Closed" : "Kapalı")}
    </span>
  );
}
