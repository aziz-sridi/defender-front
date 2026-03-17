import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing — Free to Compete, Pro Tools to Grow',
  description:
    'Players compete free. Organizers unlock pro tools to create events, connect with brands, and monetize tournaments. Find the perfect DEFENDR.GG plan for your esports journey.',
  keywords: [
    'esports platform pricing',
    'free esports tournament',
    'organizer pro tools',
    'tournament management plan',
    'esports subscription',
    'competitive gaming free plan',
    'brand esports partnership',
    'esports monetization',
    'gaming platform tiers',
  ],
  alternates: { canonical: 'https://defendr.gg/pricing' },
  openGraph: {
    title: 'Pricing — Free to Compete, Pro Tools to Grow | DEFENDR.GG',
    description:
      'Start for free as a player. Upgrade to unlock organizer tools, brand integrations and advanced tournament management on DEFENDR.GG.',
    url: 'https://defendr.gg/pricing',
    type: 'website',
  },
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
