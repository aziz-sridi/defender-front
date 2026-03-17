'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { HelpCircle, ExternalLink } from 'lucide-react'

// Helper function to check if a game is a Riot Games title
const isRiotGame = (gameName?: string): boolean => {
  if (!gameName) return false

  const gameNameLower = gameName.toLowerCase().trim()

  // Check for various Riot Games titles and their common variations
  const riotGamePatterns = [
    'league of legends',
    'league of legend',
    'lol',
    'league',
    'valorant',
    'val',
    'legends of runeterra',
    'runeterra',
    'teamfight tactics',
    'tft',
    'wild rift',
    'rift',
  ]

  return riotGamePatterns.some(pattern => gameNameLower.includes(pattern))
}

import PaymentOptionsModal from '@/components/tournament/PaymentOptionsModal'
import TeamSelectModal from '@/components/tournament/TeamSelectModal'
import TournamentModal from '@/components/tournament/TournamentModal'
import RequirementsCheckModal from '@/components/tournament/RequirementsCheckModal'
import Button from '@/components/ui/Button'
import { hasExtraRequirements } from '@/lib/tournament/requirements'
import {
  enrollParticipant,
  participateAsTeam,
  cancelParticipation,
  getParticipantById,
} from '@/services/participantService'
import { getTeamById } from '@/services/teamService'
import { updateProfile } from '@/services/userService'
import { Tournament } from '@/types/tournamentType'
import { User } from '@/types/userType'

interface JoinTournamentProps {
  tournament: Tournament
  participantId?: string | null
  isInTournament: boolean
}

const JoinTournament = ({
  tournament,
  participantId: _participantId,
  isInTournament,
}: JoinTournamentProps) => {
  const { data: session, update } = useSession()
  const router = useRouter()
  const userId = session?.user?._id

  const hasTournamentStarted = useMemo(
    () => new Date(tournament.startDate) <= new Date() || !!tournament.started,
    [tournament.startDate, tournament.started],
  )
  const hasBracketsGenerated = useMemo(
    () =>
      Boolean(
        tournament.bracket ||
          tournament.looserBracket ||
          (tournament.swissBrackets && tournament.swissBrackets.length > 0),
      ),
    [tournament.bracket, tournament.looserBracket, tournament.swissBrackets],
  )
  const isTournamentActive = useMemo(
    () => tournament.isClosed || hasTournamentStarted || hasBracketsGenerated,
    [tournament.isClosed, hasTournamentStarted, hasBracketsGenerated],
  )

  const [modalOpen, setModalOpen] = useState(false)
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [teamSelectModalOpen, setTeamSelectModalOpen] = useState(false)
  const [leaveModalOpen, setLeaveModalOpen] = useState(false)
  const [requirementsModalOpen, setRequirementsModalOpen] = useState(false)
  const [selectedTeamId, setSelectedTeamId] = useState<string | undefined>()
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[] | undefined>()
  const [selectedSubIds, setSelectedSubIds] = useState<string[] | undefined>()
  const [paymentMode, setPaymentMode] = useState<'solo' | 'team' | null>(null)
  const [isLeaving, setIsLeaving] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCheckingOwnership, setIsCheckingOwnership] = useState(false)
  const [isTeamOwner, setIsTeamOwner] = useState<boolean>(false)

  const isTeamMode = tournament.gameMode === 'Team'
  const isPaid = Number(tournament.joinProcess?.entryFee || 0) > 0

  const userTeams = Array.isArray(session?.user?.teams) ? session.user.teams : []

  const userTeamIds = userTeams
    .map((team: unknown) => {
      if (typeof team === 'string') {
        return team
      }
      if (typeof team === 'object' && team !== null) {
        return String((team as Record<string, unknown>)._id)
      }
      return null
    })
    .filter((id): id is string => !!id)

  // Check both string and object team IDs for participation
  let matchingParticipantId: string | null = null
  let isUserInParticipatingTeam = false
  if (isTeamMode && Array.isArray(tournament.participants)) {
    for (const participant of tournament.participants) {
      if (participant && typeof participant === 'object' && participant.team) {
        let teamId: string | null = null
        if (typeof participant.team === 'string') {
          teamId = participant.team
        } else if (typeof participant.team === 'object' && participant.team !== null) {
          teamId = String(participant.team._id || '')
        }
        if (teamId && userTeamIds.includes(teamId)) {
          isUserInParticipatingTeam = true
          matchingParticipantId = participant._id
          break
        }
      }
    }
  }

  useEffect(() => {
    function extractMongoId(obj: unknown): string | null {
      if (typeof obj === 'string') return obj
      if (typeof obj === 'object' && obj !== null) {
        const rec = obj as Record<string, unknown>
        if (typeof rec.$oid === 'string') return rec.$oid
        if (typeof rec._id === 'string') return rec._id
      }
      return null
    }

    function extractOwnerId(entry: unknown): string | null {
      if (!entry) return null
      if (typeof entry === 'string') return entry
      if (typeof entry === 'object' && entry !== null) {
        const rec = entry as Record<string, unknown>
        if (typeof rec.user === 'string') return rec.user
        if (rec.user && typeof rec.user === 'object' && rec.user !== null) {
          const id = extractMongoId(rec.user)
          if (id) return id
        }
        if (typeof rec._id === 'string') return rec._id
        if (typeof rec.id === 'string') return rec.id
      }
      return null
    }

    function extractUserId(user: unknown): string | null {
      if (!user) return null
      if (typeof user === 'string') return user
      if (typeof user === 'object' && user !== null) {
        const rec = user as Record<string, unknown>
        if (typeof rec._id === 'string') return rec._id
        if (rec._id && typeof rec._id === 'object' && rec._id !== null) {
          const id = extractMongoId(rec._id)
          if (id) return id
        }
        if (typeof rec.$oid === 'string') return rec.$oid
      }
      return null
    }

    let cancelled = false
    const checkOwnership = async () => {
      if (!isTeamMode || !userId) {
        setIsTeamOwner(false)
        return
      }
      setIsCheckingOwnership(true)
      try {
        const participantIdToCheck = isUserInParticipatingTeam
          ? matchingParticipantId
          : _participantId

        if (participantIdToCheck) {
          const participantResp = await getParticipantById(participantIdToCheck)
          if (cancelled) return

          const participantObj =
            participantResp && typeof participantResp === 'object' ? participantResp : {}
          const rawTeam = (participantObj as Record<string, unknown>).team
          const teamId =
            ((participantObj as Record<string, unknown>).teamId as string) ||
            (typeof rawTeam === 'string'
              ? rawTeam
              : rawTeam && typeof rawTeam === 'object' && rawTeam !== null
                ? ((rawTeam as Record<string, unknown>)._id as string)
                : undefined)

          if (!teamId) {
            setIsTeamOwner(false)
            return
          }

          const teamResp = await getTeamById(teamId)
          if (cancelled) return

          const ownersArr = Array.isArray(teamResp?.teamowner) ? teamResp.teamowner : []
          const myId = extractUserId(session?.user)
          const ownerIds = ownersArr.map(owner => extractOwnerId(owner))
          const isOwner = ownerIds.includes(myId)
          setIsTeamOwner(isOwner)
        } else {
          const myId = extractUserId(session?.user)
          const teams = Array.isArray(session?.user?.teams) ? session.user.teams : []
          let foundOwner = false

          for (const team of teams) {
            let teamObj: unknown = team
            if (typeof team === 'string') {
              try {
                const fetched = await getTeamById(team)
                if (fetched && typeof fetched === 'object' && fetched !== null) {
                  teamObj = fetched
                }
              } catch {}
            }

            if (
              teamObj &&
              typeof teamObj === 'object' &&
              teamObj !== null &&
              Array.isArray((teamObj as { teamowner?: unknown }).teamowner)
            ) {
              const ownersArr = (teamObj as { teamowner: unknown[] }).teamowner
              const ownerIds = ownersArr.map(owner => extractOwnerId(owner))
              if (ownerIds.includes(myId)) {
                foundOwner = true
                break
              }
            }
          }
          setIsTeamOwner(foundOwner)
        }
      } catch {
        setIsTeamOwner(false)
      } finally {
        if (!cancelled) setIsCheckingOwnership(false)
      }
    }

    checkOwnership()
    return () => {
      cancelled = true
    }
  }, [
    _participantId,
    isTeamMode,
    userId,
    session?.user,
    matchingParticipantId,
    isUserInParticipatingTeam,
  ])

  const handleClick = async () => {
    if (!userId) {
      toast.error('You must be signed in to join')
      router.push(`/login?callbackUrl=/tournament/${tournament._id}`)
      return
    }

    if (
      !isInTournament &&
      !isUserInParticipatingTeam &&
      hasExtraRequirements(tournament) &&
      (!isTeamMode || (isTeamMode && !isTeamOwner))
    ) {
      setRequirementsModalOpen(true)
      return
    }

    if (tournament.isClosed) {
      toast.error('Tournament finished')
      return
    }
    if (hasTournamentStarted) {
      toast.error('Registration ended')
      return
    }
    if (isTournamentActive && !isInTournament && !isUserInParticipatingTeam) {
      toast.error('Tournament has started')
      return
    }

    if (isInTournament || isUserInParticipatingTeam) {
      if (isTeamMode && !isTeamOwner) {
        toast.error('Only the team owner can cancel the team participation')
        return
      }
      setLeaveModalOpen(true)
      return
    }

    await handleConfirm()
  }

  const joinSoloFree = useCallback(async () => {
    setIsSubmitting(true)
    try {
      await enrollParticipant(tournament._id)
      toast.success('Joined tournament')
      router.refresh()
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to join'
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }, [router, tournament._id])

  const joinTeamFree = useCallback(
    async (teamId: string, teamMembers?: string[], substituteMembers?: string[]) => {
      setIsSubmitting(true)
      try {
        await participateAsTeam(tournament._id, {
          teamId,
          teamMembers,
          substituteMembers,
        })
        toast.success('Team joined')
        router.refresh()
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Failed to join as team'
        toast.error(msg)
      } finally {
        setIsSubmitting(false)
      }
    },
    [router, tournament._id],
  )

  const handleLeaveTournament = useCallback(async () => {
    const participantIdToUse = isUserInParticipatingTeam ? matchingParticipantId : _participantId

    if (!participantIdToUse) {
      toast.error('Unable to find your participation')
      return
    }
    setIsLeaving(true)
    try {
      await cancelParticipation(tournament._id, participantIdToUse)
      toast.success('Left tournament')
      router.refresh()
    } catch {
      toast.error('Failed to leave tournament')
    } finally {
      setIsLeaving(false)
      setLeaveModalOpen(false)
    }
  }, [_participantId, matchingParticipantId, isUserInParticipatingTeam, router, tournament._id])

  const handleConfirm = async () => {
    setModalOpen(false)
    if (isTeamMode) {
      if (!isTeamOwner) {
        toast.error('Only team owners can join as a team. Please contact your team owner.')
        return
      }
      setTeamSelectModalOpen(true)
      return
    }
    if (isPaid) {
      setPaymentMode('solo')
      setPaymentModalOpen(true)
      return
    }
    await joinSoloFree()
  }

  const handleTeamSelected = async (
    teamId: string,
    selectedPlayerIds?: string[],
    substituteMemberIds?: string[],
  ) => {
    setSelectedTeamId(teamId)
    setSelectedPlayerIds(selectedPlayerIds)
    setSelectedSubIds(substituteMemberIds)
    setTeamSelectModalOpen(false)
    if (isPaid) {
      setPaymentMode('team')
      setPaymentModalOpen(true)
      return
    }
    await joinTeamFree(teamId, selectedPlayerIds, substituteMemberIds)
  }

  const handleProceedPayment = async () => {
    if (!paymentMode) return

    setIsSubmitting(true)
    try {
      if (paymentMode === 'solo') {
        await enrollParticipant(tournament._id)
        toast.success('Enrollment submitted as pending')
        router.refresh()
      } else if (paymentMode === 'team') {
        if (!selectedTeamId) {
          toast.error('Please select a team first')
          setPaymentModalOpen(false)
          setTeamSelectModalOpen(true)
          return
        }
        await participateAsTeam(tournament._id, {
          teamId: selectedTeamId,
          teamMembers: selectedPlayerIds,
          substituteMembers: selectedSubIds,
        })
        toast.success('Team enrollment submitted as pending')
        router.refresh()
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to submit enrollment'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
      setPaymentModalOpen(false)
      setPaymentMode(null)
    }
  }

  const handleUpdateUser = async (userData: Partial<User>) => {
    try {
      await updateProfile(userData)
      await update({
        user: {
          ...session?.user,
          ...userData,
        },
      })
      toast.success('Profile updated successfully')
    } catch {
      toast.error('Failed to update profile')
    }
  }

  const openMainJoinFlow = () => {
    setRequirementsModalOpen(false)
    setModalOpen(true)
  }

  return (
    <>
      {/* Discord-style Help Notice for Team Tournaments */}
      {isTeamMode &&
        !isInTournament &&
        !isUserInParticipatingTeam &&
        !tournament.isClosed &&
        !isTournamentActive &&
        isRiotGame(tournament.game?.name) && (
          <div className="w-full max-w-[560px] md:max-w-none mb-4">
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 rounded-xl p-4 border border-indigo-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <HelpCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm">Need help ?</h3>
                    <p className="text-indigo-200 text-xs">Click on the watch video</p>
                  </div>
                </div>
                <a
                  href="https://www.facebook.com/share/v/1K1U66WmMD/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white text-indigo-600 px-4 py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors duration-200 text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  Watch Video
                </a>
              </div>
            </div>
          </div>
        )}

      <Button
        className="w-full max-w-[560px] md:max-w-none px-6 py-3 rounded-2xl shadow-md md:shadow-lg transition-transform active:scale-[0.99]"
        disabled={
          isSubmitting ||
          isCheckingOwnership ||
          isTournamentActive ||
          isLeaving ||
          (isTeamMode && isUserInParticipatingTeam && !isTeamOwner)
        }
        fontFamily="poppins"
        label={
          isInTournament || isUserInParticipatingTeam
            ? isLeaving
              ? 'Leaving...'
              : 'Leave Tournament'
            : tournament.isClosed
              ? 'Tournament Finished'
              : isTournamentActive
                ? 'Tournament Started'
                : isSubmitting
                  ? 'Joining...'
                  : 'Join Now'
        }
        size="xl"
        variant={
          isInTournament || isUserInParticipatingTeam
            ? 'contained-red'
            : isTournamentActive
              ? 'black'
              : 'contained-red'
        }
        onClick={handleClick}
      />

      <TournamentModal
        confirmLabel={isPaid ? 'Join as pending' : 'Join now'}
        description={
          isPaid
            ? `To confirm your participation, please pay the ${tournament.joinProcess.entryFee}DT entry fee using one of the available payment options.`
            : 'Confirm your participation in this tournament.'
        }
        open={modalOpen}
        title="Need to know"
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirm}
      />

      {userId && (
        <TeamSelectModal
          open={teamSelectModalOpen}
          tournament={tournament}
          userId={userId}
          onClose={() => setTeamSelectModalOpen(false)}
          onTeamSelected={handleTeamSelected}
        />
      )}

      {paymentMode && (
        <PaymentOptionsModal
          mode={paymentMode}
          open={paymentModalOpen}
          tournament={tournament}
          onClose={() => {
            setPaymentModalOpen(false)
            setPaymentMode(null)
          }}
          onProceed={handleProceedPayment}
        />
      )}

      <TournamentModal
        confirmLabel={isLeaving ? 'Leaving...' : 'Leave Tournament'}
        description={
          isTeamMode
            ? isTeamOwner
              ? `Are you sure you want to cancel your team's participation in "${tournament.name}"? This will remove the whole team from the tournament.`
              : `Only the team owner can cancel your team's participation.`
            : `Are you sure you want to leave "${tournament.name}"? This action cannot be undone and you will lose your spot in the tournament.`
        }
        open={leaveModalOpen}
        title={isTeamMode ? 'Cancel Team Participation' : 'Leave Tournament'}
        onClose={() => {
          if (!isLeaving) setLeaveModalOpen(false)
        }}
        onConfirm={() => {
          if (!isLeaving && (!isTeamMode || isTeamOwner)) {
            handleLeaveTournament()
          }
        }}
      />

      <RequirementsCheckModal
        isTeamOwner={isTeamOwner}
        open={requirementsModalOpen}
        tournament={tournament}
        user={session?.user}
        onClose={() => setRequirementsModalOpen(false)}
        onContinue={openMainJoinFlow}
        onUpdateUser={handleUpdateUser}
      />
    </>
  )
}

export default JoinTournament
