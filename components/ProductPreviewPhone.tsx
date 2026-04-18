"use client";

import Image from "next/image";
import { ImageOff } from "lucide-react";
import { PRODUCT_TAGS, PRODUCT_INGREDIENTS } from "@/types/menu";

interface Props {
  name: string;
  description?: string;
  price: string;
  imagePreview?: string;
  tags?: string[];
  ingredients?: string[];
  calories?: string;
  primaryColor?: string;
}

export default function ProductPreviewPhone({
  name,
  description,
  price,
  imagePreview,
  tags = [],
  ingredients = [],
  calories,
  primaryColor = "#f97316",
}: Props) {
  const displayName = name.trim() || "Ürün adı";
  const displayPrice = parseFloat(price) > 0 ? parseFloat(price).toFixed(2) : "—";

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      <p className="text-[11px] text-gray-400 font-medium tracking-widest uppercase">Önizleme</p>

      {/* Telefon gövdesi */}
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
          className="w-full h-full overflow-hidden bg-white"
          style={{ borderRadius: 41 }}
        >
          {/* Dynamic Island */}
          <div className="flex justify-center pt-3 pb-1 bg-white">
            <div className="w-20 h-5 bg-black rounded-full" />
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between px-5 pb-1 bg-white">
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
            className="px-4 py-2 flex items-center justify-between border-b border-gray-100"
            style={{ backgroundColor: primaryColor + "15" }}
          >
            <span className="text-[10px] font-bold" style={{ color: primaryColor }}>← Menü</span>
            <span className="text-[10px] font-semibold text-gray-500">Ürün Detayı</span>
          </div>

          {/* Ürün görseli */}
          <div className="relative w-full bg-gray-100" style={{ height: 130 }}>
            {imagePreview ? (
              <Image src={imagePreview} alt={displayName} fill className="object-cover" unoptimized />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageOff className="w-8 h-8 text-gray-300" />
              </div>
            )}
          </div>

          {/* İçerik */}
          <div className="px-4 py-3 space-y-2 overflow-hidden">
            <p className="text-[13px] font-bold text-gray-900 leading-tight line-clamp-2">{displayName}</p>

            {description?.trim() && (
              <p className="text-[10px] text-gray-400 leading-snug line-clamp-3">{description}</p>
            )}

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {tags.slice(0, 3).map((tag) => {
                  const def = PRODUCT_TAGS.find((t) => t.label === tag);
                  return (
                    <span key={tag}
                      className="inline-flex items-center gap-0.5 text-[8px] font-semibold px-1.5 py-0.5 rounded-full"
                      style={{ backgroundColor: def?.bg ?? "#f3f4f6", color: def?.color ?? "#6b7280" }}>
                      {def?.icon} {tag}
                    </span>
                  );
                })}
              </div>
            )}

            {ingredients.length > 0 && (
              <div className="flex flex-wrap gap-0.5">
                {ingredients.slice(0, 6).map((id) => {
                  const ing = PRODUCT_INGREDIENTS.find((i) => i.id === id);
                  if (!ing) return null;
                  return <span key={id} className="text-[13px]" title={ing.label}>{ing.icon}</span>;
                })}
              </div>
            )}

            <div className="flex items-center justify-between pt-1 border-t border-gray-100">
              <span className="text-[15px] font-bold" style={{ color: primaryColor }}>
                {displayPrice} ₺
              </span>
              {calories && parseInt(calories) > 0 && (
                <span className="text-[9px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  {calories} kcal
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Ana çubuk */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-gray-300 rounded-full" />
      </div>
    </div>
  );
}
