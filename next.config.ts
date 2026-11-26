import type { NextConfig } from "next";

// Gambar yang diunggah lewat mode admin disimpan di Supabase Storage (bucket publik),
// jadi host Supabase perlu diizinkan untuk next/image.
const supabaseHost = (() => {
  try {
    return new URL(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").hostname;
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: supabaseHost
      ? [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/**" }]
      : [],
  },
};

export default nextConfig;
