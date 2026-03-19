"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Loader2, Lock } from "lucide-react";

export default function SuperAdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/superadmin-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/superadmin");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Hatalı şifre.");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-sm w-full space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex bg-gray-900 p-3 rounded-2xl">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Paneli</h1>
          <p className="text-sm text-gray-400">Devam etmek için şifreyi girin.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4"
        >
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            <input
              type="password"
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
}
