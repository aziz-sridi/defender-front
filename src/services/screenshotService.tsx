import { NextApiRequest } from 'next'

import { getAxiosInstance } from '@/lib/api/axiosConfig'
import { ApiErrorType } from '@/lib/api/constants'
import { ApiError } from '@/lib/api/errors'

// Note: The backend exposes screenshot validation under /match/* routes
const BASE_PATH = '/screenshots'

export const validateScreenShot = async (
  matchId: string,
  screenshotId: string,
  serverRequest?: NextApiRequest,
): Promise<string> => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    // Backend route: /match/validate-screenshot/:matchId/:screenshotId
    const response = await axiosInstance.put(
      `/match/validate-screenshot/${matchId}/${screenshotId}`,
    )
    return response.data.imageUrl || response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while validating screenshot',
      undefined,
      error,
    )
  }
}

export const invalidateScreenshot = async (
  matchId: string,
  screenshotId: string,
  serverRequest?: NextApiRequest,
): Promise<string> => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    // Backend route: /match/invalidate-screenshot/:matchId/:screenshotId
    const response = await axiosInstance.delete(
      `/match/invalidate-screenshot/${matchId}/${screenshotId}`,
    )
    return response.data.message || response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while invalidating screenshot',
      undefined,
      error,
    )
  }
}

export const uploadScreenshot = async (
  matchId: string,
  setNumber: number,
  file: File,
  serverRequest?: NextApiRequest,
): Promise<string> => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const formData = new FormData()
    formData.append('screenshot', file)
    formData.append('setNumber', setNumber.toString())

    const response = await axiosInstance.post(`${BASE_PATH}/upload/${matchId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data.imageUrl || response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while uploading screenshot',
      undefined,
      error,
    )
  }
}

export const getScreenshotsByMatch = async (
  matchId: string,
  serverRequest?: NextApiRequest,
): Promise<any[]> => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest)
    const response = await axiosInstance.get(`${BASE_PATH}/match/${matchId}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while fetching screenshots',
      undefined,
      error,
    )
  }
}
