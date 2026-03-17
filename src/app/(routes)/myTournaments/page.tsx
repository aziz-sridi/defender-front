import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { Trophy, Calendar, Users, Plus } from 'lucide-react'

import Typo from '@/components/ui/Typo'
import { authOptions } from '@/lib/api/auth'
import {
  getTournamentsByOrganizerIdPaginated,
  getTournamentsByUserParticipationPaginated,
} from '@/services/tournamentService'
import type { User } from '@/types/userType'
import ServerTournamentCard from '@/components/ui/ServerTournamentCard'

export const dynamic = 'force-dynamic'

type BasicTournament = {
  _id: string
  name: string
  description?: string
  startDate?: string
  participants?: unknown[]
  maxParticipants?: number
  coverImage?: string
}

const isBasicTournament = (x: unknown): x is BasicTournament => {
  if (!x || typeof x !== 'object') return false
  const obj = x as Record<string, unknown>
  return typeof obj._id === 'string' && typeof obj.name === 'string'
}

const normalizeTournaments = (d: unknown): BasicTournament[] => {
  if (Array.isArray(d)) return d.filter(isBasicTournament)
  if (d && typeof d === 'object') {
    const obj = d as Record<string, unknown>
    const t = obj.tournaments
    if (Array.isArray(t)) return t.filter(isBasicTournament)
  }
  return []
}

const MyTournamentsSSRPage = async (props: {
  searchParams?: Promise<{ page?: string; limit?: string; view?: 'organized' | 'joined' }>
}) => {
  const session = await getServerSession(authOptions)
  const user = session?.user as User | undefined
  const userId = user?._id || ''

  type SearchParams = { page?: string; limit?: string; view?: 'organized' | 'joined' }
  const sp = ((await props.searchParams) ?? {}) as SearchParams
  const page = Number(sp.page || '1') || 1
  const limit = Number(sp.limit || '12') || 12
  const view = (sp.view || 'organized') as 'organized' | 'joined'

  let tournaments: BasicTournament[] = []
  let error: string | null = null
  let totalPages = 1

  try {
    if (!userId) throw new Error('No user found in session')
    const res =
      view === 'joined'
        ? await getTournamentsByUserParticipationPaginated(userId, page, limit)
        : await getTournamentsByOrganizerIdPaginated(userId, page, limit)
    tournaments = normalizeTournaments(res?.items)
    totalPages = res?.totalPages || 1
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load tournaments'
  }

  const totalTournaments = tournaments.length
  const upcomingCount = tournaments.filter(
    t => t.startDate && new Date(t.startDate) > new Date(),
  ).length
  const ongoingCount = tournaments.filter(
    t => t.startDate && new Date(t.startDate) <= new Date(),
  ).length

  const statCards = [
    {
      label: view === 'organized' ? 'Created' : 'Joined',
      value: totalTournaments,
      icon: Trophy,
      accent: 'from-[#D62555]/20 to-[#D62555]/5',
      iconColor: 'text-[#D62555]',
      iconBg: 'bg-[#D62555]/15',
    },
    {
      label: 'Upcoming',
      value: upcomingCount,
      icon: Calendar,
      accent: 'from-green-500/20 to-green-500/5',
      iconColor: 'text-green-400',
      iconBg: 'bg-green-500/15',
    },
    {
      label: 'Ongoing',
      value: ongoingCount,
      icon: Users,
      accent: 'from-blue-500/20 to-blue-500/5',
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500/15',
    },
  ]

  return (
    <div className="min-h-screen bg-[#161616] text-white">
      <div className="max-w-[1400px] mx-auto p-4 sm:p-6 md:p-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#D62555] to-red-700 rounded-xl flex items-center justify-center shadow-lg shadow-[#D62555]/20">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div>
              <Typo as="h1" fontFamily="poppins" fontVariant="h1" className="font-bold">
                My Tournaments
              </Typo>
              <Typo as="p" color="ghostGrey" fontFamily="poppins" fontVariant="p4">
                Manage and track your esports journey
              </Typo>
            </div>
          </div>
          {/* Desktop: inline button */}
          <Link
            href="/tournament"
            className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-[#D62555] hover:bg-[#b81f47] text-white text-sm font-semibold rounded-xl transition-colors duration-200 shrink-0"
          >
            <Plus className="w-4 h-4" />
            New Tournament
          </Link>
        </div>

        {/* Mobile: floating action button */}
        <Link
          href="/tournament"
          className="sm:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#D62555] hover:bg-[#b81f47] text-white rounded-full flex items-center justify-center shadow-xl shadow-[#D62555]/40 transition-all duration-200 active:scale-95"
        >
          <Plus className="w-6 h-6" />
        </Link>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {statCards.map(({ label, value, icon: Icon, accent, iconColor, iconBg }) => (
            <div
              key={label}
              className={`relative overflow-hidden bg-gradient-to-br ${accent} rounded-2xl border border-white/[0.08] p-5`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-11 h-11 ${iconBg} rounded-xl flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 ${iconColor}`} />
                </div>
                <div>
                  <p className="text-2xl font-black text-white">{value}</p>
                  <p className="text-xs text-gray-400 font-medium">{label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View toggle + count */}
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div className="flex gap-1 bg-[#2c3036] p-1 rounded-xl">
            {(['organized', 'joined'] as const).map(v => (
              <a
                key={v}
                href={`/myTournaments?view=${v}&page=1&limit=${limit}`}
                className={`px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-all duration-200 ${
                  view === v
                    ? 'bg-[#D62555] text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {v}
              </a>
            ))}
          </div>
          <Typo as="p" color="ghostGrey" fontFamily="poppins" fontVariant="p5">
            {tournaments.length} tournament{tournaments.length !== 1 ? 's' : ''} on this page
          </Typo>
        </div>

        {/* Content */}
        {error ? (
          <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <Typo as="p" fontFamily="poppins" fontVariant="p4" className="text-red-400">
              {error}
            </Typo>
          </div>
        ) : tournaments.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-[#2c3036] rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Trophy className="w-10 h-10 text-gray-500" />
            </div>
            <Typo
              as="h3"
              color="white"
              fontFamily="poppins"
              fontVariant="h4"
              className="mb-2 font-bold"
            >
              No Tournaments Yet
            </Typo>
            <Typo as="p" color="ghostGrey" fontFamily="poppins" fontVariant="p4" className="mb-6">
              {view === 'joined'
                ? "You haven't joined any tournaments yet."
                : 'Create your first tournament and start competing!'}
            </Typo>
            {view === 'organized' && (
              <Link
                href="/tournament"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#D62555] hover:bg-[#b81f47] text-white font-semibold rounded-xl transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                Create Tournament
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
              {tournaments.map(t => (
                <ServerTournamentCard key={t._id} tournament={t} view={view} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-1.5">
                {page > 1 && (
                  <a
                    className="px-4 py-2 rounded-lg bg-[#2c3036] text-gray-300 hover:bg-[#383d42] text-sm font-medium transition-all"
                    href={`/myTournaments?view=${view}&page=${page - 1}&limit=${limit}`}
                  >
                    ← Prev
                  </a>
                )}
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                    <a
                      key={pageNum}
                      href={`/myTournaments?view=${view}&page=${pageNum}&limit=${limit}`}
                      className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-semibold transition-all ${
                        pageNum === page
                          ? 'bg-[#D62555] text-white shadow-md shadow-[#D62555]/30'
                          : 'bg-[#2c3036] text-gray-400 hover:text-white hover:bg-[#383d42]'
                      }`}
                    >
                      {pageNum}
                    </a>
                  ))}
                </div>
                {page < totalPages && (
                  <a
                    className="px-4 py-2 rounded-lg bg-[#2c3036] text-gray-300 hover:bg-[#383d42] text-sm font-medium transition-all"
                    href={`/myTournaments?view=${view}&page=${page + 1}&limit=${limit}`}
                  >
                    Next →
                  </a>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default MyTournamentsSSRPage
