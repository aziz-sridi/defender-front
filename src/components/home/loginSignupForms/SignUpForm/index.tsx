'use client'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

import { resendMailVerification, signUpPlayer } from '@/services/userService'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Inputs'
import Typo from '@/components/ui/Typo'
import toError from '@/utils/errorHandler'

const signUpSchema = z
  .object({
    nickname: z.string().min(1, 'Nickname is required'),
    fullname: z.string().min(1, 'Full name is required'),
    email: z.string().min(1, 'Email is required').email('Invalid email format'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .max(50, 'Password must be at most 50 characters long')
      .regex(
        /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,50}$/,
        'Password must contain one uppercase letter, one lowercase letter, one number, and one special character',
      ),
    confirmPassword: z.string().min(1, 'Confirm Password is required'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  })

const SignUpForm = () => {
  const [form, setForm] = useState({
    nickname: '',
    fullname: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()

  const updateField = (field: string) => (value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const validate = () => {
    const result = signUpSchema.safeParse(form)
    const newErrors: Record<string, string> = {}
    if (!result.success) {
      const formatted = result.error.format()
      const fieldOrder: (keyof typeof form)[] = [
        'confirmPassword',
        'password',
        'email',
        'fullname',
        'nickname',
      ]
      fieldOrder.forEach(field => {
        const fieldErrors = formatted[field]?._errors
        if (fieldErrors?.length) {
          newErrors[field] = fieldErrors[0]
          toast.error(fieldErrors[0])
        }
      })
      if (formatted._errors?.length) {
        formatted._errors.forEach(err => toast.error(err))
      }
      setErrors(newErrors)
      return false
    }
    setErrors({})
    return true
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    try {
      await signUpPlayer({
        nickname: form.nickname,
        fullname: form.fullname,
        email: form.email,
        password: form.password,
      })
      toast.success('Account created successfully!')
      const signInResponse = await signIn('credentials', {
        redirect: false,
        email: form.email,
        password: form.password,
      })
      if (signInResponse?.error) {
        toast.error(signInResponse.error)
        setIsLoading(false)
        return
      }

      try {
        await resendMailVerification()
        toast.success('Verification email sent!')
      } catch (err) {
        console.error('resendMailVerification failed:', err)
        toast.error('Failed to send verification email')
      }

      router.refresh()
      router.replace('/')
    } catch (error: unknown) {
      const e = toError(error)
      toast.error(e?.message || 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className="w-full flex flex-col gap-4" onSubmit={onSubmit}>
      {/* Nickname */}
      <div className="flex flex-col gap-1.5">
        <Typo as="label" fontVariant="p5b" color="white" fontFamily="poppins">
          Nickname
        </Typo>
        <Input
          id="signup-nickname"
          name="nickname"
          size="s"
          type="text"
          autoComplete="username"
          placeholder="Your gaming alias"
          value={form.nickname}
          onChange={updateField('nickname')}
          backgroundColor="#252525"
          borderColor={errors.nickname ? '#ef4444' : 'rgba(255,255,255,0.08)'}
          className="w-full rounded-xl"
        />
        {errors.nickname && (
          <Typo as="span" fontVariant="p6" color="customRed600" fontFamily="poppins">
            {errors.nickname}
          </Typo>
        )}
      </div>

      {/* Full Name */}
      <div className="flex flex-col gap-1.5">
        <Typo as="label" fontVariant="p5b" color="white" fontFamily="poppins">
          Full Name
        </Typo>
        <Input
          id="signup-fullname"
          name="fullname"
          size="s"
          type="text"
          autoComplete="name"
          placeholder="Your full name"
          value={form.fullname}
          onChange={updateField('fullname')}
          backgroundColor="#252525"
          borderColor={errors.fullname ? '#ef4444' : 'rgba(255,255,255,0.08)'}
          className="w-full rounded-xl"
        />
        {errors.fullname && (
          <Typo as="span" fontVariant="p6" color="customRed600" fontFamily="poppins">
            {errors.fullname}
          </Typo>
        )}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <Typo as="label" fontVariant="p5b" color="white" fontFamily="poppins">
          Email Address
        </Typo>
        <Input
          id="signup-email"
          name="email"
          size="s"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={updateField('email')}
          backgroundColor="#252525"
          borderColor={errors.email ? '#ef4444' : 'rgba(255,255,255,0.08)'}
          className="w-full rounded-xl"
        />
        {errors.email && (
          <Typo as="span" fontVariant="p6" color="customRed600" fontFamily="poppins">
            {errors.email}
          </Typo>
        )}
      </div>

      {/* Password — toggle is built into Input */}
      <div className="flex flex-col gap-1.5">
        <Typo as="label" fontVariant="p5b" color="white" fontFamily="poppins">
          Password
        </Typo>
        <Input
          id="signup-password"
          name="password"
          size="s"
          type="password"
          autoComplete="new-password"
          placeholder="Min 8 chars, uppercase, number, symbol"
          value={form.password}
          onChange={updateField('password')}
          backgroundColor="#252525"
          borderColor={errors.password ? '#ef4444' : 'rgba(255,255,255,0.08)'}
          className="w-full rounded-xl"
        />
        {errors.password && (
          <Typo as="span" fontVariant="p6" color="customRed600" fontFamily="poppins">
            {errors.password}
          </Typo>
        )}
      </div>

      {/* Confirm Password — toggle is built into Input */}
      <div className="flex flex-col gap-1.5">
        <Typo as="label" fontVariant="p5b" color="white" fontFamily="poppins">
          Confirm Password
        </Typo>
        <Input
          id="signup-confirm-password"
          name="confirmPassword"
          size="s"
          type="password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          value={form.confirmPassword}
          onChange={updateField('confirmPassword')}
          backgroundColor="#252525"
          borderColor={errors.confirmPassword ? '#ef4444' : 'rgba(255,255,255,0.08)'}
          className="w-full rounded-xl"
        />
        {errors.confirmPassword && (
          <Typo as="span" fontVariant="p6" color="customRed600" fontFamily="poppins">
            {errors.confirmPassword}
          </Typo>
        )}
      </div>

      {/* Privacy checkbox */}
      <div className="flex items-start gap-2 mt-1">
        <input
          required
          className="w-4 h-4 mt-0.5 rounded border-2 border-solid custom-primary-checkbox flex-shrink-0"
          id="age-privacy-check"
          type="checkbox"
        />
        <label className="leading-snug" htmlFor="age-privacy-check">
          <Typo as="span" color="white" fontFamily="poppins" fontVariant="p5">
            I am over 13 years of age and accept the{' '}
            <a
              className="font-bold font-poppins text-defendrRed hover:underline"
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

      {/* Submit — uses project Button */}
      <Button
        label={isLoading ? 'Creating account...' : 'Sign Up'}
        variant="contained-red"
        type="submit"
        disabled={isLoading}
        className="w-full !h-[48px] mt-1"
      />
    </form>
  )
}

export default SignUpForm
