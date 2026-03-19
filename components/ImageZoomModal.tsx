"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface Props {
  src: string;
  alt: string;
  thumbClass?: string;
  buttonClass?: string;
}

export default function ImageZoomModal({ src, alt, thumbClass, buttonClass }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={buttonClass ?? "shrink-0 focus:outline-none"}
        aria-label="Görseli büyüt"
      >
        <Image
          src={src}
          alt={alt}
          width={400}
          height={400}
          className={thumbClass ?? "w-16 h-16 rounded-xl object-cover"}
        />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setOpen(false)}
        >
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-7 h-7" />
          </button>
          <div
            className="relative max-w-sm w-full max-h-[80vh] aspect-square"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain rounded-2xl"
              sizes="(max-width: 640px) 100vw, 480px"
            />
          </div>
        </div>
      )}
    </>
  );
}
