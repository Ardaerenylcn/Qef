"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";

export default function QRDemo() {
  const [pos, setPos] = useState(0);
  const [done, setDone] = useState(false);
  const rafRef = useRef<number>(0);
  const stateRef = useRef({ p: 0, dir: 1, passes: 0, locked: false });

  useEffect(() => {
    const loop = () => {
      const s = stateRef.current;
      if (s.locked) { rafRef.current = requestAnimationFrame(loop); return; }
      s.p += s.dir * 1.0;
      if (s.p >= 100) { s.dir = -1; s.passes++; }
      if (s.p <= 0 && s.dir === -1) { s.dir = 1; }
      if (s.passes >= 2) {
        s.locked = true;
        setDone(true);
        setTimeout(() => {
          setDone(false);
          s.p = 0; s.dir = 1; s.passes = 0; s.locked = false;
        }, 2000);
      }
      setPos(s.p);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-center gap-8">
      {/* QR Card */}
      <div className="flex flex-col items-center gap-2">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-3">
          <div className="relative w-28 h-28 overflow-hidden">
            <svg viewBox="0 0 100 100" className="w-full h-full" shapeRendering="crispEdges">
              <rect x="4" y="4" width="28" height="28" fill="none" stroke="#111" strokeWidth="3.5"/>
              <rect x="11" y="11" width="14" height="14" fill="#111"/>
              <rect x="68" y="4" width="28" height="28" fill="none" stroke="#111" strokeWidth="3.5"/>
              <rect x="75" y="11" width="14" height="14" fill="#111"/>
              <rect x="4" y="68" width="28" height="28" fill="none" stroke="#111" strokeWidth="3.5"/>
              <rect x="11" y="75" width="14" height="14" fill="#111"/>
              {[[40,4],[47,4],[54,4],[40,11],[54,11],[47,18],[40,25],[47,25],[40,40],[47,47],
                [54,40],[61,47],[68,40],[54,54],[68,54],[40,61],[54,68],[61,68],[68,68],[75,61],
                [82,68],[82,75],[40,75],[40,82],[47,82],[61,82],[68,82],[75,75],[4,40],[11,47],
                [18,40],[25,47],[32,40],[32,47],[25,54],[4,54]
              ].map(([x,y],i) => <rect key={i} x={x} y={y} width="6" height="6" fill="#111"/>)}
            </svg>
            {!done && (
              <div
                className="absolute left-0 right-0 h-px pointer-events-none"
                style={{
                  top: `${pos}%`,
                  background: "linear-gradient(to right, transparent, #f97316 30%, #f97316 70%, transparent)",
                  boxShadow: "0 0 6px #f97316, 0 0 12px #f9731640",
                }}
              />
            )}
            {done && (
              <div className="absolute inset-0 bg-green-50/95 flex items-center justify-center rounded-xl">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
            )}
          </div>
          <p className="text-[8.5px] text-gray-400 text-center mt-1.5 font-mono">qefmenu.com/menu/kafem</p>
        </div>
        <p className="text-xs text-gray-400">{done ? "✓ Menü açıldı!" : "Taranıyor..."}</p>
      </div>

      {/* Arrow */}
      <div className="flex flex-col items-center gap-1">
        <div className="w-10 h-0.5 bg-gray-200 rounded" />
        <span className="text-gray-300 text-xs">→</span>
      </div>

      {/* Mini phone */}
      <div
        className="transition-all duration-700"
        style={{ opacity: done ? 1 : 0.18, transform: done ? "scale(1) translateY(0)" : "scale(0.9) translateY(8px)" }}
      >
        <div className="w-[68px] h-[120px] bg-gray-900 rounded-[18px] p-[3px] shadow-xl">
          <div className="w-full h-full bg-white rounded-[15px] overflow-hidden flex flex-col">
            <div className="flex justify-center pt-1 pb-0.5 bg-white flex-shrink-0">
              <div className="w-8 h-2 bg-black rounded-full" />
            </div>
            <div className="bg-orange-500 px-1.5 py-0.5 flex-shrink-0">
              <p className="text-[5px] font-bold text-white">☕ Kafem Menüsü</p>
            </div>
            <div className="flex-1 p-1 space-y-0.5 overflow-hidden">
              {["Türk Kahvesi", "Latte", "Espresso", "Sütlaç", "Künefe"].map((item) => (
                <div key={item} className="flex justify-between items-center">
                  <span className="text-[5px] text-gray-700">{item}</span>
                  <span className="text-[5px] font-bold text-orange-500">₺</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
