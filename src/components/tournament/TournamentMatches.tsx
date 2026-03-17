'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import { getBracketByTournamentId, getBracketById } from '@/services/bracketService'
import { getMatchesByRound, getMatchById } from '@/services/matchService'
import { getParticipantById } from '@/services/participantService'
import { getTeamById } from '@/services/teamService'
import { getUserById } from '@/services/userService'
import { formatDate } from '@/utils/FormatDate'
import { getTournamentById } from '@/services/tournamentService'
import { getRoundById } from '@/services/roundService'
import { Tournament } from '@/types/tournamentType'
import { imageUrlSanitizer } from '@/utils/imageUrlSanitizer'

interface Props {
  tournament: Tournament
}

interface DatabaseRound {
  _id: string
  bracket: string
  number: number
  matches: string[]
  status: string
  sets: number
  isFinal: boolean
}

interface Player {
  id?: string
  name?: string
  nickname?: string
  avatar?: string
  score?: number
}

interface MatchItem {
  _id: string
  status?: string
  date?: string
  player1?: Player
  player2?: Player
}

const TournamentMatches: React.FC<Props> = ({ tournament }) => {
  const { data: session } = useSession()
  const router = useRouter()
  const [rounds, setRounds] = useState<DatabaseRound[]>([])
  const [activeRoundId, setActiveRoundId] = useState<string>('')
  const [matches, setMatches] = useState<MatchItem[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Extract current user id & teams (owners) from session
  const currentUserId = useMemo(() => {
    const raw = session?.user as unknown as { _id?: string; id?: string }
    return raw?._id || raw?.id || undefined
  }, [session?.user])

  type SessionTeam =
    | string
    | {
        _id?: string
        id?: string
        owner?: string | { _id?: string; id?: string }
        ownerId?: string
        members?: unknown[]
      }

  const sessionTeams: SessionTeam[] = useMemo(() => {
    const raw = (session?.user as unknown as { teams?: unknown })?.teams
    return Array.isArray(raw) ? (raw as SessionTeam[]) : []
  }, [session?.user])

  const ownedOrMemberTeamIds = useMemo(() => {
    const ids: string[] = []
    sessionTeams.forEach(t => {
      if (typeof t === 'string') {
        ids.push(t)
      } else if (t) {
        const id = t._id || t.id
        if (id) {
          ids.push(id)
        }
      }
    })
    return ids
  }, [sessionTeams])

  // Helper to know if current user is participant in a match (either user id or team id)
  const isUserInMatch = (m: MatchItem): boolean => {
    if (!m) {
      return false
    }
    const p1Id = m.player1?.id
    const p2Id = m.player2?.id
    if (currentUserId && (p1Id === currentUserId || p2Id === currentUserId)) {
      return true
    }
    if (p1Id && ownedOrMemberTeamIds.includes(p1Id)) {
      return true
    }
    if (p2Id && ownedOrMemberTeamIds.includes(p2Id)) {
      return true
    }
    return false
  }

  const hasTournamentId = Boolean(tournament?._id)

  const humanRoundName = useMemo(() => {
    if (!rounds.length || !activeRoundId) {
      return ''
    }
    const total = rounds.length
    const round = rounds.find(r => r._id === activeRoundId)
    if (!round) {
      return ''
    }
    if (total === 1 || round.isFinal || round.number === total) {
      return 'Finals'
    }
    if (round.number === total - 1) {
      return 'Semi Finals'
    }
    if (round.number === total - 2) {
      return 'Quarter Finals'
    }
    return `Round ${round.number}`
  }, [rounds, activeRoundId])

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const tournamentId = tournament._id
        if (!tournamentId) {
          throw new Error('No tournament id provided')
        }

        // Try winners bracket by default
        let bracketId: string | null = null
        let chosenBracket: Record<string, unknown> | null = null
        try {
          const resp = await getBracketByTournamentId(tournamentId)
          if (resp?.brackets?.length) {
            const winners = (resp.brackets as unknown[]).find((b: unknown) => {
              if (typeof b === 'object' && b) {
                const obj = b as Record<string, unknown>
                const type = (obj.type as string | undefined) || ''
                return type.toLowerCase().includes('winner')
              }
              return false
            })
            let chosen: Record<string, unknown>
            if (winners) {
              chosen = winners as Record<string, unknown>
            } else {
              chosen = resp.brackets[0] as Record<string, unknown>
            }
            bracketId = (chosen._id as string) || null
            chosenBracket = chosen || null
          }
        } catch {
          // ignore and fallback
        }

        if (!bracketId && (tournament.bracket || tournament.looserBracket)) {
          // Fallback to winners first
          bracketId = (tournament.bracket as string) || (tournament.looserBracket as string) || ''
        }

        if (!bracketId) {
          // Final fallback: fetch tournament fully
          const t = await getTournamentById(tournamentId)
          bracketId = (t?.bracket as string) || (t?.looserBracket as string) || ''
        }

        if (!bracketId) {
          throw new Error('No bracket found for this tournament')
        }

        // Resolve rounds either from chosen bracket (if available) or by fetching the bracket by id
        let roundEntries: unknown[] | null = null
        if (chosenBracket && Array.isArray(chosenBracket.rounds)) {
          roundEntries = chosenBracket.rounds as unknown[]
        }
        if (!roundEntries) {
          const bracketResp = await getBracketById(bracketId)
          const bracketObj = (bracketResp && (bracketResp.bracket || bracketResp)) as Record<
            string,
            unknown
          >
          roundEntries = (bracketObj?.rounds as unknown[]) || []
        }

        // If rounds are objects, cast directly; if they are IDs, fetch individually
        let resolvedRounds: DatabaseRound[] = []
        if (roundEntries && roundEntries.length > 0) {
          if (typeof roundEntries[0] === 'object') {
            resolvedRounds = (roundEntries as DatabaseRound[]).slice()
          } else {
            const ids = roundEntries as string[]
            const fetched: DatabaseRound[] = []
            for (const rid of ids) {
              try {
                const r = await getRoundById(rid)
                if (r) {
                  fetched.push(r as DatabaseRound)
                }
              } catch {
                // ignore single round fetch failure
              }
            }
            resolvedRounds = fetched
          }
        }

        const sorted = resolvedRounds.sort((a, b) => a.number - b.number)
        setRounds(sorted)
        setActiveRoundId(sorted[0]?._id || '')
      } catch (e: unknown) {
        const msg = (e as { message?: string })?.message || 'Failed to load rounds'
        setError(msg)
      } finally {
        setIsLoading(false)
      }
    }

    if (hasTournamentId) {
      load()
    }
  }, [hasTournamentId, tournament?._id, tournament?.bracket, tournament?.looserBracket])

  useEffect(() => {
    const loadMatches = async () => {
      if (!activeRoundId) {
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        // First attempt: direct round endpoint
        let fetched: MatchItem[] = []
        try {
          const list = await getMatchesByRound(activeRoundId)
          if (Array.isArray(list) && list.length > 0) {
            fetched = list as MatchItem[]
          }
        } catch (err) {
          // Capture but don't immediately surface; we'll fallback
          // eslint-disable-next-line no-console
          console.warn('[TournamentMatches] getMatchesByRound failed, will fallback', err)
        }

        // Fallback: fetch round object to enumerate match ids then hydrate individually
        if ((!fetched || fetched.length === 0) && rounds.length) {
          const roundObj = rounds.find(r => r._id === activeRoundId)
          if (roundObj && Array.isArray(roundObj.matches) && roundObj.matches.length > 0) {
            // Some rounds may store match docs instead of ids; normalize to ids
            const ids = roundObj.matches
              .map(m => {
                if (!m) {
                  return null
                }
                if (typeof m === 'string') {
                  return m
                }
                if (typeof m === 'object') {
                  // @ts-expect-error dynamic access acceptable here
                  return m._id || m.id || m.$oid || null
                }
                return null
              })
              .filter((v): v is string => Boolean(v))

            if (ids.length) {
              try {
                const hydrated = await Promise.all(
                  ids.map(async id => {
                    try {
                      const res = await getMatchById(id)
                      return (res?.match || res) as MatchItem
                    } catch (inner) {
                      // eslint-disable-next-line no-console
                      console.warn('[TournamentMatches] Failed to hydrate match', id, inner)
                      return null
                    }
                  }),
                )
                fetched = hydrated.filter(Boolean) as MatchItem[]
              } catch (innerHydrate) {
                // eslint-disable-next-line no-console
                console.warn('[TournamentMatches] Hydration fallback failed', innerHydrate)
              }
            }
          }
        }

        if (!fetched || fetched.length === 0) {
          setMatches([])
          return
        }
        // Transform function mirroring admin matchList mapping (read-only subset)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const toUiMatch = async (raw: any): Promise<MatchItem> => {
          const data = raw?.match || raw
          const participantAId =
            data?.participantA?.$oid || data?.participantA?._id || data?.participantA || null
          const participantBId =
            data?.participantB?.$oid || data?.participantB?._id || data?.participantB || null

          // Resolve names
          const resolveName = async (
            pid: string | null,
            fallbackLabel: string,
          ): Promise<Player | undefined> => {
            if (!pid) {
              return {
                id: 'tbd',
                name: 'TBD',
                avatar: imageUrlSanitizer('', 'user'),
              }
            }
            try {
              const participant = await getParticipantById(pid)
              if (participant?.team) {
                try {
                  const team = await getTeamById(participant.team)
                  return {
                    id: team?._id,
                    name: team?.name,
                    avatar: imageUrlSanitizer(team?.profileImage || team?.coverImage || '', 'team'),
                  }
                } catch {
                  return { id: pid, name: fallbackLabel }
                }
              } else if (participant?.user) {
                const userId = participant.user._id || participant.user.id || participant.user
                try {
                  const user = await getUserById(userId)
                  const name =
                    user?.nickname ||
                    user?.fullname ||
                    user?.username ||
                    user?.name ||
                    (user?.firstName && user?.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : null) ||
                    fallbackLabel

                  return {
                    id: user?._id || user?.id,
                    name,
                    avatar: imageUrlSanitizer(user?.profileImage || user?.avatar || '', 'user'),
                  }
                } catch {
                  return { id: pid, name: fallbackLabel }
                }
              }
              return { id: pid, name: fallbackLabel }
            } catch {
              return { id: pid, name: fallbackLabel }
            }
          }

          const player1 = await resolveName(participantAId, 'Player A')
          const player2 = await resolveName(participantBId, 'Player B')

          // Score extraction similar to admin list
          if (Array.isArray(data?.scores)) {
            data.scores.forEach((s: unknown) => {
              const sc = s as {
                participant?: string | { _id?: string; $oid?: string } | undefined
                score?: number
              }
              const part = sc?.participant
              let sid: string | undefined
              if (part && typeof part === 'object') {
                const obj = part as { _id?: string; $oid?: string }
                sid = obj.$oid || obj._id
              } else if (typeof part === 'string') {
                sid = part
              }
              if (player1?.id && sid === participantAId) {
                player1.score = typeof sc.score === 'number' ? sc.score : 0
              }
              if (player2?.id && sid === participantBId) {
                player2.score = typeof sc.score === 'number' ? sc.score : 0
              }
            })
          }

          let dateStr: string | undefined
          if (data?.createdAt) {
            try {
              dateStr = formatDate(data?.createdAt, { dateStyle: 'medium', timeStyle: 'short' })
            } catch {
              dateStr = data?.createdAt
            }
          }

          return {
            _id: String(data?._id || ''),
            status: data?.status || 'TBD',
            date: dateStr,
            player1,
            player2,
          }
        }

        const transformed = await Promise.all(fetched.map(f => toUiMatch(f)))
        setMatches(transformed)
      } catch (e: unknown) {
        const isApiError = (e as { message?: string }).message
        const detail = isApiError ? `: ${(e as { message?: string }).message}` : ''
        setError(`Failed to load matches for round ${activeRoundId}${detail}`)
      } finally {
        setIsLoading(false)
      }
    }
    loadMatches()
  }, [activeRoundId, rounds])

  if (isLoading && !rounds.length) {
    return <div className="text-defendrGrey font-poppins">Loading rounds…</div>
  }
  if (error) {
    return <div className="text-defendrRed font-poppins">{error}</div>
  }
  if (!rounds.length) {
    return <div className="text-defendrGrey font-poppins">No rounds available.</div>
  }

  return (
    <div className="w-full max-w-[900px] mx-auto text-white flex flex-col items-center px-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 font-poppins text-center">
        Matchup List
      </h1>

      {/* Round Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center w-full">
        {rounds.map((r, index) => {
          const total = rounds.length
          const displayNumber = index + 1
          const getRoundName = (roundNumber: number) => {
            if (total === 1) return 'Finals'
            if (roundNumber === total) return 'Finals'
            if (roundNumber === total - 1) return 'Semi Finals'
            if (roundNumber === total - 2) return 'Quarter Finals'
            return `Round ${roundNumber}`
          }
          return (
            <button
              key={r._id}
              className={`px-3 py-2 md:px-4 md:py-2 rounded-full font-poppins text-xs md:text-sm font-medium transition-all duration-200 ${
                activeRoundId === r._id
                  ? 'bg-defendrRed text-white shadow-lg shadow-defendrRed/30'
                  : 'bg-[#1e2126] text-white border border-white/10 hover:border-white/30'
              }`}
              onClick={() => setActiveRoundId(r._id)}
            >
              {getRoundName(displayNumber)}
            </button>
          )
        })}
      </div>

      {/* Matches */}
      <div className="w-full space-y-4">
        {isLoading ? (
          <div className="text-center text-gray-400 py-16">
            <div className="w-8 h-8 border-2 border-defendrRed border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <span className="font-poppins text-sm">Loading matches...</span>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <span className="text-defendrRed font-poppins text-sm">{error}</span>
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">⚔️</div>
            <span className="text-gray-500 font-poppins text-sm">
              No matches found for this round.
            </span>
          </div>
        ) : (
          matches.map((m, idx) => {
            const canOpen = isUserInMatch(m)
            const handleClick = () => {
              if (canOpen && tournament?._id) {
                router.push(`/tournament/${tournament._id}/matchProfile/${m._id}`)
              }
            }

            // Status color
            const statusColor =
              m.status === 'Completed' || m.status === 'COMPLETED'
                ? 'bg-red-500/20 text-red-400 border-red-500/30'
                : m.status === 'In Progress' || m.status === 'IN_PROGRESS'
                  ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'

            return (
              <div
                key={m._id}
                className={`bg-[#1a1d21] rounded-xl overflow-hidden transition-all duration-200 ${
                  canOpen
                    ? 'hover:bg-[#1f2328] cursor-pointer ring-1 ring-white/5 hover:ring-defendrRed/40'
                    : 'ring-1 ring-white/5 opacity-75'
                }`}
                onClick={canOpen ? handleClick : undefined}
              >
                {/* Top Bar - Round info, status, date */}
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-xs font-poppins font-medium">
                      {humanRoundName}
                    </span>
                    <span
                      className={`text-[10px] font-poppins font-semibold px-2 py-0.5 rounded-full border ${statusColor}`}
                    >
                      {m.status || 'SCHEDULED'}
                    </span>
                  </div>
                  <span className="text-gray-500 text-xs font-poppins">{m.date || '—'}</span>
                </div>

                {/* Match Content */}
                <div className="px-4 py-4 md:py-6">
                  {/* Desktop horizontal layout */}
                  <div className="hidden md:flex items-center justify-between gap-2">
                    {/* Player 1 */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <img
                        src={m.player1?.avatar || imageUrlSanitizer('', 'user')}
                        alt={m.player1?.name || 'Player 1'}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-white/10 flex-shrink-0"
                        onError={e => {
                          const target = e.target as HTMLImageElement
                          target.src = imageUrlSanitizer('', 'user')
                        }}
                      />
                      <p className="text-white font-poppins text-base font-semibold truncate">
                        {m.player1?.name || m.player1?.nickname || 'TBD'}
                      </p>
                    </div>

                    {/* Score + VS */}
                    <div className="flex items-center gap-5 flex-shrink-0 px-4">
                      <span className="text-white font-bold text-2xl font-poppins tabular-nums w-7 text-center">
                        {m.player1?.score ?? 0}
                      </span>
                      <span className="text-gray-500 font-poppins text-xs font-bold tracking-wider">
                        VS
                      </span>
                      <span className="text-white font-bold text-2xl font-poppins tabular-nums w-7 text-center">
                        {m.player2?.score ?? 0}
                      </span>
                    </div>

                    {/* Player 2 */}
                    <div className="flex items-center gap-3 flex-1 min-w-0 justify-end">
                      <p className="text-white font-poppins text-base font-semibold truncate text-right">
                        {m.player2?.name || m.player2?.nickname || 'TBD'}
                      </p>
                      <img
                        src={m.player2?.avatar || imageUrlSanitizer('', 'user')}
                        alt={m.player2?.name || 'Player 2'}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-white/10 flex-shrink-0"
                        onError={e => {
                          const target = e.target as HTMLImageElement
                          target.src = imageUrlSanitizer('', 'user')
                        }}
                      />
                    </div>
                  </div>

                  {/* Mobile stacked layout */}
                  <div className="flex md:hidden flex-col gap-3">
                    {/* Player 1 row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <img
                          src={m.player1?.avatar || imageUrlSanitizer('', 'user')}
                          alt={m.player1?.name || 'Player 1'}
                          className="w-9 h-9 rounded-full object-cover ring-2 ring-white/10 flex-shrink-0"
                          onError={e => {
                            const target = e.target as HTMLImageElement
                            target.src = imageUrlSanitizer('', 'user')
                          }}
                        />
                        <span className="text-white font-poppins text-sm font-semibold">
                          {m.player1?.name || m.player1?.nickname || 'TBD'}
                        </span>
                      </div>
                      <span className="text-white font-bold text-lg font-poppins tabular-nums ml-2">
                        {m.player1?.score ?? 0}
                      </span>
                    </div>

                    {/* VS divider */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-white/5" />
                      <span className="text-gray-500 font-poppins text-[10px] font-bold tracking-widest">
                        VS
                      </span>
                      <div className="flex-1 h-px bg-white/5" />
                    </div>

                    {/* Player 2 row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <img
                          src={m.player2?.avatar || imageUrlSanitizer('', 'user')}
                          alt={m.player2?.name || 'Player 2'}
                          className="w-9 h-9 rounded-full object-cover ring-2 ring-white/10 flex-shrink-0"
                          onError={e => {
                            const target = e.target as HTMLImageElement
                            target.src = imageUrlSanitizer('', 'user')
                          }}
                        />
                        <span className="text-white font-poppins text-sm font-semibold">
                          {m.player2?.name || m.player2?.nickname || 'TBD'}
                        </span>
                      </div>
                      <span className="text-white font-bold text-lg font-poppins tabular-nums ml-2">
                        {m.player2?.score ?? 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom action bar */}
                {canOpen && (
                  <div className="px-4 py-2.5 border-t border-white/5 flex items-center justify-center gap-2">
                    <span className="text-defendrRed text-xs font-poppins font-semibold">
                      Match Details
                    </span>
                    <svg
                      className="w-3.5 h-3.5 text-defendrRed"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default TournamentMatches
