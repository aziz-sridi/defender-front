import { Game } from '@/types/gameType'

export const sanitizeGamesResponse = (response: any): Game[] => {
  const data = response?.data ?? response

  if (Array.isArray(data)) {
    return data
  }
  if (Array.isArray(data?.games)) {
    return data.games
  }

  return []
}
