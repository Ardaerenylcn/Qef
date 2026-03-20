"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function DemoPhoneMockup() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div className="flex-shrink-0 flex justify-center">
      <div className="relative">
        <div className="absolute inset-0 bg-orange-200 rounded-full blur-3xl opacity-30 scale-110" />

        {isDesktop ? (
          /* Masaüstü: canlı iframe */
          <div className="relative w-[280px] bg-gray-900 rounded-[44px] p-3 shadow-2xl ring-1 ring-white/10">
            <div className="w-20 h-1.5 bg-gray-700 rounded-full mx-auto mb-2" />
            <div className="rounded-[32px] overflow-hidden bg-white" style={{ height: 560 }}>
              <iframe src="/menu/demo" className="w-full h-full border-0" title="Demo Menü" />
            </div>
            <div className="w-24 h-1.5 bg-gray-700 rounded-full mx-auto mt-2" />
          </div>
        ) : (
          /* Mobil: statik görsel */
          <div className="relative w-[220px] bg-gray-900 rounded-[40px] p-2.5 shadow-2xl ring-1 ring-white/10">
            <div className="w-16 h-1.5 bg-gray-700 rounded-full mx-auto mb-2" />
            <div className="rounded-[28px] overflow-hidden bg-white">
              <Image src="/demo/cafe-cover.png" alt="Demo Menü" width={220} height={140} className="w-full object-cover" />
              <div className="p-3 space-y-2">
                {[
                  { name: "Türk Kahvesi", price: "35₺", img: "/demo/turk-kahvesi.png" },
                  { name: "Sütlü Latte",  price: "55₺", img: "/demo/latte.png" },
                  { name: "Cheesecake",   price: "80₺", img: "/demo/cheescake.png" },
                ].map((p) => (
                  <div key={p.name} className="flex items-center gap-2">
                    <Image src={p.img} alt={p.name} width={32} height={32} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                    <span className="text-[11px] text-gray-700 flex-1">{p.name}</span>
                    <span className="text-[11px] font-bold text-orange-500">{p.price}</span>
                  </div>
                ))}
                <p className="text-[9px] text-gray-300 text-center pt-1">ve daha fazlası...</p>
              </div>
            </div>
            <div className="w-16 h-1.5 bg-gray-700 rounded-full mx-auto mt-2" />
          </div>
        )}
      </div>
    </div>
  );
}
