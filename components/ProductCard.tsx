import { Trash2, ImageOff, Pencil } from "lucide-react";
import Image from "next/image";
import type { Product } from "@/types/menu";
import { PRODUCT_TAGS, PRODUCT_INGREDIENTS } from "@/types/menu";

interface ProductCardProps {
  product: Product;
  onDelete: (id: string) => void;
  onEdit: (product: Product) => void;
  onToggleStock: (id: string, inStock: boolean) => void;
}

export default function ProductCard({ product, onDelete, onEdit, onToggleStock }: ProductCardProps) {
  const inStock = product.in_stock !== false;

  return (
    <div className={`flex items-center gap-3 bg-white border rounded-xl px-4 py-3 shadow-sm transition-opacity ${inStock ? "border-gray-100" : "border-red-100 opacity-60"}`}>
      {/* Thumbnail */}
      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center relative">
        {product.image_url ? (
          <Image src={product.image_url} alt={product.name} width={48} height={48}
            className="w-full h-full object-cover" />
        ) : (
          <ImageOff className="w-5 h-5 text-gray-300" />
        )}
        {!inStock && (
          <div className="absolute inset-0 bg-red-50/80 flex items-center justify-center">
            <span className="text-[9px] font-bold text-red-400 leading-tight text-center">TÜ-<br/>KEN-<br/>Dİ</span>
          </div>
        )}
      </div>

      {/* Bilgi */}
      <div className="flex-1 min-w-0">
        <p className={`font-medium truncate ${inStock ? "text-gray-900" : "text-gray-400 line-through"}`}>
          {product.name}
        </p>
        {product.description && (
          <p className="text-xs text-gray-400 truncate">{product.description}</p>
        )}
        {product.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {product.tags.map((tag) => {
              const def = PRODUCT_TAGS.find((t) => t.label === tag);
              return (
                <span key={tag} className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                  style={{ backgroundColor: def?.bg ?? "#f3f4f6", color: def?.color ?? "#6b7280" }}>
                  {def?.icon && <span className="text-[11px] leading-none">{def.icon}</span>}
                  {tag}
                </span>
              );
            })}
          </div>
        )}
        {product.ingredients?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {product.ingredients.map((id) => {
              const ing = PRODUCT_INGREDIENTS.find((i) => i.id === id);
              if (!ing) return null;
              return (
                <span key={id} title={ing.label}
                  className="text-base leading-none" aria-label={ing.label}>
                  {ing.icon}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Fiyat + Stok + Düzenle + Sil */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="font-semibold text-orange-500">
          {Number(product.price).toFixed(2)} ₺
        </span>
        <button
          onClick={() => onToggleStock(product.id, !inStock)}
          className={`text-xs font-semibold px-2 py-0.5 rounded-full border transition-colors ${
            inStock
              ? "border-green-200 text-green-500 hover:bg-red-50 hover:text-red-400 hover:border-red-200"
              : "border-red-200 text-red-400 hover:bg-green-50 hover:text-green-500 hover:border-green-200"
          }`}
          title={inStock ? "Tükendi olarak işaretle" : "Stokta var olarak işaretle"}
        >
          {inStock ? "Stokta" : "Tükendi"}
        </button>
        <button onClick={() => onEdit(product)}
          className="text-gray-300 hover:text-orange-400 transition-colors" aria-label="Ürünü düzenle">
          <Pencil className="w-4 h-4" />
        </button>
        <button onClick={() => onDelete(product.id)}
          className="text-gray-300 hover:text-red-400 transition-colors" aria-label="Ürünü sil">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
