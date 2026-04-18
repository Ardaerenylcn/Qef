"use client";

import { useEffect, useState } from "react";

const THEMES = [
  { name: "Turuncu", hex: "#f97316", bg: "#fff7ed" },
  { name: "Mor",     hex: "#8b5cf6", bg: "#f5f3ff" },
  { name: "Mavi",    hex: "#3b82f6", bg: "#eff6ff" },
  { name: "Yeşil",   hex: "#22c55e", bg: "#f0fdf4" },
  { name: "Pembe",   hex: "#ec4899", bg: "#fdf2f8" },
];

const LAYOUTS = ["Liste", "Kart"];

export default function AppearanceDemo() {
  const [ci, setCi] = useState(0);
  const [li, setLi] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCi((prev) => {
        const next = (prev + 1) % THEMES.length;
        if (next === 0) setLi((l) => (l + 1) % LAYOUTS.length);
        return next;
      });
    }, 950);
    return () => clearInterval(id);
  }, []);

  const t = THEMES[ci];

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <div className="flex items-start gap-5">
        {/* Color swatches */}
        <div className="space-y-2 pt-1">
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-3">Renk</p>
          {THEMES.map((th, i) => (
            <div key={th.hex} className="flex items-center gap-2">
              <div
                className="rounded-full flex-shrink-0 transition-all duration-400"
                style={{
                  width: i === ci ? 22 : 14,
                  height: i === ci ? 22 : 14,
                  backgroundColor: th.hex,
                  boxShadow: i === ci ? `0 0 0 2.5px white, 0 0 0 4px ${th.hex}` : "none",
                  transition: "all 0.35s ease",
                }}
              />
              <span
                className="text-[9px] font-semibold transition-all duration-300"
                style={{ color: i === ci ? th.hex : "transparent", fontSize: i === ci ? 9 : 0 }}
              >
                {th.name}
              </span>
            </div>
          ))}
        </div>

        {/* Preview */}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-3">Önizleme</p>
          <div
            className="rounded-2xl overflow-hidden border-2 transition-all duration-500"
            style={{ borderColor: t.hex + "40", backgroundColor: t.bg }}
          >
            <div className="h-16 bg-gradient-to-b from-gray-200 to-gray-100" />
            <div className="p-3 space-y-1.5">
              <p className="text-sm font-bold text-gray-800">Türk Kahvesi</p>
              <p className="text-xs text-gray-400">Geleneksel hazırlama</p>
              <div className="flex items-center justify-between pt-1 border-t border-gray-200/60">
                <span
                  className="text-sm font-bold transition-colors duration-500"
                  style={{ color: t.hex }}
                >
                  45.00 ₺
                </span>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white transition-all duration-500"
                  style={{ backgroundColor: t.hex }}
                >
                  {LAYOUTS[li]}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
