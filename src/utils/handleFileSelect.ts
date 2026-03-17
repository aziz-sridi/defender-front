export const handleFileSelect = (
  file: File,
  acceptedFormats: string[],
  maxSize: number,
  setPreview: (preview: string) => void,
  onUpload?: (file: File) => void,
) => {
  if (!acceptedFormats.includes(file.type)) {
    // Lazy import to avoid forcing all callers to include toast
    void import('sonner').then(({ toast }) =>
      toast.error(
        `Please select a valid image file (${acceptedFormats
          .map(f => f.split('/')[1].toUpperCase())
          .join(', ')})`,
      ),
    )
    return false
  }

  if (file.size > maxSize * 1024 * 1024) {
    void import('sonner').then(({ toast }) =>
      toast.error(`File size must be less than ${maxSize}MB`),
    )
    return false
  }

  const reader = new FileReader()
  reader.onload = e => {
    setPreview(e.target?.result as string)
  }
  reader.readAsDataURL(file)

  onUpload?.(file)
  return true
}
