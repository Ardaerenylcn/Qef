"use client";

import { useEffect, useRef } from "react";

export default function DemoPhoneMockup() {
  const screenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = screenRef.current;
    if (!el) return;
    const stop = (e: TouchEvent) => e.stopPropagation();
    el.addEventListener("touchstart", stop, { passive: false });
    el.addEventListener("touchmove",  stop, { passive: false });
    return () => {
      el.removeEventListener("touchstart", stop);
      el.removeEventListener("touchmove",  stop);
    };
  }, []);

  return (
    <div className="flex-shrink-0 flex justify-center">
      <div className="relative">
        <div className="absolute inset-0 bg-orange-200 rounded-full blur-3xl opacity-30 scale-110" />
        <div className="relative w-[270px] bg-gray-900 rounded-[44px] p-3 shadow-2xl ring-1 ring-white/10">
          <div className="w-20 h-1.5 bg-gray-700 rounded-full mx-auto mb-2" />
          <div ref={screenRef} className="rounded-[32px] overflow-hidden bg-white" style={{ height: 560, touchAction: "pan-y", overscrollBehavior: "none" }}>
            <iframe
              src="/menu/demo"
              className="w-full h-full border-0"
              title="Demo Menü"
            />
          </div>
          <div className="w-24 h-1.5 bg-gray-700 rounded-full mx-auto mt-2" />
        </div>
      </div>
    </div>
  );
}
