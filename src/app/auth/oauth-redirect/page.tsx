'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'

/**
 * /auth/oauth-redirect
 *
 * Landing page after Google or Discord OAuth sign-in.
 * Decides where to send the user:
 *   - New user  (createdAt === updatedAt)  → /complete-registration
 *   - Returning user                        → / (or callbackUrl)
 *
 * This avoids hardcoding /complete-registration as the callbackUrl,
 * which would force returning OAuth users through the onboarding form.
 */
export default function OAuthRedirect() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated') {
      // Something went wrong during OAuth — go back to login
      router.replace('/login')
      return
    }

    if (status === 'authenticated' && session?.user) {
      const { createdAt, updatedAt } = session.user as { createdAt?: string; updatedAt?: string }

      // A brand-new OAuth account has createdAt === updatedAt (backend sets both on creation)
      const isNewUser = createdAt && updatedAt && createdAt === updatedAt

      if (isNewUser) {
        router.replace('/complete-registration')
      } else {
        const callbackUrl = searchParams.get('callbackUrl') || '/'
        router.replace(callbackUrl)
      }
    }
  }, [status, session, router, searchParams])

  // Minimal loading state while we figure out where to redirect
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#0d0d0d]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-defendrRed border-t-transparent rounded-full animate-spin" />
        <p className="text-white/60 text-sm font-poppins">Signing you in…</p>
      </div>
    </div>
  )
}
