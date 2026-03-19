"use client";

import { PRODUCT_TAGS } from "@/types/menu";

interface Props {
  selected: string[];
  onChange: (tags: string[]) => void;
}

export default function TagSelector({ selected, onChange }: Props) {
  function toggle(label: string) {
    if (selected.includes(label)) {
      onChange(selected.filter((t) => t !== label));
    } else {
      onChange([...selected, label]);
    }
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {PRODUCT_TAGS.map((tag) => {
        const active = selected.includes(tag.label);
        return (
          <button
            key={tag.label}
            type="button"
            onClick={() => toggle(tag.label)}
            className="px-2.5 py-1 rounded-full text-xs font-semibold border transition-all"
            style={
              active
                ? { backgroundColor: tag.bg, color: tag.color, borderColor: tag.color }
                : { backgroundColor: "#f9fafb", color: "#9ca3af", borderColor: "#e5e7eb" }
            }
          >
            {tag.label}
          </button>
        );
      })}
    </div>
  );
}
