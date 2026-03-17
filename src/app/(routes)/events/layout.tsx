import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Live Esports Events & Brand-Sponsored Competitions',
  description:
    'Discover live and upcoming esports events on DEFENDR.GG. Players compete for leaderboard glory and prizes while brands connect directly with the competitive gaming community.',
  keywords: [
    'esports events',
    'live gaming competitions',
    'brand-sponsored esports',
    'esports leaderboard',
    'competitive gaming events',
    'gaming community events',
    'esports brand engagement',
    'online gaming event',
    'esports prize pool events',
  ],
  alternates: { canonical: 'https://defendr.gg/events' },
  openGraph: {
    title: 'Live Esports Events & Brand Competitions | DEFENDR.GG',
    description:
      'Players compete for rankings and rewards, brands engage with the gaming community. Explore events on the esports platform built for growth.',
    url: 'https://defendr.gg/events',
    type: 'website',
  },
}

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
