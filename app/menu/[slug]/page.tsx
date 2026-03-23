import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Suspense } from "react";
import { UtensilsCrossed, Wifi, Instagram, MapPin, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_THEME, FONTS, type CafeTheme } from "@/types/theme";
import LangToggle from "@/components/LangToggle";
import CategoryTabs from "@/components/CategoryTabs";
import MenuProductList from "@/components/MenuProductList";
import StickyMenuHeader from "@/components/StickyMenuHeader";
import ParallaxCover from "@/components/ParallaxCover";
import OpenStatusBadge from "@/components/OpenStatusBadge";
import AdUnit from "@/components/AdUnit";

const BASE_URL = "https://qefmenu.com";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
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
  const { lang = "tr" } = await searchParams;
  const isEn = lang === "en";
  const supabase = await createClient();

  const { data: cafe } = await supabase
    .from("cafes")
    .select("id, name, name_en, description, description_en, category_order, theme, opening_hours, address, maps_url")
    .eq("slug", slug)
    .single();

  if (!cafe) notFound();

  // Ziyareti kaydet (non-blocking)
  supabase.from("menu_views").insert({ cafe_id: cafe.id }).then(() => {});

  const { data: products } = await supabase
    .from("products")
    .select("id, name, name_en, price, category, description, description_en, image_url, position, tags, in_stock")
    .eq("cafe_id", cafe.id)
    .order("position", { ascending: true });

  const theme: CafeTheme = { ...DEFAULT_THEME, ...(cafe.theme ?? {}) };
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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

        {/* Reklam — menü listesinin altında */}
        <AdUnit
          slot="XXXXXXXXXX"
          format="horizontal"
          className="overflow-hidden rounded-xl"
        />

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

        {/* Reklam — footer üstünde */}
        <AdUnit
          slot="YYYYYYYYYY"
          format="auto"
          className="overflow-hidden rounded-xl"
        />

        <p className="text-center text-xs opacity-20 pt-2">Qef ile oluşturuldu</p>
      </div>
    </main>
  );
}
