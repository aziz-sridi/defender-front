import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import Script from 'next/script'
import { SessionProviderWrapper } from '@/app/SessionProviderWrapper'
import { Toaster } from '@/components/ui/sonner'
import VerifMailBanner from '@/components/verifyMail/VerifMailBanner'
import './globals.css'
import HeaderProvider from '@/components/home/headerProvider'
import Header from '@/components/home/header'
import Footer from '@/components/home/Footer'
import DiscordHelpWidget from '@/components/ui/DiscordHelpWidget'
import { ThemeProvider } from '@/components/context/ThemeProvider'
const poppins = Poppins({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: {
    template: '%s | DEFENDR.GG',
    default: 'DEFENDR.GG — Esports Tournament Platform | Play. Compete. Rise.',
  },
  description:
    'Defendr.gg is an all-in-one esports platform enabling players to compete in tournaments, organizers to manage events, and brands to connect with the gaming community.',
  keywords: [
    // Primary
    'esports platform',
    'online esports tournaments',
    'gaming tournament platform',
    'competitive gaming platform',
    'esports event management software',
    // Secondary
    'player ranking system',
    'tournament bracket automation',
    'esports organizer tools',
    'gaming competitions online',
    'esports community platform',
    // Long-tail
    'free online gaming tournaments',
    'esports team management',
    'esports XP rewards',
    'tournament prize pool',
    'esports matchmaking',
    'valorant tournament',
    'efootball tournament platform',
    'mobile legends esports',
  ],
  authors: [{ name: 'DEFENDR.GG', url: 'https://defendr.gg' }],
  creator: 'DEFENDR.GG',
  publisher: 'DEFENDR.GG',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://defendr.gg',
    siteName: 'DEFENDR.GG',
    title: 'DEFENDR.GG — Esports Tournament Platform | Play. Compete. Rise.',
    description:
      'A competitive esports platform that centralizes online tournaments, player rankings, team management, and event organization into one powerful ecosystem.',
    images: [
      {
        url: 'https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/defendr_elements/defendr.png',
        width: 1200,
        height: 630,
        alt: 'DEFENDR.GG – Esports Tournament Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DEFENDR.GG — Compete. Rise. Win.',
    description:
      'Join tournaments, earn XP, win prizes and build your esports career on Defendr.gg — the all-in-one competitive gaming platform.',
    images: ['https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/defendr_elements/defendr.png'],
    creator: '@DEFENDRcompany',
  },
  icons: {
    icon: 'https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/defendr_elements/defendr.png',
    shortcut: 'https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/defendr_elements/defendr.png',
    apple: 'https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/defendr_elements/defendr.png',
  },
  metadataBase: new URL('https://defendr.gg'),
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('defendr-theme') || 'dark';
                  const root = document.documentElement;
                  if (theme === 'dark') {
                    root.classList.add('dark');
                  } else {
                    root.classList.remove('dark');
                  }
                } catch (e) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`font-poppins defendrScroll`}>
        {/* Google Analytics GA4 */}
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-S37M14XNTP"
        />
        <Script
          id="google-analytics-config"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-S37M14XNTP', { page_path: window.location.pathname });
            `,
          }}
        />
        {/* Microsoft Clarity */}
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "p6liv87o3u");
            `,
          }}
        />
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'WebSite',
                  '@id': 'https://defendr.gg/#website',
                  url: 'https://defendr.gg',
                  name: 'DEFENDR.GG',
                  description:
                    'Defendr.gg is an esports tournament management and competitive gaming platform that enables players to compete, organizers to host events, and brands to engage with the gaming ecosystem through rankings, gamification, and monetization tools.',
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: 'https://defendr.gg/tournaments?search={search_term_string}',
                    'query-input': 'required name=search_term_string',
                  },
                },
                {
                  '@type': 'Organization',
                  '@id': 'https://defendr.gg/#organization',
                  name: 'DEFENDR.GG',
                  url: 'https://defendr.gg',
                  logo: 'https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/defendr_elements/defendr.png',
                  description:
                    'A next-generation esports tournament platform designed to connect players, tournament organizers, teams, and sponsors within a unified competitive ecosystem.',
                  sameAs: [
                    'https://twitter.com/DEFENDRcompany',
                    'https://www.instagram.com/defendr.gg/',
                    'https://www.facebook.com/Defendr.gg',
                    'https://discord.gg/MUH37GjXd9',
                    'https://www.youtube.com/@DEFENDREsports',
                    'https://www.twitch.tv/defendr_gg',
                  ],
                },
                {
                  '@type': 'SoftwareApplication',
                  '@id': 'https://defendr.gg/#app',
                  name: 'DEFENDR.GG',
                  applicationCategory: 'GameApplication',
                  operatingSystem: 'Web',
                  url: 'https://defendr.gg',
                  description:
                    'Online esports tournament platform with bracket automation, player rankings, team management, gamification (XP, missions, rewards), and monetization tools for organizers.',
                  offers: {
                    '@type': 'Offer',
                    price: '0',
                    priceCurrency: 'USD',
                    description: 'Free tournament entry for players',
                  },
                },
              ],
            }),
          }}
        />
        <ThemeProvider>
          <SessionProviderWrapper>
            <HeaderProvider>
              <Header />
            </HeaderProvider>

            <div className="flex flex-col min-h-screen">
              <main className="flex-1 ">
                <VerifMailBanner />
                {children}
              </main>
              <Footer />
            </div>
            <DiscordHelpWidget />
            <Toaster />
          </SessionProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}
