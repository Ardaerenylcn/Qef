"use client";

import Image from "next/image";
import { useState } from "react";
import { PRODUCT_TAGS } from "@/types/menu";

const PRIMARY = "#f97316";

const CATS = ["Kahveler", "Soğuk İçecekler", "Tatlılar"];

const PRODUCTS = [
  { id: "1",  name: "Türk Kahvesi",      price: 35,  category: "Kahveler",        description: "Geleneksel tarif, köpüklü",        tags: ["Popüler"], image: "/demo/turk-kahvesi.png", in_stock: true  },
  { id: "2",  name: "Sütlü Latte",       price: 55,  category: "Kahveler",        description: "Buharda ısıtılmış süt ile",        tags: [],          image: "/demo/latte.png",         in_stock: true  },
  { id: "3",  name: "Cappuccino",        price: 50,  category: "Kahveler",        description: "Yoğun espresso, kadifemsi köpük", tags: ["Yeni"],    image: "/demo/Capuccino.png",     in_stock: true  },
  { id: "4",  name: "Americano",         price: 45,  category: "Kahveler",        description: "Sıcak su ile uzatılmış espresso", tags: [],          image: "/demo/americano.png",     in_stock: true  },
  { id: "5",  name: "Ice Latte",         price: 65,  category: "Soğuk İçecekler", description: "Buzlu, ferahlatıcı",               tags: ["Popüler"], image: "/demo/ice-latte.png",     in_stock: true  },
  { id: "6",  name: "Limonata",          price: 45,  category: "Soğuk İçecekler", description: "Taze sıkılmış limon",              tags: ["Vegan"],   image: "/demo/limonata.png",      in_stock: true  },
  { id: "7",  name: "Mango Smoothie",    price: 70,  category: "Soğuk İçecekler", description: "Taze mango, yoğurt",               tags: ["Yeni"],    image: "/demo/mango-smootihe.png",in_stock: false },
  { id: "8",  name: "Cheesecake",        price: 80,  category: "Tatlılar",        description: "Ev yapımı, mevsim meyveli",        tags: ["Popüler"], image: "/demo/cheescake.png",     in_stock: true  },
  { id: "9",  name: "Waffle",            price: 75,  category: "Tatlılar",        description: "Çikolata sosu ve dondurma ile",    tags: [],          image: "/demo/waffle.png",        in_stock: true  },
  { id: "10", name: "Fındıklı Kurabiye", price: 40,  category: "Tatlılar",        description: "Günlük taze pişirilir",            tags: ["Vegan"],   image: "/demo/cookie.png",        in_stock: true  },
];

export default function DemoPhoneMockup() {
  const [activeTab, setActiveTab] = useState("Kahveler");

  const grouped = PRODUCTS.reduce<Record<string, typeof PRODUCTS>>((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {});

  return (
    <div className="flex-shrink-0 flex justify-center">
      <div className="relative">
        <div className="absolute inset-0 bg-orange-200 rounded-full blur-3xl opacity-30 scale-110" />

        {/* Telefon çerçevesi */}
        <div className="relative w-[270px] bg-gray-900 rounded-[44px] p-3 shadow-2xl ring-1 ring-white/10">
          <div className="w-20 h-1.5 bg-gray-700 rounded-full mx-auto mb-2" />

          {/* Ekran */}
          <div className="rounded-[32px] overflow-hidden bg-white flex flex-col" style={{ height: 560 }}>

            {/* Sticky header */}
            <div className="flex items-center gap-2 px-3 py-2.5 border-b border-gray-100 bg-white shrink-0">
              <Image src="/demo/logo.png" alt="Logo" width={24} height={24} className="w-6 h-6 rounded-md object-cover" />
              <span className="font-bold text-xs text-gray-800 flex-1">Arôme Café</span>
              <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-green-100 text-green-600">Açık</span>
            </div>

            {/* Kapak */}
            <div className="relative h-24 shrink-0">
              <Image src="/demo/cafe-cover.png" alt="Kapak" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/30 flex items-end px-3 pb-2">
                <p className="text-white font-bold text-sm drop-shadow">Arôme Café</p>
              </div>
            </div>

            {/* Kategori sekmeleri */}
            <div className="flex border-b border-gray-100 bg-white shrink-0 overflow-x-auto scrollbar-none">
              {CATS.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className="px-3 py-2 text-[10px] font-semibold whitespace-nowrap transition-colors shrink-0"
                  style={activeTab === cat
                    ? { color: PRIMARY, borderBottom: `2px solid ${PRIMARY}` }
                    : { color: "#9ca3af" }
                  }
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Ürün listesi — kaydırılabilir */}
            <div
              className="flex-1 overflow-y-auto px-3 py-3 space-y-3"
              style={{ overscrollBehavior: "contain", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
            >
              {(grouped[activeTab] ?? []).map((p) => (
                <div key={p.id} className={`flex items-center gap-2 ${!p.in_stock ? "opacity-50" : ""}`}>
                  <Image src={p.image} alt={p.name} width={44} height={44}
                    className="w-11 h-11 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className={`text-[11px] font-semibold text-gray-800 truncate ${!p.in_stock ? "line-through" : ""}`}>
                      {p.name}
                    </p>
                    <p className="text-[9px] text-gray-400 truncate">{p.description}</p>
                    <div className="flex gap-1 mt-0.5 flex-wrap">
                      {p.tags.map((tag) => {
                        const def = PRODUCT_TAGS.find((t) => t.label === tag);
                        return (
                          <span key={tag} className="text-[8px] font-bold px-1 py-0.5 rounded-full"
                            style={{ backgroundColor: def?.bg ?? "#f3f4f6", color: def?.color ?? "#6b7280" }}>
                            {tag}
                          </span>
                        );
                      })}
                      {!p.in_stock && (
                        <span className="text-[8px] font-bold px-1 py-0.5 rounded-full bg-red-100 text-red-400">Tükendi</span>
                      )}
                    </div>
                  </div>
                  <span className="text-[11px] font-bold shrink-0" style={{ color: PRIMARY }}>{p.price}₺</span>
                </div>
              ))}
            </div>

          </div>

          <div className="w-24 h-1.5 bg-gray-700 rounded-full mx-auto mt-2" />
        </div>
      </div>
    </div>
  );
}
