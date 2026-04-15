export async function revalidateMenu(slug: string) {
  try {
    await fetch("/api/revalidate-menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
  } catch {
    // Revalidasyon başarısız olsa da kullanıcı deneyimi etkilenmesin
  }
}
