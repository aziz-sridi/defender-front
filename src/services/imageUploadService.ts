import { toast } from 'sonner'

import { getAxiosInstance } from '@/lib/api/axiosConfig'
import { ApiError } from '@/lib/api/errors'

// Endpoint path (joined with BASE_URL via axios helper). If you provide a full
// absolute URL in NEXT_PUBLIC_IMAGE_UPLOAD_ENDPOINT it will be used directly.
const UPLOAD_PATH = process.env.NEXT_PUBLIC_IMAGE_UPLOAD_ENDPOINT || '/upload/image'

export interface UploadResult {
  imageUrl: string
}

interface UploadOptions {
  requireAuth?: boolean // default true: most uploads bound to user/org
  onProgress?: (percent: number) => void
}

/**
 * Upload a single image file to the backend using the shared axios instance.
 * Backend is expected to return: { imageUrl: string }
 */
export async function uploadImage(
  file: File,
  { requireAuth = true, onProgress }: UploadOptions = {},
): Promise<UploadResult> {
  const formData = new FormData()
  formData.append('image', file)

  try {
    const client = await getAxiosInstance(undefined, requireAuth)
    const res = await client.post(UPLOAD_PATH, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: e => {
        if (onProgress && e.total) {
          const percent = Math.round((e.loaded / e.total) * 100)
          onProgress(percent)
        }
      },
    })
    if (res.data && typeof res.data.imageUrl === 'string') {
      return { imageUrl: res.data.imageUrl }
    }
    throw new Error('Invalid upload response structure')
  } catch (err) {
    // Global interceptor already transformed axios errors to ApiError
    if (err instanceof ApiError) {
      toast.error(err.message || 'Upload failed')
      throw err
    }
    const message = err instanceof Error ? err.message : 'Unknown error'
    toast.error('Image upload failed')
    throw new Error(message)
  }
}

/**
 * Upload multiple files sequentially (order preserved). Returns array of URLs.
 */
export async function uploadMultiple(files: File[], options?: UploadOptions): Promise<string[]> {
  const urls: string[] = []
  for (const f of files) {
    // sequential to avoid overwhelming backend & to surface progress clearly
    const { imageUrl } = await uploadImage(f, options)
    urls.push(imageUrl)
  }
  return urls
}
