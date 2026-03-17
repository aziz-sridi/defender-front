'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import Button from '@/components/ui/Button'
import Input from '@/components/ui/Inputs'
import Typo from '@/components/ui/Typo'
import ArrowLeftWB from '@/components/ui/Icons/ArrowLeftWB'
import { resetPassword } from '@/services/userService'

const ResetPassword = () => {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ new?: string; confirm?: string }>({})
  const router = useRouter()

  useEffect(() => {
    setEmail(searchParams.get('email') || '')
    setOtp(searchParams.get('otp') || '')
  }, [searchParams])

  const validate = () => {
    const newErrors: { new?: string; confirm?: string } = {}
    if (!newPassword) newErrors.new = 'New password is required'
    if (!confirmPassword) newErrors.confirm = 'Please confirm your password'
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      newErrors.confirm = 'Passwords do not match'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) {
      toast.error(errors.new || errors.confirm || 'Please fix the errors above')
      return
    }
    setIsLoading(true)
    try {
      await resetPassword({ email, newPassword, otp })
      toast.success('Password reset successfully!')
      router.push('/login')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to reset password. Please try again.'
      toast.error(msg)
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
                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
              />
            </svg>
          </div>

          {/* Heading */}
          <div className="mb-7">
            <h1 className="text-2xl lg:text-3xl font-bold text-white font-poppins">
              Set new password
            </h1>
            <p className="text-gray-400 text-sm font-poppins mt-2 leading-relaxed">
              Your new password must be different from your previous one.
            </p>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* New password — toggle built into Input */}
            <div className="flex flex-col gap-1.5">
              <Typo as="label" fontVariant="p5b" color="white" fontFamily="poppins">
                New Password
              </Typo>
              <Input
                id="reset-new-password"
                name="password"
                size="s"
                type="password"
                autoComplete="new-password"
                placeholder="Min 8 characters"
                value={newPassword}
                onChange={setNewPassword}
                backgroundColor="#252525"
                borderColor={errors.new ? '#ef4444' : 'rgba(255,255,255,0.08)'}
                className="w-full rounded-xl"
              />
              {errors.new && (
                <Typo as="span" fontVariant="p6" color="customRed600" fontFamily="poppins">
                  {errors.new}
                </Typo>
              )}
            </div>

            {/* Confirm password — toggle built into Input */}
            <div className="flex flex-col gap-1.5">
              <Typo as="label" fontVariant="p5b" color="white" fontFamily="poppins">
                Confirm Password
              </Typo>
              <Input
                id="reset-confirm-password"
                name="confirmPassword"
                size="s"
                type="password"
                autoComplete="new-password"
                placeholder="Re-enter your new password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                backgroundColor="#252525"
                borderColor={errors.confirm ? '#ef4444' : 'rgba(255,255,255,0.08)'}
                className="w-full rounded-xl"
              />
              {errors.confirm && (
                <Typo as="span" fontVariant="p6" color="customRed600" fontFamily="poppins">
                  {errors.confirm}
                </Typo>
              )}
            </div>

            <Button
              label={isLoading ? 'Resetting...' : 'Reset password'}
              variant="contained-red"
              type="submit"
              disabled={isLoading}
              className="w-full !h-[48px] mt-1"
            />
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-400 font-poppins mt-6">
            Remembered your password?{' '}
            <Link className="text-defendrRed font-semibold hover:underline" href="/login">
              Sign in
            </Link>
          </p>
        </div>
      </aside>
    </section>
  )
}

export default ResetPassword
