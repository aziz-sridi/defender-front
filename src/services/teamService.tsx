import { NextApiRequest } from 'next'

import { getAxiosInstance } from '@/lib/api/axiosConfig'
import { ApiError } from '@/lib/api/errors'
import { ApiErrorType } from '@/lib/api/constants'
import { Team } from '@/types/teamType'

export const getAllTeams = async (
  gameId?: string,
  serverRequest?: NextApiRequest,
): Promise<Team[]> => {
  try {
    const axios = await getAxiosInstance(serverRequest)
    const response = await axios.get('/team/teams', { params: gameId ? { game: gameId } : {} })
    return response.data as Team[]
  } catch (error) {
    throw new ApiError(ApiErrorType.SERVER, 'Failed to fetch all teams', undefined, error)
  }
}

export const getTeamsByUserId = async (
  userId: string,
  serverRequest?: NextApiRequest,
): Promise<Team[]> => {
  try {
    const axios = await getAxiosInstance(serverRequest)
    const response = await axios.get(`/team/user/${userId}`)
    return response.data as Team[]
  } catch (error) {
    throw new ApiError(ApiErrorType.SERVER, 'Failed to fetch user teams', undefined, error)
  }
}

export const getTeamById = async (
  teamId: string,
  serverRequest?: NextApiRequest,
): Promise<Team> => {
  try {
    const axios = await getAxiosInstance(serverRequest)
    const response = await axios.get(`/team/${teamId}`)
    return response.data /* as Team */
  } catch (error) {
    throw new ApiError(ApiErrorType.SERVER, 'Failed to fetch team by ID', undefined, error)
  }
}
export const getTournamentsByTeamId = async (
  teamId: string,
  serverRequest?: NextApiRequest,
): Promise<unknown[]> => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    const response = await axios.get(`/team/getTournamentsByTeam/${teamId}`)
    return response.data as unknown[] // or use Tournament[] if you have a type
  } catch (error) {
    throw new ApiError(
      ApiErrorType.SERVER,
      'Failed to fetch tournaments by team ID',
      undefined,
      error,
    )
  }
}

export const contactTeam = async (
  teamId: string,
  message: string,
  serverRequest?: NextApiRequest,
): Promise<unknown> => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    const response = await axios.post(`/team/contactTeam/${teamId}`, {
      message,
    })
    return response.data
  } catch (error) {
    throw new ApiError(ApiErrorType.SERVER, 'Failed contact team', undefined, error)
  }
}

export const createTeam = async (
  data: FormData | Record<string, unknown>,
  serverRequest?: NextApiRequest,
): Promise<Team> => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData
    const response = await axios.post('/team/createTeam', data, {
      headers: { 'Content-Type': isFormData ? 'multipart/form-data' : 'application/json' },
    })
    const payload = response.data?.newTeam ?? response.data?.team ?? response.data
    return payload as Team
  } catch (error: unknown) {
    interface AxiosLikeErrorData {
      message?: string
      error?: string
      errors?: Array<{ message?: string; msg?: string }>
    }
    interface AxiosLikeError {
      response?: { data?: AxiosLikeErrorData }
      message?: string
    }
    const axiosErr = error as AxiosLikeError
    const dataResp = axiosErr.response?.data
    const serverMsg =
      (typeof dataResp === 'string' && dataResp) ||
      dataResp?.message ||
      dataResp?.error ||
      (Array.isArray(dataResp?.errors) && (dataResp.errors[0]?.message || dataResp.errors[0]?.msg))
    if (serverMsg) {
      axiosErr.message = serverMsg
    }
    throw axiosErr
  }
}
export const leaveTeam = async (teamId: string, serverRequest?: NextApiRequest): Promise<void> => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    await axios.post(`/team/leaveTeam/${teamId}`)
  } catch (error) {
    throw new ApiError(ApiErrorType.SERVER, 'Failed to leave team', undefined, error)
  }
}

export const updateTeam = async (
  teamId: string,
  data: FormData | Record<string, unknown>,
  serverRequest?: NextApiRequest,
): Promise<Team> => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    let response
    if (typeof FormData !== 'undefined' && data instanceof FormData) {
      response = await axios.put(`/team/updateteam/${teamId}`, data)
    } else {
      response = await axios.put(`/team/updateteam/${teamId}`, data)
    }
    return (response.data?.team || response.data) as Team
  } catch (error) {
    throw new ApiError(ApiErrorType.SERVER, 'Failed to update team', undefined, error)
  }
}

export const inviteToTeam = async (
  teamId: string,
  userId: string,
  message: string,
  serverRequest?: NextApiRequest,
): Promise<void> => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    await axios.post(`/team/inviteToTeam/${teamId}/${userId}`, { message })
  } catch (error: unknown) {
    const e = error as { response?: { data?: { message?: string } } }
    const originalMessage = e.response?.data?.message || 'Failed to send team invitation'
    throw new ApiError(ApiErrorType.SERVER, originalMessage, undefined, error)
  }
}
export const joinTeam = async (teamId: string, serverRequest?: NextApiRequest): Promise<void> => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    await axios.post(`/team/joinTeam/${teamId}`)
  } catch (error) {
    throw new ApiError(ApiErrorType.SERVER, 'Failed to join team', undefined, error)
  }
}

export const acceptTeamInvitation = async (
  teamId: string,
  serverRequest?: NextApiRequest,
): Promise<void> => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    await axios.put(`/team/acceptInvitation/${teamId}`)
  } catch (error) {
    throw new ApiError(ApiErrorType.SERVER, 'Failed to accept team invitation', undefined, error)
  }
}

export const declineTeamInvitation = async (
  teamId: string,
  serverRequest?: NextApiRequest,
): Promise<void> => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    await axios.put(`/team/declineInvitation/${teamId}`)
  } catch (error) {
    throw new ApiError(ApiErrorType.SERVER, 'Failed to decline team invitation', undefined, error)
  }
}
export const removeInvitation = async (
  teamId: string,
  invitationId: string,
  serverRequest?: NextApiRequest,
): Promise<void> => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    await axios.delete(`/team/removeInvitation/${teamId}/${invitationId}`)
  } catch (error) {
    throw new ApiError(ApiErrorType.SERVER, 'Failed to remove team invitation', undefined, error)
  }
}
export const removePlayerFromTeam = async (
  teamId: string,
  userId: string,
  serverRequest?: NextApiRequest,
): Promise<void> => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    await axios.delete(`/team/removeplayer/${userId}/${teamId}`)
  } catch (error) {
    throw new ApiError(ApiErrorType.SERVER, 'Failed to remove player from team', undefined, error)
  }
}

export const archiveTeam = async (
  teamId: string,
  serverRequest?: NextApiRequest,
): Promise<void> => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    await axios.put(`/team/archieve/${teamId}`)
  } catch (error) {
    throw new ApiError(ApiErrorType.SERVER, 'Failed to archive team', undefined, error)
  }
}
export const followTeam = async (teamId: string, serverRequest?: NextApiRequest): Promise<void> => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    await axios.post(`/team/followTeam/${teamId}`)
  } catch (error) {
    throw new ApiError(ApiErrorType.SERVER, 'Failed to follow team', undefined, error)
  }
}
export const likeTeam = async (teamId: string, serverRequest?: NextApiRequest): Promise<void> => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    await axios.post(`/team/likeTeam/${teamId}`)
  } catch (error) {
    throw new ApiError(ApiErrorType.SERVER, 'Failed to like team', undefined, error)
  }
}
export const unfollowTeam = async (
  teamId: string,
  serverRequest?: NextApiRequest,
): Promise<void> => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    await axios.post(`/team/unfollowTeam/${teamId}`)
  } catch (error: unknown) {
    const e = error as { response?: { data?: { message?: string } } }
    const originalMessage = e.response?.data?.message || 'Failed to unfollow team'
    throw new ApiError(ApiErrorType.SERVER, originalMessage, undefined, error)
  }
}

export const unlikeTeam = async (teamId: string, serverRequest?: NextApiRequest): Promise<void> => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    await axios.post(`/team/unlikeTeam/${teamId}`)
  } catch (error: unknown) {
    const e = error as { response?: { data?: { message?: string } } }
    const originalMessage = e.response?.data?.message || 'Failed to unlike team'
    throw new ApiError(ApiErrorType.SERVER, originalMessage, undefined, error)
  }
}
export const changeMemberRole = async (
  teamId: string,
  userId: string,
  newRole: string,
  serverRequest?: NextApiRequest,
): Promise<void> => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    await axios.put(`/team/changeMemberRole/${teamId}/${userId}`, { newRole })
  } catch (error: unknown) {
    const e = error as { response?: { data?: { message?: string } } }
    const originalMessage = e.response?.data?.message || 'Failed to change member role'
    throw new ApiError(ApiErrorType.SERVER, originalMessage, undefined, error)
  }
}
export const acceptTeamRequest = async (
  teamId: string,
  userId: string,
  serverRequest?: NextApiRequest,
): Promise<void> => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    await axios.put(`/team/acceptTeamRequest/${teamId}/${userId}`)
  } catch (error: unknown) {
    const e = error as { response?: { data?: { message?: string } } }
    const originalMessage = e.response?.data?.message || 'Failed to accept team request'
    throw new ApiError(ApiErrorType.SERVER, originalMessage, undefined, error)
  }
}

export const declineTeamRequest = async (
  teamId: string,
  userId: string,
  serverRequest?: NextApiRequest,
): Promise<void> => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    await axios.put(`/team/declineTeamRequest/${teamId}/${userId}`)
  } catch (error: unknown) {
    const e = error as { response?: { data?: { message?: string } } }
    const originalMessage = e.response?.data?.message || 'Failed to decline team request'
    throw new ApiError(ApiErrorType.SERVER, originalMessage, undefined, error)
  }
}
export const transferOwnership = async (
  teamId: string,
  userId: string,
  serverRequest?: NextApiRequest,
): Promise<void> => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    await axios.post(`/team/transferOwnership/${teamId}/${userId}`)
  } catch (error: unknown) {
    const e = error as { response?: { data?: { message?: string } } }
    const originalMessage = e.response?.data?.message || 'Failed to transfer team ownership'
    throw new ApiError(ApiErrorType.SERVER, originalMessage, undefined, error)
  }
}
