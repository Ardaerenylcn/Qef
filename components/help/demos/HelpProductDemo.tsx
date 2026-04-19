"use client";

import { useState, useEffect } from "react";
import MenuListPreviewPhone, { PhoneProduct } from "@/components/MenuListPreviewPhone";

const DEMO_PRODUCTS: PhoneProduct[] = [
  { id: "1", name: "Türk Kahvesi", price: "45", category: "Kahveler", imageUrl: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=160&q=75" },
  { id: "2", name: "Sütlü Latte", price: "65", category: "Kahveler", imageUrl: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=160&q=75" },
  { id: "3", name: "Soğuk Brew", price: "70", category: "Soğuk İçecekler", imageUrl: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=160&q=75" },
  { id: "4", name: "Cheesecake", price: "85", category: "Tatlılar", imageUrl: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=160&q=75" },
  { id: "5", name: "Waffle", price: "90", category: "Tatlılar", imageUrl: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=160&q=75" },
  { id: "6", name: "Granola Kase", price: "75", category: "Tatlılar", imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=160&q=75" },
];

const IDS = DEMO_PRODUCTS.map((p) => p.id as string);

export default function HelpProductDemo() {
  const [activeId, setActiveId] = useState<string>(IDS[0]);

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i = (i + 1) % IDS.length;
      setActiveId(IDS[i]);
    }, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex justify-center py-2">
      <div style={{ transform: "scale(1.1)", transformOrigin: "top center" }}>
        <MenuListPreviewPhone
          products={DEMO_PRODUCTS}
          categories={["Kahveler", "Soğuk İçecekler", "Tatlılar"]}
          activeId={activeId}
        />
      </div>
    </div>
  );
}
