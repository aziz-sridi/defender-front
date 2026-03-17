import { useCallback, useState } from 'react'
import { toast } from 'sonner'

import { uploadImage } from '@/services/imageUploadService'

export interface UseImageUploadOptions {
  maxSizeMB?: number
  acceptedTypes?: string[]
  requireAuth?: boolean
  multiple?: boolean
}

export interface UploadedFileInfo {
  file: File
  url: string
}

export function useImageUpload({
  maxSizeMB = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  requireAuth = true,
  multiple = false,
}: UseImageUploadOptions = {}) {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState<number | null>(null)
  const [uploaded, setUploaded] = useState<UploadedFileInfo[]>([])

  const validate = useCallback(
    (file: File) => {
      if (!acceptedTypes.includes(file.type)) {
        toast.error(
          `Unsupported format. Allowed: ${acceptedTypes
            .map(t => t.split('/')[1].toUpperCase())
            .join(', ')}`,
        )
        return false
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        toast.error(`File exceeds ${maxSizeMB}MB limit`)
        return false
      }
      return true
    },
    [acceptedTypes, maxSizeMB],
  )

  const reset = () => {
    setUploaded([])
    setProgress(null)
  }

  const uploadSingle = useCallback(
    async (file: File) => {
      if (!validate(file)) {
        return null
      }
      setIsUploading(true)
      setProgress(0)
      try {
        const { imageUrl } = await uploadImage(file, {
          requireAuth,
          onProgress: p => setProgress(p),
        })
        const info: UploadedFileInfo = { file, url: imageUrl }
        setUploaded(prev => (multiple ? [...prev, info] : [info]))
        toast.success('Image uploaded')
        return info
      } catch {
        // toast already shown
        return null
      } finally {
        setIsUploading(false)
        setProgress(null)
      }
    },
    [multiple, requireAuth, validate],
  )

  const uploadMany = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files)
      const valid = list.filter(f => validate(f))
      if (valid.length === 0) {
        return []
      }
      if (!multiple && valid.length > 1) {
        toast.error('Multiple upload not enabled for this instance')
        return []
      }
      setIsUploading(true)
      setProgress(0)
      try {
        if (!multiple) {
          const single = await uploadSingle(valid[0])
          return single ? [single] : []
        }
        // For multiple: sequential to reuse progress for each file
        const results: UploadedFileInfo[] = []
        for (let i = 0; i < valid.length; i += 1) {
          const { imageUrl } = await uploadImage(valid[i], {
            requireAuth,
            onProgress: p => setProgress(Math.round(((i + p / 100) / valid.length) * 100)),
          })
          const info: UploadedFileInfo = { file: valid[i], url: imageUrl }
          results.push(info)
          setUploaded(prev => [...prev, info])
        }
        toast.success('Images uploaded')
        return results
      } catch {
        return []
      } finally {
        setIsUploading(false)
        setProgress(null)
      }
    },
    [multiple, requireAuth, uploadSingle, validate],
  )

  return {
    isUploading,
    progress,
    uploaded,
    uploadSingle,
    uploadMany,
    reset,
  }
}

export default useImageUpload
