import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A package-lock.json in the parent folder confuses root detection; pin it to this project.
  turbopack: { root: process.cwd() },
};

export default nextConfig;
