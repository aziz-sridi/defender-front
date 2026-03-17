import { NextApiRequest } from 'next'

import { getAxiosInstance } from '@/lib/api/axiosConfig'
import { ApiError } from '@/lib/api/errors'
import { ApiErrorType } from '@/lib/api/constants'

export const participateAsFreeAgent = async (
  tournamentId: string,
  data?: { teamId?: string },
  serverRequest?: NextApiRequest,
) => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    const response = await axios.post(`/participant/paricipateAsFreeAgent/${tournamentId}`, data)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.SERVER,
      'Failed to participate as a free agent',
      undefined,
      error,
    )
  }
}

export const getRecruitmentRequests = async (
  tournamentId: string,
  userId: string,
  serverRequest?: NextApiRequest,
) => {
  try {
    const axios = await getAxiosInstance(serverRequest)
    const response = await axios.get(
      `/participant/getRecruitmentRequests/${tournamentId}/${userId}`,
    )
    return response.data.participants
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.SERVER,
      'Failed to fetch recruitment requests',
      undefined,
      error,
    )
  }
}

export const recruitFreeAgent = async (
  participantId: string,
  userId: string,
  serverRequest?: NextApiRequest,
) => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    const response = await axios.post(`/participant/recruitFreeAgent/${participantId}/${userId}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to recruit free agent', undefined, error)
  }
}

export const acceptFreeAgentRecruitment = async (
  participantId: string,
  userId: string,
  serverRequest?: NextApiRequest,
) => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    const response = await axios.post(
      `/participant/acceptFreeAgentRecruitment/${participantId}/${userId}`,
    )
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to accept recruitment', undefined, error)
  }
}

export const removeFreeAgentFromTeam = async (
  participantId: string,
  userId: string,
  serverRequest?: NextApiRequest,
) => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    const response = await axios.delete(
      `/participant/removeFreeAgentsFromTeam/${participantId}/${userId}`,
    )
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to remove free agent', undefined, error)
  }
}

export const cancelFreeAgentRequest = async (
  participantId: string,
  userId: string,
  serverRequest?: NextApiRequest,
) => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    const response = await axios.post(
      `/participant/cancelFreeAgentRequest/${participantId}/${userId}`,
    )
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to cancel request', undefined, error)
  }
}

export const acceptFreeAgentRequest = async (
  participantId: string,
  userId: string,
  serverRequest?: NextApiRequest,
) => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    const response = await axios.post(
      `/participant/acceptFreeAgentRequest/${participantId}/${userId}`,
    )
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to accept request', undefined, error)
  }
}

export const rejectFreeAgentRequest = async (
  participantId: string,
  userId: string,
  serverRequest?: NextApiRequest,
) => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    const response = await axios.post(
      `/participant/rejectFreeAgentRequest/${participantId}/${userId}`,
    )
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to reject request', undefined, error)
  }
}

export const checkFreeAgentRequest = async (
  participantId: string,
  serverRequest?: NextApiRequest,
) => {
  try {
    const axios = await getAxiosInstance(serverRequest)
    const response = await axios.get(`/participant/checkFreeAgentRequest/${participantId}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to check request status', undefined, error)
  }
}
