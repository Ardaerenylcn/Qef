"use client";

import { useState, useEffect } from "react";

interface Props {
  src: string;
  alt: string;
}

export default function ParallaxCover({ src, alt }: Props) {
  const [translateY, setTranslateY] = useState(0);

  useEffect(() => {
    function handleScroll() {
      setTranslateY(Math.round(window.scrollY * 0.4));
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="h-64 overflow-hidden relative">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ transform: `translateY(${translateY}px)` }}
      />
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
}
