"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { PRODUCT_INGREDIENTS, INGREDIENT_GROUPS } from "@/types/menu";
import OpenmojiIcon from "./OpenmojiIcon";

interface Props {
  selected: string[];
  onChange: (ingredients: string[]) => void;
}

export default function IngredientSelector({ selected, onChange }: Props) {
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  function toggle(id: string) {
    if (selected.includes(id)) {
      onChange(selected.filter((i) => i !== id));
    } else {
      onChange([...selected, id]);
    }
  }

  return (
    <div className="space-y-2">
      {/* Seçilenler */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pb-1">
          {selected.map((id) => {
            const ing = PRODUCT_INGREDIENTS.find((i) => i.id === id);
            if (!ing) return null;
            return (
              <button
                key={id}
                type="button"
                onClick={() => toggle(id)}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-orange-600 border border-orange-200 hover:bg-red-50 hover:text-red-400 hover:border-red-200 transition-colors"
              >
                <OpenmojiIcon emoji={ing.icon} size={14} />
                {ing.label}
                <span className="ml-0.5 text-orange-300">×</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Grup accordion'ları */}
      <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100">
        {INGREDIENT_GROUPS.map((group) => {
          const items = PRODUCT_INGREDIENTS.filter((i) => i.group === group);
          const selectedInGroup = items.filter((i) => selected.includes(i.id)).length;
          const isOpen = openGroup === group;

          return (
            <div key={group}>
              <button
                type="button"
                onClick={() => setOpenGroup(isOpen ? null : group)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <span className="flex items-center gap-2">
                  {group}
                  {selectedInGroup > 0 && (
                    <span className="text-xs bg-orange-100 text-orange-500 font-semibold px-1.5 py-0.5 rounded-full">
                      {selectedInGroup}
                    </span>
                  )}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>

              {isOpen && (
                <div className="grid grid-cols-3 gap-1.5 px-3 pb-3 pt-1 bg-gray-50">
                  {items.map((ing) => {
                    const active = selected.includes(ing.id);
                    return (
                      <button
                        key={ing.id}
                        type="button"
                        onClick={() => toggle(ing.id)}
                        className={`flex flex-col items-center gap-0.5 py-2 px-1 rounded-xl text-xs font-medium border transition-all ${
                          active
                            ? "bg-orange-50 border-orange-300 text-orange-600"
                            : "bg-white border-gray-200 text-gray-500 hover:border-orange-200 hover:bg-orange-50"
                        }`}
                      >
                        <OpenmojiIcon emoji={ing.icon} size={28} />
                        <span className="text-[10px] text-center leading-tight">{ing.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
