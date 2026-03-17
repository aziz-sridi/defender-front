'use client'

import { FC, useState } from 'react'
import { useForm } from 'react-hook-form'

import { updateProfile } from '@/services/userService'

interface EnterNumberProps {
  email: string
  onSubmit: (data: EnterNumberFormData) => Promise<void> | void
  onSkip?: () => void
}

export interface EnterNumberFormData {
  phoneNumber: string
}

const EnterNumber: FC<EnterNumberProps> = ({ onSubmit, onSkip }) => {
  const [isLoading, setIsLoading] = useState(false)

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<EnterNumberFormData>({
    defaultValues: {
      phoneNumber: '',
    },
  })

  const phoneNumber = watch('phoneNumber')

  const onFormSubmit = async (data: EnterNumberFormData) => {
    setIsLoading(true)
    try {
      // Save phone number to user profile
      await updateProfile({ phone: data.phoneNumber })
      // After saving, call onSkip to proceed
      if (onSkip) {
        onSkip()
      }
      // --- Original logic for reference ---
      // Persist phone number to user profile immediately after entry (before OTP verification)
      // In the future, consider moving this after OTP verification for better security/UX.
      // await updateProfile({ phone: data.phoneNumber })
      // await onSubmit(data)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className="w-full max-w-3xl mx-auto px-0 pt-8" onSubmit={handleSubmit(onFormSubmit)}>
      <div className="flex flex-col gap-4 font-poppins">
        <input
          autoComplete="tel"
          className={`h-14 rounded-[18px] w-full px-6 text-lg text-white placeholder:text-white/50 border-none focus:ring-2 focus:ring-defendrRed bg-[#232228] ${
            (errors as Record<string, unknown>)?.phoneNumber
              ? 'border border-red-600 bg-[#733636]'
              : ''
          }`}
          id="signup-phone"
          name="phoneNumber"
          placeholder="Phone Number"
          type="tel"
          value={phoneNumber}
          onChange={e => setValue('phoneNumber', e.target.value)}
          style={{ marginBottom: '0.5rem' }}
        />
        {/* Email field removed as per request */}
        <div className="text-left w-full mt-1 mb-2">
          <span className="text-xs text-white/60 font-poppins">
            Phone number is optionally useful for payment.
            <br />
            If you don't wish to complete, you can skip it and complete later directly on your
            profile.
          </span>
        </div>
      </div>

      <button
        className="w-full h-14 mt-2 rounded-[18px] bg-defendrRed text-white text-lg font-bold font-poppins tracking-wide uppercase shadow-none hover:opacity-90 transition disabled:opacity-60"
        disabled={isLoading}
        type="submit"
        style={{ background: 'var(--Primary-Color-Color, #D62555)' }}
      >
        {isLoading ? 'just a moment...' : 'SAVE PHONE NUMBER'}
      </button>

      {onSkip && (
        <button
          className="w-full h-12 mt-2 text-white text-base font-poppins bg-transparent border-none shadow-none hover:underline"
          type="button"
          onClick={onSkip}
          style={{ outline: 'none' }}
        >
          Skip For Now
        </button>
      )}
    </form>
  )
}

export default EnterNumber
