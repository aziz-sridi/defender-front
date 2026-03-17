import { X } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  playerAcceptInvitation,
  playerConfirmAcceptInvitation,
  playerRejectInvitation,
  updateUserDataToAcceptRequirementFields,
} from '@/services/joinTournamentService'
import { getParticipantById } from '@/services/participantService'
import { getTournamentById } from '@/services/tournamentService'
import { JoinProcess, Tournament } from '@/types/tournamentType'
import { Game } from '@/types/gameType'
import RequirementFields from './requirement-fields'
import { InvitedMember } from '@/types/participantType'

const PlayerInvitedOpinionButtons = ({
  participantId,
  refreshNotifications,
}: {
  participantId: string
  refreshNotifications: () => Promise<void>
}) => {
  const { data: session, update: updateSession } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showDeclineConfirm, setShowDeclineConfirm] = useState(false)
  const [isDeclineLoading, setIsDeclineLoading] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [isRequirementsLoading, setIsRequirementsLoading] = useState(false)
  const [joinProcess, setJoinProcess] = useState<JoinProcess | null>(null)
  const [game, setGame] = useState<Game | undefined>(undefined)
  const [canConfirm, setCanConfirm] = useState(false)
  const [requirementData, setRequirementData] = useState<any>({})
  const [inviteNotConfirmed, setInviteNotConfirmed] = useState(false)

  const handleAccept = async () => {
    if (!session?.user?._id) return

    setIsOpen(true)
    setShowDeclineConfirm(false)
    setIsLoading(true)

    try {
      const response = await playerAcceptInvitation(session.user._id, participantId)
      toast.success(response.message || 'Invitation accepted successfully')
    } catch (error: any) {
      console.error('Failed to accept invitation:', error)
      toast.error(error?.message || 'Failed to accept invitation')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDecline = () => {
    setIsOpen(true)
    setShowDeclineConfirm(true)
  }

  const handleConfirmDecline = async () => {
    if (!session?.user?._id) return
    setIsDeclineLoading(true)
    try {
      const response = await playerRejectInvitation(session.user._id, participantId)
      toast.success(response.message || 'Invitation declined successfully')
      await refreshNotifications()
      setIsOpen(false)
    } catch (error: any) {
      console.error('Failed to decline invitation:', error)
      toast.error(error?.message || 'Failed to decline invitation')
    } finally {
      setIsDeclineLoading(false)
    }
  }

  const buildUpdatePayload = (data: any) => {
    const updatePayload: any = {}

    if (data.discordUsername) updatePayload.discord = data.discordUsername
    if (data.epicGamesUsername) updatePayload.epicId = data.epicGamesUsername
    if (data.steamId) updatePayload.steamId = data.steamId
    if (data.phoneNumber) updatePayload.phoneNumber = data.phoneNumber
    if (data.country) updatePayload.country = data.country
    if (data.facebookLink) updatePayload.facebookLink = data.facebookLink
    if (data.instagramLink) updatePayload.instagramLink = data.instagramLink
    if (data.dateOfBirth) updatePayload.dateOfBirth = data.dateOfBirth
    if (data.fullname) updatePayload.fullname = data.fullname

    if (data.riotGameName && data.riotTagline) {
      updatePayload.riotId = data.riotGameName
      updatePayload.riotTagline = data.riotTagline
    }

    if (data.mobileLegends_gameId) updatePayload.mobileLegends_gameId = data.mobileLegends_gameId
    if (data.mobileLegends_zoneId) updatePayload.mobileLegends_zoneId = data.mobileLegends_zoneId
    if (data.battlenet_battletag) updatePayload.battlenet_battletag = data.battlenet_battletag
    if (data.psn_username) updatePayload.psn_username = data.psn_username
    if (data.xbox_gamertag) updatePayload.xbox_gamertag = data.xbox_gamertag
    if (data.origin_username) updatePayload.origin_username = data.origin_username
    if (data.efootball_username) updatePayload.efootball_username = data.efootball_username

    return updatePayload
  }

  const handleConfirmAccept = async () => {
    if (!session?.user?._id) return

    setIsConfirming(true)
    try {
      const updatePayload = buildUpdatePayload(requirementData)
      if (Object.keys(updatePayload).length > 0) {
        await updateUserDataToAcceptRequirementFields(updatePayload)
        await updateSession()
      }

      const response = await playerConfirmAcceptInvitation(
        session.user._id,
        participantId,
        requirementData.fullname,
        requirementData.dateOfBirth,
        requirementData.discordUsername,
      )

      toast.success(response.message || 'Invitation confirmed successfully!')
      await refreshNotifications()
      setIsOpen(false)
    } catch (error: any) {
      console.error('Failed to confirm invitation:', error)
      toast.error(error?.message || 'Failed to confirm invitation')
    } finally {
      setIsConfirming(false)
    }
  }

  useEffect(() => {
    const loadRequirements = async () => {
      if (!isOpen || showDeclineConfirm) return
      if (!participantId) return

      setCanConfirm(false)
      setRequirementData({})
      setIsRequirementsLoading(true)
      try {
        const participant = await getParticipantById(participantId)
        if (!participant?.tournament) {
          setJoinProcess(null)
          setGame(undefined)
          return
        }
        const tournamentResponse = await getTournamentById(participant.tournament)
        const tournament: Tournament | undefined =
          (tournamentResponse as { tournament?: Tournament })?.tournament ||
          (tournamentResponse as Tournament)
        setJoinProcess(tournament?.joinProcess || null)
        setGame(tournament?.game)
      } catch (error) {
        console.error('Failed to load tournament requirements:', error)
        toast.error('Failed to load tournament requirements')
      } finally {
        setIsRequirementsLoading(false)
      }
    }

    loadRequirements()
  }, [isOpen, showDeclineConfirm, participantId])

  useEffect(() => {
    if (!isOpen) {
      setCanConfirm(false)
      setRequirementData({})
    }
  }, [isOpen])

  useEffect(() => {
    getParticipantById(participantId).then(participant => {
      participant.invitedMembers.forEach((member: InvitedMember) => {
        if (member.user === session?.user?._id && member.status === 'CONFIRMATION_NOT_COMPLETED') {
          setInviteNotConfirmed(true)
        }
      })
    })
  }, [isOpen])

  return (
    <>
      <button
        type="button"
        className="text-sm px-4 py-1.5 rounded-lg bg-defendrRed cursor-pointer hover:brightness-75 duration-100 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleAccept}
        disabled={isLoading}
      >
        {inviteNotConfirmed ? (
          'Complete your registration '
        ) : (
          <>Accept{isLoading ? 'ing...' : ''}</>
        )}
      </button>
      <button
        type="button"
        className="text-sm px-4 py-1.5 rounded-lg border-2 border-defendrRed text-defendrRed bg-red-950 cursor-pointer hover:brightness-75 duration-100"
        onClick={handleDecline}
      >
        Decline
      </button>
      {isOpen && (
        <div className="fixed z-999 size-screen inset-0 pointer-events-auto size-screen bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative p-4 lg:p-8 pt-14 bg-zinc-800 rounded-2xl max-w-full w-200 flex items-center justify-center">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="size-10 hover:bg-zinc-700 duration-300 flex items-center justify-center rounded-full absolute right-2 lg:right-6 top-2 lg:top-6 cursor-pointer"
            >
              <X />
            </button>
            {showDeclineConfirm ? (
              <div className="flex flex-col items-center justify-center gap-4 w-full">
                <p className="text-lg font-bold">Decline Invitation?</p>
                <p className="text-sm text-defendrGhostGrey text-center">
                  Are you sure you want to decline this tournament invitation?
                </p>
                <div className="flex gap-3 w-full mt-4">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 px-4 py-2 rounded-lg border-2 border-defendrRed text-defendrRed cursor-pointer hover:brightness-75 duration-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDecline}
                    disabled={isDeclineLoading}
                    className="flex-1 px-4 py-2 rounded-lg bg-defendrRed text-white cursor-pointer hover:brightness-75 duration-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeclineLoading ? 'Declining...' : 'Confirm'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 w-full">
                <h5 className="text-2xl leading-10 font-bold text-center">
                  Confirm your invitation
                </h5>
                <p className="text-sm text-defendrGhostGrey text-center">
                  Complete the required details to confirm your spot.
                </p>

                {isRequirementsLoading || !joinProcess ? (
                  <div className="w-full flex items-center justify-center py-6 text-sm text-gray-400">
                    Loading requirements...
                  </div>
                ) : (
                  <RequirementFields
                    joinProcess={joinProcess}
                    game={game}
                    onValidationChange={(isValid, formData) => {
                      setCanConfirm(isValid)
                      if (formData) setRequirementData(formData)
                    }}
                  />
                )}

                <div className="flex gap-3 w-full mt-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 px-4 py-2 rounded-lg border-2 border-defendrRed text-defendrRed cursor-pointer hover:brightness-75 duration-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmAccept}
                    disabled={!canConfirm || isConfirming || isRequirementsLoading}
                    className="flex-1 px-4 py-2 rounded-lg bg-defendrRed text-white cursor-pointer hover:brightness-75 duration-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isConfirming ? 'Confirming...' : 'Confirm'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default PlayerInvitedOpinionButtons
