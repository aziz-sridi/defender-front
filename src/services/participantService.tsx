import { NextApiRequest } from 'next'

import { getAxiosInstance } from '@/lib/api/axiosConfig'
import { ApiError } from '@/lib/api/errors'
import { ApiErrorType } from '@/lib/api/constants'

export const enrollParticipant = async (tournamentId: string, serverRequest?: NextApiRequest) => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    const response = await axios.post(`/participant/enrollTournament/${tournamentId}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to enroll participant', undefined, error)
  }
}

export const participateAsTeam = async (
  tournamentId: string,
  data: {
    teamId: string
    teamMembers?: string[]
    substituteMembers?: string[]
  },
  serverRequest?: NextApiRequest,
) => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    const response = await axios.post(`/participant/paricipateAsTeam/${tournamentId}`, data)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to participate as team', undefined, error)
  }
}

export const getParticipantById = async (participantId: string, serverRequest?: NextApiRequest) => {
  try {
    const axios = await getAxiosInstance(serverRequest)
    const response = await axios.get(`/participant/getParticipantById/${participantId}`)
    return response.data.participant
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to get participant', undefined, error)
  }
}

export const getParticipantsByTournament = async (
  tournamentId: string,
  serverRequest?: NextApiRequest,
) => {
  try {
    const axios = await getAxiosInstance(serverRequest)
    const response = await axios.get(`/participant/getParticipantsByTournament/${tournamentId}`)
    return response.data.participants
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to get participants', undefined, error)
  }
}

export const cancelParticipation = async (
  tournamentId: string,
  participantId: string,
  serverRequest?: NextApiRequest,
) => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    const response = await axios.delete(
      `/participant/cancelparticipate/${tournamentId}/${participantId}`,
    )
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to cancel participation', undefined, error)
  }
}

export const checkInParticipant = async (participantId: string, serverRequest?: NextApiRequest) => {
  try {
    const axios = await getAxiosInstance(serverRequest)
    const response = await axios.post(`/participant/checkin/${participantId}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to check in participant', undefined, error)
  }
}

export const updateParticipantStatus = async (
  tournamentId: string,
  participantId: string,
  newStatus: 'Registered' | 'Pending' | 'Rejected',
  serverRequest?: NextApiRequest,
) => {
  try {
    const axios = await getAxiosInstance(serverRequest)
    const response = await axios.put(
      `/participant/updateParticipantStatus/${tournamentId}/${participantId}/${newStatus}`,
    )
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to update participant status', undefined, error)
  }
}

export const verifySoloParticipantPayment = async (
  paymentId: string,
  userId: string,
  tournamentId: string,
  serverRequest?: NextApiRequest,
) => {
  try {
    const axios = await getAxiosInstance(serverRequest)
    const response = await axios.get(
      `/participant/verifySoloParticipantPayment/${paymentId}/${userId}/${tournamentId}`,
    )
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.SERVER,
      'Failed to verify solo participant payment',
      undefined,
      error,
    )
  }
}

export const verifyTeamMemberPayment = async (
  paymentRef: string,
  participantId: string,
  serverRequest?: NextApiRequest,
) => {
  try {
    const axios = await getAxiosInstance(serverRequest)
    const response = await axios.get(
      `/participant/verifyTeamMemberPayment/${paymentRef}/${participantId}`,
    )
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.SERVER,
      'Failed to verify team member payment',
      undefined,
      error,
    )
  }
}

export const kickParticipant = async (
  tournamentId: string,
  participantId: string,
  serverRequest?: NextApiRequest,
) => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    const response = await axios.delete(
      `/participant/kickParticipant/${tournamentId}/${participantId}`,
    )
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to kick participant', undefined, error)
  }
}
