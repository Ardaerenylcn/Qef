"use client";

import { useState } from "react";
import { Save, Loader2, Eye, EyeOff, LogOut, Bot } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Props {
  email: string;
  cafeId: string;
  chatbotEnabled: boolean;
}

export default function AccountSettings({ email, cafeId, chatbotEnabled: initialChatbotEnabled }: Props) {
  const supabase = createClient();
  const router = useRouter();

  const [chatbotEnabled, setChatbotEnabled] = useState(initialChatbotEnabled);
  const [chatbotSaving, setChatbotSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleChangePassword() {
    setError("");
    setSuccess(false);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Tüm alanları doldur.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Yeni şifre en az 6 karakter olmalı.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Yeni şifreler eşleşmiyor.");
      return;
    }

    setSaving(true);

    // Mevcut şifreyi doğrula
    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email,
      password: currentPassword,
    });

    if (signInErr) {
      setError("Mevcut şifre yanlış.");
      setSaving(false);
      return;
    }

    // Şifreyi güncelle
    const { error: updateErr } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateErr) {
      setError("Şifre güncellenemedi: " + updateErr.message);
    } else {
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setSuccess(false), 3000);
    }

    setSaving(false);
  }

  async function handleChatbotToggle() {
    setChatbotSaving(true);
    const newValue = !chatbotEnabled;
    await supabase.from("cafes").update({ chatbot_enabled: newValue }).eq("id", cafeId);
    setChatbotEnabled(newValue);
    setChatbotSaving(false);
  }

  async function handleLogout() {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div className="space-y-4">

      {/* Chatbot */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center">
              <Bot className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">Menü Asistanı</p>
              <p className="text-xs text-gray-400">Müşteriler AI ile menüyü keşfedebilir</p>
            </div>
          </div>
          <button
            onClick={handleChatbotToggle}
            disabled={chatbotSaving}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-60 ${
              chatbotEnabled ? "bg-orange-500" : "bg-gray-200"
            }`}
            aria-label="Chatbot aç/kapat"
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                chatbotEnabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Hesap bilgisi */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3">
        <h2 className="font-semibold text-gray-700 text-sm">Hesap Bilgileri</h2>
        <div className="space-y-1">
          <label className="text-xs text-gray-400 font-medium">E-posta</label>
          <div className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-400 bg-gray-50 select-all">
            {email}
          </div>
        </div>
      </div>

      {/* Şifre değiştir */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
        <h2 className="font-semibold text-gray-700 text-sm">Şifre Değiştir</h2>

        <div className="space-y-3">
          {/* Mevcut şifre */}
          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-medium">Mevcut şifre</label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
              <button
                type="button"
                onClick={() => setShowCurrent((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Yeni şifre */}
          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-medium">Yeni şifre</label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="En az 6 karakter"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
              <button
                type="button"
                onClick={() => setShowNew((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Yeni şifre tekrar */}
          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-medium">Yeni şifre tekrar</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-400 bg-red-50 border border-red-100 rounded-xl px-3 py-2">{error}</p>
        )}

        <button
          onClick={handleChangePassword}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {success ? "Şifre güncellendi ✓" : "Şifreyi Güncelle"}
        </button>
      </div>

      {/* Çıkış yap */}
      <button
        onClick={handleLogout}
        disabled={loggingOut}
        className="w-full flex items-center justify-center gap-2 bg-white hover:bg-red-50 disabled:opacity-60 text-red-400 hover:text-red-500 font-semibold py-3 rounded-2xl border border-gray-200 hover:border-red-200 text-sm transition-colors"
      >
        {loggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
        Çıkış Yap
      </button>

    </div>
  );
}
