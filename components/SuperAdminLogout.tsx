"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SuperAdminLogout() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/superadmin-auth", { method: "DELETE" });
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-400 transition-colors"
    >
      <LogOut className="w-4 h-4" />
      Çıkış
    </button>
  );
}
