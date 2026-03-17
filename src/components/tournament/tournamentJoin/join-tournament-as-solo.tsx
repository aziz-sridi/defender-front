'use client'
import { Tournament } from '@/types/tournamentType'
import { Participant } from '@/types/participantType'
import { type Session } from 'next-auth'
import React, { useState } from 'react'
import {
  joinTournament,
  updateUserDataToAcceptRequirementFields,
} from '@/services/joinTournamentService'
import { toast } from 'sonner'
import Button from '@/components/ui/Button'
import { Check, AlertCircle, Loader } from 'lucide-react'
import RequirementFields from './requirement-fields'
import { useSession as useSessionUpdate } from 'next-auth/react'

type JoinState = 'initial' | 'confirming' | 'joining' | 'success' | 'error'

const JoinTournamentAsSolo = ({
  tournament,
  session,
  closeModal,
  onJoinSuccess,
}: {
  tournament: Tournament
  session: Session | null
  closeModal: () => void
  onJoinSuccess?: (participant?: Participant) => void
}) => {
  const [joinState, setJoinState] = useState<JoinState>('initial')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [canConfirm, setCanConfirm] = useState<boolean>(false)
  const [requirementData, setRequirementData] = useState<any>({})
  const { update: updateSession } = useSessionUpdate()

  const handleConfirmJoin = async () => {
    if (!session?.user?._id) {
      toast.error('Please log in to join the tournament')
      return
    }

    setJoinState('joining')
    try {
      // Update user data with requirement fields if any data exists
      if (Object.keys(requirementData).length > 0) {
        const updatePayload: any = {}

        // Basic fields
        if (requirementData.discordUsername) updatePayload.discord = requirementData.discordUsername
        if (requirementData.epicGamesUsername)
          updatePayload.epicId = requirementData.epicGamesUsername
        if (requirementData.steamId) updatePayload.steamId = requirementData.steamId
        if (requirementData.phoneNumber) updatePayload.phoneNumber = requirementData.phoneNumber
        if (requirementData.country) updatePayload.country = requirementData.country
        if (requirementData.facebookLink) updatePayload.facebookLink = requirementData.facebookLink
        if (requirementData.instagramLink)
          updatePayload.instagramLink = requirementData.instagramLink
        if (requirementData.dateOfBirth) updatePayload.dateOfBirth = requirementData.dateOfBirth
        if (requirementData.fullname) updatePayload.fullname = requirementData.fullname

        // Riot ID needs to be split
        if (requirementData.riotGameName && requirementData.riotTagline) {
          updatePayload.riotId = requirementData.riotGameName
          updatePayload.riotTagline = requirementData.riotTagline
        }

        // Custom game identifiers
        if (requirementData.mobileLegends_gameId) {
          updatePayload.mobileLegends_gameId = requirementData.mobileLegends_gameId
        }
        if (requirementData.mobileLegends_zoneId) {
          updatePayload.mobileLegends_zoneId = requirementData.mobileLegends_zoneId
        }
        if (requirementData.battlenet_battletag) {
          updatePayload.battlenet_battletag = requirementData.battlenet_battletag
        }
        if (requirementData.psn_username) {
          updatePayload.psn_username = requirementData.psn_username
        }
        if (requirementData.xbox_gamertag) {
          updatePayload.xbox_gamertag = requirementData.xbox_gamertag
        }
        if (requirementData.origin_username) {
          updatePayload.origin_username = requirementData.origin_username
        }
        if (requirementData.efootball_username) {
          updatePayload.efootball_username = requirementData.efootball_username
        }

        if (Object.keys(updatePayload).length > 0) {
          await updateUserDataToAcceptRequirementFields(updatePayload)
          // Update session with new data
          await updateSession()
        }
      }

      const response = await joinTournament(tournament._id)

      if (response?.success) {
        setJoinState('success')
        toast.success('Successfully joined the tournament!')
        setTimeout(() => {
          onJoinSuccess?.(response.participant)
          closeModal()
        }, 2000)
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : 'Failed to join tournament. Please try again.'
      setErrorMessage(errorMsg)
      setJoinState('error')
      toast.error(errorMsg)
      console.error('Error joining tournament:', error)
    }
  }

  const handleCancel = () => {
    setJoinState('initial')
    setErrorMessage('')
    closeModal()
  }

  const handleRetry = () => {
    setJoinState('initial')
    setErrorMessage('')
  }

  // Wait for session to load
  if (session === undefined) {
    return (
      <div className="flex flex-col items-center justify-center w-full gap-6 py-12 px-4">
        <Loader className="w-12 h-12 animate-spin text-blue-500" />
        <h3 className="text-xl font-bold">Loading...</h3>
      </div>
    )
  }

  // Initial state - Show confirmation dialog
  if (joinState === 'initial') {
    return (
      <div className="flex flex-col items-center justify-center w-full gap-6 py-8 px-4">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">Are you sure to join as solo ?</h3>
          <p className="text-gray-400 text-sm">
            Are you sure you want to join <span className="font-semibold">{tournament.name}</span>{' '}
            as a solo player?
          </p>
        </div>

        <RequirementFields
          joinProcess={tournament.joinProcess}
          game={tournament.game}
          onValidationChange={(isValid, formData) => {
            setCanConfirm(isValid)
            if (formData) setRequirementData(formData)
          }}
        />

        <div className="w-full flex gap-3 justify-center pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-8 py-2 rounded-xl border-2 border-defendrRed text-defendrRed font-medium cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmJoin}
            disabled={!canConfirm}
            className="px-8 py-2 rounded-xl border-2 border-defendrRed text-white bg-defendrRed font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm Join
          </button>
        </div>
      </div>
    )
  }

  // Loading state
  if (joinState === 'joining') {
    return (
      <div className="flex flex-col items-center justify-center w-full gap-6 py-12 px-4">
        <h3 className="text-xl font-bold">Joining Tournament...</h3>
        <p className="text-gray-400 text-sm">Please wait while we process your join request</p>
      </div>
    )
  }

  // Success state
  if (joinState === 'success') {
    return (
      <div className="flex flex-col items-center justify-center w-full gap-6 py-12 px-4">
        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
          <Check className="w-8 h-8 text-green-500" />
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2 text-green-500">Success!</h3>
          <p className="text-gray-400 text-sm">
            You have successfully joined <span className="font-semibold">{tournament.name}</span> as
            a solo player
          </p>
        </div>
        <p className="text-xs text-gray-500 mt-2">Redirecting...</p>
      </div>
    )
  }

  // Error state
  if (joinState === 'error') {
    return (
      <div className="flex flex-col items-center justify-center w-full gap-6 py-12 px-4">
        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2 text-red-500">Join Failed</h3>
          <p className="text-gray-400 text-sm">{errorMessage}</p>
        </div>

        <div className="w-full flex gap-3 justify-center pt-4">
          <button
            type="button"
            onClick={handleRetry}
            className="px-4 py-1 rounded-xl bg-yellow-950 text-yellow-400 border border-yellow-400 cursor-pointer"
          >
            Try Again
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-1 rounded-xl bg-red-950 text-red-400 border border-red-400 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return null
}

export default JoinTournamentAsSolo
