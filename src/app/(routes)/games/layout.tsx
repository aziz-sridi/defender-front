import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Games — Compete Across All Esports Titles',
  description:
    'Explore every game supported on DEFENDR.GG. Compete in Valorant, eFootball, Mobile Legends, and more. Build your ranking, earn XP, and win prizes across all esports titles.',
  keywords: [
    'esports games',
    'competitive gaming titles',
    'valorant esports',
    'efootball tournament',
    'mobile legends esports',
    'online game tournaments',
    'games with prize pools',
    'esports ranking by game',
    'gaming competition titles',
    'supported esports games',
  ],
  alternates: { canonical: 'https://defendr.gg/games' },
  openGraph: {
    title: 'All Supported Esports Games | DEFENDR.GG',
    description:
      'Choose your game, climb the ranks, and compete for prizes on DEFENDR.GG. The competitive gaming platform for all esports titles.',
    url: 'https://defendr.gg/games',
    type: 'website',
  },
}

export default function GamesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
