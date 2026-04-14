"use client";

import { useState } from "react";
import { LayoutList, LayoutGrid } from "lucide-react";
import MenuProductList from "./MenuProductList";

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
  ingredients: string[] | null;
  in_stock: boolean | null;
  model_url: string | null;
}

interface Props {
  products: Product[];
  orderedCats: string[];
  primaryColor: string;
}

export default function DemoLayoutToggle({ products, orderedCats, primaryColor }: Props) {
  const [layout, setLayout] = useState<"list" | "card">("list");

  return (
    <>
      {/* Toggle */}
      <div className="flex items-center justify-center gap-1 my-4">
        <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-1">
          <button
            onClick={() => setLayout("list")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              layout === "list"
                ? "bg-white shadow-sm text-gray-800"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <LayoutList className="w-3.5 h-3.5" />
            Liste
          </button>
          <button
            onClick={() => setLayout("card")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              layout === "card"
                ? "bg-white shadow-sm text-gray-800"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Kart
          </button>
        </div>
      </div>

      <MenuProductList
        products={products as Parameters<typeof MenuProductList>[0]["products"]}
        orderedCats={orderedCats}
        primaryColor={primaryColor}
        isEn={false}
        productLayout={layout}
        imageRatio="square"
      />
    </>
  );
}
