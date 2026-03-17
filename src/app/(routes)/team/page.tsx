// src/app/teams/page.tsx
'use client'
import Image from 'next/image'
import { useEffect, useState, useMemo } from 'react'
import { toast } from 'sonner'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Users, Gamepad2 } from 'lucide-react'

import TeamCard from '@/components/ui/TeamCard'
import Typo from '@/components/ui/Typo'
import Button from '@/components/ui/Button'
import { getAllTeams } from '@/services/teamService'
import { getAllGames } from '@/services/gameService'
import { Team } from '@/types/teamType'
import { Game } from '@/types/gameType'
import Loader from '@/app/loading'
import Pagination from '@/components/ui/Pagination'

export default function TeamsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [teams, setTeams] = useState<Team[]>([])
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGame, setSelectedGame] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12)

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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [teamsData, gamesData] = await Promise.all([getAllTeams(), getAllGames()])

        // For now, let's just set the teams without population to fix the loading issue
        // We can add population later if needed
        setTeams(teamsData)
        setGames(gamesData || [])
      } catch (error) {
        console.error('Failed to load teams:', error)
        toast.error('Failed to load teams. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter teams based on search and game selection
  const filteredTeams = useMemo(() => {
    let filtered = teams

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        team =>
          team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          team.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          team.country?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Game filter
    if (selectedGame !== 'all') {
      filtered = filtered.filter(team => team.game === selectedGame)
    }

    // Sort by creation date DESC (newest first)
    filtered = filtered.sort((a, b) => {
      const dateA = new Date(a.datecreation || a.createdAt || 0).getTime()
      const dateB = new Date(b.datecreation || b.createdAt || 0).getTime()
      return dateB - dateA // DESC order
    })

    return filtered
  }, [teams, searchQuery, selectedGame])

  // Pagination
  const totalPages = Math.ceil(filteredTeams.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedTeams = filteredTeams.slice(startIndex, startIndex + itemsPerPage)

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedGame])

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
      <div className="flex items-center justify-center min-h-[80vh]">
        <Loader />
      </div>
    )
  }

  return (
    <div className="px-4  sm:px-6 md:px-10  bg-[#161616] min-h-screen">
      <div className="relative w-full mb-8">
        <div className="hidden lg:block relative w-full rounded-xl overflow-hidden">
          <Image
            priority
            alt="Teams Banner"
            height={400}
            src="/assets/team/coverTeamDesktop.jpg"
            style={{ objectFit: 'contain', width: '100%', height: 'auto' }}
            width={1920}
          />
        </div>
        <div className="lg:hidden relative w-full rounded-xl overflow-hidden">
          <Image
            priority
            alt="Teams Banner"
            height={600}
            src="/assets/team/coverTeamMobile.jpg"
            style={{ objectFit: 'contain', width: '100%', height: 'auto' }}
            width={800}
          />
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search teams..."
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
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Game Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto sm:min-w-[200px]">
            <Gamepad2 className="h-5 w-5 text-gray-400 flex-shrink-0" />
            <select
              value={selectedGame}
              onChange={e => {
                setSelectedGame(e.target.value)
                setCurrentPage(1)
                // Update URL to remove page parameter when filtering
                const url = new URL(window.location.href)
                url.searchParams.delete('page')
                window.history.pushState({}, '', url.toString())
              }}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-defendrRed"
            >
              <option value="all">All Games</option>
              {games.map(game => (
                <option key={game._id} value={game._id}>
                  {game.name}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          <Button
            label="Clear Filters"
            size="s"
            variant="outlined-grey"
            onClick={() => {
              setSearchQuery('')
              setSelectedGame('all')
              setCurrentPage(1)
              // Update URL to remove all parameters when clearing filters
              const url = new URL(window.location.href)
              url.searchParams.delete('page')
              window.history.pushState({}, '', url.toString())
            }}
            className="w-full sm:w-auto"
          />
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <Typo as="p" color="ghostGrey" fontFamily="poppins" fontVariant="p5">
          Showing {paginatedTeams.length} of {filteredTeams.length} teams
        </Typo>
      </div>

      {filteredTeams.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {paginatedTeams.map(team => (
              <TeamCard key={team._id} team={team} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-gray-400 text-4xl">👥</span>
          </div>
          <Typo as="h3" color="white" fontFamily="poppins" fontVariant="h4" className="mb-2">
            No Teams Found
          </Typo>
          <Typo as="p" color="ghostGrey" fontFamily="poppins" fontVariant="p4">
            Try adjusting your filters or search terms
          </Typo>
        </div>
      )}
      <div className="relative flex flex-col xl:flex-row items-center xl:items-start justify-between xl:gap-6 gap-0 p-4 xl:p-10 xl:mt-10 bg-transparent">
        {/* Mobile image */}
        <div className="relative w-full h-72 xl:hidden  mb-[-20px]">
          <Image
            fill
            priority
            alt="Player with helmet"
            className="object-contain"
            src="/team.svg"
          />
        </div>

        {/* Text Card */}
        <div className="relative bg-[#1f2327] rounded-xl flex-1 w-[420px] flex flex-col gap-4 p-6 xl:p-10 z-10 mb-10">
          <Typo as="h3" className="text-2xl mb-2" fontFamily="poppins" fontVariant="h3">
            Ready to build Your Dream Team?
          </Typo>
          <Typo as="p" className="text-gray-300" fontFamily="poppins" fontVariant="p4">
            Create your team profile, recruit players,and compete in tournaments to build your
            team's reputation
          </Typo>
          <div className="flex flex-col md:flex-row gap-4 mt-2">
            <button
              className="bg-defendrRed text-white py-2 px-4 rounded-lg font-bold hover:bg-opacity-90 transition"
              onClick={() => router.push(`/team/create`)}
            >
              Create Team ↗
            </button>
            <button className="bg-[#2a2d31] text-white py-2 px-4 rounded-lg font-bold hover:bg-opacity-80 transition">
              Hire Players
            </button>
          </div>
        </div>

        {/* Desktop image */}
        <div className="hidden xl:block relative xl:absolute top-0 right-0 w-[420px] h-full max-h-[100%] z-20">
          <div className="absolute top-0 left-0 w-full h-full rounded-xl overflow-visible">
            <Image
              fill
              priority
              alt="Player with helmet"
              className="object-contain -translate-y-10"
              src="/team.svg"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
