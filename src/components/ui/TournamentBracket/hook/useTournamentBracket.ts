import { useEffect, useState } from 'react'
import { fetchTournamentBrackets, fetchSingleBracket } from '../data/bracketApi'
import type { ApiBracket } from '../types/apiTypes'

/**
 * Hook to fetch tournament bracket data
 * Supports both single and double elimination tournaments
 * Always returns bracketData as an array of ApiBracket objects
 *
 * @param mainBracketId - ID of the main/winners bracket
 * @param loserBracketId - Optional ID of the losers bracket (for double elimination)
 * @param bracketType - Tournament bracket type (SINGLE_ELIMINATION, DOUBLE_ELIMINATION, etc.)
 * @returns { bracketData, loading, error, refetch } - bracketData is always an array
 */
export function useTournamentBracket(
  mainBracketId?: string,
  loserBracketId?: string,
  bracketType?: string,
) {
  const [bracketData, setBracketData] = useState<ApiBracket[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    if (!mainBracketId) {
      setBracketData([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await fetchTournamentBrackets(mainBracketId, loserBracketId, bracketType)
      // Normalize data to always be an array
      const normalizedData = data ? (Array.isArray(data) ? data : [data]) : []
      setBracketData(normalizedData)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch bracket data'))
      setBracketData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [mainBracketId, loserBracketId, bracketType])

  return {
    bracketData,
    loading,
    error,
    refetch: fetchData,
  }
}

/**
 * Hook to fetch a single bracket by ID
 *
 * @param bracketId - ID of the bracket to fetch
 * @returns { bracketData, loading, error, refetch }
 */
export function useSingleBracket(bracketId?: string) {
  const [bracketData, setBracketData] = useState<ApiBracket | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    if (!bracketId) {
      setBracketData(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await fetchSingleBracket(bracketId)
      setBracketData(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch bracket data'))
      setBracketData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [bracketId])

  return {
    bracketData,
    loading,
    error,
    refetch: fetchData,
  }
}

export default useTournamentBracket
