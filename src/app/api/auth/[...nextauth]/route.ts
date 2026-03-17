import NextAuth from 'next-auth'

import { authOptions } from '@/lib/api/auth'

/**
 * NextAuth.js Route Handler for App Router (Next.js 14+)
 *
 * This handles all NextAuth routes:
 * - /api/auth/signin (sign in page)
 * - /api/auth/callback/google (Google OAuth callback)
 * - /api/auth/session (get session)
 * - etc.
 *
 * NEXTAUTH_URL Configuration:
 * - Production: https://defendr.gg
 * - Development: http://localhost:3000 (or your dev URL)
 *
 * Google OAuth Callback URL (set in Google Cloud Console):
 * - Production: https://defendr.gg/api/auth/callback/google
 * - Development: http://localhost:3000/api/auth/callback/google
 */

// Set NEXTAUTH_URL if not already defined
if (!process.env.NEXTAUTH_URL) {
  if (process.env.NODE_ENV === 'production') {
    process.env.NEXTAUTH_URL = 'https://defendr.gg'
  } else {
    // For local development, use localhost
    process.env.NEXTAUTH_URL = 'http://localhost:3000'
  }
}

// Safety check: Override localhost URLs in production
if (
  process.env.NODE_ENV === 'production' &&
  process.env.NEXTAUTH_URL &&
  (process.env.NEXTAUTH_URL.includes('localhost') || process.env.NEXTAUTH_URL.includes('127.0.0.1'))
) {
  // eslint-disable-next-line no-console
  console.warn(
    `⚠️ Overriding NEXTAUTH_URL (${process.env.NEXTAUTH_URL}) to https://defendr.gg for production.`,
  )
  process.env.NEXTAUTH_URL = 'https://defendr.gg'
}

let handler
try {
  handler = NextAuth(authOptions)
} catch (err) {
  // Log detailed error server-side
  // eslint-disable-next-line no-console
  console.error('❌ NextAuth initialization error:', err)

  if (process.env.NODE_ENV !== 'production') {
    // In development, return detailed error
    const errorHandler = async (_req: Request) => {
      return new Response(
        JSON.stringify({
          error: 'NextAuth initialization failed',
          details: String(err),
          hint: 'Check GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and NEXTAUTH_SECRET in .env.local',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }
    handler = errorHandler as unknown as ReturnType<typeof NextAuth>
  } else {
    // In production, rethrow
    throw err
  }
}

export { handler as GET, handler as POST }
