'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Search, Filter, Calendar, Users, Gamepad2 } from 'lucide-react'

import Typo from '@/components/ui/Typo'
import Button from '@/components/ui/Button'
import Loader from '@/app/loading'
import { getAllGames } from '@/services/gameService'
import { getAllTournamentsPaginated } from '@/services/tournamentService'
import GameCard from '@/components/ui/GameCard'
import GamePopupModal from '@/components/ui/GamePopupModal'
import { Game, GamePlatform } from '@/types/gameType'

interface Tournament {
  _id: string
  name: string
  publishing?: boolean
  game?: {
    _id: string
    name: string
  }
}

type GenreFilter =
  | 'all'
  | 'Action'
  | 'RPG'
  | 'Strategy'
  | 'Sports'
  | 'Racing'
  | 'Fighting'
  | 'Adventure'
  | 'Puzzle'
type PlatformFilter = 'all' | GamePlatform

export default function GamesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session } = useSession()

  const [games, setGames] = useState<Game[]>([])
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState<GenreFilter>('all')
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformFilter>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(15)
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [showGameModal, setShowGameModal] = useState(false)

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

  // Fetch games and published tournaments
  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        // Fetch games first
        const gamesData = await getAllGames()
        setGames(gamesData || [])

        // Fetch all tournaments across all pages (for testing - showing all tournaments)
        const allTournaments: Tournament[] = []

        // Get first page to know total pages
        const firstPageData = await getAllTournamentsPaginated(1, 10)

        // Check if firstPageData is an array (direct tournaments) or has pagination structure
        const isPublished = (value: unknown) =>
          value === true || value === 'true' || value === 1 || value === '1'

        if (Array.isArray(firstPageData)) {
          // Direct array of tournaments - filter for published
          const publishedFromPage = firstPageData.filter((t: Tournament) =>
            isPublished(t?.publishing),
          )
          allTournaments.push(...publishedFromPage)
        } else if (firstPageData?.pagination) {
          const totalPages = firstPageData.pagination.totalPages

          // Create array of page numbers to fetch
          const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)

          // Fetch all pages in parallel
          const pagePromises = pageNumbers.map(pageNum =>
            getAllTournamentsPaginated(pageNum, 10).catch(error => {
              console.error(`Failed to fetch page ${pageNum}:`, error)
              return { tournaments: [], pagination: null }
            }),
          )

          const allPagesData = await Promise.all(pagePromises)

          // Process all pages - filter for published tournaments only
          allPagesData.forEach(pageData => {
            if (Array.isArray(pageData)) {
              // Direct array - filter for published
              const publishedFromPage = pageData.filter((t: Tournament) =>
                isPublished(t?.publishing),
              )
              allTournaments.push(...publishedFromPage)
            } else if (pageData?.tournaments) {
              // Paginated response - filter for published
              const publishedFromPage = pageData.tournaments.filter((t: Tournament) =>
                isPublished(t?.publishing),
              )
              allTournaments.push(...publishedFromPage)
            }
          })
        } else if (firstPageData?.tournaments) {
          // Single page with tournaments property - filter for published
          const isPublished = (value: unknown) =>
            value === true || value === 'true' || value === 1 || value === '1'
          const publishedFromPage = firstPageData.tournaments.filter((t: Tournament) =>
            isPublished(t?.publishing),
          )
          allTournaments.push(...publishedFromPage)
        } else if (Array.isArray(firstPageData)) {
          // Direct array - filter for published
          const isPublished = (value: unknown) =>
            value === true || value === 'true' || value === 1 || value === '1'
          const publishedFromPage = firstPageData.filter((t: Tournament) =>
            isPublished(t?.publishing),
          )
          allTournaments.push(...publishedFromPage)
        }

        setTournaments(allTournaments)
      } catch (error) {
        console.error('Failed to fetch data:', error)
        setGames([])
        setTournaments([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Calculate tournament statistics
  const tournamentStats = useMemo(() => {
    const gameTournamentCounts = new Map<string, number>()

    tournaments.forEach(tournament => {
      if (tournament.game?._id) {
        const currentCount = gameTournamentCounts.get(tournament.game._id) || 0
        gameTournamentCounts.set(tournament.game._id, currentCount + 1)
      }
    })

    return {
      totalPublishedTournaments: tournaments.length,
      gamesWithTournaments: gameTournamentCounts.size,
      gameTournamentCounts,
    }
  }, [tournaments])

  // Filter games based on criteria
  const filteredGames = useMemo(() => {
    let filtered = games

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(game => {
        const searchLower = searchQuery.toLowerCase()

        // Check basic fields
        if (
          game.name.toLowerCase().includes(searchLower) ||
          game.description?.toLowerCase().includes(searchLower) ||
          game.genre?.toLowerCase().includes(searchLower)
        ) {
          return true
        }

        // Check igdbData for genre information
        if (game.igdbData?.genres) {
          const genres = Array.isArray(game.igdbData.genres)
            ? game.igdbData.genres
            : [game.igdbData.genres]
          return genres.some((genre: any) =>
            (genre.name || genre).toLowerCase().includes(searchLower),
          )
        }

        return false
      })
    }

    // Genre filter
    if (selectedGenre !== 'all') {
      filtered = filtered.filter(game => {
        // Check if game has genre field
        if (game.genre) {
          return game.genre === selectedGenre
        }
        // If no genre field, check igdbData for genre information
        if (game.igdbData?.genres) {
          const genres = Array.isArray(game.igdbData.genres)
            ? game.igdbData.genres
            : [game.igdbData.genres]
          return genres.some(
            (genre: any) => genre.name === selectedGenre || genre === selectedGenre,
          )
        }
        return false
      })
    }

    // Platform filter - check if game supports the selected platform
    if (selectedPlatform !== 'all') {
      filtered = filtered.filter(
        game => game.platforms && game.platforms.includes(selectedPlatform as GamePlatform),
      )
    }

    return filtered
  }, [games, searchQuery, selectedGenre, selectedPlatform])

  // Pagination
  const totalPages = Math.ceil(filteredGames.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedGames = filteredGames.slice(startIndex, startIndex + itemsPerPage)

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedGenre, selectedPlatform])

  const handleFilterChange = (filterType: string, value: string) => {
    switch (filterType) {
      case 'genre':
        setSelectedGenre(value as GenreFilter)
        break
      case 'platform':
        setSelectedPlatform(value as PlatformFilter)
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

  const handleGameClick = (game: Game) => {
    setSelectedGame(game)
    setShowGameModal(true)
  }

  const handleViewTournaments = (game: Game) => {
    router.push(`/tournaments?game=${game._id}`)
    setShowGameModal(false)
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
            Games
          </Typo>
          <Typo as="p" color="ghostGrey" fontFamily="poppins" fontVariant="p4">
            Discover and explore games from around the world
          </Typo>
        </div>

        {/* Tournament Statistics */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-defendrRed/20 rounded-lg">
                <Calendar className="h-6 w-6 text-defendrRed" />
              </div>
              <div>
                <Typo as="h3" color="white" fontFamily="poppins" fontVariant="h4" className="mb-1">
                  {tournamentStats.totalPublishedTournaments}
                </Typo>
                <Typo as="p" color="ghostGrey" fontFamily="poppins" fontVariant="p5">
                  Published Tournaments
                </Typo>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600/20 rounded-lg">
                <Gamepad2 className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <Typo as="h3" color="white" fontFamily="poppins" fontVariant="h4" className="mb-1">
                  {tournamentStats.gamesWithTournaments}
                </Typo>
                <Typo as="p" color="ghostGrey" fontFamily="poppins" fontVariant="p5">
                  Games with Tournaments
                </Typo>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-600/20 rounded-lg">
                <Users className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <Typo as="h3" color="white" fontFamily="poppins" fontVariant="h4" className="mb-1">
                  {games.length}
                </Typo>
                <Typo as="p" color="ghostGrey" fontFamily="poppins" fontVariant="p5">
                  Total Games
                </Typo>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search games..."
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
            {/* Genre Filter */}
            <div className="flex items-center gap-2">
              <Gamepad2 className="h-5 w-5 text-gray-400" />
              <select
                value={selectedGenre}
                onChange={e => handleFilterChange('genre', e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-defendrRed"
              >
                <option value="all">All Genres</option>
                <option value="Action">Action</option>
                <option value="RPG">RPG</option>
                <option value="Strategy">Strategy</option>
                <option value="Sports">Sports</option>
                <option value="Racing">Racing</option>
                <option value="Fighting">Fighting</option>
                <option value="Adventure">Adventure</option>
                <option value="Puzzle">Puzzle</option>
              </select>
            </div>

            {/* Platform Filter */}
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-400" />
              <select
                value={selectedPlatform}
                onChange={e => handleFilterChange('platform', e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-defendrRed"
              >
                <option value="all">All Platforms</option>
                <option value="PC">PC</option>
                <option value="Playstation">PlayStation</option>
                <option value="XBOX">Xbox</option>
                <option value="Nintendo Switch">Nintendo Switch</option>
                <option value="iOS">iOS</option>
                <option value="Android">Android</option>
              </select>
            </div>

            {/* Clear Filters */}
            <Button
              label="Clear Filters"
              size="s"
              variant="outlined-grey"
              onClick={() => {
                setSearchQuery('')
                setSelectedGenre('all')
                setSelectedPlatform('all')
                setCurrentPage(1)
                // Update URL to remove all parameters when clearing filters
                const url = new URL(window.location.href)
                url.searchParams.delete('page')
                window.history.pushState({}, '', url.toString())
              }}
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <Typo as="p" color="ghostGrey" fontFamily="poppins" fontVariant="p5">
            Showing {paginatedGames.length} of {filteredGames.length} games
          </Typo>
        </div>

        {/* Games Grid */}
        {paginatedGames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6 mb-8">
            {paginatedGames.map(game => {
              const gameTournaments = tournaments.filter(t => t.game?._id === game._id)
              const publishedTournamentCount =
                tournamentStats.gameTournamentCounts.get(game._id) || 0

              return (
                <div key={game._id} onClick={() => handleGameClick(game)}>
                  <GameCard
                    game={game}
                    isSelected={false}
                    onSelect={() => {}}
                    showHoverData={true}
                    tournaments={gameTournaments}
                    publishedTournamentCount={publishedTournamentCount}
                  />
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-gray-400 text-4xl">🎮</span>
            </div>
            <Typo as="h3" color="white" fontFamily="poppins" fontVariant="h4" className="mb-2">
              No Games Found
            </Typo>
            <Typo as="p" color="ghostGrey" fontFamily="poppins" fontVariant="p4">
              Try adjusting your filters or search terms
            </Typo>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <Button
              label="Previous"
              size="s"
              variant="outlined-grey"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            />

            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    page === currentPage
                      ? 'bg-defendrRed text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <Button
              label="Next"
              size="s"
              variant="outlined-grey"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            />
          </div>
        )}

        {/* Game Popup Modal */}
        {showGameModal && selectedGame && (
          <GamePopupModal
            game={selectedGame}
            tournaments={tournaments.filter(t => t.game?._id === selectedGame._id)}
            onClose={() => setShowGameModal(false)}
            onViewTournaments={() => handleViewTournaments(selectedGame)}
          />
        )}
      </div>
    </div>
  )
}
