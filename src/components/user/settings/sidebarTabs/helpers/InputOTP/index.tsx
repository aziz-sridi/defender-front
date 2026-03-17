'use client'
import { useRef } from 'react'

export function OtpInput({
  otp,
  setOtp,
}: {
  otp: string[]
  setOtp: React.Dispatch<React.SetStateAction<string[]>>
}) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) {
      return
    }
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  return (
    <div className="flex justify-center gap-3 mt-4">
      {otp.map((digit, idx) => (
        <input
          key={idx}
          ref={el => {
            inputRefs.current[idx] = el
          }}
          className="sm:w-12 sm:h-14 w-9 h-8 text-center text-md sm:text-xl font-bold rounded-lg bg-[#2F2C2F] text-white border border-gray-600 focus:border-red-500 focus:outline-none transition-all"
          inputMode="numeric"
          maxLength={1}
          type="text"
          value={digit}
          onChange={e => handleChange(e.target.value, idx)}
          onKeyDown={e => handleKeyDown(e, idx)}
        />
      ))}
    </div>
  )
}
