export interface Product {
  id: string;
  name: string;
  name_en: string;
  price: number;
  category: string;
  description: string;
  description_en: string;
  image_url: string;
  position: number;
  tags: string[];
  in_stock: boolean;
}

export const PRODUCT_TAGS: { label: string; labelEn: string; color: string; bg: string }[] = [
  { label: "Yeni",       labelEn: "New",          color: "#2563eb", bg: "#dbeafe" },
  { label: "Popüler",    labelEn: "Popular",       color: "#ea580c", bg: "#ffedd5" },
  { label: "Öne Çıkan",  labelEn: "Featured",      color: "#7c3aed", bg: "#ede9fe" },
  { label: "Vejetaryen", labelEn: "Vegetarian",    color: "#16a34a", bg: "#dcfce7" },
  { label: "Vegan",      labelEn: "Vegan",         color: "#15803d", bg: "#bbf7d0" },
  { label: "Baharatlı",  labelEn: "Spicy",         color: "#dc2626", bg: "#fee2e2" },
  { label: "Glutensiz",  labelEn: "Gluten Free",   color: "#b45309", bg: "#fef3c7" },
];

export interface OpeningHour {
  day: number; // 0=Pazartesi ... 6=Pazar
  open: string;  // "09:00"
  close: string; // "22:00"
  closed: boolean;
}

export const DEFAULT_HOURS: OpeningHour[] = Array.from({ length: 7 }, (_, i) => ({
  day: i, open: "09:00", close: "22:00", closed: false,
}));

export const DAY_NAMES = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];

export interface CafeInfo {
  name: string;
  description: string;
}

export interface MenuData {
  cafe: CafeInfo;
  products: Product[];
}

export const DEFAULT_MENU_DATA: MenuData = {
  cafe: { name: "Kafem", description: "" },
  products: [],
};
