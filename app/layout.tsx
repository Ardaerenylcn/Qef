import type { Metadata } from "next";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import NavigationProgress from "@/components/NavigationProgress";
import "./globals.css";

const BASE_URL = "https://qefmenu.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Qef — Kafen için ücretsiz dijital menü",
    template: "%s | Qef",
  },
  description: "Saniyeler içinde kafen için dijital QR menü oluştur. QR kodu tarat, menünü gör. Ücretsiz, kurulum gerektirmez.",
  keywords: ["qr menü", "dijital menü", "kafe menü", "restoran menü", "qr kod menü", "online menü", "ücretsiz menü"],
  authors: [{ name: "Qef" }],
  creator: "Qef",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: BASE_URL,
    siteName: "Qef",
    title: "Qef — Kafen için ücretsiz dijital menü",
    description: "Saniyeler içinde kafen için dijital QR menü oluştur. QR kodu tarat, menünü gör.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Qef - Dijital QR Menü" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Qef — Kafen için ücretsiz dijital menü",
    description: "Saniyeler içinde kafen için dijital QR menü oluştur.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  other: {
    "google-adsense-account": "ca-pub-9433411352609938",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="bg-gray-50 text-gray-900 antialiased">
        <NavigationProgress />
        {children}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9433411352609938"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
      <GoogleAnalytics gaId="G-4X7CYB398D" />
    </html>
  );
}
