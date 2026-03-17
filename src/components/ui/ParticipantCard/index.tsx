import Image from 'next/image'

import Typo from '@/components/ui/Typo'
import { Participant } from '@/types/participantType'
import { imageUrlSanitizer } from '@/utils/imageUrlSanitizer'

const ParticipantCard = ({ participant }: { participant: Participant }) => {
  // Determine if this is a team or solo participant
  const isTeamParticipant = participant.team && participant.team._id
  const isSoloParticipant = participant.user && participant.user._id

  // Get the appropriate image source
  const getImageSrc = () => {
    if (isTeamParticipant) {
      return imageUrlSanitizer(
        participant.team?.profileImage || participant.team?.coverImage || '',
        'team',
      )
    } else if (isSoloParticipant) {
      return imageUrlSanitizer(participant.user?.profileImage || '', 'user')
    }
    return imageUrlSanitizer('', 'user')
  }

  // Get the appropriate display name
  const getDisplayName = () => {
    if (isTeamParticipant) {
      return participant.team?.name || 'Unnamed Team'
    } else if (isSoloParticipant) {
      return participant.user?.nickname || participant.user?.fullname || 'Unnamed Player'
    }
    return 'Unnamed Participant'
  }

  // Get the appropriate alt text
  const getAltText = () => {
    if (isTeamParticipant) {
      return 'Team Logo'
    } else if (isSoloParticipant) {
      return 'Player Avatar'
    }
    return 'Participant'
  }

  return (
    <div className="flex flex-col justify-center items-center bg-zinc-800 rounded-lg py-4 px-4 h-52 w-44">
      <div className="relative h-24 w-24 rounded-full overflow-hidden flex-shrink-0">
        <Image fill alt={getAltText()} className="object-cover rounded-full" src={getImageSrc()} />
      </div>
      <Typo as="p" className="text-center mt-3 text-white" fontFamily="poppins" fontVariant="p4b">
        {getDisplayName()}
      </Typo>
    </div>
  )
}

export default ParticipantCard
