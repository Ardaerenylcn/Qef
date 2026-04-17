"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, UtensilsCrossed } from "lucide-react";
import { PRODUCT_TAGS, PRODUCT_INGREDIENTS } from "@/types/menu";
import OpenmojiIcon from "./OpenmojiIcon";

interface Product {
  id: string;
  name: string;
  name_en: string | null;
  price: number;
  description: string | null;
  description_en: string | null;
  image_url: string | null;
  tags: string[] | null;
  ingredients: string[] | null;
  in_stock: boolean | null;
  calories?: number | null;
}

interface Props {
  product: Product;
  primaryColor: string;
  isEn: boolean;
  onClose: () => void;
}

export default function ProductDetailModal({ product, primaryColor, isEn, onClose }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  function handleClose() {
    setVisible(false);
    setTimeout(onClose, 300);
  }

  const inStock = product.in_stock !== false;
  const name = isEn && product.name_en ? product.name_en : product.name;
  const description = isEn && product.description_en ? product.description_en : product.description;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end justify-center transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
      onClick={handleClose}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Bottom sheet */}
      <div
        className={`relative w-full max-w-md bg-white rounded-t-3xl overflow-hidden max-h-[90vh] flex flex-col transition-transform duration-300 ${visible ? "translate-y-0" : "translate-y-full"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Görsel */}
        {product.image_url ? (
          <div className="relative w-full aspect-square shrink-0">
            <Image
              src={product.image_url}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 448px"
              priority
            />
            {/* Gradient overlay alt yazılar için */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        ) : (
          <div
            className="w-full aspect-video shrink-0 flex items-center justify-center"
            style={{ backgroundColor: `${primaryColor}18` }}
          >
            <UtensilsCrossed className="w-14 h-14 opacity-20" style={{ color: primaryColor }} />
          </div>
        )}

        {/* Kapat butonu */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* İçerik */}
        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          {/* Ad + fiyat */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold leading-tight">{name}</h2>
              {!inStock && (
                <span className="inline-block mt-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-500">
                  {isEn ? "Sold Out" : "Tükendi"}
                </span>
              )}
            </div>
            <div className="flex flex-col items-end shrink-0 gap-1">
              <span className="text-2xl font-bold" style={{ color: primaryColor }}>
                {Number(product.price).toFixed(2)} ₺
              </span>
              {product.calories && (
                <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  {product.calories} kcal
                </span>
              )}
            </div>
          </div>

          {/* Taglar */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {product.tags.map((tag) => {
                const def = PRODUCT_TAGS.find((t) => t.label === tag);
                return (
                  <span
                    key={tag}
                    className="inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: def?.bg ?? "#f3f4f6", color: def?.color ?? "#6b7280" }}
                  >
                    {isEn ? (def?.labelEn ?? tag) : tag}
                  </span>
                );
              })}
            </div>
          )}

          {/* Açıklama */}
          {description && (
            <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
          )}

          {/* Malzemeler */}
          {product.ingredients && product.ingredients.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                {isEn ? "Ingredients" : "İçerik"}
              </p>
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map((id) => {
                  const ing = PRODUCT_INGREDIENTS.find((i) => i.id === id);
                  if (!ing) return null;
                  return (
                    <span
                      key={id}
                      className="inline-flex items-center bg-gray-50 border border-gray-100 rounded-xl px-2 py-1.5"
                      title={isEn ? ing.labelEn : ing.label}
                    >
                      <OpenmojiIcon emoji={ing.icon} size={18} />
                    </span>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
