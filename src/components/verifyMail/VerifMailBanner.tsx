'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

import { getUserById } from '@/services/userService'

import VerifMailClient from './VerifMailClient'

export default function VerifMailBanner() {
  const { data: session } = useSession()
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    let ignore = false
    async function check() {
      if (!session?.user) {
        setShowBanner(false)
        return
      }
      const userId = session.user._id || session.user.id
      if (!userId) {
        setShowBanner(false)
        return
      }
      try {
        const user = await getUserById(userId)
        if (!ignore && user && user.verifmail === false && user.activated === false) {
          setShowBanner(true)
        } else {
          setShowBanner(false)
        }
      } catch {
        if (!ignore) {
          setShowBanner(true)
        }
      }
    }
    check()
    return () => {
      ignore = true
    }
  }, [session])

  if (!showBanner) {
    return null
  }
  return <VerifMailClient showBanner />
}
