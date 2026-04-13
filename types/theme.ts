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

/** Converts a hex color to rgba string with the given alpha. */
function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return `rgba(0,0,0,${alpha})`;
  return `rgba(${r},${g},${b},${alpha})`;
}

/**
 * Returns backgroundImage + backgroundSize to apply directly on the page's
 * <main> element alongside backgroundColor. Never overlays content.
 */
export function getBgTextureStyle(texture: BgTexture, textColor: string): CSSProperties {
  const c = hexToRgba(textColor, 0.07);
  const cs = hexToRgba(textColor, 0.05);
  switch (texture) {
    case "dots":
      return {
        backgroundImage: `radial-gradient(circle, ${c} 1px, transparent 1px)`,
        backgroundSize: "18px 18px",
      };
    case "grid":
      return {
        backgroundImage: `linear-gradient(${cs} 1px, transparent 1px), linear-gradient(90deg, ${cs} 1px, transparent 1px)`,
        backgroundSize: "24px 24px",
      };
    case "lines":
      return {
        backgroundImage: `repeating-linear-gradient(0deg, ${cs}, ${cs} 1px, transparent 1px, transparent 22px)`,
      };
    case "cross":
      return {
        backgroundImage: `repeating-linear-gradient(45deg, ${cs} 0, ${cs} 1px, transparent 0, transparent 50%), repeating-linear-gradient(-45deg, ${cs} 0, ${cs} 1px, transparent 0, transparent 50%)`,
        backgroundSize: "14px 14px",
      };
    case "noise":
      return {
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`,
        backgroundSize: "200px 200px",
      };
    default:
      return {};
  }
}

export const FONTS: Record<CafeTheme["font"], { label: string; css: string }> = {
  sans:  { label: "Modern",  css: "system-ui, -apple-system, sans-serif" },
  serif: { label: "Klasik",  css: "Georgia, 'Times New Roman', serif" },
  mono:  { label: "Teknik",  css: "'Courier New', Courier, monospace" },
};
