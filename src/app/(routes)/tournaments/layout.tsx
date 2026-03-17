import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Browse Online Esports Tournaments',
  description:
    'Discover, join, and compete in online esports tournaments on DEFENDR.GG. Bracket automation, player rankings, and free entry across all competitive gaming titles.',
  keywords: [
    'online esports tournaments',
    'gaming competitions online',
    'tournament bracket automation',
    'competitive gaming platform',
    'esports event management software',
    'free gaming tournament',
    'esports player ranking',
    'valorant tournament',
    'efootball esports',
    'join gaming tournament',
  ],
  alternates: {
    canonical: 'https://defendr.gg/tournaments',
  },
  openGraph: {
    title: 'Online Esports Tournaments | DEFENDR.GG',
    description:
      'Compete in tournaments, earn XP, win prizes and build your esports career. Join the competitive gaming platform trusted by players worldwide.',
    url: 'https://defendr.gg/tournaments',
    type: 'website',
  },
}

export default function TournamentsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
