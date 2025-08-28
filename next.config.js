/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  optimizeFonts: false,
  trailingSlash: true,
  // Remove output: 'export' to enable API routes
  experimental: {
    serverComponentsExternalPackages: ["sharp"],
  },
}

module.exports = nextConfig
