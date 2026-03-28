"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, LayoutList, LayoutGrid } from "lucide-react";
import { PRODUCT_TAGS, PRODUCT_INGREDIENTS } from "@/types/menu";

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
  { name: "Türk Kahvesi", category: "Kahveler",        price: 35, description: "Geleneksel tarif, köpüklü",    tags: ["Popüler"],       ingredients: ["espresso", "milk"],                     image: "/demo/turk-kahvesi.png" },
  { name: "Sütlü Latte",  category: "Kahveler",        price: 55, description: "Buharda ısıtılmış süt ile",    tags: [],                ingredients: ["espresso", "milk", "cream"],             image: "/demo/latte.png" },
  { name: "Ice Latte",    category: "Soğuk İçecekler", price: 65, description: "Buzlu, ferahlatıcı",           tags: ["Popüler"],       ingredients: ["espresso", "milk", "ice"],               image: "/demo/ice-latte.png" },
  { name: "Cheesecake",   category: "Tatlılar",        price: 80, description: "Ev yapımı, mevsim meyveli",    tags: ["Şefin Seçimi"],  ingredients: ["flour", "egg", "butter", "cream"],       image: "/demo/cheescake.png" },
  { name: "Waffle",       category: "Tatlılar",        price: 75, description: "Çikolata sosu, dondurma",      tags: [],                ingredients: ["flour", "egg", "chocolate", "icecream"], image: "/demo/waffle.png" },
  { name: "Granola Bowl", category: "Atıştırmalıklar", price: 75, description: "Yulaf, bal, mevsim meyveleri", tags: ["Yeni"],          ingredients: ["oat", "honey", "yogurt", "strawberry"], image: null },
];

const CAT_ORDER = ["Kahveler", "Soğuk İçecekler", "Tatlılar", "Atıştırmalıklar"];

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
            <div className="rounded-[28px] overflow-hidden bg-white flex flex-col" style={{ height: 480, fontFamily: font }}>

              {/* Mini header */}
              <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2 shrink-0">
                <div className="w-6 h-6 rounded-lg" style={{ backgroundColor: `${color}22` }}>
                  <div className="w-full h-full rounded-lg flex items-center justify-center">
                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
                  </div>
                </div>
                <span className="font-bold text-xs text-gray-800">Arôme Café</span>
              </div>

              {/* Ürünler — kategorilere göre gruplu, scrollable */}
              <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3">
                {CAT_ORDER.map((cat) => {
                  const items = PRODUCTS.filter((p) => p.category === cat);
                  if (items.length === 0) return null;
                  return (
                    <div key={cat}>
                      {/* Kategori başlığı */}
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color }}>{cat}</span>
                        <div className="flex-1 h-px" style={{ backgroundColor: `${color}30` }} />
                      </div>
                      {/* Ürün listesi / kart */}
                      <div className={layout === "card" ? "grid grid-cols-2 gap-1.5" : "space-y-1.5"}>
                        {items.map((p) => (
                          layout === "list" ? (
                            <div key={p.name} className="flex items-center gap-2 py-1 border-b border-gray-50">
                              {p.image ? (
                                <Image src={p.image} alt={p.name} width={32} height={32}
                                  className="w-8 h-8 rounded-lg object-cover shrink-0" />
                              ) : (
                                <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center"
                                  style={{ backgroundColor: `${color}18` }}>
                                  <span className="text-sm">🍽️</span>
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-semibold text-gray-800 truncate">{p.name}</p>
                                <p className="text-[8px] text-gray-400 truncate">{p.description}</p>
                                {p.tags.length > 0 && (
                                  <div className="flex gap-0.5 mt-0.5">
                                    {p.tags.map((tag) => {
                                      const def = PRODUCT_TAGS.find((t) => t.label === tag);
                                      return (
                                        <span key={tag} className="inline-flex items-center gap-0.5 text-[7px] font-bold px-1 py-0.5 rounded-full"
                                          style={{ backgroundColor: def?.bg ?? "#f3f4f6", color: def?.color ?? "#6b7280" }}>
                                          {def?.icon && <span className="leading-none">{def.icon}</span>}
                                          {tag}
                                        </span>
                                      );
                                    })}
                                  </div>
                                )}
                                {p.ingredients.length > 0 && (
                                  <div className="flex gap-0.5 mt-0.5">
                                    {p.ingredients.slice(0, 4).map((id) => {
                                      const ing = PRODUCT_INGREDIENTS.find((i) => i.id === id);
                                      return ing ? <span key={id} className="text-[9px] leading-none">{ing.icon}</span> : null;
                                    })}
                                  </div>
                                )}
                              </div>
                              <span className="text-[10px] font-bold shrink-0" style={{ color }}>{p.price}₺</span>
                            </div>
                          ) : (
                            <div key={p.name} className="rounded-xl border border-gray-100 overflow-hidden">
                              {p.image ? (
                                <Image src={p.image} alt={p.name} width={120} height={64}
                                  className="w-full h-14 object-cover" />
                              ) : (
                                <div className="w-full h-14 flex items-center justify-center"
                                  style={{ backgroundColor: `${color}18` }}>
                                  <span className="text-xl">🍽️</span>
                                </div>
                              )}
                              <div className="p-1.5">
                                <p className="text-[9px] font-semibold text-gray-800 truncate">{p.name}</p>
                                {p.tags.length > 0 && (
                                  <div className="flex gap-0.5 mt-0.5">
                                    {p.tags.slice(0, 1).map((tag) => {
                                      const def = PRODUCT_TAGS.find((t) => t.label === tag);
                                      return (
                                        <span key={tag} className="inline-flex items-center gap-0.5 text-[7px] font-bold px-1 py-0.5 rounded-full"
                                          style={{ backgroundColor: def?.bg ?? "#f3f4f6", color: def?.color ?? "#6b7280" }}>
                                          {def?.icon}{tag}
                                        </span>
                                      );
                                    })}
                                  </div>
                                )}
                                <p className="text-[9px] font-bold mt-0.5" style={{ color }}>{p.price}₺</p>
                              </div>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="w-16 h-1.5 bg-gray-700 rounded-full mx-auto mt-2" />
          </div>
        </div>
      </div>

    </div>
  );
}
