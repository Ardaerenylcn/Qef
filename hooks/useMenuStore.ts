"use client";

import { useState, useEffect } from "react";
import type { MenuData } from "@/types/menu";
import { DEFAULT_MENU_DATA } from "@/types/menu";

const STORAGE_KEY = "qr-menu-data";

export function useMenuStore() {
  const [data, setData] = useState<MenuData>(DEFAULT_MENU_DATA);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch {
        // bozuk veri varsa sıfırla
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoaded(true);
  }, []);

  function save(newData: MenuData) {
    setData(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  }

  return { data, save, loaded };
}
