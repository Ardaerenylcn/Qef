"use client";

import { useEffect, useState } from "react";
import { UtensilsCrossed, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/types/menu";

interface Cafe {
  id: string;
  name: string;
  description: string;
}

export default function MenuView() {
  const [cafe, setCafe] = useState<Cafe | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data: cafeData } = await supabase
        .from("cafes")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (cafeData) {
        setCafe(cafeData);
        const { data: productData } = await supabase
          .from("products")
          .select("*")
          .eq("cafe_id", cafeData.id)
          .order("created_at", { ascending: true });
        setProducts(productData ?? []);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-300 gap-2">
        <Loader2 className="w-5 h-5 animate-spin" />
      </div>
    );
  }

  const grouped = products.reduce<Record<string, Product[]>>((acc, p) => {
    const key = p.category || "Genel";
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {});

  return (
    <div className="max-w-md mx-auto px-4 py-10 space-y-8">
      {/* Kafe başlığı */}
      <div className="text-center space-y-1 border-b border-gray-100 pb-8">
        <div className="inline-flex items-center justify-center bg-orange-100 rounded-full w-14 h-14 mb-3">
          <UtensilsCrossed className="w-7 h-7 text-orange-500" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {cafe?.name ?? "Menü"}
        </h1>
        {cafe?.description && (
          <p className="text-gray-400 text-sm">{cafe.description}</p>
        )}
      </div>

      {/* Menü içeriği */}
      {products.length === 0 ? (
        <div className="text-center py-16 text-gray-300 space-y-2">
          <UtensilsCrossed className="w-10 h-10 mx-auto" />
          <p className="text-sm">Menü henüz hazır değil.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([cat, items]) => (
            <section key={cat}>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-orange-400">{cat}</h2>
                <div className="flex-1 h-px bg-orange-100" />
              </div>
              <div className="space-y-3">
                {items.map((product) => (
                  <div key={product.id} className="flex justify-between items-baseline">
                    <span className="text-gray-800 font-medium">{product.name}</span>
                    <span className="text-orange-500 font-semibold ml-4 shrink-0">
                      {Number(product.price).toFixed(2)} ₺
                    </span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <p className="text-center text-xs text-gray-200 pt-4">Qef ile oluşturuldu</p>
    </div>
  );
}
