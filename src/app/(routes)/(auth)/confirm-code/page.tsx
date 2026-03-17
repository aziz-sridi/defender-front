'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Image from 'next/image'
import Link from 'next/link'

import ArrowLeftWB from '@/components/ui/Icons/ArrowLeftWB'
import Typo from '@/components/ui/Typo'
import ConfirmCode from '@/components/google-auth/ConfirmCode'
import type { ConfirmCodeFormData } from '@/components/google-auth/ConfirmCode'
import { verifyOTP, sendOTP } from '@/services/userService'

/**
 * Confirm Code Page
 *
 * Third step in registration flow after entering phone number.
 * Users enter the verification code sent to their phone.
 */
export default function ConfirmCodePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [phoneNumber, setPhoneNumber] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
    // load phone from sessionStorage if available
    if (typeof window !== 'undefined') {
      const phone = sessionStorage.getItem('defendr:phone')
      if (phone) {
        setPhoneNumber(phone)
      }
    }
  }, [status, router])

  const handleSubmit = async (data: ConfirmCodeFormData) => {
    try {
      await verifyOTP({ email: session?.user?.email || '', otp: data.code })
      toast.success('Phone verified — welcome!')
      router.push('/')
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Code verification error:', error)
      toast.error('Invalid code')
    }
  }

  const handleResend = async () => {
    try {
      const storedPhone =
        typeof window !== 'undefined' ? sessionStorage.getItem('defendr:phone') || '' : ''
      const phone = phoneNumber || storedPhone
      await sendOTP({ email: session?.user?.email || '', phoneNumber: phone })
      toast.success('Verification code resent')
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Resend error:', error)
      toast.error('Failed to resend code')
    }
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
            <ConfirmCode
              email={session.user?.email || ''}
              phoneNumber={phoneNumber}
              onResend={handleResend}
              onSubmit={handleSubmit}
            />
          </div>
        </aside>
      </section>
    </>
  )
}
