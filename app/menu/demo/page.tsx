import Image from "next/image";
import CategoryTabs from "@/components/CategoryTabs";
import MenuProductList from "@/components/MenuProductList";

const PRIMARY = "#f97316";
const LOGO  = "/demo/logo.png";
const COVER = "/demo/cafe-cover.png";

const PRODUCTS = [
  // Kahveler
  { id: "1", name: "Türk Kahvesi",     name_en: "Turkish Coffee",  price: 35,  category: "Kahveler",         description: "Geleneksel tarif, köpüklü",         description_en: "Traditional, foamy",           image_url: "/demo/turk-kahvesi.png",    tags: ["Popüler"], in_stock: true,  position: 0 },
  { id: "2", name: "Sütlü Latte",      name_en: "Latte",           price: 55,  category: "Kahveler",         description: "Buharda ısıtılmış süt ile",         description_en: "With steamed milk",            image_url: "/demo/latte.png",           tags: [],         in_stock: true,  position: 1 },
  { id: "3", name: "Cappuccino",       name_en: "Cappuccino",      price: 50,  category: "Kahveler",         description: "Yoğun espresso, kadifemsi köpük",  description_en: "Intense espresso, velvety",     image_url: "/demo/Capuccino.png",       tags: ["Yeni"],   in_stock: true,  position: 2 },
  { id: "4", name: "Americano",        name_en: "Americano",       price: 45,  category: "Kahveler",         description: "Sıcak su ile uzatılmış espresso",  description_en: "Espresso with hot water",       image_url: "/demo/americano.png",       tags: [],         in_stock: true,  position: 3 },
  // Soğuk İçecekler
  { id: "5", name: "Ice Latte",        name_en: "Iced Latte",      price: 65,  category: "Soğuk İçecekler",  description: "Buzlu, ferahlatıcı",               description_en: "Iced, refreshing",             image_url: "/demo/ice-latte.png",       tags: ["Popüler"], in_stock: true,  position: 0 },
  { id: "6", name: "Limonata",         name_en: "Lemonade",        price: 45,  category: "Soğuk İçecekler",  description: "Taze sıkılmış limon",              description_en: "Freshly squeezed",             image_url: "/demo/limonata.png",        tags: ["Vegan"],  in_stock: true,  position: 1 },
  { id: "7", name: "Mango Smoothie",   name_en: "Mango Smoothie",  price: 70,  category: "Soğuk İçecekler",  description: "Taze mango, yoğurt",               description_en: "Fresh mango, yogurt",          image_url: "/demo/mango-smootihe.png",  tags: ["Yeni"],   in_stock: false, position: 2 },
  // Tatlılar
  { id: "8", name: "Cheesecake",       name_en: "Cheesecake",      price: 80,  category: "Tatlılar",         description: "Ev yapımı, mevsim meyveli",        description_en: "Homemade, seasonal fruit",      image_url: "/demo/cheescake.png",       tags: ["Popüler"], in_stock: true,  position: 0 },
  { id: "9", name: "Waffle",           name_en: "Waffle",          price: 75,  category: "Tatlılar",         description: "Çikolata sosu ve dondurma ile",    description_en: "Chocolate sauce & ice cream",  image_url: "/demo/waffle.png",          tags: [],         in_stock: true,  position: 1 },
  { id:"10", name: "Fındıklı Kurabiye",name_en: "Hazelnut Cookie",  price: 40,  category: "Tatlılar",         description: "Günlük taze pişirilir",            description_en: "Freshly baked daily",          image_url: "/demo/cookie.png",          tags: ["Vegan"],  in_stock: true,  position: 2 },
];

const CATS = ["Kahveler", "Soğuk İçecekler", "Tatlılar"];

export default function DemoMenuPage() {
  return (
    <main style={{ backgroundColor: "#fffbf7", color: "#1f2937" }} className="min-h-screen">

      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <Image src={LOGO} alt="Logo" width={32} height={32} className="w-8 h-8 rounded-lg object-cover" />
        <span className="font-bold text-gray-800 text-sm">Arôme Café</span>
        <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-600">Açık</span>
      </div>

      {/* Kapak */}
      <div className="relative w-full h-40 overflow-hidden">
        <Image src={COVER} alt="Kapak" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <p className="font-extrabold text-xl drop-shadow">Arôme Café</p>
          <p className="text-xs text-white/80 mt-0.5">Sıcak içecekler & tatlılar</p>
        </div>
      </div>

      {/* Tabs */}
      <CategoryTabs categories={CATS} primaryColor={PRIMARY} bgColor="#fffbf7" />

      <div className="max-w-md mx-auto px-4 py-6">
        <MenuProductList
          products={PRODUCTS}
          orderedCats={CATS}
          primaryColor={PRIMARY}
          isEn={false}
          productLayout="list"
          imageRatio="square"
        />
      </div>

      <p className="text-center text-[10px] text-gray-300 pb-6">Bu bir demo menüdür · qef.app</p>
    </main>
  );
}
