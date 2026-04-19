export const revalidate = 3600; // 1 saatlik ISR cache — admin kaydettiğinde on-demand revalidate ile güncellenir

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Suspense } from "react";
import { UtensilsCrossed, Wifi, Instagram, MapPin, ExternalLink } from "lucide-react";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
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

// Admin client kullanarak RLS bypass — public menü sayfası için
const getCafe = cache(async (slug: string) => {
  const admin = createAdminClient();
  const { data } = await admin
    .from("cafes")
    .select("id, name, name_en, description, description_en, category_order, theme, opening_hours, address, maps_url, google_review_url, chatbot_enabled, seasonal_themes_enabled")
    .eq("slug", slug)
    .single();
  return data;
});

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string; day?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cafe = await getCafe(slug);

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

  const cafe = await getCafe(slug);
  if (!cafe) notFound();

  const admin = createAdminClient();

  // Ziyareti kaydet (fire-and-forget — sayfayı bekletme)
  supabase.from("menu_views").insert({ cafe_id: cafe.id });

  const { data: products } = await admin
    .from("products")
    .select("id, name, name_en, price, category, description, description_en, image_url, position, tags, ingredients, in_stock, model_url, calories")
    .eq("cafe_id", cafe.id)
    .order("position", { ascending: true });

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
  const googleReviewUrl = cafe.google_review_url ?? "";

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

        {/* Google Yorum butonu */}
        {googleReviewUrl && (
          <div className="mx-4 mt-4">
            <a
              href={googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 w-full rounded-2xl border-2 px-4 py-3 text-sm font-semibold transition-all hover:opacity-80 active:scale-95"
              style={{ borderColor: theme.primaryColor + "40", color: theme.primaryColor, backgroundColor: theme.primaryColor + "10" }}
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span>{isEn ? "Write a Google Review" : "Google&apos;da Yorum Yap"}</span>
              <span className="text-lg">⭐</span>
            </a>
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
        <MenuChatbot cafeId={cafe.id} cafeName={cafe.name} primaryColor={theme.primaryColor} />
      )}

      <footer className="border-t border-gray-100 mt-8 py-6">
        <p className="text-center text-xs text-gray-300">
          Bu menü <a href="/" className="hover:text-orange-400 transition-colors">Qef</a> ile oluşturuldu ·{" "}
          <a href="/privacy" className="hover:text-orange-400 transition-colors">Gizlilik</a> ·{" "}
          <a href="/terms" className="hover:text-orange-400 transition-colors">Kullanım Koşulları</a>
        </p>
      </footer>
    </main>
  );
}
