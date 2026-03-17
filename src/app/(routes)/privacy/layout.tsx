import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Read the DEFENDR.GG Privacy Policy. Understand how we protect your data across tournament participation, player profiles, and platform interactions.',
  alternates: { canonical: 'https://defendr.gg/privacy' },
  robots: { index: true, follow: false },
}

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
