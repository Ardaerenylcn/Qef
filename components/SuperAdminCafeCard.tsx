"use client";

import { useState, useTransition } from "react";
import { UtensilsCrossed, Eye, ExternalLink, Trash2, Pencil, Check, X, Mail, Phone, Send } from "lucide-react";
import { deleteUserAction, updateSlugAction, sendMessageAction } from "@/app/superadmin/actions";
import { useRouter } from "next/navigation";

interface Props {
  cafe: {
    id: string;
    name: string;
    slug: string | null;
    created_at: string;
    user_id: string;
    theme?: { primaryColor?: string; logoUrl?: string };
    products?: { count: number }[];
  };
  views: number;
  userInfo: { email: string; phone: string };
}

export default function SuperAdminCafeCard({ cafe, views, userInfo }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editingSlug, setEditingSlug] = useState(false);
  const [slugInput, setSlugInput] = useState(cafe.slug ?? "");
  const [slugError, setSlugError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [msgTitle, setMsgTitle] = useState("");
  const [msgBody, setMsgBody] = useState("");
  const [msgSent, setMsgSent] = useState(false);

  const primaryColor = cafe.theme?.primaryColor ?? "#f97316";
  const logoUrl = cafe.theme?.logoUrl;
  const productCount = cafe.products?.[0]?.count ?? 0;
  const isUuid = /^[0-9a-f-]{36}$/.test(cafe.slug ?? "");

  function handleSendMessage() {
    if (!msgTitle.trim() || !msgBody.trim()) return;
    startTransition(async () => {
      await sendMessageAction(cafe.user_id, msgTitle.trim(), msgBody.trim());
      setMsgSent(true);
      setMsgTitle("");
      setMsgBody("");
      setTimeout(() => { setShowMessage(false); setMsgSent(false); }, 1500);
    });
  }

  function handleDelete() {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    startTransition(async () => {
      await deleteUserAction(cafe.user_id, cafe.id);
      router.refresh();
    });
  }

  function handleSlugSave() {
    setSlugError("");
    startTransition(async () => {
      const res = await updateSlugAction(cafe.id, slugInput);
      if (res?.error) {
        setSlugError(res.error);
      } else {
        setEditingSlug(false);
        router.refresh();
      }
    });
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Renkli üst şerit */}
      <div className="h-1.5" style={{ backgroundColor: primaryColor }} />

      <div className="p-4 space-y-3">
        {/* İsim + dış link */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="logo"
                className="w-9 h-9 rounded-xl object-cover shrink-0 border border-gray-100" />
            ) : (
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${primaryColor}22` }}>
                <UtensilsCrossed className="w-4 h-4" style={{ color: primaryColor }} />
              </div>
            )}
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate">{cafe.name}</p>

              {/* Slug — düzenlenebilir */}
              {editingSlug ? (
                <div className="flex items-center gap-1 mt-0.5">
                  <input
                    value={slugInput}
                    onChange={(e) => setSlugInput(e.target.value)}
                    className="text-xs border border-gray-200 rounded px-1.5 py-0.5 w-32 focus:outline-none focus:border-orange-400"
                    autoFocus
                  />
                  <button onClick={handleSlugSave} disabled={isPending}
                    className="text-green-500 hover:text-green-600">
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => { setEditingSlug(false); setSlugInput(cafe.slug ?? ""); setSlugError(""); }}
                    className="text-gray-300 hover:text-gray-500">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <p className="text-xs text-gray-400 truncate">
                    {isUuid ? "slug yok" : `/menu/${cafe.slug}`}
                  </p>
                  <button onClick={() => setEditingSlug(true)}
                    className="text-gray-200 hover:text-orange-400 transition-colors">
                    <Pencil className="w-3 h-3" />
                  </button>
                </div>
              )}
              {slugError && <p className="text-xs text-red-400">{slugError}</p>}
            </div>
          </div>

          {!isUuid && cafe.slug && (
            <a href={`/menu/${cafe.slug}`} target="_blank"
              className="text-gray-300 hover:text-orange-400 transition-colors shrink-0 mt-0.5">
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* İstatistikler + aksiyonlar */}
        <div className="flex items-center gap-3 pt-1 border-t border-gray-50">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <UtensilsCrossed className="w-3.5 h-3.5 text-gray-300" />
            <span><span className="font-semibold text-gray-700">{productCount}</span> ürün</span>
          </div>
          <div className="w-px h-3 bg-gray-100" />
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Eye className="w-3.5 h-3.5 text-gray-300" />
            <span><span className="font-semibold text-gray-700">{views.toLocaleString("tr-TR")}</span> görüntülenme</span>
          </div>

          {/* Aksiyonlar — sağa yaslanmış */}
          <div className="ml-auto flex items-center gap-2">
            {/* Mesaj butonu */}
            <button onClick={() => setShowMessage(true)}
              className="text-gray-200 hover:text-blue-400 transition-colors">
              <Send className="w-3.5 h-3.5" />
            </button>

            {/* Silme butonu */}
            {confirmDelete ? (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-red-400">Emin misin?</span>
                <button onClick={handleDelete} disabled={isPending}
                  className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-lg hover:bg-red-600 disabled:opacity-50">
                  {isPending ? "..." : "Sil"}
                </button>
                <button onClick={() => setConfirmDelete(false)}
                  className="text-gray-300 hover:text-gray-500">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button onClick={handleDelete}
                className="text-gray-200 hover:text-red-400 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Email + Telefon */}
        {(userInfo.email || userInfo.phone) && (
          <div className="space-y-1 pt-1 border-t border-gray-50">
            {userInfo.email && (
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <Mail className="w-3 h-3 text-gray-300 shrink-0" />
                <span className="truncate">{userInfo.email}</span>
              </div>
            )}
            {userInfo.phone && (
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <Phone className="w-3 h-3 text-gray-300 shrink-0" />
                <span>{userInfo.phone}</span>
              </div>
            )}
          </div>
        )}

        {/* Kayıt tarihi */}
        <p className="text-xs text-gray-300 text-right -mt-1">
          {new Date(cafe.created_at).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" })}
        </p>
      </div>
      {/* Mesaj gönder modal */}
      {showMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => setShowMessage(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-800 text-sm">{cafe.name} — Mesaj Gönder</h3>
              <button onClick={() => setShowMessage(false)} className="text-gray-300 hover:text-gray-500">
                <X className="w-4 h-4" />
              </button>
            </div>

            {msgSent ? (
              <div className="py-6 text-center text-green-500 font-medium text-sm">Mesaj gönderildi ✓</div>
            ) : (
              <>
                <input
                  value={msgTitle}
                  onChange={(e) => setMsgTitle(e.target.value)}
                  placeholder="Başlık"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
                />
                <textarea
                  value={msgBody}
                  onChange={(e) => setMsgBody(e.target.value)}
                  placeholder="Mesajınızı yazın..."
                  rows={4}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400 resize-none"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isPending || !msgTitle.trim() || !msgBody.trim()}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50"
                >
                  {isPending ? "Gönderiliyor..." : "Gönder"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
