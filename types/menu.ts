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
  ingredients: string[];
  in_stock: boolean;
}

export const PRODUCT_TAGS: { label: string; labelEn: string; icon: string; color: string; bg: string }[] = [
  { label: "Yeni",          labelEn: "New",           icon: "✨", color: "#2563eb", bg: "#dbeafe" },
  { label: "Popüler",       labelEn: "Popular",       icon: "🔥", color: "#ea580c", bg: "#ffedd5" },
  { label: "Öne Çıkan",    labelEn: "Featured",      icon: "⭐", color: "#7c3aed", bg: "#ede9fe" },
  { label: "Şefin Seçimi", labelEn: "Chef's Choice", icon: "👨‍🍳", color: "#0891b2", bg: "#cffafe" },
  { label: "Sınırlı",      labelEn: "Limited",       icon: "⏳", color: "#b45309", bg: "#fef3c7" },
  { label: "İndirimli",    labelEn: "On Sale",       icon: "🏷️", color: "#16a34a", bg: "#dcfce7" },
];

export interface Ingredient { id: string; label: string; labelEn: string; icon: string; group: string }

export const INGREDIENT_GROUPS: string[] = [
  "Tahıl & Temel", "Süt Ürünleri", "Et & Deniz", "Sebze", "Meyve",
  "Kahve & İçecek", "Tatlı & Fırın", "Yağ & Sos", "Baharat & Ot",
];

export const PRODUCT_INGREDIENTS: Ingredient[] = [
  // Tahıl & Temel
  { id: "flour",    label: "Un",          labelEn: "Flour",        icon: "🌾", group: "Tahıl & Temel" },
  { id: "rice",     label: "Pirinç",      labelEn: "Rice",         icon: "🍚", group: "Tahıl & Temel" },
  { id: "sugar",    label: "Şeker",       labelEn: "Sugar",        icon: "🍬", group: "Tahıl & Temel" },
  { id: "salt",     label: "Tuz",         labelEn: "Salt",         icon: "🧂", group: "Tahıl & Temel" },
  { id: "starch",   label: "Nişasta",     labelEn: "Starch",       icon: "🫙", group: "Tahıl & Temel" },
  { id: "oat",      label: "Yulaf",       labelEn: "Oat",          icon: "🌿", group: "Tahıl & Temel" },
  // Süt Ürünleri
  { id: "milk",     label: "Süt",         labelEn: "Milk",         icon: "🥛", group: "Süt Ürünleri" },
  { id: "butter",   label: "Tereyağı",    labelEn: "Butter",       icon: "🧈", group: "Süt Ürünleri" },
  { id: "cheese",   label: "Peynir",      labelEn: "Cheese",       icon: "🧀", group: "Süt Ürünleri" },
  { id: "cream",    label: "Krema",       labelEn: "Cream",        icon: "🍦", group: "Süt Ürünleri" },
  { id: "yogurt",   label: "Yoğurt",      labelEn: "Yogurt",       icon: "🥣", group: "Süt Ürünleri" },
  { id: "egg",      label: "Yumurta",     labelEn: "Egg",          icon: "🥚", group: "Süt Ürünleri" },
  // Et & Deniz
  { id: "beef",     label: "Dana Eti",    labelEn: "Beef",         icon: "🥩", group: "Et & Deniz" },
  { id: "chicken",  label: "Tavuk",       labelEn: "Chicken",      icon: "🍗", group: "Et & Deniz" },
  { id: "lamb",     label: "Kuzu Eti",    labelEn: "Lamb",         icon: "🫕", group: "Et & Deniz" },
  { id: "fish",     label: "Balık",       labelEn: "Fish",         icon: "🐟", group: "Et & Deniz" },
  { id: "shrimp",   label: "Karides",     labelEn: "Shrimp",       icon: "🍤", group: "Et & Deniz" },
  { id: "pastrami", label: "Pastırma",    labelEn: "Pastrami",     icon: "🥓", group: "Et & Deniz" },
  // Sebze
  { id: "tomato",   label: "Domates",     labelEn: "Tomato",       icon: "🍅", group: "Sebze" },
  { id: "onion",    label: "Soğan",       labelEn: "Onion",        icon: "🧅", group: "Sebze" },
  { id: "garlic",   label: "Sarımsak",    labelEn: "Garlic",       icon: "🧄", group: "Sebze" },
  { id: "pepper",   label: "Biber",       labelEn: "Pepper",       icon: "🫑", group: "Sebze" },
  { id: "lettuce",  label: "Marul",       labelEn: "Lettuce",      icon: "🥬", group: "Sebze" },
  { id: "carrot",   label: "Havuç",       labelEn: "Carrot",       icon: "🥕", group: "Sebze" },
  { id: "cucumber", label: "Salatalık",   labelEn: "Cucumber",     icon: "🥒", group: "Sebze" },
  { id: "eggplant", label: "Patlıcan",    labelEn: "Eggplant",     icon: "🍆", group: "Sebze" },
  { id: "corn",     label: "Mısır",       labelEn: "Corn",         icon: "🌽", group: "Sebze" },
  { id: "mushroom", label: "Mantar",      labelEn: "Mushroom",     icon: "🍄", group: "Sebze" },
  // Meyve
  { id: "lemon",    label: "Limon",       labelEn: "Lemon",        icon: "🍋", group: "Meyve" },
  { id: "strawberry",label:"Çilek",       labelEn: "Strawberry",   icon: "🍓", group: "Meyve" },
  { id: "banana",   label: "Muz",         labelEn: "Banana",       icon: "🍌", group: "Meyve" },
  { id: "orange",   label: "Portakal",    labelEn: "Orange",       icon: "🍊", group: "Meyve" },
  { id: "blueberry",label: "Yaban Mersini",labelEn:"Blueberry",    icon: "🫐", group: "Meyve" },
  { id: "apple",    label: "Elma",        labelEn: "Apple",        icon: "🍎", group: "Meyve" },
  { id: "mango",    label: "Mango",       labelEn: "Mango",        icon: "🥭", group: "Meyve" },
  { id: "cherry",   label: "Kiraz",       labelEn: "Cherry",       icon: "🍒", group: "Meyve" },
  { id: "peach",    label: "Şeftali",     labelEn: "Peach",        icon: "🍑", group: "Meyve" },
  // Kahve & İçecek
  { id: "espresso", label: "Espresso",    labelEn: "Espresso",     icon: "☕", group: "Kahve & İçecek" },
  { id: "coffee",   label: "Kahve",       labelEn: "Coffee",       icon: "🫘", group: "Kahve & İçecek" },
  { id: "tea",      label: "Çay",         labelEn: "Tea",          icon: "🍵", group: "Kahve & İçecek" },
  { id: "cocoa",    label: "Kakao",       labelEn: "Cocoa",        icon: "🍫", group: "Kahve & İçecek" },
  { id: "juice",    label: "Meyve Suyu",  labelEn: "Fruit Juice",  icon: "🧃", group: "Kahve & İçecek" },
  { id: "soda",     label: "Soda",        labelEn: "Soda",         icon: "🫧", group: "Kahve & İçecek" },
  { id: "ice",      label: "Buz",         labelEn: "Ice",          icon: "🧊", group: "Kahve & İçecek" },
  { id: "water",    label: "Su",          labelEn: "Water",        icon: "💧", group: "Kahve & İçecek" },
  // Tatlı & Fırın
  { id: "chocolate",label: "Çikolata",    labelEn: "Chocolate",    icon: "🍫", group: "Tatlı & Fırın" },
  { id: "honey",    label: "Bal",         labelEn: "Honey",        icon: "🍯", group: "Tatlı & Fırın" },
  { id: "caramel",  label: "Karamel",     labelEn: "Caramel",      icon: "🍮", group: "Tatlı & Fırın" },
  { id: "hazelnut", label: "Fındık",      labelEn: "Hazelnut",     icon: "🌰", group: "Tatlı & Fırın" },
  { id: "peanut",   label: "Fıstık",      labelEn: "Peanut",       icon: "🥜", group: "Tatlı & Fırın" },
  { id: "vanilla",  label: "Vanilya",     labelEn: "Vanilla",      icon: "🫙", group: "Tatlı & Fırın" },
  { id: "icecream", label: "Dondurma",    labelEn: "Ice Cream",    icon: "🍨", group: "Tatlı & Fırın" },
  { id: "cinnamon", label: "Tarçın",      labelEn: "Cinnamon",     icon: "🪵", group: "Tatlı & Fırın" },
  // Yağ & Sos
  { id: "oliveoil", label: "Zeytinyağı",  labelEn: "Olive Oil",    icon: "🫒", group: "Yağ & Sos" },
  { id: "tomatosauce",label:"Domates Sosu",labelEn:"Tomato Sauce", icon: "🥫", group: "Yağ & Sos" },
  { id: "mayo",     label: "Mayonez",     labelEn: "Mayonnaise",   icon: "🧴", group: "Yağ & Sos" },
  { id: "hotsauce", label: "Acı Sos",     labelEn: "Hot Sauce",    icon: "🌶️", group: "Yağ & Sos" },
  // Baharat & Ot
  { id: "mint",     label: "Nane",        labelEn: "Mint",         icon: "🌿", group: "Baharat & Ot" },
  { id: "basil",    label: "Fesleğen",    labelEn: "Basil",        icon: "🌱", group: "Baharat & Ot" },
  { id: "turmeric", label: "Zerdeçal",    labelEn: "Turmeric",     icon: "🟡", group: "Baharat & Ot" },
  { id: "pepper2",  label: "Karabiber",   labelEn: "Black Pepper", icon: "🫙", group: "Baharat & Ot" },
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
