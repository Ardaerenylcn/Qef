const MAX_PRODUCT_IMAGE_MB = 8;
const MAX_ASSET_MB = 10;

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export function validateImage(
  file: File,
  type: "product" | "asset" = "product"
): string | null {
  const maxMB = type === "asset" ? MAX_ASSET_MB : MAX_PRODUCT_IMAGE_MB;

  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Sadece JPG, PNG, WebP veya GIF yükleyebilirsin.";
  }

  if (file.size > maxMB * 1024 * 1024) {
    return `Görsel boyutu en fazla ${maxMB}MB olabilir. (Şu an: ${(file.size / 1024 / 1024).toFixed(1)}MB)`;
  }

  return null;
}
