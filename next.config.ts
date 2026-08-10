import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin Turbopack's root to this workspace so it stops trying to resolve
  // package-lock.json from a git repo higher up the filesystem.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
