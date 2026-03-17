import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us — Partnerships, Support & Brand Inquiries',
  description:
    'Get in touch with DEFENDR.GG for player support, organizer onboarding, brand partnerships, and sponsorship opportunities in the competitive esports ecosystem.',
  keywords: [
    'esports platform contact',
    'esports brand partnership',
    'esports sponsor inquiry',
    'tournament organizer support',
    'gaming platform help',
    'esports business inquiry',
    'DEFENDR contact',
  ],
  alternates: { canonical: 'https://defendr.gg/contact' },
  openGraph: {
    title: 'Contact DEFENDR.GG — Partnerships & Support',
    description:
      'Reach us for brand partnerships, sponsorship inquiries, organizer onboarding, or player support. We connect the entire competitive gaming ecosystem.',
    url: 'https://defendr.gg/contact',
    type: 'website',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
