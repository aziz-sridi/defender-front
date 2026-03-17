import { NextApiRequest } from 'next'

import { getAxiosInstance } from '@/lib/api/axiosConfig'
import { ApiError } from '@/lib/api/errors'
import { ApiErrorType } from '@/lib/api/constants'

export const getPrizesByTournament = async (
  tournamentId: string,
  serverRequest?: NextApiRequest,
) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest)
    const response = await axiosInstance.get(`/prize/getPrizes/${tournamentId}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Error fetching prizes for the tournament',
      undefined,
      error,
    )
  }
}

export const getUserPrizes = async (serverRequest?: NextApiRequest) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.get(`/prize/user`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.NETWORK, 'Error fetching user prizes', undefined, error)
  }
}

export const createPrize = async (
  prizeData: {
    tournamentId: string
    prize: Record<string, any>
  },
  serverRequest?: NextApiRequest,
) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.post(`/prize/createPrize`, prizeData)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.NETWORK, 'Error creating prize', undefined, error)
  }
}

export const removePrize = async (prizeId: string, serverRequest?: NextApiRequest) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.delete(`/prize/removePrize/${prizeId}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.NETWORK, 'Error removing prize', undefined, error)
  }
}

export const redeemPrize = async (prizeId: string, serverRequest?: NextApiRequest) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.get(`/prize/redeem/${prizeId}`, {
      responseType: 'arraybuffer',
    })
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.NETWORK, 'Error redeeming prize', undefined, error)
  }
}

export const getPrizeById = async (prizeId: string, serverRequest?: NextApiRequest) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest)
    const response = await axiosInstance.get(`/prize/${prizeId}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.NETWORK, 'Error fetching prize by ID', undefined, error)
  }
}
export const getPrizeByTeamId = async (teamId: string, serverRequest?: NextApiRequest) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.get(`/prize/team/${teamId}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.NETWORK, 'Error fetching prizes for the team', undefined, error)
  }
}
