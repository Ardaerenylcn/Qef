"use client";

import Link from "next/link";
import { HelpCircle } from "lucide-react";

export default function HelpButton({ section }: { section: string }) {
  return (
    <Link
      href={`/help#${section}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center w-5 h-5 rounded-full text-gray-300 hover:text-orange-400 hover:bg-orange-50 transition-all"
      title="Bu özellik hakkında yardım al"
    >
      <HelpCircle className="w-3.5 h-3.5" />
    </Link>
  );
}
