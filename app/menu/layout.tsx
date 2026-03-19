import Script from "next/script";

const PUBLISHER_ID = "ca-pub-XXXXXXXXXXXXXXXX"; // ← AdSense Publisher ID buraya

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {PUBLISHER_ID !== "ca-pub-XXXXXXXXXXXXXXXX" && (
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${PUBLISHER_ID}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      )}
      {children}
    </>
  );
}
