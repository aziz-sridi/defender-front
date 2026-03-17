import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI-Powered Esports Apps — Highlights, Overlays & More',
  description:
    'Supercharge your esports experience with DEFENDR apps. AI highlight clips, streaming overlays, smart tournament creation, and poster generation — built for players and organizers.',
  keywords: [
    'esports AI tools',
    'AI highlight clipper gaming',
    'esports streaming overlay',
    'tournament AI creation',
    'gaming highlight generator',
    'esports player apps',
    'AI esports platform',
    'auto highlight gaming',
    'DEFENDR apps',
    'competitive gaming tools',
  ],
  alternates: { canonical: 'https://defendr.gg/apps' },
  openGraph: {
    title: 'AI-Powered Esports Apps | DEFENDR.GG',
    description:
      'From AI highlight clipping to streaming overlays and smart tournament creation — DEFENDR apps give players and organizers the edge.',
    url: 'https://defendr.gg/apps',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
}

export default function AppsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
