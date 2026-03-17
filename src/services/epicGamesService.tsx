import { NextApiRequest } from 'next'

import { getAxiosInstance } from '@/lib/api/axiosConfig'
import { ApiError } from '@/lib/api/errors'
import { ApiErrorType } from '@/lib/api/constants'

export const getEpicGamesOAuthLink = async (serverRequest?: NextApiRequest): Promise<string> => {
  try {
    const axios = await getAxiosInstance(serverRequest)
    const response = await axios.get('/epicGames/oauth')
    return response.request.responseURL
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Failed to initiate Epic Games OAuth flow',
      undefined,
      error,
    )
  }
}

export const getEpicGamesAccessToken = async (
  code: string,
  serverRequest?: NextApiRequest,
): Promise<string> => {
  try {
    const axios = await getAxiosInstance(serverRequest)
    const response = await axios.get(`/epicGames/oauth/callback?code=${code}`)
    return response.data.access_token
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.SERVER,
      'Failed to exchange Epic Games OAuth code for token',
      undefined,
      error,
    )
  }
}

export const linkEpicGamesAccount = async (accessToken: string, serverRequest?: NextApiRequest) => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    const response = await axios.post(`/epicGames/link_account/${accessToken}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to link Epic Games account', undefined, error)
  }
}
