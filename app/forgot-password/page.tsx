"use client";

import { useState } from "react";
import Link from "next/link";
import { QrCode, Loader2, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://qefmenu.com/auth/callback?next=/reset-password",
    });

    if (err) {
      setError(err.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-sm w-full space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex bg-orange-100 p-3 rounded-2xl">
            <QrCode className="w-8 h-8 text-orange-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Şifremi Unuttum</h1>
          <p className="text-sm text-gray-400">
            E-postana sıfırlama bağlantısı göndereceğiz.
          </p>
        </div>

        {sent ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center space-y-4">
            <p className="text-green-600 font-medium">Bağlantı gönderildi!</p>
            <p className="text-sm text-gray-400">
              <span className="font-medium text-gray-700">{email}</span> adresine şifre sıfırlama
              bağlantısı gönderdik. Spam klasörünü de kontrol et.
            </p>
            <Link href="/login" className="inline-flex items-center gap-1 text-sm text-orange-500 hover:underline">
              <ArrowLeft className="w-3.5 h-3.5" />
              Girişe dön
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <input
              type="email"
              placeholder="E-posta adresin"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              Sıfırlama Bağlantısı Gönder
            </button>
          </form>
        )}

        <p className="text-center text-sm text-gray-400">
          <Link href="/login" className="inline-flex items-center gap-1 text-orange-500 hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" />
            Girişe dön
          </Link>
        </p>
      </div>
    </div>
  );
}
