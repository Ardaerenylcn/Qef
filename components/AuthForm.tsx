"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { QrCode, Loader2 } from "lucide-react";

interface AuthFormProps {
  mode: "login" | "register";
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [venueName, setVenueName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const supabase = createClient();

    if (mode === "register") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            phone: phone.trim(),
            full_name: fullName.trim(),
            venue_name: venueName.trim(),
          },
          emailRedirectTo: "https://qefmenu.com/auth/callback",
        },
      });
      if (error) {
        setError("Kayıt olunamadı. E-posta zaten kullanımda olabilir.");
      } else {
        setSuccess("Hesabın oluşturuldu! E-postanı doğrula, ardından giriş yap.");
        fetch("/api/notify-new-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, fullName: fullName.trim(), venueName: venueName.trim() }),
        }).catch(() => {});
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError("E-posta veya şifre hatalı.");
      } else {
        router.push("/admin");
        router.refresh();
      }
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      {/* Loading bar */}
      {loading && (
        <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-orange-100 overflow-hidden">
          <div className="h-full bg-orange-500 animate-pulse" style={{ width: "60%", animation: "loading-bar 1.2s ease-in-out infinite" }} />
        </div>
      )}
      <div className="max-w-sm w-full space-y-8">
        {/* Ana sayfaya dön */}
        <div>
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-orange-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Ana Sayfa
          </Link>
        </div>
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex bg-orange-100 p-3 rounded-2xl">
            <QrCode className="w-8 h-8 text-orange-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {mode === "login" ? "Giriş Yap" : "Hesap Oluştur"}
          </h1>
          <p className="text-sm text-gray-400">
            {mode === "login"
              ? "Kafe yönetim panelinize girin."
              : "Kafen için ücretsiz dijital menü oluştur."}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <div className="space-y-3">
            {mode === "register" && (
              <>
                <input
                  type="text"
                  placeholder="Ad Soyad"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
                <input
                  type="text"
                  placeholder="Mekan Adı (ör. Cafe Nora)"
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </>
            )}
            <input
              type="email"
              placeholder="E-posta"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            {mode === "register" && (
              <input
                type="tel"
                placeholder="Telefon numarası (ör. 05xx xxx xx xx)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            )}
            <input
              type="password"
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            {mode === "login" && (
              <div className="text-right">
                <Link href="/forgot-password" className="text-xs text-gray-400 hover:text-orange-500 transition-colors">
                  Şifremi unuttum
                </Link>
              </div>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}
          {success && (
            <p className="text-sm text-green-600 bg-green-50 rounded-lg px-3 py-2">{success}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {mode === "login" ? "Giriş Yap" : "Kayıt Ol"}
          </button>
        </form>

        {/* Alt link */}
        <p className="text-center text-sm text-gray-400">
          {mode === "login" ? (
            <>
              Hesabın yok mu?{" "}
              <Link href="/register" className="text-orange-500 hover:underline font-medium">
                Kayıt Ol
              </Link>
            </>
          ) : (
            <>
              Zaten hesabın var mı?{" "}
              <Link href="/login" className="text-orange-500 hover:underline font-medium">
                Giriş Yap
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
