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
    text: string;
    textEn: string;
    bg: string;
    textColor: string;
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
    primaryColor: "#6366f1",
    banner: {
      emoji: "🎉",
      text: "Mutlu Yıllar! Yeni yılın tüm dileklerinizi gerçekleştirmesini dileriz.",
      textEn: "Happy New Year! Wishing you all the best in the new year.",
      bg: "#0f0f2e",
      textColor: "#c7d2fe",
    },
  },
  {
    id: "sevgililer",
    name: "Sevgililer Günü",
    nameEn: "Valentine's Day",
    ranges: [{ from: "02-12", to: "02-16" }],
    primaryColor: "#e11d48",
    banner: {
      emoji: "❤️",
      text: "Sevgililer Günü'nüz kutlu olsun! Sevdiklerinizle keyifli vakitler dileriz.",
      textEn: "Happy Valentine's Day! Enjoy special moments with your loved ones.",
      bg: "#fff1f2",
      textColor: "#9f1239",
    },
  },
  {
    id: "ramazan-2025",
    name: "Ramazan",
    nameEn: "Ramadan",
    ranges: [{ from: "2025-03-01", to: "2025-03-29" }],
    primaryColor: "#92400e",
    banner: {
      emoji: "🌙",
      text: "Hayırlı Ramazanlar! Bu mübarek ayda huzur ve bereket dileriz.",
      textEn: "Ramadan Mubarak! Wishing you peace and blessings this holy month.",
      bg: "#1c1917",
      textColor: "#fde68a",
    },
  },
  {
    id: "ramazan-bayrami-2025",
    name: "Ramazan Bayramı",
    nameEn: "Eid al-Fitr",
    ranges: [{ from: "2025-03-30", to: "2025-04-02" }],
    primaryColor: "#92400e",
    banner: {
      emoji: "🌙",
      text: "İyi Bayramlar! Ramazan Bayramınız mübarek ve kutlu olsun.",
      textEn: "Eid Mubarak! Happy Eid al-Fitr to you and your loved ones.",
      bg: "#1c1917",
      textColor: "#fde68a",
    },
  },
  {
    id: "23-nisan",
    name: "23 Nisan",
    nameEn: "April 23",
    ranges: [{ from: "04-21", to: "04-24" }],
    primaryColor: "#dc2626",
    banner: {
      emoji: "🇹🇷",
      text: "23 Nisan Ulusal Egemenlik ve Çocuk Bayramı kutlu olsun!",
      textEn: "Happy April 23, National Sovereignty and Children's Day!",
      bg: "#fef2f2",
      textColor: "#991b1b",
    },
  },
  {
    id: "1-mayis",
    name: "1 Mayıs",
    nameEn: "May Day",
    ranges: [{ from: "04-30", to: "05-02" }],
    primaryColor: "#dc2626",
    banner: {
      emoji: "🌹",
      text: "1 Mayıs Emek ve Dayanışma Günü kutlu olsun!",
      textEn: "Happy International Workers' Day!",
      bg: "#fef2f2",
      textColor: "#991b1b",
    },
  },
  {
    id: "19-mayis",
    name: "19 Mayıs",
    nameEn: "May 19",
    ranges: [{ from: "05-17", to: "05-20" }],
    primaryColor: "#dc2626",
    banner: {
      emoji: "🇹🇷",
      text: "19 Mayıs Atatürk'ü Anma, Gençlik ve Spor Bayramı kutlu olsun!",
      textEn: "Happy May 19, Youth and Sports Day!",
      bg: "#fef2f2",
      textColor: "#991b1b",
    },
  },
  {
    id: "kurban-2025",
    name: "Kurban Bayramı",
    nameEn: "Eid al-Adha",
    ranges: [{ from: "2025-06-06", to: "2025-06-10" }],
    primaryColor: "#92400e",
    banner: {
      emoji: "🌙",
      text: "Kurban Bayramınız Mübarek Olsun! Sevdiklerinizle güzel bir bayram dileriz.",
      textEn: "Eid al-Adha Mubarak! Wishing you a blessed Eid.",
      bg: "#1c1917",
      textColor: "#fde68a",
    },
  },
  {
    id: "cumhuriyet",
    name: "Cumhuriyet Bayramı",
    nameEn: "Republic Day",
    ranges: [{ from: "10-27", to: "10-30" }],
    primaryColor: "#dc2626",
    banner: {
      emoji: "🇹🇷",
      text: "29 Ekim Cumhuriyet Bayramımız Kutlu Olsun!",
      textEn: "Happy 29th October Republic Day of Turkey!",
      bg: "#fef2f2",
      textColor: "#991b1b",
    },
  },
  {
    id: "ramazan-2026",
    name: "Ramazan",
    nameEn: "Ramadan",
    ranges: [{ from: "2026-02-18", to: "2026-03-18" }],
    primaryColor: "#92400e",
    banner: {
      emoji: "🌙",
      text: "Hayırlı Ramazanlar! Bu mübarek ayda huzur ve bereket dileriz.",
      textEn: "Ramadan Mubarak! Wishing you peace and blessings this holy month.",
      bg: "#1c1917",
      textColor: "#fde68a",
    },
  },
  {
    id: "ramazan-bayrami-2026",
    name: "Ramazan Bayramı",
    nameEn: "Eid al-Fitr",
    ranges: [{ from: "2026-03-19", to: "2026-03-22" }],
    primaryColor: "#92400e",
    banner: {
      emoji: "🌙",
      text: "İyi Bayramlar! Ramazan Bayramınız mübarek ve kutlu olsun.",
      textEn: "Eid Mubarak! Happy Eid al-Fitr to you and your loved ones.",
      bg: "#1c1917",
      textColor: "#fde68a",
    },
  },
  {
    id: "kurban-2026",
    name: "Kurban Bayramı",
    nameEn: "Eid al-Adha",
    ranges: [{ from: "2026-05-26", to: "2026-05-30" }],
    primaryColor: "#92400e",
    banner: {
      emoji: "🌙",
      text: "Kurban Bayramınız Mübarek Olsun! Sevdiklerinizle güzel bir bayram dileriz.",
      textEn: "Eid al-Adha Mubarak! Wishing you a blessed Eid.",
      bg: "#1c1917",
      textColor: "#fde68a",
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
      text: "Mutlu Noeller! Sevdiklerinizle güzel bir tatil dileriz.",
      textEn: "Merry Christmas! Wishing you a wonderful holiday with your loved ones.",
      bg: "#f0fdf4",
      textColor: "#14532d",
    },
  },
];

function isInRange(now: Date, from: string, to: string): boolean {
  if (from.length === 10) {
    // YYYY-MM-DD specific year
    const fromDate = new Date(from + "T00:00:00");
    const toDate = new Date(to + "T23:59:59");
    return now >= fromDate && now <= toDate;
  }

  // MM-DD annual
  const year = now.getFullYear();
  const [fm, fd] = from.split("-").map(Number);
  const [tm, td] = to.split("-").map(Number);
  const fromMD = fm * 100 + fd;
  const toMD = tm * 100 + td;

  if (fromMD <= toMD) {
    // Same-year range (e.g., Feb 12 - Feb 16)
    const fromDate = new Date(year, fm - 1, fd, 0, 0, 0);
    const toDate = new Date(year, tm - 1, td, 23, 59, 59);
    return now >= fromDate && now <= toDate;
  } else {
    // Year-spanning range (e.g., Dec 28 - Jan 5)
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
