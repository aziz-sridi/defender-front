'use client'
import { joinTournament, requestToJoinAsFreeAgent } from '@/services/joinTournamentService'
import { Team } from '@/types/teamType'
import { Participant } from '@/types/participantType'
import { JoinProcess } from '@/types/tournamentType'
import { BadgeAlert, Check, ChevronRight, Plus } from 'lucide-react'
import Image from 'next/image'
import { Dispatch, SetStateAction, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'

const SelectTeamToJoin = ({
  gameMode,
  tournamentId,
  teams,
  setConfirmedTeamSelected,
  onJoinSuccess,
  joinProcess,
}: {
  gameMode: 'Solo' | 'Team'
  tournamentId: string
  teams: Team[]
  setConfirmedTeamSelected: Dispatch<
    SetStateAction<{ participant: Participant | null; team: Team | null }>
  >
  onJoinSuccess?: (participant?: Participant) => void
  joinProcess: JoinProcess
}) => {
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)
  const [isJoining, setIsJoining] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false)
  const [requestMessage, setRequestMessage] = useState('')
  const [isRequestSubmitting, setIsRequestSubmitting] = useState(false)

  const handleSelectTeamToJoin = async () => {
    if (!selectedTeamId) return
    try {
      setIsJoining(true)
      setError(null)

      const response = await joinTournament(tournamentId, selectedTeamId)
      const participant = response?.participant as Participant | undefined
      const selectedTeam = teams.find(team => team._id === selectedTeamId) || null

      if (!participant || !selectedTeam) {
        setError('Failed to join with the selected team. Please try again.')
        return
      }

      setConfirmedTeamSelected({ participant, team: selectedTeam })
      onJoinSuccess?.(participant)
    } catch (err) {
      console.error('Error joining tournament:', err)
      setError('Unable to join tournament right now. Please try again later.')
    } finally {
      setIsJoining(false)
    }
  }

  const handleSubmitFreeAgentRequest = async () => {
    const trimmedMessage = requestMessage.trim()
    if (trimmedMessage.length < 10) {
      return toast.warning('Please provide a more detailed message (at least 10 characters).')
    }

    try {
      setIsRequestSubmitting(true)
      await requestToJoinAsFreeAgent(tournamentId, trimmedMessage)
      toast.success('Your request has been sent successfully!')
      setRequestMessage('')
      setIsRequestModalOpen(false)
    } catch (err) {
      console.error('Error requesting to join as free agent:', err)
      toast.error(err instanceof Error ? err.message : 'Failed to send request. Please try again.')
    } finally {
      setIsRequestSubmitting(false)
    }
  }
  return (
    <>
      {isRequestModalOpen ? (
        <div className="flex-1 flex flex-col items-center justify-center w-full pb-8">
          <h5 className="text-3xl leading-12 font-bold">Request to Join a Team</h5>
          <p className="text-sm text-defendrGhostGrey mb-12 text-center">
            Leave a Comment so team owners can find and invite you{' '}
          </p>
          <textarea
            className="w-full h-40 resize-none p-2 border rounded-xl mb-4"
            placeholder="I'm a Valorant player. Looking for a team to join this tournament."
            value={requestMessage}
            onChange={e => setRequestMessage(e.target.value)}
          ></textarea>
          <button
            type="button"
            className="px-4 py-2 rounded-xl bg-defendrRed disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 self-end"
            onClick={handleSubmitFreeAgentRequest}
            disabled={isRequestSubmitting || requestMessage.trim().length < 10}
          >
            Send <ChevronRight size={18} />
          </button>
        </div>
      ) : (
        <>
          {teams.length > 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center w-full pb-8">
              <h5 className="text-3xl leading-12 font-bold">Select a team to join</h5>
              <p className="text-sm text-defendrGhostGrey mb-12 text-center">
                Choose your team to start playing
              </p>
              <div className="flex items-center justify-center flex-wrap gap-4 mb-12">
                {teams.map((team, i) => (
                  <div
                    key={i}
                    className="p-4 pt-8 rounded-xl bg-zinc-900 flex items-center justify-center flex-col gap-4 relative cursor-pointer"
                    onClick={() => setSelectedTeamId(team._id)}
                  >
                    <Image
                      src={team.profileImage || team.coverImage || '/assets/default-user-icon.png'}
                      alt={team.name}
                      width={45}
                      height={45}
                      draggable={false}
                      className="size-15 rounded-full aspect-square border-2 border-defendrRed"
                    />
                    <p className="w-30 text-center line-clamp-2">{team.name}</p>
                    <div
                      className={`absolute size-4 rounded-full ${selectedTeamId === team._id ? 'bg-defendrRed border-defendrRed' : 'bg-zinc-500 border'} top-4 right-4 grid place-items-center`}
                    >
                      {selectedTeamId === team._id && <Check size={10} strokeWidth={4} />}
                    </div>
                  </div>
                ))}
                <Link href="/team/create">
                  <div className="p-4 pt-8 rounded-xl bg-zinc-900 flex items-center justify-center flex-col gap-4 relative cursor-pointer">
                    <div className="size-15 rounded-full aspect-square border-2 border-defendrRed text-defendrRed grid place-items-center">
                      <Plus size={35} />
                    </div>
                    <p className="w-30 text-center line-clamp-2">Create Team</p>
                  </div>
                </Link>
              </div>

              <button
                type="button"
                className="px-6 py-2 rounded-xl bg-defendrRed w-120 max-w-full disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!selectedTeamId || isJoining}
                onClick={() => selectedTeamId && handleSelectTeamToJoin()}
              >
                {isJoining ? 'Joining...' : 'Select Now'}
              </button>
              {error && <p className="text-defendrRed mt-4 text-sm">{error}</p>}
            </div>
          ) : (
            <div className="flex-1 h-full flex flex-col items-center justify-center w-full py-24">
              <h5 className="text-3xl leading-12 font-bold flex items-center gap-2">
                <BadgeAlert size={35} className="text-defendrRed" />
                Teams only!
              </h5>
              <p className="text-sm text-defendrGhostGrey text-center">
                This tournament is for teams only. You need to join with a team to
                <br />
                participate.
              </p>
              <div className="mt-14 flex items-center justify-center flex-wrap gap-4">
                <Link href="/team/create">
                  <button
                    type="button"
                    className="px-8 py-2 rounded-xl bg-defendrRed text-white font-medium cursor-pointer"
                  >
                    + create team
                  </button>
                </Link>
                <button
                  type="button"
                  className="px-8 py-2 rounded-xl border-2 border-defendrRed text-defendrRed font-medium cursor-pointer"
                  onClick={() => setIsRequestModalOpen(true)}
                >
                  Request to join a team
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  )
}

export default SelectTeamToJoin
