import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'DZ Ramadan Esports Champions Tour',
  description:
    'Compete in the biggest Ramadan esports tournament series in Algeria on DEFENDR.GG. Multiple games, massive prize pools — climb the leaderboard and claim your glory.',
  keywords: [
    'DZ Ramadan esports',
    'Algeria esports tournament',
    'Ramadan gaming event',
    'North Africa esports',
    'DZ esports competition',
    'competitive gaming Algeria',
    'Ramadan prize pool',
  ],
  alternates: { canonical: 'https://defendr.gg/event/dz-ramadhan' },
  openGraph: {
    title: 'DZ Ramadan Esports Champions Tour | DEFENDR.GG',
    description:
      'The biggest Ramadan esports event in Algeria is here. Compete across multiple games, earn your spot on the leaderboard and win massive prizes.',
    url: 'https://defendr.gg/event/dz-ramadhan',
    type: 'website',
  },
}

export default function DzRamadhanLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
