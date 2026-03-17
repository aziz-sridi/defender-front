import { NextApiRequest } from 'next'

import { getAxiosInstance } from '@/lib/api/axiosConfig'
import { ApiErrorType } from '@/lib/api/constants'
import { ApiError } from '@/lib/api/errors'
import type { Message } from '@/types/messageType'

const BASE_PATH = '/match'

export const getMessagesByMatchId = async (
  matchId: string,
  serverRequest?: NextApiRequest,
): Promise<Message[]> => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest)
    const response = await axiosInstance.get(`${BASE_PATH}/get-messages/${matchId}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while fetching messages for this match',
      undefined,
      error,
    )
  }
}

export const sendMessageToMatch = async (
  matchId: string,
  content: string,
  serverRequest?: NextApiRequest,
): Promise<Message> => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.post(`${BASE_PATH}/send-message/${matchId}`, {
      content,
    })
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while sending message',
      undefined,
      error,
    )
  }
}
