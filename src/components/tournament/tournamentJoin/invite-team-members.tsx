import { useEffect, useState } from 'react'
import { InvitedMember, Participant } from '@/types/participantType'
import { Team } from '@/types/teamType'
import { getUserById } from '@/services/userService'
import { User } from '@/types/userType'
import { PlayerType, invitePlayerToTournament } from '@/services/joinTournamentService'
import { Check, ChevronDown, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

type InviteTeamMembersProps = {
  participant: Participant
  team: Team
  mainSlots: number
  substituteSlots: number
  onJoinClick: () => void
}

const InviteTeamMembers = ({
  participant,
  team,
  mainSlots,
  substituteSlots,
  onJoinClick,
}: InviteTeamMembersProps) => {
  const [invitedMembers, setInvitedMembers] = useState<InvitedMember[]>(
    participant.invitedMembers || [],
  )
  const [teamMembers, setTeamMembers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [invitingMemberId, setInvitingMemberId] = useState<string | null>(null)
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Get team owner as well
        const ownerIds = team.teamowner?.map(({ user }) => user) || []
        const rosterIds = team.teamroster?.map(({ user }) => user) || []
        const allMemberIds = [...new Set([...ownerIds, ...rosterIds])]

        const members = await Promise.all(allMemberIds.map(id => getUserById(id)))
        setTeamMembers(members)
      } catch (err) {
        console.error('Error fetching team members:', err)
        setError('Failed to load team members. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTeamMembers()
  }, [team])

  const handleInvitePlayer = async (playerId: string, playerType: PlayerType) => {
    try {
      setInvitingMemberId(playerId)
      setOpenDropdownId(null) // Close dropdown
      const response = await invitePlayerToTournament(playerId, participant._id, playerType, false)

      if (response.success) {
        toast.success(`Player invited as ${playerType.toLowerCase()} successfully`)
        // Update the invited members list
        const invitedUser = teamMembers.find(m => m._id === playerId)
        if (invitedUser) {
          setInvitedMembers(prev => [
            ...prev,
            { user: invitedUser._id, playerType, status: 'PENDING', isFreeAgent: false },
          ])
        }
      }
    } catch (err: any) {
      console.error('Error inviting player:', err)
      toast.error(err?.message || 'Failed to invite player. Please try again.')
    } finally {
      setInvitingMemberId(null)
    }
  }

  return (
    <div className="flex-1 h-full flex flex-col items-center justify-center w-full py-4">
      <h5 className="text-3xl leading-12 font-bold">Select Team Players</h5>
      <p className=" text-defendrGhostGrey text-center mb-6">
        You must choose {mainSlots} main players, and up to <br />
        {substituteSlots} substitutes if you want.
      </p>
      <p className="text-sm text-defendrGhostGrey space-y-1 text-center">
        Team: <span className="text-white font-semibold">{team.name}</span>
      </p>
      {/* <p>{participant._id}</p> */}

      {isLoading && <p className="text-defendrGhostGrey mt-6">Loading team members...</p>}
      {error && <p className="text-defendrRed mt-6">{error}</p>}

      {!isLoading && !error && (
        <div className="mt-8 w-full flex-1 p-4">
          <div className="space-y-8">
            {teamMembers.map(member => (
              <div key={member._id} className="text-white flex items-center justify-between">
                <div className="flex items-center justify-center gap-2">
                  <Image
                    src={member.profileImage || '/assets/default-user-icon.jpg'}
                    alt={member.fullname || member.nickname || 'profile image'}
                    width={40}
                    height={40}
                    className="size-12 aspect-square rounded-full border-2 border-defendrRed"
                  />
                  <div>
                    <p className="text-white font-medium">{member.fullname || 'Unknown'}</p>
                    <p className="text-xs text-gray-400">@{member.nickname || 'Unknown'}</p>
                  </div>
                </div>
                {invitedMembers.find(im => im.user === member._id) ? (
                  <div className="text-sm px-4 py-1 rounded-xl border-2 border-defendrRed flex items-center justify-center gap-2 text-defendrRed">
                    Invited as a{' '}
                    {invitedMembers.find(im => im.user === member._id)?.playerType.toLowerCase()}{' '}
                    player <Check size={14} />
                  </div>
                ) : (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenDropdownId(openDropdownId === member._id ? null : member._id)
                      }
                      disabled={invitingMemberId === member._id}
                      className="bg-defendrRed text-white rounded-xl px-4 py-1 flex items-center justify-center gap-2 cursor-pointer hover:brightness-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {invitingMemberId === member._id ? (
                        <>
                          Inviting...
                          <Loader2 size={14} className="animate-spin" />
                        </>
                      ) : (
                        <>
                          Invite
                          <ChevronDown
                            size={14}
                            className={`transition-transform ${openDropdownId === member._id ? 'rotate-180' : ''}`}
                          />
                        </>
                      )}
                    </button>
                    {openDropdownId === member._id && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 p-2 flex flex-col items-center justify-center gap-2 bg-defendrBlack/90 backdrop-blur-sm rounded-xl z-10 min-w-[120px]">
                        <button
                          type="button"
                          onClick={() => handleInvitePlayer(member._id, 'SUBSTITUTE')}
                          disabled={invitingMemberId === member._id}
                          className="w-full text-center p-2 rounded-lg hover:bg-gray-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Substitute
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInvitePlayer(member._id, 'MAIN')}
                          disabled={invitingMemberId === member._id}
                          className="w-full text-center p-2 rounded-lg hover:bg-gray-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Main
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="flex items-center justify-center gap-4 text-xs text-defendrRed mt-24">
        <p>
          <span className="text-white">
            {invitedMembers.filter(m => m.playerType === 'MAIN').length}
          </span>
          /{mainSlots} Main Players
        </p>
        <p>
          <span className="text-white">
            {invitedMembers.filter(m => m.playerType === 'SUBSTITUTE').length}
          </span>
          /{substituteSlots} Substitute Players
        </p>
      </div>
      {(() => {
        const totalTeamMembers = (team.teamroster?.length ?? 0) + (team.teamowner?.length ?? 0)
        const totalRequiredPlayers = mainSlots + substituteSlots
        const hasEnoughPlayers = totalTeamMembers >= totalRequiredPlayers
        const invitedNonRejectedCount = invitedMembers.filter(m => m.status !== 'REJECTED').length

        return hasEnoughPlayers ? (
          <button
            type="button"
            onClick={
              invitedNonRejectedCount >= mainSlots + substituteSlots ? onJoinClick : undefined
            }
            disabled={invitedNonRejectedCount < mainSlots + substituteSlots}
            className="mt-4 px-6 py-2 rounded-xl bg-defendrRed w-120 max-w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale-50"
          >
            Join Tournament
          </button>
        ) : (
          <div className="text-center mt-4 px-4">
            <p className="text-defendrRed font-semibold mb-2">⚠️ Not Enough Team Members</p>
            <p className="text-sm text-defendrGhostGrey mb-1">
              You need at least {totalRequiredPlayers} players ({mainSlots} main, {substituteSlots}{' '}
              subs)
            </p>
            <p className="text-sm text-defendrGhostGrey">
              Current: <span className="text-white">{totalTeamMembers}</span> players you need{' '}
              {totalRequiredPlayers - totalTeamMembers} more
            </p>
          </div>
        )
      })()}
      {/* <button type="button" onClick={onJoinClick} className='mt-5 p-2 rounded-xl bg-white text-black'>Test: show the team status</button> */}
    </div>
  )
}

export default InviteTeamMembers
