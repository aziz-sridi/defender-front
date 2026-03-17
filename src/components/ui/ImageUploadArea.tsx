import React, { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { toast } from 'sonner'

import { handleFileSelect } from '@/utils/handleFileSelect'
import { uploadImage } from '@/services/imageUploadService'
import UploadIcon from '@/components/ui/Icons/UploadIcon'
import ImageIcon from '@/components/ui/Icons/ImageIcon'
import ImageCropModal from '@/components/ui/ImageCropModal'

import UploadButton from './UploadButton'

interface ImageUploadAreaProps {
  title: string
  dimensions: string
  isSquare?: boolean
  onUpload?: (file: File) => void
  onUploaded?: (info: { file: File; url: string }) => void
  onRemove?: () => void
  className?: string
  maxSize?: number
  acceptedFormats?: string[]
  cropAspectRatio?: number
  cropWidth?: number
  cropHeight?: number
  enableCrop?: boolean
  existingImage?: string | null
}

export default function ImageUploadArea({
  title,
  dimensions,
  isSquare = false,
  onUpload,
  onUploaded,
  onRemove,
  className = '',
  maxSize = 5,
  acceptedFormats = ['image/jpeg', 'image/png'],
  cropAspectRatio,
  cropWidth = 1200,
  cropHeight = 300,
  enableCrop = false,
  existingImage = null,
}: ImageUploadAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(existingImage)
  const [isDragOver, setIsDragOver] = useState(false)
  const [showCropModal, setShowCropModal] = useState(false)
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [progress, setProgress] = useState<number>(0)

  useEffect(() => {
    setPreview(existingImage)
  }, [existingImage])

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemove = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onRemove?.()
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleFileSelectWrapper = async (file: File) => {
    if (enableCrop) {
      if (!acceptedFormats.includes(file.type)) {
        toast.error(
          `Please select a valid image file (${acceptedFormats
            .map(f => f.split('/')[1].toUpperCase())
            .join(', ')})`,
        )
        return
      }

      if (file.size > maxSize * 1024 * 1024) {
        toast.error(`File size must be less than ${maxSize}MB`)
        return
      }

      const reader = new FileReader()
      reader.onload = e => {
        const imageUrl = e.target?.result as string
        setOriginalImageUrl(imageUrl)
        setShowCropModal(true)
      }
      reader.readAsDataURL(file)
    } else {
      const ok = handleFileSelect(
        file,
        acceptedFormats,
        maxSize,
        preview => setPreview(preview),
        async selectedFile => {
          try {
            setIsUploading(true)
            const { imageUrl } = await uploadImage(selectedFile, {
              onProgress: p => setProgress(p),
            })
            setUploadedUrl(imageUrl)
            onUpload?.(selectedFile)
            onUploaded?.({ file: selectedFile, url: imageUrl })
            toast.success('Image uploaded')
          } catch {
            /* toast already shown in service */
          } finally {
            setIsUploading(false)
            setTimeout(() => setProgress(0), 400)
          }
        },
      )
      if (!ok) {
        return
      }
    }
  }

  const handleCropComplete = async (croppedFile: File) => {
    const reader = new FileReader()
    reader.onload = e => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(croppedFile)

    try {
      setIsUploading(true)
      const { imageUrl } = await uploadImage(croppedFile, {
        onProgress: p => setProgress(p),
      })
      setUploadedUrl(imageUrl)
      onUpload?.(croppedFile)
      onUploaded?.({ file: croppedFile, url: imageUrl })
      toast.success('Image uploaded')
    } catch {
      // error toast surfaced in service
    } finally {
      setIsUploading(false)
      setShowCropModal(false)
      setTimeout(() => setProgress(0), 400)
    }
  }

  const handleCropCancel = () => {
    setShowCropModal(false)
    setOriginalImageUrl(null)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelectWrapper(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelectWrapper(file)
    }
  }

  return (
    <div className={`${className}`}>
      {title && <h3 className="text-white font-medium mb-4 text-lg font-poppins">{title}</h3>}

      <div
        className={`bg-defendrLightBlack border-2 border-dashed rounded-lg flex items-center justify-center mb-4 cursor-pointer transition-colors relative overflow-hidden ${
          isSquare ? 'w-24 h-24' : 'w-full h-32'
        } ${
          isDragOver
            ? 'border-defendrRed bg-defendrRed/10'
            : 'border-defendrGrey hover:border-defendrRed/50'
        }`}
        onClick={handleUploadClick}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {preview ? (
          <Image
            fill
            unoptimized
            alt="Preview"
            className="w-full h-full object-cover rounded-lg"
            sizes="(max-width: 768px) 100vw, 33vw"
            src={uploadedUrl || preview}
          />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <ImageIcon />
            <p className="text-defendrGrey text-xs font-poppins text-center">
              Click or drag to upload
            </p>
          </div>
        )}
        {isUploading && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white text-xs font-poppins gap-2 p-4">
            <span className="font-poppins text-[11px] tracking-wide">Uploading {progress}%</span>
            <div className="w-40 h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-defendrRed transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        accept={acceptedFormats.join(',')}
        className="hidden"
        type="file"
        onChange={handleFileChange}
      />

      <div className="flex gap-3 mb-2">
        <UploadButton disabled={isUploading} variant="upload" onClick={handleUploadClick}>
          <UploadIcon />
          {isUploading ? 'Uploading...' : 'Upload new image'}
        </UploadButton>
        {preview && (
          <UploadButton disabled={isUploading} variant="remove" onClick={handleRemove}>
            Remove Image
          </UploadButton>
        )}
      </div>

      {dimensions && (
        <p className="text-defendrGrey text-xs font-poppins">Recommended: {dimensions}</p>
      )}
      {uploadedUrl && !isUploading && (
        <p className="text-green-500 text-xs font-poppins break-all mt-1">{uploadedUrl}</p>
      )}

      {/* Image Crop Modal */}
      {enableCrop && originalImageUrl && (
        <ImageCropModal
          aspectRatio={cropAspectRatio}
          cropHeight={cropHeight}
          cropWidth={cropWidth}
          imageUrl={originalImageUrl}
          isOpen={showCropModal}
          title={`Crop ${isSquare ? 'Thumbnail' : 'Background'} Image`}
          onClose={handleCropCancel}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  )
}
