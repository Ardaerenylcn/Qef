"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Save, Loader2, ImagePlus, X, Wifi, Instagram, Link, Megaphone } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_THEME, FONTS, BG_TEXTURE_LABELS, getBgTextureStyle, type CafeTheme, type BgTexture } from "@/types/theme";
import { validateImage } from "@/lib/validateImage";
import { compressImage } from "@/lib/compressImage";
import CollapsibleSection from "./CollapsibleSection";

export default function ThemeEditor() {
  const [cafeId, setCafeId] = useState<string | null>(null);
  const [theme, setTheme] = useState<CafeTheme>(DEFAULT_THEME);
  const [savedTheme, setSavedTheme] = useState<CafeTheme>(DEFAULT_THEME);
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
        const loaded = { ...DEFAULT_THEME, ...(cafe.theme ?? {}) };
        setTheme(loaded);
        setSavedTheme(loaded);
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
      setSavedTheme(newTheme);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : JSON.stringify(err);
      console.error("Tema kayıt hatası:", msg);
      setError(`Hata: ${msg}`);
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
    <div className="space-y-3">

      <CollapsibleSection storageKey="theme_renkler" title="Renkler">
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
      </CollapsibleSection>

      <CollapsibleSection storageKey="theme_font" title="Yazı Tipi" defaultOpen={false}>
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
      </CollapsibleSection>

      <CollapsibleSection storageKey="theme_logo" title="Logo" defaultOpen={false}>
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
      </CollapsibleSection>

      <CollapsibleSection storageKey="theme_kapak" title="Kapak Görseli" defaultOpen={false}>
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
      </CollapsibleSection>

      <CollapsibleSection storageKey="theme_duyuru" title="Duyuru" defaultOpen={false}>
        <div className="flex items-center justify-between -mt-1 mb-1">
          <div className="flex items-center gap-2 text-gray-400">
            <Megaphone className="w-4 h-4" />
            <span className="text-xs">{theme.bannerActive ? "Aktif" : "Pasif"}</span>
          </div>
          <div
            onClick={() => update("bannerActive", !theme.bannerActive)}
            className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${theme.bannerActive ? "bg-orange-500" : "bg-gray-200"}`}
          >
            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${theme.bannerActive ? "translate-x-5" : "translate-x-0.5"}`} />
          </div>
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
            <input type="url" placeholder="Tıklanınca açılacak link (opsiyonel)"
              value={theme.bannerLink} onChange={(e) => update("bannerLink", e.target.value)}
              className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
          </div>
          <p className="text-xs text-gray-400">Müşteri menüyü açtığında ekranda gösterilir, kapatabilir.</p>
        </div>
      </CollapsibleSection>

      <CollapsibleSection storageKey="theme_arkaplan_doku" title="Arkaplan Dokusu" defaultOpen={false}>
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(BG_TEXTURE_LABELS) as BgTexture[]).map((key) => {
            const textureStyle = getBgTextureStyle(key, "#111827");
            return (
              <button
                key={key}
                onClick={() => update("bgTexture", key)}
                className={`relative h-16 rounded-xl border-2 overflow-hidden transition-all ${
                  (theme.bgTexture ?? "none") === key
                    ? "border-orange-400"
                    : "border-gray-100 hover:border-gray-200"
                }`}
                style={{ backgroundColor: "#f9fafb" }}
              >
                {/* Texture preview overlay */}
                {key !== "none" && (
                  <div className="absolute inset-0" style={textureStyle} />
                )}
                <span className={`relative text-[11px] font-semibold ${
                  (theme.bgTexture ?? "none") === key ? "text-orange-500" : "text-gray-400"
                }`}>
                  {BG_TEXTURE_LABELS[key]}
                </span>
              </button>
            );
          })}
        </div>
      </CollapsibleSection>

      <CollapsibleSection storageKey="theme_urun_duzeni" title="Ürün Düzeni" defaultOpen={false}>
        <div className="grid grid-cols-2 gap-3">
          {(["list", "card"] as const).map((layout) => (
            <button key={layout} onClick={() => update("productLayout", layout)}
              className={`py-3 px-4 rounded-xl border-2 text-sm transition-all ${
                theme.productLayout === layout
                  ? "border-orange-400 bg-orange-50 text-orange-600"
                  : "border-gray-100 text-gray-500 hover:border-gray-200"
              }`}>
              {layout === "list" ? "Liste" : "Kart"}
            </button>
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection storageKey="theme_gorsel_orani" title="Görsel Oranı" defaultOpen={false}>
        <div className="grid grid-cols-3 gap-3">
          {(["square", "wide", "round"] as const).map((ratio) => (
            <button key={ratio} onClick={() => update("imageRatio", ratio)}
              className={`py-3 px-4 rounded-xl border-2 text-sm transition-all ${
                theme.imageRatio === ratio
                  ? "border-orange-400 bg-orange-50 text-orange-600"
                  : "border-gray-100 text-gray-500 hover:border-gray-200"
              }`}>
              {ratio === "square" ? "Kare" : ratio === "wide" ? "Geniş" : "Yuvarlak"}
            </button>
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection storageKey="theme_ekstra" title="Ekstra Bilgiler" defaultOpen={false}>
        <div className="space-y-3">
          <div className="relative">
            <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            <input type="text" placeholder="Instagram kullanıcı adı (ör. kafem)"
              value={theme.instagram} onChange={(e) => update("instagram", e.target.value)}
              className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
          </div>
          <div className="relative">
            <Wifi className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            <input type="text" placeholder="WiFi şifresi"
              value={theme.wifi} onChange={(e) => update("wifi", e.target.value)}
              className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
          </div>
        </div>
      </CollapsibleSection>

      {/* Hata */}
      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-500">
          {error}
        </div>
      )}

      {/* Kaydedilmemiş uyarı */}
      {!saved && !saving && JSON.stringify(theme) !== JSON.stringify(savedTheme) || logoFile || coverFile || bannerFile ? (
        <p className="text-center text-xs text-orange-400 font-medium animate-pulse">
          ● Kaydedilmemiş değişiklikler var
        </p>
      ) : null}

      {/* Kaydet */}
      <button onClick={handleSave} disabled={saving}
        className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors">
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        {saved ? "Kaydedildi ✓" : "Kaydet"}
      </button>

    </div>
  );
}
