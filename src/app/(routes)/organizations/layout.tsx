import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Esports Organizations — Build, Connect & Grow',
  description:
    'Discover esports organizations on DEFENDR.GG. Organizers create tournaments, connect with brands and sponsors, manage teams, and grow their competitive gaming presence.',
  keywords: [
    'esports organizations',
    'gaming tournament organizers',
    'esports team management',
    'brand esports sponsorship',
    'competitive gaming organizations',
    'esports community building',
    'organize gaming events',
    'esports network',
    'gaming organization profiles',
    'sponsor esports events',
  ],
  alternates: { canonical: 'https://defendr.gg/organizations' },
  openGraph: {
    title: 'Esports Organizations — Build, Connect & Grow | DEFENDR.GG',
    description:
      'The platform where organizers build events, connect with brands, and grow their esports footprint. Explore organizations on DEFENDR.GG.',
    url: 'https://defendr.gg/organizations',
    type: 'website',
  },
}

export default function OrganizationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
