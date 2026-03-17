'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useMemo, useRef } from 'react'
import { useSession } from 'next-auth/react'

import Typo from '@/components/ui/Typo'
import { organizerImageSanitizer } from '@/utils/imageUrlSanitizer'
import { Game } from '@/types/gameType'
import GameCard from '@/components/ui/GameCard'
import TournamentCard from '@/components/ui/TournamentCard'
import Loader from '@/app/loading'
import { getAllTournaments } from '@/services/tournamentService'
import { getAllOrganizations } from '@/services/organizationService'

export default function Home() {
  const [tournaments, setTournaments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [organizations, setOrganizations] = useState<any[]>([])
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)

  const { data: session, status } = useSession()
  const userFavoriteGames = session?.user?.favoriteGames || []

  const router = useRouter()

  const tournamentsRef = useRef<HTMLDivElement>(null)
  const orgsRef = useRef<HTMLDivElement>(null)
  const [tournScrollX, setTournScrollX] = useState(0)
  const [orgsScrollX, setOrgsScrollX] = useState(0)
  const RED_BAR_WIDTH = 60
  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const [tournamentsData, organizationsData] = await Promise.all([
          getAllTournaments(),
          getAllOrganizations(),
        ])

        setTournaments(tournamentsData.tournaments || [])
        setOrganizations(Array.isArray(organizationsData) ? organizationsData : [])
      } catch (e) {
        console.error('Failed to fetch data', e)
        setTournaments([])
        setOrganizations([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const newestTournaments = useMemo(() => tournaments?.slice(-4) || [], [tournaments])

  const topOrganizations = useMemo(() => {
    return [...organizations]
      .sort((a, b) => b.tournaments.length - a.tournaments.length)
      .slice(0, 5)
  }, [organizations])

  const formatnbString = (count: number) => {
    if (count >= 1000) {
      return (count / 1000).toFixed(0) + 'K'
    }
    return count
  }

  const ShowMoreButton = () => router.push('/tournaments')

  const handleTournScroll = () => {
    if (tournamentsRef.current) {
      const scrollPercent =
        tournamentsRef.current.scrollLeft /
        (tournamentsRef.current.scrollWidth - tournamentsRef.current.clientWidth)
      setTournScrollX(scrollPercent * (tournamentsRef.current.clientWidth - RED_BAR_WIDTH))
    }
  }

  const handleOrgsScroll = () => {
    if (orgsRef.current) {
      const scrollPercent =
        orgsRef.current.scrollLeft / (orgsRef.current.scrollWidth - orgsRef.current.clientWidth)
      setOrgsScrollX(scrollPercent * (orgsRef.current.clientWidth - RED_BAR_WIDTH))
    }
  }

  if (loading || status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-white">
        <Loader />
      </div>
    )
  }

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
      <div className="flex flex-col gap-6 mb-4">
        <Typo as="h2" className="text-xl" color="white" fontFamily="poppins" fontVariant="h2">
          Tournaments for you
        </Typo>

        <div className="relative">
          <div
            ref={tournamentsRef}
            className="flex gap-4 overflow-x-auto py-4 xl:grid xl:grid-cols-4 scrollbar-hide"
            onScroll={handleTournScroll}
          >
            {newestTournaments && newestTournaments.length > 0 ? (
              newestTournaments.map((tournament: any, i: number) => {
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
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-700 rounded-full sm:hidden">
            <div
              className="h-1 bg-defendrRed rounded-full"
              style={{ width: RED_BAR_WIDTH, transform: `translateX(${tournScrollX}px)` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-3 cursor-pointer" onClick={ShowMoreButton}>
          <div className="flex-1 h-px bg-gray-600" />
          <Typo
            as="span"
            className="text-defendrRed hover:text-defendrRed font-bold whitespace-nowrap"
            fontFamily="poppins"
            fontVariant="p3"
          >
            Show more
          </Typo>
          <div className="flex-1 h-px bg-gray-600" />
        </div>
      </div>
      <div className="relative flex flex-col xl:flex-row items-center xl:items-start justify-between xl:gap-6 gap-0 p-4 xl:p-10 bg-transparent">
        <div className="relative w-full h-72 xl:hidden mb-[-20px]">
          <Image
            fill
            priority
            alt="Player with helmet"
            className="object-contain"
            src="/assets/images/fortniteStatus.svg"
          />
        </div>
        <div className="relative bg-[#1f2327] rounded-xl flex-1 w-full flex flex-col gap-4 p-6 xl:p-10 z-10">
          <Typo as="h3" className="text-2xl mb-2" fontFamily="poppins" fontVariant="h3">
            Ready to host your own tournament?
          </Typo>
          <Typo as="p" className="text-gray-300" fontFamily="poppins" fontVariant="p4">
            Our platform provides all the tools you need to create, manage and promote your esports
            tournament.
          </Typo>
          <div className="flex flex-col md:flex-row gap-4 mt-2">
            <button
              className="bg-defendrRed text-white py-2 px-4 rounded-lg font-bold hover:bg-opacity-90 transition"
              onClick={() => router.push(`/tournament`)}
            >
              Create Tournament ↗
            </button>
            <button className="bg-[#2a2d31] text-white py-2 px-4 rounded-lg font-bold hover:bg-opacity-80 transition">
              Learn about features
            </button>
          </div>
        </div>
        <div className="hidden xl:block relative xl:absolute top-0 right-0 w-[420px] h-full max-h-[100%] z-20">
          <div className="absolute top-0 left-0 w-full h-full rounded-xl overflow-visible">
            <Image
              fill
              priority
              alt="Player with helmet"
              className="object-contain -translate-x-10 -translate-y-10"
              src="/assets/images/fortniteStatus.svg"
            />
          </div>
        </div>
      </div>
      <hr className="border-t border-gray-700 my-4" />
      <div className="flex flex-col gap-6">
        <Typo as="h2" className="text-xl" color="white" fontFamily="poppins" fontVariant="h2">
          Your favorite Games
        </Typo>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-6">
          {userFavoriteGames && userFavoriteGames.length > 0 ? (
            userFavoriteGames.map((game, idx) => (
              <GameCard
                key={idx}
                game={game}
                isSelected={selectedGame?._id === game._id}
                onSelect={setSelectedGame}
              />
            ))
          ) : (
            <div className="col-span-full flex items-center justify-center gap-6 min-h-[120px] px-4">
              <div className="text-gray-400 text-lg font-poppins px-4">
                <Typo
                  as="h2"
                  className="font-semibold text-lg md:text-xl"
                  color="white"
                  fontVariant="h3"
                >
                  No favorite games found. Select Yours right Now:
                </Typo>
              </div>
              <Link href="/selectGames">
                <div className="relative w-40 sm:w-48 md:w-56 lg:w-64 rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 transition-all ring-1 ring-white/10 hover:ring-defendrRed shadow-sm">
                  <div className="w-full h-36 md:h-44 lg:h-52 flex items-center justify-center">
                    <span className="text-5xl md:text-6xl text-gray-300 font-light">+</span>
                  </div>
                  <div className="px-4 py-2 md:py-3 border-t border-white/10 bg-black/20">
                    <Typo
                      as="span"
                      className="font-semibold text-sm md:text-base text-center block"
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

          {userFavoriteGames && userFavoriteGames.length > 0 && (
            <Link href="/selectGames">
              <div
                className="
                  relative w-full rounded-lg cursor-pointer transition-all duration-200 overflow-hidden
                  hover:ring-2 hover:ring-defendrRed
                "
              >
                <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-defendrGrey to-defendrLightBlack">
                  <span className="text-6xl text-gray-400 font-light">+</span>
                </div>
                <div className="bg-defendrGrey px-4 py-3 rounded-b-lg">
                  <Typo
                    as="span"
                    className="font-bold text-sm text-center block"
                    color="white"
                    fontFamily="poppins"
                    fontVariant="p3"
                  >
                    Add Game
                  </Typo>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
      <hr className="border-t border-gray-700 my-2" />
      <div className="flex flex-col gap-6 mb-10">
        <div className="flex justify-between items-center">
          <Typo as="h2" className="text-xl" color="white" fontFamily="poppins" fontVariant="h2">
            Popular Organizers
          </Typo>
          <Link href="/organizations">
            <Typo
              as="span"
              className="text-defendrRed text-center cursor-pointer"
              color="red"
              fontFamily="poppins"
              fontVariant="p4"
            >
              View all
            </Typo>
          </Link>
        </div>
        <div className="relative">
          <div
            ref={orgsRef}
            className="flex md:grid gap-4 overflow-x-auto sm:overflow-x-visible xl:grid-cols-5 scrollbar-hide py-2"
            onScroll={handleOrgsScroll}
          >
            {topOrganizations.map((org, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 flex flex-col items-center gap-2 cursor-pointer w-[120px]"
                onClick={() => router.push(`/organization/${org._id}/Profile`)}
              >
                <div className="relative w-20 h-20 rounded-full overflow-hidden flex items-center justify-center bg-[#23272b] border-2 border-[#1f2327] hover:border-defendrRed transition-colors duration-200">
                  <Image
                    fill
                    alt={org.name}
                    src={organizerImageSanitizer(
                      org.logo,
                      '/assets/images/default-organization-icon.jpg',
                    )}
                    style={{ objectFit: 'contain' }}
                  />
                </div>
                <div className="flex flex-col items-center text-center mt-2">
                  <div className="flex items-center gap-1">
                    <Typo
                      as="p"
                      className="text-sm p-2 font-semibold whitespace-nowrap"
                      fontFamily="poppins"
                    >
                      {org.name}
                    </Typo>
                  </div>
                  <Typo as="p" className="text-xs pb-2 text-gray-400" fontFamily="poppins">
                    {formatnbString(org.socialMediaFollowers || 0)} Subscribers
                  </Typo>
                  <Typo as="p" className="text-xs text-gray-400" fontFamily="poppins">
                    {formatnbString(org.nbFollowers || 0)} Followers
                  </Typo>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-700 rounded-full sm:hidden">
            <div
              className="h-1 bg-defendrRed rounded-full"
              style={{ width: RED_BAR_WIDTH, transform: `translateX(${orgsScrollX}px)` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
