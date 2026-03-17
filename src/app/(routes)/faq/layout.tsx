import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ — How to Compete, Organize & Win on DEFENDR.GG',
  description:
    'Get answers about competing in tournaments, earning XP and rewards, organizing events, connecting with brands, and managing teams on DEFENDR.GG — the esports platform.',
  keywords: [
    'esports platform FAQ',
    'how to join tournament',
    'how to organize esports event',
    'earn XP esports',
    'tournament reward system',
    'esports brand sponsorship FAQ',
    'gaming platform help',
    'esports leaderboard FAQ',
  ],
  alternates: { canonical: 'https://defendr.gg/faq' },
  openGraph: {
    title: 'Esports Platform FAQ | DEFENDR.GG',
    description:
      'Everything you need to know about competing, organizing, earning rewards, and growing your esports presence on DEFENDR.GG.',
    url: 'https://defendr.gg/faq',
    type: 'website',
  },
}

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
