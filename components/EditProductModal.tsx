"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Save, Loader2, ImagePlus, ChevronDown, Box, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/types/menu";
import TagSelector from "./TagSelector";
import IngredientSelector from "./IngredientSelector";
import { validateImage } from "@/lib/validateImage";
import { compressImage } from "@/lib/compressImage";

interface Props {
  product: Product;
  cafeId: string;
  categories: string[];
  onClose: () => void;
  onSave: (updated: Product) => void;
}

export default function EditProductModal({ product, cafeId, categories, onClose, onSave }: Props) {
  const [name, setName] = useState(product.name);
  const [nameEn, setNameEn] = useState(product.name_en ?? "");
  const [price, setPrice] = useState(String(product.price));
  const [category, setCategory] = useState(product.category);
  const [description, setDescription] = useState(product.description ?? "");
  const [descriptionEn, setDescriptionEn] = useState(product.description_en ?? "");
  const [tags, setTags] = useState<string[]>(product.tags ?? []);
  const [ingredients, setIngredients] = useState<string[]>(product.ingredients ?? []);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(product.image_url ?? "");
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [modelUrl, setModelUrl] = useState(product.model_url ?? "");
  const [showEn, setShowEn] = useState(!!(product.name_en || product.description_en));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const supabase = createClient();

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const err = validateImage(file, "product");
    if (err) { setError(err); e.target.value = ""; return; }
    const compressed = await compressImage(file, "product");
    setImageFile(compressed);
    setImagePreview(URL.createObjectURL(compressed));
  }

  async function handleSave() {
    if (!name.trim()) { setError("Ürün adı boş bırakılamaz."); return; }
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) { setError("Geçerli bir fiyat gir."); return; }

    setSaving(true);

    let image_url = product.image_url;
    if (imageFile) {
      const mimeToExt: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif" };
      const ext = mimeToExt[imageFile.type] ?? "jpg";
      const path = `${cafeId}/${product.id}.${ext}`;
      await supabase.storage.from("product-images").upload(path, imageFile, { upsert: true });
      const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(path);
      image_url = `${urlData.publicUrl}?t=${Date.now()}`;
    }

    let finalModelUrl = modelUrl;
    if (modelFile) {
      const path = `${cafeId}/${product.id}.glb`;
      await supabase.storage.from("models").upload(path, modelFile, { upsert: true });
      const { data: urlData } = supabase.storage.from("models").getPublicUrl(path);
      finalModelUrl = urlData.publicUrl;
    }

    const updates = {
      name: name.trim(),
      name_en: nameEn.trim(),
      price: parsedPrice,
      category: category.trim() || "Genel",
      description: description.trim(),
      description_en: descriptionEn.trim(),
      image_url,
      tags,
      ingredients,
      model_url: finalModelUrl || null,
    };

    const { data, error: err } = await supabase
      .from("products")
      .update(updates)
      .eq("id", product.id)
      .select()
      .single();

    if (err) { setError("Ürün güncellenemedi. Lütfen tekrar deneyin."); setSaving(false); return; }
    if (data) onSave(data);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 px-0 sm:px-4"
      onClick={onClose}>
      <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>

        {/* Başlık */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
          <h2 className="font-semibold text-gray-800">Ürünü Düzenle</h2>
          <button onClick={onClose} className="text-gray-300 hover:text-gray-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-4 space-y-3">
          <input type="text" placeholder="Ürün adı" value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
          <input type="text" placeholder="Açıklama (isteğe bağlı)" value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
          <div className="flex gap-2">
            <input type="number" placeholder="Fiyat (₺)" value={price}
              onChange={(e) => setPrice(e.target.value)}
              min={0} step={0.5}
              className="w-1/2 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className="w-1/2 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white">
              <option value="">Kategori seç</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              {/* Mevcut kategori listede yoksa göster */}
              {category && !categories.includes(category) && (
                <option value={category}>{category}</option>
              )}
            </select>
          </div>

          {/* Etiketler */}
          <div className="space-y-1.5">
            <p className="text-xs text-gray-400 font-medium">Etiketler</p>
            <TagSelector selected={tags} onChange={setTags} />
          </div>

          {/* İçerik */}
          <div className="space-y-1.5">
            <p className="text-xs text-gray-400 font-medium">İçerik</p>
            <IngredientSelector selected={ingredients} onChange={setIngredients} />
          </div>

          {/* İngilizce */}
          <button type="button" onClick={() => setShowEn((v) => !v)}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-orange-400 transition-colors">
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showEn ? "rotate-180" : ""}`} />
            İngilizce çeviri {showEn ? "gizle" : "ekle"}
          </button>
          {showEn && (
            <div className="space-y-2 border-l-2 border-orange-100 pl-3">
              <input type="text" placeholder="Product name (EN)" value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
              <input type="text" placeholder="Description (EN)" value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
            </div>
          )}

          {/* AR Model */}
          <div className="space-y-1.5">
            <p className="text-xs text-gray-400 font-medium">AR Modeli</p>
            <div className="border border-dashed border-gray-200 rounded-xl p-3 space-y-2">
              {modelUrl ? (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                    <Box className="w-4 h-4 text-orange-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-700">AR modeli mevcut ✓</p>
                    <label className="text-[10px] text-orange-400 hover:underline cursor-pointer">
                      Modeli değiştir (.glb)
                      <input type="file" accept=".glb" className="hidden"
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) setModelFile(f); }} />
                    </label>
                  </div>
                  <button onClick={() => { setModelUrl(""); setModelFile(null); }}
                    className="text-gray-300 hover:text-red-400 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-400 hover:text-orange-400 transition-colors">
                  <Box className="w-4 h-4" />
                  {modelFile ? modelFile.name : "3D model yükle (.glb)"}
                  <input type="file" accept=".glb" className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) setModelFile(f); }} />
                </label>
              )}
              <button disabled
                className="w-full flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-lg bg-gray-50 text-gray-300 cursor-not-allowed">
                <Sparkles className="w-3.5 h-3.5" />
                AI ile Otomatik Oluştur — Yakında
              </button>
            </div>
          </div>

          {/* Görsel */}
          <div>
            {imagePreview ? (
              <div className="flex items-center gap-3">
                <Image src={imagePreview} alt="Görsel" width={64} height={64}
                  className="w-16 h-16 rounded-xl object-cover border border-gray-200" />
                <label className="text-xs text-orange-400 hover:underline cursor-pointer">
                  Görseli değiştir
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              </div>
            ) : (
              <label className="flex items-center gap-2 w-fit cursor-pointer text-sm text-gray-400 hover:text-orange-400 transition-colors">
                <ImagePlus className="w-4 h-4" />
                Görsel ekle
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            )}
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 sticky bottom-0 bg-white">
          <button onClick={handleSave} disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}
