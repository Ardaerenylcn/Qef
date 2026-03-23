"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QrCode, Loader2, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    // Callback'ten gelen session varsa direkt hazır say
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });
    // Hash akışı için PASSWORD_RECOVERY eventini de dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 6) { setError("Şifre en az 6 karakter olmalı."); return; }
    if (password !== confirm) { setError("Şifreler eşleşmiyor."); return; }

    setLoading(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    if (err) {
      setError(err.message);
      setLoading(false);
    } else {
      router.push("/admin");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-sm w-full space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex bg-orange-100 p-3 rounded-2xl">
            <QrCode className="w-8 h-8 text-orange-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Yeni Şifre Belirle</h1>
          <p className="text-sm text-gray-400">En az 6 karakter kullan.</p>
        </div>

        {!ready ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
            Bağlantı doğrulanıyor...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                placeholder="Yeni şifre"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
              <button type="button" onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <input
              type={showPw ? "text" : "password"}
              placeholder="Şifreyi tekrarla"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            {error && (
              <p className="text-sm text-red-400 bg-red-50 rounded-lg px-3 py-2">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Şifremi Güncelle
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
