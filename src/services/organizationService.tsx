import { NextApiRequest } from 'next'

import { getAxiosInstance } from '@/lib/api/axiosConfig'
import { ApiError } from '@/lib/api/errors'
import { ApiErrorType } from '@/lib/api/constants'

export const getAllOrganizations = async (serverRequest?: NextApiRequest) => {
  try {
    const axios = await getAxiosInstance(serverRequest)
    const response = await axios.get('/organization/getallorganization')
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to fetch organizations', undefined, error)
  }
}

export const getOrganizationById = async (
  organizationId: string,
  serverRequest?: NextApiRequest,
) => {
  try {
    const axios = await getAxiosInstance(serverRequest)
    const response = await axios.get(`/organization/getOrganizationById/${organizationId}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.SERVER,
      'Failed to fetch organization details',
      undefined,
      error,
    )
  }
}

export const getJoinedOrganizations = async (serverRequest?: NextApiRequest) => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    const response = await axios.get(`/organization/getUserEnrolledOrganizations`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to get user organizations', undefined, error)
  }
}

export const inviteStaffMember = async (
  organizationId: string,
  staffId: string,
  role: string,
  serverRequest?: NextApiRequest,
) => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    const response = await axios.post(`/organization/inviteStuffMember/${organizationId}`, {
      staffId,
      role,
    })
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to invite staff member', undefined, error)
  }
}

export const acceptOrganizationInvitation = async (
  organizationId: string,
  notificationId: string,
  serverRequest?: NextApiRequest,
) => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    const response = await axios.put(
      `/organization/acceptInvitation/${organizationId}/${notificationId}`,
    )
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to accept invitation', undefined, error)
  }
}

export const declineOrganizationInvitation = async (
  organizationId: string,
  notificationId: string,
  serverRequest?: NextApiRequest,
) => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    const response = await axios.put(
      `/organization/declineInvitation/${organizationId}/${notificationId}`,
    )
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to decline invitation', undefined, error)
  }
}

export const removeStaffMember = async (
  organizationId: string,
  staffId: string,
  serverRequest?: NextApiRequest,
) => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    const response = await axios.delete(`/organization/removestuffmember/${organizationId}`, {
      data: { staffId },
    })
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to remove staff member', undefined, error)
  }
}

export const updateStaffMember = async (
  organizationId: string,
  staffId: string,
  role: string,
  serverRequest?: NextApiRequest,
) => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    const response = await axios.put(`/organization/updatestuffmember/${organizationId}`, {
      staffId,
      role,
    })
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to update staff member', undefined, error)
  }
}

export const readStaffMembers = async (organizationId: string, serverRequest?: NextApiRequest) => {
  try {
    const axios = await getAxiosInstance(serverRequest)
    const response = await axios.get(`/organization/readstuffmembers/${organizationId}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to read staff members', undefined, error)
  }
}
export const createOrganization = async (data: any, serverRequest?: NextApiRequest) => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    const response = await axios.post('/Organization/CreateOrganization/', data)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to create organization', undefined, error)
  }
}

export const createOrganizationV2 = async (data: any, serverRequest?: NextApiRequest) => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    const response = await axios.post('/Organization/CreateOrganizationV2/', data)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to create organization', undefined, error)
  }
}

export const updateOrganization = async (id: string, data: any, serverRequest?: NextApiRequest) => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    const response = await axios.put(`/Organization/UpdateOrganization/${id}`, data)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to update organization', undefined, error)
  }
}

export const updateOrganizationV2 = async (
  id: string,
  data: unknown,
  serverRequest?: NextApiRequest,
) => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    const response = await axios.put(`/Organization/UpdateOrganizationV2/${id}`, data)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to update organization V2', undefined, error)
  }
}

export const archiveOrganization = async (id: string, serverRequest?: NextApiRequest) => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    const response = await axios.delete(`/Organization/ArchieveOrganization/${id}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to archive organization', undefined, error)
  }
}

export const followOrganization = async (id: string, serverRequest?: NextApiRequest) => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    const response = await axios.post(`/Organization/follow/${id}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to follow organization', undefined, error)
  }
}

export const unfollowOrganization = async (id: string, serverRequest?: NextApiRequest) => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    const response = await axios.delete(`/Organization/unfollow/${id}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to unfollow organization', undefined, error)
  }
}

export const getOrganizationFollowers = async (id: string, serverRequest?: NextApiRequest) => {
  try {
    const axios = await getAxiosInstance(serverRequest)
    const response = await axios.get(`/Organization/getfollowers/${id}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.SERVER,
      'Failed to get organization followers',
      undefined,
      error,
    )
  }
}
