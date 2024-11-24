import type { NextConfig } from "next";
import withPwa from "next-pwa";

const nextConfig: NextConfig = {
  ...withPwa({
    dest: "public",
  }),
  output: "standalone",
};

export default nextConfig;
