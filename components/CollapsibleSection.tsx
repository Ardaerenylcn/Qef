"use client";

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import HelpButton from "./HelpButton";

interface Props {
  storageKey: string;
  title: string;
  defaultOpen?: boolean;
  helpSection?: string;
  children: React.ReactNode;
}

export default function CollapsibleSection({ storageKey, title, defaultOpen = true, helpSection, children }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved !== null) setOpen(saved === "1");
  }, [storageKey]);

  function toggle() {
    const next = !open;
    setOpen(next);
    localStorage.setItem(storageKey, next ? "1" : "0");
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <h2 className="font-semibold text-gray-700 flex items-center gap-2">
          {title}
          {helpSection && <HelpButton section={helpSection} />}
        </h2>
        <ChevronDown
          className="w-4 h-4 text-gray-400 transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      {open && (
        <div className="px-6 pb-6 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
}
