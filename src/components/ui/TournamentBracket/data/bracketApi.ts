/**
 * API utilities for fetching tournament bracket data
 * This module provides functions to fetch bracket data for single and double elimination tournaments
 */

import { getBracketById } from '@/services/bracketService'
import type { ApiBracket } from '../types/apiTypes'

/**
 * Fetch bracket data for a tournament
 * Handles both single and double elimination tournaments
 *
 * @param mainBracketId - ID of the main/winners bracket
 * @param loserBracketId - Optional ID of the losers bracket (for double elimination)
 * @param bracketType - Tournament bracket type (SINGLE_ELIMINATION, DOUBLE_ELIMINATION, etc.)
 * @returns Array of bracket data or single bracket depending on tournament type
 */
export const fetchTournamentBrackets = async (
  mainBracketId: string,
  loserBracketId?: string,
  bracketType?: string,
): Promise<ApiBracket | ApiBracket[] | null> => {
  try {
    if (!mainBracketId) {
      return null
    }

    const brackets: ApiBracket[] = []

    // Fetch winners/main bracket
    try {
      const bracketResponse = await getBracketById(mainBracketId)
      const winnersBracket = bracketResponse?.bracket || bracketResponse

      if (winnersBracket) {
        brackets.push({
          ...winnersBracket,
          type: 'WINNERS',
        })
      }
    } catch (error) {
      console.error('Error fetching winners bracket:', error)
      throw new Error('Failed to fetch winners bracket')
    }

    // Fetch losers bracket if it exists (double elimination)
    if (loserBracketId && bracketType === 'DOUBLE_ELIMINATION') {
      try {
        const loserBracketResponse = await getBracketById(loserBracketId)
        const losersBracket = loserBracketResponse?.bracket || loserBracketResponse

        if (losersBracket) {
          brackets.push({
            ...losersBracket,
            type: 'LOSERS',
          })
        }
      } catch (error) {
        console.error('Error fetching losers bracket:', error)
        // Continue with just winners bracket if losers bracket fails
      }
    }

    // Return array if multiple brackets, single bracket otherwise
    return brackets.length > 1 ? brackets : brackets[0] || null
  } catch (error) {
    console.error('Error fetching tournament brackets:', error)
    throw error
  }
}

/**
 * Fetch a single bracket by ID
 *
 * @param bracketId - ID of the bracket to fetch
 * @returns Bracket data
 */
export const fetchSingleBracket = async (bracketId: string): Promise<ApiBracket | null> => {
  try {
    if (!bracketId) {
      return null
    }

    const response = await getBracketById(bracketId)
    return response?.bracket || response || null
  } catch (error) {
    console.error('Error fetching single bracket:', error)
    throw error
  }
}

/**
 * Validate bracket data structure
 *
 * @param bracketData - Data to validate
 * @returns True if bracket data is valid
 */
export const isValidBracketData = (bracketData: unknown): boolean => {
  if (!bracketData) {
    return false
  }

  // Single bracket
  if (typeof bracketData === 'object' && 'rounds' in bracketData) {
    return Array.isArray((bracketData as Record<string, unknown>).rounds)
  }

  // Array of brackets
  if (Array.isArray(bracketData)) {
    return (
      bracketData.length > 0 &&
      bracketData.every(
        b =>
          typeof b === 'object' &&
          'rounds' in b &&
          Array.isArray((b as Record<string, unknown>).rounds),
      )
    )
  }

  return false
}
