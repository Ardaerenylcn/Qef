import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/superadmin", "/api/"],
      },
    ],
    sitemap: "https://qefmenu.com/sitemap.xml",
  };
}
