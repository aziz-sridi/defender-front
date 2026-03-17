const toError = (error: unknown): Error => {
  if (error instanceof Error) {
    return error
  }
  return new Error(String(error))
}
export default toError

// Extracts the server message from common API error shapes (Axios, custom, arrays)
export const getErrorMessage = (err: any, fallback = 'An unknown error occurred'): string => {
  const data = err?.response?.data
  if (typeof data === 'string') {
    return data
  }
  const arrayMsg = Array.isArray(data?.errors)
    ? data.errors[0]?.message || data.errors[0]?.msg
    : undefined
  return data?.message || data?.error || data?.detail || arrayMsg || err?.message || fallback
}

// Optional: toast helper if you want one-liners
import { toast } from 'sonner'
export const toastApiError = (err: unknown, fallback?: string, prefix?: string) => {
  const msg = getErrorMessage(err, fallback)
  toast.error(prefix ? `${prefix}: ${msg}` : msg)
}
