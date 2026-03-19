import { Trash2, ImageOff, Pencil } from "lucide-react";
import Image from "next/image";
import type { Product } from "@/types/menu";
import { PRODUCT_TAGS } from "@/types/menu";

interface ProductCardProps {
  product: Product;
  onDelete: (id: string) => void;
  onEdit: (product: Product) => void;
}

export default function ProductCard({ product, onDelete, onEdit }: ProductCardProps) {
  return (
    <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
      {/* Thumbnail */}
      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        ) : (
          <ImageOff className="w-5 h-5 text-gray-300" />
        )}
      </div>

      {/* Bilgi */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">{product.name}</p>
        {product.description && (
          <p className="text-xs text-gray-400 truncate">{product.description}</p>
        )}
        {product.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {product.tags.map((tag) => {
              const def = PRODUCT_TAGS.find((t) => t.label === tag);
              return (
                <span key={tag} className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                  style={{ backgroundColor: def?.bg ?? "#f3f4f6", color: def?.color ?? "#6b7280" }}>
                  {tag}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Fiyat + Düzenle + Sil */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="font-semibold text-orange-500">
          {Number(product.price).toFixed(2)} ₺
        </span>
        <button
          onClick={() => onEdit(product)}
          className="text-gray-300 hover:text-orange-400 transition-colors"
          aria-label="Ürünü düzenle"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(product.id)}
          className="text-gray-300 hover:text-red-400 transition-colors"
          aria-label="Ürünü sil"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
