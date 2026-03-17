'use client'

import { FC, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

import Typo from '@/components/ui/Typo'
import Button from '@/components/ui/Button'

interface ConfirmCodeProps {
  email: string
  phoneNumber: string
  onSubmit: (data: ConfirmCodeFormData) => Promise<void> | void
  onResend?: () => void
  onSkip?: () => void
  onChangeNumber?: () => void
}

export interface ConfirmCodeFormData {
  code: string
}

const ConfirmCode: FC<ConfirmCodeProps> = ({
  email: _email,
  phoneNumber: _phone,
  onSubmit,
  onResend,
  onSkip,
  onChangeNumber,
}) => {
  const router = useRouter()
  const { handleSubmit } = useForm<ConfirmCodeFormData>()
  const [code, setCode] = useState<string[]>(['', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[0]
    }

    const newCode = [...code]
    newCode[index] = value

    setCode(newCode)

    if (value && index < 3) {
      const nextInput = document.getElementById(`code-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`)
      prevInput?.focus()
    }
  }

  const onFormSubmit = async () => {
    const codeString = code.join('')
    setIsLoading(true)
    try {
      await onSubmit({ code: codeString })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form
      className="w-full flex flex-col items-center justify-center text-center"
      onSubmit={handleSubmit(onFormSubmit)}
    >
      <div className="w-full flex flex-col gap-4 mb-1 font-poppins items-center">
        {/* Remove label for a cleaner look */}
        <div className="flex justify-center gap-4 mt-2 mb-2">
          {code.map((digit, index) => (
            <input
              key={index}
              className="h-14 w-16 rounded-lg border border-[#333333] bg-[#1a1a1a] text-center text-2xl font-semibold text-white outline-none transition-colors hover:bg-[#2a2a2a] focus:border-defendrRed"
              id={`code-${index}`}
              maxLength={1}
              type="text"
              value={digit}
              onChange={e => handleCodeChange(index, e.target.value)}
              onKeyDown={e => handleKeyDown(index, e)}
              style={{ fontSize: '2rem' }}
            />
          ))}
        </div>
      </div>

      <div className="w-full max-w-md mx-auto mt-2 mb-2">
        <Typo as="p" className="text-center" color="grey" fontFamily="poppins" fontVariant="p6">
          Don&apos;t receive code?{' '}
          {onResend && (
            <button className="text-defendrRed hover:underline" type="button" onClick={onResend}>
              Re-send
            </button>
          )}
          {`  |  `}
          <button
            className="text-defendrRed hover:underline"
            type="button"
            onClick={onChangeNumber || (() => router.push('/enter-number'))}
          >
            Change number?
          </button>
        </Typo>
      </div>

      <div className="w-full flex flex-col items-center gap-3 mt-2">
        <div className="flex flex-col gap-3 w-full">
          {/* 4 * 64px input + 3 * 8px gap = 304px */}
          <Button
            className="w-full h-14 text-lg font-bold"
            fontFamily="poppins"
            label={isLoading ? 'just a moment...' : 'Verify code'}
            size="xxs"
            type="submit"
            variant="contained-red"
            disabled={isLoading}
          />
          <Button
            className="w-full h-14 text-lg font-bold"
            fontFamily="poppins"
            label="Skip For Now"
            size="xl"
            type="button"
            variant="text"
            onClick={onSkip || (() => router.push('/'))}
          />
        </div>
      </div>
    </form>
  )
}

export default ConfirmCode
