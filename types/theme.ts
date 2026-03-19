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
};

export const FONTS: Record<CafeTheme["font"], { label: string; css: string }> = {
  sans:  { label: "Modern",  css: "system-ui, -apple-system, sans-serif" },
  serif: { label: "Klasik",  css: "Georgia, 'Times New Roman', serif" },
  mono:  { label: "Teknik",  css: "'Courier New', Courier, monospace" },
};
