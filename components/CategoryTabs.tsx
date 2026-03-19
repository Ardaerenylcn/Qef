"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  categories: string[];
  primaryColor: string;
  bgColor?: string;
}

export default function CategoryTabs({ categories, primaryColor, bgColor = "#ffffff" }: Props) {
  const [active, setActive] = useState(categories[0] ?? "");
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    categories.forEach((cat) => {
      const el = document.getElementById(`cat-${cat}`);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(cat);
        },
        { rootMargin: "-40% 0px -55% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [categories]);

  function scrollTo(cat: string) {
    const el = document.getElementById(`cat-${cat}`);
    if (!el) return;
    const offset = 104; // sticky header (48px) + tab bar (~44px) + boşluk
    const top = el.getBoundingClientRect().top + window.scrollY - offset - 12;
    window.scrollTo({ top, behavior: "smooth" });
    setActive(cat);
  }

  // Aktif tab görünür olsun
  useEffect(() => {
    const container = tabsRef.current;
    if (!container) return;
    const activeBtn = container.querySelector(`[data-cat="${active}"]`) as HTMLElement | null;
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [active]);

  return (
    <div
      ref={tabsRef}
      className="sticky top-12 z-30 flex gap-2 overflow-x-auto px-4 py-2 backdrop-blur-md border-b border-gray-100 scrollbar-hide"
      style={{ backgroundColor: bgColor + "dd" }}
    >
      {categories.map((cat) => {
        const isActive = active === cat;
        return (
          <button
            key={cat}
            data-cat={cat}
            onClick={() => scrollTo(cat)}
            className="shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap"
            style={
              isActive
                ? { backgroundColor: primaryColor, color: "#fff" }
                : { backgroundColor: `${primaryColor}18`, color: primaryColor }
            }
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
