"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, LayoutList, LayoutGrid } from "lucide-react";
import { PRODUCT_TAGS } from "@/types/menu";

const COLORS = [
  { label: "Turuncu", value: "#f97316" },
  { label: "Mor",     value: "#7c3aed" },
  { label: "Mavi",    value: "#2563eb" },
  { label: "Yeşil",   value: "#16a34a" },
  { label: "Pembe",   value: "#db2777" },
];

const FONTS = [
  { label: "Modern",   css: "Inter, system-ui, sans-serif" },
  { label: "Klasik",   css: "Georgia, 'Times New Roman', serif" },
  { label: "Yuvarlak", css: "'Nunito', sans-serif" },
];

const PRODUCTS = [
  { name: "Türk Kahvesi", name_en: "Turkish Coffee", price: 35, description: "Geleneksel tarif, köpüklü", tags: ["Popüler"], image: "/demo/turk-kahvesi.png" },
  { name: "Sütlü Latte",  name_en: "Latte",          price: 55, description: "Buharda ısıtılmış süt ile", tags: [],          image: "/demo/latte.png" },
  { name: "Cheesecake",   name_en: "Cheesecake",      price: 80, description: "Ev yapımı, mevsim meyveli", tags: ["Yeni"],   image: "/demo/cheescake.png" },
];

export default function DemoCustomizer() {
  const [color, setColor]   = useState(COLORS[0].value);
  const [font, setFont]     = useState(FONTS[0].css);
  const [layout, setLayout] = useState<"list" | "card">("list");

  return (
    <div className="flex flex-col lg:flex-row items-center gap-10">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');`}</style>

      {/* Kontroller */}
      <div className="flex-1 space-y-7 w-full max-w-sm">

        {/* Renk */}
        <div className="space-y-3">
          <p className="text-sm font-bold text-gray-700">Ana Renk</p>
          <div className="flex gap-3">
            {COLORS.map((c) => (
              <button
                key={c.value}
                onClick={() => setColor(c.value)}
                className="relative w-9 h-9 rounded-full shadow-md transition-transform hover:scale-110"
                style={{ backgroundColor: c.value }}
                title={c.label}
              >
                {color === c.value && (
                  <Check className="absolute inset-0 m-auto w-4 h-4 text-white drop-shadow" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Yazı tipi */}
        <div className="space-y-3">
          <p className="text-sm font-bold text-gray-700">Yazı Tipi</p>
          <div className="flex gap-2 flex-wrap">
            {FONTS.map((f) => (
              <button
                key={f.css}
                onClick={() => setFont(f.css)}
                className={`px-4 py-2 rounded-xl border-2 text-sm transition-all ${
                  font === f.css
                    ? "border-orange-400 bg-orange-50 text-orange-600 font-semibold"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
                style={{ fontFamily: f.css }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Ürün düzeni */}
        <div className="space-y-3">
          <p className="text-sm font-bold text-gray-700">Ürün Düzeni</p>
          <div className="flex gap-2">
            <button
              onClick={() => setLayout("list")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-sm transition-all ${
                layout === "list"
                  ? "border-orange-400 bg-orange-50 text-orange-600 font-semibold"
                  : "border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              <LayoutList className="w-4 h-4" /> Liste
            </button>
            <button
              onClick={() => setLayout("card")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-sm transition-all ${
                layout === "card"
                  ? "border-orange-400 bg-orange-50 text-orange-600 font-semibold"
                  : "border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              <LayoutGrid className="w-4 h-4" /> Kart
            </button>
          </div>
        </div>
      </div>

      {/* Önizleme */}
      <div className="flex-shrink-0">
        <div className="relative overflow-hidden rounded-[40px]">
          <div className="absolute inset-0 rounded-full blur-3xl opacity-20 scale-110" style={{ backgroundColor: color }} />
          <div className="relative w-[260px] bg-gray-900 rounded-[40px] p-3 shadow-2xl ring-1 ring-white/10">
            <div className="w-16 h-1.5 bg-gray-700 rounded-full mx-auto mb-2" />
            <div className="rounded-[28px] overflow-hidden bg-white" style={{ height: 480, fontFamily: font }}>

              {/* Mini header */}
              <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg" style={{ backgroundColor: `${color}22` }}>
                  <div className="w-full h-full rounded-lg flex items-center justify-center">
                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
                  </div>
                </div>
                <span className="font-bold text-xs text-gray-800">Arôme Café</span>
              </div>

              {/* Kategori etiketi */}
              <div className="px-4 pt-3 pb-1">
                <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color }}>Kahveler</span>
              </div>

              {/* Ürünler */}
              <div className={`px-3 pb-3 ${layout === "card" ? "grid grid-cols-2 gap-2 pt-1" : "space-y-2"}`}>
                {PRODUCTS.map((p) => (
                  layout === "list" ? (
                    <div key={p.name} className="flex items-center gap-2 py-1.5 border-b border-gray-50">
                      <Image src={p.image} alt={p.name} width={36} height={36}
                        className="w-9 h-9 rounded-lg object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold text-gray-800 truncate">{p.name}</p>
                        <p className="text-[9px] text-gray-400 truncate">{p.description}</p>
                        {p.tags.length > 0 && (
                          <div className="flex gap-1 mt-0.5">
                            {p.tags.map((tag) => {
                              const def = PRODUCT_TAGS.find((t) => t.label === tag);
                              return (
                                <span key={tag} className="text-[8px] font-bold px-1 py-0.5 rounded-full"
                                  style={{ backgroundColor: def?.bg ?? "#f3f4f6", color: def?.color ?? "#6b7280" }}>
                                  {tag}
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      <span className="text-[11px] font-bold shrink-0" style={{ color }}>{p.price}₺</span>
                    </div>
                  ) : (
                    <div key={p.name} className="rounded-xl border border-gray-100 overflow-hidden">
                      <Image src={p.image} alt={p.name} width={120} height={80}
                        className="w-full h-16 object-cover" />
                      <div className="p-1.5">
                        <p className="text-[10px] font-semibold text-gray-800 truncate">{p.name}</p>
                        <p className="text-[10px] font-bold mt-0.5" style={{ color }}>{p.price}₺</p>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
            <div className="w-16 h-1.5 bg-gray-700 rounded-full mx-auto mt-2" />
          </div>
        </div>
      </div>

    </div>
  );
}
