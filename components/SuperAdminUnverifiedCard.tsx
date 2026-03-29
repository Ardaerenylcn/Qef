"use client";

import { useState, useTransition } from "react";
import { Trash2, Mail, Clock, Phone } from "lucide-react";
import { deleteUnverifiedUserAction } from "@/app/superadmin/actions";
import { useRouter } from "next/navigation";

interface Props {
  user: {
    id: string;
    email: string;
    created_at: string;
    phone?: string;
  };
}

export default function SuperAdminUnverifiedCard({ user }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);

  function handleDelete() {
    startTransition(async () => {
      await deleteUnverifiedUserAction(user.id);
      router.refresh();
    });
  }

  const createdAt = new Date(user.created_at).toLocaleDateString("tr-TR", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between gap-3">
      <div className="flex items-start gap-3 min-w-0">
        <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center shrink-0">
          <Mail className="w-4 h-4 text-yellow-400" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-800 truncate">{user.email}</p>
          {user.phone && (
            <div className="flex items-center gap-1 mt-0.5">
              <Phone className="w-3 h-3 text-gray-300" />
              <p className="text-xs text-gray-500">{user.phone}</p>
            </div>
          )}
          <div className="flex items-center gap-1 mt-0.5">
            <Clock className="w-3 h-3 text-gray-300" />
            <p className="text-xs text-gray-400">{createdAt}</p>
          </div>
        </div>
      </div>

      <div className="shrink-0">
        {confirmDelete ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Emin misin?</span>
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="text-xs font-semibold text-red-500 hover:text-red-700 disabled:opacity-40"
            >
              {isPending ? "Siliniyor..." : "Sil"}
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              İptal
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="p-1.5 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
