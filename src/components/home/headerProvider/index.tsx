'use client'
import { usePathname } from 'next/navigation'
const HeaderProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()

  const hidePaths = [
    '/login',
    '/signup',
    '/forget-password',
    '/reset-password',
    '/verify-otp',
    '/complete-registration',
  ]

  const shouldHide =
    hidePaths.some(path => pathname?.startsWith(path)) || pathname?.includes('compete-registration')

  if (shouldHide) {
    return null
  }

  return <>{children}</>
}

export default HeaderProvider
