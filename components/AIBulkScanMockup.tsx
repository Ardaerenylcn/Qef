"use client";

import { useEffect, useState } from "react";
import { Sparkles, Check, Loader2 } from "lucide-react";

const PHOTOS = [
  { img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=80&q=75", name: "Margarita Pizza",   desc: "İnce hamur, domates sos, mozzarella.", price: "₺180" },
  { img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=80&q=75", name: "Akdeniz Salatası", desc: "Taze sebzeler, zeytin, beyaz peynir.",  price: "₺120" },
  { img: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=80&q=75", name: "Cheesecake",       desc: "Kremamsı dolgu, çilek sosu.",           price: "₺95"  },
  { img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=80&q=75", name: "Filtre Kahve",     desc: "Tek köken, soğuk demleme.",            price: "₺65"  },
];

type Phase = "idle" | "scanning" | "done";

export default function AIBulkScanMockup() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [doneCount, setDoneCount] = useState(0);

  useEffect(() => {
    const startScan = () => {
      setPhase("scanning");
      setDoneCount(0);
      PHOTOS.forEach((_, i) => {
        setTimeout(() => {
          setDoneCount(i + 1);
          if (i === PHOTOS.length - 1) {
            setTimeout(() => setPhase("done"), 400);
          }
        }, 700 + i * 600);
      });
    };

    startScan();
    const loop = setInterval(() => {
      setPhase("idle");
      setDoneCount(0);
      setTimeout(startScan, 800);
    }, (PHOTOS.length * 600 + 700 + 3000));

    return () => clearInterval(loop);
  }, []);

  return (
    <div className="relative w-full lg:w-[52%] flex-shrink-0 flex items-center justify-center order-last lg:order-first">

      {/* Glow */}
      <div className="absolute w-72 h-72 bg-purple-500/20 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute w-48 h-48 bg-pink-400/10 rounded-full blur-[60px] -translate-x-16 translate-y-8 pointer-events-none" />

      {/* Yüzen rozetler */}
      <div className="absolute -top-4 -left-2 lg:left-4 bg-white/10 backdrop-blur border border-white/20 rounded-2xl px-3 py-2 text-xs text-white font-semibold shadow-xl animate-bounce" style={{ animationDuration: "3.5s" }}>
        ✨ AI ile analiz
      </div>
      <div className="absolute -bottom-4 -right-2 lg:right-4 bg-purple-500/20 backdrop-blur border border-purple-400/30 rounded-2xl px-3 py-2 text-xs text-purple-300 font-semibold shadow-xl animate-bounce" style={{ animationDuration: "4.5s", animationDelay: "0.8s" }}>
        📸 15 ürüne kadar
      </div>

      {/* Ana kart */}
      <div className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl shadow-black/40 border border-white/10 bg-gray-900/80 backdrop-blur">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-purple-500/20 to-pink-500/10 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">AI Ürün Tarayıcı</p>
              <p className="text-purple-300 text-[11px]">Fotoğraftan menüye</p>
            </div>
          </div>
          {phase === "scanning" && (
            <div className="flex items-center gap-1.5 text-[11px] text-purple-300 animate-fadeIn">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Analiz ediliyor...
            </div>
          )}
          {phase === "done" && (
            <div className="flex items-center gap-1.5 text-[11px] text-green-400 animate-fadeIn">
              <Check className="w-3.5 h-3.5" />
              Tamamlandı!
            </div>
          )}
        </div>

        {/* Upload zone */}
        <div className="mx-4 mt-4 border-2 border-dashed border-white/10 rounded-2xl p-3 flex items-center gap-3 bg-white/[0.03]">
          <div className="flex gap-1.5">
            {PHOTOS.map((p, i) => (
              <div key={i} className="w-10 h-10 rounded-xl border border-white/10 relative overflow-hidden bg-gray-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                {phase !== "idle" && doneCount > i && (
                  <div className="absolute inset-0 bg-green-500/30 flex items-center justify-center animate-fadeIn">
                    <Check className="w-4 h-4 text-green-300" />
                  </div>
                )}
                {phase === "scanning" && doneCount === i && (
                  <div className="absolute inset-0 bg-purple-500/40 flex items-center justify-center animate-pulse">
                    <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div>
            <p className="text-white text-[12px] font-semibold">{PHOTOS.length} fotoğraf seçildi</p>
            <p className="text-slate-500 text-[10px]">Tarama başlatıldı</p>
          </div>
        </div>

        {/* Ürün kartları */}
        <div className="px-4 py-3 space-y-2 min-h-[220px]">
          {PHOTOS.slice(0, doneCount).map((p, i) => (
            <div key={i} className="flex items-center gap-3 bg-white/[0.05] border border-white/10 rounded-2xl px-3 py-2.5 animate-fadeIn">
              <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 bg-gray-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-[12px] font-semibold truncate">{p.name}</p>
                <p className="text-slate-500 text-[10px] truncate">{p.desc}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-purple-300 text-[11px] font-bold">{p.price}</p>
                <div className="w-4 h-4 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center ml-auto mt-0.5">
                  <Check className="w-2.5 h-2.5 text-green-400" />
                </div>
              </div>
            </div>
          ))}

          {phase === "scanning" && doneCount < PHOTOS.length && (
            <div className="flex items-center gap-3 bg-white/[0.03] border border-purple-500/20 rounded-2xl px-3 py-2.5 animate-pulse">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0">
                <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
              </div>
              <div className="flex-1 space-y-1.5">
                <div className="h-2 bg-white/10 rounded-full w-2/3" />
                <div className="h-1.5 bg-white/5 rounded-full w-1/2" />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {phase === "done" && (
          <div className="mx-4 mb-4 bg-gradient-to-r from-purple-500/20 to-pink-500/10 border border-purple-500/30 rounded-2xl px-4 py-3 flex items-center justify-between animate-fadeIn">
            <p className="text-white text-[12px] font-semibold">{PHOTOS.length} ürün menüye eklendi</p>
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
