import { Metadata } from 'next'
import LoginDefendr from './page'

export const metadata: Metadata = {
  title: 'Login & Start Competing',
  description:
    'Log in to DEFENDR.GG to join tournaments, track your XP, climb the leaderboard, and compete for prizes. Your next esports victory starts here.',
  keywords: [
    'esports login',
    'compete in tournaments',
    'gaming platform login',
    'esports account',
    'competitive gaming sign in',
  ],
  alternates: { canonical: 'https://defendr.gg/login' },
  robots: { index: false, follow: false },
}
export default LoginDefendr
