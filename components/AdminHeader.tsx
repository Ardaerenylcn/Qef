"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, QrCode } from "lucide-react";
import LogoutButton from "./LogoutButton";
import QRCodeModal from "./QRCodeModal";
import AdminInbox from "./AdminInbox";

interface Message {
  id: string;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
}

interface Props {
  slug: string;
  cafeName: string;
  messages: Message[];
}

export default function AdminHeader({ slug, cafeName, messages }: Props) {
  const [showQR, setShowQR] = useState(false);

  return (
    <>
      <div className="max-w-lg mx-auto mb-8 flex items-center justify-between">
        <LogoutButton />

        <div className="flex items-center gap-2">
          <QrCode className="w-5 h-5 text-orange-400" />
          <span className="font-bold text-gray-800">Admin Paneli</span>
        </div>

        <div className="flex items-center gap-2">
          <AdminInbox messages={messages} />
          <button
            onClick={() => setShowQR(true)}
            className="flex items-center gap-1.5 text-sm bg-orange-500 hover:bg-orange-600 text-white font-medium px-3 py-1.5 rounded-lg transition-colors"
          >
            <QrCode className="w-4 h-4" />
            QR
          </button>
          <Link
            href={`/menu/${slug}`}
            target="_blank"
            className="flex items-center gap-1.5 text-sm bg-orange-50 text-orange-500 hover:bg-orange-100 font-medium px-3 py-1.5 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
            Önizle
          </Link>
        </div>
      </div>

      {showQR && (
        <QRCodeModal
          slug={slug}
          cafeName={cafeName}
          onClose={() => setShowQR(false)}
        />
      )}
    </>
  );
}
