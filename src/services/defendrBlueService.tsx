import { NextApiRequest } from 'next'

import { getAxiosInstance } from '@/lib/api/axiosConfig'
import { ApiErrorType } from '@/lib/api/constants'
import { ApiError } from '@/lib/api/errors'

export const getUserDefendrBluePointsByGame = async (
  userId: string,
  gameId: string,
  serverRequest?: NextApiRequest,
) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest)
    const response = await axiosInstance.get(`/defendr-blue/game-points/${userId}/${gameId}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while fetching Defendr Blue points for user',
      undefined,
      error,
    )
  }
}

export const getTotalDefendrBluePointsByUser = async (
  userId: string,
  serverRequest?: NextApiRequest,
) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest)
    const response = await axiosInstance.get(`/defendr-blue/total-points/${userId}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while fetching total Defendr Blue points',
      undefined,
      error,
    )
  }
}

export const getClassmentByGame = async (
  gameId: string,
  {
    page = 1,
    limit = 10,
    type = 'user',
    sortBy = 'points',
    timeRange = 'all',
  }: {
    page?: number
    limit?: number
    type?: 'user' | 'team'
    sortBy?: 'points' | 'wins'
    timeRange?: 'all' | 'lastweek' | 'lastmonth'
  },
  serverRequest?: NextApiRequest,
) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest)
    const response = await axiosInstance.get(`/defendr-blue/classment/${gameId}`, {
      params: { page, limit, type, sortBy, timeRange },
    })
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while fetching classment by game',
      undefined,
      error,
    )
  }
}

export const getStatsByGame = async (
  userId: string,
  gameId: string,
  serverRequest?: NextApiRequest,
) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest)
    const response = await axiosInstance.get(`/defendr-blue/stats/${userId}/${gameId}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while fetching Defendr Blue stats for game',
      undefined,
      error,
    )
  }
}
