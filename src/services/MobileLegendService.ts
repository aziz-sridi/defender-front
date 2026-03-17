import { getAxiosInstance } from '@/lib/api/axiosConfig'

export const linkMobileLegendsAccount = async (payload: { game_id: string; zone_id: string }) => {
  const axios = await getAxiosInstance(undefined, true)
  // The backend expects { game_id, zone_id } in body
  const response = await axios.post('/mobilelegends/link_account', payload)
  return response.data
}
