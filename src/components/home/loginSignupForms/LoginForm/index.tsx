'use client'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

import Button from '@/components/ui/Button'
import Input from '@/components/ui/Inputs'
import Typo from '@/components/ui/Typo'

const loginSchema = z.object({
  password: z.string().min(1, 'Password is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
})

const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isPending, setPending] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const oauthError = searchParams.get('error')
    if (!oauthError) return

    if (oauthError === 'EmailAlreadyExists') {
      toast.error('This email is already registered. Sign in with your password instead.', {
        duration: 6000,
      })
    } else if (oauthError === 'OAuthAccountError') {
      toast.error('OAuth sign-in failed. Please try again or use email/password.', {
        duration: 5000,
      })
    } else if (oauthError === 'OAuthCallback' || oauthError === 'OAuthSignin') {
      toast.error('OAuth sign-in failed. Please try again.', { duration: 5000 })
    }

    window.history.replaceState({}, '', window.location.pathname)
  }, [searchParams])

  const validate = () => {
    const result = loginSchema.safeParse({ password, email })
    const fieldErrors: { password?: string; email?: string } = {}

    if (!result.success) {
      const formatted = result.error.format()
      if (formatted.password?._errors?.length) {
        fieldErrors.password = formatted.password._errors[0]
        toast.error(formatted.password._errors[0])
      }
      if (formatted.email?._errors?.length) {
        fieldErrors.email = formatted.email._errors[0]
        toast.error(formatted.email._errors[0])
      }
      setErrors(fieldErrors)
      return false
    }

    setErrors({})
    return true
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const params = new URLSearchParams(window.location.search)
    const callbackUrl = params.get('callbackUrl') || '/'
    setPending(true)

    try {
      const result = await signIn('credentials', { redirect: false, email, password, callbackUrl })
      setPending(false)

      if (result?.error) {
        toast.error(
          result.error.includes('CredentialsSignin') ? 'Invalid email or password' : result.error,
        )
        return
      }

      router.refresh()
      router.replace(callbackUrl)
    } catch {
      setPending(false)
      toast.error('Unable to sign in. Please try again.')
    }
  }

  return (
    <form className="w-full flex flex-col gap-5" onSubmit={onSubmit}>
      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <Typo as="label" fontVariant="p5b" color="white" fontFamily="poppins">
          Email Address
        </Typo>
        <Input
          id="login-email"
          size="s"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={setEmail}
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

      {/* Password — Input now handles the eye toggle internally */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Typo as="label" fontVariant="p5b" color="white" fontFamily="poppins">
            Password
          </Typo>
          <a
            className="text-xs text-defendrRed font-semibold font-poppins hover:underline"
            href="/forget-password"
          >
            Forgot password?
          </a>
        </div>
        <Input
          id="login-password"
          size="s"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={setPassword}
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

      {/* Submit */}
      <Button
        label={isPending ? 'Signing in...' : 'Login'}
        variant="contained-red"
        type="submit"
        disabled={isPending}
        className="w-full !h-[48px] mt-1"
      />
    </form>
  )
}

export default LoginForm
