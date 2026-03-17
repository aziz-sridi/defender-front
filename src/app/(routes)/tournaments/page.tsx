'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Search, Filter, Calendar, Users, Gamepad2 } from 'lucide-react'

import Typo from '@/components/ui/Typo'
import Button from '@/components/ui/Button'
import TournamentCard from '@/components/ui/TournamentCard'
import Loader from '@/app/loading'
import { getAllTournamentsPaginated } from '@/services/tournamentService'
import { getAllGames } from '@/services/gameService'
import Pagination from '@/components/ui/Pagination'

interface Tournament {
  _id: string
  name: string
  startDate: string
  endDate?: string
  coverImage?: string
  publishing?: boolean
  gameMode?: 'Solo' | 'Team'
  game?: {
    _id: string
    name: string
  }
  participants?: any[]
  maxParticipants?: number
  joinProcess?: {
    entryFee: number
  }
  createdBy?: {
    name: string
  }
  isClosed?: boolean
  started?: boolean
  winner?: any
  bracket?: any
  looserBracket?: any
  swissBrackets?: any[]
}

interface Game {
  _id: string
  name: string
}

type PhaseFilter = 'all' | 'upcoming' | 'ongoing' | 'passed'
type GameModeFilter = 'all' | 'Solo' | 'Team'

export default function TournamentsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session } = useSession()

  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPhase, setSelectedPhase] = useState<PhaseFilter>('all')
  const [selectedGame, setSelectedGame] = useState<string>('all')

  // Initialize selected game from URL parameters
  useEffect(() => {
    const gameParam = searchParams.get('game')
    if (gameParam) {
      setSelectedGame(gameParam)
    }
  }, [searchParams])
  const [selectedMode, setSelectedMode] = useState<GameModeFilter>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(15)
  const [apiPage, setApiPage] = useState(1)
  const [totalApiPages, setTotalApiPages] = useState(1)
  const [hasMoreTournaments, setHasMoreTournaments] = useState(true)

  // Initialize current page from URL parameters
  useEffect(() => {
    const pageParam = searchParams.get('page')
    if (pageParam) {
      const page = parseInt(pageParam, 10)
      if (page > 0) {
        setCurrentPage(page)
      }
    }
  }, [searchParams])

  // Fetch all published tournaments across all pages
  useEffect(() => {
    async function fetchAllPublishedTournaments() {
      setLoading(true)
      try {
        // First, get the first page to know total pages
        const firstPageData = await getAllTournamentsPaginated(1, 10)

        if (!firstPageData?.pagination) {
          // Fallback: if no pagination info, just use first page
          const pageTournaments = firstPageData?.tournaments || firstPageData || []
          // For testing: show all tournaments (remove this filter to show only published)
          const isPublished = (value: unknown) =>
            value === true || value === 'true' || value === 1 || value === '1'
          const publishedTournaments = pageTournaments.filter(
            (t: Tournament) => isPublished(t?.publishing) && !t?.achieved,
          )
          // Uncomment the line below to show ALL tournaments (for testing)
          // const publishedTournaments = pageTournaments

          const gamesData = await getAllGames()
          setTournaments(publishedTournaments)
          setGames(gamesData || [])
          setLoading(false)
          return
        }

        const totalPages = firstPageData.pagination.totalPages

        // Create array of page numbers to fetch
        const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)

        // Fetch all pages in parallel (much faster than sequential)
        const pagePromises = pageNumbers.map(pageNum =>
          getAllTournamentsPaginated(pageNum, 10).catch(error => {
            console.error(`Failed to fetch page ${pageNum}:`, error)
            return { tournaments: [], pagination: null } // Return empty on error
          }),
        )

        const allPagesData = await Promise.all(pagePromises)

        // Combine and filter tournaments in one pass (more efficient)
        const isPublished = (value: unknown) =>
          value === true || value === 'true' || value === 1 || value === '1'

        const publishedTournaments: Tournament[] = []
        allPagesData.forEach(pageData => {
          if (pageData?.tournaments) {
            const publishedFromPage = pageData.tournaments.filter(
              (t: Tournament) => isPublished(t?.publishing) && !t?.achieved,
            )
            publishedTournaments.push(...publishedFromPage)
            // Uncomment the line below to show ALL tournaments (for testing)
            // publishedTournaments.push(...pageData.tournaments)
          }
        })

        // Fetch games in parallel
        const gamesData = await getAllGames()

        setTournaments(publishedTournaments)
        setGames(gamesData || [])
        setTotalApiPages(totalPages)
        setHasMoreTournaments(false)
      } catch (error) {
        console.error('Failed to fetch tournaments:', error)
        setTournaments([])
        setGames([])
      } finally {
        setLoading(false)
      }
    }
    fetchAllPublishedTournaments()
  }, [])

  // Filter tournaments based on criteria
  const filteredTournaments = useMemo(() => {
    // Filter out achieved tournaments first
    let filtered = tournaments.filter(t => !t?.achieved)

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        tournament =>
          tournament.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tournament.game?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Phase filter
    if (selectedPhase !== 'all') {
      const now = new Date()
      filtered = filtered.filter(tournament => {
        const startDate = new Date(tournament.startDate)
        const endDate = tournament.endDate ? new Date(tournament.endDate) : null

        // Check if tournament has ended (has winner or finished bracket)
        const hasTournamentEnded =
          tournament.isClosed ||
          tournament.winner ||
          (tournament.bracket && tournament.bracket.finished) ||
          (tournament.looserBracket && tournament.looserBracket.finished) ||
          (tournament.swissBrackets && tournament.swissBrackets.some(bracket => bracket.finished))

        switch (selectedPhase) {
          case 'upcoming':
            return startDate > now && !hasTournamentEnded
          case 'ongoing':
            return startDate <= now && (endDate ? endDate > now : true) && !hasTournamentEnded
          case 'passed':
            return hasTournamentEnded || (endDate ? endDate <= now : startDate < now)
          default:
            return true
        }
      })
    }

    // Game filter
    if (selectedGame !== 'all') {
      filtered = filtered.filter(tournament => tournament.game?._id === selectedGame)
    }

    // Game mode filter
    if (selectedMode !== 'all') {
      filtered = filtered.filter(tournament => tournament.gameMode === selectedMode)
    }

    return filtered
  }, [tournaments, searchQuery, selectedPhase, selectedGame, selectedMode])

  // Pagination
  const totalPages = Math.ceil(filteredTournaments.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedTournaments = filteredTournaments.slice(startIndex, startIndex + itemsPerPage)

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedPhase, selectedGame, selectedMode])

  const handleFilterChange = (filterType: string, value: string) => {
    switch (filterType) {
      case 'phase':
        setSelectedPhase(value as PhaseFilter)
        break
      case 'game':
        setSelectedGame(value)
        break
      case 'mode':
        setSelectedMode(value as GameModeFilter)
        break
    }

    // Reset to page 1 when filters change
    setCurrentPage(1)

    // Update URL to remove page parameter when filters change
    const url = new URL(window.location.href)
    url.searchParams.delete('page')
    window.history.pushState({}, '', url.toString())
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })

    // Update URL with page parameter
    const url = new URL(window.location.href)
    url.searchParams.set('page', page.toString())
    window.history.pushState({}, '', url.toString())
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-white">
        <Loader />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#161616] text-white">
      <div className="max-w-[1400px] mx-auto p-4 sm:p-6 md:p-10">
        {/* Header */}
        <div className="mb-8">
          <Typo as="h1" fontFamily="poppins" fontVariant="h1" className="mb-2">
            {selectedGame !== 'all'
              ? `Tournaments for ${games.find(g => g._id === selectedGame)?.name || 'Selected Game'}`
              : 'Tournaments'}
          </Typo>
          <Typo as="p" color="ghostGrey" fontFamily="poppins" fontVariant="p4">
            {selectedGame !== 'all'
              ? `Tournaments specifically for ${games.find(g => g._id === selectedGame)?.name || 'the selected game'}`
              : 'Discover and join tournaments from around the world'}
          </Typo>
          {selectedGame !== 'all' && (
            <div className="mt-4">
              <Button
                label="View All Tournaments"
                size="s"
                variant="outlined-grey"
                onClick={() => {
                  setSelectedGame('all')
                  router.push('/tournaments')
                }}
              />
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search tournaments..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
                // Update URL to remove page parameter when searching
                const url = new URL(window.location.href)
                url.searchParams.delete('page')
                window.history.pushState({}, '', url.toString())
              }}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-defendrRed focus:border-transparent"
            />
          </div>

          {/* Filter Row */}
          <div className="flex flex-wrap gap-4">
            {/* Phase Filter */}
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <select
                value={selectedPhase}
                onChange={e => handleFilterChange('phase', e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-defendrRed"
              >
                <option value="all">All Phases</option>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="passed">Passed</option>
              </select>
            </div>

            {/* Game Filter */}
            <div className="flex items-center gap-2">
              <Gamepad2 className="h-5 w-5 text-gray-400" />
              <select
                value={selectedGame}
                onChange={e => handleFilterChange('game', e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-defendrRed"
              >
                <option value="all">All Games</option>
                {games.length > 0 &&
                  games.map(game => (
                    <option key={game._id} value={game._id}>
                      {game.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Game Mode Filter */}
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-400" />
              <select
                value={selectedMode}
                onChange={e => handleFilterChange('mode', e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-defendrRed"
              >
                <option value="all">All Modes</option>
                <option value="Solo">Solo</option>
                <option value="Team">Team</option>
              </select>
            </div>

            {/* Clear Filters */}
            <Button
              label="Clear Filters"
              size="s"
              variant="outlined-grey"
              onClick={() => {
                setSearchQuery('')
                setSelectedPhase('all')
                setSelectedGame('all')
                setSelectedMode('all')
                setCurrentPage(1)
                // Update URL to remove all parameters when clearing filters
                const url = new URL(window.location.href)
                url.searchParams.delete('page')
                url.searchParams.delete('game')
                window.history.pushState({}, '', url.toString())
              }}
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <Typo as="p" color="ghostGrey" fontFamily="poppins" fontVariant="p5">
            Showing {paginatedTournaments.length} of {filteredTournaments.length} tournaments
          </Typo>
        </div>

        {/* Tournaments Grid */}
        {paginatedTournaments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6 mb-8">
            {paginatedTournaments.map(tournament => (
              <TournamentCard key={tournament._id} tournament={tournament} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-gray-400 text-4xl">🏆</span>
            </div>
            <Typo as="h3" color="white" fontFamily="poppins" fontVariant="h4" className="mb-2">
              No Tournaments Found
            </Typo>
            <Typo as="p" color="ghostGrey" fontFamily="poppins" fontVariant="p4">
              Try adjusting your filters or search terms
            </Typo>
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  )
}
