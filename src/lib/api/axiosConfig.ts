import axios, { AxiosInstance, AxiosError } from 'axios'
import { NextApiRequest } from 'next'

import { BASE_URL } from './constants'
import { ApiError } from './errors'
import { ApiErrorType } from './constants'
import { fetchToken } from './auth'

const instanceCache = new WeakMap<NextApiRequest | object, AxiosInstance>()

export const getAxiosInstance = async (
  serverRequest?: NextApiRequest,
  requireAuth = false,
): Promise<AxiosInstance> => {
  const cacheKey = serverRequest || {}

  if (instanceCache.has(cacheKey)) {
    return instanceCache.get(cacheKey)!
  }

  const token = requireAuth ? await fetchToken(serverRequest) : null

  if (requireAuth && !token) {
    throw new ApiError(ApiErrorType.AUTH, 'Authentication required - no valid token found', 401)
  }

  const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })

  instance.interceptors.response.use(
    response => response,
    (error: AxiosError) => {
      const { response, request } = error

      if (response) {
        const { status, data } = response
        let errorType = ApiErrorType.SERVER
        let defaultMessage = 'Server error occurred'

        // Try to extract a meaningful message from the server response
        const extractMessage = (d: unknown): string | undefined => {
          if (!d) {
            return undefined
          }
          if (typeof d === 'string') {
            return d
          }
          if (typeof d === 'object') {
            const obj = d as Record<string, unknown>
            if (typeof obj.message === 'string' && obj.message.trim()) {
              return obj.message
            }
            if (typeof obj.error === 'string' && obj.error.trim()) {
              return obj.error
            }
            if (typeof obj.msg === 'string' && obj.msg.trim()) {
              return obj.msg
            }
            if (Array.isArray(obj.errors) && obj.errors.length > 0) {
              const first = obj.errors[0] as { msg?: string; message?: string } | undefined
              if (first && typeof first.msg === 'string' && first.msg.trim()) {
                return first.msg
              }
              if (first && typeof first.message === 'string' && first.message.trim()) {
                return first.message
              }
            }
          }
          return undefined
        }

        const messageFromServer = extractMessage(data)

        if (status >= 400 && status < 500) {
          errorType = ApiErrorType.CLIENT
          defaultMessage = 'Client error occurred'
          if ([401, 403].includes(status)) {
            errorType = ApiErrorType.AUTH
            defaultMessage = 'Authentication failed'
          } else if (status === 422) {
            errorType = ApiErrorType.VALIDATION
            defaultMessage = 'Validation failed'
          }
        }

        const message = messageFromServer || defaultMessage
        throw new ApiError(errorType, message, status, error, data)
      }

      if (request) {
        throw new ApiError(
          ApiErrorType.NETWORK,
          'Network error - no response received',
          undefined,
          error,
        )
      }

      throw new ApiError(ApiErrorType.CLIENT, 'Request setup error', undefined, error)
    },
  )

  instanceCache.set(cacheKey, instance)
  return instance
}
