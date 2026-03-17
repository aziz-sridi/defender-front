import { NextApiRequest } from 'next'

import { getAxiosInstance } from '@/lib/api/axiosConfig'
import { ApiError } from '@/lib/api/errors'
import { ApiErrorType } from '@/lib/api/constants'

export const getDefendrRedClassment = async (
  page = 1,
  limit = 10,
  serverRequest?: NextApiRequest,
) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest)
    const response = await axiosInstance.get('/DefendrRed/classment', {
      params: { page, limit },
    })

    return response.data
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw error
    }

    throw new ApiError(
      ApiErrorType.SERVER,
      'Failed to fetch Defendr Red classment',
      undefined,
      error,
    )
  }
}
