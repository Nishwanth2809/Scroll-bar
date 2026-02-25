import type { NextConfig } from "next";

const configuredBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  reactCompiler: true,
  basePath: configuredBasePath,
  assetPrefix: configuredBasePath ? `${configuredBasePath}/` : undefined,
};

export default nextConfig;
