import { NextApiRequest } from 'next'

import { getAxiosInstance } from '@/lib/api/axiosConfig'
import { ApiErrorType } from '@/lib/api/constants'
import { ApiError } from '@/lib/api/errors'
import { Participant } from '@/types/participantType'

const BASE_PATH = '/Tournament/join-tournament'

export type PlayerType = 'MAIN' | 'SUBSTITUTE'

type JoinTournamentResponse = {
  success: boolean
  message: string
  participant: Participant
}

type BasicTournamentResponse = {
  success: boolean
  message: string
}

type FreeAgentRequestResponse = {
  success: boolean
  message: string
}

type PlayerConfirmInvit = {
  success: boolean
  message: string
  tournamentId: string
}

type ChangeParticipantStatusResponse = {
  success: boolean
  message: string
  participant: Participant
}

type ParticipantIsJoinedResponse = {
  success: boolean
  message: string
  isJoined: boolean
  participantStatus: string
}

type UpdateUserDataResponse = {
  success: boolean
  message: string
  user: any
}

export const joinTournament = async (
  tournamentId: string,
  teamId?: string,
  serverRequest?: NextApiRequest,
): Promise<JoinTournamentResponse> => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.post(`${BASE_PATH}`, { tournamentId, teamId })
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,

      'Network error occurred while joining tournament',
      undefined,
      error,
    )
  }
}

export const invitePlayerToTournament = async (
  playerId: string,
  participantId: string,
  playerType: PlayerType,
  isFreeAgent = false,
  serverRequest?: NextApiRequest,
): Promise<BasicTournamentResponse> => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.post(`${BASE_PATH}/invite-player/${playerId}`, {
      participantId,
      playerType,
      isFreeAgent,
    })
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while inviting player to tournament',
      undefined,
      error,
    )
  }
}

export const playerAcceptInvitation = async (
  playerId: string,
  participantId: string,
  serverRequest?: NextApiRequest,
): Promise<BasicTournamentResponse> => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.post(`${BASE_PATH}/player-accept-invite/${playerId}`, {
      participantId,
    })
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while accepting invitation',
      undefined,
      error,
    )
  }
}

export const playerConfirmAcceptInvitation = async (
  playerId: string,
  participantId: string,
  fullname?: string,
  dob?: string,
  discordUsername?: string,
  serverRequest?: NextApiRequest,
): Promise<PlayerConfirmInvit> => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.post(
      `${BASE_PATH}/player-confirm-accept-invite/${playerId}`,
      {
        participantId,
        fullname,
        dob,
        discordUsername,
      },
    )
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while confirming invitation acceptance',
      undefined,
      error,
    )
  }
}

export const playerRejectInvitation = async (
  playerId: string,
  participantId: string,
  serverRequest?: NextApiRequest,
): Promise<BasicTournamentResponse> => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.post(`${BASE_PATH}/player-reject-invite/${playerId}`, {
      participantId,
    })
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while rejecting invitation',
      undefined,
      error,
    )
  }
}

export const updatePlayerTypeInParticipant = async (
  participantId: string,
  playerId: string,
  newPlayerType: PlayerType,
  serverRequest?: NextApiRequest,
): Promise<JoinTournamentResponse> => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.put(`${BASE_PATH}/update-player-type/${participantId}`, {
      playerId,
      newPlayerType,
    })
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while updating player type',
      undefined,
      error,
    )
  }
}

export const deletePlayerFromParticipant = async (
  participantId: string,
  playerId: string,
  serverRequest?: NextApiRequest,
): Promise<JoinTournamentResponse> => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.delete(
      `${BASE_PATH}/delete-player-from-participant/${participantId}`,
      {
        data: {
          playerId,
        },
      },
    )
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while deleting player from participant',
      undefined,
      error,
    )
  }
}

export const getParticipantStatus = async (
  participantId: string,
  serverRequest?: NextApiRequest,
): Promise<JoinTournamentResponse> => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.get(`${BASE_PATH}/get-participant-status/${participantId}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while fetching participant status',
      undefined,
      error,
    )
  }
}

export const changeParticipantStatus = async (
  participantId: string,
  status: string,
  serverRequest?: NextApiRequest,
): Promise<ChangeParticipantStatusResponse> => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.put(
      `${BASE_PATH}/change-participant-status/${participantId}`,
      {
        status,
      },
    )
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while changing participant status',
      undefined,
      error,
    )
  }
}

export const participantIsJoinedTournament = async (
  participantId: string,
  serverRequest?: NextApiRequest,
): Promise<ParticipantIsJoinedResponse> => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.get(`${BASE_PATH}/participant-is-joined/${participantId}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while checking participant join status',
      undefined,
      error,
    )
  }
}

export const requestToJoinAsFreeAgent = async (
  tournamentId: string,
  message: string,
  serverRequest?: NextApiRequest,
): Promise<FreeAgentRequestResponse> => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.post(
      `${BASE_PATH}/freeagent-request-join-tournament/${tournamentId}`,
      { message },
    )
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while requesting to join as free agent',
      undefined,
      error,
    )
  }
}

export const cancelParticipate = async (
  tournamentId: string,
  participantId: string,
  serverRequest?: NextApiRequest,
): Promise<BasicTournamentResponse> => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.delete(
      `/Participant/cancelparticipate/${tournamentId}/${participantId}`,
    )
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while canceling participation',
      undefined,
      error,
    )
  }
}

export const updateUserDataToAcceptRequirementFields = async (
  data: {
    dateOfBirth?: string
    discord?: string
    epicId?: string
    riotId?: string
    gameAccountId?: string
    steamId?: string
    phoneNumber?: string
    country?: string
    facebookLink?: string
    instagramLink?: string
  },
  serverRequest?: NextApiRequest,
): Promise<UpdateUserDataResponse> => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.put(`${BASE_PATH}/update-requirements-user-data`, data)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while updating user requirement data',
      undefined,
      error,
    )
  }
}
