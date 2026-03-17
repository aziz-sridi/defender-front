import { NextApiRequest } from 'next'

import { getAxiosInstance } from '@/lib/api/axiosConfig'
import { ApiErrorType } from '@/lib/api/constants'
import { ApiError } from '@/lib/api/errors'
import { Tournament } from '@/types/tournamentType'

const BASE_PATH = '/tournament'

export const getAllTournaments = async (serverRequest?: NextApiRequest) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest)
    const response = await axiosInstance.get(`${BASE_PATH}/all`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while fetching tournaments',
      undefined,
      error,
    )
  }
}

export const getAllTournamentsPaginated = async (
  page = 1,
  limit = 10,
  serverRequest?: NextApiRequest,
) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest)
    const response = await axiosInstance.get(`${BASE_PATH}/all?page=${page}&limit=${limit}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while fetching tournaments (paginated)',
      undefined,
      error,
    )
  }
}

export const getTournamentById = async (id: string, serverRequest?: NextApiRequest) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest)
    const response = await axiosInstance.get(`${BASE_PATH}/getById/${id}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while fetching tournament by ID',
      undefined,
      error,
    )
  }
}

export const createTournament = async (
  organizationId: string,
  data: FormData,
  serverRequest?: NextApiRequest,
) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.post(
      `${BASE_PATH}/createTournament/${organizationId}`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
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
      'Network error occurred while creating the tournament',
      undefined,
      error,
    )
  }
}

export const createTournamentByAdmin = async (data: FormData, serverRequest?: NextApiRequest) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.post(`${BASE_PATH}/createbyadmin`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while creating tournament by admin',
      undefined,
      error,
    )
  }
}

export const updateTournament = async (
  idTournament: string,
  data: FormData | Record<string, unknown>,
  serverRequest?: NextApiRequest,
) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)

    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData
    const headers = isFormData
      ? { 'Content-Type': 'multipart/form-data' }
      : { 'Content-Type': 'application/json' }

    const response = await axiosInstance.put(
      `${BASE_PATH}/updateTournament/${idTournament}`,
      data,
      { headers },
    )
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while updating the tournament',
      undefined,
      error,
    )
  }
}

export const updateTournamentPics = async (
  idTournament: string,
  tournamentPics: string[],
  serverRequest?: NextApiRequest,
) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.put(
      `${BASE_PATH}/updatePics/${idTournament}`,
      {
        TournamentPics: tournamentPics,
      },
      {
        headers: {
          'Content-Type': 'application/json',
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
      'Network error occurred while updating tournament pictures',
      undefined,
      error,
    )
  }
}

export const updateTournamentById = async (
  id: string,
  data: FormData,
  serverRequest?: NextApiRequest,
) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.put(`${BASE_PATH}/update/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while updating tournament by ID',
      undefined,
      error,
    )
  }
}
export const getTournamentsByGameId = async (gameId: string, serverRequest?: NextApiRequest) => {
  try {
    // Use getAllTournaments and filter by game on the frontend since /bygame endpoint may not exist
    const allTournamentsData = await getAllTournaments(serverRequest)
    const allTournaments = Array.isArray(allTournamentsData?.tournaments)
      ? allTournamentsData.tournaments
      : Array.isArray(allTournamentsData)
        ? allTournamentsData
        : []

    // Filter tournaments by game ID
    const gameTournaments = allTournaments.filter((tournament: any) => {
      // Handle different possible structures for the game field
      const tournamentGameId = tournament.game?._id || tournament.game || tournament.gameId
      return tournamentGameId === gameId
    })

    return { tournaments: gameTournaments }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while fetching tournaments by game',
      undefined,
      error,
    )
  }
}

export const getTournamentsByOrganizationId = async (
  organizationId: string,
  page = 1,
  limit = 10,
  options?: { status?: string; game?: string; search?: string; sort?: string },
  serverRequest?: NextApiRequest,
) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest)
    const params = new URLSearchParams()
    params.set('page', String(page))
    params.set('limit', String(limit))
    if (options?.status) params.set('status', options.status)
    if (options?.game) params.set('game', options.game)
    if (options?.search) params.set('search', options.search)
    if (options?.sort) params.set('sort', options.sort)

    const response = await axiosInstance.get(
      `${BASE_PATH}/byorganization/${organizationId}?${params.toString()}`,
    )
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while fetching tournaments by organization',
      undefined,
      error,
    )
  }
}

export const getTournamentsByOrganizerId = async (
  userId: string,
  serverRequest?: NextApiRequest,
) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest)
    const response = await axiosInstance.get(`${BASE_PATH}/byorganizer/${userId}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while fetching tournaments by organizer',
      undefined,
      error,
    )
  }
}

export const getTournamentsByOrganizerIdPaginated = async (
  userId: string,
  page = 1,
  limit = 10,
  serverRequest?: NextApiRequest,
) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest)
    const response = await axiosInstance.get(
      `${BASE_PATH}/byorganizer/${userId}?page=${page}&limit=${limit}`,
    )
    // Normalize to a standard shape
    const data = response.data
    const originalItems = Array.isArray(data?.tournaments)
      ? data.tournaments
      : Array.isArray(data)
        ? data
        : []
    const hasMeta =
      typeof data?.total === 'number' ||
      typeof data?.totalPages === 'number' ||
      typeof data?.page === 'number'
    const total = typeof data?.total === 'number' ? data.total : originalItems.length
    const totalPages =
      typeof data?.totalPages === 'number' ? data.totalPages : Math.ceil(total / limit)
    const start = (page - 1) * limit
    const end = start + limit
    const items = hasMeta ? originalItems : originalItems.slice(start, end)
    return { items, total, page, limit, totalPages }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while fetching tournaments by organizer (paginated)',
      undefined,
      error,
    )
  }
}

export const deleteTournament = async (id: string, serverRequest?: NextApiRequest) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.delete(`${BASE_PATH}/delete/${id}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while deleting the tournament',
      undefined,
      error,
    )
  }
}

export const archiveTournament = async (id: string, serverRequest?: NextApiRequest) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.delete(`${BASE_PATH}/achieve/${id}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while archiving the tournament',
      undefined,
      error,
    )
  }
}

export const startTournament = async (id: string, serverRequest?: NextApiRequest) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.post(`${BASE_PATH}/startTournament/${id}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while starting the tournament',
      undefined,
      error,
    )
  }
}

export const uploadTournamentImage = async (
  file: File,
  serverRequest?: NextApiRequest,
): Promise<string> => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const formData = new FormData()
    formData.append('tournamentImage', file)

    const response = await axiosInstance.post(`${BASE_PATH}/upload-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data.imageUrl || response.data.url
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,

      'Network error occurred while uploading tournament image',
      undefined,
      error,
    )
  }
}
export const getTournamentsByUserParticipation = async (
  userId: string,
  serverRequest?: NextApiRequest,
) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest)
    const response = await axiosInstance.get(`${BASE_PATH}/byUserParticipant/${userId}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,

      'Network error occurred while uploading tournament image',
      undefined,
      error,
    )
  }
}

export const getTournamentsByUserParticipationPaginated = async (
  userId: string,
  page = 1,
  limit = 10,
  serverRequest?: NextApiRequest,
) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest)
    const response = await axiosInstance.get(
      `${BASE_PATH}/byUserParticipant/${userId}?page=${page}&limit=${limit}`,
    )
    const data = response.data
    const originalItems = Array.isArray(data?.tournaments)
      ? data.tournaments
      : Array.isArray(data)
        ? data
        : []
    const hasMeta =
      typeof data?.total === 'number' ||
      typeof data?.totalPages === 'number' ||
      typeof data?.page === 'number'
    const total = typeof data?.total === 'number' ? data.total : originalItems.length
    const totalPages =
      typeof data?.totalPages === 'number' ? data.totalPages : Math.ceil(total / limit)
    const start = (page - 1) * limit
    const end = start + limit
    const items = hasMeta ? originalItems : originalItems.slice(start, end)
    return { items, total, page, limit, totalPages }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while fetching participation tournaments (paginated)',
      undefined,
      error,
    )
  }
}
// Check if user is part of any participant in a tournament
export const checkIfUserInTournament = async (
  tournamentId: string,
  userId: string,
  serverRequest?: NextApiRequest,
): Promise<boolean> => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest)
    const tournamentResponse = await axiosInstance.get<Tournament>(
      `/tournament/getById/${tournamentId}?populateParticipants=true`,
    )

    const participants = tournamentResponse.data.participants || []

    return participants.some(p => p.teamMembers?.includes(userId) || p.user?._id === userId)
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while checking user participation',
      undefined,
      error,
    )
  }
}

// Get the participant ID for the current user
export const getActualUserParticipantId = async (
  tournamentId: string,
  userId: string,
  serverRequest?: NextApiRequest,
): Promise<string | null> => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest)
    const tournamentResponse = await axiosInstance.get<Tournament>(
      `/tournament/getById/${tournamentId}?populateParticipants=true`,
    )

    const participants = tournamentResponse.data.participants || []

    const userParticipant = participants.find(
      p => p.teamMembers?.includes(userId) || p.user?._id === userId,
    )

    return userParticipant?._id || null
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while fetching participant ID',
      undefined,
      error,
    )
  }
}

export const uploadTournamentImages = async (
  files: File[],
  serverRequest?: NextApiRequest,
): Promise<string[]> => {
  try {
    const uploadPromises = files.map(file => uploadTournamentImage(file, serverRequest))

    const imageUrls = await Promise.all(uploadPromises)
    return imageUrls
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while uploading tournament images',
      undefined,
      error,
    )
  }
}
