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
        { rootMargin: "-10% 0px -75% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [categories]);

  function scrollTo(cat: string) {
    const el = document.getElementById(`cat-${cat}`);
    if (!el) return;
    const tabBarHeight = tabsRef.current?.getBoundingClientRect().height ?? 44;
    el.style.scrollMarginTop = `${48 + tabBarHeight + 8}px`;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(cat);
  }

  // Aktif tab görünür olsun — sadece tab bar'ı yatay scroll et, sayfaya dokunma
  useEffect(() => {
    const container = tabsRef.current;
    if (!container) return;
    const activeBtn = container.querySelector(`[data-cat="${active}"]`) as HTMLElement | null;
    if (activeBtn) {
      const containerRect = container.getBoundingClientRect();
      const btnRect = activeBtn.getBoundingClientRect();
      const scrollLeft =
        container.scrollLeft +
        btnRect.left -
        containerRect.left -
        (containerRect.width - btnRect.width) / 2;
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
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
