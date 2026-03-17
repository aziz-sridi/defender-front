'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { toast } from 'sonner'

import Button from '@/components/ui/Button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { getAllTeams, getTeamById } from '@/services/teamService'
import { getUserById } from '@/services/userService'
import PlayerSelectModal from '@/components/tournament/PlayerSelectModal'
import { Tournament } from '@/types/tournamentType'
import type { User } from '@/types/userType'
import { getErrorMessage } from '@/utils/errorHandler'

interface PlayerDisplay {
  _id: string
  name: string
  avatarUrl?: string
  role?: string
  user?: User
}

interface TeamSelectModalProps {
  open: boolean
  tournament: Tournament
  userId: string
  onClose: () => void
  onTeamSelected: (
    teamId: string,
    selectedPlayerIds?: string[],
    substituteMemberIds?: string[],
  ) => void
}

const TeamSelectModal = ({
  open,
  tournament,
  userId,
  onClose,
  onTeamSelected,
}: TeamSelectModalProps) => {
  const { data: session } = useSession()
  const [teams, setTeams] = useState<Array<{ _id: string; name: string }>>([])
  const [playerModalOpen, setPlayerModalOpen] = useState(false)
  const [playerModalPlayers, setPlayerModalPlayers] = useState<PlayerDisplay[]>([])
  const [playerModalMax, setPlayerModalMax] = useState<number>(5)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [focusedIdx, setFocusedIdx] = useState<number>(-1)
  const [currentTeamId, setCurrentTeamId] = useState<string | null>(null)

  type RawMember = string | { userId?: string; user?: string | { _id?: string }; _id?: string }
  type RawTeam = {
    _id?: string
    id?: string
    name?: string
    owner?: string | { _id?: string }
    ownerId?: string
    members?: RawMember[]
  }

  type WithGame = { game?: string | { _id?: string }; gameId?: string }
  const getGameId = useCallback((obj: WithGame): string | undefined => {
    if (typeof obj?.game === 'string') return obj.game
    if (obj?.game && typeof obj.game === 'object' && obj.game._id) return obj.game._id
    if (obj?.gameId) return obj.gameId
    return undefined
  }, [])

  const tournamentGameId = getGameId(tournament)

  type SessionTeam =
    | string
    | {
        _id?: string
        id?: string
        name?: string
        game?: string | { _id?: string }
        gameId?: string
      }

  const getSessionTeams = useCallback((): SessionTeam[] => {
    const sUser = session?.user as unknown as { teams?: unknown }
    const sTeams = sUser?.teams
    return Array.isArray(sTeams) ? (sTeams as SessionTeam[]) : []
  }, [session?.user])

  const loadFromSession = useCallback(async (): Promise<Array<{ _id: string; name: string }>> => {
    const sTeams = getSessionTeams()
    if (sTeams.length === 0) return []

    const known: Array<{ _id: string; name: string; gameId?: string }> = []
    const unknownIds: string[] = []

    for (const entry of sTeams) {
      const id = typeof entry === 'string' ? entry : entry?._id || entry?.id || ''
      if (!id) continue
      const name = typeof entry === 'string' ? '' : entry?.name || ''
      const gId = typeof entry === 'string' ? undefined : getGameId(entry)
      if (gId) {
        known.push({ _id: id, name, gameId: gId })
      } else {
        unknownIds.push(id)
      }
    }

    const fetched: Array<{ _id: string; name: string; gameId?: string }> = []
    if (unknownIds.length > 0) {
      try {
        const results = await Promise.all(
          unknownIds.map(async id => {
            try {
              const data = await getTeamById(id)
              const pick = (obj: unknown) => {
                if (obj && typeof obj === 'object') {
                  const rec = obj as Record<string, unknown>
                  return (rec.team as unknown) ?? obj
                }
                return obj
              }
              const raw = pick(data)
              const readString = (v: unknown): string | undefined =>
                typeof v === 'string' ? v : undefined
              const readId = (o: unknown): string | undefined => {
                if (o && typeof o === 'object') {
                  const r = o as Record<string, unknown>
                  return readString(r._id) ?? readString(r.id)
                }
                return undefined
              }
              const readName = (o: unknown): string | undefined => {
                if (o && typeof o === 'object') {
                  const r = o as Record<string, unknown>
                  return typeof r.name === 'string' ? (r.name as string) : undefined
                }
                return undefined
              }
              const objId = readId(raw) || id
              const objName = readName(raw) || 'Unnamed Team'
              const gId = getGameId(raw as WithGame)
              return { _id: objId, name: objName, gameId: gId }
            } catch {
              return { _id: id, name: 'Unnamed Team' }
            }
          }),
        )
        fetched.push(...results)
      } catch {}
    }

    const all = [...known, ...fetched]
    const filtered = tournamentGameId ? all.filter(t => t.gameId === tournamentGameId) : all

    const byId = new Map<string, string>()
    for (const t of filtered) {
      if (t._id && !byId.has(t._id)) {
        byId.set(t._id, t.name || 'Unnamed Team')
      }
    }
    return Array.from(byId.entries()).map(([id, name]) => ({ _id: id, name }))
  }, [getSessionTeams, getGameId, tournamentGameId])

  useEffect(() => {
    if (!open) return

    const loadTeams = async () => {
      setLoading(true)
      try {
        const sessionTeams = await loadFromSession()
        if (sessionTeams.length > 0) {
          setTeams(sessionTeams)
          setSelectedId(null)
          setFocusedIdx(-1)
          return
        }

        const allTeams = tournamentGameId
          ? await getAllTeams(tournamentGameId)
          : await getAllTeams()
        const list = Array.isArray(allTeams) ? (allTeams as RawTeam[]) : []
        const myTeams = list.filter(t => {
          const isOwner =
            t?.owner === userId ||
            t?.ownerId === userId ||
            (typeof t?.owner === 'object' && t?.owner?._id === userId)
          const isMember =
            Array.isArray(t?.members) &&
            t.members.some((m: RawMember) => {
              if (typeof m === 'string') return m === userId
              return (
                m?.userId === userId ||
                m?.user === userId ||
                m?._id === userId ||
                (typeof m?.user === 'object' && (m.user as { _id?: string })?._id === userId)
              )
            })
          return isOwner || isMember
        })
        const mapped = myTeams
          .map(t => ({ _id: t._id ?? t.id ?? '', name: t.name || 'Unnamed Team' }))
          .filter(t => t._id)
        setTeams(mapped)
        setSelectedId(null)
        setFocusedIdx(-1)
      } catch (error) {
        toast.error(getErrorMessage(error, 'Failed to load teams'))
      } finally {
        setLoading(false)
      }
    }

    loadTeams()
  }, [open, tournamentGameId, userId, loadFromSession])

  const filteredTeams = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) {
      return teams
    }
    return teams.filter(t => (t.name || '').toLowerCase().includes(q))
  }, [teams, search])

  useEffect(() => {
    if (selectedId && !filteredTeams.some(t => t._id === selectedId)) {
      setSelectedId(filteredTeams[0]?._id ?? null)
      setFocusedIdx(filteredTeams.length > 0 ? 0 : -1)
    }
  }, [filteredTeams, selectedId])

  const resetAndClose = () => {
    setSearch('')
    setSelectedId(null)
    setFocusedIdx(-1)
    onClose()
  }

  const handleTeamSelected = async (teamId: string) => {
    try {
      const team = await getTeamById(teamId)
      const players: PlayerDisplay[] = []

      const getDisplayName = (userObj: unknown, fallback = 'Owner'): string => {
        if (typeof userObj === 'object' && userObj !== null) {
          const u = userObj as Record<string, unknown>
          return (u.fullname || u.nickname || u.name || fallback) as string
        }
        return fallback
      }

      const fetchUserIfNeeded = async (userField: unknown): Promise<User | undefined> => {
        if (typeof userField === 'object' && userField !== null) {
          return userField as User
        }

        if (typeof userField === 'string') {
          try {
            const userData = await getUserById(userField)
            return userData as User
          } catch {
            return undefined
          }
        }

        return undefined
      }

      if (Array.isArray(team.teamowner)) {
        for (const owner of team.teamowner) {
          const userObj = await fetchUserIfNeeded(owner.user)
          const userId =
            typeof owner.user === 'string' ? owner.user : (userObj?._id as string) || ''

          players.push({
            _id: userId,
            name: getDisplayName(userObj, 'Owner'),
            avatarUrl: (userObj?.profileImage as string) || team.profileImage || '',
            role: 'Manager',
            user: userObj,
          })
        }
      }
      if (Array.isArray(team.teamroster)) {
        for (const member of team.teamroster) {
          const userObj = await fetchUserIfNeeded(member.user)
          const userId =
            typeof member.user === 'string' ? member.user : (userObj?._id as string) || ''

          players.push({
            _id: userId,
            name: getDisplayName(userObj, 'Player'),
            avatarUrl: (userObj?.profileImage as string) || team.profileImage || '',
            role: member.role === 'member' ? undefined : member.role,
            user: userObj,
          })
        }
      }

      if (
        players.length === 0 &&
        team.teamowner &&
        Array.isArray(team.teamowner) &&
        team.teamowner.length > 0
      ) {
        for (const owner of team.teamowner) {
          const userObj = await fetchUserIfNeeded(owner.user)
          const userId =
            typeof owner.user === 'string' ? owner.user : (userObj?._id as string) || ''

          players.push({
            _id: userId,
            name: getDisplayName(userObj, 'Owner'),
            avatarUrl: (userObj?.profileImage as string) || team.profileImage || '',
            role: 'Manager',
            user: userObj,
          })
        }
      }

      setPlayerModalPlayers(players)
      setPlayerModalMax(tournament?.gameSettings?.teamSize || 5)
      setCurrentTeamId(teamId)
      setPlayerModalOpen(true)
    } catch {
      toast.error('Failed to load team players')
    }
  }

  const handlePlayersSelected = (selectedPlayers: PlayerDisplay[]) => {
    setPlayerModalOpen(false)
    if (currentTeamId && selectedPlayers) {
      // If called with the new object format
      if ('teamMembers' in selectedPlayers && 'substituteMembers' in selectedPlayers) {
        const { teamMembers, substituteMembers } = selectedPlayers as any
        onTeamSelected(currentTeamId, teamMembers, substituteMembers)
      } else {
        // Fallback for old usage
        const playerIds = Array.isArray(selectedPlayers)
          ? selectedPlayers.map((p: any) => p._id)
          : []
        onTeamSelected(currentTeamId, playerIds)
      }
    }
  }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={isOpen => {
          if (!isOpen) resetAndClose()
        }}
      >
        <DialogContent className="bg-[#23272b] text-white border-neutral-700 p-0 shadow-2xl max-w-[520px] w-[95vw]">
          <DialogHeader className="px-6 pt-5 pb-0">
            <DialogTitle className="text-[20px] font-poppins">Select Team</DialogTitle>
          </DialogHeader>

          <div className="p-6 pt-4">
            {loading ? (
              <div className="text-center text-white py-6">Loading teams...</div>
            ) : teams.length > 0 ? (
              <>
                <p className="font-poppins text-white mb-4">
                  Select a team to join this tournament with:
                </p>

                <div className="mb-4">
                  <input
                    className="w-full rounded-xl bg-white bg-opacity-10 text-white placeholder:text-gray-400 text-base px-4 py-3 outline-none"
                    placeholder="Search teams..."
                    value={search}
                    onChange={e => {
                      setSearch(e.target.value)
                      setFocusedIdx(0)
                    }}
                    onKeyDown={e => {
                      if (e.key === 'ArrowDown') {
                        e.preventDefault()
                        setFocusedIdx(i => Math.min((i < 0 ? -1 : i) + 1, filteredTeams.length - 1))
                        const id =
                          filteredTeams[
                            Math.min(
                              (focusedIdx < 0 ? -1 : focusedIdx) + 1,
                              filteredTeams.length - 1,
                            )
                          ]?._id
                        if (id) setSelectedId(id)
                      } else if (e.key === 'ArrowUp') {
                        e.preventDefault()
                        setFocusedIdx(i => Math.max(i - 1, 0))
                        const id = filteredTeams[Math.max(focusedIdx - 1, 0)]?._id
                        if (id) setSelectedId(id)
                      } else if (e.key === 'Enter' && selectedId) {
                        handleTeamSelected(selectedId)
                      }
                    }}
                    autoFocus
                  />
                </div>

                <div className="space-y-2 max-h-[300px] overflow-auto">
                  {filteredTeams.length > 0 ? (
                    filteredTeams.map((team, idx) => {
                      const active = selectedId === team._id
                      const focused = idx === focusedIdx
                      return (
                        <button
                          key={team._id}
                          className={`w-full py-3 px-4 rounded-lg text-left transition-colors ${
                            active || focused ? 'bg-[#e23a63]' : 'bg-[#3a3c40] hover:bg-opacity-80'
                          }`}
                          type="button"
                          onClick={() => {
                            setSelectedId(team._id)
                            setFocusedIdx(idx)
                          }}
                          onDoubleClick={() => handleTeamSelected(team._id)}
                        >
                          {team.name}
                        </button>
                      )
                    })
                  ) : (
                    <div className="text-center text-gray-400 py-6">
                      No teams match your search.
                    </div>
                  )}
                </div>

                <div className="flex justify-between pt-5">
                  <Button
                    label="Cancel"
                    variant="black"
                    size="xxs"
                    className="!w-auto !h-auto px-4 py-2"
                    onClick={resetAndClose}
                  />
                  <Button
                    label="Continue"
                    variant="contained-red"
                    size="xxs"
                    className="!w-auto !h-auto px-4 py-2"
                    disabled={!selectedId}
                    onClick={() => selectedId && handleTeamSelected(selectedId)}
                  />
                </div>
              </>
            ) : (
              <div className="text-center">
                <p className="text-white mb-4">
                  You don't have any teams eligible for this tournament.
                </p>
                <p className="text-gray-400 mb-6">
                  {tournamentGameId ? (
                    <>This tournament requires a team that plays this game.</>
                  ) : (
                    <>Create a team first to join this tournament.</>
                  )}
                </p>
                <div className="flex justify-center">
                  <Link href="/team/create">
                    <Button
                      label="Create Team"
                      variant="contained-red"
                      size="xxs"
                      className="!w-auto !h-auto px-4 py-2"
                    />
                  </Link>
                </div>
                <div className="flex justify-center mt-4">
                  <Button
                    label="Close"
                    variant="black"
                    size="xxs"
                    className="!w-auto !h-auto px-4 py-2"
                    onClick={resetAndClose}
                  />
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <PlayerSelectModal
        gameId={tournament.game?._id}
        joinProcess={tournament.joinProcess}
        maxPlayers={playerModalMax}
        open={playerModalOpen}
        players={playerModalPlayers}
        onClose={() => setPlayerModalOpen(false)}
        onJoin={handlePlayersSelected}
      />
    </>
  )
}

export default TeamSelectModal
