'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'

import { forgotPassword } from '@/services/userService'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Inputs'
import Typo from '@/components/ui/Typo'
import ArrowLeftWB from '@/components/ui/Icons/ArrowLeftWB'
import toError from '@/utils/errorHandler'

const ForgetPassword = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [emailError, setEmailError] = useState('')
  const router = useRouter()

  const validateEmail = (value: string) => {
    if (!value) return 'Email is required'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) return 'Invalid email format'
    return ''
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const error = validateEmail(email)
    if (error) {
      setEmailError(error)
      toast.error(error)
      return
    }
    setEmailError('')
    setIsLoading(true)
    try {
      await forgotPassword({ email })
      toast.success('Password reset email sent!')
      router.push(`/verify-otp?email=${email}`)
    } catch (error: unknown) {
      const e = toError(error)
      toast.error(e?.message || 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

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
          {/* Icon — lock visual */}
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
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-white font-poppins">
              Forgot your password?
            </h1>
            <p className="text-gray-400 text-sm font-poppins mt-2 leading-relaxed">
              No worries — enter your email and we&apos;ll send you a reset link.
            </p>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-4" onSubmit={onSubmit}>
            <div className="flex flex-col gap-1.5">
              <Typo as="label" fontVariant="p5b" color="white" fontFamily="poppins">
                Email Address
              </Typo>
              <Input
                id="forgot-email"
                size="s"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={val => {
                  setEmail(val)
                  setEmailError('')
                }}
                backgroundColor="#252525"
                borderColor={emailError ? '#ef4444' : 'rgba(255,255,255,0.08)'}
                className="w-full rounded-xl"
              />
              {emailError && (
                <Typo as="span" fontVariant="p6" color="customRed600" fontFamily="poppins">
                  {emailError}
                </Typo>
              )}
            </div>

            <Button
              label={isLoading ? 'Sending...' : 'Send reset link'}
              variant="contained-red"
              type="submit"
              disabled={isLoading}
              className="w-full !h-[48px] mt-1"
            />
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <span className="flex-1 h-px bg-white/10" />
          </div>

          {/* Footer links */}
          <div className="flex flex-col gap-2 text-center">
            <p className="text-sm text-gray-400 font-poppins">
              Remembered your password?{' '}
              <Link className="text-defendrRed font-semibold hover:underline" href="/login">
                Sign in
              </Link>
            </p>
            <p className="text-sm text-gray-400 font-poppins">
              Don&apos;t have an account?{' '}
              <Link className="text-defendrRed font-semibold hover:underline" href="/signup">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </aside>
    </section>
  )
}

export default ForgetPassword
