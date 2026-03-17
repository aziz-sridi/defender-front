import { NextApiRequest } from 'next'

import { getAxiosInstance } from '@/lib/api/axiosConfig'
import { ApiErrorType } from '@/lib/api/constants'
import { ApiError } from '@/lib/api/errors'
import { Ticket } from '@/types/ticketType'

const BASE_PATH = '/ticket'

export const createTicket = async (
  payload: { message: string; matchId: string },
  serverRequest?: NextApiRequest,
): Promise<Ticket> => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.post(`${BASE_PATH}/create`, payload)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while creating a ticket',
      undefined,
      error,
    )
  }
}

export const getTicketsByTournament = async (
  tournamentId: string,
  status?: string,
  serverRequest?: NextApiRequest,
): Promise<Ticket[]> => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const query = status ? `?status=${status}` : ''
    const response = await axiosInstance.get(`${BASE_PATH}/by-tournament/${tournamentId}${query}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while fetching tickets by tournament',
      undefined,
      error,
    )
  }
}

export const takeTicket = async (
  ticketId: string,
  serverRequest?: NextApiRequest,
): Promise<Ticket> => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.put(`${BASE_PATH}/${ticketId}/take`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while taking the ticket',
      undefined,
      error,
    )
  }
}

export const resolveTicket = async (
  ticketId: string,
  serverRequest?: NextApiRequest,
): Promise<Ticket> => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.put(`${BASE_PATH}/${ticketId}/resolve`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while resolving the ticket',
      undefined,
      error,
    )
  }
}
