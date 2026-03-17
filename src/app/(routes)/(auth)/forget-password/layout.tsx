import { Metadata } from 'next'
import ForgetPassword from './page'

export const metadata: Metadata = {
  title: 'Reset Your Password',
  description:
    'Forgot your DEFENDR.GG password? Reset it quickly and get back to competing in esports tournaments.',
  alternates: { canonical: 'https://defendr.gg/forget-password' },
  robots: { index: false, follow: false },
}
export default ForgetPassword
