import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("https://cdn.dummyjson.com/**"),
      new URL("https://cdn.sanity.io/images/**"),
    ],
  },
};

export default nextConfig;
