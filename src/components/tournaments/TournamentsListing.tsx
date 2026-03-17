'use client'

import { useState, useMemo } from 'react'

import Typo from '@/components/ui/Typo'
import TournamentCard from '@/components/ui/TournamentCard'
// SSR provides initialTournaments; this component only handles client-side filtering.

interface TournamentShape {
  _id: string
  name: string
  startDate: string
  endDate?: string
  winner?: unknown
  coverImage?: string
  publishing?: boolean
}

export default function TournamentsListing({
  initialTournaments = [],
  page = 1,
  pageSize = 12,
  total = 0,
}: {
  initialTournaments?: TournamentShape[]
  page?: number
  pageSize?: number
  total?: number
}) {
  const [tournaments] = useState<TournamentShape[]>(initialTournaments)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search) {
      return tournaments
    }
    return tournaments.filter(t => t.name.toLowerCase().includes(search.toLowerCase()))
  }, [search, tournaments])

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  const makeStatusTag = (t: TournamentShape) => {
    const now = Date.now()
    const start = t.startDate ? new Date(t.startDate).getTime() : 0
    const ended = Boolean(t.winner)
    if (ended) {
      return { label: 'Ended', variant: 'danger' as const }
    }
    if (start && start < now) {
      return { label: 'Started', variant: 'success' as const }
    }
    return { label: 'Upcoming', variant: 'warning' as const }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <Typo
          as="h1"
          className="text-3xl sm:text-4xl"
          color="white"
          fontFamily="poppins"
          fontVariant="h1"
        >
          All Tournaments
        </Typo>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <input
            aria-label="Search tournaments"
            className="w-full sm:w-80 rounded-md bg-[#1f1f1f] border border-gray-700 focus:border-defendrRed focus:outline-none px-4 py-2 text-sm text-white placeholder-gray-400"
            placeholder="Search by name..."
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <span className="text-sm text-gray-400 font-poppins">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex items-center justify-center min-h-[30vh] text-gray-400">
          <Typo as="p" className="font-semibold" color="white" fontVariant="h3">
            No tournaments found.
          </Typo>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map(t => (
            <TournamentCard key={t._id} statusTag={makeStatusTag(t)} tournament={t} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 flex-wrap mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => {
            const isActive = p === page
            return (
              <a
                key={p}
                className={`px-3 py-1 rounded-md text-sm font-poppins border transition-colors ${
                  isActive
                    ? 'bg-defendrRed border-defendrRed text-white'
                    : 'bg-[#1f1f1f] border-gray-700 text-gray-300 hover:border-defendrRed'
                }`}
                href={`?page=${p}`}
              >
                {p}
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}
