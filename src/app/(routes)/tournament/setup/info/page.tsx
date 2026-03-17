'use client'
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'

import { BASE_URL } from '@/lib/api/constants'

import Typo from '@/components/ui/Typo'
import Button from '@/components/ui/Button'
import { VariantImage } from '@/components/ui/VariantImage'
// Layout is applied by the route group's layout.tsx
import FormInput from '@/components/ui/FormInput'
import FormTextarea from '@/components/ui/FormTextarea'
import FormSelect from '@/components/ui/FormSelect'
import FormNumberInput from '@/components/ui/FormNumberInput'
import ImageUploadArea from '@/components/ui/ImageUploadArea'
import ParticipationTypeButton from '@/components/ui/ParticipationTypeButton'
import NextButton from '@/components/ui/NextButton'
import { Game } from '@/types/gameType'
import useTournamentDetails from '@/hooks/useTournamentDetails'
import { Tournament } from '@/types/tournamentType'
import { getGameImageUrl } from '@/utils/imageUrlSanitizer'
import { DEFAULT_GAME_CONFIG, getGameConfig } from '@/utils/gameConfig'

type ParticipationType = 'Team' | 'Solo' | null

const DEFAULT_FORM_DATA = { tournamentName: '', description: '', startDate: '', startTime: '19:00' }
const DEFAULT_PARTICIPATION_DATA = {
  maxParticipants: 128,
  connectGameAccount: true,
  connectDiscord: true,
  mapType: '',
  pickType: '',
  region: '',
  spectator: '',
  teamMembers: 5,
  substitutes: 2,
  maxTeams: 64,
}
export default function TournamentSetupPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA)
  const [participationType, setParticipationType] = useState<ParticipationType>(null)
  const [participationData, setParticipationData] = useState(DEFAULT_PARTICIPATION_DATA)
  const [gameSettings, setGameSettings] = useState<{
    region: string
    server: string
    map: string
    format: string
    FFA_maxPlayers?: number
    FFA_lastRound?: number
    teamSize: number
  }>({
    region: '',
    server: '',
    map: '',
    format: '',
    FFA_maxPlayers: undefined,
    FFA_lastRound: undefined,
    teamSize: 5,
  })
  const [thumbnailImage, setThumbnailImage] = useState<File | null>(null)
  const [backgroundImagePreview, setBackgroundImagePreview] = useState<string | null>(null)
  const [thumbnailImagePreview, setThumbnailImagePreview] = useState<string | null>(null)
  const [backgroundImageUploadedUrl, setBackgroundImageUploadedUrl] = useState<string | null>(null)
  const [paymentType, setPaymentType] = useState<'Free' | 'Paid'>('Free')
  const [entryFee, setEntryFee] = useState<number>(0)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Use new hook to fetch tournament details from backend
  const { tournament, loading: isRemoteLoading, tournamentId } = useTournamentDetails()

  // Set initial state from backend tournament data
  useEffect(() => {
    setMounted(true)
    if (!tournamentId || !tournament) {
      return
    }
    const t = tournament as Partial<Tournament>
    // Backend may return game without igdbData (needed for cover image).
    // Fall back to localStorage which stores the full game object from selection.
    let gameToUse: Game | null = t.game ?? null
    if (gameToUse && !gameToUse.igdbData) {
      try {
        const savedGame = localStorage.getItem('selectedGame')
        if (savedGame) {
          const parsed = JSON.parse(savedGame) as Game
          // Only use localStorage game if it's the same game
          if (parsed._id === gameToUse._id && parsed.igdbData) {
            gameToUse = { ...gameToUse, igdbData: parsed.igdbData }
          }
        }
      } catch {
        /* ignore parse errors */
      }
    }
    setSelectedGame(gameToUse)
    setFormData({
      tournamentName: typeof t.name === 'string' ? t.name : '',
      description: typeof t.description === 'string' ? t.description : '',
      startDate: typeof t.startDate === 'string' ? t.startDate : '',
      startTime: typeof t.startTime === 'string' ? t.startTime : '19:00',
    })
    setParticipationType((t.gameMode as ParticipationType) || 'Team')
    setParticipationData({
      maxParticipants: typeof t.maxParticipants === 'number' ? t.maxParticipants : 128,
      connectGameAccount: (t as any).connectGameAccount ?? true,
      connectDiscord: (t as any).connectDiscord ?? true,
      mapType: (t as any).mapType || t.gameSettings?.map || '',
      pickType: (t as any).pickType || t.gameSettings?.format || '',
      region: (t as any).region || t.gameSettings?.region || '',
      spectator:
        (t as any).spectator ||
        (t.gameSettings && 'spectator' in t.gameSettings
          ? (t.gameSettings as any).spectator
          : '') ||
        '',
      teamMembers: (t as any).teamMembers || t.gameSettings?.teamSize || 5,
      substitutes: (t as any).joinProcess?.numberOfSubstitutes ?? 2,
      maxTeams: (t as any).maxTeams || 64,
    })
    setGameSettings({
      region: t.gameSettings?.region || (t as any).region || '',
      server: t.gameSettings?.server || (t as any).server || '',
      map: t.gameSettings?.map || (t as any).map || '',
      format: t.gameSettings?.format || (t as any).format || '',
      FFA_maxPlayers:
        typeof t.gameSettings?.FFA_maxPlayers === 'number'
          ? t.gameSettings?.FFA_maxPlayers
          : undefined,
      FFA_lastRound:
        typeof t.gameSettings?.FFA_lastRound === 'number'
          ? t.gameSettings?.FFA_lastRound
          : undefined,
      teamSize: t.gameSettings?.teamSize || (t as any).teamSize || (t as any).teamMembers || 5,
    })
    if (typeof t.coverImage === 'string' && t.coverImage) {
      setBackgroundImagePreview(t.coverImage)
      setThumbnailImagePreview(t.coverImage)
    } else {
      if ((t as any).backgroundImageData) {
        setBackgroundImagePreview((t as any).backgroundImageData)
      }
      if ((t as any).thumbnailImageData) {
        setThumbnailImagePreview((t as any).thumbnailImageData)
      }
    }
    setPaymentType((t.tournamentType as 'Free' | 'Paid') || 'Free')
    setEntryFee(
      typeof (t as any).entryFee === 'number' ? (t as any).entryFee : t.joinProcess?.entryFee || 0,
    )
    setHasUnsavedChanges(false)
  }, [tournamentId, tournament])

  // (Removed: now handled by useTournamentDetails)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
    setHasUnsavedChanges(true)

    const dbFieldMap: { [key: string]: string } = {
      tournamentName: 'name',
      description: 'description',
      startDate: 'startDate',
      startTime: 'startTime',
    }

    const dbField = dbFieldMap[field]
    if (dbField) {
      updateTournamentInDatabase({ [dbField]: value })
    }
  }

  const handleParticipationChange = (field: string, value: any) => {
    setParticipationData(prev => ({
      ...prev,
      [field]: value,
    }))
    setHasUnsavedChanges(true)

    // Update gameSettings if relevant
    if (['region', 'server', 'mapType', 'pickType', 'teamMembers'].includes(field)) {
      setGameSettings(prev => ({
        ...prev,
        ...(field === 'mapType' ? { map: value } : {}),
        ...(field === 'pickType' ? { format: value } : {}),
        ...(field === 'region' ? { region: value } : {}),
        ...(field === 'server' ? { server: value } : {}),
        ...(field === 'teamMembers' ? { teamSize: value } : {}),
      }))
    }
  }

  const updateTournamentInDatabase = async (updates: any) => {
    if (!tournamentId || !session?.accessToken) {
      console.log('Cannot update database: missing tournament ID or session')
      return
    }

    try {
      console.log('Updating tournament in database:', updates)
      const { updateTournament } = await import('@/services/tournamentService')
      const formData = new FormData()
      Object.keys(updates).forEach(key => {
        if (updates[key] instanceof File) {
          formData.append(key, updates[key])
        } else if (updates[key] !== null) {
          formData.append(key, String(updates[key]))
        }
      })
      await updateTournament(tournamentId, formData)
      console.log('Database updated successfully')
    } catch (error) {
      console.error('Error updating database:', error)
    }
  }

  const handleBackgroundUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      // Only set preview for UI, do NOT store base64 in localStorage
      setBackgroundImagePreview(reader.result as string)
      setHasUnsavedChanges(true)
      // Do not store large image data in localStorage!
    }
    reader.readAsDataURL(file)
  }

  const handleBackgroundUploadedUrl = (info: { file: File; url: string }) => {
    setBackgroundImageUploadedUrl(info.url)
    localStorage.setItem('backgroundImageUploadedUrl', info.url)
    setBackgroundImagePreview(info.url)
    setHasUnsavedChanges(true)
    // Do NOT send to backend here; only send with main payload on save/next
  }

  const handleBackgroundRemove = () => {
    setBackgroundImagePreview(null)
    const bgKey = tournamentId ? `backgroundImageData_${tournamentId}` : 'backgroundImageData'
    const bgNameKey = tournamentId ? `backgroundImageName_${tournamentId}` : 'backgroundImageName'
    localStorage.removeItem(bgKey)
    localStorage.removeItem(bgNameKey)
    localStorage.removeItem('backgroundImageUploadedUrl')
    console.log('Background image removed')
    setHasUnsavedChanges(true)
    // No immediate backend update; coverImage will simply be absent if user proceeds
  }

  const handleThumbnailUpload = (file: File) => {
    setThumbnailImage(file)
    const reader = new FileReader()
    reader.onload = () => {
      const base64Data = reader.result as string
      setThumbnailImagePreview(base64Data)
      const thumbKey = tournamentId ? `thumbnailImageData_${tournamentId}` : 'thumbnailImageData'
      const thumbNameKey = tournamentId
        ? `thumbnailImageName_${tournamentId}`
        : 'thumbnailImageName'
      localStorage.setItem(thumbKey, base64Data)
      localStorage.setItem(thumbNameKey, file.name)
      console.log('Thumbnail image uploaded and saved:', file.name)
      setHasUnsavedChanges(true)

      updateTournamentInDatabase({ thumbnailImage: file })
    }
    reader.readAsDataURL(file)
  }

  const handleThumbnailRemove = () => {
    setThumbnailImage(null)
    setThumbnailImagePreview(null)
    const thumbKey = tournamentId ? `thumbnailImageData_${tournamentId}` : 'thumbnailImageData'
    const thumbNameKey = tournamentId ? `thumbnailImageName_${tournamentId}` : 'thumbnailImageName'
    localStorage.removeItem(thumbKey)
    localStorage.removeItem(thumbNameKey)
    console.log('Thumbnail image removed')
    setHasUnsavedChanges(true)

    updateTournamentInDatabase({ thumbnailImage: null })
  }

  const handleParticipationTypeChange = (type: ParticipationType) => {
    setParticipationType(type)
    setHasUnsavedChanges(true)
  }

  const handlePaymentTypeChange = (type: 'Free' | 'Paid') => {
    setPaymentType(type)
    setHasUnsavedChanges(true)
  }

  const handleEntryFeeChange = (fee: number) => {
    setEntryFee(fee)
    setHasUnsavedChanges(true)
  }

  const handleSave = async () => {
    if (!tournamentId || !session?.accessToken) {
      toast.error('No tournament ID found or authentication required.')
      return
    }

    setIsSaving(true)
    try {
      const { updateTournament } = await import('@/services/tournamentService')

      const payload: Record<string, any> = {
        name: formData.tournamentName,
        description: formData.description,
        startDate: formData.startDate,
        startTime: formData.startTime,
        gameMode: participationType,
        maxParticipants:
          participationType === 'Solo'
            ? participationData.maxParticipants
            : participationData.maxTeams,
        connectGameAccount: participationData.connectGameAccount,
        connectDiscord: participationData.connectDiscord,
        teamMembers: participationData.teamMembers,
        substitutes:
          typeof participationData.substitutes === 'number' ? participationData.substitutes : 0,
        maxTeams: participationData.maxTeams,
        tournamentType: paymentType,
        gameSettings: {
          ...gameSettings,
          region: gameSettings.region || participationData.region || '',
          map: gameSettings.map || participationData.mapType || '',
          format: gameSettings.format || participationData.pickType || '',
          teamSize: gameSettings.teamSize || participationData.teamMembers || 5,
        },
        coverImage:
          backgroundImageUploadedUrl ||
          localStorage.getItem('backgroundImageUploadedUrl') ||
          undefined,
      }

      // Include joinProcess entryFee for Paid tournaments
      if (paymentType === 'Paid') {
        payload.joinProcess = { entryFee }
        payload.entryFee = entryFee
      } else {
        payload.tournamentType = 'Free'
        payload.entryFee = 0
      }

      console.log('Sending tournament payload:', payload)
      await updateTournament(tournamentId, payload)
      toast.success('Tournament information saved successfully!')
      setHasUnsavedChanges(false)
    } catch (error) {
      console.error('Error saving tournament:', error)
      toast.error('Failed to save tournament information. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const isFormValid = () => {
    if (!formData.tournamentName.trim()) {
      return false
    }
    if (!formData.description.trim()) {
      return false
    }
    if (!formData.startDate) {
      return false
    }
    if (!formData.startTime) {
      return false
    }

    if (!backgroundImagePreview) {
      return false
    }
    if (!thumbnailImagePreview) {
      return false
    }

    if (!participationType) {
      return false
    }

    if (participationType === 'Solo') {
      if (!participationData.maxParticipants || participationData.maxParticipants <= 0) {
        return false
      }
    } else {
      if (!participationData.teamMembers || participationData.teamMembers <= 0) {
        return false
      }
      if (!participationData.substitutes || participationData.substitutes < 0) {
        return false
      }
      if (!participationData.maxTeams || participationData.maxTeams <= 0) {
        return false
      }
    }

    if (selectedGame && shouldShowGameOptions(selectedGame.name)) {
      if (!participationData.mapType) {
        return false
      }
      if (!participationData.pickType) {
        return false
      }
      if (!participationData.region) {
        return false
      }
      if (!participationData.spectator) {
        return false
      }
    }

    return true
  }

  const handleNext = async () => {
    if (!tournamentId) {
      toast.error('No tournament ID found. Please go back and create a tournament first.')
      return
    }

    if (!isFormValid()) {
      toast.error('Please fill in all required fields and upload both images before proceeding.')
      return
    }

    const coverImageUrl =
      backgroundImageUploadedUrl || localStorage.getItem('backgroundImageUploadedUrl') || null
    const updatedTournamentInfo = {
      id: tournamentId,
      name: formData.tournamentName,
      description: formData.description,
      startDate: formData.startDate,
      startTime: formData.startTime,
      game: selectedGame,
      gameMode: participationType,
      tournamentType: paymentType,
      entryFee: entryFee,
      maxParticipants:
        participationType === 'Solo'
          ? participationData.maxParticipants
          : participationData.maxTeams,
      connectGameAccount: participationData.connectGameAccount,
      connectDiscord: participationData.connectDiscord,
      teamMembers: participationData.teamMembers,
      substitutes: participationData.substitutes,
      maxTeams: participationData.maxTeams,
      coverImage:
        backgroundImageUploadedUrl ||
        localStorage.getItem('backgroundImageUploadedUrl') ||
        undefined,
      thumbnailImage: thumbnailImage,
      gameSettings: {
        ...gameSettings,
        // fallback for legacy fields if not set
        region: gameSettings.region || participationData.region || '',
        map: gameSettings.map || participationData.mapType || '',
        format: gameSettings.format || participationData.pickType || '',
        teamSize: gameSettings.teamSize || participationData.teamMembers || 5,
      },
    }

    const infoKey = tournamentId ? `tournamentInfo_${tournamentId}` : 'tournamentInfo'
    localStorage.setItem(infoKey, JSON.stringify(updatedTournamentInfo))

    // Persist to backend
    try {
      const { updateTournament } = await import('@/services/tournamentService')
      // Basic validation for paid tournaments
      if (paymentType === 'Paid' && (!entryFee || entryFee <= 0)) {
        toast.error('Please set a valid entry fee for a Paid tournament.')
        return
      }
      const payload: Record<string, any> = {
        name: formData.tournamentName,
        description: formData.description,
        startDate: formData.startDate,
        startTime: formData.startTime,
        gameMode: participationType,
        maxParticipants:
          participationType === 'Solo'
            ? participationData.maxParticipants
            : participationData.maxTeams,
        connectGameAccount: participationData.connectGameAccount,
        connectDiscord: participationData.connectDiscord,
        teamMembers: participationData.teamMembers,
        substitutes: participationData.substitutes,
        maxTeams: participationData.maxTeams,
        tournamentType: paymentType,
        gameSettings: {
          ...gameSettings,
          region: gameSettings.region || participationData.region || '',
          map: gameSettings.map || participationData.mapType || '',
          format: gameSettings.format || participationData.pickType || '',
          teamSize: gameSettings.teamSize || participationData.teamMembers || 5,
        },
      }
      // coverImage is now always included above
      if (thumbnailImage) {
        payload.thumbnailImageData = thumbnailImage
      }
      // Include joinProcess entryFee for Paid tournaments
      if (paymentType === 'Paid') {
        payload.joinProcess = { entryFee }
        payload.entryFee = entryFee
      } else {
        payload.tournamentType = 'Free'
        payload.entryFee = 0
      }

      await updateTournament(tournamentId, payload)
      toast.success('Tournament information updated successfully!')

      router.push(`/tournament/setup/bracket?tid=${encodeURIComponent(String(tournamentId))}`)
    } catch {
      toast.error('Failed to sync with server (local copy saved).')
    }
  }

  const gameConfig = selectedGame ? getGameConfig(selectedGame.name) : DEFAULT_GAME_CONFIG

  const shouldShowGameOptions = (gameName: string) => {
    const name = gameName.toLowerCase()
    return (
      name === 'league of legends' ||
      name === 'league of legend' ||
      name === 'lol' ||
      name === 'valorant' ||
      name === 'val'
    )
  }

  const isValorant = (gameName: string) => {
    const name = gameName.toLowerCase()
    return name === 'valorant' || name === 'val'
  }
  if (!mounted) {
    return null
  }
  if (!tournamentId) {
    return (
      <div className="p-8 text-center text-white font-poppins">
        Missing tournament id (tid) in URL. Please access this page via a valid setup link.
      </div>
    )
  }

  return (
    <div className="space-y-8 h-full">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="relative h-96 bg-defendrLightBlack rounded-lg overflow-hidden">
            {selectedGame ? (
              <>
                {getGameImageUrl(selectedGame) ? (
                  <Image
                    fill
                    alt={selectedGame.name}
                    className="object-cover"
                    src={getGameImageUrl(selectedGame)}
                    unoptimized={true} // Bypass optimization to ensure connectivity to IGDB/NAT64 IPs
                    onError={e => {
                      console.error('Game cover load error:', getGameImageUrl(selectedGame))
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-defendrGrey to-defendrLightBlack">
                    <Typo as="span" className="text-6xl font-bold" color="white" fontVariant="h1">
                      {selectedGame.name.charAt(0).toUpperCase()}
                    </Typo>
                  </div>
                )}
              </>
            ) : (
              <VariantImage
                alt="Game Placeholder"
                className="w-full h-full object-cover"
                height={384}
                src="/placeholder.JPG"
                variant="default"
                width={320}
              />
            )}
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div className="flex gap-4 flex-wrap">
            <div className="px-3 py-1 rounded bg-defendrLightBlack text-xs border border-defendrGrey uppercase tracking-wide">
              {paymentType} Tournament{paymentType === 'Paid' && ` - ${entryFee} TND`}
            </div>
            {isRemoteLoading && (
              <div className="px-3 py-1 rounded bg-defendrLightBlack text-xs border border-defendrGrey animate-pulse">
                Syncing server...
              </div>
            )}
            {/* {remoteError && (
              <div
                className="px-3 py-1 rounded bg-red-900/40 text-xs border border-red-500"
                title={remoteError}
              >
                Server load failed
              </div>
            )} */}
          </div>
          <FormInput
            className="text-sm py-2 px-3"
            label="Tournament Name"
            placeholder="Enter your tournament name"
            value={formData.tournamentName}
            onChange={value => handleInputChange('tournamentName', value)}
          />

          <FormTextarea
            className="text-sm py-2 px-3"
            label="Description"
            placeholder="Describe your tournament"
            value={formData.description}
            onChange={value => handleInputChange('description', value)}
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* 
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CustomDatePicker
            label="Start Date (GMT +1)"
            value={formData.startDate}
            onChange={value => handleInputChange('startDate', value)}
          />
          <CustomTimePicker
            label="Start Time (GMT +1)"
            value={formData.startTime}
            onChange={value => handleInputChange('startTime', value)}
          />
        </div>
          */}
        <div className="space-y-6">
          <div>
            <Typo as="h3" className="mb-4" color="white" fontFamily="poppins" fontVariant="p3">
              Background Image
            </Typo>
            <ImageUploadArea
              enableCrop
              acceptedFormats={['image/jpeg', 'image/png']}
              cropHeight={300}
              cropWidth={1200}
              dimensions="1200x300px. Max 5MB. Formats: JPG, PNG"
              existingImage={backgroundImagePreview}
              maxSize={5}
              title=""
              onRemove={handleBackgroundRemove}
              onUpload={handleBackgroundUpload}
              onUploaded={handleBackgroundUploadedUrl}
            />
          </div>
          {/* 
          <div>
            <Typo as="h3" className="mb-4" color="white" fontFamily="poppins" fontVariant="p3">
              Thumbnail Image
            </Typo>
            <ImageUploadArea
              enableCrop
              isSquare
              acceptedFormats={['image/jpeg', 'image/png', 'image/svg+xml']}
              cropAspectRatio={1}
              cropHeight={512}
              cropWidth={512}
              dimensions="512x512px. Max 2MB. Formats: JPG, PNG, SVG"
              existingImage={thumbnailImagePreview}
              maxSize={2}
              title=""
              onRemove={handleThumbnailRemove}
              onUpload={handleThumbnailUpload}
            />
          </div>
*/}
        </div>
        <div className="space-y-6">
          <Typo as="h3" className="font-medium" color="white" fontFamily="poppins" fontVariant="p2">
            Participation Type
          </Typo>

          <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
            <ParticipationTypeButton
              isSelected={participationType === 'Team'}
              type="Team"
              onClick={() => handleParticipationTypeChange('Team')}
            />
            <ParticipationTypeButton
              isSelected={participationType === 'Solo'}
              type="Solo"
              onClick={() => handleParticipationTypeChange('Solo')}
            />
          </div>

          {participationType && (
            <div className="space-y-6">
              {participationType === 'Solo' ? (
                <div className="max-w-sm mx-auto">
                  <FormNumberInput
                    description="Number of individual participants"
                    label="Max Participants"
                    placeholder="128"
                    value={participationData.maxParticipants}
                    onChange={value => handleParticipationChange('maxParticipants', value)}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormNumberInput
                    description="Number of players per team"
                    label="Team Members"
                    placeholder="5"
                    value={participationData.teamMembers}
                    onChange={value => handleParticipationChange('teamMembers', value)}
                  />
                  <FormNumberInput
                    description="Number of substitutes allowed"
                    label="Substitutes"
                    placeholder="2"
                    value={participationData.substitutes}
                    onChange={value => handleParticipationChange('substitutes', value)}
                  />
                  <FormNumberInput
                    description="Maximum number of teams"
                    label="Max Teams"
                    placeholder="64"
                    value={participationData.maxTeams}
                    onChange={value => handleParticipationChange('maxTeams', value)}
                  />
                </div>
              )}

              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormToggle
                  checked={participationData.connectGameAccount}
                  description="Require participants to connect their game account"
                  label="Connect Game Account"
                  onChange={checked => handleParticipationChange('connectGameAccount', checked)}
                />
                <FormToggle
                  checked={participationData.connectDiscord}
                  description="Require participants to connect their Discord accounts"
                  label="Connect Discord"
                  onChange={checked => handleParticipationChange('connectDiscord', checked)}
                />
              </div> */}

              {/* Game-specific options - only show for League of Legends and Valorant */}
              {selectedGame && shouldShowGameOptions(selectedGame.name) && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormSelect
                      label={isValorant(selectedGame.name) ? 'Map' : 'Map Type'}
                      options={gameConfig.mapOptions}
                      placeholder={isValorant(selectedGame.name) ? 'Select map' : 'Select map'}
                      value={participationData.mapType}
                      onChange={value => handleParticipationChange('mapType', value)}
                    />
                    <FormSelect
                      label={isValorant(selectedGame.name) ? 'Mode' : 'Pick Type'}
                      options={gameConfig.pickTypeOptions}
                      placeholder={
                        isValorant(selectedGame.name) ? 'Select mode' : 'Select pick type'
                      }
                      value={participationData.pickType}
                      onChange={value => handleParticipationChange('pickType', value)}
                    />
                    <FormSelect
                      label="Region"
                      options={gameConfig.regionOptions}
                      placeholder="Select region"
                      value={participationData.region}
                      onChange={value => handleParticipationChange('region', value)}
                    />
                  </div>

                  <div className="max-w-sm mx-auto">
                    <FormSelect
                      label="Spectator"
                      options={gameConfig.spectatorOptions}
                      placeholder="Select spectator type"
                      value={participationData.spectator}
                      onChange={value => handleParticipationChange('spectator', value)}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-6 gap-4">
                <Button
                  className="font-poppins"
                  disabled={!hasUnsavedChanges || isSaving}
                  label={isSaving ? 'Saving...' : 'Save'}
                  size="s"
                  variant="outlined-red"
                  onClick={handleSave}
                />
                <NextButton disabled={!isFormValid()} onClick={handleNext} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
