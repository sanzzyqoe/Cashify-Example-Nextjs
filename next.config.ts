import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_BASE: process.env.NEXT_PUBLIC_API_BASE,
    LICENSE_KEY: process.env.LICENSE_KEY,
    ID_QRIS: process.env.ID_QRIS,
  },
    images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "larabert-qrgen.hf.space",
      },
    ],
  },
};

export default nextConfig;
