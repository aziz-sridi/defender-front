import { NextApiRequest } from 'next'

import { getAxiosInstance } from '@/lib/api/axiosConfig'
import { ApiErrorType } from '@/lib/api/constants'
import { ApiError } from '@/lib/api/errors'

export const changeRoundSets = async (
  roundId: string,
  sets: 1 | 3 | 5,
  serverRequest?: NextApiRequest,
) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.put(`/round/sets/${roundId}/${sets}`)
    return response.data.round
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.SERVER,
      'An unexpected error occurred while changing round sets.',
      undefined,
      error,
    )
  }
}

export const getRoundById = async (roundId: string, serverRequest?: NextApiRequest) => {
  try {
    const axios = await getAxiosInstance(serverRequest)
    const response = await axios.get(`/round/${roundId}`)
    return response.data.round || response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to fetch round by id', undefined, error)
  }
}

export const getRoundsByBracket = async (bracketId: string, serverRequest?: NextApiRequest) => {
  try {
    const axios = await getAxiosInstance(serverRequest)
    const response = await axios.get(`/round/by-bracket/${bracketId}`)
    return response.data.rounds || response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to fetch rounds by bracket', undefined, error)
  }
}
