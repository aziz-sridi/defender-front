import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Esports Organizer Tools — Create & Monetize Tournaments',
  description:
    'Powerful SaaS tools for esports organizers on DEFENDR.GG. Create events, automate brackets, manage participants, connect with brands, and monetize tournaments at any scale.',
  keywords: [
    'esports organizer tools',
    'tournament management software',
    'create esports tournament',
    'monetize gaming events',
    'bracket automation',
    'esports organizer dashboard',
    'brand sponsorship esports',
    'esports event management software',
    'manage gaming tournament',
    'esports SaaS platform',
  ],
  alternates: { canonical: 'https://defendr.gg/saas' },
  openGraph: {
    title: 'Esports Organizer Tools — Create & Monetize Tournaments | DEFENDR.GG',
    description:
      'From bracket automation to brand connections — DEFENDR.GG gives organizers everything to run, scale, and monetize competitive esports events.',
    url: 'https://defendr.gg/saas',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
}

export default function SaaSLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
