import { NextApiRequest } from 'next'

import { getAxiosInstance } from '@/lib/api/axiosConfig'
import { ApiErrorType } from '@/lib/api/constants'
import { ApiError } from '@/lib/api/errors'

export const getAllGames = async (serverRequest?: NextApiRequest) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest)
    const response = await axiosInstance.get('/game/games')
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while fetching all games',
      undefined,
      error,
    )
  }
}

export const getGameById = async (gameId: string, serverRequest?: NextApiRequest) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest)
    const response = await axiosInstance.get(`/game/getById/${gameId}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while fetching game by ID',
      undefined,
      error,
    )
  }
}

export const addGame = async (data: FormData, serverRequest?: NextApiRequest) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.post('/game/addGame', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while adding the game',
      undefined,
      error,
    )
  }
}

export const updateGame = async (
  gameId: string,
  data: Record<string, any>,
  serverRequest?: NextApiRequest,
) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.put(`/game/updateGame/${gameId}`, data)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while updating the game',
      undefined,
      error,
    )
  }
}

export const deleteGame = async (gameId: string, serverRequest?: NextApiRequest) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.delete(`/game/deletebyid/${gameId}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while deleting the game',
      undefined,
      error,
    )
  }
}
export const toggleFavoriteGame = async (gameId: string, serverRequest?: NextApiRequest) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.put(`/game/favorites/${gameId}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while toggling favorite game',
      undefined,
      error,
    )
  }
}

export const addApexLegendsUsername = async (
  payload: { username: string; platform: string },
  serverRequest?: NextApiRequest,
) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.post(`/game/addApexLegends`, payload)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while adding Apex Legends username',
      undefined,
      error,
    )
  }
}

export const addMobileLegendsUsername = async (
  payload: { username: string; region: string },
  serverRequest?: NextApiRequest,
) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.post(`/game/addMobileLegendsInfo`, payload)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while adding Mobile Legends username',
      undefined,
      error,
    )
  }
}

export const addEFootball24Username = async (
  payload: { username: string },
  serverRequest?: NextApiRequest,
) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.post(`/game/addEF24Info`, payload)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while adding EFootball24 username',
      undefined,
      error,
    )
  }
}

export const addRocketLeagueUsername = async (
  payload: { platform: string; username?: string },
  serverRequest?: NextApiRequest,
) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.post(`/game/addRocketLeagueInfo`, payload)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while adding Rocket League username',
      undefined,
      error,
    )
  }
}
export const removeGameFromGameProfiles = async (
  gameId: string,
  serverRequest?: NextApiRequest,
) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.post(`/game/removeGameFromGameProfiles/${gameId}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while removing game from game profiles',
      undefined,
      error,
    )
  }
}
