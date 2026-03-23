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
    <div className="flex-shrink-0 flex justify-center" ref={ref}>
      <div className="relative overflow-hidden rounded-[44px]">
        <div className="absolute inset-0 bg-orange-200 rounded-full blur-3xl opacity-30 scale-110" />
        <div className="relative w-[270px] bg-gray-900 rounded-[44px] p-3 shadow-2xl ring-1 ring-white/10">
          <div className="w-20 h-1.5 bg-gray-700 rounded-full mx-auto mb-2" />
          <div
            className="rounded-[32px] overflow-hidden bg-white"
            style={{ height: 560 }}
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
          <div className="w-24 h-1.5 bg-gray-700 rounded-full mx-auto mt-2" />
        </div>
      </div>
    </div>
  );
}
