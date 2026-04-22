"use client";

import { useEffect, useState } from "react";
import { Camera, Loader2, Check, ScanLine } from "lucide-react";

const PRODUCTS = [
  { category: "Çorbalar",     name: "Mercimek Çorbası",  price: "₺85"  },
  { category: "Ana Yemekler", name: "Izgara Tavuk",       price: "₺220" },
  { category: "Tatlılar",     name: "Sütlaç",             price: "₺95"  },
  { category: "İçecekler",    name: "Türk Çayı",          price: "₺35"  },
  { category: "İçecekler",    name: "Filtre Kahve",        price: "₺75"  },
];

const CATEGORY_COLORS: Record<string, string> = {
  "Çorbalar":      "bg-amber-500/20 text-amber-300 border-amber-500/30",
  "Ana Yemekler":  "bg-orange-500/20 text-orange-300 border-orange-500/30",
  "Tatlılar":      "bg-pink-500/20 text-pink-300 border-pink-500/30",
  "İçecekler":     "bg-blue-500/20 text-blue-300 border-blue-500/30",
};

type Phase = "idle" | "scanning" | "done";

export default function MenuScanMockup() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [doneCount, setDoneCount] = useState(0);
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    const runCycle = () => {
      setPhase("idle");
      setDoneCount(0);
      setScanProgress(0);

      setTimeout(() => {
        setPhase("scanning");
        const start = Date.now();
        const duration = 1800;
        const tick = setInterval(() => {
          const elapsed = Date.now() - start;
          setScanProgress(Math.min(elapsed / duration, 1));
          if (elapsed >= duration) {
            clearInterval(tick);
            setPhase("done");
            PRODUCTS.forEach((_, i) => {
              setTimeout(() => setDoneCount(i + 1), i * 450);
            });
          }
        }, 30);
      }, 1200);
    };

    runCycle();
    const loop = setInterval(runCycle, PRODUCTS.length * 450 + 1200 + 1800 + 3000);
    return () => clearInterval(loop);
  }, []);

  return (
    <div className="relative w-full lg:w-[52%] flex-shrink-0 flex items-center justify-center order-last lg:order-first">

      {/* Glow */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
        <div className="absolute w-72 h-72 bg-orange-500/20 rounded-full blur-[80px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute w-48 h-48 bg-amber-400/10 rounded-full blur-[60px] left-1/2 top-1/2 translate-x-4 translate-y-8" />
      </div>

      {/* Yüzen rozetler */}
      <div className="absolute -top-4 -left-2 lg:left-4 bg-white/10 backdrop-blur border border-white/20 rounded-2xl px-3 py-2 text-xs text-white font-semibold shadow-xl animate-bounce" style={{ animationDuration: "3.5s" }}>
        📷 Menüyü fotoğrafla
      </div>
      <div className="absolute -bottom-4 -right-2 lg:right-4 bg-orange-500/20 backdrop-blur border border-orange-400/30 rounded-2xl px-3 py-2 text-xs text-orange-300 font-semibold shadow-xl animate-bounce" style={{ animationDuration: "4.2s", animationDelay: "0.6s" }}>
        ⚡ 30 saniyede hazır
      </div>

      {/* Ana kart */}
      <div className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl shadow-black/40 border border-white/10 bg-gray-900/80 backdrop-blur">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-orange-500/20 to-amber-500/10 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Menü Tarayıcı</p>
              <p className="text-orange-300 text-[11px]">Fiziksel menüden dijitale</p>
            </div>
          </div>
          {phase === "scanning" && (
            <div className="flex items-center gap-1.5 text-[11px] text-orange-300">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Okunuyor...
            </div>
          )}
          {phase === "done" && (
            <div className="flex items-center gap-1.5 text-[11px] text-green-400">
              <Check className="w-3.5 h-3.5" />
              Tamamlandı!
            </div>
          )}
        </div>

        {/* Menü fotoğrafı alanı */}
        <div className="mx-4 mt-4 rounded-2xl overflow-hidden border border-white/10 bg-gray-800 relative h-28">
          {/* Menü simülasyonu — satır satır metin görünümü */}
          <div className="p-3 space-y-1.5 opacity-60">
            {["ÇORBALAR", "Mercimek Çorbası · · · · 85₺", "ANA YEMEKLER", "Izgara Tavuk · · · 220₺", "TATLILAR · Sütlaç · 95₺"].map((line, i) => (
              <div key={i} className={`h-2 rounded-full ${i % 3 === 0 ? "bg-orange-400/60 w-1/3" : "bg-white/20"}`}
                style={{ width: i % 3 === 0 ? "33%" : `${55 + (i * 13) % 30}%` }} />
            ))}
          </div>

          {/* Tarama animasyonu */}
          {phase === "scanning" && (
            <div className="absolute inset-0 bg-gray-900/40 flex flex-col items-center justify-center gap-2">
              <ScanLine className="w-8 h-8 text-orange-400 animate-pulse" />
              <div className="w-3/4 h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-400 to-amber-400 rounded-full transition-all"
                  style={{ width: `${scanProgress * 100}%` }}
                />
              </div>
              <p className="text-orange-300 text-[10px] font-semibold">AI okuyor…</p>
            </div>
          )}

          {phase === "idle" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-1.5 border border-white/20">
                <Camera className="w-3.5 h-3.5 text-orange-300" />
                <span className="text-[11px] text-white/70 font-medium">Menü fotoğrafı</span>
              </div>
            </div>
          )}
        </div>

        {/* Ürün listesi */}
        <div className="px-4 py-3 space-y-2 min-h-[180px]">
          {PRODUCTS.slice(0, doneCount).map((p, i) => (
            <div key={i} className="flex items-center gap-3 bg-white/[0.05] border border-white/10 rounded-2xl px-3 py-2.5 animate-fadeIn">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${CATEGORY_COLORS[p.category] ?? "bg-white/10 text-white/50 border-white/10"}`}>
                    {p.category}
                  </span>
                </div>
                <p className="text-white text-[12px] font-semibold truncate">{p.name}</p>
              </div>
              <div className="text-right shrink-0 flex items-center gap-2">
                <p className="text-orange-300 text-[11px] font-bold">{p.price}</p>
                <div className="w-4 h-4 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-green-400" />
                </div>
              </div>
            </div>
          ))}

          {phase === "scanning" && (
            <div className="flex items-center gap-3 bg-white/[0.03] border border-orange-500/20 rounded-2xl px-3 py-2.5 animate-pulse">
              <div className="flex-1 space-y-1.5">
                <div className="h-2 bg-white/10 rounded-full w-1/4" />
                <div className="h-2 bg-white/10 rounded-full w-2/3" />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {phase === "done" && (
          <div className="mx-4 mb-4 bg-gradient-to-r from-orange-500/20 to-amber-500/10 border border-orange-500/30 rounded-2xl px-4 py-3 flex items-center justify-between animate-fadeIn">
            <p className="text-white text-[12px] font-semibold">{PRODUCTS.length} ürün menüye eklendi</p>
            <div className="flex items-center gap-1 text-green-400 text-[11px] font-bold">
              <Check className="w-3.5 h-3.5" />
              Hazır
            </div>
          </div>
        )}
        {phase !== "done" && <div className="h-4" />}
      </div>
    </div>
  );
}
