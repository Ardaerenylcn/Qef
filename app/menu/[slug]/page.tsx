export const revalidate = 30; // 30 saniye ISR cache

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Suspense } from "react";
import { UtensilsCrossed, Wifi, Instagram, MapPin, ExternalLink, QrCode } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_THEME, FONTS, type CafeTheme } from "@/types/theme";
import LangToggle from "@/components/LangToggle";
import CategoryTabs from "@/components/CategoryTabs";
import MenuProductList from "@/components/MenuProductList";
import StickyMenuHeader from "@/components/StickyMenuHeader";
import ParallaxCover from "@/components/ParallaxCover";
import OpenStatusBadge from "@/components/OpenStatusBadge";
import BannerModal from "@/components/BannerModal";
import MenuChatbot from "@/components/MenuChatbot";
import SpecialDayBanner from "@/components/SpecialDayBanner";
import SpecialDayEffects from "@/components/SpecialDayEffects";
import HangingOrnaments from "@/components/HangingOrnaments";
import WavingFlag from "@/components/WavingFlag";
import RamazanDecor from "@/components/RamazanDecor";
import { getActiveSpecialDay, SPECIAL_DAYS } from "@/lib/specialDays";

const BASE_URL = "https://qefmenu.com";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string; day?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: cafe } = await supabase
    .from("cafes")
    .select("name, description, theme, address")
    .eq("slug", slug)
    .single();

  if (!cafe) return { title: "Menü Bulunamadı" };

  const theme = { ...DEFAULT_THEME, ...(cafe.theme ?? {}) };
  const title = `${cafe.name} — Dijital Menü`;
  const description = cafe.description
    ? `${cafe.name} menüsü: ${cafe.description}`
    : `${cafe.name} dijital menüsünü inceleyin. QR kodu taratın, kolayca sipariş verin.`;
  const pageUrl = `${BASE_URL}/menu/${slug}`;
  const ogImage = theme.coverUrl || theme.logoUrl || `${BASE_URL}/og-image.png`;

  return {
    title,
    description,
    alternates: { canonical: pageUrl },
    openGraph: {
      type: "website",
      locale: "tr_TR",
      url: pageUrl,
      siteName: "Qef",
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${cafe.name} menü görseli` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function PublicMenuPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { lang = "tr", day: testDay } = await searchParams;
  const isEn = lang === "en";
  const supabase = await createClient();

  const { data: cafe } = await supabase
    .from("cafes")
    .select("id, name, name_en, description, description_en, category_order, theme, opening_hours, address, maps_url, chatbot_enabled, seasonal_themes_enabled")
    .eq("slug", slug)
    .single();

  if (!cafe) notFound();

  // Ziyareti kaydet ve ürünleri paralel çek
  const [{ data: products }] = await Promise.all([
    supabase
      .from("products")
      .select("id, name, name_en, price, category, description, description_en, image_url, position, tags, ingredients, in_stock, model_url, calories")
      .eq("cafe_id", cafe.id)
      .order("position", { ascending: true }),
    supabase.from("menu_views").insert({ cafe_id: cafe.id }),
  ]);

  const baseTheme: CafeTheme = { ...DEFAULT_THEME, ...(cafe.theme ?? {}) };
  const seasonalEnabled = cafe.seasonal_themes_enabled !== false;
  const activeSpecialDay = testDay
    ? (SPECIAL_DAYS.find((d) => d.id === testDay) ?? null)
    : seasonalEnabled ? getActiveSpecialDay() : null;
  const theme: CafeTheme = activeSpecialDay
    ? { ...baseTheme, primaryColor: activeSpecialDay.primaryColor }
    : baseTheme;
  const fontCss = FONTS[theme.font]?.css ?? FONTS.sans.css;

  const grouped = (products ?? []).reduce<Record<string, typeof products>>((acc, p) => {
    const key = p!.category || "Genel";
    if (!acc[key]) acc[key] = [];
    acc[key]!.push(p);
    return acc;
  }, {});

  const categoryOrder: string[] = cafe.category_order ?? [];
  const allCats = Object.keys(grouped);
  const orderedCats = [
    ...categoryOrder.filter((c) => allCats.includes(c)),
    ...allCats.filter((c) => !categoryOrder.includes(c)),
  ];

  const cafeName = (isEn && cafe.name_en) ? cafe.name_en : cafe.name;
  const cafeDesc = (isEn && cafe.description_en) ? cafe.description_en : cafe.description;
  const openingHours = cafe.opening_hours ?? [];
  const address = cafe.address ?? "";
  const mapsUrl = cafe.maps_url ?? "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: cafeName,
    ...(cafeDesc && { description: cafeDesc }),
    ...(address && { address: { "@type": "PostalAddress", streetAddress: address } }),
    ...(mapsUrl && { hasMap: mapsUrl }),
    url: `${BASE_URL}/menu/${slug}`,
    ...(theme.logoUrl && { image: theme.logoUrl }),
    servesCuisine: "Cafe",
    menu: `${BASE_URL}/menu/${slug}`,
  };

  return (
    <main style={{ backgroundColor: theme.bgColor, fontFamily: fontCss, color: theme.textColor }}
      className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/<\/script>/gi, "<\\/script>") }}
      />

      {/* Duyuru banner modal */}
      {theme.bannerActive && theme.bannerUrl && (
        <BannerModal bannerUrl={theme.bannerUrl} bannerLink={theme.bannerLink ?? ""} cafeSlug={slug} />
      )}

      {/* Sarkan süs topları / kalpler — sayfanın en üstü */}
      {activeSpecialDay?.banner.hasOrnaments && (
        <HangingOrnaments
          variant={
            activeSpecialDay.id === "sevgililer" ? "hearts"
            : activeSpecialDay.id.startsWith("noel") ? "christmas"
            : "new-year"
          }
        />
      )}

      {/* Sticky header */}
      <StickyMenuHeader
        cafeName={cafeName}
        logoUrl={theme.logoUrl}
        primaryColor={theme.primaryColor}
      />

      {/* Kapak görseli + dil toggle */}
      {theme.coverUrl ? (
        <div className="relative">
          <ParallaxCover src={theme.coverUrl} alt="Kapak" />
          <div className="absolute top-3 right-3 z-10">
            <Suspense><LangToggle /></Suspense>
          </div>
        </div>
      ) : (
        <div className="flex justify-end px-4 pt-4">
          <Suspense><LangToggle /></Suspense>
        </div>
      )}

      {/* Kategori sekmeleri */}
      {orderedCats.length > 1 && (
        <CategoryTabs categories={orderedCats} primaryColor={theme.primaryColor} bgColor={theme.bgColor} />
      )}

      <div className="max-w-md mx-auto px-4 py-10 space-y-8">
        {/* Kafe başlığı */}
        <div className="text-center space-y-2 border-b pb-8" style={{ borderColor: `${theme.primaryColor}22` }}>
          {theme.logoUrl ? (
            <div className="flex justify-center mb-3">
              <Image src={theme.logoUrl} alt="Logo" width={80} height={80}
                className="w-20 h-20 rounded-2xl object-cover" />
            </div>
          ) : (
            <div className="inline-flex items-center justify-center rounded-full w-14 h-14 mb-3"
              style={{ backgroundColor: `${theme.primaryColor}22` }}>
              <UtensilsCrossed className="w-7 h-7" style={{ color: theme.primaryColor }} />
            </div>
          )}
          <h1 className="text-3xl font-bold tracking-tight">{cafeName}</h1>
          {cafeDesc && (
            <p className="text-sm opacity-75">{cafeDesc}</p>
          )}
          {openingHours.length > 0 && (
            <div className="flex justify-center pt-1">
              <OpenStatusBadge hours={openingHours} isEn={isEn} />
            </div>
          )}
        </div>

        {/* Özel gün banner */}
        {activeSpecialDay && (
          <SpecialDayBanner day={activeSpecialDay} isEn={isEn} />
        )}

        {/* Menü */}
        {(products ?? []).length === 0 ? (
          <div className="text-center py-16 opacity-30 space-y-2">
            <UtensilsCrossed className="w-10 h-10 mx-auto" />
            <p className="text-sm">Menü henüz hazır değil.</p>
          </div>
        ) : (
          <MenuProductList
            products={(products ?? []) as Parameters<typeof MenuProductList>[0]["products"]}
            orderedCats={orderedCats}
            primaryColor={theme.primaryColor}
            isEn={isEn}
            productLayout={theme.productLayout}
            imageRatio={theme.imageRatio}
          />
        )}

        {/* WiFi + Instagram + Adres + Maps */}
        {(theme.wifi || theme.instagram || address || mapsUrl) && (
          <div className="border-t pt-6 space-y-3" style={{ borderColor: `${theme.primaryColor}22` }}>
            {theme.wifi && (
              <div className="flex items-center gap-2 text-sm opacity-75">
                <Wifi className="w-4 h-4 shrink-0" style={{ color: theme.primaryColor }} />
                <span>WiFi: <span className="font-medium">{theme.wifi}</span></span>
              </div>
            )}
            {theme.instagram && (
              <a href={`https://instagram.com/${theme.instagram}`} target="_blank"
                className="flex items-center gap-2 text-sm opacity-75 hover:opacity-100 transition-opacity">
                <Instagram className="w-4 h-4 shrink-0" style={{ color: theme.primaryColor }} />
                <span>@{theme.instagram}</span>
              </a>
            )}
            {address && (
              <div className="flex items-center gap-2 text-sm opacity-75">
                <MapPin className="w-4 h-4 shrink-0" style={{ color: theme.primaryColor }} />
                <span>{address}</span>
              </div>
            )}
            {mapsUrl && (
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm opacity-75 hover:opacity-100 transition-opacity">
                <ExternalLink className="w-4 h-4 shrink-0" style={{ color: theme.primaryColor }} />
                <span>{isEn ? "View on Map" : "Haritada Gör"}</span>
              </a>
            )}
          </div>
        )}


      </div>

      {/* Özel gün parçacık efektleri */}
      {activeSpecialDay && (
        <SpecialDayEffects effectType={activeSpecialDay.banner.effectType} />
      )}

      {/* Türk bayrağı — bayram günleri */}
      {activeSpecialDay?.banner.isFlagDay && <WavingFlag />}

      {/* Ramazan feneri */}
      {activeSpecialDay?.banner.hasLantern && <RamazanDecor />}

      {/* AI Chatbot */}
      {cafe.chatbot_enabled !== false && (
        <MenuChatbot cafeId={cafe.id} primaryColor={theme.primaryColor} />
      )}

      {/* Publisher content — editorial section for AdSense compliance */}
      <section className="bg-gray-50 border-t border-gray-100 mt-8">
        <div className="max-w-md mx-auto px-4 py-10 space-y-8">

          {/* QR Menü Hakkında */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-orange-400 shrink-0" />
              <h2 className="font-semibold text-gray-700 text-sm">Dijital QR Menü Nedir?</h2>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Dijital QR menü, kafe ve restoranların kağıt menü yerine kullandığı modern bir çözümdür.
              Müşteriler masadaki QR kodu telefonlarıyla okutarak menüye anında ulaşır; fiyat güncellemeleri,
              yeni ürün eklemeleri ve kategori düzenlemeleri gerçek zamanlı yansır. Kağıt baskı maliyeti,
              güncelleme derdi ve hijyen sorunu ortadan kalkar.
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              QR menüler özellikle sezon değişikliklerinde büyük kolaylık sağlar: tek tıkla ürün ekleyebilir,
              fiyat güncelleyebilir veya stokta olmayan ürünleri gizleyebilirsiniz. Müşterileriniz her zaman
              en güncel menüyü görür.
            </p>
          </div>

          {/* Blog linkleri */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700 text-sm">Dijital Menü Hakkında Daha Fazla Bilgi</h3>
            <ul className="space-y-2">
              <li>
                <a href="/blog/qr-menu-nedir"
                  className="text-xs text-orange-500 hover:underline flex items-center gap-1.5">
                  <ExternalLink className="w-3 h-3 shrink-0" />
                  QR Menü Nedir? Kafeler İçin Kapsamlı Rehber
                </a>
              </li>
              <li>
                <a href="/blog/ucretsiz-dijital-menu-nasil-olusturulur"
                  className="text-xs text-orange-500 hover:underline flex items-center gap-1.5">
                  <ExternalLink className="w-3 h-3 shrink-0" />
                  Ücretsiz Dijital Menü Nasıl Oluşturulur?
                </a>
              </li>
              <li>
                <a href="/blog/kagit-menuden-dijital-menuye-gecmenin-5-faydasi"
                  className="text-xs text-orange-500 hover:underline flex items-center gap-1.5">
                  <ExternalLink className="w-3 h-3 shrink-0" />
                  Kağıt Menüden Dijital Menüye Geçmenin 5 Faydası
                </a>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div className="bg-orange-50 rounded-2xl p-4 space-y-3 text-center">
            <p className="text-sm font-semibold text-gray-800">Kafen için ücretsiz QR menü oluştur</p>
            <p className="text-xs text-gray-500">
              Dakikalar içinde hazır, kurulum gerektirmez. Sınırsız ürün, özelleştirilebilir tema.
            </p>
            <a href="/register"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
              Ücretsiz Başla
            </a>
          </div>

          <p className="text-center text-xs text-gray-300">
            Bu menü <a href="/" className="hover:text-orange-400 transition-colors">Qef</a> ile oluşturuldu ·{" "}
            <a href="/privacy" className="hover:text-orange-400 transition-colors">Gizlilik</a> ·{" "}
            <a href="/terms" className="hover:text-orange-400 transition-colors">Kullanım Koşulları</a>
          </p>
        </div>
      </section>
    </main>
  );
}
