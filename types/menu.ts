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

export const PRODUCT_TAGS: { label: string; labelEn: string; icon: string; color: string; bg: string }[] = [
  // Ürün özellikleri
  { label: "Yeni",          labelEn: "New",             icon: "✨", color: "#2563eb", bg: "#dbeafe" },
  { label: "Popüler",       labelEn: "Popular",          icon: "🔥", color: "#ea580c", bg: "#ffedd5" },
  { label: "Öne Çıkan",    labelEn: "Featured",         icon: "⭐", color: "#7c3aed", bg: "#ede9fe" },
  { label: "Şefin Seçimi", labelEn: "Chef's Choice",    icon: "👨‍🍳", color: "#0891b2", bg: "#cffafe" },
  // Beslenme tercihleri
  { label: "Vejetaryen",   labelEn: "Vegetarian",       icon: "🥬", color: "#16a34a", bg: "#dcfce7" },
  { label: "Vegan",        labelEn: "Vegan",            icon: "🌱", color: "#15803d", bg: "#bbf7d0" },
  { label: "Glutensiz",    labelEn: "Gluten Free",      icon: "🌾", color: "#b45309", bg: "#fef3c7" },
  { label: "Helal",        labelEn: "Halal",            icon: "☪️",  color: "#15803d", bg: "#dcfce7" },
  // Alerjenler & içerik
  { label: "Baharatlı",    labelEn: "Spicy",            icon: "🌶️", color: "#dc2626", bg: "#fee2e2" },
  { label: "Sütlü",        labelEn: "Contains Dairy",   icon: "🥛", color: "#6366f1", bg: "#e0e7ff" },
  { label: "Yumurtalı",    labelEn: "Contains Egg",     icon: "🥚", color: "#ca8a04", bg: "#fefce8" },
  { label: "Fındıklı",     labelEn: "Contains Nuts",    icon: "🥜", color: "#92400e", bg: "#fef3c7" },
  { label: "Deniz Ürünleri", labelEn: "Seafood",        icon: "🐟", color: "#0284c7", bg: "#e0f2fe" },
  { label: "Donmuş",       labelEn: "Frozen",           icon: "❄️", color: "#0891b2", bg: "#ecfeff" },
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
