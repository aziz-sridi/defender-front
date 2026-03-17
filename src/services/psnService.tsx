import { NextApiRequest } from 'next'

import { getAxiosInstance } from '@/lib/api/axiosConfig'
import { ApiError } from '@/lib/api/errors'
import { ApiErrorType } from '@/lib/api/constants'

export const fetchPsnProfile = async (username: string, serverRequest?: NextApiRequest) => {
  try {
    const axios = await getAxiosInstance(serverRequest)
    const response = await axios.get(`/psn/getProfile/${username}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to fetch PSN profile', undefined, error)
  }
}

export const linkPsnAccount = async (
  psnData: {
    psnId: string
    username: string
    avatar: string
  },
  serverRequest?: NextApiRequest,
) => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    const response = await axios.post('/psn/link_account', psnData)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to link PSN account', undefined, error)
  }
}
