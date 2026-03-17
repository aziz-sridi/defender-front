'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState, useCallback } from 'react'
import { toast } from 'sonner'

import Button from '@/components/ui/Button'
import Typo from '@/components/ui/Typo'
import { verifyOTP, forgotPassword } from '@/services/userService'

const OTP_LENGTH = 6
const TIMER_START = 600 // 10 minutes in seconds

type VerifyOtpFormProps = {
  email: string
}

const VerifyOtpForm: React.FC<VerifyOtpFormProps> = ({ email }) => {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''))
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [timer, setTimer] = useState(TIMER_START)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()

  // Countdown using setInterval — not setTimeout (prevents drift)
  useEffect(() => {
    if (timer <= 0) return
    const interval = setInterval(() => setTimer(prev => prev - 1), 1000)
    return () => clearInterval(interval)
  }, [timer])

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}:${s < 10 ? `0${s}` : s}`
  }

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return // only single digit
    const next = [...otp]
    next[index] = value
    setOtp(next)
    // Auto-advance to next box
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (pasted.length === OTP_LENGTH) {
      const next = pasted.split('')
      setOtp(next)
      inputRefs.current[OTP_LENGTH - 1]?.focus()
    }
  }

  const handleResend = useCallback(async () => {
    if (timer > 0 || isResending || !email) return
    setIsResending(true)
    try {
      await forgotPassword({ email })
      toast.success('A new code has been sent to your email.')
      setTimer(TIMER_START)
      setOtp(Array(OTP_LENGTH).fill(''))
      inputRefs.current[0]?.focus()
    } catch {
      toast.error('Failed to resend code. Please try again.')
    } finally {
      setIsResending(false)
    }
  }, [timer, isResending, email])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    const code = otp.join('')
    if (code.length < OTP_LENGTH) {
      toast.error('Please enter the full 6-digit code.')
      return
    }
    setIsLoading(true)
    try {
      await verifyOTP({ email, otp: code })
      router.push(`/reset-password?email=${email}&otp=${code}`)
    } catch {
      toast.error('Wrong code. Please try again.')
      setOtp(Array(OTP_LENGTH).fill(''))
      inputRefs.current[0]?.focus()
    } finally {
      setIsLoading(false)
    }
  }

  const isComplete = otp.every(d => d !== '')

  return (
    <form className="flex flex-col gap-6" onSubmit={handleVerify}>
      {/* OTP boxes — fixed square, one char each */}
      <div className="flex justify-center gap-3" onPaste={handlePaste}>
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={el => {
              inputRefs.current[index] = el
            }}
            id={`otp-input-${index}`}
            autoComplete="one-time-code"
            inputMode="numeric"
            maxLength={1}
            pattern="[0-9]*"
            type="text"
            value={digit}
            className={`
              w-11 h-11 sm:w-12 sm:h-12 rounded-xl text-lg font-bold text-center font-poppins
              border transition-all duration-150 outline-none flex-shrink-0
              focus:ring-2 focus:ring-defendrRed focus:border-transparent
              ${
                digit
                  ? 'bg-defendrRed/10 border-defendrRed text-white'
                  : 'bg-[#252525] border-white/10 text-white'
              }
            `}
            onChange={e => handleChange(index, e.target.value)}
            onKeyDown={e => handleKeyDown(index, e)}
          />
        ))}
      </div>

      {/* Timer + resend */}
      <div className="flex items-center justify-between">
        <Typo as="p" fontVariant="p5" color="grey" fontFamily="poppins">
          {timer > 0 ? (
            <>
              Code expires in <span className="text-white font-medium">{formatTime(timer)}</span>
            </>
          ) : (
            'Code expired'
          )}
        </Typo>
        <button
          type="button"
          disabled={timer > 0 || isResending}
          onClick={handleResend}
          className={`text-sm font-semibold font-poppins transition-colors ${
            timer > 0 || isResending
              ? 'text-gray-600 cursor-not-allowed'
              : 'text-defendrRed hover:underline cursor-pointer'
          }`}
        >
          {isResending ? 'Sending...' : 'Resend code'}
        </button>
      </div>

      {/* Submit */}
      <Button
        label={isLoading ? 'Verifying...' : 'Verify code'}
        variant="contained-red"
        type="submit"
        disabled={isLoading || !isComplete}
        className="w-full !h-[48px]"
      />
    </form>
  )
}

export default VerifyOtpForm
