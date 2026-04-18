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
  const displayPrice = parseFloat(price) > 0 ? parseFloat(price).toFixed(2) : "0.00";

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">Müşteri Görünümü</p>

      {/* Telefon çerçevesi */}
      <div className="relative w-[200px] rounded-[32px] bg-gray-900 p-[3px] shadow-2xl shadow-gray-400/30"
        style={{ border: "2px solid #374151" }}>

        {/* Ekran */}
        <div className="rounded-[29px] bg-gray-50 overflow-hidden">

          {/* Status bar */}
          <div className="flex items-center justify-between px-4 pt-2 pb-1 bg-white">
            <span className="text-[8px] font-bold text-gray-400">9:41</span>
            <div className="w-12 h-3 rounded-full bg-gray-900" />
            <div className="flex items-center gap-0.5">
              <div className="flex gap-px items-end h-2.5">
                {[2, 3, 4, 5].map((h) => (
                  <div key={h} className="w-0.5 bg-gray-400 rounded-sm" style={{ height: h }} />
                ))}
              </div>
              <div className="w-3 h-2 rounded-sm border border-gray-400 ml-1">
                <div className="w-1.5 h-full bg-green-400 rounded-sm" />
              </div>
            </div>
          </div>

          {/* Menü header */}
          <div className="px-3 py-1.5 bg-white border-b border-gray-100 flex items-center justify-between">
            <span className="text-[9px] font-bold text-gray-700 truncate">Menü</span>
            <div className="w-12 h-1.5 rounded-full bg-gray-100" />
          </div>

          {/* Ürün kartı */}
          <div className="p-2.5">
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">

              {/* Görsel */}
              <div className="w-full h-24 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt={displayName}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <ImageOff className="w-6 h-6 text-gray-300" />
                )}
              </div>

              {/* İçerik */}
              <div className="px-2.5 py-2 space-y-1">
                <p className="text-[11px] font-bold text-gray-900 leading-tight line-clamp-1">{displayName}</p>

                {description?.trim() && (
                  <p className="text-[9px] text-gray-400 leading-tight line-clamp-2">{description}</p>
                )}

                {/* Etiketler */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {tags.slice(0, 2).map((tag) => {
                      const def = PRODUCT_TAGS.find((t) => t.label === tag);
                      return (
                        <span key={tag}
                          className="inline-flex items-center gap-0.5 text-[8px] font-semibold px-1.5 py-0.5 rounded-full"
                          style={{ backgroundColor: def?.bg ?? "#f3f4f6", color: def?.color ?? "#6b7280" }}>
                          {def?.icon && <span className="text-[9px]">{def.icon}</span>}
                          {tag}
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* İçerik emojileri */}
                {ingredients.length > 0 && (
                  <div className="flex flex-wrap gap-0.5 pt-0.5">
                    {ingredients.slice(0, 5).map((id) => {
                      const ing = PRODUCT_INGREDIENTS.find((i) => i.id === id);
                      if (!ing) return null;
                      return (
                        <span key={id} className="text-[11px] leading-none" title={ing.label}>
                          {ing.icon}
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* Fiyat + kalori */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[12px] font-bold" style={{ color: primaryColor }}>
                    {displayPrice} ₺
                  </span>
                  {calories && parseInt(calories) > 0 && (
                    <span className="text-[8px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                      {calories} kcal
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Alt bar */}
          <div className="flex justify-center pb-2 pt-1 bg-gray-50">
            <div className="w-16 h-1 bg-gray-300 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
