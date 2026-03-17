'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'

import { activateUserAccount, getUserById } from '@/services/userService'
import Typo from '@/components/ui/Typo'

export default function VerifyMailPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const auth = searchParams.get('auth')
  const router = useRouter()
  const [status, setStatus] = useState('Verifying your account...')
  const { data: session, update } = useSession()
  const [, setLocalSession] = useState(session)
  const hasVerified = useRef(false)

  useEffect(() => {
    const verify = async () => {
      const userId = session?.user?._id || session?.user?.id
      if (!token || hasVerified.current) {
        if (!token) setStatus('Invalid activation link')
        return
      }
      hasVerified.current = true
      try {
        // Activate user account
        await activateUserAccount(token)

        // If auth token is present, sign in
        if (auth) {
          setStatus('Signing you in...')
          const { signIn, getSession } = await import('next-auth/react')
          const result = await signIn('credentials', { token: auth, redirect: false })
          if (result?.error || !result?.ok) {
            toast.error('Failed to sign in after verification')
            setStatus('Verification successful but sign in failed')
            return
          }
        }

        // Always refresh session with activated user info
        let latestUser = null
        if (userId) {
          latestUser = await getUserById(userId)
        } else if (session?.user?.email) {
          // fallback: fetch by email if no id
          const { getUserByNickname } = await import('@/services/userService')
          latestUser = await getUserByNickname(session.user.email)
        }
        if (latestUser) {
          await update({
            user: {
              ...latestUser,
              activated: true,
              verifmail: true,
            },
          })
        }
        // Force session refetch and update local state
        const { getSession } = await import('next-auth/react')
        const refreshedSession = await getSession()
        setLocalSession(refreshedSession)
        toast.success('Account activated successfully')
        setStatus('Your account has been activated')
        setTimeout(() => router.push('/'), 3000)
      } catch (error) {
        toast.error('Activation failed')
        setStatus('Invalid or expired link')
        hasVerified.current = false
      }
    }
    verify()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, session])

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="bg-white p-6 rounded-lg text-center">
        <Typo as="h3" color="black" fontFamily="poppins" fontVariant="h4">
          {status}
        </Typo>
      </div>
    </div>
  )
}
