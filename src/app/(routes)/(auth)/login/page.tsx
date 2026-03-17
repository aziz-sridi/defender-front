import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'

import LoginForm from '@/components/home/loginSignupForms/LoginForm'
import PlatformLogin from '@/components/home/loginSignupForms/PlatformLogin'
import ArrowLeftWB from '@/components/ui/Icons/ArrowLeftWB'

const LoginDefendr = () => {
  return (
    <section className="flex bg-defendrBg flex-col lg:flex-row overflow-hidden lg:h-screen relative">
      {/* Desktop — left image panel */}
      <div
        className="hidden lg:flex lg:flex-1 lg:h-full bg-cover bg-no-repeat bg-top"
        style={{ backgroundImage: `url(assets/images/Signin.jpg)` }}
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

      {/* Mobile — compact top bar: logo + back */}
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
          href="/"
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
          {/* Heading */}
          <div className="mb-7 text-center lg:text-left">
            <h1 className="text-2xl lg:text-4xl font-bold text-white font-poppins">Welcome back</h1>
            <p className="text-gray-400 text-sm font-poppins mt-1.5">
              Sign in to continue to DEFENDR
            </p>
          </div>

          {/* Login form */}
          <Suspense fallback={<div className="w-full h-40" />}>
            <LoginForm />
          </Suspense>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <span className="flex-1 h-px bg-white/10" />
            <span className="text-gray-500 text-xs font-poppins whitespace-nowrap uppercase tracking-wider">
              Or sign in with
            </span>
            <span className="flex-1 h-px bg-white/10" />
          </div>

          {/* OAuth buttons */}
          <PlatformLogin />

          {/* Footer links */}
          <p className="text-center text-sm text-gray-400 font-poppins mt-6">
            Don&apos;t have an account?{' '}
            <Link className="text-defendrRed font-semibold hover:underline" href="/signup">
              Sign Up
            </Link>
          </p>
        </div>
      </aside>
    </section>
  )
}

export default LoginDefendr
