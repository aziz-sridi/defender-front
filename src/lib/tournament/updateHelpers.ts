import { updateTournament } from '@/services/tournamentService'

// Unified safe updater: accepts either plain object or FormData; wraps errors with thrown Error
export async function safeUpdateTournament(
  tournamentId: string | null,
  data: Record<string, unknown> | FormData,
) {
  if (!tournamentId) {
    throw new Error('Missing tournament id')
  }
  return updateTournament(tournamentId, data)
}
