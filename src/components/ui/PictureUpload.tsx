'use client'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
/* eslint-disable @next/next/no-img-element */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileImage, faTimes } from '@fortawesome/free-solid-svg-icons'

import { updateTournamentPics, getTournamentById } from '@/services/tournamentService'
import { useImageUpload } from '@/hooks/useImageUpload'

// Helper to read a cookie value on the client
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    return null
  }
  const match = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'),
  )
  return match ? decodeURIComponent(match[1]) : null
}

interface PictureUploadProps {
  tournamentIdFromServer?: string | null
  userNameFromServer?: string | null
}

const CreateTournamentPicUpload = ({
  tournamentIdFromServer = null,
  userNameFromServer = null,
}: PictureUploadProps) => {
  // Local (not yet uploaded) selected files
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [tournamentId, setTournamentId] = useState<string | null>(tournamentIdFromServer)
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [userName, setUserName] = useState<string>(userNameFromServer || 'User')

  const { uploadMany, progress, isUploading, reset } = useImageUpload({ multiple: true })

  useEffect(() => {
    // Prefer server-provided values, then cookie, then localStorage
    const cookieTournamentId = getCookie('createdTournamentId')
    const lsTournamentId =
      typeof window !== 'undefined' ? localStorage.getItem('createdTournamentId') : null
    const resolvedId = tournamentIdFromServer || cookieTournamentId || lsTournamentId

    const cookieUserName = getCookie('userName')
    const resolvedUserName = userNameFromServer || cookieUserName || 'User'

    if (resolvedId) {
      setTournamentId(resolvedId)
      loadExistingImages(resolvedId)
    }

    setUserName(resolvedUserName)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadExistingImages = async (id: string) => {
    try {
      const tournament = await getTournamentById(id)
      if (tournament.TournamentPics && Array.isArray(tournament.TournamentPics)) {
        setExistingImages(tournament.TournamentPics)
      }
    } catch {
      toast.error('Failed to load existing images')
    }
  }

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      const totalImages = pendingFiles.length + existingImages.length + newFiles.length
      if (totalImages > 5) {
        toast.error(
          `You can only upload a maximum of 5 images. You currently have ${pendingFiles.length + existingImages.length} images.`,
        )
        return
      }
      setPendingFiles(prev => [...prev, ...newFiles])
      e.target.value = ''
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files)
      const totalImages = pendingFiles.length + existingImages.length + newFiles.length
      if (totalImages > 5) {
        toast.error(
          `You can only upload a maximum of 5 images. You currently have ${pendingFiles.length + existingImages.length} images.`,
        )
        return
      }
      setPendingFiles(prev => [...prev, ...newFiles])
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleRemoveImage = (index: number) => {
    setPendingFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleUploadImages = async () => {
    if (!tournamentId) {
      toast.error('No tournament ID found. Please create a tournament first.')
      return
    }
    if (pendingFiles.length === 0) {
      toast.error('Please select at least one new image to upload.')
      return
    }
    try {
      setIsSaving(true)
      const uploaded = await uploadMany(pendingFiles)
      if (uploaded.length === 0) {
        toast.error('No images were uploaded')
        return
      }
      const newUrls = uploaded.map(u => u.url)
      const allImageUrls = [...existingImages, ...newUrls].slice(0, 5)
      await updateTournamentPics(tournamentId, allImageUrls)
      toast.success('Tournament images updated')
      setPendingFiles([])
      reset()
      await loadExistingImages(tournamentId)
    } catch {
      toast.error('Failed to save images')
    } finally {
      setIsSaving(false)
    }
  }

  const getMainImage = () => {
    if (pendingFiles.length > 0) {
      return URL.createObjectURL(pendingFiles[0])
    }
    if (existingImages.length > 0) {
      return existingImages[0]
    }
    return null
  }

  const getAllImages = () => [
    ...existingImages.map((url, index) => ({ type: 'existing' as const, src: url, index })),
    ...pendingFiles.map((file, index) => ({
      type: 'new' as const,
      src: URL.createObjectURL(file),
      index,
    })),
  ]

  return (
    <div className="bg-defendrBg text-white p-8">
      <h2 className="text-white text-2xl font-poppins mb-8">Event Pictures</h2>
      <div className="text-center mb-8">
        <p className="text-white text-lg font-poppins mb-2">
          {`Hello, ${userName}. You can upload pictures of your LAN tournament.`}
        </p>
        <span className="text-defendrGrey text-sm">Notice : 5 pictures maximum</span>
      </div>
      <div className="mb-6 relative">
        {(isUploading || isSaving) && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center rounded-lg z-10">
            <div className="w-64 h-3 bg-gray-700 rounded overflow-hidden mb-3">
              <div
                className="h-full bg-defendrRed transition-all"
                style={{ width: `${progress ?? 0}%` }}
              />
            </div>
            <p className="text-sm font-poppins text-white">
              {isUploading ? `Uploading ${progress ?? 0}%` : 'Saving...'}
            </p>
          </div>
        )}
        <div
          className="border-2 border-dashed border-defendrRed rounded-lg p-12 text-center cursor-pointer hover:border-defendrRed/80 transition-colors"
          onClick={() => document.getElementById('browserFile')?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {getMainImage() ? (
            <div className="flex flex-col items-center">
              <img
                alt="Preview"
                className="max-w-full max-h-64 rounded-lg mb-4 object-cover"
                src={getMainImage()!}
              />
              <p className="text-white text-sm font-poppins">
                {pendingFiles.length > 0 ? pendingFiles[0].name : 'Existing Image'}
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <div className="w-16 h-16 bg-defendrRed rounded-full flex items-center justify-center mx-auto">
                  <svg
                    className="text-white"
                    fill="none"
                    height="24"
                    viewBox="0 0 24 24"
                    width="24"
                  >
                    <path
                      d="M12 15V3m0 0l-4 4m4-4l4 4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>

              <p className="text-white text-lg font-poppins">Browse Files to upload (Max 5)</p>
            </>
          )}
        </div>
      </div>

      {/* Selected Images Display */}
      {getAllImages().length > 0 && (
        <div className="mb-6">
          <h3 className="text-white font-poppins text-lg mb-4">
            Selected Images ({getAllImages().length}/5)
          </h3>
          <div className="flex flex-wrap gap-4">
            {getAllImages().map((imageData, index) => (
              <div key={`${imageData.type}-${imageData.index}`} className="relative">
                <img
                  alt={`Selected ${index + 1}`}
                  className="w-24 h-24 object-cover rounded-lg border-2 border-defendrGrey"
                  src={imageData.src}
                />
                <button
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                  type="button"
                  onClick={() => {
                    if (imageData.type === 'existing') {
                      handleRemoveExistingImage(imageData.index)
                    } else {
                      handleRemoveImage(imageData.index)
                    }
                  }}
                >
                  <FontAwesomeIcon className="text-xs" icon={faTimes} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Button */}
      <div className="bg-defendrRed rounded-lg px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FontAwesomeIcon className="text-white text-lg" icon={faFileImage} />
          <span className="text-white font-poppins">
            {getAllImages().length > 0
              ? `${getAllImages().length} image(s) selected`
              : 'No selected Files -'}
          </span>
        </div>

        <button
          className="bg-white text-defendrRed px-4 py-2 rounded font-poppins hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={
            isSaving || (pendingFiles.length === 0 && existingImages.length === 0) || isUploading
          }
          type="button"
          onClick={handleUploadImages}
        >
          {isSaving || isUploading ? 'Processing...' : 'Upload Images'}
        </button>

        <input
          multiple
          accept="image/*"
          className="hidden"
          id="browserFile"
          type="file"
          onChange={handleImage}
        />
      </div>
    </div>
  )
}

export default CreateTournamentPicUpload
