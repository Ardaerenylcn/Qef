"use client";

import { useEffect, useRef, useState } from "react";

export default function DemoPhoneMockup() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { rootMargin: "200px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative flex-shrink-0 flex justify-center" ref={ref}>

      {/* Glow */}
      <div className="absolute w-80 h-80 bg-orange-400/25 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute w-52 h-52 bg-yellow-300/15 rounded-full blur-[60px] translate-x-10 translate-y-10 pointer-events-none" />

      {/* Yüzen rozet — QR */}
      <div className="absolute -top-3 -left-6 bg-white rounded-2xl shadow-xl shadow-gray-200/80 px-3 py-2 flex items-center gap-2 z-20 animate-[float_3s_ease-in-out_infinite]">
        <div className="w-7 h-7 rounded-xl bg-orange-50 flex items-center justify-center">
          <span className="text-sm">📱</span>
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-800 leading-none">Gerçek Önizleme</p>
          <p className="text-[9px] text-gray-400 mt-0.5">Canlı demo menü</p>
        </div>
      </div>

      {/* Yüzen rozet — ziyaretçi */}
      <div className="absolute -bottom-2 -right-8 bg-white rounded-2xl shadow-xl shadow-gray-200/80 px-3 py-2 flex items-center gap-2 z-20 animate-[float_3s_ease-in-out_infinite_1.5s]">
        <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
          <span className="text-sm">👁</span>
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-800 leading-none">Müşteri görünümü</p>
          <p className="text-[9px] text-gray-400 mt-0.5">Tıklanabilir & Gerçek</p>
        </div>
      </div>

      {/* Telefon çerçevesi */}
      <div className="relative z-10"
        style={{
          width: 270,
          background: "#1a1a1a",
          borderRadius: 44,
          padding: 10,
          boxShadow: "0 0 0 1px #333, 0 32px 64px rgba(0,0,0,0.45), inset 0 0 0 1px #444",
        }}
      >
        {/* Yan butonlar */}
        <div className="absolute left-[-4px] top-[90px] w-[4px] h-7 bg-[#2a2a2a] rounded-l-sm" />
        <div className="absolute left-[-4px] top-[130px] w-[4px] h-10 bg-[#2a2a2a] rounded-l-sm" />
        <div className="absolute left-[-4px] top-[180px] w-[4px] h-10 bg-[#2a2a2a] rounded-l-sm" />
        <div className="absolute right-[-4px] top-[120px] w-[4px] h-14 bg-[#2a2a2a] rounded-r-sm" />

        {/* Dynamic Island */}
        <div className="flex justify-center pb-1">
          <div className="w-20 h-5 bg-black rounded-full" />
        </div>

        <div
          className="overflow-hidden bg-white"
          style={{ borderRadius: 34, height: 560 }}
        >
          {visible && (
            <iframe
              src="/menu/demo"
              className="w-full h-full border-0"
              title="Demo Menü"
              style={{ touchAction: "pan-y" }}
              loading="lazy"
            />
          )}
        </div>

        {/* Home bar */}
        <div className="flex justify-center pt-2">
          <div className="w-24 h-1 bg-gray-700 rounded-full" />
        </div>
      </div>
    </div>
  );
}
