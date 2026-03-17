import { NextApiRequest } from 'next'

import { getAxiosInstance } from '@/lib/api/axiosConfig'
import { ApiError } from '@/lib/api/errors'
import { ApiErrorType } from '@/lib/api/constants'

export const getSteamOAuthLink = async (serverRequest?: NextApiRequest): Promise<string> => {
  try {
    const axios = await getAxiosInstance(serverRequest)
    const response = await axios.get('/steam/auth')
    return response.request.responseURL
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Failed to fetch Steam OAuth redirect URL',
      undefined,
      error,
    )
  }
}

export const authenticateSteamUser = async (
  queryParams: string,
  serverRequest?: NextApiRequest,
) => {
  try {
    const axios = await getAxiosInstance(serverRequest)
    const response = await axios.get(`/steam/auth/authenticate?${queryParams}`)
    return response.data.user
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Steam authentication failed', undefined, error)
  }
}

export const linkSteamAccount = async (
  steamData: {
    steamId: string
    username: string
    profileUrl: string
    avatar: string
  },
  serverRequest?: NextApiRequest,
) => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    const response = await axios.post('/steam/link_account', steamData)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to link Steam account', undefined, error)
  }
}
