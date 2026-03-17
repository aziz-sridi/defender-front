'use client'

import { useSession } from 'next-auth/react'
import LandingPage from '@/components/home/LandingPage'
import LoggedInHome from '@/components/home/home'

export default function Home() {
  const { data: session, status } = useSession()

  // While session is loading, render nothing (avoids flash of landing page then home)
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#161616]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-defendrRed/30 border-t-defendrRed rounded-full animate-spin" />
          <span className="text-white font-poppins text-lg">Loading...</span>
        </div>
      </div>
    )
  }

  return session ? <LoggedInHome /> : <LandingPage />
}
