"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import ProductCard from "./ProductCard";
import type { Product } from "@/types/menu";

export function SortableProductCard({
  product,
  onDelete,
  onEdit,
}: {
  product: Product;
  onDelete: (id: string) => void;
  onEdit: (product: Product) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: product.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
      }}
      className="flex items-center gap-2"
    >
      <button
        {...attributes}
        {...listeners}
        className="text-gray-300 hover:text-gray-400 cursor-grab active:cursor-grabbing touch-none"
      >
        <GripVertical className="w-4 h-4" />
      </button>
      <div className="flex-1">
        <ProductCard product={product} onDelete={onDelete} onEdit={onEdit} />
      </div>
    </div>
  );
}
