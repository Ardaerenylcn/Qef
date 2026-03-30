"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Save, Loader2, ImagePlus, X, Wifi, Instagram, Link, Megaphone } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_THEME, FONTS, type CafeTheme } from "@/types/theme";
import { validateImage } from "@/lib/validateImage";
import { compressImage } from "@/lib/compressImage";

export default function ThemeEditor() {
  const [cafeId, setCafeId] = useState<string | null>(null);
  const [theme, setTheme] = useState<CafeTheme>(DEFAULT_THEME);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState("");

  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: cafe } = await supabase
        .from("cafes")
        .select("id, theme")
        .eq("user_id", user.id)
        .single();

      if (cafe) {
        setCafeId(cafe.id);
        setTheme({ ...DEFAULT_THEME, ...(cafe.theme ?? {}) });
      }
      setLoading(false);
    }
    load();
  }, []);

  function update<K extends keyof CafeTheme>(key: K, value: CafeTheme[K]) {
    setTheme((prev) => ({ ...prev, [key]: value }));
  }

  async function uploadAsset(file: File, path: string): Promise<string> {
    const { error } = await supabase.storage.from("cafe-assets").upload(path, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from("cafe-assets").getPublicUrl(path);
    // Cache-busting: aynı URL tarayıcıda önbelleklenmesini önler
    return `${data.publicUrl}?t=${Date.now()}`;
  }

  async function handleSave() {
    if (!cafeId) return;
    setSaving(true);
    setError("");

    try {
      let newTheme = { ...theme };

      if (logoFile) {
        newTheme.logoUrl = await uploadAsset(logoFile, `${cafeId}/logo`);
        setLogoFile(null);
      }
      if (coverFile) {
        newTheme.coverUrl = await uploadAsset(coverFile, `${cafeId}/cover`);
        setCoverFile(null);
      }
      if (bannerFile) {
        newTheme.bannerUrl = await uploadAsset(bannerFile, `${cafeId}/banner`);
        setBannerFile(null);
      }

      const { error: dbErr } = await supabase.from("cafes").update({ theme: newTheme }).eq("id", cafeId);
      if (dbErr) throw dbErr;

      setTheme(newTheme);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: unknown) {
      setError("Tema kaydedilemedi. Lütfen tekrar deneyin.");
    } finally {
      setSaving(false);
    }
  }

  async function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>,
    type: "logo" | "cover" | "banner"
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    const err = validateImage(file, "asset");
    if (err) { setError(err); e.target.value = ""; return; }
    const compressed = await compressImage(file, "asset");
    const preview = URL.createObjectURL(compressed);
    if (type === "logo") { setLogoFile(compressed); setLogoPreview(preview); }
    else if (type === "cover") { setCoverFile(compressed); setCoverPreview(preview); }
    else { setBannerFile(compressed); setBannerPreview(preview); }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-300 gap-2">
        <Loader2 className="w-5 h-5 animate-spin" />
      </div>
    );
  }

  const logoSrc = logoPreview || theme.logoUrl;
  const coverSrc = coverPreview || theme.coverUrl;
  const bannerSrc = bannerPreview || theme.bannerUrl;

  return (
    <div className="space-y-5">

      {/* Renkler */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-700">Renkler</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Ana Renk", key: "primaryColor" as const },
            { label: "Arkaplan", key: "bgColor" as const },
            { label: "Metin",    key: "textColor" as const },
          ].map(({ label, key }) => (
            <div key={key} className="space-y-2">
              <label className="text-xs text-gray-400 font-medium">{label}</label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
                <input
                  type="color"
                  value={theme[key]}
                  onChange={(e) => update(key, e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                />
                <span className="text-xs text-gray-500 font-mono">{theme[key]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Font */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-700">Yazı Tipi</h2>
        <div className="grid grid-cols-3 gap-3">
          {(Object.entries(FONTS) as [CafeTheme["font"], { label: string; css: string }][]).map(
            ([key, { label, css }]) => (
              <button
                key={key}
                onClick={() => update("font", key)}
                className={`py-3 px-4 rounded-xl border-2 text-sm transition-all ${
                  theme.font === key
                    ? "border-orange-400 bg-orange-50 text-orange-600"
                    : "border-gray-100 text-gray-500 hover:border-gray-200"
                }`}
                style={{ fontFamily: css }}
              >
                {label}
                <span className="block text-xs mt-0.5 opacity-60">Aa Bb Cc</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Logo */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-700">Logo</h2>
        <div className="flex items-center gap-4">
          {logoSrc ? (
            <div className="relative w-20 h-20">
              <Image src={logoSrc} alt="Logo" width={80} height={80}
                className="w-20 h-20 rounded-xl object-cover border border-gray-200" />
              <button
                onClick={() => { setLogoFile(null); setLogoPreview(""); update("logoUrl", ""); }}
                className="absolute -top-2 -right-2 bg-white border border-gray-200 rounded-full p-0.5 text-gray-400 hover:text-red-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-orange-300 transition-colors">
              <ImagePlus className="w-5 h-5 text-gray-300" />
              <span className="text-xs text-gray-300 mt-1">Yükle</span>
              <input type="file" accept="image/*" className="hidden"
                onChange={(e) => handleFileChange(e, "logo")} />
            </label>
          )}
          <p className="text-xs text-gray-400">Menü sayfasının üstünde gösterilir. PNG veya SVG önerilir.</p>
        </div>
      </div>

      {/* Kapak Görseli */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-700">Kapak Görseli</h2>
        <div className="space-y-3">
          {coverSrc ? (
            <div className="relative w-full h-32">
              <Image src={coverSrc} alt="Kapak" fill
                className="rounded-xl object-cover border border-gray-200" />
              <button
                onClick={() => { setCoverFile(null); setCoverPreview(""); update("coverUrl", ""); }}
                className="absolute top-2 right-2 bg-white border border-gray-200 rounded-full p-1 text-gray-400 hover:text-red-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-orange-300 transition-colors">
              <ImagePlus className="w-6 h-6 text-gray-300" />
              <span className="text-sm text-gray-300 mt-1">Kapak görseli yükle</span>
              <input type="file" accept="image/*" className="hidden"
                onChange={(e) => handleFileChange(e, "cover")} />
            </label>
          )}
          <p className="text-xs text-gray-400">Menü sayfasının en üstünde banner olarak görünür.</p>
        </div>
      </div>

      {/* Duyuru Görseli */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-gray-400" />
            <h2 className="font-semibold text-gray-700">Duyuru</h2>
          </div>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <span className="text-xs text-gray-400">{theme.bannerActive ? "Aktif" : "Pasif"}</span>
            <div
              onClick={() => update("bannerActive", !theme.bannerActive)}
              className={`w-10 h-5 rounded-full transition-colors relative ${theme.bannerActive ? "bg-orange-500" : "bg-gray-200"}`}
            >
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${theme.bannerActive ? "translate-x-5" : "translate-x-0.5"}`} />
            </div>
          </label>
        </div>

        <div className="space-y-3">
          {bannerSrc ? (
            <div className="relative w-full h-40">
              <Image src={bannerSrc} alt="Duyuru" fill className="rounded-xl object-cover border border-gray-200" />
              <button
                onClick={() => { setBannerFile(null); setBannerPreview(""); update("bannerUrl", ""); }}
                className="absolute top-2 right-2 bg-white border border-gray-200 rounded-full p-1 text-gray-400 hover:text-red-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-orange-300 transition-colors">
              <ImagePlus className="w-6 h-6 text-gray-300" />
              <span className="text-sm text-gray-300 mt-1">Duyuru görseli yükle</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, "banner")} />
            </label>
          )}

          <div className="relative">
            <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            <input
              type="url"
              placeholder="Tıklanınca açılacak link (opsiyonel)"
              value={theme.bannerLink}
              onChange={(e) => update("bannerLink", e.target.value)}
              className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
          <p className="text-xs text-gray-400">Müşteri menüyü açtığında ekranda gösterilir, kapatabilir.</p>
        </div>
      </div>

      {/* Ürün Düzeni */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-700">Ürün Düzeni</h2>
        <div className="grid grid-cols-2 gap-3">
          {(["list", "card"] as const).map((layout) => (
            <button
              key={layout}
              onClick={() => update("productLayout", layout)}
              className={`py-3 px-4 rounded-xl border-2 text-sm transition-all ${
                theme.productLayout === layout
                  ? "border-orange-400 bg-orange-50 text-orange-600"
                  : "border-gray-100 text-gray-500 hover:border-gray-200"
              }`}
            >
              {layout === "list" ? "Liste" : "Kart"}
            </button>
          ))}
        </div>
      </div>

      {/* Görsel Oranı */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-700">Görsel Oranı</h2>
        <div className="grid grid-cols-3 gap-3">
          {(["square", "wide", "round"] as const).map((ratio) => (
            <button
              key={ratio}
              onClick={() => update("imageRatio", ratio)}
              className={`py-3 px-4 rounded-xl border-2 text-sm transition-all ${
                theme.imageRatio === ratio
                  ? "border-orange-400 bg-orange-50 text-orange-600"
                  : "border-gray-100 text-gray-500 hover:border-gray-200"
              }`}
            >
              {ratio === "square" ? "Kare" : ratio === "wide" ? "Geniş" : "Yuvarlak"}
            </button>
          ))}
        </div>
      </div>

      {/* Ekstra Bilgiler */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-700">Ekstra Bilgiler</h2>
        <div className="space-y-3">
          <div className="relative">
            <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            <input type="text" placeholder="Instagram kullanıcı adı (ör. kafem)"
              value={theme.instagram}
              onChange={(e) => update("instagram", e.target.value)}
              className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
          </div>
          <div className="relative">
            <Wifi className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            <input type="text" placeholder="WiFi şifresi"
              value={theme.wifi}
              onChange={(e) => update("wifi", e.target.value)}
              className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
          </div>
        </div>
      </div>

      {/* Hata */}
      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-500">
          {error}
        </div>
      )}

      {/* Kaydet */}
      <button onClick={handleSave} disabled={saving}
        className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors">
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        {saved ? "Kaydedildi ✓" : "Kaydet"}
      </button>

    </div>
  );
}
