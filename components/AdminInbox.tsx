"use client";

import { useState, useTransition } from "react";
import { Bell, X, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Message {
  id: string;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
}

interface Props {
  messages: Message[];
}

export default function AdminInbox({ messages }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const unread = messages.filter((m) => !m.is_read).length;

  function markAllRead() {
    const unreadIds = messages.filter((m) => !m.is_read).map((m) => m.id);
    if (unreadIds.length === 0) return;
    startTransition(async () => {
      const supabase = createClient();
      await supabase.from("messages").update({ is_read: true }).in("id", unreadIds);
      router.refresh();
    });
  }

  function handleOpen() {
    setOpen(true);
    markAllRead();
  }

  return (
    <>
      {/* Zil ikonu */}
      <button onClick={handleOpen} className="relative text-gray-400 hover:text-orange-500 transition-colors">
        <Bell className="w-5 h-5" />
        {unread > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/40"
          onClick={() => setOpen(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm max-h-[70vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}>

            {/* Başlık */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-400" />
                <h2 className="font-semibold text-gray-800 text-sm">Gelen Kutusu</h2>
                {messages.length > 0 && (
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    {messages.length}
                  </span>
                )}
              </div>
              <button onClick={() => setOpen(false)} className="text-gray-300 hover:text-gray-500">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mesajlar */}
            <div className="overflow-y-auto flex-1 divide-y divide-gray-50">
              {messages.length === 0 ? (
                <div className="py-12 text-center text-sm text-gray-300 space-y-2">
                  <Mail className="w-8 h-8 mx-auto opacity-30" />
                  <p>Henüz mesaj yok</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className="px-5 py-4 space-y-1">
                    <p className="text-sm font-semibold text-gray-800">{msg.title}</p>
                    <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-wrap">{msg.body}</p>
                    <p className="text-xs text-gray-300">
                      {new Date(msg.created_at).toLocaleDateString("tr-TR", {
                        day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
                      })}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
