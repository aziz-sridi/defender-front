import { NextApiRequest } from 'next'

import { getAxiosInstance } from '@/lib/api/axiosConfig'
import { ApiErrorType } from '@/lib/api/constants'
import { ApiError } from '@/lib/api/errors'
import { Review } from '@/types/reviewType'

const BASE_PATH = '/reviews'

export const addReview = async (
  tournamentId: string,
  data: { rating: number; feedback?: string },
  serverRequest?: NextApiRequest,
): Promise<Review> => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.post(`${BASE_PATH}/${tournamentId}`, data)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while adding review',
      undefined,
      error,
    )
  }
}

export const getReviewsByTournament = async (
  tournamentId: string,
  serverRequest?: NextApiRequest,
): Promise<Review[]> => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest)
    const response = await axiosInstance.get(`${BASE_PATH}/by-tournament/${tournamentId}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while fetching reviews by tournament',
      undefined,
      error,
    )
  }
}

export const getOrganizationClassmentByReview = async (
  page = 1,
  limit = 10,
  serverRequest?: NextApiRequest,
): Promise<{
  totalPages: number
  currentPage: number
  organizations: {
    name: string
    rating: number
    tournamentCount: number
    logo: string
    bannerImage: string
  }[]
}> => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest)
    const response = await axiosInstance.get(
      `${BASE_PATH}/classment-by-organization?page=${page}&limit=${limit}`,
    )
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while fetching organization classment',
      undefined,
      error,
    )
  }
}
