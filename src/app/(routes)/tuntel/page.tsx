'use client'
import Typo from '@/components/ui/Typo'
import TournamentCard from '@/components/ui/TournamentCard'
import Button from '@/components/ui/Button'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { getTournamentsByOrganizationId } from '@/services/tournamentService'

// Removed carousel types

export default function TuntelPage() {
  const [organizationTournaments, setOrganizationTournaments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Organization ID for Tuntel (from your example tournament record)
  const ORGANIZATION_ID = '68ee7800d2d5747cb22909ca'
  // Removed static carousel data

  // Fetch organization tournaments
  useEffect(() => {
    async function fetchOrganizationTournaments() {
      try {
        setLoading(true)
        // Only fetch published tournaments
        const response = await getTournamentsByOrganizationId(ORGANIZATION_ID, 1, 20, {
          status: 'PUBLISHED',
          sort: '-createdAt',
        })
        // Normalize various possible response shapes
        const items = Array.isArray(response?.tournaments)
          ? response.tournaments
          : Array.isArray(response?.items)
            ? response.items
            : Array.isArray(response)
              ? response
              : []
        setOrganizationTournaments(items)
        setError(null)
      } catch (err: any) {
        console.error('Failed to fetch organization tournaments:', err)
        setError(err?.message || 'Failed to load tournaments')
        setOrganizationTournaments([])
      } finally {
        setLoading(false)
      }
    }

    fetchOrganizationTournaments()
  }, [])

  // Removed carousel rotation effect

  return (
    <div className="min-h-screen bg-[#161616] text-white p-4 sm:p-5 md:p-10 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-r from-pink-500/20 to-red-500/20 rounded-full blur-xl animate-bounce"></div>

        {/* Additional floating objects */}
        <div
          className="absolute top-60 left-1/2 w-20 h-20 bg-gradient-to-r from-cyan-500/15 to-blue-500/15 rounded-full blur-lg animate-pulse"
          style={{ animationDelay: '1.5s' }}
        ></div>
        <div
          className="absolute top-80 right-1/4 w-16 h-16 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-md animate-bounce"
          style={{ animationDelay: '0.8s' }}
        ></div>
        <div
          className="absolute bottom-60 left-1/6 w-36 h-36 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '2.2s' }}
        ></div>
        <div
          className="absolute bottom-80 right-1/6 w-22 h-22 bg-gradient-to-r from-rose-500/20 to-pink-500/20 rounded-full blur-lg animate-bounce"
          style={{ animationDelay: '1.8s' }}
        ></div>
        <div
          className="absolute top-1/2 left-1/6 w-18 h-18 bg-gradient-to-r from-amber-500/15 to-yellow-500/15 rounded-full blur-md animate-pulse"
          style={{ animationDelay: '0.3s' }}
        ></div>
        <div
          className="absolute top-1/3 right-1/6 w-26 h-26 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-full blur-xl animate-bounce"
          style={{ animationDelay: '1.2s' }}
        ></div>

        {/* Moving particles */}
        <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-white/30 rounded-full animate-ping"></div>
        <div
          className="absolute top-1/3 right-1/4 w-1 h-1 bg-blue-400/50 rounded-full animate-ping"
          style={{ animationDelay: '1s' }}
        ></div>
        <div
          className="absolute bottom-1/3 left-1/5 w-1.5 h-1.5 bg-purple-400/40 rounded-full animate-ping"
          style={{ animationDelay: '2s' }}
        ></div>
        <div
          className="absolute bottom-1/4 right-1/5 w-1 h-1 bg-yellow-400/60 rounded-full animate-ping"
          style={{ animationDelay: '0.5s' }}
        ></div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-900/5 to-blue-900/10"></div>
      </div>

      <div className="w-full relative z-10">
        {/* Header */}
        <div className="text-center py-10">
          {/* Event Images - Three in a row above title */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <a
              href="https://www.instagram.com/tunisietelecom/"
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-40 h-28 rounded-lg overflow-hidden shadow-lg group cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/50 order-1 sm:order-1 block"
            >
              <Image
                src="https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/defendr_elements/TSF%20Event/logo_TT.png"
                alt="Tunisie Telecom Instagram"
                fill
                className="object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </a>
            <a
              href="https://www.instagram.com/gamefyacademy/"
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-48 h-32 rounded-lg overflow-hidden shadow-lg group cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-blue-500/50 order-2 sm:order-2 block"
            >
              <Image
                src="https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/defendr_elements/TSF%20Event/2.png"
                alt="Gamefy Academy Instagram"
                fill
                className="object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </a>
            <a
              href="https://www.instagram.com/tsf_2025/"
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-48 h-32 rounded-lg overflow-hidden shadow-lg group cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-red-500/50 order-3 sm:order-3 block"
            >
              <Image
                src="https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/defendr_elements/TSF%20Event/1.png"
                alt="TSF 2025 Instagram"
                fill
                className="object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </a>
          </div>

          <Typo
            as="h1"
            className="text-4xl sm:text-6xl font-bold mb-4"
            color="white"
            fontFamily="poppins"
            fontVariant="h1"
          >
            Tuntel Event
          </Typo>
          <Typo as="p" className="text-xl text-gray-400 mb-8" fontFamily="poppins" fontVariant="p2">
            TUNTEL 2025 - NOVEMBER 06 TO NOVEMBER 09
          </Typo>

          {/* Prize Display */}
          <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black px-8 py-4 rounded-xl font-bold text-2xl shadow-xl inline-block border-2 border-yellow-300 hover:scale-110 hover:shadow-2xl hover:shadow-yellow-500/50 transition-all duration-300 cursor-pointer mb-8">
            23K TND Prizes
          </div>

          {/* Tuntel Event Website Button */}
          <div className="mb-8 flex justify-center">
            <Button
              label="Tuntel Event Website"
              size="l"
              variant="contained-red"
              className="px-8 py-4 text-lg font-bold"
              onClick={() => window.open('https://tuntel.tn/', '_blank')}
            />
          </div>
        </div>

        {/* Carousel removed */}

        {/* Tournament List */}
        <div className="mt-12">
          <Typo
            as="h2"
            className="text-3xl font-bold mb-8 text-center"
            color="white"
            fontFamily="poppins"
            fontVariant="h2"
          >
            Tuntel Tournaments
          </Typo>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-gray-400 text-4xl">⚠️</span>
              </div>
              <Typo as="h3" color="white" fontFamily="poppins" fontVariant="h4" className="mb-2">
                Failed to Load Tournaments
              </Typo>
              <Typo as="p" color="ghostGrey" fontFamily="poppins" fontVariant="p4">
                {error}
              </Typo>
            </div>
          ) : organizationTournaments.length > 0 ? (
            <div className="relative">
              <div className="flex gap-4 overflow-x-auto py-4 lg:grid lg:grid-cols-4 mobile-scrollbar scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                {organizationTournaments.map(tournament => (
                  <TournamentCard key={tournament._id} tournament={tournament} />
                ))}
              </div>
              {/* Mobile scroll indicator */}
              <div className="lg:hidden mt-2 text-center">
                <div className="inline-flex items-center gap-2 text-gray-400 text-sm">
                  <span>←</span>
                  <span>Scroll to see more tournaments</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-gray-400 text-4xl">🏆</span>
              </div>
              <Typo as="h3" color="white" fontFamily="poppins" fontVariant="h4" className="mb-2">
                No Tournaments Available
              </Typo>
              <Typo as="p" color="ghostGrey" fontFamily="poppins" fontVariant="p4">
                Check back later for Tuntel tournaments
              </Typo>
            </div>
          )}
        </div>

        {/* Schedule & Dates */}
        <div className="mt-12 max-w-4xl mx-auto">
          <Typo
            as="h2"
            className="text-3xl font-bold mb-6 text-center"
            color="white"
            fontFamily="poppins"
            fontVariant="h2"
          >
            Schedule & Dates
          </Typo>

          {/* Accordions */}
          <div className="space-y-4">
            {/* Registration Phase */}
            <details className="group bg-gray-800/80 rounded-xl border border-gray-700 overflow-hidden">
              <summary className="cursor-pointer select-none list-none px-4 sm:px-6 py-4 flex items-center justify-between">
                <span className="text-lg sm:text-xl font-semibold">Registration Phase</span>
                <span className="ml-4 text-gray-400 group-open:rotate-180 transition-transform">
                  ⌄
                </span>
              </summary>
              <div className="px-4 sm:px-6 pb-5 text-gray-200 space-y-3">
                <div>
                  <span className="font-semibold text-white">15 – 22 Oct</span> · FC26 Ultimate Team
                  <div className="text-sm text-gray-400">
                    Opens 15 Oct, closes 22 Oct · Playing 25–26
                  </div>
                </div>
                <div>
                  <span className="font-semibold text-white">16 – 23 Oct</span> · Mobile Legends 5v5
                  <div className="text-sm text-gray-400">
                    Opens 16 Oct, closes 23 Oct · Playing 25–26
                  </div>
                </div>
                <div>
                  <span className="font-semibold text-white">17 – 24 Oct</span> · League of Legends
                  5v5
                  <div className="text-sm text-gray-400">
                    Opens 17 Oct, closes 24 Oct · Playing 26–27
                  </div>
                </div>
                <div>
                  <span className="font-semibold text-white">18 – 25 Oct</span> · Valorant 5v5
                  <div className="text-sm text-gray-400">
                    Opens 18 Oct, closes 25 Oct · Playing 29–30
                  </div>
                </div>
              </div>
            </details>

            {/* Online Qualifications */}
            <details className="group bg-gray-800/80 rounded-xl border border-gray-700 overflow-hidden">
              <summary className="cursor-pointer select-none list-none px-4 sm:px-6 py-4 flex items-center justify-between">
                <span className="text-lg sm:text-xl font-semibold">Online Qualifications</span>
                <span className="ml-4 text-gray-400 group-open:rotate-180 transition-transform">
                  ⌄
                </span>
              </summary>
              <div className="px-4 sm:px-6 pb-5 text-gray-200 space-y-3">
                <div className="text-sm text-gray-300">
                  Starts at <span className="font-semibold text-white">7:00 p.m</span> · Single
                  Elimination · 2 days per game
                </div>
                <div>
                  <span className="font-semibold text-white">25–26 Oct</span> · FC26 Ultimate Team
                  (¼) (32–64)
                </div>
                <div>
                  <span className="font-semibold text-white">25–26 Oct</span> · Mobile Legends 5v5
                  (½) (10–16)
                </div>
                <div>
                  <span className="font-semibold text-white">26–27 Oct</span> · League of Legends
                  5v5 (½)
                </div>
                <div>
                  <span className="font-semibold text-white">29–30 Oct</span> · Valorant 5v5 (½)
                </div>
              </div>
            </details>

            {/* Notes */}
            <details className="group bg-gray-800/80 rounded-xl border border-gray-700 overflow-hidden">
              <summary className="cursor-pointer select-none list-none px-4 sm:px-6 py-4 flex items-center justify-between">
                <span className="text-lg sm:text-xl font-semibold">Notes</span>
                <span className="ml-4 text-gray-400 group-open:rotate-180 transition-transform">
                  ⌄
                </span>
              </summary>
              <div className="px-4 sm:px-6 pb-5 text-gray-200 space-y-2 text-sm">
                <div>
                  <span className="font-semibold text-white">Weekends</span>: Check-in at 16:00 ·
                  Games start at 17:00
                </div>
                <div>
                  <span className="font-semibold text-white">Weekdays</span>: Check-in at 18:30 ·
                  Games start at 19:00
                </div>
              </div>
            </details>
          </div>
        </div>

        {/* Discord Server Info */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 rounded-xl p-6">
            <div className="text-center">
              <Typo
                as="h3"
                className="text-xl font-bold mb-2"
                color="white"
                fontFamily="poppins"
                fontVariant="h3"
              >
                🎮 All Games Played on Discord
              </Typo>
              <Typo as="p" className="text-gray-200 mb-4" fontFamily="poppins" fontVariant="p3">
                Join our Discord server to participate in tournaments
              </Typo>
              <a
                href="https://discord.gg/Y8gHyXjMEh"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors duration-200"
              >
                <span>Join Discord Server</span>
                <span>↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
