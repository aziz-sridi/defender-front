import { NextApiRequest } from 'next'

import { getAxiosInstance } from '@/lib/api/axiosConfig'
import { ApiError } from '@/lib/api/errors'
import { ApiErrorType } from '@/lib/api/constants'

export const generateBracket = async (
  tournamentId: string,
  type: 'SINGLE_ELIMINATION' | 'DOUBLE_ELIMINATION' | 'ROUND_ROBIN' | 'FREE_FOR_ALL' | 'SWISS',
  serverRequest?: NextApiRequest,
) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.post(`/bracket/generate-bracket/${tournamentId}`, { type })
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while generating bracket',
      undefined,
      error,
    )
  }
}

export const getBracketById = async (bracketId: string, serverRequest?: NextApiRequest) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest)
    const response = await axiosInstance.get(`/bracket/get-bracket/${bracketId}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while fetching bracket by ID',
      undefined,
      error,
    )
  }
}

export const getBracketByTournamentId = async (
  tournamentId: string,
  serverRequest?: NextApiRequest,
) => {
  try {
    const axios = await getAxiosInstance(serverRequest)

    // Helper to safely extract an id from possible object/$oid/string values
    const extractId = (val: unknown): string | null => {
      if (!val) {
        return null
      }
      if (typeof val === 'string') {
        return val
      }
      if (typeof val === 'object') {
        const obj = val as Record<string, unknown>
        const anyId = (obj.$oid ?? obj._id ?? obj.id) as unknown
        if (typeof anyId === 'string') {
          return anyId
        }
      }
      return null
    }

    // Step 1: fetch tournament to get bracket ids
    const tournamentRes = await axios.get(`/tournament/getById/${tournamentId}`)
    const tournament = tournamentRes.data as Record<string, unknown>

    const mainBracketId = extractId(tournament.bracket)
    const loserBracketId = extractId(tournament.looserBracket)

    const brackets: unknown[] = []
    if (mainBracketId) {
      const mainRes: unknown = await getBracketById(mainBracketId, serverRequest)
      const main =
        mainRes && typeof mainRes === 'object' && (mainRes as Record<string, unknown>).bracket
          ? (mainRes as Record<string, unknown>).bracket
          : mainRes
      if (main) {
        brackets.push(main)
      }
    }
    if (loserBracketId) {
      try {
        const loserRes: unknown = await getBracketById(loserBracketId, serverRequest)
        const lo =
          loserRes && typeof loserRes === 'object' && (loserRes as Record<string, unknown>).bracket
            ? (loserRes as Record<string, unknown>).bracket
            : loserRes
        if (lo) {
          brackets.push(lo)
        }
      } catch {
        // loser bracket may not exist yet; ignore
      }
    }

    return { brackets }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while fetching bracket by tournament ID',
      undefined,
      error,
    )
  }
}

// Alias that matches backend controller naming from spec (generateBrackets)
export const generateBrackets = async (
  tournamentId: string,
  type: 'SINGLE_ELIMINATION' | 'DOUBLE_ELIMINATION' | 'ROUND_ROBIN' | 'FREE_FOR_ALL' | 'SWISS',
  serverRequest?: NextApiRequest,
) => {
  return generateBracket(tournamentId, type, serverRequest)
}
