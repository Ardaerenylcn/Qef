import type { Metadata } from "next";
import HelpPage from "@/components/help/HelpPage";

export const metadata: Metadata = {
  title: "Yardım Merkezi — Qef",
  description: "Qef dijital QR menü yönetim sistemi kullanım kılavuzu. Ürün ekleme, AI tarama, QR kodlar ve daha fazlası.",
};

export default function HelpRoute() {
  return <HelpPage />;
}
