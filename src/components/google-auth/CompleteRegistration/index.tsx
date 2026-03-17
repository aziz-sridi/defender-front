'use client'

import { FC, useState } from 'react'
import { useForm } from 'react-hook-form'

import Typo from '@/components/ui/Typo'

interface CompleteRegistrationProps {
  defaultNickname: string
  email: string
  onSubmit: (data: CompleteRegistrationFormData) => Promise<void> | void
}

export interface CompleteRegistrationFormData {
  nickname: string
  email: string
}

const CompleteRegistration: FC<CompleteRegistrationProps> = ({
  defaultNickname,
  email,
  onSubmit,
}) => {
  const [isLoading, setIsLoading] = useState(false)

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CompleteRegistrationFormData>({
    defaultValues: { email, nickname: defaultNickname },
  })

  const nickname = watch('nickname')

  const onFormSubmit = async (data: CompleteRegistrationFormData) => {
    setIsLoading(true)
    try {
      await onSubmit(data)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className="w-full flexCenter flex-col text-center" onSubmit={handleSubmit(onFormSubmit)}>
      <div className="w-full flex flex-col gap-4 mb-1 font-poppins">
        <label className="block mb-1 text-left lg:hidden" htmlFor="signup-nickname">
          <Typo as="span" color="white" fontFamily="poppins" fontVariant="p5b">
            Nickname
          </Typo>
        </label>
        <input
          autoComplete="on"
          className={`lg:h-12 h-10 rounded-full w-full px-4 lg:py-2 text-white placeholder:text-white/50 ${
            // use same error key as SignUpForm for visual parity
            (errors as Record<string, unknown>)?.nickname
              ? 'border border-red-600 bg-[#733636]'
              : 'bg-[#302F31]'
          }`}
          id="signup-nickname"
          name="nickname"
          placeholder="Nickname"
          type="text"
          value={nickname}
          onChange={e => setValue('nickname', e.target.value)}
        />

        <label className="block mb-1 text-left lg:hidden" htmlFor="signup-email">
          <Typo as="span" color="white" fontFamily="poppins" fontVariant="p5b">
            Email
          </Typo>
        </label>
        <input
          disabled
          autoComplete="on"
          className={`lg:h-12 h-10 rounded-full w-full px-4 py-2 text-white placeholder:text-white/50 bg-[#302F31]`}
          id="signup-email"
          name="email"
          placeholder="Email Address"
          type="email"
          value={email}
        />
      </div>

      <button
        className="bg-defendrRed w-full lg:w-[70%] p-2 rounded-[13px] flexCenter uppercase mt-3 text-white font-poppins"
        disabled={isLoading}
        style={{ background: 'var(--Primary-Color-Color, #D62555)' }}
        type="submit"
      >
        {isLoading ? 'just a moment...' : 'Complete Registration'}
      </button>

      <div className="flex items-start pl-4 lg:pl-0 lg:gap-3 gap-1 w-full mt-4 font-poppins">
        <input
          required
          className="w-4 h-4 mt-1 rounded border-2 border-solid custom-primary-checkbox"
          id="age-privacy-check"
          type="checkbox"
        />
        <label className="leading-snug" htmlFor="age-privacy-check">
          <Typo as="span" color="white" fontFamily="poppins" fontVariant="p5">
            I am over 13 years of age and accept the{' '}
            <a
              className="font-bold font-poppins text-defendrRed"
              href="/privacy-policy"
              rel="noopener noreferrer"
              target="_blank"
            >
              Privacy policy
            </a>
            .
          </Typo>
        </label>
      </div>
    </form>
  )
}

export default CompleteRegistration
