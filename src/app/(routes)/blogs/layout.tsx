import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Esports News, Tips & Gaming Blog',
  description:
    "Stay ahead in competitive gaming with DEFENDR.GG's blog. Tournament news, player tips, organizer guides, XP strategies, leaderboard insights and esports industry updates.",
  keywords: [
    'esports news',
    'gaming blog',
    'tournament tips',
    'competitive gaming guides',
    'esports industry updates',
    'player XP strategies',
    'organizer event guides',
    'esports leaderboard tips',
    'gaming tutorials',
    'esports content',
  ],
  alternates: { canonical: 'https://defendr.gg/blogs' },
  openGraph: {
    title: 'Esports News, Tips & Gaming Blog | DEFENDR.GG',
    description:
      'From tournament guides to competitive strategies — the DEFENDR.GG blog covers everything players and organizers need to compete and grow.',
    url: 'https://defendr.gg/blogs',
    type: 'website',
  },
}

export default function BlogsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
