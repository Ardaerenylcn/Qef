"use client";

import { useState, useEffect } from "react";

interface Props {
  cafeName: string;
  logoUrl: string;
  primaryColor: string;
}

export default function StickyMenuHeader({ cafeName, logoUrl, primaryColor }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 180);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-40 h-12 flex items-center px-4 gap-3
        bg-white/80 backdrop-blur-md shadow-sm
        transition-transform duration-300
        ${visible ? "translate-y-0" : "-translate-y-full"}`}
    >
      {logoUrl ? (
        <img
          src={logoUrl}
          alt="Logo"
          className="w-6 h-6 rounded-md object-cover shrink-0"
        />
      ) : (
        <div
          className="w-6 h-6 rounded-md shrink-0"
          style={{ backgroundColor: `${primaryColor}22` }}
        />
      )}
      <span className="font-semibold text-sm truncate" style={{ color: primaryColor }}>
        {cafeName}
      </span>
    </div>
  );
}
