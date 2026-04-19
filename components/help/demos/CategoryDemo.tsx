"use client";

import { useEffect, useState } from "react";
import { GripVertical } from "lucide-react";

const BASE = ["☕ Kahveler", "🍰 Tatlılar", "🥤 Soğuk İçecekler", "🍪 Atıştırmalıklar"];

export default function CategoryDemo() {
  const [items, setItems] = useState(BASE);
  const [liftedIdx, setLiftedIdx] = useState<number | null>(null);
  const [moving, setMoving] = useState(false);
  const [cursorY, setCursorY] = useState(0);

  useEffect(() => {
    let ts: ReturnType<typeof setTimeout>[] = [];

    const run = () => {
      setItems(BASE);
      setLiftedIdx(null);
      setMoving(false);

      ts.push(setTimeout(() => { setLiftedIdx(1); }, 500));
      ts.push(setTimeout(() => { setMoving(true); }, 900));
      ts.push(setTimeout(() => {
        setItems(["🍰 Tatlılar", "☕ Kahveler", "🥤 Soğuk İçecekler", "🍪 Atıştırmalıklar"]);
        setLiftedIdx(null);
        setMoving(false);
      }, 1600));
    };

    run();
    const id = setInterval(run, 3800);
    return () => { clearInterval(id); ts.forEach(clearTimeout); };
  }, []);

  // Cursor up-down float animation
  useEffect(() => {
    let frame: number;
    let start: number | null = null;
    const animate = (ts: number) => {
      if (!start) start = ts;
      const t = (ts - start) / 1000;
      setCursorY(Math.sin(t * 2.2) * 7);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
      <div className="relative space-y-2">
        {items.map((cat, i) => {
          const isLifted = liftedIdx !== null && items[liftedIdx] === cat && moving;
          return (
            <div
              key={cat}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 select-none transition-all duration-300"
              style={{
                background: isLifted ? "linear-gradient(135deg,#fff7ed,#fed7aa)" : "#fff7ed",
                transform: isLifted ? "translateY(-50px) rotate(-1deg) scale(1.03)" : "none",
                boxShadow: isLifted ? "0 12px 28px rgba(249,115,22,0.25)" : "none",
                zIndex: isLifted ? 10 : 1,
                position: "relative",
              }}
            >
              <GripVertical className="w-4 h-4 text-orange-300 flex-shrink-0" />
              <span className="text-sm font-medium text-orange-800">{cat}</span>
            </div>
          );
        })}

        {/* Animated drag cursor */}
        <div
          className="absolute right-2 pointer-events-none"
          style={{
            top: "50%",
            transform: `translateY(calc(-50% + ${cursorY}px))`,
          }}
        >
          <div className="flex flex-col items-center gap-0.5">
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M5 0L9 7H1L5 0Z" fill="#f97316" opacity="0.7" />
            </svg>
            <div className="w-px h-3 bg-orange-300" />
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M5 8L1 1H9L5 8Z" fill="#f97316" opacity="0.7" />
            </svg>
          </div>
        </div>
      </div>
      <p className="text-[10px] text-gray-400 text-center mt-3">Sürükleyerek sıralayın</p>
    </div>
  );
}
