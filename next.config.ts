import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Modules chargés tels quels côté serveur : ils embarquent du binaire natif
   * ou du WebAssembly que le bundler ne sait pas empaqueter.
   */
  serverExternalPackages: [
    "better-sqlite3",
    "@napi-rs/canvas",
    "tesseract.js",
    "pdfjs-dist",
  ],
};

export default nextConfig;
