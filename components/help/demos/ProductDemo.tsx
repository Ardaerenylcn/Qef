"use client";

import { useEffect, useState } from "react";
import { ImageOff } from "lucide-react";

const FRAMES = [
  { name: "",             price: "",     desc: "" },
  { name: "T",            price: "",     desc: "" },
  { name: "Türk Kah",     price: "",     desc: "" },
  { name: "Türk Kahvesi", price: "",     desc: "" },
  { name: "Türk Kahvesi", price: "4",    desc: "" },
  { name: "Türk Kahvesi", price: "45",   desc: "" },
  { name: "Türk Kahvesi", price: "45.00",desc: "" },
  { name: "Türk Kahvesi", price: "45.00",desc: "Geleneksel..." },
  { name: "Türk Kahvesi", price: "45.00",desc: "Geleneksel Türk usulü" },
  { name: "Türk Kahvesi", price: "45.00",desc: "Geleneksel Türk usulü" },
  { name: "Türk Kahvesi", price: "45.00",desc: "Geleneksel Türk usulü" },
];

const DELAYS = [600,200,200,300,150,150,300,250,250,800,1200];

export default function ProductDemo() {
  const [fi, setFi] = useState(0);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const next = (i: number) => {
      t = setTimeout(() => {
        const ni = (i + 1) % FRAMES.length;
        setFi(ni);
        next(ni);
      }, DELAYS[i] ?? 300);
    };
    next(fi);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const f = FRAMES[fi];
  const active = f.name.length > 0;

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
      <div className="flex items-start gap-3">
        {/* Form */}
        <div className="flex-1 space-y-2 min-w-0">
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-2">Form</p>
          <div
            className="rounded-xl border px-3 py-2 min-h-[36px] transition-colors duration-200"
            style={{ borderColor: f.name ? "#f97316" : "#e5e7eb", backgroundColor: f.name ? "#fff7ed" : "#f9fafb" }}
          >
            <p className="text-xs font-semibold">
              {f.name || <span className="text-gray-300">Ürün adı</span>}
            </p>
          </div>
          <div className="flex gap-2">
            <div
              className="flex-1 rounded-xl border px-3 py-2 min-h-[36px] transition-colors duration-200"
              style={{ borderColor: f.price ? "#f97316" : "#e5e7eb", backgroundColor: f.price ? "#fff7ed" : "#f9fafb" }}
            >
              <p className="text-xs text-gray-700">
                {f.price ? `${f.price} ₺` : <span className="text-gray-300">Fiyat</span>}
              </p>
            </div>
            <div className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 min-h-[36px]">
              <p className="text-xs text-gray-500">Kahveler</p>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 min-h-[36px]">
            <p className="text-xs text-gray-500">
              {f.desc || <span className="text-gray-300">Açıklama</span>}
            </p>
          </div>
        </div>

        {/* Animated arrow */}
        <div className="flex flex-col items-center justify-center mt-8 gap-0.5">
          <div className="w-6 h-0.5 rounded transition-all duration-400" style={{ backgroundColor: active ? "#f97316" : "#e5e7eb" }} />
          <div className="w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-[6px] transition-all duration-400" style={{ borderLeftColor: active ? "#f97316" : "#e5e7eb" }} />
        </div>

        {/* Mini phone */}
        <div className="flex-shrink-0">
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-2">Önizleme</p>
          <div className="w-[80px] h-[130px] bg-gray-900 rounded-[18px] p-[3px] shadow-lg">
            <div className="w-full h-full bg-white rounded-[15px] overflow-hidden flex flex-col">
              <div className="flex justify-center pt-1.5 pb-0.5 flex-shrink-0">
                <div className="w-8 h-[7px] bg-black rounded-full" />
              </div>
              <div className="px-2 py-1 flex-shrink-0" style={{ backgroundColor: "#fff7ed" }}>
                <p className="text-[6px] font-bold text-orange-500">← Menü</p>
              </div>
              <div className="h-10 bg-gray-100 flex-shrink-0 flex items-center justify-center">
                <ImageOff className="w-3 h-3 text-gray-300" />
              </div>
              <div className="flex-1 px-1.5 py-1 space-y-0.5 overflow-hidden">
                <p className="text-[7.5px] font-bold text-gray-800 leading-tight transition-all duration-200">
                  {f.name || <span className="text-gray-200">Ürün adı</span>}
                </p>
                {f.desc && (
                  <p className="text-[6px] text-gray-400 leading-tight line-clamp-2">{f.desc}</p>
                )}
                <div className="pt-0.5 border-t border-gray-100">
                  <p className="text-[8px] font-bold transition-all duration-200" style={{ color: f.price ? "#f97316" : "#d1d5db" }}>
                    {f.price ? `${f.price} ₺` : "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
