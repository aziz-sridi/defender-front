'use client'
/* eslint-disable */

import React, { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

import Button from '@/components/ui/Button'
import Typo from '@/components/ui/Typo'
import { searchUsers } from '@/services/userService'
import { updateTournament, getTournamentById } from '@/services/tournamentService'
import { useSearchParams } from 'next/navigation'
// Removed TournamentLayout wrapper to rely on parent layout
import ToggleGroup from '@/components/ui/ToggleGroup'
import greenImage from '@/components/assets/tournament/green.png'
import reddImage from '@/components/assets/tournament/redd.png'
import CustomCheckbox from '@/components/ui/customCheckBox'
import CustomToggleSwitch from '@/components/ui/CustomToggleSwitch'
import DropdownArrowIcon from '@/components/ui/DropdownArrowIcon'
import {
  getCurrentTournamentId,
  readSessionDraft,
  writeSessionDraft,
  readInfo,
  writeInfo,
  markSaved,
} from '@/lib/storage/tournamentStorage'

export default function ParticipantSettingsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data: session } = useSession()
  type RegistrationFields = {
    fullName: boolean
    age: boolean
    email: boolean
    city: boolean
    riotId: boolean
    universityName: boolean
    discordTag: boolean
  }
  type ParticipantForm = {
    confirmationRequest: boolean
    scoreReporting: 'admins-only' | 'admins-players'
    limitBySkillLevel: boolean
    minSkillLevel: string
    maxSkillLevel: string
    requireSupporters: boolean
    requireVerifiedEmail: boolean
    acceptRules: boolean
    registrationFields: RegistrationFields
    // Extended joinProcess flags
    allowSouls: boolean
    inHouseQueue: boolean
    maxFreeAgents: string
    entryFee: string
    perTeamPurchasing: boolean
    numberOfParticipants: string
    numberOfSubstitutes: string
    linkGameRequired: boolean
    allowIndividualRegistrations: boolean
    requireManualApproval: boolean
    requireCompleteTeamRoster: boolean
    requireAgeVerification: boolean
    requireGameAccount: boolean
    requireDiscordUsername: boolean
    requireEpicGamesUsername: boolean
    requireSteamId: boolean
    requireRiotId: boolean
    requireRankRating: boolean
    requireCustomGameIdentifier: boolean
    requiredFullname: boolean
    requireFacebookLink: boolean
    requireInstagramLink: boolean
    requiredPhoneNumber: boolean
  }

  const defaultRegistrationFields: RegistrationFields = {
    fullName: false,
    age: false,
    email: false,
    city: false,
    riotId: false,
    universityName: false,
    discordTag: false,
  }

  const { handleSubmit, watch, reset, getValues, setValue } = useForm<ParticipantForm>({
    defaultValues: {
      confirmationRequest: false,
      scoreReporting: 'admins-only',
      limitBySkillLevel: false,
      minSkillLevel: '1',
      maxSkillLevel: '10',
      requireSupporters: false,
      requireVerifiedEmail: false,
      acceptRules: false,
      registrationFields: defaultRegistrationFields,
      allowSouls: false,
      inHouseQueue: false,
      maxFreeAgents: '4',
      entryFee: '0',
      perTeamPurchasing: false,
      numberOfParticipants: '',
      numberOfSubstitutes: '2',
      linkGameRequired: false,
      allowIndividualRegistrations: false,
      requireManualApproval: false,
      requireCompleteTeamRoster: false,
      requireAgeVerification: false,
      requireGameAccount: false,
      requireDiscordUsername: false,
      requireEpicGamesUsername: false,
      requireSteamId: false,
      requireRiotId: false,
      requireRankRating: false,
      requireCustomGameIdentifier: false,
      requiredFullname: false,
      requireFacebookLink: false,
      requireInstagramLink: false,
      requiredPhoneNumber: false,
    },
  })
  const [username, setUsername] = useState('')
  const [usernames, setUsernames] = useState<string[]>([])
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const [restrictedUsers, setRestrictedUsers] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tournamentId, setTournamentId] = useState<string | null>(null)
  const [gameMode, setGameMode] = useState<'Team' | 'Solo' | null>(null)

  useEffect(() => {
    setTournamentId(getCurrentTournamentId())
  }, [])

  // Single unified data loading effect: session draft → backend → local draft fallback
  useEffect(() => {
    const tid = searchParams.get('tid') || getCurrentTournamentId()
    if (!tid) return

    // Priority 1: Check for session draft (unsaved in-progress edits)
    const sessionDraft = readSessionDraft<
      Partial<ParticipantForm> & {
        username?: string
        usernames?: string[]
        restrictedUsers?: any[]
      }
    >('participationDraft', tid)

    if (sessionDraft) {
      const data = sessionDraft
      console.log(data)
      reset({
        confirmationRequest: !!data.confirmationRequest,
        scoreReporting: (data.scoreReporting as ParticipantForm['scoreReporting']) ?? 'admins-only',
        limitBySkillLevel: !!data.limitBySkillLevel,
        minSkillLevel: String(data.minSkillLevel ?? '1'),
        maxSkillLevel: String(data.maxSkillLevel ?? '10'),
        requireSupporters: !!data.requireSupporters,
        requireVerifiedEmail: !!data.requireVerifiedEmail,
        acceptRules: !!data.acceptRules,
        registrationFields: {
          ...defaultRegistrationFields,
          ...(data.registrationFields || {}),
        },
        allowSouls: !!(data as any).allowSouls,
        inHouseQueue: !!(data as any).inHouseQueue,
        maxFreeAgents: String((data as any).maxFreeAgents ?? '4'),
        entryFee: String((data as any).entryFee ?? '0'),
        perTeamPurchasing: !!(data as any).perTeamPurchasing,
        numberOfParticipants: String((data as any).numberOfParticipants ?? ''),
        numberOfSubstitutes: String((data as any).numberOfSubstitutes ?? '2'),
        linkGameRequired: !!(data as any).linkGameRequired,
        allowIndividualRegistrations: !!(data as any).allowIndividualRegistrations,
        requireManualApproval: !!(data as any).requireManualApproval,
        requireCompleteTeamRoster: !!(data as any).requireCompleteTeamRoster,
        requireAgeVerification: !!(data as any).requireAgeVerification,
        requireGameAccount: !!(data as any).requireGameAccount,
        requireDiscordUsername: !!(data as any).requireDiscordUsername,
        requireEpicGamesUsername: !!(data as any).requireEpicGamesUsername,
        requireSteamId: !!(data as any).requireSteamId,
        requireRiotId: !!(data as any).requireRiotId,
        requireRankRating: !!(data as any).requireRankRating,
        requireCustomGameIdentifier: !!(data as any).requireCustomGameIdentifier,
        requiredFullname: !!(data as any).requiredFullname,
        requireFacebookLink: !!(data as any).requireFacebookLink,
        requireInstagramLink: !!(data as any).requireInstagramLink,
        requiredPhoneNumber: !!(data as any).requiredPhoneNumber,
      })
      if (data.username !== undefined) setUsername(data.username)
      if (data.usernames !== undefined) setUsernames(data.usernames)
      if (data.restrictedUsers !== undefined) setRestrictedUsers(data.restrictedUsers)
    }

    // Priority 2: Fetch from backend (source of truth)
    getTournamentById(tid)
      .then(tournament => {
        if (!tournament) return
        if (tournament.gameMode) setGameMode(tournament.gameMode)

        const joinProcess = tournament.joinProcess || {}
        const participantSettings = tournament.participantSettings || {}

        // Helper to get boolean values, preferring joinProcess
        const getBool = (jpKey: string, psKey: string) => {
          if (joinProcess[jpKey] !== undefined) return !!joinProcess[jpKey]
          if (participantSettings[psKey] !== undefined) return !!participantSettings[psKey]
          return false
        }

        reset({
          confirmationRequest: !!participantSettings.ConfirmationRequest,
          scoreReporting:
            participantSettings.matchScoreReporting === 'Admin&players' ||
            participantSettings.matchScoreReporting === 'AdminsAndPlayers'
              ? 'admins-players'
              : 'admins-only',
          limitBySkillLevel: getBool('limitedBySkillLevel', 'limitbySkilllevel'),
          minSkillLevel:
            joinProcess.limitSkillLevel?.min !== undefined
              ? String(joinProcess.limitSkillLevel.min)
              : '1',
          maxSkillLevel:
            joinProcess.limitSkillLevel?.max !== undefined
              ? String(joinProcess.limitSkillLevel.max)
              : '10',
          requireSupporters: getBool('requireSubscription', 'Require Supporters to join'),
          requireVerifiedEmail: getBool('requireVerifiedEmail', 'Require a verified email to join'),
          acceptRules: !!participantSettings.Acceptrulesbeforejoiningtournament,
          registrationFields: {
            fullName: !!participantSettings.registraionfields?.['Full name'],
            age: !!participantSettings.registraionfields?.age,
            email: !!participantSettings.registraionfields?.email,
            city: !!participantSettings.registraionfields?.city,
            riotId: !!participantSettings.registraionfields?.riotId,
            universityName: !!participantSettings.registraionfields?.universityName,
            discordTag: !!participantSettings.registraionfields?.discordTag,
          },
          allowSouls: getBool('allowSouls', 'allowSouls'),
          inHouseQueue: getBool('inHouseQueue', 'inHouseQueue'),
          maxFreeAgents:
            joinProcess.maxFreeAgents !== undefined ? String(joinProcess.maxFreeAgents) : '4',
          entryFee: joinProcess.entryFee !== undefined ? String(joinProcess.entryFee) : '0',
          perTeamPurchasing: getBool('perTeamPurchasing', 'perTeamPurchasing'),
          numberOfParticipants:
            joinProcess.numberOfParticipants !== undefined
              ? String(joinProcess.numberOfParticipants)
              : '',
          numberOfSubstitutes:
            joinProcess.numberOfSubstitutes !== undefined
              ? String(joinProcess.numberOfSubstitutes)
              : '2',
          linkGameRequired: getBool('linkGameRequired', 'linkGameRequired'),
          allowIndividualRegistrations: getBool(
            'allowIndividualRegistrations',
            'allowIndividualRegistrations',
          ),
          requireManualApproval: getBool('requireManualApproval', 'requireManualApproval'),
          requireCompleteTeamRoster: getBool(
            'requireCompleteTeamRoster',
            'requireCompleteTeamRoster',
          ),
          requireAgeVerification: getBool('requireAgeVerification', 'requireAgeVerification'),
          requireGameAccount: getBool('requireGameAccount', 'requireGameAccount'),
          requireDiscordUsername: getBool('requireDiscordUsername', 'requireDiscordUsername'),
          requireEpicGamesUsername: getBool('requireEpicGamesUsername', 'requireEpicGamesUsername'),
          requireSteamId: getBool('requireSteamId', 'requireSteamId'),
          requireRiotId: getBool('requireRiotId', 'requireRiotId'),
          requireRankRating: getBool('requireRankRating', 'requireRankRating'),
          requireCustomGameIdentifier: getBool(
            'requireCustomGameIdentifier',
            'requireCustomGameIdentifier',
          ),
          requiredFullname: getBool('requiredFullname', 'requiredFullname'),
          requireFacebookLink: getBool('requireFacebookLink', 'requireFacebookLink'),
          requireInstagramLink: getBool('requireInstagramLink', 'requireInstagramLink'),
          requiredPhoneNumber: getBool('requiredPhoneNumber', 'requiredPhoneNumber'),
        })

        if (participantSettings.usernames && Array.isArray(participantSettings.usernames)) {
          setUsernames(participantSettings.usernames)
        }
        if (participantSettings.username) {
          setUsername(participantSettings.username)
        }
      })
      .catch(error => {
        console.error('Error fetching tournament data:', error)

        // Priority 3: Fallback to local draft only if backend fails
        const info = readInfo<Record<string, any> | null>(tid)
        const settings = (info as any)?.participantSettings
        if (settings) {
          reset({
            confirmationRequest: !!settings.ConfirmationRequest,
            scoreReporting:
              settings.matchScoreReporting === 'Admin&players' ? 'admins-players' : 'admins-only',
            limitBySkillLevel: !!settings.limitbySkilllevel,
            requireSupporters: !!settings['Require Supporters to join'],
            requireVerifiedEmail: !!settings['Require a verified email to join'],
            acceptRules: !!settings.Acceptrulesbeforejoiningtournament,
            minSkillLevel: String(settings?.joinProcess?.minSkillLevel ?? '1'),
            maxSkillLevel: String(settings?.joinProcess?.maxSkillLevel ?? '10'),
            registrationFields: {
              fullName: !!settings.registraionfields?.['Full name'],
              age: !!settings.registraionfields?.age,
              email: !!settings.registraionfields?.email,
              city: !!settings.registraionfields?.city,
              riotId: !!settings.registraionfields?.riotId,
              universityName: !!settings.registraionfields?.universityName,
              discordTag: !!settings.registraionfields?.discordTag,
            },
            allowSouls: !!settings.joinProcess?.allowSouls,
            inHouseQueue: !!settings.joinProcess?.inHouseQueue,
            maxFreeAgents: String(settings.joinProcess?.maxFreeAgents ?? '4'),
            entryFee: String(settings.joinProcess?.entryFee ?? '0'),
            perTeamPurchasing: !!settings.joinProcess?.perTeamPurchasing,
            numberOfParticipants: String(settings.joinProcess?.numberOfParticipants ?? ''),
            numberOfSubstitutes: String(settings.joinProcess?.numberOfSubstitutes ?? '2'),
            linkGameRequired: !!settings.joinProcess?.linkGameRequired,
            allowIndividualRegistrations: !!settings.joinProcess?.allowIndividualRegistrations,
            requireManualApproval: !!settings.joinProcess?.requireManualApproval,
            requireCompleteTeamRoster: !!settings.joinProcess?.requireCompleteTeamRoster,
            requireAgeVerification: !!settings.joinProcess?.requireAgeVerification,
            requireGameAccount: !!settings.joinProcess?.requireGameAccount,
            requireDiscordUsername: !!settings.joinProcess?.requireDiscordUsername,
            requireEpicGamesUsername: !!settings.joinProcess?.requireEpicGamesUsername,
            requireSteamId: !!settings.joinProcess?.requireSteamId,
            requireRiotId: !!settings.joinProcess?.requireRiotId,
            requireRankRating: !!settings.joinProcess?.requireRankRating,
            requireCustomGameIdentifier: !!settings.joinProcess?.requireCustomGameIdentifier,
            requiredFullname: !!settings.joinProcess?.requiredFullname,
            requireFacebookLink: !!settings.joinProcess?.requireFacebookLink,
            requireInstagramLink: !!settings.joinProcess?.requireInstagramLink,
            requiredPhoneNumber: !!settings.joinProcess?.requiredPhoneNumber,
          })
          if (settings.usernames && Array.isArray(settings.usernames)) {
            setUsernames(settings.usernames)
          }
          if (settings.username) {
            setUsername(settings.username)
          }
        }
      })
  }, [reset, searchParams])

  // Auto-save form state to session draft as user types
  const formValues = watch()
  const saveToSessionDraft = useCallback(() => {
    const tid = getCurrentTournamentId()
    const values = getValues()
    const participationData = {
      ...values,
      username,
      usernames,
      restrictedUsers,
      timestamp: Date.now(),
    }
    writeSessionDraft('participationDraft', participationData, tid)
  }, [getValues, username, usernames, restrictedUsers])

  useEffect(() => {
    saveToSessionDraft()
  }, [formValues, username, usernames, restrictedUsers, saveToSessionDraft])

  // Save on page unload
  useEffect(() => {
    const handleBeforeUnload = () => saveToSessionDraft()
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      saveToSessionDraft()
    }
  }, [saveToSessionDraft])

  // Helper to build joinProcess object from form values
  const buildJoinProcessFromValues = useCallback(
    (values: ParticipantForm) => ({
      limitSkillLevel: {
        min: Number(values.minSkillLevel),
        max: Number(values.maxSkillLevel),
      },
      limitedBySkillLevel: !!values.limitBySkillLevel,
      requireVerifiedEmail: !!values.requireVerifiedEmail,
      requireSubscription: !!values.requireSupporters,
      allowSouls: !!values.allowSouls,
      inHouseQueue: !!values.inHouseQueue,
      maxFreeAgents: Number(values.maxFreeAgents ?? 0),
      entryFee: Number(values.entryFee ?? 0),
      perTeamPurchasing: !!values.perTeamPurchasing,
      numberOfParticipants:
        values.numberOfParticipants !== '' && values.numberOfParticipants !== undefined
          ? Number(values.numberOfParticipants)
          : 0,
      numberOfSubstitutes:
        values.numberOfSubstitutes !== '' && values.numberOfSubstitutes !== undefined
          ? Number(values.numberOfSubstitutes)
          : 0,
      linkGameRequired: !!values.linkGameRequired,
      allowIndividualRegistrations: !!values.allowIndividualRegistrations,
      requireManualApproval: !!values.requireManualApproval,
      requireCompleteTeamRoster: !!values.requireCompleteTeamRoster,
      requireAgeVerification: !!values.requireAgeVerification,
      requireGameAccount: !!values.requireGameAccount,
      requireDiscordUsername: !!values.requireDiscordUsername,
      requireEpicGamesUsername: !!values.requireEpicGamesUsername,
      requireSteamId: !!values.requireSteamId,
      requireRiotId: !!values.requireRiotId,
      requireRankRating: !!values.requireRankRating,
      requireCustomGameIdentifier: !!values.requireCustomGameIdentifier,
      requiredFullname: !!values.requiredFullname,
      requireFacebookLink: !!values.requireFacebookLink,
      requireInstagramLink: !!values.requireInstagramLink,
      requiredPhoneNumber: !!values.requiredPhoneNumber,
    }),
    [],
  )

  const saveToLocalStorage = () => {
    const values = getValues()
    const tid = getCurrentTournamentId()

    const participantSettings = {
      ConfirmationRequest: values.confirmationRequest,
      matchScoreReporting: values.scoreReporting === 'admins-players' ? 'Admin&players' : 'Admin',
      limitbySkilllevel: values.limitBySkillLevel,
      'Require Supporters to join': values.requireSupporters,
      'Require a verified email to join': values.requireVerifiedEmail,
      Acceptrulesbeforejoiningtournament: values.acceptRules,
      username: username,
      usernames: usernames,
      registraionfields: {
        'Full name': values.registrationFields.fullName,
        city: values.registrationFields.city,
        email: values.registrationFields.email,
        age: values.registrationFields.age,
        riotId: values.registrationFields.riotId,
        discordTag: values.registrationFields.discordTag,
        universityName: values.registrationFields.universityName,
      },
    }

    writeInfo(
      {
        participantSettings,
        restrictedUsers: restrictedUsers.map(u => u._id),
        joinProcess: buildJoinProcessFromValues(values),
      },
      tid,
    )
  }

  const updateTournamentInDatabase = async (updates: Record<string, unknown>) => {
    if (!tournamentId || !session?.accessToken) {
      return
    }

    try {
      await updateTournament(tournamentId, updates)
      return true
    } catch {
      toast.error('Error updating tournament')
      return false
    }
  }

  const handleUserSearch = async (searchTerm: string) => {
    if (searchTerm.length < 2) {
      setSearchResults([])
      setShowSearchDropdown(false)
      return
    }

    try {
      const results = await searchUsers(searchTerm)
      setSearchResults(results)
      setShowSearchDropdown(true)
    } catch {
      toast.error('Error searching users')
      setSearchResults([])
      setShowSearchDropdown(false)
    }
  }

  const addRestrictedUser = (user: Record<string, any>) => {
    if (!restrictedUsers.find(u => u._id === user._id)) {
      const newRestrictedUsers = [...restrictedUsers, user]
      setRestrictedUsers(newRestrictedUsers)
      setUsername('')
      setShowSearchDropdown(false)
    }
  }

  const removeRestrictedUser = (userId: string) => {
    const newRestrictedUsers = restrictedUsers.filter(u => u._id !== userId)
    setRestrictedUsers(newRestrictedUsers)
  }

  const handleScoreReportingChange = (value: string) => {
    setValue('scoreReporting', value as ParticipantForm['scoreReporting'])
  }

  const handleLimitBySkillLevelChange = (value: boolean) => {
    setValue('limitBySkillLevel', value)
  }

  const handleRequireVerifiedEmailChange = (value: boolean) => {
    setValue('requireVerifiedEmail', value)
  }

  const handleConfirmationRequestChange = (value: boolean) => {
    setValue('confirmationRequest', value)
  }

  const handleRequireSupportersChange = (value: boolean) => {
    setValue('requireSupporters', value)
  }

  const handleAcceptRulesChange = (value: boolean) => {
    setValue('acceptRules', value)
  }

  const handleRegistrationFieldChange = (field: keyof RegistrationFields, value: boolean) => {
    const current = getValues('registrationFields')
    setValue('registrationFields', { ...current, [field]: value })
  }

  const handleMinSkillLevelChange = (value: string) => {
    setValue('minSkillLevel', value)
  }

  const handleMaxSkillLevelChange = (value: string) => {
    setValue('maxSkillLevel', value)
  }

  const handleUsernameChange = (value: string) => {
    setUsername(value)
    handleUserSearch(value)
  }

  const toggleRegistrationField = (field: keyof RegistrationFields) => {
    const current = getValues('registrationFields')
    handleRegistrationFieldChange(field, !current[field])
  }

  const handleAddUsername = () => {
    setUsername('')
    setShowSearchDropdown(false)
  }

  const handleNext = async (values: ParticipantForm) => {
    if (!session?.accessToken) {
      toast.error('Authentication required. Please log in again.')
      return
    }

    setIsSubmitting(true)

    try {
      const success = await updateTournamentInDatabase({
        confirmRequests: !!values.confirmationRequest,
        acceptSupporters: !!values.requireSupporters,
        restrictedUsers: restrictedUsers.map(user => user._id),
        tournamentFormat: {
          matchScoreReporting:
            values.scoreReporting === 'admins-players' ? 'AdminsAndPlayers' : 'Admins',
        },
        joinProcess: buildJoinProcessFromValues(values),
      })

      if (!success) return

      toast.success('Participant settings saved')

      // Clear session draft so next load fetches from backend
      const tid = getCurrentTournamentId()
      if (tid) {
        try {
          sessionStorage.removeItem(`defendr:tournament:${tid}:participation:draft`)
        } catch {
          // ignore
        }
      }

      saveToLocalStorage()
      // mark saved for this tournament
      markSaved('participationSavedFlag', getCurrentTournamentId())
      router.push('/tournament/setup/prizes')
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Failed to update participant settings: ${error.message}`)
      } else {
        toast.error('Failed to update participant settings. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const skillLevelOptions = Array.from({ length: 10 }, (_, i) => ({
    value: String(i + 1),
    label: String(i + 1),
  }))

  const registrationFieldOptions = [
    { key: 'fullName', label: 'Full name' },
    { key: 'age', label: 'Age' },
    { key: 'email', label: 'Email' },
    { key: 'city', label: 'City' },
    { key: 'riotId', label: 'Riot ID' },
    { key: 'universityName', label: 'University name' },
    { key: 'discordTag', label: 'Discord Tag' },
  ]
  const toggleOptions = [
    {
      label: 'Require Supporters to join',
      value: formValues.requireSupporters,
      onChange: handleRequireSupportersChange,
      tooltip: 'Only supporters/subscribers can join this tournament.',
    },
    {
      label: 'Require a verified email to join',
      value: formValues.requireVerifiedEmail,
      onChange: handleRequireVerifiedEmailChange,
      tooltip: 'Players must verify their email before they can register.',
    },
    {
      label: 'Accept rules before joining tournament',
      value: formValues.acceptRules,
      onChange: handleAcceptRulesChange,
      tooltip: 'Players will need to accept your rules prior to joining.',
    },
  ]

  return (
    <div className="max-w-5xl text-white">
      <h1 className="text-4xl font-bold mb-8 font-poppins">Participant settings</h1>

      <div className="mb-8" title="Enrolled players must be approved by an admin before joining.">
        <CustomCheckbox
          checked={formValues.confirmationRequest}
          id="confirmation-request"
          label="Confirmation Request"
          onChange={() => handleConfirmationRequestChange(!formValues.confirmationRequest)}
        />
        <Typo as="p" className="mt-1 ml-6" color="grey" fontFamily="poppins" fontVariant="p5">
          In order to players enrolled to the tournament need to get accepted by admin
        </Typo>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 font-poppins">Join Details</h2>

        <div className="mb-6" title="Choose who can report match scores.">
          <p className="text-white mb-3 text-lg font-poppins">Match Score Reporting</p>
          <ToggleGroup
            options={[
              { value: 'admins-only', label: 'Admins only' },
              { value: 'admins-players', label: 'Admins & players' },
            ]}
            value={formValues.scoreReporting}
            onChange={handleScoreReportingChange}
          />
        </div>

        {/* Limit by skill level - hidden per product request
        <div
          className="mb-6"
          title="Restrict registrations to players within the selected skill range."
        >
          <CustomToggleSwitch
            checked={formValues.limitBySkillLevel}
            className="mb-4"
            label="Limit by skill level"
            onChange={handleLimitBySkillLevelChange}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                <Image
                  alt="Min Level"
                  className="inline-block"
                  height={20}
                  src={greenImage}
                  width={20}
                />
              </div>
              <select
                className="w-full bg-defendrLightBlack text-white rounded-md pl-12 pr-8 py-2 appearance-none border border-defendrGrey focus:border-defendrRed outline-none font-poppins transition-colors"
                title="Minimum allowed skill level"
                value={formValues.minSkillLevel ?? '1'}
                onChange={e => handleMinSkillLevelChange(e.target.value)}
              >
                {skillLevelOptions.map(option => (
                  <option
                    key={option.value}
                    className="bg-defendrLightBlack text-white"
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <DropdownArrowIcon />
              </div>
            </div>

            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                <Image
                  alt="Max Level"
                  className="inline-block"
                  height={20}
                  src={reddImage}
                  width={20}
                />
              </div>
              <select
                className="w-full bg-defendrLightBlack text-white rounded-md pl-12 pr-8 py-2 appearance-none border border-defendrGrey focus:border-defendrRed outline-none font-poppins transition-colors"
                title="Maximum allowed skill level"
                value={formValues.maxSkillLevel ?? '10'}
                onChange={e => handleMaxSkillLevelChange(e.target.value)}
              >
                {skillLevelOptions.map(option => (
                  <option
                    key={option.value}
                    className="bg-defendrLightBlack text-white"
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <DropdownArrowIcon />
              </div>
            </div>
          </div>
        </div>
        */}

        <div className="space-y-4">
          {toggleOptions.map(option => (
            <div key={option.label} title={option.tooltip}>
              <CustomToggleSwitch
                checked={option.value}
                label={option.label}
                onChange={option.onChange}
              />
            </div>
          ))}
        </div>

        {/* Extended Entry Requirement Flags */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4 font-poppins">
            Registration Fields for Players
          </h3>
          <div className="flex items-start gap-3 bg-defendrRed/10 border border-defendrRed/30 rounded-lg px-4 py-3 mb-4">
            <span className="text-defendrRed text-lg leading-none mt-0.5">⚠</span>
            <p className="text-sm text-white/80 font-poppins leading-relaxed">
              Select the fields players must fill in before joining. Only request information that
              is strictly necessary — these fields collect{' '}
              <span className="text-defendrRed font-semibold">personal data</span>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Registration Fields for Players */}
            {[
              { key: 'requireAgeVerification', label: 'Require Age Verification' },
              { key: 'allowIndividualRegistrations', label: 'Allow Individual Registrations' },
              {
                key: 'requireCustomGameIdentifier',
                label: 'Require Custom Game Identifier',
                tooltip:
                  'Players must provide their in-game ID or username for the selected game before joining.',
              },
              { key: 'requiredFullname', label: 'Require Full Name' },
              { key: 'requireDiscordUsername', label: 'Require Discord Username' },
              { key: 'requireFacebookLink', label: 'Require Facebook Link' },
              { key: 'requireInstagramLink', label: 'Require Instagram Link' },
              { key: 'requiredPhoneNumber', label: 'Require Phone Number' },
            ].map(flag => (
              <div
                key={flag.key}
                className="flex items-center justify-between bg-defendrLightBlack/40 border border-defendrGrey rounded-md px-4 py-3"
              >
                <span className="text-sm font-poppins pr-4 flex items-center gap-1.5">
                  {flag.label}
                  {'tooltip' in flag && (
                    <span className="relative group">
                      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-defendrRed/80 text-[10px] text-white cursor-help font-bold">
                        ?
                      </span>
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex w-56 px-3 py-2 rounded-lg bg-defendrRed text-white text-xs font-poppins leading-relaxed shadow-lg z-50 pointer-events-none">
                        {(flag as any).tooltip}
                      </span>
                    </span>
                  )}
                </span>
                <CustomToggleSwitch
                  checked={(formValues as any)[flag.key]}
                  label=""
                  onChange={val => setValue(flag.key as any, val)}
                />
              </div>
            ))}
          </div>

          <h4 className="text-lg font-semibold mt-8 mb-3 font-poppins">Numeric & Count Limits</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { key: 'maxFreeAgents', label: 'Max Free Agents', placeholder: '4' },
              { key: 'entryFee', label: 'Entry Fee', placeholder: '0' },
              { key: 'numberOfParticipants', label: 'Number of Participants', placeholder: '' },
              { key: 'numberOfSubstitutes', label: 'Number of Substitutes', placeholder: '2' },
            ].map(field => (
              <div key={field.key} className="flex flex-col">
                <label className="text-xs font-medium mb-1 font-poppins" htmlFor={field.key}>
                  {field.label}
                </label>
                <input
                  id={field.key}
                  className="bg-defendrLightBlack text-white rounded-md px-4 py-3 text-base border border-defendrGrey focus:border-defendrRed outline-none font-poppins"
                  placeholder={field.placeholder}
                  type="number"
                  value={
                    (formValues as any)[field.key] !== undefined &&
                    (formValues as any)[field.key] !== null
                      ? (formValues as any)[field.key]
                      : ''
                  }
                  onChange={e => setValue(field.key as any, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* <div className="mb-8">
        <h2 className="text-xl font-bold mb-2 font-poppins">Registration Fields for Players</h2>
        <p className="text-defendrRed text-sm mb-4 font-poppins">
          Add Fields for players to field in before joining the tournament. Be Careful to add
          correct fields and make sure you only add the required things from players because its
          personnel data
        </p>

        <div className="grid grid-cols-3 gap-4">
          {registrationFieldOptions.map(field => (
            <CustomCheckbox
              key={field.key}
              checked={formValues.registrationFields[field.key as keyof RegistrationFields]}
              id={`field-${field.key}`}
              label={field.label}
              onChange={() => toggleRegistrationField(field.key as keyof RegistrationFields)}
            />
          ))}
        </div>
      </div> */}

      <div className="mb-12 border-t border-defendrGrey pt-6">
        <h2 className="text-xl font-bold mb-4 font-poppins">Joining Restrictions</h2>

        <div className="flex items-end gap-3 max-w-md mb-4">
          <div className="flex-1 relative">
            <label className="text-white font-medium mb-2 text-xs font-poppins block">
              Username
            </label>
            <input
              className="bg-transparent text-white rounded-lg px-3 py-2 border border-defendrGrey focus:border-defendrRed outline-none placeholder-defendrGrey font-poppins text-sm w-full transition-colors"
              placeholder="Search username..."
              type="text"
              value={username ?? ''}
              onChange={e => handleUsernameChange(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddUsername()}
            />

            {/* Search Results Dropdown */}
            {showSearchDropdown && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-defendrLightBlack border border-defendrGrey rounded-lg mt-1 max-h-48 overflow-y-auto z-10">
                {searchResults.map(user => (
                  <div
                    key={user._id}
                    className="px-3 py-2 hover:bg-defendrRed/20 cursor-pointer border-b border-defendrGrey/30 last:border-b-0"
                    onClick={() => addRestrictedUser(user)}
                  >
                    <div className="text-white font-poppins text-sm">{user.nickname}</div>
                    <div className="text-defendrGrey font-poppins text-xs">{user.email}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            className="bg-defendrRed text-white rounded-lg px-3 py-2 font-poppins text-sm font-medium hover:bg-defendrRed/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!username.trim()}
            onClick={handleAddUsername}
          >
            Add +
          </button>
        </div>

        {/* Display restricted users */}
        {restrictedUsers.length > 0 && (
          <div className="space-y-2 max-w-md">
            <p className="text-white font-medium text-xs font-poppins">Restricted Users:</p>
            {restrictedUsers.map(user => (
              <div
                key={user._id}
                className="flex items-center justify-between bg-defendrLightBlack rounded-lg px-3 py-2"
              >
                <div>
                  <span className="text-white font-poppins text-sm">{user.nickname}</span>
                  <div className="text-defendrGrey font-poppins text-xs">{user.email}</div>
                </div>
                <button
                  className="text-defendrRed hover:text-red-400 transition-colors"
                  title="Remove user"
                  onClick={() => removeRestrictedUser(user._id)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          className="min-w-[90px]"
          disabled={isSubmitting}
          label="Next"
          size="xxs"
          textClassName="font-poppins"
          variant="contained-red"
          onClick={handleSubmit(handleNext)}
        />
      </div>
    </div>
  )
}
