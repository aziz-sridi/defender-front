import { useEffect, useState } from 'react'

import useTournamentId from './useTournamentId'

/**
 * Fetches tournament details from backend as soon as tournamentId is available.
 * Returns { tournament, loading, error, tournamentId }
 */
export function useTournamentDetails() {
  const tournamentId = useTournamentId()
  const [tournament, setTournament] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!tournamentId) {
      return
    }
    setLoading(true)
    setError(null)
    import('@/services/tournamentService')
      .then(({ getTournamentById }) => getTournamentById(tournamentId))
      .then(data => {
        setTournament(data)
        setLoading(false)
      })
      .catch(e => {
        setError(e)
        setLoading(false)
      })
  }, [tournamentId])

  return { tournament, loading, error, tournamentId }
}

export default useTournamentDetails
