'use client'
import { Filter, Search } from 'lucide-react'
import { useMemo, useState } from 'react'

import Button from '@/components/ui/Button'
import Input from '@/components/ui/input'
import Typo from '@/components/ui/Typo'
import TournamentCard from '@/components/user/userProfileTabs/helpers/TournamentCard'

interface Tournament {
  id: string
  name: string
  description: string
  [key: string]: any
}

interface EventsTabProps {
  tournaments?: Tournament[]
  organizerTournaments?: Tournament[]
}

const EventsTab: React.FC<EventsTabProps> = ({ tournaments = [], organizerTournaments = [] }) => {
  const [activeTab, setActiveTab] = useState<'participate' | 'organised'>('participate')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 4

  const tournamentData = useMemo(
    () => ({
      participated: tournaments || [],
      organized: organizerTournaments || [],
    }),
    [tournaments, organizerTournaments],
  )

  const currentTournaments =
    activeTab === 'participate' ? tournamentData.participated : tournamentData.organized

  const filteredTournaments = currentTournaments.filter(
    tournament =>
      tournament.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tournament.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const totalCount = filteredTournaments.length
  const totalPages = Math.ceil(totalCount / itemsPerPage)

  const paginatedTournaments = filteredTournaments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen p-2">
      <div className=" mx-auto  max-w-6xl">
        <div className="mb-8">
          <Typo as="p" className="md:text-3xl text-xl font-bold mb-6">
            Events ({totalCount})
          </Typo>

          <div className="flex flex-col md:flex-row items-center justify-between mb-6">
            <div className="flex gap-1 bg-[#2c3036] p-1 rounded-xl">
              <button
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                  activeTab === 'participate'
                    ? 'bg-[#D62555] text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => {
                  setActiveTab('participate')
                  setCurrentPage(1)
                }}
              >
                Participated
                <span
                  className={`ml-1.5 text-xs ${activeTab === 'participate' ? 'text-white/70' : 'text-gray-500'}`}
                >
                  ({tournaments.length})
                </span>
              </button>
              <button
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                  activeTab === 'organised'
                    ? 'bg-[#D62555] text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => {
                  setActiveTab('organised')
                  setCurrentPage(1)
                }}
              >
                Organized
                <span
                  className={`ml-1.5 text-xs ${activeTab === 'organised' ? 'text-white/70' : 'text-gray-500'}`}
                >
                  ({organizerTournaments.length})
                </span>
              </button>
            </div>

            <div className="flex items-center mt-4 md:mt-0 gap-4">
              <div className="relative overflow-hidden">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
                <Input
                  className="pl-10 w-64 text-white focus:border-red-700"
                  textClassName="bg-transparent! border-transparent!"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e: any) => {
                    const val = typeof e === 'string' ? e : (e?.target?.value ?? '')
                    setSearchQuery(val)
                    setCurrentPage(1)
                  }}
                />
              </div>
              <button className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {paginatedTournaments.length > 0 ? (
            paginatedTournaments.map(tournament => (
              <TournamentCard key={tournament._id} tournament={tournament} />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-lg">
                {searchQuery
                  ? 'No tournaments found matching your search.'
                  : 'No tournaments found.'}
              </p>
            </div>
          )}
        </div>

        {totalPages >= 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed text-gray-300 hover:text-white hover:bg-white/10"
              onClick={() => changePage(currentPage - 1)}
            >
              ◀
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`w-8 h-8 rounded-lg text-sm font-semibold transition-all ${
                  currentPage === i + 1
                    ? 'bg-[#D62555] text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
                onClick={() => changePage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed text-gray-300 hover:text-white hover:bg-white/10"
              onClick={() => changePage(currentPage + 1)}
            >
              ▶
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default EventsTab
