export type EffectType =
  | "snow"       // Yılbaşı, Noel
  | "hearts"     // Sevgililer
  | "stars"      // Ramazan
  | "confetti"   // Milli bayramlar
  | "fireworks"  // Cumhuriyet
  | "steam"      // Dünya Kahve Günü
  | "sakura"     // Kadınlar Günü / Bahar
  | "leaves"     // Sonbahar
  | null;

export interface SpecialDay {
  id: string;
  name: string;
  nameEn: string;
  ranges: Array<{ from: string; to: string }>;
  primaryColor: string;
  banner: {
    emoji: string;
    text: string;
    textEn: string;
    gradient: string;
    textColor: string;
    accentColor: string;
    effectType: EffectType;
    hasOrnaments?: boolean;
    isFlagDay?: boolean;
    hasLantern?: boolean;
    heroImage?: string;  // public/ klasöründeki dosya yolu, ör: "/ataturk.jpg"
  };
}

export const SPECIAL_DAYS: SpecialDay[] = [
  {
    id: "yilbasi",
    name: "Yılbaşı",
    nameEn: "New Year",
    ranges: [{ from: "12-28", to: "12-31" }, { from: "01-01", to: "01-05" }],
    primaryColor: "#818cf8",
    banner: {
      emoji: "🎉",
      text: "Mutlu Yıllar! Yeni yılın tüm dileklerinizi gerçekleştirmesini dileriz.",
      textEn: "Happy New Year! Wishing you all the best in the coming year.",
      gradient: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
      textColor: "#e0e7ff",
      accentColor: "#818cf8",
      effectType: "snow",
      hasOrnaments: true,
    },
  },
  {
    id: "sevgililer",
    name: "Sevgililer Günü",
    nameEn: "Valentine's Day",
    ranges: [{ from: "02-12", to: "02-16" }],
    primaryColor: "#f43f5e",
    banner: {
      emoji: "❤️",
      text: "Sevgililer Günü'nüz kutlu olsun! Sevdiklerinizle keyifli vakitler dileriz.",
      textEn: "Happy Valentine's Day! Wishing you a wonderful time with your loved ones.",
      gradient: "linear-gradient(135deg, #fce7f3 0%, #fda4af 40%, #fce7f3 100%)",
      textColor: "#9f1239",
      accentColor: "#fb7185",
      effectType: "hearts",
      hasOrnaments: true,
    },
  },
  {
    id: "kadinlar-gunu",
    name: "Dünya Kadınlar Günü",
    nameEn: "International Women's Day",
    ranges: [{ from: "03-07", to: "03-09" }],
    primaryColor: "#db2777",
    banner: {
      emoji: "🌸",
      text: "8 Mart Dünya Kadınlar Günü kutlu olsun! Güçlü, özgür, eşit bir dünya için.",
      textEn: "Happy International Women's Day! For a stronger, freer, equal world.",
      gradient: "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fdf2f8 100%)",
      textColor: "#831843",
      accentColor: "#ec4899",
      effectType: "sakura",
    },
  },
  {
    id: "bahar",
    name: "Bahar",
    nameEn: "Spring",
    ranges: [{ from: "03-20", to: "03-22" }],
    primaryColor: "#16a34a",
    banner: {
      emoji: "🌸",
      text: "Bahar geldi! Çiçekler açsın, renkler coşsun, doğa yenilensin.",
      textEn: "Spring is here! Let flowers bloom and nature renew.",
      gradient: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #fdf2f8 100%)",
      textColor: "#14532d",
      accentColor: "#4ade80",
      effectType: "sakura",
    },
  },
  {
    id: "ramazan-2025",
    name: "Ramazan",
    nameEn: "Ramadan",
    ranges: [{ from: "2025-03-01", to: "2025-03-29" }],
    primaryColor: "#d97706",
    banner: {
      emoji: "🌙",
      text: "Hayırlı Ramazanlar! Bu mübarek ayda huzur, sağlık ve bereket dileriz.",
      textEn: "Ramadan Mubarak! Wishing you peace, health and blessings this holy month.",
      gradient: "linear-gradient(135deg, #1c1917 0%, #292524 50%, #1c1917 100%)",
      textColor: "#fde68a",
      accentColor: "#d97706",
      effectType: "stars",
      hasLantern: true,
    },
  },
  {
    id: "ramazan-bayrami-2025",
    name: "Ramazan Bayramı",
    nameEn: "Eid al-Fitr",
    ranges: [{ from: "2025-03-30", to: "2025-04-02" }],
    primaryColor: "#d97706",
    banner: {
      emoji: "🌙",
      text: "İyi Bayramlar! Ramazan Bayramınız mübarek, sağlıklı ve huzurlu geçsin.",
      textEn: "Eid Mubarak! Wishing you a joyful and blessed Eid al-Fitr.",
      gradient: "linear-gradient(135deg, #1c1917 0%, #292524 50%, #1c1917 100%)",
      textColor: "#fde68a",
      accentColor: "#d97706",
      effectType: "stars",
      hasLantern: true,
    },
  },
  {
    id: "23-nisan",
    name: "23 Nisan",
    nameEn: "April 23",
    ranges: [{ from: "04-21", to: "04-24" }],
    primaryColor: "#ef4444",
    banner: {
      emoji: "🇹🇷",
      text: "23 Nisan Ulusal Egemenlik ve Çocuk Bayramı kutlu olsun!",
      textEn: "Happy April 23rd! National Sovereignty and Children's Day.",
      gradient: "linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%)",
      textColor: "#ffffff",
      accentColor: "#fca5a5",
      effectType: "confetti",
      isFlagDay: true,
      heroImage: "/nisan.jpg",
    },
  },
  {
    id: "1-mayis",
    name: "1 Mayıs",
    nameEn: "May Day",
    ranges: [{ from: "04-30", to: "05-02" }],
    primaryColor: "#ef4444",
    banner: {
      emoji: "🌹",
      text: "1 Mayıs Emek ve Dayanışma Günü kutlu olsun!",
      textEn: "Happy International Workers' Day!",
      gradient: "linear-gradient(135deg, #dc2626 0%, #9f1239 60%, #881337 100%)",
      textColor: "#ffffff",
      accentColor: "#fca5a5",
      effectType: "confetti",
    },
  },
  {
    id: "19-mayis",
    name: "19 Mayıs",
    nameEn: "May 19",
    ranges: [{ from: "05-17", to: "05-20" }],
    primaryColor: "#ef4444",
    banner: {
      emoji: "🇹🇷",
      text: "19 Mayıs Atatürk'ü Anma, Gençlik ve Spor Bayramı kutlu olsun!",
      textEn: "Happy May 19th! Commemoration of Atatürk, Youth and Sports Day.",
      gradient: "linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%)",
      textColor: "#ffffff",
      accentColor: "#fca5a5",
      effectType: "confetti",
      isFlagDay: true,
      heroImage: "/nisan.jpg",
    },
  },
  {
    id: "kurban-2025",
    name: "Kurban Bayramı",
    nameEn: "Eid al-Adha",
    ranges: [{ from: "2025-06-06", to: "2025-06-10" }],
    primaryColor: "#d97706",
    banner: {
      emoji: "🌙",
      text: "Kurban Bayramınız Mübarek Olsun!",
      textEn: "Eid al-Adha Mubarak!",
      gradient: "linear-gradient(135deg, #1c1917 0%, #292524 50%, #1c1917 100%)",
      textColor: "#fde68a",
      accentColor: "#d97706",
      effectType: "stars",
      hasLantern: true,
    },
  },
  {
    id: "sonbahar",
    name: "Sonbahar",
    nameEn: "Autumn",
    ranges: [{ from: "09-22", to: "09-30" }],
    primaryColor: "#ea580c",
    banner: {
      emoji: "🍂",
      text: "Sonbahar geldi. Sıcak bir fincan kahveyle keyifli dakikalar dileriz.",
      textEn: "Autumn is here. Wishing you cozy moments with a warm cup.",
      gradient: "linear-gradient(135deg, #431407 0%, #7c2d12 50%, #431407 100%)",
      textColor: "#fed7aa",
      accentColor: "#ea580c",
      effectType: "leaves",
    },
  },
  {
    id: "kahve-gunu",
    name: "Dünya Kahve Günü",
    nameEn: "World Coffee Day",
    ranges: [{ from: "10-01", to: "10-02" }],
    primaryColor: "#92400e",
    banner: {
      emoji: "☕",
      text: "Dünya Kahve Günü kutlu olsun! İyi kahveler, güzel anlar.",
      textEn: "Happy World Coffee Day! Good coffee, great moments.",
      gradient: "linear-gradient(135deg, #1c1004 0%, #3b1a08 50%, #1c1004 100%)",
      textColor: "#fde68a",
      accentColor: "#92400e",
      effectType: "steam",
    },
  },
  {
    id: "cumhuriyet",
    name: "Cumhuriyet Bayramı",
    nameEn: "Republic Day",
    ranges: [{ from: "10-27", to: "10-30" }],
    primaryColor: "#ef4444",
    banner: {
      emoji: "🇹🇷",
      text: "29 Ekim Cumhuriyet Bayramımız Kutlu Olsun! Yaşasın Cumhuriyet!",
      textEn: "Happy 29th October Republic Day of Turkey!",
      gradient: "linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%)",
      textColor: "#ffffff",
      accentColor: "#fca5a5",
      effectType: "fireworks",
      isFlagDay: true,
    },
  },
  {
    id: "ramazan-2026",
    name: "Ramazan",
    nameEn: "Ramadan",
    ranges: [{ from: "2026-02-18", to: "2026-03-18" }],
    primaryColor: "#d97706",
    banner: {
      emoji: "🌙",
      text: "Hayırlı Ramazanlar! Bu mübarek ayda huzur, sağlık ve bereket dileriz.",
      textEn: "Ramadan Mubarak! Wishing you peace, health and blessings.",
      gradient: "linear-gradient(135deg, #1c1917 0%, #292524 50%, #1c1917 100%)",
      textColor: "#fde68a",
      accentColor: "#d97706",
      effectType: "stars",
      hasLantern: true,
    },
  },
  {
    id: "ramazan-bayrami-2026",
    name: "Ramazan Bayramı",
    nameEn: "Eid al-Fitr",
    ranges: [{ from: "2026-03-19", to: "2026-03-22" }],
    primaryColor: "#d97706",
    banner: {
      emoji: "🌙",
      text: "İyi Bayramlar! Ramazan Bayramınız mübarek olsun.",
      textEn: "Eid Mubarak! Happy Eid al-Fitr.",
      gradient: "linear-gradient(135deg, #1c1917 0%, #292524 50%, #1c1917 100%)",
      textColor: "#fde68a",
      accentColor: "#d97706",
      effectType: "stars",
      hasLantern: true,
    },
  },
  {
    id: "kurban-2026",
    name: "Kurban Bayramı",
    nameEn: "Eid al-Adha",
    ranges: [{ from: "2026-05-26", to: "2026-05-30" }],
    primaryColor: "#d97706",
    banner: {
      emoji: "🌙",
      text: "Kurban Bayramınız Mübarek Olsun!",
      textEn: "Eid al-Adha Mubarak!",
      gradient: "linear-gradient(135deg, #1c1917 0%, #292524 50%, #1c1917 100%)",
      textColor: "#fde68a",
      accentColor: "#d97706",
      effectType: "stars",
      hasLantern: true,
    },
  },
  {
    id: "noel",
    name: "Noel",
    nameEn: "Christmas",
    ranges: [{ from: "12-22", to: "12-27" }],
    primaryColor: "#16a34a",
    banner: {
      emoji: "🎄",
      text: "Mutlu Noeller! Sevdiklerinizle sıcak bir tatil dileriz.",
      textEn: "Merry Christmas! Wishing you a warm holiday with loved ones.",
      gradient: "linear-gradient(135deg, #14532d 0%, #166534 50%, #15803d 100%)",
      textColor: "#fef9c3",
      accentColor: "#4ade80",
      effectType: "snow",
      hasOrnaments: true,
    },
  },
];

function isInRange(now: Date, from: string, to: string): boolean {
  if (from.length === 10) {
    return now >= new Date(from + "T00:00:00") && now <= new Date(to + "T23:59:59");
  }
  const year = now.getFullYear();
  const [fm, fd] = from.split("-").map(Number);
  const [tm, td] = to.split("-").map(Number);
  const fromMD = fm * 100 + fd;
  const toMD = tm * 100 + td;
  if (fromMD <= toMD) {
    return now >= new Date(year, fm - 1, fd) && now <= new Date(year, tm - 1, td, 23, 59, 59);
  }
  return (
    (now >= new Date(year, fm - 1, fd) && now <= new Date(year + 1, tm - 1, td, 23, 59, 59)) ||
    (now >= new Date(year - 1, fm - 1, fd) && now <= new Date(year, tm - 1, td, 23, 59, 59))
  );
}

export function getActiveSpecialDay(now: Date = new Date()): SpecialDay | null {
  for (const day of SPECIAL_DAYS) {
    for (const range of day.ranges) {
      if (isInRange(now, range.from, range.to)) return day;
    }
  }
  return null;
}
