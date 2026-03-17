'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

import Typo from '@/components/ui/Typo'
import { Team } from '@/types/teamType'
import { joinTeam } from '@/services/teamService'
import { teamImageSanitizer, teamBannerSanitizer, DEFAULT_IMAGES } from '@/utils/imageUrlSanitizer'

interface TeamCardProps {
  team: Team
}

const TeamCard = ({ team }: TeamCardProps) => {
  const router = useRouter()
  const { data: session } = useSession()
  const [isRequestSent, setIsRequestSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const isCurrentUserOwner = team?.teamowner?.some(owner => owner.user === session?.user?._id)
  const isCurrentUserMember = team?.teamroster?.some(member => member.user === session?.user?._id)
  const hasPendingRequest = team?.requests?.some(request => request.user === session?.user?._id)

  const handleJoinTeam = async (e: React.MouseEvent) => {
    console.log('team details', team)
    e.stopPropagation()
    setLoading(true)
    try {
      if (!session?.user?._id) {
        toast.error('You must be logged in to join a team.')
        return
      }

      await joinTeam(team._id)
      setIsRequestSent(true)
      toast.success('Your request to join the team has been sent successfully!')
    } catch (error) {
      console.error('Failed to send join request:', error)
      toast.error('Failed to send join request. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleViewTeam = () => {
    router.push(`/team/${team._id}/profile`)
  }

  return (
    <div
      className="relative bg-[#1f2327] rounded-xl overflow-hidden text-white shadow-lg flex flex-col pb-4 cursor-pointer hover:scale-105 transition-transform duration-300"
      onClick={handleViewTeam}
    >
      {/* Background Image */}
      <div className="relative w-full h-24">
        <Image
          fill
          alt={`${team.name} cover`}
          src={teamBannerSanitizer(team.coverImage)}
          style={{ objectFit: 'cover' }}
        />
      </div>

      {/* Profile Image and DEFENDR Tag */}
      <div className="relative z-10 -mt-12 flex flex-col items-center">
        <div className="relative w-24 h-24 rounded-full border-4 border-[#1f2327] bg-[#23272b] flex items-center justify-center overflow-hidden shadow-lg">
          <Image
            fill
            alt={`${team.name} profile`}
            src={teamImageSanitizer(team.profileImage || '', DEFAULT_IMAGES.TEAM)}
            style={{ objectFit: 'contain' }}
          />
        </div>
      </div>

      {/* Team Info */}
      <div className="text-center px-4 mt-2">
        <Typo as="h3" className="text-xl font-bold mb-1" fontFamily="poppins">
          {team.name}
        </Typo>
        <Typo as="p" className="text-sm text-gray-400" fontFamily="poppins">
          {team?.teamroster?.length || 0} Player(s)
        </Typo>
      </div>

      {/* Buttons */}
      <div className="mt-4 px-4 flex justify-center gap-2 w-full">
        <button
          className="flex-1 bg-defendrRed text-white py-2 px-3 rounded-lg font-bold text-sm hover:bg-opacity-90 transition whitespace-nowrap"
          onClick={handleViewTeam}
        >
          View Team
        </button>
        <button
          className={`flex-1 py-2 px-3 rounded-lg font-bold text-sm whitespace-nowrap transition
          ${
            loading ||
            isRequestSent ||
            isCurrentUserMember ||
            hasPendingRequest ||
            isCurrentUserOwner
              ? 'bg-gray-600 border-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-transparent border border-defendrRed text-defendrRed hover:bg-defendrRed hover:text-white'
          }`}
          disabled={
            loading ||
            isRequestSent ||
            isCurrentUserMember ||
            hasPendingRequest ||
            isCurrentUserOwner
          }
          onClick={handleJoinTeam}
        >
          {loading
            ? 'Sending...'
            : isRequestSent || hasPendingRequest
              ? 'Request Sent'
              : 'Request to Join'}
        </button>
      </div>
    </div>
  )
}

export default TeamCard
