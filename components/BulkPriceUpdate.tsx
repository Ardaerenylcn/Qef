"use client";

import { useState } from "react";
import { Loader2, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/types/menu";

interface Props {
  categories: string[];
  products: Product[];
  onUpdate: (updated: Product[]) => void;
}

export default function BulkPriceUpdate({ categories, products, onUpdate }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState("__all__");
  const [percent, setPercent] = useState("");
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleApply() {
    const pct = parseFloat(percent);
    if (isNaN(pct) || pct === 0) { setError("Geçerli bir yüzde gir."); return; }
    if (Math.abs(pct) > 100) { setError("Yüzde 100'den fazla olamaz."); return; }

    setError(""); setSuccess(""); setApplying(true);

    const targets = selectedCat === "__all__"
      ? products
      : products.filter((p) => (p.category || "Genel") === selectedCat);

    const supabase = createClient();
    const updated: Product[] = [];

    await Promise.all(targets.map(async (p) => {
      const newPrice = Math.max(0, Math.round(p.price * (1 + pct / 100) * 100) / 100);
      const { data } = await supabase
        .from("products")
        .update({ price: newPrice })
        .eq("id", p.id)
        .select()
        .single();
      if (data) updated.push(data);
    }));

    onUpdate(updated);
    setSuccess(`${targets.length} ürün güncellendi.`);
    setPercent("");
    setApplying(false);
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <button
        onClick={() => { setOpen((v) => !v); setError(""); setSuccess(""); }}
        className="w-full flex items-center justify-between px-6 py-4 text-left"
      >
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-orange-400" />
          <span className="font-semibold text-gray-700 text-sm">Toplu Fiyat Güncelleme</span>
        </div>
        <span className="text-xs text-gray-400">{open ? "Gizle" : "Göster"}</span>
      </button>

      {open && (
        <div className="px-6 pb-6 space-y-3 border-t border-gray-100 pt-4">
          <div className="flex gap-2">
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
            >
              <option value="__all__">Tüm kategoriler</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <div className="relative w-36">
              <input
                type="number"
                placeholder="% oran"
                value={percent}
                onChange={(e) => setPercent(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">%</span>
            </div>
          </div>
          <p className="text-xs text-gray-400">
            Pozitif değer = zam, negatif değer = indirim. Örn: 10 → %10 zam, -5 → %5 indirim.
          </p>
          {error && <p className="text-sm text-red-400">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}
          <button
            onClick={handleApply}
            disabled={applying || !percent}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            {applying ? <Loader2 className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4" />}
            Uygula
          </button>
        </div>
      )}
    </div>
  );
}
