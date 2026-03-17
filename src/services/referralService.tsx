import { NextApiRequest } from 'next'

import { getAxiosInstance } from '@/lib/api/axiosConfig'
import { ApiErrorType } from '@/lib/api/constants'
import { ApiError } from '@/lib/api/errors'

const BASE_PATH = '/referral'

export const generateReferralCode = async (
  serverRequest?: NextApiRequest,
): Promise<{ code: string }> => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.get(`${BASE_PATH}/generate`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while generating referral code',
      undefined,
      error,
    )
  }
}
