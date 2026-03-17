import { NextApiRequest } from 'next'

import { getAxiosInstance } from '@/lib/api/axiosConfig'
import { ApiErrorType } from '@/lib/api/constants'
import { ApiError } from '@/lib/api/errors'

export const getAllUsers = async (serverRequest?: NextApiRequest) => {
  try {
    const axios = await getAxiosInstance(serverRequest)
    const response = await axios.get('/user/getAll')
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to fetch users', undefined, error)
  }
}

export const searchUsers = async (nickname: string, serverRequest?: NextApiRequest) => {
  try {
    const axios = await getAxiosInstance(serverRequest)
    const response = await axios.get(`/user/search/${nickname}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to search users', undefined, error)
  }
}

export const getUserById = async (id: string, serverRequest?: NextApiRequest) => {
  try {
    const axios = await getAxiosInstance(serverRequest)
    const response = await axios.get(`/user/getById/${id}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to fetch user by ID', undefined, error)
  }
}

export const getUserByNickname = async (nickname: string, serverRequest?: NextApiRequest) => {
  try {
    const axios = await getAxiosInstance(serverRequest)
    const response = await axios.get(`/user/getByNickname/${nickname}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to fetch user by nickname', undefined, error)
  }
}

export const resendMailVerification = async (serverRequest?: NextApiRequest) => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    const response = await axios.get('/user/resendMailVerification')
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to resend verification email', undefined, error)
  }
}

export const deleteUser = async (id: string, serverRequest?: NextApiRequest) => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    const response = await axios.delete(`/user/delete/${id}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to delete user', undefined, error)
  }
}

export const updatePassword = async (
  data: { currentPassword: string; newPassword: string } | Record<string, unknown>,
  serverRequest?: NextApiRequest,
) => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    const response = await axios.put('/user/updatePassword', data)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to update password', undefined, error)
  }
}

export const updateProfile = async (
  data: FormData | Record<string, unknown>,
  serverRequest?: NextApiRequest,
) => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    let response
    if (typeof FormData !== 'undefined' && data instanceof FormData) {
      response = await axios.put('/user/updateProfile', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    } else {
      // Assume JSON body containing profileImage / coverImage URLs + fields
      response = await axios.put('/user/updateProfile', data)
    }
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to update profile', undefined, error)
  }
}

export const updateUsername = async (username: string, serverRequest?: NextApiRequest) => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    const response = await axios.put('/user/updateUsername', { username })
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to update username', undefined, error)
  }
}

export const countUsers = async (serverRequest?: NextApiRequest) => {
  try {
    const axios = await getAxiosInstance(serverRequest)
    const response = await axios.get('/user/Count')
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to count users', undefined, error)
  }
}
export const signUpPlayer = async (
  data: Record<string, unknown>,
  serverRequest?: NextApiRequest,
) => {
  try {
    const axios = await getAxiosInstance(serverRequest)
    // Ensure email is lowercase for consistency
    const normalizedData = {
      ...data,
      email: typeof data.email === 'string' ? data.email.toLowerCase() : data.email,
    }
    const response = await axios.post('/user/signupplayer', normalizedData)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to sign up player', undefined, error)
  }
}

export const signInPlayer = async (
  data: { email: string; password: string },
  serverRequest?: NextApiRequest,
) => {
  try {
    const axios = await getAxiosInstance(serverRequest)
    const response = await axios.post('/user/signinplayer', {
      ...data,
      email: data.email.toLowerCase(),
    })
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to sign in player', undefined, error)
  }
}

export const tokenSignIn = async (serverRequest?: NextApiRequest) => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    const response = await axios.post('/user/tokenSignIn')
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to sign in with token', undefined, error)
  }
}

export const followUser = async (idUser: string, serverRequest?: NextApiRequest) => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    const response = await axios.post(`/user/follow/${idUser}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to follow user', undefined, error)
  }
}

export const unfollowUser = async (idUser: string, serverRequest?: NextApiRequest) => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    const response = await axios.delete(`/user/unfollow/${idUser}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to unfollow user', undefined, error)
  }
}

export const getFollowers = async (idUser: string, serverRequest?: NextApiRequest) => {
  try {
    const axios = await getAxiosInstance(serverRequest)
    const response = await axios.get(`/user/followers/${idUser}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to fetch followers', undefined, error)
  }
}

export const getFollowing = async (idUser: string, serverRequest?: NextApiRequest) => {
  try {
    const axios = await getAxiosInstance(serverRequest)
    const response = await axios.get(`/user/following/${idUser}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to fetch following', undefined, error)
  }
}

export const verifyOTP = async (
  data: { email: string; otp: string },
  serverRequest?: NextApiRequest,
) => {
  try {
    const axios = await getAxiosInstance(serverRequest)
    const response = await axios.post('/user/verifyOTP', data)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to verify OTP', undefined, error)
  }
}

export const sendOTP = async (
  data: { email: string; phoneNumber?: string },
  serverRequest?: NextApiRequest,
) => {
  try {
    const axios = await getAxiosInstance(serverRequest)
    const response = await axios.post('/user/resendOTP', data)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to send OTP', undefined, error)
  }
}

export const activateUserAccount = async (token: string, serverRequest?: NextApiRequest) => {
  try {
    const axios = await getAxiosInstance(serverRequest)
    const response = await axios.get(`/user/activate?token=${token}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to activate account', undefined, error)
  }
}

export const resetPassword = async (
  data: { email: string; newPassword: string; otp: string },
  serverRequest?: NextApiRequest,
) => {
  try {
    const axios = await getAxiosInstance(serverRequest)
    const response = await axios.post('/user/resetPassword', data)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to reset password', undefined, error)
  }
}

export const forgotPassword = async (data: { email: string }, serverRequest?: NextApiRequest) => {
  try {
    const axios = await getAxiosInstance(serverRequest)
    const response = await axios.post('/user/forgotPassword', data)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.SERVER,
      'Failed to send forgot password email',
      undefined,
      error,
    )
  }
}
export const getFriendsByUserId = async (idUser: string, serverRequest?: NextApiRequest) => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    const response = await axios.get(`/user/getFriends/${idUser}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to fetch friends', undefined, error)
  }
}

export const sendFriendRequest = async (userId: string, serverRequest?: NextApiRequest) => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    const response = await axios.post(`/user/addFriend/${userId}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to send friend request', undefined, error)
  }
}

export const getFriendsRequestsByUserId = async (
  userId: string,
  serverRequest?: NextApiRequest,
) => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    const response = await axios.get(`/user/getFriendRequests/${userId}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to fetch friend requests', undefined, error)
  }
}

export const acceptFriendRequest = async (userId: string, serverRequest?: NextApiRequest) => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    const response = await axios.post(`/user/acceptFriendRequest/${userId}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to accept friend request', undefined, error)
  }
}

export const declineFriendRequest = async (userId: string, serverRequest?: NextApiRequest) => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    const response = await axios.post(`/user/rejectFriendRequest/${userId}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to decline friend request', undefined, error)
  }
}
export const getTeamsByUserId = async (userId: string, serverRequest?: NextApiRequest) => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    const response = await axios.get(`/user/getTeamsByUserId/${userId}`)
    return response.data // { ownedTeams, participatedTeams }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to fetch teams by user ID', undefined, error)
  }
}
export const getAllTeamsByUserId = async (userId: string, serverRequest?: NextApiRequest) => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    const response = await axios.get(`/team/user/${userId}`)
    return response.data // { ownedTeams, participatedTeams }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to fetch teams by user ID', undefined, error)
  }
}
export const getMembershipDetailsByMembershipPeriod = async (
  membershipPeriodId: string,
  serverRequest?: NextApiRequest,
) => {
  try {
    const axios = await getAxiosInstance(serverRequest, true) // auth required, so pass true for auth header
    const response = await axios.get(
      `/user/getMembershipDetailsByMembershipPeriod/${membershipPeriodId}`,
    )
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.SERVER,
      'Failed to fetch membership details by membership period',
      undefined,
      error,
    )
  }
}
export const cancelFriendRequest = async (userId: string, serverRequest?: NextApiRequest) => {
  try {
    const axios = await getAxiosInstance(serverRequest, true) // true → auth required
    const response = await axios.post(`/user/cancelFriendRequest/${userId}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to cancel friend request', undefined, error)
  }
}
export const removeFriend = async (userId: string, serverRequest?: NextApiRequest) => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    const response = await axios.post(`/user/removeFriend/${userId}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to remove friend', undefined, error)
  }
}
export const getUserStats = async (userId: string, serverRequest?: NextApiRequest) => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    const response = await axios.get(`/user/getUserStats/${userId}`)
    return response.data // { tournamentsWon, matchesWon, tournamentsParticipated, matchesParticipated, recentTournaments }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to fetch user stats', undefined, error)
  }
}
export const generate2FA = async (serverRequest?: NextApiRequest) => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    const response = await axios.get('/user/generate-2fa')
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to generate 2FA secret', undefined, error)
  }
}

export const verify2FA = async (data: { token: string }, serverRequest?: NextApiRequest) => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    const response = await axios.post('/user/verify-2fa', data)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to verify 2FA token', undefined, error)
  }
}

export const login2FA = async (data: { token: string }, serverRequest?: NextApiRequest) => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    const response = await axios.post('/user/login-2fa', data)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to login with 2FA', undefined, error)
  }
}

export const disable2FA = async (data: { password: string }, serverRequest?: NextApiRequest) => {
  try {
    const axios = await getAxiosInstance(serverRequest, true)
    const response = await axios.post('/user/disable-2fa', data)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to disable 2FA', undefined, error)
  }
}

export const tokenSignInWithToken = async (token: string) => {
  try {
    const axios = await getAxiosInstance(undefined, false)
    const response = await axios.post('/user/mailTokenSignIn', { token })
    if (typeof window !== 'undefined' && response.data.token) {
      localStorage.setItem('authToken', response.data.token)
    }
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(ApiErrorType.SERVER, 'Failed to sign in with token', undefined, error)
  }
}
