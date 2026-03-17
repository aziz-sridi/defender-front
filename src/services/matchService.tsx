import { NextApiRequest } from 'next'

import { getAxiosInstance } from '@/lib/api/axiosConfig'
import { ApiErrorType } from '@/lib/api/constants'
import { ApiError } from '@/lib/api/errors'

export const getMatchById = async (
  matchId: string,
  userId?: string,
  serverRequest?: NextApiRequest,
) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest)
    const response = await axiosInstance.get(`/match/${matchId}`, { data: { userId } })
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while fetching match',
      undefined,
      error,
    )
  }
}

export const getMatchesByRound = async (roundId: string, serverRequest?: NextApiRequest) => {
  try {
    const axios = await getAxiosInstance(serverRequest)
    const response = await axios.get(`/match/by-round/${roundId}`)
    return response.data.matches || response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while fetching matches by round',
      undefined,
      error,
    )
  }
}

export const setScore = async (
  matchId: string,
  participantId: string,
  score: number,
  serverRequest?: NextApiRequest,
) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.put(
      `/match/set-score/${matchId}/${participantId}/${score}`,
    )
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while setting score',
      undefined,
      error,
    )
  }
}

export const scheduleMatch = async (
  matchId: string,
  date: string,
  serverRequest?: NextApiRequest,
) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.put(`/match/schedule/${matchId}`, { date })
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while scheduling match',
      undefined,
      error,
    )
  }
}

export const startMatch = async (matchId: string, serverRequest?: NextApiRequest) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.put(`/match/${matchId}/start`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while starting match',
      undefined,
      error,
    )
  }
}

export const flipCoin = async (
  matchId: string,
  participantId: string,
  serverRequest?: NextApiRequest,
) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.get(`/match/flip-coin/${matchId}/${participantId}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while flipping coin',
      undefined,
      error,
    )
  }
}

export const swapParticipants = async (
  participantA: string,
  participantB: string,
  matchA: string,
  matchB: string,
  serverRequest?: NextApiRequest,
) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.put(`/match/swap-participants`, {
      participantA,
      participantB,
      matchA,
      matchB,
    })
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while swapping participants',
      undefined,
      error,
    )
  }
}

export const approveScreenshot = async (
  matchId: string,
  winnerId: string,
  setNumber: number,
  serverRequest?: NextApiRequest,
) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.post(`/match/approve-screenshot/${matchId}`, {
      winnerId,
      setNumber,
    })
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while approving screenshot',
      undefined,
      error,
    )
  }
}
