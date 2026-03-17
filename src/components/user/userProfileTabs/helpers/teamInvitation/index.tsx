'use client'

import { useState } from 'react'
import { Check, X, UserPlus } from 'lucide-react'
import { toast } from 'sonner'

import Typo from '@/components/ui/Typo'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { acceptTeamInvitation, declineTeamInvitation } from '@/services/teamService'

export default function Invitations({
  teamInvitations: initialInvitations,
  userId,
}: {
  teamInvitations: any[]
  userId: string
}) {
  const [teamInvitations, setTeamInvitations] = useState(initialInvitations)

  const removeInvitationFromUI = (teamId: string) => {
    setTeamInvitations(prev => prev.filter(team => team._id !== teamId))
  }

  const acceptTeamInvi = async (teamId: string) => {
    try {
      await acceptTeamInvitation(teamId)
      removeInvitationFromUI(teamId)
      toast.success('Invitation accepted')
    } catch (error) {
      toast.error('Error accepting invitation, please try again')
    }
  }

  const declineTeamInvi = async (teamId: string) => {
    try {
      await declineTeamInvitation(teamId)
      removeInvitationFromUI(teamId)
      toast.success('Invitation rejected')
    } catch (error) {
      toast.error('Error rejecting invitation, please try again')
    }
  }

  return (
    <div className="p-0">
      {teamInvitations.length > 0 ? (
        <div className="flex flex-col gap-4">
          <Typo as="p" className="md:text-3xl text-xl font-bold mb-6">
            team invitations
          </Typo>
          {teamInvitations.map(team => (
            <div
              key={team._id}
              className="flex items-start md:items-center justify-between p-4 w-full md:w-1/2 bg-[#181B20] rounded-md"
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage alt={team.name} src={'/teamCover.jpg'} />
                  <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                    {team.name ? team.name.charAt(0).toUpperCase() : 'T'}
                  </AvatarFallback>
                </Avatar>

                <Typo className="text-white" fontFamily="poppins" fontVariant="p3">
                  {team.name}
                </Typo>
              </div>

              <div className="flex gap-2">
                <button
                  className="p-2 rounded-md  hover:bg-green-700 transition"
                  onClick={() => acceptTeamInvi(team._id)}
                >
                  <Check className="w-6 h-6 text-green-400" />
                </button>
                <button
                  className="p-2 rounded-md  hover:bg-red-700 transition"
                  onClick={() => declineTeamInvi(team._id)}
                >
                  <X className="w-6 h-6 text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4  w-full text-white rounded-md">
          <Typo className="text-center md:self-start mb-2" fontFamily="poppins" fontVariant="h5">
            Your Invites
          </Typo>
          <div className="flex flex-col md:flex-row items-center  md:items-start gap-4">
            <div className="bg-gray-800 rounded-full p-5">
              <UserPlus className="w-7 h-7 text-gray-400" />
            </div>
            <Typo
              className="text-white leading-relaxed sm:mt-5 text-center md:text-start"
              fontFamily="poppins"
              fontVariant="p3"
            >
              You have not been invited to any teams yet. When a user invites you to their team it
              will show up here.
            </Typo>
          </div>
        </div>
      )}
    </div>
  )
}
