import type { CSSProperties } from "react";

export type BgTexture = "none" | "dots" | "grid" | "lines" | "noise" | "cross";

export interface CafeTheme {
  primaryColor: string;
  bgColor: string;
  textColor: string;
  font: "sans" | "serif" | "mono";
  logoUrl: string;
  coverUrl: string;
  instagram: string;
  wifi: string;
  productLayout: "list" | "card";
  imageRatio: "square" | "wide" | "round";
  bannerUrl: string;
  bannerActive: boolean;
  bannerLink: string;
  bgTexture: BgTexture;
}

export const DEFAULT_THEME: CafeTheme = {
  primaryColor: "#f97316",
  bgColor: "#ffffff",
  textColor: "#111827",
  font: "sans",
  logoUrl: "",
  coverUrl: "",
  instagram: "",
  wifi: "",
  productLayout: "list",
  imageRatio: "square",
  bannerUrl: "",
  bannerActive: false,
  bannerLink: "",
  bgTexture: "none",
};

export const BG_TEXTURE_LABELS: Record<BgTexture, string> = {
  none:  "Yok",
  dots:  "Nokta",
  grid:  "Izgara",
  lines: "Çizgi",
  cross: "Diyagonal",
  noise: "Kumlu",
};

/** Returns inline style for the texture overlay div. Pass textColor to set the dot/line color. */
export function getBgTextureStyle(texture: BgTexture, textColor: string): CSSProperties {
  switch (texture) {
    case "dots":
      return {
        backgroundImage: `radial-gradient(circle, ${textColor} 1px, transparent 1px)`,
        backgroundSize: "18px 18px",
        opacity: 0.07,
      };
    case "grid":
      return {
        backgroundImage: `linear-gradient(${textColor} 1px, transparent 1px), linear-gradient(90deg, ${textColor} 1px, transparent 1px)`,
        backgroundSize: "24px 24px",
        opacity: 0.06,
      };
    case "lines":
      return {
        backgroundImage: `repeating-linear-gradient(0deg, ${textColor}, ${textColor} 1px, transparent 1px, transparent 22px)`,
        opacity: 0.05,
      };
    case "cross":
      return {
        backgroundImage: `repeating-linear-gradient(45deg, ${textColor} 0, ${textColor} 1px, transparent 0, transparent 50%), repeating-linear-gradient(-45deg, ${textColor} 0, ${textColor} 1px, transparent 0, transparent 50%)`,
        backgroundSize: "14px 14px",
        opacity: 0.05,
      };
    case "noise":
      return {
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        opacity: 0.04,
        backgroundSize: "200px 200px",
      };
    default:
      return { display: "none" };
  }
}

export const FONTS: Record<CafeTheme["font"], { label: string; css: string }> = {
  sans:  { label: "Modern",  css: "system-ui, -apple-system, sans-serif" },
  serif: { label: "Klasik",  css: "Georgia, 'Times New Roman', serif" },
  mono:  { label: "Teknik",  css: "'Courier New', Courier, monospace" },
};
