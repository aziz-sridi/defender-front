import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Review the DEFENDR.GG Terms of Service. Understand the rules for competing in tournaments, organizing events, and participating in the competitive gaming ecosystem.',
  alternates: { canonical: 'https://defendr.gg/terms' },
  robots: { index: true, follow: false },
}

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
