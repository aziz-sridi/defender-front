import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'DEFENDR Academy — Level Up Your Esports Skills',
  description:
    'Train smarter on DEFENDR Academy. Access guides, tutorials, and resources to improve your game, climb rankings, win more prizes, and build a lasting esports career.',
  keywords: [
    'esports training',
    'competitive gaming academy',
    'improve gaming skills',
    'esports coaching',
    'gaming tutorials',
    'climb esports ranking',
    'esports career growth',
    'level up gaming',
    'player improvement guide',
    'esports education',
  ],
  alternates: { canonical: 'https://defendr.gg/academy' },
  openGraph: {
    title: 'DEFENDR Academy — Level Up Your Esports Skills',
    description:
      'Tutorials, guides, and strategies to help you compete, climb the leaderboard, and win bigger prizes on DEFENDR.GG.',
    url: 'https://defendr.gg/academy',
    type: 'website',
  },
}

export default function AcademyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
