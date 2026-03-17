import { NextApiRequest } from 'next'

import { getAxiosInstance } from '@/lib/api/axiosConfig'
import { ApiError } from '@/lib/api/errors'
import { ApiErrorType } from '@/lib/api/constants'

export const sendTestNotification = async (userId: string, serverRequest?: NextApiRequest) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest)
    const response = await axiosInstance.get(`/notification/test/${userId}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while sending test notification',
      undefined,
      error,
    )
  }
}

export const getNotifications = async (serverRequest?: NextApiRequest) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.get('/notification/get-notifications')
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while fetching notifications',
      undefined,
      error,
    )
  }
}

export const markNotificationAsRead = async (
  notificationId: string,
  serverRequest?: NextApiRequest,
) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.post(`/notification/mark-as-read/${notificationId}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while marking notification as read',
      undefined,
      error,
    )
  }
}

export const markAllNotificationsAsRead = async (serverRequest?: NextApiRequest) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.post('/notification/mark-all-as-read')
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while marking all notifications as read',
      undefined,
      error,
    )
  }
}

export const sendNotification = async (
  userId: string,
  message: string,
  type: string,
  link?: string,
  serverRequest?: NextApiRequest,
) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.post('/notification/send-notification', {
      userId,
      message,
      type,
      link,
    })
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while sending notification',
      undefined,
      error,
    )
  }
}
