"use client";

import { useEffect, useRef } from "react";

export default function DemoPhoneMockup() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    let startX = 0;
    let startY = 0;
    let startTime = 0;
    let lastY = 0;

    const getScrollEl = (): HTMLElement | null => {
      try {
        const doc = iframeRef.current?.contentDocument;
        if (!doc) return null;
        // demo/page.tsx'deki position:fixed, overflow-y:auto div
        return (doc.querySelector("[data-demo-scroll]") as HTMLElement)
          ?? (doc.querySelector("div[style*='overflow-y']") as HTMLElement)
          ?? null;
      } catch {
        return null;
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
      lastY = t.clientY;
      startTime = Date.now();
      e.preventDefault();
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const t = e.touches[0];
      const deltaY = lastY - t.clientY;
      lastY = t.clientY;
      const el = getScrollEl();
      if (el) el.scrollTop += deltaY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      const t = e.changedTouches[0];
      const dx = Math.abs(t.clientX - startX);
      const dy = Math.abs(t.clientY - startY);
      const dt = Date.now() - startTime;

      // Tap algıla (az hareket, kısa süre)
      if (dx < 8 && dy < 8 && dt < 300) {
        try {
          const iframe = iframeRef.current;
          if (!iframe) return;
          const rect = iframe.getBoundingClientRect();
          const scrollEl = getScrollEl();
          const scrollTop = scrollEl?.scrollTop ?? 0;
          const x = t.clientX - rect.left;
          const y = t.clientY - rect.top + scrollTop;
          const doc = iframe.contentDocument;
          const target = doc?.elementFromPoint(x, y - scrollTop) as HTMLElement;
          target?.click();
        } catch {}
      }
    };

    overlay.addEventListener("touchstart", onTouchStart, { passive: false });
    overlay.addEventListener("touchmove", onTouchMove, { passive: false });
    overlay.addEventListener("touchend", onTouchEnd, { passive: false });

    return () => {
      overlay.removeEventListener("touchstart", onTouchStart);
      overlay.removeEventListener("touchmove", onTouchMove);
      overlay.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return (
    <div className="flex-shrink-0 flex justify-center">
      <div className="relative overflow-hidden rounded-[44px]">
        <div className="absolute inset-0 bg-orange-200 rounded-full blur-3xl opacity-30 scale-110" />
        <div className="relative w-[270px] bg-gray-900 rounded-[44px] p-3 shadow-2xl ring-1 ring-white/10">
          <div className="w-20 h-1.5 bg-gray-700 rounded-full mx-auto mb-2" />
          <div className="rounded-[32px] overflow-hidden bg-white relative" style={{ height: 560 }}>
            <iframe
              ref={iframeRef}
              src="/menu/demo"
              className="w-full h-full border-0"
              title="Demo Menü"
            />
            {/* Overlay: tüm touch olaylarını ele geçirir, parent'a hiçbir gesture sızdırmaz */}
            <div
              ref={overlayRef}
              className="absolute inset-0 z-10"
              style={{ touchAction: "none" }}
            />
          </div>
          <div className="w-24 h-1.5 bg-gray-700 rounded-full mx-auto mt-2" />
        </div>
      </div>
    </div>
  );
}
