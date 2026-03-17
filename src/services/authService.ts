import { getAxiosInstance } from '@/lib/api/axiosConfig'
import { User } from '@/types/userType'

export const loginWithEmail = async (email: string, password: string) => {
  const axios = await getAxiosInstance(undefined, false)
  const response = await axios.post('/user/signinplayer', { email: email.toLowerCase(), password })
  return response.data
}

export interface RegisterUserData {
  email: string
  password: string
  [key: string]: string | number | boolean | undefined
}

export const registerWithEmail = async (userData: RegisterUserData) => {
  const axios = await getAxiosInstance(undefined, false)
  const response = await axios.post('/user/register', userData)
  return response.data
}

export const requestPasswordReset = async (email: string) => {
  const axios = await getAxiosInstance(undefined, false)
  const response = await axios.post('/user/request-password-reset', { email })
  return response.data
}

export const resetPassword = async (token: string, newPassword: string) => {
  const axios = await getAxiosInstance(undefined, false)
  const response = await axios.post('/user/reset-password', { token, newPassword })
  return response.data
}

export const getGoogleAuthUrl = () => {
  return `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`
}

export const verifyGoogleJwt = async (token: string) => {
  const axios = await getAxiosInstance(undefined, false)

  const response = await axios.post('/User/verify-google-jwt', { token })
  return response.data
}

export const fetchUserWithGoogleJwt = async (token: string) => {
  const axios = await getAxiosInstance(undefined, false)
  const response = await axios.get('/User/me', {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

// Exchanges a Google OAuth access token for a Defendr JWT and user info via backend
export interface GoogleLoginResponse {
  user: User
  token: string
  expires?: string
}

export const loginWithGoogle = async (googleAccessToken: string): Promise<GoogleLoginResponse> => {
  const axios = await getAxiosInstance(undefined, false)
  const response = await axios.post('/auth/google/exchange', { access_token: googleAccessToken })
  return response.data
}

export const loginWithDiscord = async (discordAccessToken: string) => {
  const axios = await getAxiosInstance(undefined, false)
  const response = await axios.post('/auth/discord/exchange', { access_token: discordAccessToken })
  return response.data
}
