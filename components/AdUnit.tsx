"use client";

import { useEffect } from "react";

interface Props {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal";
  className?: string;
}

const PUBLISHER_ID = "ca-pub-XXXXXXXXXXXXXXXX"; // ← AdSense Publisher ID buraya

export default function AdUnit({ slot, format = "auto", className = "" }: Props) {
  useEffect(() => {
    try {
      // @ts-expect-error adsbygoogle global olarak yüklenir
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, []);

  if (PUBLISHER_ID === "ca-pub-XXXXXXXXXXXXXXXX") return null; // ID eklenmeden reklam gösterme

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={PUBLISHER_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
