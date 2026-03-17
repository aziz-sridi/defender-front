'use client'
import { Switch } from '@/components/ui/switch'
import { BadgeAlert, Check, ChevronDown, X } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import {
  getParticipantStatus,
  updatePlayerTypeInParticipant,
  deletePlayerFromParticipant,
  changeParticipantStatus,
  PlayerType,
} from '@/services/joinTournamentService'
import { InviteStatus } from '@/types/participantType'
import { initSocket, getSocket } from '@/lib/socket'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

// Player row interface
export interface PlayerEntry {
  id: string
  fullname: string
  nickname: string
  profileImage?: string
  status: InviteStatus
  isMainPlayer: boolean
  isSubstitute: boolean
}

const PlayerTeamStatus = ({
  participantId,
  teamMembers = 5,
  substitutes = 2,
  onJoinSuccess,
}: {
  participantId: string
  teamMembers?: number
  substitutes?: number
  onJoinSuccess?: () => void
}) => {
  const { data: session } = useSession()
  const [players, setPlayers] = useState<PlayerEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isJoining, setIsJoining] = useState(false)

  const fetchParticipantData = useCallback(
    async (showLoading = true) => {
      if (!participantId) {
        setLoading(false)
        return
      }

      try {
        if (showLoading) setLoading(true)
        const response = await getParticipantStatus(participantId)
        setPlayers(
          response.participant.invitedMembers.map((member: any) => ({
            id: member.user._id,
            fullname: member.user.fullname || 'Unknown',
            nickname: member.user.nickname || 'Unknown',
            profileImage: member.user.profileImage,
            status: member.status,
            isMainPlayer: member.playerType === 'MAIN',
            isSubstitute: member.playerType === 'SUBSTITUTE',
          })),
        )
        setError(null)
      } catch (err) {
        console.error('Failed to fetch participant status:', err)
        setError(err instanceof Error ? err.message : 'Failed to load participant data')
      } finally {
        if (showLoading) setLoading(false)
      }
    },
    [participantId],
  )

  useEffect(() => {
    fetchParticipantData(true)
  }, [fetchParticipantData])

  useEffect(() => {
    if (!session?.user?._id || !participantId) {
      return
    }

    let isMounted = true
    const socket = initSocket(session.user._id)

    const handleInvitesStatusUpdate = async () => {
      if (!isMounted) return
      await fetchParticipantData(false)
    }

    const handleConnect = async () => {
      if (!isMounted) return
      await fetchParticipantData(false)
    }

    socket.on('update-invites-status', handleInvitesStatusUpdate)
    socket.on('connect', handleConnect)

    return () => {
      isMounted = false
      const s = getSocket()
      s?.off('update-invites-status', handleInvitesStatusUpdate)
      s?.off('connect', handleConnect)
    }
  }, [session?.user?._id, participantId, fetchParticipantData])

  const getStatusBadgeStyle = (status: InviteStatus) => {
    switch (status) {
      case 'ACCEPTED':
        return 'bg-green-900 border-green-400 text-green-400'
      case 'REJECTED':
        return 'bg-red-900 border-red-400 text-red-400'
      case 'CONFIRMATION_NOT_COMPLETED':
        return 'bg-amber-900 border-amber-400 text-amber-400'
      case 'PENDING':
        return 'bg-orange-900 border-orange-400 text-orange-400'
    }
  }

  const handlePlayerTypeSwitch = async (playerId: string, newPlayerType: PlayerType) => {
    try {
      // Optimistic update
      setPlayers(prevPlayers =>
        prevPlayers.map(player =>
          player.id === playerId
            ? {
                ...player,
                isMainPlayer: newPlayerType === 'MAIN',
                isSubstitute: newPlayerType === 'SUBSTITUTE',
              }
            : player,
        ),
      )

      // API call
      await updatePlayerTypeInParticipant(participantId, playerId, newPlayerType)
    } catch (err) {
      console.error('Failed to update player type:', err)
      toast.error(err instanceof Error ? err.message : 'Failed to update player type')
      // Revert on error - refetch data
      await fetchParticipantData(false)
    }
  }

  const handleDeletePlayer = async (playerId: string) => {
    try {
      // Optimistic update

      // API call
      await deletePlayerFromParticipant(participantId, playerId)
      setPlayers(prevPlayers => prevPlayers.filter(player => player.id !== playerId))
    } catch (err) {
      console.error('Failed to delete player:', err)
    }
  }
  const handleJoinNow = async () => {
    if (!participantId || isJoining) return
    try {
      setIsJoining(true)
      await changeParticipantStatus(participantId, 'Registered')
      toast.success('Participant status updated to Registered')
      if (onJoinSuccess) {
        onJoinSuccess()
      }
    } catch (err) {
      console.error('Failed to update participant status:', err)
      toast.error(err instanceof Error ? err.message : 'Failed to update participant status')
    } finally {
      setIsJoining(false)
    }
  }
  const acceptedMainCount = players.filter(p => p.isMainPlayer && p.status === 'ACCEPTED').length
  const acceptedSubCount = players.filter(p => p.isSubstitute && p.status === 'ACCEPTED').length
  const canJoinNow = acceptedMainCount === teamMembers && acceptedSubCount === substitutes
  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full pb-8">
      <h5 className="text-3xl leading-12 font-bold">Select Team Players</h5>
      <p className="text-sm text-defendrGhostGrey mb-12 text-center">
        You must choose {teamMembers} main players, and up to <br />
        {substitutes} substitutes if you want.
      </p>

      {loading && <p className="text-center text-defendrGhostGrey">Loading participant data...</p>}

      {error && <p className="text-center text-defendrRed">{error}</p>}

      {!loading && !error && players.length === 0 && (
        <p className="text-center text-defendrGhostGrey">No participants yet</p>
      )}

      {!loading && !error && players.length > 0 && (
        <>
          <div className="w-full overflow-x-auto mb-12 px-4">
            <table className="table-auto w-full">
              <thead>
                <tr className="[&_th]:font-semibold [&_th]:p-4 [&_th]:border-r [&_th]:border-zinc-600 [&_th]:whitespace-nowrap">
                  <th>Players</th>
                  <th>Status</th>
                  <th>Main Players</th>
                  <th>Substitutes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {players.map(player => (
                  <tr
                    key={player.id}
                    className="[&_td]:p-2 [&_td]:border-r [&_td]:border-zinc-600 [&_td]:whitespace-nowrap"
                  >
                    <td className="flex items-center justify-start gap-2">
                      <Image
                        src={player.profileImage || '/assets/default-user-icon.jpg'}
                        alt={player.id}
                        width={40}
                        height={40}
                        className="rounded-full size-12 aspect-square border-2 shrink-0"
                      />
                      <div className="whitespace-nowrap">
                        <p>{player.fullname || 'Unknown'}</p>
                        <p className="text-sm text-gray-500">@{player.nickname || 'Unknown'}</p>
                      </div>
                    </td>
                    <td className="">
                      <span
                        className={`border-2 rounded-xl px-4 py-1 font-medium text-sm flex items-center justify-center gap-2 w-fit mx-auto lowercase whitespace-nowrap ${getStatusBadgeStyle(player.status)}`}
                      >
                        <Check size={12} />
                        {player.status.split('_').join(' ')}
                        {player.status === 'ACCEPTED' && <ChevronDown size={14} />}
                        {player.status === 'REJECTED' && <X size={14} />}
                        {(player.status === 'CONFIRMATION_NOT_COMPLETED' ||
                          player.status === 'PENDING') && <BadgeAlert size={14} />}
                      </span>
                    </td>
                    <td className="text-center">
                      <Switch
                        checked={player.isMainPlayer}
                        onCheckedChange={checked => {
                          if (checked) {
                            handlePlayerTypeSwitch(player.id, 'MAIN')
                          }
                        }}
                      />
                    </td>
                    <td className="text-center">
                      <Switch
                        checked={player.isSubstitute}
                        onCheckedChange={checked => {
                          if (checked) {
                            handlePlayerTypeSwitch(player.id, 'SUBSTITUTE')
                          }
                        }}
                      />
                    </td>
                    <td className="text-center">
                      <button
                        type="button"
                        onClick={() => handleDeletePlayer(player.id)}
                        className="px-2 py-1 rounded-md bg-red-900 border border-red-500 text-red-500 text-sm cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="w-full px-4">
            <p className="text-sm text-defendrRed flex items-center justify-center gap-4 flex-wrap">
              <span>
                <span className="text-white">{acceptedMainCount}</span>/{teamMembers} Main player
                accepted
              </span>
              <span>
                <span className="text-white">{acceptedSubCount}</span>/{substitutes} Substitute
                accepted
              </span>
            </p>
            <button
              type="button"
              className="px-6 py-2 rounded-xl bg-defendrRed w-full mt-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!canJoinNow || isJoining}
              onClick={handleJoinNow}
            >
              {isJoining ? 'Joining...' : 'Join Now'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default PlayerTeamStatus
