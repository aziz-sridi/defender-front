'use client'
import Typo from '@/components/ui/Typo'
import Button from '@/components/ui/Button'
import { resendMailVerification } from '@/services/userService'
import { toast } from 'sonner'

export default function VerifMailClient({ showBanner }: { showBanner: boolean }) {
  const verifyEmail = async () => {
    try {
      await resendMailVerification()
      toast.success('Email sent')
    } catch {
      toast.error('Please try again later')
    }
  }

  if (!showBanner) return null

  return (
    <div className="w-full bg-defendrRed py-1 flex items-center px-4 sm:px-0 justify-center gap-3">
      <Typo as="p" fontFamily="poppins" fontVariant="p4">
        Please verify your email address
      </Typo>
      <Button
        className="px-4 py-2 text-xs sm:text-sm w-auto rounded-lg hover:shadow-sm hover:scale-95 transition-all"
        label="Resend email"
        variant="contained-ghostRed"
        onClick={verifyEmail}
      />
    </div>
  )
}
