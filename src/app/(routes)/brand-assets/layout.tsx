import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Brand Assets & Media Kit',
  description:
    'Download official DEFENDR.GG brand assets, logos, media kit and press materials. Ideal for partners, sponsors, and media covering the competitive esports ecosystem.',
  keywords: [
    'DEFENDR brand assets',
    'esports media kit',
    'gaming platform press kit',
    'esports partnership logos',
    'DEFENDR logo download',
    'esports brand guidelines',
  ],
  alternates: { canonical: 'https://defendr.gg/brand-assets' },
}

export default function BrandAssetsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
