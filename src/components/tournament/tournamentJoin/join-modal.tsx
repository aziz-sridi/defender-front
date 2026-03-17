'use client'
import { useClickOutSide } from '@/hooks/useClickOutSide'
import { cn } from '@/lib/utils'
import { Tournament } from '@/types/tournamentType'
import { X, CheckCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import SelectTeamToJoin from './select-team-to-join'
import { Team } from '@/types/teamType'
import { getAllTeamsByUserId } from '@/services/userService'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import InviteTeamMembers from './invite-team-members'
import { Participant } from '@/types/participantType'
import PlayerTeamStatus from './players-team-status'
import JoinTournamentAsSolo from './join-tournament-as-solo'
import { cancelParticipation } from '@/services/participantService'
import { getActualUserParticipantId } from '@/services/tournamentService'
import { toast } from 'sonner'

type JoinModalProps = {
  tournament: Tournament
  className?: string
}

const overideCss = `
    header, nav {
        z-index: 0 !important;
    }
`

const JoinModal = ({ tournament, className }: JoinModalProps) => {
  const { data: session } = useSession()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const modalRef = useClickOutSide(() => setIsOpen(false))
  const [teams, setTeams] = useState<Team[]>([])
  const [confirmedTeamSelected, setConfirmedTeamSelected] = useState<{
    participant: Participant | null
    team: Team | null
  }>({ participant: null, team: null })
  const [isLoading, setIsLoading] = useState(false)
  const [showPlayerStatus, setShowPlayerStatus] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isCanceling, setIsCanceling] = useState(false)
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false)

  // Track joined state locally to avoid page reloads
  const [isJoined, setIsJoined] = useState(false)
  const [participantId, setParticipantId] = useState<string | null>(null)

  const userParticipant = tournament.participants.find(
    p => p.user?._id === session?.user?._id || p.teamMembers?.includes(session?.user?._id || ''),
  )
  const isTeamOwner = Boolean(
    userParticipant?.team?.teamowner?.some(owner => owner.user === session?.user?._id),
  )

  const setJoinedVariable = () => {
    const userId = session?.user?._id
    if (!userId) {
      setIsJoined(false)
      setParticipantId(null)
      return
    }

    const userParticipant = tournament.participants.find(
      p => p.user?._id === userId || p.teamMembers?.includes(userId),
    )
    const isRegistered = Boolean(userParticipant && userParticipant.status === 'Registered')
    setIsJoined(isRegistered)
    setParticipantId(isRegistered ? (userParticipant?._id ?? null) : null)
  }

  useEffect(() => {
    setJoinedVariable()
  }, [tournament.participants, session?.user?._id])

  useEffect(() => {
    const userId = session?.user?._id
    if (!userId) return

    const fetchAllTeamsData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        setTeams([])

        const teamsData = await getAllTeamsByUserId(userId)
        setTeams(
          teamsData.filter((team: Team) => team.teamowner.map(({ user }) => user).includes(userId)),
        )
      } catch (err) {
        console.error('Error fetching teams:', err)
        setError('Failed to load teams. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAllTeamsData()
  }, [session?.user?._id])

  const handleJoinSuccess = (participant?: Participant) => {
    const isRegistered = Boolean(participant && participant.status === 'Registered')
    setIsJoined(isRegistered)
    setParticipantId(isRegistered ? (participant?._id ?? null) : null)
    if (tournament.gameMode !== 'Team') {
      setIsOpen(false)
    }
  }

  const handleCancelParticipate = async () => {
    if (!session?.user?._id) return

    // Use the stored participant ID or find it in the participants array
    let userParticipantId = participantId

    if (!userParticipantId) {
      const userParticipant = tournament.participants.find(p => {
        const userId = session?.user?._id
        return (
          (p.user?._id === userId || (userId && p.teamMembers?.includes(userId))) &&
          p.status === 'Registered'
        )
      })
      userParticipantId = userParticipant?._id ?? null
    }

    try {
      setIsCanceling(true)
      if (!userParticipantId) {
        userParticipantId = await getActualUserParticipantId(tournament._id, session.user._id)
      }

      if (!userParticipantId) {
        toast.error('Could not find your participation record')
        return
      }
      await cancelParticipation(tournament._id, userParticipantId)
      setIsJoined(false)
      setParticipantId(null)
      setShowCancelConfirmation(false)
      toast.success('Successfully left the tournament')
    } catch (error) {
      console.error('Error canceling participation:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to cancel participation')
    } finally {
      setIsCanceling(false)
    }
  }
  return (
    <>
      {tournament.started || new Date() > new Date(tournament?.structureProcess?.signUpClosing!) ? (
        <button
          id="join-tournament-btn"
          type="button"
          className="w-80 p-4 rounded-full text-center text-lg font-bold duration-300 flex items-center justify-center gap-4 bg-defendrHoverRed text-red-950 cursor-not-allowed"
        >
          Registration Ends
        </button>
      ) : (
        <button
          id="join-tournament-btn"
          type="button"
          onClick={() => {
            if (!session?.user?._id) {
              toast.error('You must be signed in to join')
              router.push(`/login?callbackUrl=/tournament/${tournament._id}`)
              return
            }
            if (isJoined) {
              if (tournament.gameMode !== 'Team' || isTeamOwner) {
                setShowCancelConfirmation(true)
              }
            } else if (!isJoined) {
              setIsOpen(true)
            }
          }}
          disabled={isCanceling}
          className={cn(
            `cursor-pointer w-80 p-4 rounded-full text-center text-lg font-bold duration-300 flex items-center justify-center gap-4 disabled:opacity-70 disabled:cursor-not-allowed ${isJoined ? 'bg-defendrBlack/80 backdrop-blur-md text-defendrRed border-3 border-defendrRed' : 'bg-defendrRed/70 backdrop-blur-md text-white shadow-xl shadow-[color-mix(in_srgb,var(--color-defendrRed)_40%,var(--color-black))] hover:bg-defendrRed/90'} ${isJoined && tournament.gameMode === 'Solo' ? 'hover:bg-defendrRed/20' : ''}`,
            className,
          )}
        >
          {isCanceling ? (
            'Leaving...'
          ) : isJoined ? (
            <>
              <CheckCheck strokeWidth={3} /> Joined
            </>
          ) : (
            'Join Now'
          )}
        </button>
      )}
      {isOpen && (
        <div className="fixed z-999 inset-0 pointer-events-auto size-screen bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <style>{overideCss}</style>
          <div
            ref={modalRef}
            className="relative p-4 lg:p-8 pt-14 bg-zinc-800 rounded-2xl max-w-full w-200 flex items-center justify-center"
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="size-10 hover:bg-zinc-700 duration-300 flex items-center justify-center rounded-full absolute right-2 lg:right-6 top-2 lg:top-6 cursor-pointer"
            >
              <X />
            </button>
            {tournament.gameMode === 'Team' ? (
              <>
                {showPlayerStatus ? (
                  <PlayerTeamStatus
                    participantId={confirmedTeamSelected.participant?._id || ''}
                    teamMembers={tournament.gameSettings?.teamSize ?? 5}
                    substitutes={tournament.joinProcess?.numberOfSubstitutes ?? 2}
                    onJoinSuccess={() => {
                      // Participant status is now Registered after successful join
                      setIsJoined(true)
                      setParticipantId(confirmedTeamSelected.participant?._id ?? null)
                      setIsOpen(false)
                    }}
                  />
                ) : !confirmedTeamSelected.participant || !confirmedTeamSelected.team ? (
                  <SelectTeamToJoin
                    gameMode={tournament.gameMode}
                    tournamentId={tournament._id}
                    teams={teams}
                    setConfirmedTeamSelected={setConfirmedTeamSelected}
                    onJoinSuccess={handleJoinSuccess}
                    joinProcess={tournament.joinProcess}
                  />
                ) : (
                  <InviteTeamMembers
                    participant={confirmedTeamSelected.participant}
                    team={confirmedTeamSelected.team}
                    mainSlots={tournament.gameSettings?.teamSize ?? 5}
                    substituteSlots={tournament.joinProcess?.numberOfSubstitutes ?? 2}
                    onJoinClick={() => setShowPlayerStatus(true)}
                  />
                )}
              </>
            ) : (
              <JoinTournamentAsSolo
                tournament={tournament}
                session={session}
                closeModal={() => setIsOpen(false)}
                onJoinSuccess={handleJoinSuccess}
              />
            )}
          </div>
        </div>
      )}
      {showCancelConfirmation && (tournament.gameMode !== 'Team' || isTeamOwner) && (
        <div className="fixed z-999 inset-0 pointer-events-auto size-screen bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <style>{overideCss}</style>
          <div
            ref={modalRef}
            className="relative p-4 lg:p-8 pt-14 bg-zinc-800 rounded-2xl max-w-full w-200 flex items-center justify-center"
          >
            <button
              type="button"
              onClick={() => setShowCancelConfirmation(false)}
              className="size-10 hover:bg-zinc-700 duration-300 flex items-center justify-center rounded-full absolute right-2 lg:right-6 top-2 lg:top-6 cursor-pointer"
            >
              <X />
            </button>
            <div className="flex flex-col items-center justify-center w-full gap-6 py-8 px-4">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Leave Tournament</h3>
                <p className="text-gray-400 text-sm">
                  Are you sure you want to leave{' '}
                  <span className="font-semibold text-white">{tournament.name}</span>?
                </p>
              </div>

              <div className="w-full flex gap-3 justify-center pt-4">
                <button
                  type="button"
                  onClick={() => setShowCancelConfirmation(false)}
                  disabled={isCanceling}
                  className="px-8 py-2 rounded-xl border-2 border-defendrRed text-defendrRed font-medium cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCancelParticipate}
                  disabled={isCanceling}
                  className="px-8 py-2 rounded-xl border-2 border-defendrRed text-white bg-defendrRed font-medium cursor-pointer disabled:opacity-50"
                >
                  {isCanceling ? 'Leaving...' : 'Confirm Leave'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default JoinModal
