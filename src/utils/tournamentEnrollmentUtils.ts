import { toast } from 'sonner'
import { signIn } from 'next-auth/react'

import {
  cancelParticipation,
  enrollParticipant,
  participateAsTeam,
} from '@/services/participantService'
import { participateAsFreeAgent } from '@/services/freeAgentService'
import type { Tournament } from '@/types/tournamentType'

interface JoinOptions {
  tournament: Tournament
  userId?: string
  participantId?: string | null
  selectedTeamId?: string
  onRequirePayment?: (mode: 'solo' | 'team') => void
  onRequireTeamSelect?: () => void
  onSuccess?: () => void
}

/**
 * Attempt to join a tournament depending on game mode, free/paid, solo/team.
 */
export const joinTournament = async ({
  tournament,
  userId,
  participantId,
  selectedTeamId,
  onRequirePayment,
  onRequireTeamSelect,
  onSuccess,
}: JoinOptions) => {
  const now = new Date()
  const startDate = new Date(tournament.startDate)

  if (!userId) {
    toast.error('You must be signed in to join')
    signIn()
    return
  }

  if (tournament.isClosed) {
    toast.error('Tournament is closed')
    return
  }

  if (now > startDate) {
    toast.error('Tournament has already started')
    return
  }

  if (participantId) {
    toast.error('You already joined this tournament')
    return
  }

  // SOLO mode
  if (tournament.gameMode === 'Solo') {
    if (tournament.joinProcess.entryFee > 0) {
      // Paid solo -> open payment modal
      onRequirePayment?.('solo')
      return
    }
    try {
      await enrollParticipant(tournament._id)
      toast.success('Successfully enrolled as solo participant')
      onSuccess?.()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to enroll as solo'
      toast.error(message)
    }
    return
  }

  // TEAM mode
  if (tournament.gameMode === 'Team') {
    if (!selectedTeamId) {
      onRequireTeamSelect?.()
      return
    }

    if (tournament.joinProcess.entryFee > 0) {
      // Paid team -> trigger payment modal
      onRequirePayment?.('team')
      return
    }

    try {
      await participateAsTeam(tournament._id, { teamId: selectedTeamId })
      toast.success('Team successfully enrolled')
      onSuccess?.()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to enroll team'
      toast.error(message)
    }
    return
  }

  // FREE AGENT (only if allowed)
  if (tournament.joinProcess?.maxFreeAgents > 0) {
    try {
      await participateAsFreeAgent(tournament._id)
      toast.success('Joined as free agent')
      onSuccess?.()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to join as free agent'
      toast.error(message)
    }
  } else {
    toast.error('Free agent enrollment is disabled by the organizer')
  }
}

/**
 * Cancel participation
 */
export const cancelTournamentParticipation = async (
  tournamentId: string,
  participantId: string,
  hasBracketStarted: boolean,
) => {
  if (!participantId) {
    toast.error('No participant ID found')
    return
  }

  if (hasBracketStarted) {
    toast.error('Cannot cancel participation after the bracket has started')
    return
  }

  try {
    await cancelParticipation(tournamentId, participantId)
    toast.success('Participation cancelled successfully')
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to cancel participation'
    toast.error(message)
  }
}
