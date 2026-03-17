import { Metadata } from 'next'

import About from './page'

export const metadata: Metadata = {
  title: 'About DEFENDR.GG — Our Mission, Story & Vision',
  description:
    'Defendr.gg is a next-generation esports tournament platform designed to connect players, organizers, teams, and sponsors within a unified competitive ecosystem. Learn our story.',
  keywords: [
    'about defendr.gg',
    'esports platform mission',
    'competitive gaming ecosystem',
    'esports event management software',
    'tournament bracket automation',
    'player ranking system',
    'esports gamification XP rewards',
    'esports organizer tools',
    'esports community platform',
    'gaming competition platform',
  ],
  alternates: {
    canonical: 'https://defendr.gg/about',
  },
  openGraph: {
    title: 'About DEFENDR.GG — Our Mission, Story & Vision',
    description:
      'A next-generation esports tournament platform providing bracket automation, player rankings, team profiles, gamification and organizer monetization tools.',
    url: 'https://defendr.gg/about',
    type: 'website',
  },
}
export default About
