import { NextApiRequest } from 'next'

import { getAxiosInstance } from '@/lib/api/axiosConfig'
import { ApiErrorType } from '@/lib/api/constants'
import { ApiError } from '@/lib/api/errors'

const BASE_PATH = '/Stripe'

export const requestPayout = async (
  amount: number,
  serverRequest?: NextApiRequest,
): Promise<{ message: string; payout: any }> => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.post(`${BASE_PATH}/payout`, { amount })
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while requesting payout',
      undefined,
      error,
    )
  }
}
