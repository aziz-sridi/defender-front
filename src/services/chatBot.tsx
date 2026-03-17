import { NextApiRequest } from 'next'

import { getAxiosInstance } from '@/lib/api/axiosConfig'
import { ApiError } from '@/lib/api/errors'
import { ApiErrorType } from '@/lib/api/constants'

export const sendMessageToBot = async (
  data: { message: string; sessionId: string },
  serverRequest?: NextApiRequest,
) => {
  try {
    const axios = await getAxiosInstance(serverRequest)
    const response = await axios.post('/bot/message', data)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to send message to bot', undefined, error)
  }
}

export const getChatHistory = async (sessionId: string, serverRequest?: NextApiRequest) => {
  try {
    const axios = await getAxiosInstance(serverRequest)
    const response = await axios.get(`/bot/history/${sessionId}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to fetch chat history', undefined, error)
  }
}
