interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0-1
}

const PRESETS = {
  product: { maxWidth: 800,  maxHeight: 800,  quality: 0.82 },
  asset:   { maxWidth: 1920, maxHeight: 1080, quality: 0.85 },
};

export async function compressImage(
  file: File,
  type: "product" | "asset" = "product"
): Promise<File> {
  const opts: CompressOptions = PRESETS[type];

  // GIF'leri sıkıştırma
  if (file.type === "image/gif") return file;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;
      const maxW = opts.maxWidth!;
      const maxH = opts.maxHeight!;

      // Oranı koru, sınır içinde küçült
      if (width > maxW || height > maxH) {
        const ratio = Math.min(maxW / width, maxH / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) { reject(new Error("Sıkıştırma başarısız.")); return; }
          const compressed = new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), {
            type: "image/jpeg",
            lastModified: Date.now(),
          });
          resolve(compressed);
        },
        "image/jpeg",
        opts.quality
      );
    };

    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Görsel okunamadı.")); };
    img.src = url;
  });
}
