'use client'

import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { loginDefendr } from '@/components/home/homeConstant/loginSignup'

const PlatformLogin = () => {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/auth/oauth-redirect'

  const googleLogin = () => signIn('google', { callbackUrl })
  const discordLogin = () => signIn('discord', { callbackUrl })

  const determineLoginMethod = (provider: string) => {
    switch (provider) {
      case 'google':
        googleLogin()
        return
      case 'discord':
        discordLogin()
        return
      default:
        return
    }
  }

  return (
    <div className="flex flex-col w-full gap-3">
      {loginDefendr.map((serv, i) => (
        <button
          key={i}
          className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-xl font-poppins text-sm font-medium
            bg-transparent border border-white/10 text-white
            hover:border-white/20 hover:bg-white/5 active:scale-[0.98] transition-all duration-200"
          title={serv.name}
          onClick={() => determineLoginMethod(serv.provider)}
        >
          <serv.logo style={{ height: serv.height, width: serv.height }} />
          {serv.text}
        </button>
      ))}
    </div>
  )
}

export default PlatformLogin
