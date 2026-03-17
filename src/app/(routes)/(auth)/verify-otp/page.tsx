'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

import VerifyOtpForm from '@/components/home/loginSignupForms/VerifyOtpForm'
import ArrowLeftWB from '@/components/ui/Icons/ArrowLeftWB'

const VerifyOtp = () => {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''

  return (
    <section className="flex bg-defendrBg flex-col lg:flex-row overflow-hidden lg:h-screen relative">
      {/* Desktop — left image panel */}
      <div
        className="hidden lg:flex lg:flex-1 lg:h-full bg-cover bg-no-repeat bg-top"
        style={{ backgroundImage: `url(/assets/images/forgetPassword.jpg)` }}
      />

      {/* Desktop back button */}
      <Link className="hidden lg:block absolute left-2 top-2 scale-75" href="/">
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

      {/* Mobile — compact top bar */}
      <div className="lg:hidden flex items-center justify-between w-full px-5 pt-5 pb-2">
        <Link href="/">
          <Image
            alt="DEFENDR"
            height={32}
            width={110}
            src="https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/defendr_elements/Frame%201171275156.png"
            className="h-7 w-auto"
          />
        </Link>
        <Link
          href="/forget-password"
          className="text-gray-400 hover:text-white text-sm font-poppins font-medium flex items-center gap-1 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
      </div>

      {/* Form panel */}
      <aside className="flex-1 flex flex-col items-center justify-center px-5 py-8 lg:py-0 min-h-[80vh] lg:min-h-screen">
        <div className="w-full max-w-sm">
          {/* Icon */}
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 border border-white/10 mb-6">
            <svg
              className="w-7 h-7 text-defendrRed"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.98l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V19.5z"
              />
            </svg>
          </div>

          {/* Heading */}
          <div className="mb-7">
            <h1 className="text-2xl lg:text-3xl font-bold text-white font-poppins">
              Check your email
            </h1>
            <p className="text-gray-400 text-sm font-poppins mt-2 leading-relaxed">
              We sent a 6-digit code to{' '}
              {email ? <span className="text-white font-medium">{email}</span> : 'your email'}.
              Enter it below.
            </p>
          </div>

          {/* OTP form */}
          <VerifyOtpForm email={email} />

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400 font-poppins">
              Wrong email?{' '}
              <Link
                className="text-defendrRed font-semibold hover:underline"
                href="/forget-password"
              >
                Try again
              </Link>
            </p>
          </div>
        </div>
      </aside>
    </section>
  )
}

export default VerifyOtp
