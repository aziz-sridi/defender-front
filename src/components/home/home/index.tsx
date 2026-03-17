'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useMemo, useRef } from 'react'
import { useSession } from 'next-auth/react'

import Typo from '@/components/ui/Typo'
import Button from '@/components/ui/Button'
import { getAllTournaments } from '@/services/tournamentService'
import { getAllOrganizations } from '@/services/organizationService'
import { getAllGames } from '@/services/gameService'
import { Game } from '@/types/gameType'
import GameCard from '@/components/ui/GameCard'
import TournamentCard from '@/components/ui/TournamentCard'
import EventCard from '@/components/ui/EventCard'
import AlgeriaFlag from '@/components/ui/Icons/AlgeriaFlag'
import { organizerImageSanitizer } from '@/utils/imageUrlSanitizer'

interface BasicTournament {
  _id: string
  name: string
  startDate: string
  coverImage?: string
  publishing?: boolean
  createdBy?: string | { _id: string; name: string }
}

interface BasicOrganization {
  _id: string
  name: string
  logo?: string
  tournaments: unknown[]
  nbFollowers?: number
  socialMediaFollowers?: number
  memberCount?: number
  staffCount?: number
  tournamentCount?: number
  verified?: boolean
  staff?: Array<{ user: string; role: string; _id: string }>
}

export default function Home() {
  const [tournaments, setTournaments] = useState<BasicTournament[]>([])
  const [loading, setLoading] = useState(true)
  const [organizations, setOrganizations] = useState<BasicOrganization[]>([])
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [tournamentsPage, setTournamentsPage] = useState(1)
  const [gamesPage, setGamesPage] = useState(1)
  const [organizationsPage, setOrganizationsPage] = useState(1)
  const [itemsPerPage] = useState(4)
  const [userFavoriteGames, setUserFavoriteGames] = useState<Game[]>([])
  const [favoriteGamesLoading, setFavoriteGamesLoading] = useState(false)
  const [allGames, setAllGames] = useState<Game[]>([])
  const [allTournaments, setAllTournaments] = useState<any[]>([])

  const { data: session, status } = useSession()

  const router = useRouter()

  const tournamentsRef = useRef<HTMLDivElement>(null)
  const orgsRef = useRef<HTMLDivElement>(null)
  const gamesRef = useRef<HTMLDivElement>(null)
  const [tournScrollX, setTournScrollX] = useState(0)
  const [orgsScrollX, setOrgsScrollX] = useState(0)
  const [gamesScrollX, setGamesScrollX] = useState(0)
  const PILL_W = 56 // width of the scroll pill in px
  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const [tournamentsData, organizationsData, gamesData] = await Promise.all([
          getAllTournaments(),
          getAllOrganizations(),
          getAllGames(),
        ])

        const allTournamentsData = (tournamentsData.tournaments || []) as BasicTournament[]
        const publishedTournaments = allTournamentsData.filter(
          t => t?.publishing === true && !(t as any)?.achieved,
        )
        // Filter out TSF organization tournaments (they're displayed on /tsf page)
        const TSF_ORGANIZATION_ID = '68ee7800d2d5747cb22909ca'
        const filteredTournaments = publishedTournaments.filter(t => {
          // Check if createdBy is a string (ID) or an object with _id
          const createdById = typeof t?.createdBy === 'string' ? t.createdBy : t?.createdBy?._id
          return createdById !== TSF_ORGANIZATION_ID
        })
        setTournaments(filteredTournaments)
        setOrganizations(
          Array.isArray(organizationsData) ? (organizationsData as BasicOrganization[]) : [],
        )
        setAllGames(gamesData || [])
        setAllTournaments(allTournamentsData)
      } catch {
        setTournaments([])
        setOrganizations([])
        setAllGames([])
        setAllTournaments([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Fetch favorite games when session is available
  useEffect(() => {
    if (!session?.user?.favoriteGames || session.user.favoriteGames.length === 0) {
      setUserFavoriteGames([])
      return
    }

    if (allGames.length === 0) return // Wait for games to be loaded

    setFavoriteGamesLoading(true)
    try {
      const rawFavorites = session.user.favoriteGames as any[]
      const favoriteGameIds = rawFavorites.map(f => (typeof f === 'string' ? f : f?._id))

      const favoriteGames =
        allGames.length > 0 ? allGames.filter(game => favoriteGameIds.includes(game._id)) : []

      setUserFavoriteGames(favoriteGames)
    } catch (error) {
      console.error('Error filtering favorite games:', error)
      setUserFavoriteGames([])
    } finally {
      setFavoriteGamesLoading(false)
    }
  }, [session, allGames])

  const newestTournaments = useMemo<BasicTournament[]>(() => {
    const allTournaments = tournaments && tournaments.length > 0 ? tournaments : []
    const totalPages = Math.ceil(allTournaments.length / itemsPerPage)
    const startIndex = (tournamentsPage - 1) * itemsPerPage
    return allTournaments.slice(startIndex, startIndex + itemsPerPage)
  }, [tournaments, tournamentsPage, itemsPerPage])

  const tournamentsTotalPages = Math.ceil((tournaments?.length || 0) / itemsPerPage)

  // Calculate tournament counts for favorite games (same logic as games page)
  const gameTournamentCounts = useMemo(() => {
    const counts = new Map<string, number>()

    allTournaments.forEach(tournament => {
      if (tournament.game?._id) {
        const currentCount = counts.get(tournament.game._id) || 0
        counts.set(tournament.game._id, currentCount + 1)
      }
    })

    return counts
  }, [allTournaments])

  const topOrganizations = useMemo<BasicOrganization[]>(() => {
    return [...organizations]
      .sort((a, b) => {
        const aTournaments = a.tournamentCount || a.tournaments?.length || 0
        const bTournaments = b.tournamentCount || b.tournaments?.length || 0
        return bTournaments - aTournaments
      })
      .slice(0, 5)
  }, [organizations])

  const formatNumber = (num?: number) => {
    if (!num) return '0'
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const ShowMoreButton = () => router.push('/tournaments')

  const makeScrollHandler =
    (
      ref: React.RefObject<HTMLDivElement | null>,
      setter: React.Dispatch<React.SetStateAction<number>>,
    ) =>
    () => {
      if (!ref.current) return
      const el = ref.current
      const pct = el.scrollLeft / Math.max(1, el.scrollWidth - el.clientWidth)
      setter(pct * (el.clientWidth - PILL_W))
    }

  const handleTournScroll = makeScrollHandler(tournamentsRef, setTournScrollX)
  const handleOrgsScroll = makeScrollHandler(orgsRef, setOrgsScrollX)
  const handleGamesScroll = makeScrollHandler(gamesRef, setGamesScrollX)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-defendrRed/30 border-t-defendrRed rounded-full animate-spin"></div>
          <Typo as="h2" fontFamily="poppins" fontVariant="h2" className="text-defendrRed">
            Loading...
          </Typo>
        </div>
      </div>
    )
  }
  //

  return (
    <div className="flex flex-col gap-10 p-4 sm:p-5 md:p-10 bg-[#161616] text-white">
      <div className="flex flex-col gap-6">
        <Typo
          as="h1"
          className="text-3xl sm:text-4xl"
          color="white"
          fontFamily="poppins"
          fontVariant="h1"
        >
          Home
        </Typo>
      </div>

      {/* Featured Event - DZ Ramadhan */}
      <div className="-mx-4 sm:mx-0">
        <EventCard
          eventName="DZ Ramadan Champions Tour"
          imageUrl="https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/defendr_elements/partners/DZ%20ORg/dz_ramadhan_event_2026/DZESPORTS%20MAIN.png"
          redirectUrl="/event/dz-ramadhan"
          prizePool="$10K Cash Prize"
          tournamentStatus="Registration Open"
          badge={<AlgeriaFlag height="28" width="38" className="rounded" />}
        />
      </div>

      {/* Tournaments for you */}
      <div className="flex flex-col gap-6 mb-4">
        <div className="flex items-center">
          <Typo as="h2" className="text-xl" color="white" fontFamily="poppins" fontVariant="h2">
            Tournaments for you
          </Typo>
        </div>

        <div className="relative">
          <div
            ref={tournamentsRef}
            className="flex gap-4 overflow-x-auto py-4 lg:grid lg:grid-cols-4 scrollbar-hide"
            onScroll={handleTournScroll}
          >
            {newestTournaments && newestTournaments.length > 0 ? (
              newestTournaments.map((tournament: BasicTournament, i: number) => {
                return <TournamentCard key={i} tournament={tournament} />
              })
            ) : (
              <div className="flex items-center justify-center min-h-[120px] text-gray-400 text-lg font-poppins px-4">
                <Typo
                  as="h2"
                  className="font-semibold text-lg md:text-xl"
                  color="white"
                  fontVariant="h3"
                >
                  There&apos;s no tournament yet.
                </Typo>
              </div>
            )}
          </div>
          {/* Mobile scroll indicator */}
          <div className="mt-3 px-1 sm:hidden">
            <div className="relative w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="absolute top-0 h-full rounded-full bg-gradient-to-r from-defendrRed to-rose-400 shadow-[0_0_8px_2px_rgba(226,58,99,0.5)] transition-transform duration-150 ease-out"
                style={{ width: PILL_W, transform: `translateX(${tournScrollX}px)` }}
              />
            </div>
          </div>
        </div>

        {tournamentsTotalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-4">
            <button
              onClick={() => setTournamentsPage(Math.max(1, tournamentsPage - 1))}
              disabled={tournamentsPage === 1}
              className="px-3 py-1 bg-gray-800 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
            >
              ◀
            </button>
            <span className="text-white font-poppins">
              {tournamentsPage} / {tournamentsTotalPages}
            </span>
            <button
              onClick={() =>
                setTournamentsPage(Math.min(tournamentsTotalPages, tournamentsPage + 1))
              }
              disabled={tournamentsPage === tournamentsTotalPages}
              className="px-3 py-1 bg-gray-800 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
            >
              ▶
            </button>
          </div>
        )}

        <div className="flex justify-center mt-4">
          <Button
            label="Show more tournaments"
            variant="outlined-grey"
            size="auto"
            fontFamily="poppins"
            className="rounded-full px-5 py-2"
            textClassName="text-sm font-semibold text-white/90"
            onClick={ShowMoreButton}
          />
        </div>
      </div>

      {/* Ready to host tournament card */}
      <div className="relative rounded-2xl bg-[#1a1d21] border border-white/[0.07] overflow-hidden xl:overflow-visible">
        {/* Mobile layout */}
        <div className="flex xl:hidden flex-col gap-4 p-5 sm:p-6">
          <Typo
            as="h3"
            className="text-xl font-bold text-white leading-snug"
            fontFamily="poppins"
            fontVariant="h3"
          >
            Ready to host your own tournament?
          </Typo>
          <Typo
            as="p"
            className="text-gray-400 text-sm leading-relaxed"
            fontFamily="poppins"
            fontVariant="p4"
          >
            All the tools you need to create, manage and promote esports tournaments.
          </Typo>
          <div className="flex gap-3 mt-1">
            <Button
              label="Create Tournament ↗"
              variant="contained-red"
              size="auto"
              fontFamily="poppins"
              className="rounded-xl px-5 py-2.5"
              textClassName="text-sm font-bold"
              onClick={() => router.push(`/tournament`)}
            />
            <Button
              label="Learn more"
              variant="outlined-grey"
              size="auto"
              fontFamily="poppins"
              className="rounded-xl px-5 py-2.5 text-white/90"
              textClassName="text-sm font-bold text-white/90"
            />
          </div>
        </div>

        {/* Desktop layout — character overflows top */}
        <div className="hidden xl:flex items-end relative">
          <div className="flex flex-col justify-center gap-4 p-10 flex-1">
            <Typo as="h3" className="text-2xl font-bold" fontFamily="poppins" fontVariant="h3">
              Ready to host your own tournament?
            </Typo>
            <Typo as="p" className="text-gray-400 text-sm" fontFamily="poppins" fontVariant="p4">
              Our platform provides all the tools you need to create, manage and promote your
              esports tournament.
            </Typo>
            <div className="flex gap-3">
              <Button
                label="Create Tournament ↗"
                variant="contained-red"
                size="auto"
                fontFamily="poppins"
                className="rounded-lg px-5 py-2"
                textClassName="text-sm font-bold"
                onClick={() => router.push(`/tournament`)}
              />
              <Button
                label="Learn about features"
                variant="outlined-grey"
                size="auto"
                fontFamily="poppins"
                className="rounded-lg px-5 py-2 text-white/90"
                textClassName="text-sm font-bold text-white/90"
              />
            </div>
          </div>
          <div className="relative w-[380px] shrink-0 -mt-20">
            <Image
              width={380}
              height={300}
              priority
              alt="Player with helmet"
              className="object-contain object-bottom drop-shadow-2xl"
              src="/assets/images/fortniteStatus.svg"
            />
          </div>
        </div>
      </div>

      <hr className="border-t border-gray-700 my-4" />

      {/* Your favorite Games */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Typo as="h2" className="text-xl" color="white" fontFamily="poppins" fontVariant="h2">
            Your favorite Games
          </Typo>
          {userFavoriteGames.length > 0 && (
            <Link href="/selectGames">
              <Typo
                as="span"
                className="text-defendrRed text-sm cursor-pointer hover:text-red-400 transition-colors"
                fontFamily="poppins"
                fontVariant="p4"
              >
                Edit
              </Typo>
            </Link>
          )}
        </div>

        {favoriteGamesLoading ? (
          <div className="flex items-center justify-center min-h-[120px]">
            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-4 border-defendrRed/30 border-t-defendrRed rounded-full animate-spin" />
              <Typo
                as="p"
                className="font-semibold text-sm"
                color="white"
                fontFamily="poppins"
                fontVariant="p4"
              >
                Loading your favorite games...
              </Typo>
            </div>
          </div>
        ) : userFavoriteGames && userFavoriteGames.length > 0 ? (
          <>
            <div
              ref={gamesRef}
              className="flex gap-3 overflow-x-auto pb-1 sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 sm:gap-4 sm:overflow-x-visible scrollbar-hide"
              onScroll={handleGamesScroll}
            >
              {userFavoriteGames.map(game => (
                <div key={game._id} className="flex-shrink-0 w-36 sm:w-auto">
                  <GameCard
                    game={game}
                    isSelected={selectedGame?._id === game._id}
                    onSelect={setSelectedGame}
                    showHoverData={true}
                    publishedTournamentCount={gameTournamentCounts.get(game._id) || 0}
                    simplified={true}
                  />
                </div>
              ))}
              <Link href="/selectGames" className="flex-shrink-0 w-36 sm:w-auto">
                <div className="relative w-full aspect-[3/4] rounded-xl cursor-pointer transition-all duration-300 overflow-hidden hover:ring-2 hover:ring-defendrRed/60 hover:scale-[1.02] bg-gradient-to-br from-gray-800 to-gray-900 flex flex-col items-center justify-center gap-3 group">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-defendrRed/20 transition-colors duration-300">
                    <span className="text-2xl text-gray-300 group-hover:text-defendrRed transition-colors">
                      +
                    </span>
                  </div>
                  <Typo
                    as="span"
                    className="font-semibold text-xs text-center"
                    color="white"
                    fontFamily="poppins"
                    fontVariant="p4"
                  >
                    Add Game
                  </Typo>
                </div>
              </Link>
            </div>
            {/* Mobile scroll indicator — gradient pill with glow */}
            <div className="mt-1 px-1 sm:hidden">
              <div className="relative w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 h-full rounded-full bg-gradient-to-r from-defendrRed to-rose-400 shadow-[0_0_8px_2px_rgba(226,58,99,0.5)] transition-transform duration-150 ease-out"
                  style={{ width: PILL_W, transform: `translateX(${gamesScrollX}px)` }}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 min-h-[140px] px-4">
            <Typo
              as="p"
              className="font-semibold text-base text-center sm:text-left"
              color="white"
              fontFamily="poppins"
              fontVariant="p4"
            >
              No favorite games found. Select yours:
            </Typo>
            <Link href="/selectGames">
              <div className="w-40 rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 transition-all ring-1 ring-white/10 hover:ring-defendrRed">
                <div className="w-full h-28 flex items-center justify-center">
                  <span className="text-5xl text-gray-300 font-light">+</span>
                </div>
                <div className="px-4 py-2 border-t border-white/10 bg-black/20">
                  <Typo
                    as="span"
                    className="font-semibold text-sm text-center block"
                    color="white"
                    fontFamily="poppins"
                    fontVariant="p3"
                  >
                    Select Games
                  </Typo>
                </div>
              </div>
            </Link>
          </div>
        )}
      </div>

      <hr className="border-t border-gray-700 my-2" />

      {/* Tournament Organizers */}
      <div className="flex flex-col gap-6 mb-10">
        <div className="flex justify-between items-center">
          <Typo as="h2" className="text-xl" color="white" fontFamily="poppins" fontVariant="h2">
            Tournament Organizers
          </Typo>
          <Link href="/organizations">
            <Typo
              as="span"
              className="text-defendrRed text-center cursor-pointer hover:text-red-400 transition-colors"
              color="red"
              fontFamily="poppins"
              fontVariant="p4"
            >
              View All
            </Typo>
          </Link>
        </div>

        <div className="relative">
          <div
            ref={orgsRef}
            className="flex md:grid gap-8 overflow-x-auto sm:overflow-x-visible xl:grid-cols-5 scrollbar-hide py-4"
            onScroll={handleOrgsScroll}
          >
            {topOrganizations.map((org, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 flex flex-col items-center gap-4 w-36 sm:w-48 cursor-pointer hover:scale-105 transition-transform"
                onClick={() => router.push(`/organization/${org._id}/Profile`)}
              >
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-[#23272b] flex items-center justify-center shadow-lg">
                  <Image
                    alt={org.name}
                    height={128}
                    src={organizerImageSanitizer(
                      org.logo || '',
                      '/assets/images/default-organization-icon.jpg',
                    )}
                    style={{ objectFit: 'contain' }}
                    width={128}
                  />
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Typo
                      as="p"
                      className="text-base font-semibold"
                      color="white"
                      fontFamily="poppins"
                      fontVariant="p3"
                    >
                      {org.name}
                    </Typo>
                    {org.verified && (
                      <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <Typo
                      as="p"
                      className="text-sm mb-1"
                      color="ghostGrey"
                      fontFamily="poppins"
                      fontVariant="p5"
                    >
                      {formatNumber(org.staff?.length || org.staffCount || org.memberCount || 0)}{' '}
                      Members
                    </Typo>
                    <Typo
                      as="p"
                      className="text-sm"
                      color="ghostGrey"
                      fontFamily="poppins"
                      fontVariant="p5"
                    >
                      {formatNumber(org.nbFollowers || org.socialMediaFollowers || 200)} Followers
                    </Typo>
                    <Typo
                      as="p"
                      className="text-sm mt-1"
                      color="ghostGrey"
                      fontFamily="poppins"
                      fontVariant="p5"
                    >
                      {org.tournamentCount || org.tournaments?.length || 0} Tournaments
                    </Typo>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Mobile scroll indicator */}
          <div className="mt-3 px-1 sm:hidden">
            <div className="relative w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="absolute top-0 h-full rounded-full bg-gradient-to-r from-defendrRed to-rose-400 shadow-[0_0_8px_2px_rgba(226,58,99,0.5)] transition-transform duration-150 ease-out"
                style={{ width: PILL_W, transform: `translateX(${orgsScrollX}px)` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
