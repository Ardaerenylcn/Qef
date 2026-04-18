"use client";

import { ImageOff } from "lucide-react";

export interface PhoneProduct {
  id: string | number;
  name: string;
  price: string | number;
  imageUrl?: string;
  isNew?: boolean;
}

interface Props {
  products: PhoneProduct[];
  activeId?: string | number | null;
  primaryColor?: string;
}

export default function MenuListPreviewPhone({ products, activeId, primaryColor = "#f97316" }: Props) {
  const displayPrice = (p: string | number) => {
    const n = parseFloat(String(p));
    return n > 0 ? `${n.toFixed(2)} ₺` : "—";
  };

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      <p className="text-[11px] text-gray-400 font-medium tracking-widest uppercase">Önizleme</p>

      <div
        className="relative flex-shrink-0"
        style={{
          width: 220,
          height: 440,
          background: "#1a1a1a",
          borderRadius: 44,
          padding: 3,
          boxShadow: "0 0 0 1px #333, 0 24px 48px rgba(0,0,0,0.35), inset 0 0 0 1px #444",
        }}
      >
        {/* Yan butonlar */}
        <div className="absolute left-[-3px] top-[90px] w-[3px] h-7 bg-[#2a2a2a] rounded-l-sm" />
        <div className="absolute left-[-3px] top-[128px] w-[3px] h-10 bg-[#2a2a2a] rounded-l-sm" />
        <div className="absolute left-[-3px] top-[178px] w-[3px] h-10 bg-[#2a2a2a] rounded-l-sm" />
        <div className="absolute right-[-3px] top-[120px] w-[3px] h-14 bg-[#2a2a2a] rounded-r-sm" />

        {/* Ekran */}
        <div
          className="w-full h-full overflow-hidden bg-white flex flex-col"
          style={{ borderRadius: 41 }}
        >
          {/* Dynamic Island */}
          <div className="flex justify-center pt-3 pb-1 bg-white flex-shrink-0">
            <div className="w-20 h-5 bg-black rounded-full" />
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between px-5 pb-1 bg-white flex-shrink-0">
            <span className="text-[9px] font-bold text-gray-800">9:41</span>
            <div className="flex items-center gap-1">
              <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                <rect x="0" y="4" width="2" height="5" rx="0.5" fill="#1a1a1a" />
                <rect x="3" y="2.5" width="2" height="6.5" rx="0.5" fill="#1a1a1a" />
                <rect x="6" y="1" width="2" height="8" rx="0.5" fill="#1a1a1a" />
                <rect x="9" y="0" width="2" height="9" rx="0.5" fill="#1a1a1a" />
              </svg>
              <svg width="14" height="9" viewBox="0 0 14 9" fill="none">
                <rect x="0.5" y="0.5" width="12" height="8" rx="2" stroke="#1a1a1a" strokeWidth="1" />
                <rect x="13" y="2.5" width="1" height="4" rx="0.5" fill="#1a1a1a" />
                <rect x="1.5" y="1.5" width="8" height="6" rx="1.5" fill="#1a1a1a" />
              </svg>
            </div>
          </div>

          {/* Menü başlığı */}
          <div
            className="px-3 py-1.5 flex items-center justify-between border-b border-gray-100 flex-shrink-0"
            style={{ backgroundColor: primaryColor + "15" }}
          >
            <span className="text-[9px] font-bold" style={{ color: primaryColor }}>Menü</span>
            <span className="text-[9px] text-gray-400">{products.length} ürün</span>
          </div>

          {/* Ürün listesi */}
          {products.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-[10px] text-gray-300">Henüz ürün yok</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-2">
              <div className="grid grid-cols-2 gap-1.5">
                {products.map((p) => {
                  const isActive = p.id === activeId;
                  return (
                    <div
                      key={p.id}
                      className="rounded-xl overflow-hidden bg-white border-2 transition-all"
                      style={{ borderColor: isActive ? primaryColor : "#f1f5f9", boxShadow: isActive ? `0 0 0 1px ${primaryColor}40` : undefined }}
                    >
                      {/* Görsel */}
                      <div className="w-full bg-gray-100 overflow-hidden" style={{ aspectRatio: "4/3" }}>
                        {p.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageOff className="w-4 h-4 text-gray-300" />
                          </div>
                        )}
                      </div>

                      {/* Metin */}
                      <div className="px-1.5 py-1 space-y-0.5">
                        <p className="text-[8.5px] font-semibold text-gray-800 line-clamp-2 leading-tight">
                          {p.name || "Ürün adı"}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-[9px] font-bold" style={{ color: primaryColor }}>
                            {displayPrice(p.price)}
                          </p>
                          {p.isNew && (
                            <span
                              className="text-[7px] font-bold px-1 py-0.5 rounded-full text-white"
                              style={{ backgroundColor: primaryColor }}
                            >
                              Yeni
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Ana çubuk */}
          <div className="flex-shrink-0 pb-2 flex justify-center">
            <div className="w-16 h-1 bg-gray-200 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
