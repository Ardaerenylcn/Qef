"use client";

import Link from "next/link";
import { HelpCircle } from "lucide-react";

export default function HelpButton({ section }: { section: string }) {
  return (
    <Link
      href={`/help#${section}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-100 text-orange-400 hover:bg-orange-500 hover:text-white transition-all shadow-sm"
      title="Bu özellik hakkında yardım al"
    >
      <HelpCircle className="w-3.5 h-3.5" />
    </Link>
  );
}
