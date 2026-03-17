import { NextApiRequest } from 'next'

import { getAxiosInstance } from '@/lib/api/axiosConfig'
import { ApiError } from '@/lib/api/errors'
import { ApiErrorType } from '@/lib/api/constants'
import { Feedback } from '@/types/feedbackType'

const BASE_PATH = '/feedback'

export const submitFeedback = async (
  data: Omit<Feedback, '_id' | 'createdAt'>,
  serverRequest?: NextApiRequest,
): Promise<Feedback> => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest)
    const response = await axiosInstance.post(BASE_PATH, data)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while submitting feedback',
      undefined,
      error,
    )
  }
}

export const getAllFeedbacks = async (serverRequest?: NextApiRequest): Promise<Feedback[]> => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.get(BASE_PATH)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while retrieving feedbacks',
      undefined,
      error,
    )
  }
}
