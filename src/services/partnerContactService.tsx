import { NextApiRequest } from 'next'

import { getAxiosInstance } from '@/lib/api/axiosConfig'
import { ApiErrorType } from '@/lib/api/constants'
import { ApiError } from '@/lib/api/errors'
import { PartnerContact } from '@/types/partnerContactType'

const BASE_PATH = '/partner-contact'

export const submitPartnerContact = async (
  data: Omit<PartnerContact, '_id' | 'createdAt'>,
  serverRequest?: NextApiRequest,
) => {
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
      'Network error occurred while submitting partner contact',
      undefined,
      error,
    )
  }
}

export const getAllPartnerContacts = async (
  serverRequest?: NextApiRequest,
): Promise<PartnerContact[]> => {
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
      'Network error occurred while retrieving partner contacts',
      undefined,
      error,
    )
  }
}
