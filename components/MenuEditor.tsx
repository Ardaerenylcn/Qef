"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, UtensilsCrossed, Save, Loader2, Link2, ImagePlus, X, ChevronDown, MapPin, ExternalLink } from "lucide-react";
import Image from "next/image";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableCategoryBlock } from "./SortableCategoryBlock";
import EditProductModal from "./EditProductModal";
import TagSelector from "./TagSelector";
import BulkPriceUpdate from "./BulkPriceUpdate";
import { createClient } from "@/lib/supabase/client";
import type { Product, OpeningHour } from "@/types/menu";
import { DEFAULT_HOURS } from "@/types/menu";
import { validateImage } from "@/lib/validateImage";
import { compressImage } from "@/lib/compressImage";
import OpeningHoursEditor from "./OpeningHoursEditor";

interface Cafe {
  id: string;
  name: string;
  name_en: string;
  description: string;
  description_en: string;
  slug: string;
  category_order: string[];
  opening_hours: OpeningHour[];
  address: string;
  maps_url: string;
}

export default function MenuEditor() {
  const [cafe, setCafe] = useState<Cafe | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [cafeName, setCafeName] = useState("");
  const [cafeNameEn, setCafeNameEn] = useState("");
  const [cafeDesc, setCafeDesc] = useState("");
  const [cafeDescEn, setCafeDescEn] = useState("");
  const [cafeSlug, setCafeSlug] = useState("");
  const [slugAutoMode, setSlugAutoMode] = useState(true);
  const [slugError, setSlugError] = useState("");
  const [savingCafe, setSavingCafe] = useState(false);
  const [showCafeEn, setShowCafeEn] = useState(false);
  const [openingHours, setOpeningHours] = useState<OpeningHour[]>(DEFAULT_HOURS);
  const [address, setAddress] = useState("");
  const [mapsUrl, setMapsUrl] = useState("");
  const [showHours, setShowHours] = useState(false);

  const [name, setName] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [productTags, setProductTags] = useState<string[]>([]);
  const [showProductEn, setShowProductEn] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const router = useRouter();
  const supabase = createClient();
  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let { data: cafeData } = await supabase
        .from("cafes")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!cafeData) {
        const { data: newCafe } = await supabase
          .from("cafes")
          .insert({ user_id: user.id, name: "Kafem", slug: user.id, category_order: [] })
          .select()
          .single();
        cafeData = newCafe;
      }

      if (cafeData) {
        setCafe(cafeData);
        setCafeName(cafeData.name);
        setCafeNameEn(cafeData.name_en ?? "");
        setCafeDesc(cafeData.description);
        setCafeDescEn(cafeData.description_en ?? "");
        // Slug UUID ise (yeni kullanıcı varsayılanı) auto-mode'da tut
        const isUuidSlug = /^[0-9a-f-]{36}$/.test(cafeData.slug);
        setSlugAutoMode(isUuidSlug || !cafeData.slug);
        setCafeSlug(isUuidSlug ? "" : (cafeData.slug ?? ""));
        setOpeningHours(cafeData.opening_hours?.length ? cafeData.opening_hours : DEFAULT_HOURS);
        setAddress(cafeData.address ?? "");
        setMapsUrl(cafeData.maps_url ?? "");

        const { data: productData } = await supabase
          .from("products")
          .select("*")
          .eq("cafe_id", cafeData.id)
          .order("position", { ascending: true });

        const prods = productData ?? [];
        setProducts(prods);
        setCategories(buildCategoryOrder(cafeData.category_order ?? [], prods));
      }

      setLoading(false);
    }
    load();
  }, []);

  function generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/ı/g, "i").replace(/İ/g, "i")
      .replace(/ş/g, "s").replace(/Ş/g, "s")
      .replace(/ğ/g, "g").replace(/Ğ/g, "g")
      .replace(/ü/g, "u").replace(/Ü/g, "u")
      .replace(/ö/g, "o").replace(/Ö/g, "o")
      .replace(/ç/g, "c").replace(/Ç/g, "c")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function handleCafeNameChange(value: string) {
    setCafeName(value);
    if (slugAutoMode) {
      setCafeSlug(generateSlug(value));
    }
  }

  function buildCategoryOrder(order: string[], prods: Product[]): string[] {
    const fromProducts = [...new Set(prods.map((p) => p.category || "Genel"))];
    const merged = [...order.filter((c) => fromProducts.includes(c))];
    fromProducts.forEach((c) => { if (!merged.includes(c)) merged.push(c); });
    return merged;
  }

  // --- Kafe kaydet ---
  async function handleSaveCafe() {
    if (!cafe) return;
    setSlugError("");
    const newSlug = cafeSlug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");
    if (!newSlug) { setSlugError("Geçerli bir URL gir."); return; }

    const RESERVED = new Set(["api", "admin", "auth", "superadmin", "login", "register", "forgot-password", "reset-password", "blog", "privacy", "terms", "sitemap", "robots", "favicon", "ads"]);
    if (RESERVED.has(newSlug)) { setSlugError("Bu URL kullanılamaz."); return; }

    if (newSlug !== cafe.slug) {
      const { data: existing } = await supabase
        .from("cafes").select("id").eq("slug", newSlug).single();
      if (existing) { setSlugError("Bu URL başkası tarafından kullanılıyor."); return; }
    }

    setSavingCafe(true);
    const { data } = await supabase
      .from("cafes")
      .update({
        name: cafeName.trim() || "Kafem",
        name_en: cafeNameEn.trim(),
        description: cafeDesc.trim(),
        description_en: cafeDescEn.trim(),
        slug: newSlug,
        opening_hours: openingHours,
        address: address.trim(),
        maps_url: mapsUrl.trim(),
      })
      .eq("id", cafe.id).select().single();
    if (data) { setCafe(data); setCafeSlug(data.slug); router.refresh(); }
    setSavingCafe(false);
  }

  // --- Görsel ---
  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const err = validateImage(file, "product");
    if (err) { setError(err); e.target.value = ""; return; }
    const compressed = await compressImage(file, "product");
    setImageFile(compressed);
    setImagePreview(URL.createObjectURL(compressed));
  }

  function clearImage() { setImageFile(null); setImagePreview(""); }

  // --- Ürün ekle ---
  async function handleAdd() {
    if (!cafe) return;
    if (!name.trim()) { setError("Ürün adı boş bırakılamaz."); return; }
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) { setError("Geçerli bir fiyat gir."); return; }

    setAdding(true);

    let image_url = "";
    if (imageFile) {
      const mimeToExt: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif" };
      const ext = mimeToExt[imageFile.type] ?? "jpg";
      const path = `${cafe.id}/${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("product-images").upload(path, imageFile);
      if (uploadError) { setError("Görsel yüklenemedi."); setAdding(false); return; }
      const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(path);
      image_url = urlData.publicUrl;
    }

    const cat = category.trim() || "Genel";
    const catProducts = products.filter((p) => (p.category || "Genel") === cat);
    const position = catProducts.length;

    const { data, error: err } = await supabase
      .from("products")
      .insert({ cafe_id: cafe.id, name: name.trim(), name_en: nameEn.trim(), price: parsedPrice, category: cat, description: description.trim(), description_en: descriptionEn.trim(), image_url, position, tags: productTags })
      .select().single();

    if (err) { setError("Ürün eklenemedi. Lütfen tekrar deneyin."); }
    else if (data) {
      const newProducts = [...products, data];
      setProducts(newProducts);
      const newCats = buildCategoryOrder(cafe.category_order ?? [], newProducts);
      setCategories(newCats);
      setName(""); setNameEn(""); setPrice(""); setCategory("");
      setDescription(""); setDescriptionEn("");
      setProductTags([]);
      clearImage(); setError("");
    }
    setAdding(false);
  }

  // --- Ürün güncelle ---
  function handleProductSaved(updated: Product) {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  }

  // --- Ürün sil ---
  async function handleDelete(id: string) {
    await supabase.from("products").delete().eq("id", id);
    const newProducts = products.filter((p) => p.id !== id);
    setProducts(newProducts);
    setCategories(buildCategoryOrder(cafe?.category_order ?? [], newProducts));
  }

  // --- Ürün sırası değişti ---
  async function handleProductReorder(cat: string, newOrder: Product[]) {
    const reordered = newOrder.map((p, i) => ({ ...p, position: i }));
    // Diğer kategorilerin ürünlerini koru, bu kategorinin sırasını güncelle
    const otherProds = products.filter((p) => (p.category || "Genel") !== cat);
    setProducts([...otherProds, ...reordered]);

    await Promise.all(
      reordered.map((p) =>
        supabase.from("products").update({ position: p.position }).eq("id", p.id)
      )
    );
  }

  // --- Stok durumu değiştir ---
  async function handleToggleStock(id: string, inStock: boolean) {
    await supabase.from("products").update({ in_stock: inStock }).eq("id", id);
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, in_stock: inStock } : p));
  }

  // --- Kategori sırası değişti ---
  async function handleCategoryDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id || !cafe) return;

    const oldIndex = categories.indexOf(active.id as string);
    const newIndex = categories.indexOf(over.id as string);
    const newCats = [...categories];
    const [moved] = newCats.splice(oldIndex, 1);
    newCats.splice(newIndex, 0, moved);
    setCategories(newCats);

    const { data } = await supabase
      .from("cafes")
      .update({ category_order: newCats })
      .eq("id", cafe.id).select().single();
    if (data) setCafe(data);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleAdd();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-300 gap-2">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Yükleniyor...</span>
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
    <>
    <div className="space-y-6">
      {/* Kafe Bilgileri */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-3">
        <h2 className="font-semibold text-gray-700">Kafe bilgileri</h2>
        <input type="text" placeholder="Kafe adı" value={cafeName}
          onChange={(e) => handleCafeNameChange(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
        <input type="text" placeholder="Kısa açıklama (isteğe bağlı)" value={cafeDesc}
          onChange={(e) => setCafeDesc(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />

        {/* İngilizce alanlar */}
        <button type="button" onClick={() => setShowCafeEn((v) => !v)}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-orange-400 transition-colors">
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showCafeEn ? "rotate-180" : ""}`} />
          İngilizce çeviri {showCafeEn ? "gizle" : "ekle"}
        </button>
        {showCafeEn && (
          <div className="space-y-2 border-l-2 border-orange-100 pl-3">
            <input type="text" placeholder="Cafe name (EN)" value={cafeNameEn}
              onChange={(e) => setCafeNameEn(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
            <input type="text" placeholder="Short description (EN)" value={cafeDescEn}
              onChange={(e) => setCafeDescEn(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
          </div>
        )}
        <div className="space-y-1.5">
          <label className="text-xs text-gray-500 font-medium">Menü URL'i</label>
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-orange-300">
            <span className="bg-gray-50 text-gray-400 text-xs px-3 py-2.5 border-r border-gray-200 shrink-0">/menu/</span>
            <input type="text" value={cafeSlug}
              onChange={(e) => { setCafeSlug(e.target.value); setSlugAutoMode(false); }}
              placeholder="kafe-adiniz"
              className="flex-1 px-3 py-2 text-sm focus:outline-none" />
          </div>
          {slugError && <p className="text-xs text-red-400">{slugError}</p>}
          {cafeSlug && !slugError && (
            <div className="flex flex-col gap-0.5">
              <p className="text-xs text-gray-400">Müşterileriniz bu link üzerinden menüye erişebilecek:</p>
              {cafe?.slug === cafeSlug && !/^[0-9a-f-]{36}$/.test(cafe.slug) ? (
                <a href={`/menu/${cafe.slug}`} target="_blank"
                  className="flex items-center gap-1 text-xs text-orange-400 hover:underline font-medium">
                  <Link2 className="w-3 h-3" />
                  {typeof window !== "undefined" ? window.location.host : ""}/menu/{cafe.slug}
                </a>
              ) : (
                <p className="flex items-center gap-1 text-xs text-gray-300 italic">
                  <Link2 className="w-3 h-3" />
                  {typeof window !== "undefined" ? window.location.host : ""}/menu/{cafeSlug}
                  <span className="text-orange-300 not-italic">(kaydet butonuna bas)</span>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Adres */}
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input type="text" placeholder="Adres (isteğe bağlı)" value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
        </div>

        {/* Google Maps URL */}
        <div className="relative">
          <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input type="text" placeholder="Google Maps linki (isteğe bağlı)" value={mapsUrl}
            onChange={(e) => setMapsUrl(e.target.value)}
            className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
        </div>

        {/* Çalışma Saatleri */}
        <button type="button" onClick={() => setShowHours((v) => !v)}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-orange-400 transition-colors">
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showHours ? "rotate-180" : ""}`} />
          Çalışma saatleri {showHours ? "gizle" : "düzenle"}
        </button>
        {showHours && (
          <div className="border-l-2 border-orange-100 pl-3">
            <OpeningHoursEditor value={openingHours} onChange={setOpeningHours} />
          </div>
        )}

        <button onClick={handleSaveCafe} disabled={savingCafe}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          {savingCafe ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Kaydet
        </button>
      </div>

      {/* Ürün Ekleme Formu */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <h2 className="font-semibold text-gray-700">Yeni ürün ekle</h2>
        <div className="space-y-3">
          <input type="text" placeholder="Ürün adı (ör. Türk Kahvesi)" value={name}
            onChange={(e) => setName(e.target.value)} onKeyDown={handleKeyDown}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
          <input type="text" placeholder="Açıklama (isteğe bağlı)" value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />

          {/* İngilizce ürün alanları */}
          <button type="button" onClick={() => setShowProductEn((v) => !v)}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-orange-400 transition-colors">
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showProductEn ? "rotate-180" : ""}`} />
            İngilizce çeviri {showProductEn ? "gizle" : "ekle"}
          </button>
          {showProductEn && (
            <div className="space-y-2 border-l-2 border-orange-100 pl-3">
              <input type="text" placeholder="Product name (EN)" value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
              <input type="text" placeholder="Description (EN)" value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
            </div>
          )}

          <div className="flex gap-2">
            <input type="number" placeholder="Fiyat (₺)" value={price}
              onChange={(e) => setPrice(e.target.value)} onKeyDown={handleKeyDown}
              min={0} step={0.5}
              className="w-1/2 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
            <input type="text" placeholder="Kategori" value={category}
              onChange={(e) => setCategory(e.target.value)} onKeyDown={handleKeyDown}
              className="w-1/2 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
          </div>

          {/* Etiketler */}
          <div className="space-y-1.5">
            <p className="text-xs text-gray-400 font-medium">Etiketler</p>
            <TagSelector selected={productTags} onChange={setProductTags} />
          </div>
          {imagePreview ? (
            <div className="relative w-24 h-24">
              <Image src={imagePreview} alt="Önizleme" width={96} height={96}
                className="w-24 h-24 rounded-xl object-cover border border-gray-200" />
              <button onClick={clearImage}
                className="absolute -top-2 -right-2 bg-white border border-gray-200 rounded-full p-0.5 text-gray-400 hover:text-red-400 transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center gap-2 w-full py-5 rounded-xl border-2 border-dashed border-gray-200 cursor-pointer text-gray-400 hover:border-orange-400 hover:text-orange-400 hover:bg-orange-50 transition-all">
              <ImagePlus className="w-6 h-6" />
              <span className="text-sm font-medium">Görsel Ekle</span>
              <span className="text-xs text-gray-300">JPEG, PNG, WebP · Maks 8MB</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          )}
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button onClick={handleAdd} disabled={adding}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
          Ekle
        </button>
      </div>

      {/* Ürün Listesi — sürükle bırak */}
      <div className="space-y-4">
        {categories.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12 text-gray-300">
            <UtensilsCrossed className="w-10 h-10" />
            <p className="text-sm">Henüz ürün eklenmedi.</p>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleCategoryDragEnd}>
            <SortableContext items={categories} strategy={verticalListSortingStrategy}>
              <div className="space-y-6">
                {categories.map((cat) => (
                  <SortableCategoryBlock
                    key={cat}
                    category={cat}
                    products={grouped[cat] ?? []}
                    onDeleteProduct={handleDelete}
                    onEditProduct={setEditingProduct}
                    onProductReorder={handleProductReorder}
                    onToggleStock={handleToggleStock}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>

    {/* Toplu Fiyat Güncelleme */}
    {categories.length > 0 && (
      <BulkPriceUpdate
        categories={categories}
        products={products}
        onUpdate={(updated) => setProducts((prev) =>
          prev.map((p) => updated.find((u) => u.id === p.id) ?? p)
        )}
      />
    )}

    {/* Düzenleme modalı */}
    {editingProduct && cafe && (
      <EditProductModal
        product={editingProduct}
        cafeId={cafe.id}
        onClose={() => setEditingProduct(null)}
        onSave={handleProductSaved}
      />
    )}
    </>
  );
}
