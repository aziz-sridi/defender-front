import { NextApiRequest } from 'next'

import { getAxiosInstance } from '@/lib/api/axiosConfig'
import { ApiError } from '@/lib/api/errors'
import { ApiErrorType } from '@/lib/api/constants'

export const linkOriginAccount = async (username: string, serverRequest?: NextApiRequest) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)

    const response = await axiosInstance.post('/origin/link_account', {
      username,
    })

    return response.data
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Error linking Origin account', undefined, error)
  }
}
