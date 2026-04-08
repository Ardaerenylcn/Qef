import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(self), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://partner.googleadservices.com https://tpc.googlesyndication.com https://www.googletagservices.com https://ajax.googleapis.com https://unpkg.com https://sandbox-static.iyzipay.com https://static.iyzipay.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://eaenhftwhurxevfwpkbz.supabase.co https://*.googlesyndication.com https://*.googleadservices.com https://*.doubleclick.net https://*.google.com https://modelviewer.dev",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.googlesyndication.com https://*.googleadservices.com https://*.doubleclick.net https://ep1.adtrafficquality.google https://modelviewer.dev https://raw.githubusercontent.com https://ajax.googleapis.com https://unpkg.com https://sandbox-api.iyzipay.com https://api.iyzipay.com https://sandbox-static.iyzipay.com https://static.iyzipay.com",
      "frame-src 'self' https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://www.google.com https://sandbox-cpp.iyzipay.com https://cpp.iyzipay.com",
      "worker-src blob: 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "eaenhftwhurxevfwpkbz.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
