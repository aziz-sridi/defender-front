import type { NextConfig } from 'next'
import { resolve } from 'path'
import { config } from 'dotenv'

// load specific env profile
config({
  path: resolve(process.cwd(), `environments/.env.${process.env.APP_ENV || 'development'}`),
})

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    // IGDB image CDN resolves to NAT64 IPs (64:ff9b::...) which Next.js treats as private.
    // This flag allows the image optimizer to fetch from those IPs.
    dangerouslyAllowSVG: true,
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      // ── Local dev API (all image paths) ──────────────────────────────────
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9080',
        pathname: '/**',
      },
      // ── IGDB ─────────────────────────────────────────────────────────────
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'images.igdb.com',
        pathname: '/**',
      },
      // ── Cloudflare R2 ────────────────────────────────────────────────────
      {
        protocol: 'https',
        hostname: 'pub-ac0646938950482d9e37f5be48f6653b.r2.dev',
        pathname: '/**',
      },
      // ── Production API ───────────────────────────────────────────────────
      {
        protocol: 'https',
        hostname: 'api-dev.defendr.gg',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.defendr.gg',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'defendr.gg',
        pathname: '/**',
      },
      // ── External image sources ────────────────────────────────────────────
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'play-lh.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'fiverr-res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.gadgets360cdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.barrie.ca',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
