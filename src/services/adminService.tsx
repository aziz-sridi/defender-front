import { NextApiRequest } from 'next'

import { getAxiosInstance } from '@/lib/api/axiosConfig'
import { ApiError } from '@/lib/api/errors'
import { ApiErrorType } from '@/lib/api/constants'
import type { User } from '@/types/userType'

export const signUpAdmin = async (
  data: {
    fullname: string
    phone?: number
    nickname: string
    email: string
    password: string
  },
  serverRequest?: NextApiRequest,
) => {
  try {
    const axios = await getAxiosInstance(serverRequest)
    const response = await axios.post('/user/signupAdmin', data)
    return response.data
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Error signing up admin', undefined, error)
  }
}

export const getAllAdmins = async (serverRequest?: NextApiRequest): Promise<User[]> => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    const response = await axios.get('/user/getAllAdmin')
    return response.data
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to fetch admin list', undefined, error)
  }
}

export const countAdmins = async (serverRequest?: NextApiRequest): Promise<number> => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    const response = await axios.get('/user/CountAdmin')
    return response.data
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to count admins', undefined, error)
  }
}
