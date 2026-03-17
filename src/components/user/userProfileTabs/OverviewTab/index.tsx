'use client'
import { useState, useMemo, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { EmptyGameCard } from '@/components/user/userProfileTabs/helpers/emptyGameCard'
import Typo from '@/components/ui/Typo'
import GameCard from '@/components/user/userProfileTabs/helpers/gameCard'
import { getGameImageUrl } from '@/utils/imageUrlSanitizer'
import { EmptyTournamentCard } from '@/components/user/userProfileTabs/helpers/emptyTournamentCard'
import TournamentCard from '@/components/user/userProfileTabs/helpers/TournamentCard'
import GameIdCard from '@/components/user/userProfileTabs/helpers/GameIdCard'

const TOURNAMENTS_PER_PAGE = 4

interface OverviewTabProps {
  isUserProfile: boolean
  tournaments: any[]
  ownedTournaments: any[]
  games: any[]
  connectedAcc: any[]
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  isUserProfile,
  tournaments,
  ownedTournaments,
  games,
  connectedAcc,
}) => {
  const [selected, setSelected] = useState<'Participated' | 'Organized'>('Participated')
  const [gameIndex, setGameIndex] = useState(0)
  const [tournamentPage, setTournamentPage] = useState(1)

  // Reset tournament page when switching tabs
  const handleTabChange = (tab: 'Participated' | 'Organized') => {
    setSelected(tab)
    setTournamentPage(1)
  }

  // Deduplicate games — must be declared before itemsPerView references it
  const uniqueGames = useMemo(() => {
    const seen = new Set()
    return games.filter(game => {
      if (!game?._id) return true
      if (seen.has(game._id)) return false
      seen.add(game._id)
      return true
    })
  }, [games])

  // Responsive: show 1 on mobile, 2 on larger screens
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const itemsPerView = isMobile ? 1 : Math.min(uniqueGames.length, 2) || 1
  const maxGameIndex = Math.max(0, uniqueGames.length - itemsPerView)
  const nextGame = () => setGameIndex(prev => (prev >= maxGameIndex ? 0 : prev + 1))
  const prevGame = () => setGameIndex(prev => (prev <= 0 ? maxGameIndex : prev - 1))

  // Tournament pagination
  const tournamentsToDisplay = selected === 'Participated' ? tournaments : ownedTournaments
  const totalPages = Math.ceil(tournamentsToDisplay.length / TOURNAMENTS_PER_PAGE)
  const paginatedTournaments = tournamentsToDisplay.slice(
    (tournamentPage - 1) * TOURNAMENTS_PER_PAGE,
    tournamentPage * TOURNAMENTS_PER_PAGE,
  )

  // Normalise connected accounts
  const connectedAccountsArray = useMemo(() => {
    if (Array.isArray(connectedAcc)) return connectedAcc
    const entries = Object.entries(connectedAcc || {})
      .filter(([, v]) => Boolean(v))
      .map(([provider, data]) => ({ type: provider, data }))
    const discordFromSocial = (connectedAcc as any)?.socialMediaLinks?.discord
    const hasDiscordProvider = entries.some(e => e.type === 'discord')
    if (discordFromSocial && !hasDiscordProvider) {
      entries.push({ type: 'discord', data: { username: discordFromSocial } })
    }
    return entries
  }, [connectedAcc])

  return (
    <div className="flex flex-col xl:flex-row gap-6 w-full overflow-hidden">
      {/* ── Left column: Games + Tournaments ─────────────── */}
      <div className="flex flex-col gap-6 flex-1 min-w-0 w-full order-2 xl:order-1 overflow-hidden">
        {/* Favorite Games */}
        <div className="bg-[#212529] rounded-[19px] p-4 sm:p-5 flex flex-col gap-4 overflow-hidden">
          <Typo as="p" fontFamily="poppins" fontVariant="p3" className="font-semibold text-white">
            Favorite Games
            {uniqueGames.length > 0 && (
              <span className="ml-2 text-xs text-gray-400 font-normal">({uniqueGames.length})</span>
            )}
          </Typo>

          {uniqueGames.length === 0 ? (
            <EmptyGameCard isUserProfile={isUserProfile} />
          ) : (
            <div className="relative">
              <div className="overflow-hidden rounded-xl">
                <div
                  className="flex transition-transform duration-300 ease-in-out gap-3"
                  style={{ transform: `translateX(-${gameIndex * (100 / itemsPerView)}%)` }}
                >
                  {uniqueGames.map((game, index) => (
                    <div
                      key={game?._id || `game-${index}`}
                      className="shrink-0"
                      style={{ width: `calc(${100 / itemsPerView}% - 6px)` }}
                    >
                      <GameCard
                        backgroundColor="dark-grey"
                        gameName={game?.name ?? 'Unknown'}
                        gamePhoto={getGameImageUrl(game)}
                        textColor="white"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {uniqueGames.length > itemsPerView && (
                <>
                  <button
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-[#D62555]/80 hover:bg-[#D62555] text-white p-1.5 rounded-full transition-colors z-10 shadow-lg"
                    onClick={prevGame}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#D62555]/80 hover:bg-[#D62555] text-white p-1.5 rounded-full transition-colors z-10 shadow-lg"
                    onClick={nextGame}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Tournaments */}
        <div className="bg-[#212529] rounded-[19px] p-4 sm:p-5 flex flex-col gap-4 overflow-hidden">
          {/* Header + tab pills */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <Typo as="p" fontFamily="poppins" fontVariant="p3" className="font-semibold text-white">
              Tournaments
            </Typo>
            <div className="flex gap-1 bg-[#2c3036] p-1 rounded-xl">
              {(['Participated', 'Organized'] as const).map(tab => (
                <button
                  key={tab}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                    selected === tab
                      ? 'bg-[#D62555] text-white shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  onClick={() => handleTabChange(tab)}
                >
                  {tab}
                  <span
                    className={`ml-1 text-xs ${selected === tab ? 'text-white/70' : 'text-gray-500'}`}
                  >
                    ({tab === 'Participated' ? tournaments.length : ownedTournaments.length})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Tournament cards */}
          <div className="flex flex-col gap-3">
            {tournaments.length === 0 && ownedTournaments.length === 0 ? (
              <EmptyTournamentCard isUserProfile={isUserProfile} />
            ) : tournamentsToDisplay.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                No {selected.toLowerCase()} tournaments yet
              </div>
            ) : (
              paginatedTournaments.map(tournament => (
                <TournamentCard key={tournament?._id} tournament={tournament} />
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <button
                disabled={tournamentPage === 1}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed text-gray-300 hover:text-white hover:bg-white/10"
                onClick={() => setTournamentPage(p => Math.max(1, p - 1))}
              >
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    className={`w-8 h-8 rounded-lg text-sm font-semibold transition-all ${
                      page === tournamentPage
                        ? 'bg-[#D62555] text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                    onClick={() => setTournamentPage(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                disabled={tournamentPage === totalPages}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed text-gray-300 hover:text-white hover:bg-white/10"
                onClick={() => setTournamentPage(p => Math.min(totalPages, p + 1))}
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Right column: Game IDs ────────────────────────── */}
      {connectedAccountsArray.length > 0 && (
        <div className="w-full xl:w-[420px] shrink-0 order-1 xl:order-2 overflow-hidden">
          <div className="bg-[#212529] rounded-[19px] p-4 sm:p-5 flex flex-col gap-3">
            <Typo as="p" fontFamily="poppins" fontVariant="p3" className="font-semibold text-white">
              Game IDs
            </Typo>
            <div className="flex flex-col gap-3">
              {connectedAccountsArray.map((account, idx) => (
                <GameIdCard key={`acc-${idx}`} account={account} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
