'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Image from 'next/image'
import Link from 'next/link'

import ArrowLeftWB from '@/components/ui/Icons/ArrowLeftWB'
import Typo from '@/components/ui/Typo'
import EnterNumber from '@/components/google-auth/EnterNumber'
import type { EnterNumberFormData } from '@/components/google-auth/EnterNumber'
import { sendOTP } from '@/services/userService'

/**
 * Enter Phone Number Page
 *
 * Second step in registration flow after Google OAuth.
 * Users enter their phone number for verification (optional).
 */
export default function EnterNumberPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  const handleSubmit = async (data: EnterNumberFormData) => {
    try {
      // Call backend to send OTP
      await sendOTP({ email: session?.user?.email || '', phoneNumber: data.phoneNumber })

      // Save phone locally for confirmation page
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('defendr:phone', data.phoneNumber)
      }

      toast.success('Verification code sent')
      router.push('/confirm-code')
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Phone verification error:', error)
      toast.error('Failed to send verification code')
    }
  }

  const handleSkip = () => {
    // Skip phone verification and go to home
    router.push('/')
  }

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-black">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <>
      <section className="flex flex-col lg:flex-row bg-defendrBg overflow-hidden h-full min-h-screen p-0">
        <div
          className="bg-defendrRed h-full min-h-screen lg:flex-1 bg-cover bg-no-repeat bg-top hidden lg:block"
          style={{
            backgroundImage: `url(/assets/images/Signup.jpg)`,
            backgroundPosition: 'left center',
          }}
        />

        <Link className="hidden lg:block absolute left-2 top-2 scale-75" href={'/'}>
          <button
            className="bg-white text-center w-64 rounded-2xl h-14 relative text-black text-xl font-poppins group"
            type="button"
          >
            <div className="bg-defendrRed rounded-xl h-12 w-1/6 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[250px] z-10 duration-500">
              <ArrowLeftWB />
            </div>
            <p className="translate-x-6 ml-1 capitalize">Go Back home</p>
          </button>
        </Link>

        <div className="flex w-full items-center justify-between p-4 lg:hidden">
          <Link href={'/'}>
            <Image
              alt="logo"
              className="logo"
              height={40}
              src="https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/defendr_elements/Frame%201171275156.png"
              width={120}
            />
          </Link>
        </div>

        <aside className="flex-1 flex flex-col justify-center mt-4 lg:mt-12 gap-4 sm:gap-5 px-2 sm:px-0">
          <div className="flex items-center justify-center flex-col gap-2 px-4 text-center lg:text-left">
            <Typo as="h1" fontFamily="poppins" fontVariant="h1">
              Create An Account
            </Typo>
            <Typo as="p" className="lg:hidden text-sm" fontVariant="p4">
              Sign up to DEFENDR
            </Typo>
          </div>

          <div className="flex flex-col items-center gap-2  w-full max-w-md mx-auto">
            <EnterNumber
              email={session.user?.email || ''}
              onSkip={handleSkip}
              onSubmit={handleSubmit}
            />
          </div>
        </aside>
      </section>
    </>
  )
}
