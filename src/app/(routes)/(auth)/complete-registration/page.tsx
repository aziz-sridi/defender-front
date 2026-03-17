'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import ArrowLeftWB from '@/components/ui/Icons/ArrowLeftWB'
import Typo from '@/components/ui/Typo'
import CompleteRegistration from '@/components/google-auth/CompleteRegistration'
import type { CompleteRegistrationFormData } from '@/components/google-auth/CompleteRegistration'
import { updateUsername } from '@/services/userService'

/**
 * Complete Registration Page
 *
 * This page is shown after Google OAuth login for new users.
 * Users must be authenticated to access this page.
 */
export default function CompleteRegistrationPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    if (!isNewUser()) router.replace('/')
    if (status === 'unauthenticated') toast.error('Please sign in to complete registration')
  }, [status, router])

  const isNewUser = () => session?.user?.createdAt === session?.user?.updatedAt

  const handleSubmit = async (data: CompleteRegistrationFormData) => {
    try {
      // Update username on backend
      await updateUsername(data.nickname)

      // Store temporary data in sessionStorage for subsequent steps
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('defendr:nickname', data.nickname)
      }

      toast.success('Nickname saved — continue to phone verification')
      router.push('/enter-number')
    } catch (error: any) {
      // eslint-disable-next-line no-console
      //console.error('Registration error:', error)
      setSubmitError(error?.message || 'Something went wrong. Please try again.')
      toast.error('Failed to complete registration')
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-black">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!session) return null

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
            <span style={{ color: 'var(--Primary-Color-Color, #D62555)' }}>{submitError}</span>
            <CompleteRegistration
              defaultNickname={session.user?.nickname || ''}
              email={session.user?.email || ''}
              onSubmit={handleSubmit}
            />
          </div>
        </aside>
      </section>
    </>
  )
}
