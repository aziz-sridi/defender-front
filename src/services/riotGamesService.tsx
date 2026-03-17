import { getAxiosInstance } from '@/lib/api/axiosConfig'

// Always use relative paths with getAxiosInstance (it already has baseURL)

export const fetchRiotOAuthLink = async (): Promise<string> => {
  const axiosInstance = await getAxiosInstance()
  const response = await axiosInstance.get('/riot', { withCredentials: true })
  if (response.request?.responseURL) {
    return response.request.responseURL
  }
  if (response.data?.url) {
    return response.data.url
  }
  throw new Error('Failed to get Riot OAuth URL')
}

export const linkRiotAccount = async (code: string) => {
  const axiosInstance = await getAxiosInstance(undefined, true)
  const response = await axiosInstance.get(`/riot/oauth?code=${encodeURIComponent(code)}`, {
    withCredentials: true,
  })
  return response.data
}

export const linkRiotGamesAccount = async (payload: { riotid: string; tagline: string }) => {
  const axios = await getAxiosInstance(undefined, true)
  // The backend expects { game_id, zone_id } in body
  const response = await axios.post('/riotgames/link_account', payload)
  return response.data
}
export const addRiotGamesInfo = async (gameName: string, tagline: string, region: string) => {
  const axiosInstance = await getAxiosInstance(undefined, true)
  const response = await axiosInstance.post(
    '/addRiotGamesInfo',
    { gameName, tagline, region },
    { withCredentials: true },
  )
  return response.data
}
