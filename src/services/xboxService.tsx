import { NextApiRequest } from 'next'

import { getAxiosInstance } from '@/lib/api/axiosConfig'
import { ApiErrorType } from '@/lib/api/constants'
import { ApiError } from '@/lib/api/errors'

export const getXboxProfileByGamertag = async (
  gamerTag: string,
  serverRequest?: NextApiRequest,
) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest)
    const response = await axiosInstance.get(`/xbox/getProfile/${gamerTag}`)
    return response.data
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw error
    }
    const e = error as { response?: { data?: { message?: string } } }
    const message = e.response?.data?.message || 'Error fetching Xbox profile'

    throw new ApiError(ApiErrorType.SERVER, message)
  }
}

export const linkXboxAccount = async (xuid: string, serverRequest?: NextApiRequest) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.post(`/xbox/link_account/${xuid}`)
    return response.data
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw error
    }
    const e = error as { response?: { data?: { message?: string } } }
    const message = e.response?.data?.message || 'Error linking Xbox account'

    throw new ApiError(ApiErrorType.SERVER, message)
  }
}
