'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useSession, SessionProvider, getSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Controller, useForm, type FieldErrors } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import Typo from '@/components/ui/Typo'
// Pricing step now handled by separate pre-page /tournament/setup/pricing
import { VariantImage } from '@/components/ui/VariantImage'
import FormInput from '@/components/ui/FormInput'
import FormTextarea from '@/components/ui/FormTextarea'
import FormSelect from '@/components/ui/FormSelect'
import FormToggle from '@/components/ui/FormToggle'
import FormNumberInput from '@/components/ui/FormNumberInput'
import ImageUploadArea from '@/components/ui/ImageUploadArea'
import CustomDatePicker from '@/components/ui/CustomDatePicker'
import CustomTimePicker from '@/components/ui/CustomTimePicker'
import ParticipationTypeButton from '@/components/ui/ParticipationTypeButton'
import NextButton from '@/components/ui/NextButton'
import Select from '@/components/ui/Select'
import { Game } from '@/types/gameType'
import { getGameImageUrl } from '@/utils/imageUrlSanitizer'
import { DEFAULT_GAME_CONFIG, getGameConfig } from '@/utils/gameConfig'

// using react-hook-form schema for participation type; local type no longer needed

const tournamentSchema = z
  .object({
    tournamentName: z.string().min(3, 'Tournament name must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    startDate: z.string().min(1, 'Start date is required'),
    startTime: z.string().min(1, 'Start time is required'),
    participationType: z.enum(['Team', 'Solo']),
    teamMembers: z.number().int().min(1, 'Team members must be at least 1').optional(),
    substitutes: z.number().int().min(0, 'Substitutes cannot be negative').optional(),
    maxTeams: z.number().int().min(2, 'Max teams must be at least 2').optional(),
    maxEnrollments: z.number().int().min(2, 'Max enrollments must be at least 2').optional(),
    connectGameAccount: z.boolean(),
    connectDiscord: z.boolean(),
    mapType: z.string().optional(),
    pickType: z.string().optional(),
    region: z.string().optional(),
    spectator: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.participationType === 'Team') {
      if (val.teamMembers === null || val.teamMembers === undefined) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['teamMembers'], message: 'Required' })
      }
      if (val.substitutes === null || val.substitutes === undefined) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['substitutes'], message: 'Required' })
      }
      if (val.maxTeams === null || val.maxTeams === undefined) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['maxTeams'], message: 'Required' })
      }
    }
    if (val.participationType === 'Solo') {
      if (val.maxEnrollments === null || val.maxEnrollments === undefined) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['maxEnrollments'], message: 'Required' })
      }
    }
  })

type TournamentFormValues = z.infer<typeof tournamentSchema>

function TournamentSetupPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [mounted, setMounted] = useState(false)
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null)
  const [orgError, setOrgError] = useState<string | null>(null)
  // Pricing step removed: default to Free tournament with zero entry fee
  const {
    control,
    handleSubmit,
    setFocus,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TournamentFormValues>({
    resolver: zodResolver(tournamentSchema),
    defaultValues: {
      tournamentName: '',
      description: '',
      startDate: '',
      startTime: '19:00',
      participationType: 'Team',
      teamMembers: 5,
      substitutes: 2,
      maxTeams: 64,
      maxEnrollments: 128,
      connectGameAccount: true,
      connectDiscord: true,
      mapType: '',
      pickType: '',
      region: '',
      spectator: '',
    },
  })

  // image data is written to localStorage via upload handlers
  const { data: session } = useSession()

  useEffect(() => {
    localStorage.removeItem('bracketSavedToDatabase')
    localStorage.removeItem('scheduleSavedToDatabase')
    localStorage.removeItem('participationSettingsData')
    localStorage.removeItem('tournamentScheduleData')
  }, [])

  useEffect(() => {
    setMounted(true)
    // Only get the game from localStorage
    if (typeof window !== 'undefined') {
      const savedGame = localStorage.getItem('selectedGame')
      if (savedGame) {
        try {
          const game = JSON.parse(savedGame)
          setSelectedGame(game)
        } catch {
          /* ignore */
        }
      }
    }
  }, [])

  // Organization selection logic - get from URL parameter
  useEffect(() => {
    const orgIdFromUrl = searchParams.get('orgId')
    const orgIdFromStorage = localStorage.getItem('selectedOrganizationId')

    if (orgIdFromUrl) {
      setSelectedOrgId(orgIdFromUrl)
      setOrgError(null)
    } else if (orgIdFromStorage) {
      setSelectedOrgId(orgIdFromStorage)
      setOrgError(null)
    } else {
      setOrgError('No organization selected. Please go back and select an organization.')
      setSelectedOrgId(null)
    }
  }, [searchParams])

  const participationType = watch('participationType')

  const handleBackgroundUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      localStorage.setItem('backgroundImageData', reader.result as string)
      localStorage.setItem('backgroundImageName', file.name)
    }
    reader.readAsDataURL(file)
  }

  const handleBackgroundUploadedUrl = (info: { file: File; url: string }) => {
    // Store the actual uploaded URL; this is what we will send as coverImage
    localStorage.setItem('backgroundImageUploadedUrl', info.url)
  }

  const handleBackgroundRemove = () => {
    localStorage.removeItem('backgroundImageData')
    localStorage.removeItem('backgroundImageName')
    localStorage.removeItem('backgroundImageUploadedUrl')
  }

  const handleThumbnailUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      localStorage.setItem('thumbnailImageData', reader.result as string)
      localStorage.setItem('thumbnailImageName', file.name)
    }
    reader.readAsDataURL(file)
  }

  const handleThumbnailRemove = () => {
    localStorage.removeItem('thumbnailImageData')
    localStorage.removeItem('thumbnailImageName')
  }

  const onSubmit = async (values: TournamentFormValues) => {
    if (!selectedGame) {
      toast.error('Please select a game first')
      return
    }
    if (!selectedOrgId) {
      toast.error('Missing organisation ID. Please re-login or join an organisation.')
      return
    }

    const form = new FormData()
    // Read pricing selection from localStorage (defaults if missing)
    const paymentTypeLs = (localStorage.getItem('tournamentPaymentType') || 'free') as
      | 'free'
      | 'paid'
    const entryFeeValue =
      paymentTypeLs === 'paid' ? Number(localStorage.getItem('tournamentEntryFee') || 0) : 0
    form.append('name', values.tournamentName.trim())
    form.append('description', values.description.trim())
    form.append('startDate', values.startDate || new Date().toISOString().split('T')[0])
    form.append('gameMode', values.participationType)
    form.append(
      'maxParticipants',
      String(values.participationType === 'Solo' ? values.maxEnrollments : values.maxTeams),
    )
    form.append('game', selectedGame?._id || '')
    form.append('tournamentType', paymentTypeLs === 'paid' ? 'Paid' : 'Free')
    form.append('entryFee', String(entryFeeValue))
    // Provide joinProcess entryFee in forms-compatible nested keys (both styles for safety)
    if (paymentTypeLs === 'paid' && entryFeeValue > 0) {
      form.append('joinProcess[entryFee]', String(entryFeeValue))
      form.append('joinProcess.entryFee', String(entryFeeValue))
    }

    // Provide joinProcess numberOfSubstitutes for team tournaments
    if (values.participationType === 'Team') {
      form.append('joinProcess[numberOfSubstitutes]', String(values.substitutes || 0))
      form.append('joinProcess.numberOfSubstitutes', String(values.substitutes || 0))
    }

    // Send coverImage as the uploaded URL (if exists)
    const bgUrl = localStorage.getItem('backgroundImageUploadedUrl')
    if (bgUrl) {
      form.append('coverImage', bgUrl)
    }

    // --- NEW: Send gameSettings as nested object ---
    const gameSettings = {
      region: values.region,
      server: '', // Add server field if you have it in the form
      map: values.mapType,
      format: values.pickType,
      FFA_maxPlayers: undefined, // Add if you have this field
      FFA_lastRound: undefined, // Add if you have this field
      teamSize: values.teamMembers,
    }
    form.append('gameSettings', JSON.stringify(gameSettings))

    try {
      const { createTournament, updateTournament } = await import('@/services/tournamentService')
      const { getOrganizationById } = await import('@/services/organizationService')

      // Refresh session to pick up any recent changes to joined organizations/roles
      const freshSession = await getSession()
      // Check if user has permission to create tournaments for this organization
      const organization = await getOrganizationById(selectedOrgId)
      const userId = freshSession?.user?._id || session?.user?._id
      const isStaffMember = organization.staff?.some(
        (staffMember: { user: string | { _id?: string; id?: string }; role: string }) => {
          const staffUser = staffMember.user
          const staffUserId =
            typeof staffUser === 'string' ? staffUser : staffUser._id || staffUser.id
          return (
            staffUserId === userId &&
            (staffMember.role === 'Admin' || staffMember.role === 'Founder')
          )
        },
      )
      if (!isStaffMember) {
        toast.error('You do not have permission to create tournaments for this organization.')
        return
      }

      // FormData is sent directly; avoid logging in production

      const created = await createTournament(selectedOrgId, form)
      if (paymentTypeLs === 'paid' && entryFeeValue > 0 && created?._id) {
        try {
          await updateTournament(created._id, { joinProcess: { entryFee: entryFeeValue } })
          created.joinProcess = { ...(created.joinProcess || {}), entryFee: entryFeeValue }
        } catch {
          // ignore update error
        }
      }
      if (created?._id) {
        localStorage.setItem('createdTournamentId', created._id)

        const tournamentInfo = {
          id: created._id || 'temp-id-' + Date.now(),
          name: values.tournamentName,
          description: values.description,
          startDate: values.startDate,
          startTime: values.startTime,
          game: selectedGame,
          gameMode: values.participationType,
          maxParticipants:
            values.participationType === 'Solo' ? values.maxEnrollments : values.maxTeams,
          gameSettings,
          connectGameAccount: values.connectGameAccount,
          connectDiscord: values.connectDiscord,
          teamMembers: values.teamMembers,
          substitutes: values.substitutes,
          maxTeams: values.maxTeams,
          maxEnrollments: values.maxEnrollments,
          tournamentType: paymentTypeLs === 'paid' ? 'Paid' : 'Free',
          entryFee: entryFeeValue,
          coverImage: localStorage.getItem('backgroundImageUploadedUrl') || undefined,
          thumbnailImage: localStorage.getItem('thumbnailImageData') || undefined,
        }

        localStorage.setItem('tournamentInfo', JSON.stringify(tournamentInfo))
        toast.success('Tournament created')
        router.push(`/tournament/setup/info?tid=${encodeURIComponent(created._id)}`)
      } else {
        toast.error('Tournament creation failed: No ID returned')
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Tournament creation error:', error)
      const errorMessage =
        error instanceof Error && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message ||
            error.message
          : 'Failed to create tournament'
      toast.error(errorMessage)
    }
  }

  const onInvalid = (formErrors: FieldErrors<TournamentFormValues>) => {
    // Focus the first errored field and show a helpful toast
    const firstKey = Object.keys(formErrors)[0]
    if (firstKey) {
      setFocus(firstKey as keyof TournamentFormValues)
    }
    toast.error('Please fill in the required fields')
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

  // no-op

  // Get preview images if present
  const backgroundImagePreview =
    typeof window !== 'undefined' ? localStorage.getItem('backgroundImageUploadedUrl') : null

  const thumbnailImagePreview =
    typeof window !== 'undefined' ? localStorage.getItem('thumbnailImageData') : null

  if (!mounted) {
    return null
  }

  // Show error if no eligible orgs
  if (orgError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <p className="text-red-500 text-lg font-poppins text-center">{orgError}</p>
      </div>
    )
  }

  return (
    <section className="space-y-8 h-full mt-[80px]">
      {/* Pricing handled by pre-step; guarded redirect above */}
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
                    onError={e => {
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
          <Controller
            control={control}
            name="tournamentName"
            render={({ field }) => (
              <div>
                <FormInput
                  className="text-sm py-2 px-3"
                  label="Tournament Name"
                  placeholder="Enter your tournament name"
                  value={field.value}
                  onChange={field.onChange}
                />
                {errors.tournamentName && (
                  <p className="text-red-500 text-xs mt-1">{errors.tournamentName.message}</p>
                )}
              </div>
            )}
          />

          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <div>
                <FormTextarea
                  className="text-sm py-2 px-3"
                  label="Description"
                  placeholder="Describe your tournament"
                  value={field.value}
                  onChange={field.onChange}
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
                )}
              </div>
            )}
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            control={control}
            name="startDate"
            render={({ field }) => (
              <div>
                <CustomDatePicker
                  label="Start Date (GMT +1)"
                  value={field.value}
                  onChange={field.onChange}
                />
                {errors.startDate && (
                  <p className="text-red-500 text-xs mt-1">{errors.startDate.message}</p>
                )}
              </div>
            )}
          />
          <Controller
            control={control}
            name="startTime"
            render={({ field }) => (
              <div>
                <CustomTimePicker
                  label="Start Time (GMT +1)"
                  value={field.value}
                  onChange={field.onChange}
                />
                {errors.startTime && (
                  <p className="text-red-500 text-xs mt-1">{errors.startTime.message}</p>
                )}
              </div>
            )}
          />
        </div>

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
              existingImage={backgroundImagePreview || undefined}
              maxSize={5}
              title=""
              onRemove={handleBackgroundRemove}
              onUpload={handleBackgroundUpload}
              onUploaded={handleBackgroundUploadedUrl}
            />
          </div>

          <div>
            <Typo as="h3" className="mb-4" color="white" fontFamily="poppins" fontVariant="p3">
              Thumbnail Image (optional)
            </Typo>
            <ImageUploadArea
              enableCrop
              isSquare
              acceptedFormats={['image/jpeg', 'image/png', 'image/svg+xml']}
              cropAspectRatio={1}
              dimensions="512x512px. Max 2MB. Formats: JPG, PNG, SVG"
              existingImage={thumbnailImagePreview || undefined}
              maxSize={2}
              title=""
              onRemove={handleThumbnailRemove}
              onUpload={handleThumbnailUpload}
            />
          </div>
        </div>

        <div className="space-y-6">
          <Typo as="h3" className="font-medium" color="white" fontFamily="poppins" fontVariant="p2">
            Participation Type
          </Typo>

          <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
            <ParticipationTypeButton
              isSelected={participationType === 'Team'}
              type="Team"
              onClick={() => setValue('participationType', 'Team')}
            />
            <ParticipationTypeButton
              isSelected={participationType === 'Solo'}
              type="Solo"
              onClick={() => setValue('participationType', 'Solo')}
            />
          </div>

          {participationType && (
            <div className="space-y-6">
              {participationType === 'Solo' ? (
                <div className="max-w-sm mx-auto">
                  <Controller
                    control={control}
                    name="maxEnrollments"
                    render={({ field }) => (
                      <div>
                        <FormNumberInput
                          description="Number of individual participants"
                          label="Max Enrollments"
                          placeholder="128"
                          value={field.value ?? 0}
                          onChange={field.onChange}
                        />
                        {errors.maxEnrollments && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.maxEnrollments.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Controller
                    control={control}
                    name="teamMembers"
                    render={({ field }) => (
                      <div>
                        <FormNumberInput
                          description="Number of players per team"
                          label="Team Members"
                          placeholder="5"
                          value={field.value ?? 0}
                          onChange={field.onChange}
                        />
                        {errors.teamMembers && (
                          <p className="text-red-500 text-xs mt-1">{errors.teamMembers.message}</p>
                        )}
                      </div>
                    )}
                  />
                  <Controller
                    control={control}
                    name="substitutes"
                    render={({ field }) => (
                      <div>
                        <FormNumberInput
                          description="Number of substitutes allowed"
                          label="Substitutes"
                          placeholder="2"
                          value={field.value ?? 0}
                          onChange={field.onChange}
                        />
                        {errors.substitutes && (
                          <p className="text-red-500 text-xs mt-1">{errors.substitutes.message}</p>
                        )}
                      </div>
                    )}
                  />
                  <Controller
                    control={control}
                    name="maxTeams"
                    render={({ field }) => (
                      <div>
                        <FormNumberInput
                          description="Maximum number of teams"
                          label="Max Teams"
                          placeholder="64"
                          value={field.value ?? 0}
                          onChange={field.onChange}
                        />
                        {errors.maxTeams && (
                          <p className="text-red-500 text-xs mt-1">{errors.maxTeams.message}</p>
                        )}
                      </div>
                    )}
                  />
                </div>
              )}

              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Controller
                  control={control}
                  name="connectGameAccount"
                  render={({ field }) => (
                    <FormToggle
                      checked={field.value}
                      description="Require participants to connect their game account"
                      label="Connect Game Account"
                      onChange={field.onChange}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="connectDiscord"
                  render={({ field }) => (
                    <FormToggle
                      checked={field.value}
                      description="Require participants to connect their Discord accounts"
                      label="Connect Discord"
                      onChange={field.onChange}
                    />
                  )}
                />
              </div> */}

              {selectedGame && shouldShowGameOptions(selectedGame.name) && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Controller
                      control={control}
                      name="mapType"
                      render={({ field }) => (
                        <FormSelect
                          label={isValorant(selectedGame.name) ? 'Map' : 'Map Type'}
                          options={gameConfig.mapOptions}
                          placeholder={isValorant(selectedGame.name) ? 'Select map' : 'Select map'}
                          value={field.value || ''}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name="pickType"
                      render={({ field }) => (
                        <FormSelect
                          label={isValorant(selectedGame.name) ? 'Mode' : 'Pick Type'}
                          options={gameConfig.pickTypeOptions}
                          placeholder={
                            isValorant(selectedGame.name) ? 'Select mode' : 'Select pick type'
                          }
                          value={field.value || ''}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name="region"
                      render={({ field }) => (
                        <FormSelect
                          label="Region"
                          options={gameConfig.regionOptions}
                          placeholder="Select region"
                          value={field.value || ''}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>

                  <div className="max-w-sm mx-auto">
                    <Controller
                      control={control}
                      name="spectator"
                      render={({ field }) => (
                        <FormSelect
                          label="Spectator"
                          options={gameConfig.spectatorOptions}
                          placeholder="Select spectator type"
                          value={field.value || ''}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-6">
                <NextButton disabled={isSubmitting} onClick={handleSubmit(onSubmit, onInvalid)} />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default function TournamentSetupPage() {
  return (
    <SessionProvider>
      <TournamentSetupPageContent />
    </SessionProvider>
  )
}
