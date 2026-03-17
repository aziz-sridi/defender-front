'use client'

import React, { useState, useRef, useCallback } from 'react'
import { toast } from 'sonner'
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

import Button from '@/components/ui/Button'
import Typo from '@/components/ui/Typo'

interface ImageCropModalProps {
  isOpen: boolean
  onClose: () => void
  onCropComplete: (croppedFile: File) => void
  imageUrl: string
  aspectRatio?: number
  cropWidth?: number
  cropHeight?: number
  title: string
}

const ImageCropModal = ({
  isOpen,
  onClose,
  onCropComplete,
  imageUrl,
  aspectRatio,
  cropWidth = 1200,
  cropHeight = 300,
  title,
}: ImageCropModalProps) => {
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const imgRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget

      if (aspectRatio) {
        const cropSize = Math.min(width, height)
        const cropPercentage = Math.min((512 / cropSize) * 100, 90)

        const crop: Crop = {
          unit: '%',
          width: cropPercentage,
          height: cropPercentage,
          x: (100 - cropPercentage) / 2,
          y: (100 - cropPercentage) / 2,
        }
        setCrop(crop)
      } else {
        const cropPercentageWidth = Math.min((1200 / width) * 100, 90)
        const cropPercentageHeight = Math.min((300 / height) * 100, 90)

        const crop: Crop = {
          unit: '%',
          width: cropPercentageWidth,
          height: cropPercentageHeight,
          x: (100 - cropPercentageWidth) / 2,
          y: (100 - cropPercentageHeight) / 2,
        }
        setCrop(crop)
      }
    },
    [aspectRatio, cropWidth, cropHeight],
  )

  const getCroppedImg = useCallback((image: HTMLImageElement, crop: PixelCrop): Promise<File> => {
    const canvas = canvasRef.current
    if (!canvas) {
      throw new Error('Canvas not found')
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('Canvas context not found')
    }

    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

    canvas.width = crop.width * scaleX
    canvas.height = crop.height * scaleY

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY,
    )

    return new Promise(resolve => {
      canvas.toBlob(
        blob => {
          if (!blob) {
            throw new Error('Canvas is empty')
          }
          const file = new File([blob], 'cropped-image.jpg', {
            type: 'image/jpeg',
            lastModified: Date.now(),
          })
          resolve(file)
        },
        'image/jpeg',
        0.9,
      )
    })
  }, [])

  const handleCropComplete = async () => {
    if (!completedCrop || !imgRef.current) {
      return
    }

    try {
      const croppedFile = await getCroppedImg(imgRef.current, completedCrop)
      onCropComplete(croppedFile)
      onClose()
    } catch (error) {
      console.error('Error cropping image:', error)
      toast.error('Error cropping image. Please try again.')
    }
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <style jsx>{`
        .ReactCrop__crop-selection {
          border: 2px solid #e91e63 !important;
          cursor: move !important;
        }
        .ReactCrop__drag-handle {
          display: none !important;
        }
        .ReactCrop__drag-bar {
          cursor: move !important;
        }
        .ReactCrop__crop-selection:hover {
          border: 2px solid #e91e63 !important;
        }
      `}</style>
      <div className="bg-defendrBg rounded-lg p-6 relative max-h-[90vh] w-[90vw] max-w-4xl flex flex-col">
        <button
          className="absolute top-4 right-4 text-white hover:text-defendrRed text-xl z-10"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <Typo as="h2" className="font-bold font-poppins" color="red" fontVariant="h3">
            {title}
          </Typo>
          <Typo as="p" className="mt-2" color="white" fontVariant="p3">
            Drag to position the crop area, then click "Apply Crop"
          </Typo>
        </div>

        <div className="flex-1 overflow-auto flex justify-center items-center mb-6">
          <ReactCrop
            keepSelection
            aspect={aspectRatio}
            className="max-w-full max-h-full"
            crop={crop}
            disabled={false}
            maxHeight={aspectRatio ? 512 : 300}
            maxWidth={aspectRatio ? 512 : 1200}
            minHeight={aspectRatio ? 512 : 300}
            minWidth={aspectRatio ? 512 : 1200}
            onChange={(_, percentCrop) => {
              if (crop) {
                setCrop({
                  ...crop,
                  x: percentCrop.x,
                  y: percentCrop.y,
                })
              }
            }}
            onComplete={c => setCompletedCrop(c)}
          >
            <img
              ref={imgRef}
              alt="Crop preview"
              className="max-w-full max-h-[60vh] object-contain"
              src={imageUrl}
              onLoad={onImageLoad}
            />
          </ReactCrop>
        </div>

        <div className="flex justify-center gap-4">
          <button
            className="px-6 py-3 rounded-lg font-bold font-poppins text-white bg-defendrGrey hover:bg-gray-600 transition-all duration-200"
            onClick={onClose}
          >
            Cancel
          </button>
          <Button
            disabled={!completedCrop}
            label="Apply Crop"
            size="s"
            variant="contained-red"
            onClick={handleCropComplete}
          />
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  )
}

export default ImageCropModal
