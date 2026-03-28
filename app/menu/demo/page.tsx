import Image from "next/image";
import CategoryTabs from "@/components/CategoryTabs";
import MenuProductList from "@/components/MenuProductList";
import DemoScrollFix from "@/components/DemoScrollFix";

const PRIMARY = "#f97316";
const LOGO  = "/demo/logo.png";
const COVER = "/demo/cafe-cover.png";

const PRODUCTS = [
  // Kahveler
  { id: "1",  name: "Türk Kahvesi",     name_en: "Turkish Coffee",   price: 35,  category: "Kahveler",         description: "Geleneksel tarif, köpüklü",          description_en: "Traditional, foamy",            image_url: "/demo/turk-kahvesi.png",    tags: ["Popüler"],       ingredients: ["espresso","milk"],                             in_stock: true,  position: 0 },
  { id: "2",  name: "Sütlü Latte",      name_en: "Latte",            price: 55,  category: "Kahveler",         description: "Buharda ısıtılmış süt ile",          description_en: "With steamed milk",             image_url: "/demo/latte.png",           tags: [],                ingredients: ["espresso","milk","cream"],                     in_stock: true,  position: 1 },
  { id: "3",  name: "Cappuccino",       name_en: "Cappuccino",       price: 50,  category: "Kahveler",         description: "Yoğun espresso, kadifemsi köpük",   description_en: "Intense espresso, velvety",     image_url: "/demo/Capuccino.png",       tags: ["Yeni"],          ingredients: ["espresso","milk"],                             in_stock: true,  position: 2 },
  { id: "4",  name: "Americano",        name_en: "Americano",        price: 45,  category: "Kahveler",         description: "Sıcak su ile uzatılmış espresso",   description_en: "Espresso with hot water",       image_url: "/demo/americano.png",       tags: [],                ingredients: ["espresso","water"],                            in_stock: true,  position: 3 },
  { id: "11", name: "Flat White",       name_en: "Flat White",       price: 58,  category: "Kahveler",         description: "Ristretto üzeri kadifemsi süt",     description_en: "Ristretto with velvety milk",   image_url: null,                        tags: ["Öne Çıkan"],     ingredients: ["espresso","milk"],                             in_stock: true,  position: 4 },
  { id: "12", name: "Cold Brew",        name_en: "Cold Brew",        price: 70,  category: "Kahveler",         description: "12 saat soğuk demleme, yumuşak tat",description_en: "12h cold steep, smooth taste",  image_url: null,                        tags: ["Popüler","Yeni"],ingredients: ["coffee","water","ice"],                        in_stock: true,  position: 5 },
  // Soğuk İçecekler
  { id: "5",  name: "Ice Latte",        name_en: "Iced Latte",       price: 65,  category: "Soğuk İçecekler",  description: "Buzlu, ferahlatıcı",                description_en: "Iced, refreshing",              image_url: "/demo/ice-latte.png",       tags: ["Popüler"],       ingredients: ["espresso","milk","ice"],                       in_stock: true,  position: 0 },
  { id: "6",  name: "Limonata",         name_en: "Lemonade",         price: 45,  category: "Soğuk İçecekler",  description: "Taze sıkılmış limon",               description_en: "Freshly squeezed",              image_url: "/demo/limonata.png",        tags: [],                ingredients: ["lemon","water","sugar","ice"],                 in_stock: true,  position: 1 },
  { id: "7",  name: "Mango Smoothie",   name_en: "Mango Smoothie",   price: 70,  category: "Soğuk İçecekler",  description: "Taze mango, yoğurt",                description_en: "Fresh mango, yogurt",           image_url: "/demo/mango-smootihe.png",  tags: ["Yeni"],          ingredients: ["mango","yogurt","ice"],                        in_stock: false, position: 2 },
  { id: "13", name: "Matcha Latte",     name_en: "Matcha Latte",     price: 72,  category: "Soğuk İçecekler",  description: "Japonya çayı, soğuk süt köpüğü",   description_en: "Japanese tea, cold foam",       image_url: null,                        tags: ["Öne Çıkan"],     ingredients: ["tea","milk","ice","sugar"],                    in_stock: true,  position: 3 },
  { id: "14", name: "Berry Smoothie",   name_en: "Berry Smoothie",   price: 68,  category: "Soğuk İçecekler",  description: "Çilek, yaban mersini, yoğurt",      description_en: "Strawberry, blueberry, yogurt", image_url: null,                        tags: ["Popüler"],       ingredients: ["strawberry","blueberry","yogurt","ice"],       in_stock: true,  position: 4 },
  // Tatlılar
  { id: "8",  name: "Cheesecake",       name_en: "Cheesecake",       price: 80,  category: "Tatlılar",         description: "Ev yapımı, mevsim meyveli",         description_en: "Homemade, seasonal fruit",      image_url: "/demo/cheescake.png",       tags: ["Popüler"],       ingredients: ["flour","egg","butter","sugar","cheese","cream"],in_stock: true,  position: 0 },
  { id: "9",  name: "Waffle",           name_en: "Waffle",           price: 75,  category: "Tatlılar",         description: "Çikolata sosu ve dondurma ile",     description_en: "Chocolate sauce & ice cream",   image_url: "/demo/waffle.png",          tags: [],                ingredients: ["flour","egg","milk","butter","chocolate","icecream"], in_stock: true,  position: 1 },
  { id: "10", name: "Fındıklı Kurabiye",name_en: "Hazelnut Cookie",  price: 40,  category: "Tatlılar",         description: "Günlük taze pişirilir",             description_en: "Freshly baked daily",           image_url: "/demo/cookie.png",          tags: [],                ingredients: ["flour","sugar","hazelnut","butter"],           in_stock: true,  position: 2 },
  { id: "15", name: "Brownie",          name_en: "Brownie",          price: 65,  category: "Tatlılar",         description: "Bitter çikolatalı, fındıklı",       description_en: "Dark chocolate & hazelnut",     image_url: null,                        tags: ["Şefin Seçimi"],  ingredients: ["chocolate","butter","egg","flour","hazelnut"], in_stock: true,  position: 3 },
  { id: "16", name: "Tiramisu",         name_en: "Tiramisu",         price: 85,  category: "Tatlılar",         description: "İtalyan usulü, espressolu",         description_en: "Italian style, espresso",       image_url: null,                        tags: ["Öne Çıkan"],     ingredients: ["cream","espresso","cocoa","egg","sugar"],      in_stock: true,  position: 4 },
  // Atıştırmalıklar
  { id: "17", name: "Avokado Toast",    name_en: "Avocado Toast",    price: 90,  category: "Atıştırmalıklar",  description: "Tam tahıllı ekmek, limon, tuz",     description_en: "Whole grain, lemon, salt",      image_url: null,                        tags: ["Yeni","Öne Çıkan"],ingredients: ["flour","oliveoil","lemon","salt"],             in_stock: true,  position: 0 },
  { id: "18", name: "Granola Bowl",     name_en: "Granola Bowl",     price: 75,  category: "Atıştırmalıklar",  description: "Yulaf, bal, mevsim meyveleri",      description_en: "Oat, honey, seasonal fruit",    image_url: null,                        tags: ["Popüler"],       ingredients: ["oat","honey","yogurt","strawberry","banana"],  in_stock: true,  position: 1 },
  { id: "19", name: "Peynirli Tost",    name_en: "Cheese Toast",     price: 55,  category: "Atıştırmalıklar",  description: "Çıtır ekmek, eritilmiş kaşar",      description_en: "Crispy bread, melted cheese",   image_url: null,                        tags: [],                ingredients: ["flour","cheese","butter"],                     in_stock: true,  position: 2 },
];

const CATS = ["Kahveler", "Soğuk İçecekler", "Tatlılar", "Atıştırmalıklar"];

export default function DemoMenuPage() {
  return (
    <div data-demo-scroll style={{ position: "fixed", inset: 0, overflowY: "auto", overscrollBehavior: "none", touchAction: "pan-y", backgroundColor: "#fffbf7", color: "#1f2937" } as React.CSSProperties}>
      <DemoScrollFix />

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
    </div>
  );
}
