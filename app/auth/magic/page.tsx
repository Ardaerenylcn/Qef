"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

export default function MagicAuthPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    // Hash'teki token'ı Supabase client otomatik işler
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        router.replace("/admin");
      }
    });
    // Zaten session varsa da yönlendir
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace("/admin");
    });
    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-orange-400 animate-spin" />
        <p className="text-sm text-gray-400">Giriş yapılıyor...</p>
      </div>
    </div>
  );
}
