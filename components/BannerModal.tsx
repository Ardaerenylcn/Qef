"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface Props {
  bannerUrl: string;
  bannerLink: string;
  cafeSlug: string;
}

export default function BannerModal({ bannerUrl, bannerLink, cafeSlug }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const key = `banner_dismissed_${cafeSlug}`;
    if (!localStorage.getItem(key)) {
      setVisible(true);
    }
  }, [cafeSlug]);

  function dismiss() {
    localStorage.setItem(`banner_dismissed_${cafeSlug}`, "1");
    setVisible(false);
  }

  if (!visible) return null;

  const inner = (
    <div className="relative w-full max-w-sm mx-auto">
      <Image
        src={bannerUrl}
        alt="Duyuru"
        width={640}
        height={640}
        className="w-full rounded-2xl object-cover shadow-xl"
        priority
      />
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); dismiss(); }}
        className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors"
        aria-label="Kapat"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/70 backdrop-blur-sm"
      onClick={dismiss}
    >
      <div onClick={(e) => e.stopPropagation()}>
        {bannerLink ? (
          <a href={bannerLink} target="_blank" rel="noopener noreferrer">
            {inner}
          </a>
        ) : inner}
      </div>
    </div>
  );
}
