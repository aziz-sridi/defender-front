import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Careers — Build the Future of Esports',
  description:
    'Join the DEFENDR.GG team and help build the next-generation esports platform. Open roles in engineering, esports operations, marketing, and brand partnerships.',
  keywords: [
    'esports jobs',
    'gaming industry careers',
    'esports platform developer jobs',
    'gaming startup jobs',
    'esports marketing careers',
    'competitive gaming jobs',
    'DEFENDR careers',
    'esports operations jobs',
  ],
  alternates: { canonical: 'https://defendr.gg/jobs' },
  openGraph: {
    title: 'Careers at DEFENDR.GG — Build the Future of Esports',
    description:
      'Help build the platform where players compete, organizers grow, and brands connect with the gaming world. Explore open roles at DEFENDR.GG.',
    url: 'https://defendr.gg/jobs',
    type: 'website',
  },
}

export default function JobsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
