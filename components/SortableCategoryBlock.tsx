"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { GripVertical } from "lucide-react";
import { SortableProductCard } from "./SortableProductCard";
import type { Product } from "@/types/menu";

interface Props {
  category: string;
  products: Product[];
  onDeleteProduct: (id: string) => void;
  onEditProduct: (product: Product) => void;
  onProductReorder: (category: string, newOrder: Product[]) => void;
}

export function SortableCategoryBlock({
  category,
  products,
  onDeleteProduct,
  onEditProduct,
  onProductReorder,
}: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: category });

  const sensors = useSensors(useSensor(PointerSensor));

  function handleProductDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = products.findIndex((p) => p.id === active.id);
    const newIndex = products.findIndex((p) => p.id === over.id);
    const newOrder = [...products];
    const [moved] = newOrder.splice(oldIndex, 1);
    newOrder.splice(newIndex, 0, moved);
    onProductReorder(category, newOrder);
  }

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
      }}
      className="space-y-2"
    >
      {/* Kategori başlığı — sürükle tutamacı */}
      <div className="flex items-center gap-2 px-1">
        <button
          {...attributes}
          {...listeners}
          className="text-gray-300 hover:text-orange-400 cursor-grab active:cursor-grabbing touch-none"
        >
          <GripVertical className="w-4 h-4" />
        </button>
        <p className="text-xs font-semibold uppercase tracking-widest text-orange-400">
          {category}
        </p>
      </div>

      {/* Ürünler */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleProductDragEnd}
      >
        <SortableContext
          items={products.map((p) => p.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {products.map((product) => (
              <SortableProductCard
                key={product.id}
                product={product}
                onDelete={onDeleteProduct}
                onEdit={onEditProduct}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
