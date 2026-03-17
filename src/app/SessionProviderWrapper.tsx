'use client'

import { useEffect, useRef } from 'react'
import { SessionProvider, useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'sonner'

// All pages that are "auth-flow" pages — navigating there should NEVER trigger the expired toast.
const AUTH_FLOW_PAGES = [
  '/login',
  '/signup',
  '/forget-password',
  '/reset-password',
  '/verify-otp',
  '/verifmail',
  '/complete-registration',
  '/enter-number',
  '/confirm-code',
  '/auth/oauth-redirect',
]

function SessionWatcher() {
  const { status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  // Track whether we've already shown the toast for this unauthenticated transition
  const hasShownToast = useRef(false)
  // Track whether a deliberate signOut was triggered (set before signOut call)
  const isSigningOut = useRef(false)

  // Expose a helper so the rest of the app can signal an intentional sign-out
  useEffect(() => {
    if (typeof window !== 'undefined') {
      ;(window as any).__defendrSignOut = () => {
        isSigningOut.current = true
        // Immediately clear the flag so the watcher won't fire the toast
        window.sessionStorage.removeItem('defendr:was-authenticated')
      }
    }
  }, [])

  useEffect(() => {
    if (status === 'authenticated') {
      // User is logged in — reset all flags
      hasShownToast.current = false
      isSigningOut.current = false
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem('defendr:was-authenticated', '1')
      }
      return
    }

    if (status === 'unauthenticated') {
      const wasAuthenticated =
        typeof window !== 'undefined' &&
        window.sessionStorage.getItem('defendr:was-authenticated') === '1'

      // Check if we're on any auth-flow page
      const isOnAuthFlowPage =
        AUTH_FLOW_PAGES.includes(pathname) ||
        pathname?.startsWith('/auth') ||
        pathname?.startsWith('/(auth)')

      // Don't show the toast if:
      // 1. The user was never authenticated in this session
      // 2. We already showed it
      // 3. We're already on an auth-flow page (deliberate navigation)
      // 4. A deliberate signOut was initiated
      if (!wasAuthenticated || hasShownToast.current || isOnAuthFlowPage || isSigningOut.current) {
        return
      }

      hasShownToast.current = true
      // Clear the flag so navigating around after this doesn't re-trigger
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem('defendr:was-authenticated')
      }
      toast.error('Session expired, please log in again.')
      router.push('/login')
    }
  }, [status, pathname, router])

  return null
}

export function SessionProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchOnWindowFocus={false}>
      <SessionWatcher />
      {children}
    </SessionProvider>
  )
}
