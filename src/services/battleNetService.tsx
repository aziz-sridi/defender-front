import { NextApiRequest } from 'next'

import { getAxiosInstance } from '@/lib/api/axiosConfig'
import { ApiError } from '@/lib/api/errors'
import { ApiErrorType } from '@/lib/api/constants'

export const getBattleNetOAuthLink = async (
  test = false,
  serverRequest?: NextApiRequest,
): Promise<string> => {
  try {
    const axios = await getAxiosInstance(serverRequest)
    const response = await axios.get(`/battleNet/oauth${test ? '?test=true' : ''}`)
    return response.request.responseURL
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }

    throw new ApiError(
      ApiErrorType.NETWORK,
      'Failed to initiate Battle.net OAuth',
      undefined,
      error,
    )
  }
}

export const handleBattleNetOAuthCallback = async (
  code: string,
  region: string,
  test = false,
  serverRequest?: NextApiRequest,
): Promise<{ access_token: string; code: string }> => {
  try {
    const axios = await getAxiosInstance(serverRequest)
    const url = `/battleNet/oauth/callback?code=${code}&region=${region}${test ? '&test=true' : ''}`
    const response = await axios.get(url)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }

    throw new ApiError(
      ApiErrorType.SERVER,
      'Failed to handle Battle.net OAuth callback',
      undefined,
      error,
    )
  }
}

export const getBattleNetAccessToken = async (
  authorizationCode: string,
  region: string,
  serverRequest?: NextApiRequest,
): Promise<string> => {
  try {
    const axios = await getAxiosInstance(serverRequest)
    const response = await axios.get(`/battleNet/acces_token/${authorizationCode}/${region}`)
    return response.data.access_token
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }

    throw new ApiError(
      ApiErrorType.SERVER,
      'Failed to get Battle.net access token',
      undefined,
      error,
    )
  }
}

export const linkBattleNetAccount = async (
  accessToken: string,
  region: string,
  serverRequest?: NextApiRequest,
): Promise<any> => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    const response = await axios.post(`/battleNet/link_account/${accessToken}/${region}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }

    throw new ApiError(ApiErrorType.SERVER, 'Failed to link Battle.net account', undefined, error)
  }
}
