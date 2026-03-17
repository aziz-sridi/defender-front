import { Metadata } from 'next'
import SignupDefendr from './page'

export const metadata: Metadata = {
  title: 'Sign Up Free — Compete, Climb & Win',
  description:
    'Create your free DEFENDR.GG account. Join online esports tournaments, earn XP, win prizes, build your player profile, and connect with organizers and brands.',
  keywords: [
    'join esports platform',
    'create gaming account',
    'free esports sign up',
    'competitive gaming registration',
    'earn XP play tournaments',
    'esports career start',
    'gaming community join',
  ],
  alternates: { canonical: 'https://defendr.gg/signup' },
  openGraph: {
    title: 'Join DEFENDR.GG Free — Compete, Climb & Win',
    description:
      'Sign up and enter the competitive esports ecosystem. Compete in online tournaments, earn rewards, build your career and connect with brands on DEFENDR.GG.',
    url: 'https://defendr.gg/signup',
    type: 'website',
  },
}
export default SignupDefendr
