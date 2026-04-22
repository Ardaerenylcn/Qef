"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, X, Loader2, Check, ChevronDown, Plus, ImageIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { compressImage } from "@/lib/compressImage";
import { validateImage } from "@/lib/validateImage";
import { revalidateMenu } from "@/lib/revalidateMenu";
import TagSelector from "./TagSelector";
import IngredientSelector from "./IngredientSelector";
import { type PhoneProduct } from "./MenuListPreviewPhone";

interface MenuProduct {
  name: string;
  name_en: string;
  description: string;
  category: string;
  price: string;
  calories: string;
  tags: string[];
  ingredients: string[];
  imageFile?: File;
  imagePreview?: string;
}

interface Props {
  cafeId: string;
  cafeSlug: string;
  allCategories: string[];
  onNewCategory: (cat: string) => void;
  scanCount: number;
  scanLimit: number;
  onScanCountChange: (count: number) => void;
  onPhoneProductsChange: (products: PhoneProduct[], activeId: string | null) => void;
}

export default function MenuPhotoScan({ cafeId, cafeSlug, allCategories, onNewCategory, scanCount, scanLimit, onScanCountChange, onPhoneProductsChange }: Props) {
  const [menuFile, setMenuFile] = useState<{ file: File; preview: string } | null>(null);
  const [scanning, setScanning] = useState(false);
  const [products, setProducts] = useState<MenuProduct[]>([]);
  const [localCategories, setLocalCategories] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [newCatInputIndex, setNewCatInputIndex] = useState<number | null>(null);
  const [newCatValue, setNewCatValue] = useState("");
  const [previewIndex, setPreviewIndex] = useState(0);
  const menuFileRef = useRef<HTMLInputElement>(null);
  const productImageRefs = useRef<(HTMLInputElement | null)[]>([]);
  const supabase = createClient();

  const mergedCategories = [...new Set([...allCategories, ...localCategories])];

  useEffect(() => {
    const phoneProducts: PhoneProduct[] = products.map((p, i) => ({
      id: `menu-${i}`,
      name: p.name,
      price: p.price,
      imageUrl: p.imagePreview,
      category: p.category || "Genel",
      isNew: true,
    }));
    onPhoneProductsChange(phoneProducts, products.length > 0 ? `menu-${previewIndex}` : null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, previewIndex]);

  function handleMenuFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const err = validateImage(file, "product");
    if (err) { setError(err); return; }
    setMenuFile({ file, preview: URL.createObjectURL(file) });
    setError("");
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const err = validateImage(file, "product");
    if (err) { setError(err); return; }
    setMenuFile({ file, preview: URL.createObjectURL(file) });
    setError("");
  }

  function handleProductImage(index: number, file: File) {
    const err = validateImage(file, "product");
    if (err) { setError(err); return; }
    setProducts(prev => prev.map((p, i) => i === index ? { ...p, imageFile: file, imagePreview: URL.createObjectURL(file) } : p));
  }

  async function handleScan() {
    if (!menuFile) return;
    setScanning(true);
    setError("");
    setProducts([]);

    try {
      const compressed = await compressImage(menuFile.file, "asset");
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(compressed);
      });

      const res = await fetch("/api/ai-menu-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
      });

      if (res.status === 429) {
        const data = await res.json() as { limitExceeded?: boolean; scanLimit?: number };
        if (data.limitExceeded) {
          setError(`AI tarama limitine ulaştın (${data.scanLimit} ürün). Destek için bize ulaş.`);
          return;
        }
      }
      if (!res.ok) throw new Error(await res.text());

      const data = await res.json() as {
        products: Omit<MenuProduct, "tags" | "ingredients" | "imageFile" | "imagePreview">[];
        scanCount?: number;
      };

      if (data.scanCount !== undefined) onScanCountChange(data.scanCount);

      const aiCategories = [...new Set(data.products.map(p => p.category).filter(Boolean))];
      setLocalCategories(aiCategories);

      setProducts(data.products.map(p => ({ ...p, tags: [], ingredients: [] })));
    } catch {
      setError("AI analizi başarısız oldu. Lütfen tekrar deneyin.");
    } finally {
      setScanning(false);
    }
  }

  function updateProduct(index: number, field: keyof MenuProduct, value: string | string[]) {
    setProducts(prev => prev.map((p, i) => i === index ? { ...p, [field]: value } : p));
  }

  function handleAddNewCategory(productIndex: number) {
    const trimmed = newCatValue.trim();
    if (!trimmed) return;
    setLocalCategories(prev => prev.includes(trimmed) ? prev : [...prev, trimmed]);
    onNewCategory(trimmed);
    updateProduct(productIndex, "category", trimmed);
    setNewCatInputIndex(null);
    setNewCatValue("");
  }

  async function handleSaveAll() {
    const missing = products.findIndex(p => !p.price || isNaN(parseFloat(p.price)));
    if (missing !== -1) { setError(`${missing + 1}. ürünün fiyatı eksik.`); return; }
    setSaving(true);
    setError("");

    try {
      const inserts = await Promise.all(
        products.map(async (p, i) => {
          let image_url: string | null = null;
          if (p.imageFile) {
            const compressed = await compressImage(p.imageFile, "product");
            const path = `${cafeId}/${Date.now()}_menu_${i}.jpg`;
            const { error: uploadErr } = await supabase.storage.from("product-images").upload(path, compressed, { upsert: true });
            if (uploadErr) throw uploadErr;
            const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(path);
            image_url = urlData.publicUrl;
          }
          return {
            cafe_id: cafeId,
            name: p.name.trim(),
            name_en: p.name_en.trim(),
            description: p.description.trim(),
            category: p.category.trim() || "Genel",
            price: parseFloat(p.price),
            image_url,
            tags: p.tags,
            ingredients: p.ingredients,
            calories: p.calories ? parseInt(p.calories) : null,
            position: 9999 + i,
          };
        })
      );

      const { error: insertErr } = await supabase.from("products").insert(inserts);
      if (insertErr) throw insertErr;

      const { data: cafe } = await supabase.from("cafes").select("category_order").eq("id", cafeId).single();
      const currentOrder: string[] = cafe?.category_order ?? [];
      const newCats = mergedCategories.filter(c => !currentOrder.includes(c));
      if (newCats.length > 0) {
        await supabase.from("cafes").update({ category_order: [...currentOrder, ...newCats] }).eq("id", cafeId);
      }

      revalidateMenu(cafeSlug);
      setSaved(true);
      setTimeout(() => { setSaved(false); setMenuFile(null); setProducts([]); setLocalCategories([]); }, 2000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : JSON.stringify(err);
      setError(`Kayıt hatası: ${msg}`);
    } finally {
      setSaving(false);
    }
  }

  if (saved) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-3">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
          <Check className="w-7 h-7 text-green-500" />
        </div>
        <p className="font-bold text-gray-800">Ürünler kaydedildi!</p>
        <p className="text-sm text-gray-400">Menü sekmesinden görebilirsin.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Upload zone */}
      {products.length === 0 && (
        <>
          <div
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => !menuFile && menuFileRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl transition-colors ${menuFile ? "border-gray-200 p-3" : "border-gray-200 hover:border-orange-300 p-8 text-center cursor-pointer space-y-3"}`}
          >
            {menuFile ? (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={menuFile.preview} alt="" className="w-full max-h-64 object-contain rounded-xl" />
                <button
                  onClick={e => { e.stopPropagation(); setMenuFile(null); }}
                  className="absolute top-2 right-2 bg-black/50 rounded-full p-1 hover:bg-black/70 transition-colors"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mx-auto">
                  <Camera className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-700">Menü fotoğrafını sürükle veya tıkla</p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP · Max 5 MB</p>
                </div>
              </>
            )}
            <input ref={menuFileRef} type="file" accept="image/*" className="hidden" onChange={handleMenuFileChange} />
          </div>

          {menuFile && (
            <>
              {error && <p className="text-sm text-red-500">{error}</p>}
              {scanCount >= scanLimit ? (
                <div className="w-full text-center py-3.5 rounded-2xl bg-red-50 border border-red-200 text-sm font-semibold text-red-500">
                  AI tarama limitine ulaştın — destek için bize ulaş
                </div>
              ) : (
                <button onClick={handleScan} disabled={scanning}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 disabled:opacity-60 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-orange-200">
                  {scanning
                    ? <><Loader2 className="w-4 h-4 animate-spin" />Menü okunuyor…</>
                    : <><Camera className="w-4 h-4" />Menüyü Oku</>}
                </button>
              )}
            </>
          )}
        </>
      )}

      {/* Results */}
      {products.length > 0 && (
        <div className="space-y-5">
          <p className="text-sm text-gray-500 font-medium">
            {products.length} ürün bulundu — düzenleyip kaydet. Görsel eklemek isteğe bağlı.
          </p>

          {products.map((p, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden" onClick={() => setPreviewIndex(i)}>
              <div className="flex gap-4 p-4 min-w-0">
                {/* Optional image */}
                <div
                  className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors border-2 border-dashed border-gray-200"
                  onClick={() => productImageRefs.current[i]?.click()}
                  title="Görsel ekle"
                >
                  {p.imagePreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.imagePreview} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <ImageIcon className="w-5 h-5 text-gray-300" />
                      <span className="text-[9px] text-gray-300 font-medium">Görsel ekle</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={el => { productImageRefs.current[i] = el; }}
                    onChange={e => { const f = e.target.files?.[0]; if (f) handleProductImage(i, f); e.target.value = ""; }}
                  />
                </div>

                {/* Fields */}
                <div className="flex-1 space-y-2.5 min-w-0">
                  <input value={p.name} onChange={e => updateProduct(i, "name", e.target.value)}
                    placeholder="Ürün adı"
                    className="w-full text-sm font-semibold text-gray-900 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-400" />

                  <textarea value={p.description} onChange={e => updateProduct(i, "description", e.target.value)}
                    placeholder="Açıklama" rows={2}
                    className="w-full text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-400 resize-none" />

                  <div className="flex gap-2">
                    {/* Category */}
                    <div className="flex-1 relative">
                      {newCatInputIndex === i ? (
                        <div className="flex gap-1">
                          <input autoFocus value={newCatValue} onChange={e => setNewCatValue(e.target.value)}
                            onKeyDown={e => { if (e.key === "Enter") handleAddNewCategory(i); if (e.key === "Escape") { setNewCatInputIndex(null); setNewCatValue(""); } }}
                            placeholder="Yeni kategori"
                            className="flex-1 text-xs bg-gray-50 border border-orange-300 rounded-xl px-3 py-2 focus:outline-none" />
                          <button onClick={() => handleAddNewCategory(i)} className="bg-orange-500 text-white rounded-xl px-2.5 py-2">
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="relative">
                          <select
                            value={p.category}
                            onChange={e => { if (e.target.value === "__new__") { setNewCatInputIndex(i); setNewCatValue(""); } else { updateProduct(i, "category", e.target.value); } }}
                            className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 pr-7 focus:outline-none focus:border-orange-400 appearance-none">
                            {p.category && !mergedCategories.includes(p.category) && (
                              <option value={p.category}>{p.category}</option>
                            )}
                            {mergedCategories.length === 0 && <option value="">Kategori seç</option>}
                            {mergedCategories.map(c => <option key={c} value={c}>{c}</option>)}
                            <option value="__new__">+ Yeni kategori yaz</option>
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                        </div>
                      )}
                    </div>

                    {/* Price */}
                    <input value={p.price} onChange={e => updateProduct(i, "price", e.target.value)}
                      placeholder="Fiyat ₺" type="number" min="0"
                      className="w-24 text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-400" />
                  </div>

                  {/* Calories */}
                  <input value={p.calories} onChange={e => updateProduct(i, "calories", e.target.value)}
                    placeholder="Kalori (kcal) — isteğe bağlı" type="number" min="0"
                    className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-400" />

                  {/* Tags */}
                  <div className="space-y-1">
                    <p className="text-[10px] text-gray-400 font-medium">Etiketler</p>
                    <TagSelector selected={p.tags} onChange={v => updateProduct(i, "tags", v)} />
                  </div>

                  {/* Ingredients */}
                  <div className="space-y-1">
                    <p className="text-[10px] text-gray-400 font-medium">İçerik</p>
                    <IngredientSelector selected={p.ingredients} onChange={v => updateProduct(i, "ingredients", v)} />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-3">
            <button onClick={() => { setProducts([]); setMenuFile(null); setLocalCategories([]); }}
              className="flex-1 py-3 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors">
              Yeniden Başla
            </button>
            <button onClick={handleSaveAll} disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 disabled:opacity-60 text-white font-bold py-3 rounded-2xl transition-all shadow-lg shadow-orange-200">
              {saving
                ? <><Loader2 className="w-4 h-4 animate-spin" />Kaydediliyor…</>
                : <><Plus className="w-4 h-4" />{products.length} Ürünü Kaydet</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
