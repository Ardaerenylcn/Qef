export type EffectType = "snow" | "hearts" | "stars" | "confetti" | null;

export interface SpecialDay {
  id: string;
  name: string;
  nameEn: string;
  /** "MM-DD" for annual, "YYYY-MM-DD" for specific year */
  ranges: Array<{ from: string; to: string }>;
  /** Level 1 — primaryColor override */
  primaryColor: string;
  /** Level 2 — decorative banner */
  banner: {
    emoji: string;
    deco: string[];           // decorative emoji row
    text: string;
    textEn: string;
    gradient: string;         // CSS background (gradient or solid)
    textColor: string;
    accentColor: string;      // border/divider accent
    effectType: EffectType;
  };
}

export const SPECIAL_DAYS: SpecialDay[] = [
  {
    id: "yilbasi",
    name: "Yılbaşı",
    nameEn: "New Year",
    ranges: [
      { from: "12-28", to: "12-31" },
      { from: "01-01", to: "01-05" },
    ],
    primaryColor: "#818cf8",
    banner: {
      emoji: "🎉",
      deco: ["❄️", "✨", "🥂", "🎇", "⭐", "❄️", "🎆", "✨", "🎉"],
      text: "Mutlu Yıllar! Yeni yılın tüm dileklerinizi gerçekleştirmesini dileriz.",
      textEn: "Happy New Year! Wishing you all the best in the coming year.",
      gradient: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
      textColor: "#e0e7ff",
      accentColor: "#818cf8",
      effectType: "snow",
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
      deco: ["🌹", "💝", "❤️", "💕", "🌹", "💗", "❤️", "💖", "🌸"],
      text: "Sevgililer Günü'nüz kutlu olsun! Sevdiklerinizle keyifli ve romantik vakitler dileriz.",
      textEn: "Happy Valentine's Day! Wishing you a wonderful time with your loved ones.",
      gradient: "linear-gradient(135deg, #fce7f3 0%, #fda4af 40%, #fce7f3 100%)",
      textColor: "#9f1239",
      accentColor: "#fb7185",
      effectType: "hearts",
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
      deco: ["🌙", "✨", "🕌", "⭐", "🌙", "✨", "🕌", "⭐", "🌟"],
      text: "Hayırlı Ramazanlar! Bu mübarek ayda huzur, sağlık ve bereket dileriz.",
      textEn: "Ramadan Mubarak! Wishing you peace, health and blessings this holy month.",
      gradient: "linear-gradient(135deg, #1c1917 0%, #292524 50%, #1c1917 100%)",
      textColor: "#fde68a",
      accentColor: "#d97706",
      effectType: "stars",
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
      deco: ["🌙", "🎉", "✨", "🌟", "🌙", "🎊", "⭐", "✨", "🎉"],
      text: "İyi Bayramlar! Ramazan Bayramınız mübarek, sağlıklı ve huzurlu geçsin.",
      textEn: "Eid Mubarak! Wishing you a joyful and blessed Eid al-Fitr.",
      gradient: "linear-gradient(135deg, #1c1917 0%, #292524 50%, #1c1917 100%)",
      textColor: "#fde68a",
      accentColor: "#d97706",
      effectType: "stars",
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
      deco: ["🇹🇷", "🎉", "🌸", "🎈", "🇹🇷", "🌷", "🎊", "🌸", "🇹🇷"],
      text: "23 Nisan Ulusal Egemenlik ve Çocuk Bayramı kutlu olsun! Geleceğimiz çocuklarımıza armağan olsun.",
      textEn: "Happy April 23rd! National Sovereignty and Children's Day — our future belongs to the children.",
      gradient: "linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%)",
      textColor: "#ffffff",
      accentColor: "#fca5a5",
      effectType: "confetti",
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
      deco: ["🌹", "✊", "🌺", "🌹", "💪", "🌷", "🌹", "✊", "🌺"],
      text: "1 Mayıs Emek ve Dayanışma Günü kutlu olsun! Emeğe saygı, dayanışmaya güç.",
      textEn: "Happy International Workers' Day! Solidarity and respect for labour.",
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
      deco: ["🇹🇷", "⚡", "🏃", "🇹🇷", "💪", "🌟", "🇹🇷", "⚡", "🏅"],
      text: "19 Mayıs Atatürk'ü Anma, Gençlik ve Spor Bayramı kutlu olsun! Ne mutlu Türküm diyene.",
      textEn: "Happy May 19th! Commemoration of Atatürk, Youth and Sports Day.",
      gradient: "linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%)",
      textColor: "#ffffff",
      accentColor: "#fca5a5",
      effectType: "confetti",
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
      deco: ["🌙", "🎉", "✨", "🌟", "🌙", "🎊", "⭐", "✨", "🎉"],
      text: "Kurban Bayramınız Mübarek Olsun! Sevdiklerinizle güzel ve huzurlu bir bayram dileriz.",
      textEn: "Eid al-Adha Mubarak! Wishing you a blessed and peaceful Eid with your loved ones.",
      gradient: "linear-gradient(135deg, #1c1917 0%, #292524 50%, #1c1917 100%)",
      textColor: "#fde68a",
      accentColor: "#d97706",
      effectType: "stars",
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
      deco: ["🇹🇷", "🎉", "⭐", "🇹🇷", "✨", "🎊", "🇹🇷", "⭐", "🎆"],
      text: "29 Ekim Cumhuriyet Bayramımız Kutlu Olsun! Cumhuriyetimiz 101 yaşında, yaşasın Türkiye!",
      textEn: "Happy 29th October Republic Day of Turkey! Our Republic is 101 years strong!",
      gradient: "linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%)",
      textColor: "#ffffff",
      accentColor: "#fca5a5",
      effectType: "confetti",
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
      deco: ["🌙", "✨", "🕌", "⭐", "🌙", "✨", "🕌", "⭐", "🌟"],
      text: "Hayırlı Ramazanlar! Bu mübarek ayda huzur, sağlık ve bereket dileriz.",
      textEn: "Ramadan Mubarak! Wishing you peace, health and blessings this holy month.",
      gradient: "linear-gradient(135deg, #1c1917 0%, #292524 50%, #1c1917 100%)",
      textColor: "#fde68a",
      accentColor: "#d97706",
      effectType: "stars",
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
      deco: ["🌙", "🎉", "✨", "🌟", "🌙", "🎊", "⭐", "✨", "🎉"],
      text: "İyi Bayramlar! Ramazan Bayramınız mübarek, sağlıklı ve huzurlu geçsin.",
      textEn: "Eid Mubarak! Wishing you a joyful and blessed Eid al-Fitr.",
      gradient: "linear-gradient(135deg, #1c1917 0%, #292524 50%, #1c1917 100%)",
      textColor: "#fde68a",
      accentColor: "#d97706",
      effectType: "stars",
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
      deco: ["🌙", "🎉", "✨", "🌟", "🌙", "🎊", "⭐", "✨", "🎉"],
      text: "Kurban Bayramınız Mübarek Olsun! Sevdiklerinizle güzel ve huzurlu bir bayram dileriz.",
      textEn: "Eid al-Adha Mubarak! Wishing you a blessed and peaceful Eid with your loved ones.",
      gradient: "linear-gradient(135deg, #1c1917 0%, #292524 50%, #1c1917 100%)",
      textColor: "#fde68a",
      accentColor: "#d97706",
      effectType: "stars",
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
      deco: ["🎄", "⭐", "🎁", "❄️", "🦌", "🎅", "🎄", "⭐", "🎁"],
      text: "Mutlu Noeller! Sevdiklerinizle sıcak ve neşeli bir tatil geçirmenizi dileriz.",
      textEn: "Merry Christmas! Wishing you a warm and joyful holiday with your loved ones.",
      gradient: "linear-gradient(135deg, #14532d 0%, #166534 50%, #15803d 100%)",
      textColor: "#fef9c3",
      accentColor: "#4ade80",
      effectType: "snow",
    },
  },
];

function isInRange(now: Date, from: string, to: string): boolean {
  if (from.length === 10) {
    const fromDate = new Date(from + "T00:00:00");
    const toDate = new Date(to + "T23:59:59");
    return now >= fromDate && now <= toDate;
  }

  const year = now.getFullYear();
  const [fm, fd] = from.split("-").map(Number);
  const [tm, td] = to.split("-").map(Number);
  const fromMD = fm * 100 + fd;
  const toMD = tm * 100 + td;

  if (fromMD <= toMD) {
    const fromDate = new Date(year, fm - 1, fd, 0, 0, 0);
    const toDate = new Date(year, tm - 1, td, 23, 59, 59);
    return now >= fromDate && now <= toDate;
  } else {
    const fromThisYear = new Date(year, fm - 1, fd, 0, 0, 0);
    const toNextYear = new Date(year + 1, tm - 1, td, 23, 59, 59);
    const fromLastYear = new Date(year - 1, fm - 1, fd, 0, 0, 0);
    const toThisYear = new Date(year, tm - 1, td, 23, 59, 59);
    return (
      (now >= fromThisYear && now <= toNextYear) ||
      (now >= fromLastYear && now <= toThisYear)
    );
  }
}

export function getActiveSpecialDay(now: Date = new Date()): SpecialDay | null {
  for (const day of SPECIAL_DAYS) {
    for (const range of day.ranges) {
      if (isInRange(now, range.from, range.to)) return day;
    }
  }
  return null;
}
