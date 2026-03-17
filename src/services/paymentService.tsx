import { NextApiRequest } from 'next'

import { getAxiosInstance } from '@/lib/api/axiosConfig'
import { ApiErrorType } from '@/lib/api/constants'
import { ApiError } from '@/lib/api/errors'

const BASE_PATH = '/Stripe/payment'
const PAYMENT_PATH = '/user/payments'
const PARTICIPATION_PATH = '/participant'

export const requestStripePayment = async (
  amount: number,
  stripeToken: string,
  serverRequest?: NextApiRequest,
): Promise<{ message: string; PaymentIntent: any }> => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.post(`${BASE_PATH}/`, {
      amount,
      stripeToken,
    })
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      {
        throw error
      }
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while processing payment',
      undefined,
      error,
    )
  }
}

export const initKonnectPayment = async (
  serverRequest?: NextApiRequest,
): Promise<{ payUrl: string; paymentRef: string }> => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.post(`${PAYMENT_PATH}/init-payment/`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while initializing payment',
      undefined,
      error,
    )
  }
}

export const getKonnectPaymentStatus = async (
  paymentId: string,
  serverRequest?: NextApiRequest,
): Promise<any> => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.get(`${PAYMENT_PATH}/${paymentId}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while checking payment status',
      undefined,
      error,
    )
  }
}

export const payParticipationAsTeamMember = async (
  participantId: string,
  serverRequest?: NextApiRequest,
): Promise<any> => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.post(
      `${PARTICIPATION_PATH}/payParticipationAsTeamMember/${participantId}`,
    )
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while paying participation as team member',
      undefined,
      error,
    )
  }
}

export const payParticipationAsTeamOwner = async (
  participantId: string,
  serverRequest?: NextApiRequest,
): Promise<any> => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.post(
      `${PARTICIPATION_PATH}/payParticipationAsTeamOwner/${participantId}`,
    )
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while paying participation as team owner',
      undefined,
      error,
    )
  }
}
