'use client'

import Link from 'next/link'
import Typo from '@/components/ui/Typo'
import Button from '@/components/ui/Button'
import { useState, useEffect } from 'react'
import AlgeriaFlag from '@/components/ui/Icons/AlgeriaFlag'
// DZ Ramadhan event links
const EVENT_LINKS = {
  discord: 'https://discord.gg/sMvSrSDUHz',
  instagram: 'https://www.instagram.com/esports.algeria/',
} as const

// Event & game logo URLs (DZ Ramadhan 2026)
const LOGOS = {
  main: 'https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/defendr_elements/partners/DZ%20ORg/dz_ramadhan_event_2026/DZESPORTS%20MAIN.png',
  cs: 'https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/defendr_elements/partners/DZ%20ORg/dz_ramadhan_event_2026/DZ%20CS.png',
  lol: 'https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/defendr_elements/partners/DZ%20ORg/dz_ramadhan_event_2026/DZ%20LOL.png',
  r6: 'https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/defendr_elements/partners/DZ%20ORg/dz_ramadhan_event_2026/DZ%20R6.png',
  rl: 'https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/defendr_elements/partners/DZ%20ORg/dz_ramadhan_event_2026/DZ%20Rocket%20LEague.png',
  valo: 'https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/defendr_elements/partners/DZ%20ORg/dz_ramadhan_event_2026/DZ%20VALO.png',
} as const

interface TournamentItem {
  id: string
  name: string
  date: string
  color: string
  game: string
  description: string
  prize: string
  registrationStatus: 'open' | 'closed' | 'upcoming'
  logoUrl: string
}

const tournaments: TournamentItem[] = [
  {
    id: 'dzrl',
    name: 'DZRL',
    date: 'February 23, 2025',
    color: '#3B9BD8',
    game: 'Rocket League',
    description: 'High-flying car soccer action',
    prize: '50,000 DZD',
    registrationStatus: 'open',
    logoUrl: LOGOS.rl,
  },
  {
    id: 'dzr6',
    name: 'DZR6',
    date: 'February 27, 2025',
    color: '#6B7280',
    game: 'Rainbow Six Siege',
    description: 'Tactical 5v5 shooter',
    prize: '75,000 DZD',
    registrationStatus: 'open',
    logoUrl: LOGOS.r6,
  },
  {
    id: 'dzlol',
    name: 'DZLOL',
    date: 'March 04, 2025',
    color: '#D4A853',
    game: 'League of Legends',
    description: '5v5 MOBA championship',
    prize: '100,000 DZD',
    registrationStatus: 'open',
    logoUrl: LOGOS.lol,
  },
  {
    id: 'dzcs',
    name: 'DZCS',
    date: 'March 10, 2025',
    color: '#F5A623',
    game: 'Counter-Strike 2',
    description: 'Precision tactical shooter',
    prize: '80,000 DZD',
    registrationStatus: 'open',
    logoUrl: LOGOS.cs,
  },
  {
    id: 'dzvalo',
    name: 'DZVALO',
    date: 'March 16, 2025',
    color: '#C084FC',
    game: 'Valorant',
    description: 'Strategic agent-based shooter',
    prize: '60,000 DZD',
    registrationStatus: 'upcoming',
    logoUrl: LOGOS.valo,
  },
]

function AnimatedBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f]" />

      {/* Animated gradient orbs */}
      <div
        className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl"
        style={{
          left: `${mousePosition.x * 0.05}px`,
          top: `${mousePosition.y * 0.05}px`,
          transform: 'translate(-50%, -50%)',
        }}
      />
      <div
        className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-red-600/20 to-orange-600/20 blur-3xl"
        style={{
          right: `${-mousePosition.x * 0.03}px`,
          bottom: `${-mousePosition.y * 0.03}px`,
          transform: 'translate(50%, 50%)',
        }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
        }}
      />
    </div>
  )
}

function TournamentCard({ tournament }: { tournament: TournamentItem }) {
  const getStatusColor = () => {
    switch (tournament.registrationStatus) {
      case 'open':
        return 'text-green-400 bg-green-400/10 border-green-400/30'
      case 'upcoming':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30'
      case 'closed':
        return 'text-red-400 bg-red-400/10 border-red-400/30'
    }
  }

  const getStatusText = () => {
    switch (tournament.registrationStatus) {
      case 'open':
        return 'Registration Open'
      case 'upcoming':
        return 'Coming Soon'
      case 'closed':
        return 'Registration Closed'
    }
  }

  return (
    <div className="group relative bg-gradient-to-br from-[#1a1a1a]/80 to-[#0f0f0f]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-500 hover:shadow-2xl hover:shadow-black/50">
      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
        style={{
          background: `radial-gradient(circle at center, ${tournament.color}20, transparent 70%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-28 h-28 sm:w-32 sm:h-32 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 flex items-center justify-center">
            <img
              src={tournament.logoUrl}
              alt={tournament.game}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex justify-center mb-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor()}`}
          >
            {getStatusText()}
          </span>
        </div>

        {/* Tournament Info */}
        <div className="text-center space-y-2">
          <Typo as="h3" className="text-2xl font-black tracking-wider" fontFamily="poppins">
            <span style={{ color: tournament.color }}>{tournament.name}</span>
          </Typo>

          <Typo as="p" className="text-white/60 text-sm font-medium" fontFamily="poppins">
            {tournament.game}
          </Typo>

          <Typo as="p" className="text-white/80 text-sm" fontFamily="poppins">
            {tournament.description}
          </Typo>

          <div className="pt-3 border-t border-white/10">
            <Typo as="p" className="text-white/90 text-sm font-semibold" fontFamily="poppins">
              {tournament.date}
            </Typo>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6">
          {tournament.registrationStatus === 'closed' ? (
            <Button
              label="Learn More"
              size="s"
              variant="outlined-grey"
              className="w-full font-semibold"
              disabled
            />
          ) : (
            <a
              href={EVENT_LINKS.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full"
            >
              <Button
                label={tournament.registrationStatus === 'open' ? 'Register Now' : 'Learn More'}
                size="s"
                variant={
                  tournament.registrationStatus === 'open' ? 'contained-red' : 'outlined-grey'
                }
                className="w-full font-semibold"
              />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default function DzRamadhanPage() {
  return (
    <div className="min-h-screen text-white overflow-x-hidden relative">
      <AnimatedBackground />

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 md:pt-24 pb-12">
          {/* Main Logo with Flag */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-72 h-36 sm:w-80 sm:h-40 md:w-96 md:h-48 lg:w-[28rem] lg:h-56 xl:w-[32rem] xl:h-64 flex items-center justify-center">
                <img
                  src={LOGOS.main}
                  alt="DZ Ramadhan Champions Tour"
                  className="w-full h-full object-contain"
                />
              </div>
              {/* Glow effect behind logo */}
              <div className="absolute inset-0 bg-white/10 blur-3xl scale-150 -z-10" />
              {/* Algeria Flag */}
              <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-lg">
                <AlgeriaFlag height="24" width="32" className="rounded" />
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-4">
            <Typo
              as="h1"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80"
              fontFamily="poppins"
            >
              DZ RAMADAN
            </Typo>
            <Typo
              as="h2"
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-[0.3em] text-white/70"
              fontFamily="poppins"
            >
              CHAMPIONS TOUR
            </Typo>

            <div className="max-w-2xl mx-auto mt-8">
              <Typo
                as="p"
                className="text-white/60 text-sm sm:text-base leading-relaxed"
                fontFamily="poppins"
              >
                The most prestigious esports tournament series in Algeria returns this Ramadan.
                Compete across multiple games for glory and massive prize pools.
              </Typo>
            </div>
          </div>

          {/* Stats / KPIs */}
          <div className="flex justify-center gap-8 sm:gap-12 mt-12">
            <div className="text-center">
              <Typo
                as="p"
                className="text-3xl sm:text-4xl font-black text-white"
                fontFamily="poppins"
              >
                5
              </Typo>
              <Typo as="p" className="text-white/60 text-sm sm:text-base" fontFamily="poppins">
                Tournaments
              </Typo>
            </div>
            <div className="text-center">
              <Typo
                as="p"
                className="text-3xl sm:text-4xl font-black text-white"
                fontFamily="poppins"
              >
                500+
              </Typo>
              <Typo as="p" className="text-white/60 text-sm sm:text-base" fontFamily="poppins">
                Players
              </Typo>
            </div>
          </div>
        </div>

        {/* Tournament Grid */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center mb-12">
            <Typo
              as="h2"
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4"
              fontFamily="poppins"
            >
              Tournament Schedule
            </Typo>
            <Typo as="p" className="text-white/60 max-w-2xl mx-auto" fontFamily="poppins">
              Click on any tournament to view details and register
            </Typo>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
            {tournaments.map(tournament => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
          </div>
        </div>

        {/* Discord Section */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-[#5865F2] to-[#7289DA] rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full blur-2xl" />
                <div className="absolute bottom-0 right-0 w-48 h-48 bg-white rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white rounded-full blur-3xl" />
              </div>

              <div className="relative z-10 space-y-6">
                <Typo
                  as="h2"
                  className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4"
                  fontFamily="poppins"
                >
                  Join Our Discord Community
                </Typo>

                <Typo
                  as="p"
                  className="text-white/90 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
                  fontFamily="poppins"
                >
                  Connect with thousands of Algerian gamers, get tournament updates, find teammates,
                  and stay updated with the latest esports news.
                </Typo>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
                  <a
                    href={EVENT_LINKS.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-white text-[#5865F2] px-8 py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-white/90 transition-all duration-300 hover:scale-105 shadow-xl"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                    </svg>
                    Join Discord Server
                  </a>
                  <a
                    href={EVENT_LINKS.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-white text-[#E4405F] px-8 py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-white/90 transition-all duration-300 hover:scale-105 shadow-xl"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    Follow on Instagram
                  </a>
                </div>
                <Typo as="p" className="text-white/70 text-sm mt-2" fontFamily="poppins">
                  discord.gg/sMvSrSDUHz · @esports.algeria
                </Typo>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/20">
                  <div>
                    <Typo as="p" className="text-2xl font-bold text-white" fontFamily="poppins">
                      24/7
                    </Typo>
                    <Typo as="p" className="text-white/70 text-sm" fontFamily="poppins">
                      Active Support
                    </Typo>
                  </div>
                  <div>
                    <Typo as="p" className="text-2xl font-bold text-white" fontFamily="poppins">
                      10K+
                    </Typo>
                    <Typo as="p" className="text-white/70 text-sm" fontFamily="poppins">
                      Members
                    </Typo>
                  </div>
                  <div>
                    <Typo as="p" className="text-2xl font-bold text-white" fontFamily="poppins">
                      50+
                    </Typo>
                    <Typo as="p" className="text-white/70 text-sm" fontFamily="poppins">
                      Tournaments
                    </Typo>
                  </div>
                  <div>
                    <Typo as="p" className="text-2xl font-bold text-white" fontFamily="poppins">
                      Free
                    </Typo>
                    <Typo as="p" className="text-white/70 text-sm" fontFamily="poppins">
                      To Join
                    </Typo>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center">
            <div className="max-w-3xl mx-auto space-y-6">
              <Typo
                as="h2"
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-white"
                fontFamily="poppins"
              >
                Ready to Become a Champion?
              </Typo>
              <Typo as="p" className="text-white/60 text-base sm:text-lg" fontFamily="poppins">
                Join thousands of players competing in Algeria's biggest esports event series
              </Typo>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Link href="/tournaments">
                  <Button
                    label="View All Tournaments"
                    size="l"
                    variant="contained-red"
                    className="px-8 py-4 text-base sm:text-lg font-bold"
                  />
                </Link>
                <a href={EVENT_LINKS.discord} target="_blank" rel="noopener noreferrer">
                  <Button
                    label="Join Discord"
                    size="l"
                    variant="outlined-grey"
                    className="px-8 py-4 text-base sm:text-lg font-bold"
                  />
                </a>
                <a href={EVENT_LINKS.instagram} target="_blank" rel="noopener noreferrer">
                  <Button
                    label="Instagram"
                    size="l"
                    variant="outlined-grey"
                    className="px-8 py-4 text-base sm:text-lg font-bold"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
