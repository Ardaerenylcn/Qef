"use client";

import { useState, useEffect } from "react";
import { Search, UtensilsCrossed } from "lucide-react";
import { PRODUCT_TAGS } from "@/types/menu";
import ImageZoomModal from "./ImageZoomModal";

interface Product {
  id: string;
  name: string;
  name_en: string | null;
  price: number;
  category: string | null;
  description: string | null;
  description_en: string | null;
  image_url: string | null;
  tags: string[] | null;
  in_stock: boolean | null;
}

interface Props {
  products: Product[];
  orderedCats: string[];
  primaryColor: string;
  isEn: boolean;
  productLayout?: "list" | "card";
  imageRatio?: "square" | "wide" | "round";
}

export default function MenuProductList({
  products,
  orderedCats,
  primaryColor,
  isEn,
  productLayout = "list",
  imageRatio = "square",
}: Props) {
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const q = query.trim().toLowerCase();

  const filtered = q
    ? products.filter((p) => {
        const name = (isEn && p.name_en ? p.name_en : p.name).toLowerCase();
        const desc = ((isEn && p.description_en ? p.description_en : p.description) ?? "").toLowerCase();
        return name.includes(q) || desc.includes(q);
      })
    : null;

  const grouped = products.reduce<Record<string, Product[]>>((acc, p) => {
    const key = p.category || "Genel";
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {});

  // Image class helpers
  function getListImageClass(): string {
    if (imageRatio === "wide") return "w-24 h-16 rounded-xl object-cover shrink-0";
    if (imageRatio === "round") return "w-16 h-16 rounded-full object-cover shrink-0";
    return "w-16 h-16 rounded-xl object-cover shrink-0"; // square
  }

  function getListPlaceholderClass(): string {
    if (imageRatio === "wide") return "w-24 h-16 rounded-xl shrink-0 flex items-center justify-center";
    if (imageRatio === "round") return "w-16 h-16 rounded-full shrink-0 flex items-center justify-center";
    return "w-16 h-16 rounded-xl shrink-0 flex items-center justify-center"; // square
  }

  function getCardImageClass(): string {
    if (imageRatio === "wide") return "w-full aspect-video object-cover";
    if (imageRatio === "round") return "w-full aspect-square object-cover rounded-3xl";
    return "w-full aspect-square object-cover"; // square
  }

  function getCardPlaceholderClass(): string {
    if (imageRatio === "wide") return "w-full aspect-video flex items-center justify-center";
    if (imageRatio === "round") return "w-full aspect-square flex items-center justify-center rounded-3xl";
    return "w-full aspect-square flex items-center justify-center"; // square
  }

  function renderListProduct(product: Product) {
    const inStock = product.in_stock !== false;
    return (
      <div key={product.id} className={`flex items-center gap-4 ${!inStock ? "opacity-50" : ""}`}>
        {product.image_url ? (
          <ImageZoomModal
            src={product.image_url}
            alt={product.name}
            thumbClass={getListImageClass()}
          />
        ) : (
          <div
            className={getListPlaceholderClass()}
            style={{ backgroundColor: `${primaryColor}1a` }}
          >
            <UtensilsCrossed
              className="w-6 h-6"
              style={{ color: primaryColor, opacity: 0.3 }}
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className={`font-medium ${!inStock ? "line-through" : ""}`}>
              {isEn && product.name_en ? product.name_en : product.name}
            </p>
            {!inStock && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-red-100 text-red-400 shrink-0">
                {isEn ? "Sold Out" : "Tükendi"}
              </span>
            )}
          </div>
          {(isEn && product.description_en ? product.description_en : product.description) && (
            <p className="text-xs opacity-50 mt-0.5">
              {isEn && product.description_en ? product.description_en : product.description}
            </p>
          )}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {product.tags.map((tag) => {
                const def = PRODUCT_TAGS.find((t) => t.label === tag);
                return (
                  <span
                    key={tag}
                    className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                    style={{ backgroundColor: def?.bg ?? "#f3f4f6", color: def?.color ?? "#6b7280" }}
                  >
                    {isEn ? (def?.labelEn ?? tag) : tag}
                  </span>
                );
              })}
            </div>
          )}
        </div>
        <span className="font-semibold ml-2 shrink-0" style={{ color: primaryColor }}>
          {Number(product.price).toFixed(2)} ₺
        </span>
      </div>
    );
  }

  function renderCardProduct(product: Product) {
    const inStock = product.in_stock !== false;
    return (
      <div key={product.id} className={`rounded-2xl border border-gray-100 overflow-hidden shadow-sm bg-white ${!inStock ? "opacity-50" : ""}`}>
        {product.image_url ? (
          <ImageZoomModal
            src={product.image_url}
            alt={product.name}
            thumbClass={getCardImageClass()}
            buttonClass="w-full block focus:outline-none"
          />
        ) : (
          <div
            className={getCardPlaceholderClass()}
            style={{ backgroundColor: `${primaryColor}1a` }}
          >
            <UtensilsCrossed
              className="w-10 h-10"
              style={{ color: primaryColor, opacity: 0.3 }}
            />
          </div>
        )}
        <div className="p-3 space-y-1">
          <div className="flex items-center gap-2">
            <p className={`font-medium text-sm ${!inStock ? "line-through" : ""}`}>
              {isEn && product.name_en ? product.name_en : product.name}
            </p>
            {!inStock && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-red-100 text-red-400 shrink-0">
                {isEn ? "Sold Out" : "Tükendi"}
              </span>
            )}
          </div>
          {(isEn && product.description_en ? product.description_en : product.description) && (
            <p className="text-xs opacity-50">
              {isEn && product.description_en ? product.description_en : product.description}
            </p>
          )}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {product.tags.map((tag) => {
                const def = PRODUCT_TAGS.find((t) => t.label === tag);
                return (
                  <span
                    key={tag}
                    className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                    style={{ backgroundColor: def?.bg ?? "#f3f4f6", color: def?.color ?? "#6b7280" }}
                  >
                    {isEn ? (def?.labelEn ?? tag) : tag}
                  </span>
                );
              })}
            </div>
          )}
          <p className="font-bold text-sm pt-1" style={{ color: primaryColor }}>
            {Number(product.price).toFixed(2)} ₺
          </p>
        </div>
      </div>
    );
  }

  function renderProduct(product: Product) {
    return productLayout === "card"
      ? renderCardProduct(product)
      : renderListProduct(product);
  }

  const listContainerClass = productLayout === "card"
    ? "grid grid-cols-2 gap-3"
    : "space-y-4";

  return (
    <div className="space-y-6">
      {/* Arama */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" />
        <input
          type="search"
          placeholder={isEn ? "Search products..." : "Ürün ara..."}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2"
          style={{
            borderColor: `${primaryColor}33`,
            backgroundColor: `${primaryColor}08`,
          }}
        />
      </div>

      {/* Arama sonuçları */}
      {filtered !== null ? (
        filtered.length === 0 ? (
          <div className="text-center py-12 opacity-30 space-y-2">
            <UtensilsCrossed className="w-8 h-8 mx-auto" />
            <p className="text-sm">{isEn ? "No products found." : "Ürün bulunamadı."}</p>
          </div>
        ) : (
          <div
            className={`${listContainerClass} transition-all duration-500 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {filtered.map(renderProduct)}
          </div>
        )
      ) : (
        /* Normal kategori görünümü */
        <div
          className={`space-y-8 transition-opacity duration-300 ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
        >
          {orderedCats.map((cat) => (
            <section key={cat} id={`cat-${cat}`}>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: primaryColor }}>
                  {cat}
                </h2>
                <div className="flex-1 h-px" style={{ backgroundColor: `${primaryColor}33` }} />
              </div>
              <div className={listContainerClass}>
                {(grouped[cat] ?? []).map(renderProduct)}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
