import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Qef - Kafen için ücretsiz dijital menü",
  description: "Saniyeler içinde kafen için dijital menü oluştur. Qef ile QR kodunu tara, menünü gör.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  );
}
