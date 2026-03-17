'use client'

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function SettingPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string

  useEffect(() => {
    router.replace(`/user/${userId}/settings?tab=Game-accounts`)
  }, [router, userId])

  return (
    <div className="bg-[#161616] min-h-screen flex items-center justify-center">
      <div className="text-white">Redirecting to settings...</div>
    </div>
  )
}
