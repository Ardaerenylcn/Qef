"use client";

import { useState } from "react";
import { Phone } from "lucide-react";

interface ConfirmationItem {
  id: string;
  email: string;
  phone: string;
  confirmation_sent_at: string;
  confirmed: boolean;
}

interface Props {
  items: ConfirmationItem[];
}

const PAGE_SIZE = 10;

export default function SuperAdminConfirmationList({ items }: Props) {
  const [shown, setShown] = useState(PAGE_SIZE);

  const visible = items.slice(0, shown);
  const hasMore = shown < items.length;

  return (
    <div>
      <div className="divide-y divide-gray-50">
        {visible.map((u) => {
          const sentAt = new Date(u.confirmation_sent_at).toLocaleDateString("tr-TR", {
            day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
          });
          return (
            <div key={u.id} className="flex items-center gap-3 px-4 py-3">
              <div className={`w-2 h-2 rounded-full shrink-0 ${u.confirmed ? "bg-green-400" : "bg-yellow-400"}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 truncate">{u.email}</p>
                {u.phone && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3 text-gray-300" />
                    <p className="text-xs text-gray-500">{u.phone}</p>
                  </div>
                )}
              </div>
              <div className="text-right shrink-0">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${u.confirmed ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"}`}>
                  {u.confirmed ? "Doğrulandı" : "Bekliyor"}
                </span>
                <p className="text-[10px] text-gray-400 mt-0.5">{sentAt}</p>
              </div>
            </div>
          );
        })}
      </div>
      {hasMore && (
        <div className="px-4 py-3 border-t border-gray-50">
          <button
            onClick={() => setShown((s) => s + PAGE_SIZE)}
            className="text-sm text-blue-500 hover:text-blue-700 font-medium transition-colors"
          >
            Daha fazla göster ({items.length - shown} kaldı)
          </button>
        </div>
      )}
    </div>
  );
}
