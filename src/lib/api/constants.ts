// Ensure BASE_URL always ends with "/" to prevent URL concatenation bugs.
// Without this, "https://api-dev.defendr.gg" + "tournament/images/" becomes
// "https://api-dev.defendr.ggtournament/images/" (invalid hostname).
const rawBaseUrl = process.env.NEXT_PUBLIC_API || ''
export const BASE_URL = rawBaseUrl.endsWith('/') ? rawBaseUrl : `${rawBaseUrl}/`
export const isServer = typeof window === 'undefined'

export enum ApiErrorType {
  AUTH = 'AUTH',
  NETWORK = 'NETWORK',
  SERVER = 'SERVER',
  CLIENT = 'CLIENT',
  VALIDATION = 'VALIDATION',
}
