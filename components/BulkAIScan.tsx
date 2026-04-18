"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Upload, X, Loader2, Check, ChevronDown, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { compressImage } from "@/lib/compressImage";
import { validateImage } from "@/lib/validateImage";
import { revalidateMenu } from "@/lib/revalidateMenu";
import TagSelector from "./TagSelector";
import IngredientSelector from "./IngredientSelector";
import MenuListPreviewPhone, { type PhoneProduct } from "./MenuListPreviewPhone";

interface ScannedProduct {
  index: number;
  name: string;
  name_en: string;
  description: string;
  category: string;
  price: string;
  calories: string;
  tags: string[];
  ingredients: string[];
  imageFile: File;
  imagePreview: string;
}

interface Props {
  cafeId: string;
  cafeSlug: string;
  existingCategories: string[];
}

export default function BulkAIScan({ cafeId, cafeSlug, existingCategories }: Props) {
  const [files, setFiles] = useState<{ file: File; preview: string }[]>([]);
  const [scanning, setScanning] = useState(false);
  const [products, setProducts] = useState<ScannedProduct[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [newCatInputIndex, setNewCatInputIndex] = useState<number | null>(null);
  const [newCatValue, setNewCatValue] = useState("");
  const [allCategories, setAllCategories] = useState<string[]>(existingCategories);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [existingProducts, setExistingProducts] = useState<PhoneProduct[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase
      .from("products")
      .select("id, name, price, image_url")
      .eq("cafe_id", cafeId)
      .order("position")
      .then(({ data }) => {
        if (data) {
          setExistingProducts(
            data.map((p) => ({ id: p.id, name: p.name, price: p.price, imageUrl: p.image_url ?? undefined }))
          );
        }
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cafeId]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    addFiles(selected);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    addFiles(Array.from(e.dataTransfer.files));
  }

  function addFiles(selected: File[]) {
    setError("");
    const valid: { file: File; preview: string }[] = [];
    for (const f of selected) {
      const err = validateImage(f, "product");
      if (err) { setError(err); continue; }
      valid.push({ file: f, preview: URL.createObjectURL(f) });
    }
    setFiles((prev) => [...prev, ...valid].slice(0, 15));
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleScan() {
    if (files.length === 0) return;
    setScanning(true);
    setError("");
    setProducts([]);

    try {
      const base64Images = await Promise.all(
        files.map(async ({ file }) => {
          const compressed = await compressImage(file, "product");
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve((reader.result as string).split(",")[1]);
            reader.onerror = reject;
            reader.readAsDataURL(compressed);
          });
        })
      );

      const res = await fetch("/api/ai-bulk-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: base64Images }),
      });

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json() as { products: { index: number; name: string; name_en: string; description: string }[] };

      const scanned: ScannedProduct[] = data.products.map((p) => ({
        ...p,
        category: allCategories[0] ?? "",
        price: "",
        calories: "",
        tags: [],
        ingredients: [],
        imageFile: files[p.index].file,
        imagePreview: files[p.index].preview,
      }));

      setProducts(scanned);
      setPreviewIndex(0);
    } catch (err) {
      setError("AI analizi başarısız oldu. Lütfen tekrar deneyin.");
      console.error(err);
    } finally {
      setScanning(false);
    }
  }

  function updateProduct(index: number, field: keyof ScannedProduct, value: string | string[]) {
    setProducts((prev) => prev.map((p, i) => i === index ? { ...p, [field]: value } : p));
    setPreviewIndex(index);
  }

  function handleAddNewCategory(productIndex: number) {
    const trimmed = newCatValue.trim();
    if (!trimmed) return;
    if (!allCategories.includes(trimmed)) setAllCategories((prev) => [...prev, trimmed]);
    updateProduct(productIndex, "category", trimmed);
    setNewCatInputIndex(null);
    setNewCatValue("");
  }

  async function handleSaveAll() {
    const missing = products.findIndex((p) => !p.price || isNaN(parseFloat(p.price)));
    if (missing !== -1) { setError(`${missing + 1}. ürünün fiyatı eksik.`); return; }
    setSaving(true);
    setError("");

    try {
      const inserts = await Promise.all(
        products.map(async (p, i) => {
          const compressed = await compressImage(p.imageFile, "product");
          const path = `${cafeId}/${Date.now()}_${i}.jpg`;
          const { error: uploadErr } = await supabase.storage.from("product-images").upload(path, compressed, { upsert: true });
          if (uploadErr) throw uploadErr;
          const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(path);
          return {
            cafe_id: cafeId,
            name: p.name.trim(),
            name_en: p.name_en.trim(),
            description: p.description.trim(),
            category: p.category.trim() || "Genel",
            price: parseFloat(p.price),
            image_url: urlData.publicUrl,
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
      const newCats = allCategories.filter((c) => !currentOrder.includes(c));
      if (newCats.length > 0) {
        await supabase.from("cafes").update({ category_order: [...currentOrder, ...newCats] }).eq("id", cafeId);
      }

      revalidateMenu(cafeSlug);
      setSaved(true);
      setTimeout(() => { setSaved(false); setFiles([]); setProducts([]); }, 2000);
    } catch (err) {
      setError("Kayıt sırasında hata oluştu. Lütfen tekrar deneyin.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  if (saved) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
          <Check className="w-7 h-7 text-green-500" />
        </div>
        <p className="font-bold text-gray-800">Ürünler kaydedildi!</p>
        <p className="text-sm text-gray-400">Menü sekmesinden görebilirsin.</p>
      </div>
    );
  }

  const scannedPhoneProducts: PhoneProduct[] = products.map((p, i) => ({
    id: `new-${i}`,
    name: p.name,
    price: p.price,
    imageUrl: p.imagePreview,
    isNew: true,
  }));

  const allPhoneProducts: PhoneProduct[] = [...existingProducts, ...scannedPhoneProducts];
  const activePhoneId = products.length > 0 ? `new-${previewIndex}` : null;

  return (
    <>
      {/* Telefon önizleme — sadece geniş ekran */}
      {allPhoneProducts.length > 0 && (
        <div className="hidden xl:block fixed right-8 top-1/2 -translate-y-1/2 z-30">
          <MenuListPreviewPhone
            products={allPhoneProducts}
            activeId={activePhoneId}
          />
        </div>
      )}

      <div className="space-y-6">

        {/* Başlık */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-500" />
            <h2 className="font-bold text-gray-900">Toplu AI Ürün Kaydı</h2>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            Ürün fotoğraflarını yükle, AI her ürün için otomatik <strong>isim ve açıklama</strong> oluştursun.
            <br />
            <span className="text-gray-500">Kategori, fiyat ve detayları sen belirlersin.</span>
          </p>
        </div>

        {/* Upload alanı */}
        {products.length === 0 && (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-200 hover:border-orange-300 rounded-2xl p-8 text-center cursor-pointer transition-colors space-y-3"
          >
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mx-auto">
              <Upload className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <p className="font-semibold text-gray-700">Görselleri sürükle veya tıkla</p>
              <p className="text-xs text-gray-400 mt-1">Maksimum 15 ürün · JPG, PNG, WebP · Her biri max 5 MB</p>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
          </div>
        )}

        {/* Seçilen görseller */}
        {files.length > 0 && products.length === 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {files.map(({ preview }, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => removeFile(i)} className="absolute top-1.5 right-1.5 bg-black/50 rounded-full p-1 hover:bg-black/70 transition-colors">
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button onClick={handleScan} disabled={scanning}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 disabled:opacity-60 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-orange-200">
              {scanning ? <><Loader2 className="w-4 h-4 animate-spin" />AI analiz ediyor…</> : <><Sparkles className="w-4 h-4" />{files.length} Görseli Analiz Et</>}
            </button>
          </div>
        )}

        {/* Sonuç kartları */}
        {products.length > 0 && (
          <div className="space-y-5">
            <p className="text-sm text-gray-500 font-medium">{products.length} ürün analiz edildi — detayları girerek kaydet.</p>

            {products.map((p, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
                onClick={() => setPreviewIndex(i)}>
                <div className="flex gap-4 p-4 min-w-0">
                  {/* Görsel */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.imagePreview} alt="" className="w-full h-full object-cover" />
                  </div>

                  {/* Alanlar */}
                  <div className="flex-1 space-y-2.5 min-w-0">
                    <input value={p.name} onChange={(e) => updateProduct(i, "name", e.target.value)}
                      placeholder="Ürün adı"
                      className="w-full text-sm font-semibold text-gray-900 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-400" />

                    <textarea value={p.description} onChange={(e) => updateProduct(i, "description", e.target.value)}
                      placeholder="Açıklama" rows={2}
                      className="w-full text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-400 resize-none" />

                    <div className="flex gap-2">
                      {/* Kategori */}
                      <div className="flex-1 relative">
                        {newCatInputIndex === i ? (
                          <div className="flex gap-1">
                            <input autoFocus value={newCatValue} onChange={(e) => setNewCatValue(e.target.value)}
                              onKeyDown={(e) => { if (e.key === "Enter") handleAddNewCategory(i); if (e.key === "Escape") { setNewCatInputIndex(null); setNewCatValue(""); } }}
                              placeholder="Yeni kategori"
                              className="flex-1 text-xs bg-gray-50 border border-orange-300 rounded-xl px-3 py-2 focus:outline-none" />
                            <button onClick={() => handleAddNewCategory(i)} className="bg-orange-500 text-white rounded-xl px-2.5 py-2">
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="relative">
                            <select value={p.category}
                              onChange={(e) => { if (e.target.value === "__new__") { setNewCatInputIndex(i); setNewCatValue(""); } else { updateProduct(i, "category", e.target.value); } }}
                              className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 pr-7 focus:outline-none focus:border-orange-400 appearance-none">
                              {allCategories.length === 0 && <option value="">Kategori seç</option>}
                              {allCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                              <option value="__new__">+ Yeni kategori yaz</option>
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                          </div>
                        )}
                      </div>

                      {/* Fiyat */}
                      <input value={p.price} onChange={(e) => updateProduct(i, "price", e.target.value)}
                        placeholder="Fiyat ₺" type="number" min="0"
                        className="w-24 text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-400" />
                    </div>

                    {/* Kalori */}
                    <input value={p.calories} onChange={(e) => updateProduct(i, "calories", e.target.value)}
                      placeholder="Kalori (kcal) — isteğe bağlı" type="number" min="0"
                      className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-400" />

                    {/* Etiketler */}
                    <div className="space-y-1">
                      <p className="text-[10px] text-gray-400 font-medium">Etiketler</p>
                      <TagSelector selected={p.tags} onChange={(v) => updateProduct(i, "tags", v)} />
                    </div>

                    {/* İçerik */}
                    <div className="space-y-1">
                      <p className="text-[10px] text-gray-400 font-medium">İçerik</p>
                      <IngredientSelector selected={p.ingredients} onChange={(v) => updateProduct(i, "ingredients", v)} />
                    </div>
                  </div>
                </div>

                {/* Önizleme göstergesi */}
                {previewIndex === i && (
                  <div className="hidden xl:flex items-center gap-1.5 px-4 py-2 bg-orange-50 border-t border-orange-100">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                    <span className="text-[10px] text-orange-500 font-medium">Sağda önizleniyor</span>
                  </div>
                )}
              </div>
            ))}

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex gap-3">
              <button onClick={() => { setProducts([]); setFiles([]); }}
                className="flex-1 py-3 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors">
                Yeniden Başla
              </button>
              <button onClick={handleSaveAll} disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 disabled:opacity-60 text-white font-bold py-3 rounded-2xl transition-all shadow-lg shadow-orange-200">
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Kaydediliyor…</> : <><Plus className="w-4 h-4" />{products.length} Ürünü Kaydet</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
