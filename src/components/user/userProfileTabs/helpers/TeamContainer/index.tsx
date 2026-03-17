import Link from 'next/link'
import Image from 'next/image'

import Typo from '@/components/ui/Typo'
import { teamImageSanitizer } from '@/utils/imageUrlSanitizer'

interface TeamContainerProps {
  team: {
    id: string
    name: string
    profileImage: string
    lastPlayed?: string
  }
}

export const TeamContainer = ({ team }: TeamContainerProps) => {
  return (
    <Link
      className="flex items-center justify-between bg-[#181B20] rounded-xl px-4 py-2 w-full max-w-[420px] transition hover:ring-2 hover:ring-red-700"
      href={`/team/${team.id}/profile`}
      prefetch={false}
      style={{ textDecoration: 'none' }}
    >
      <div className="flex items-center gap-3">
        <Image
          alt="Team Icon"
          className="object-contain"
          height={40}
          src={teamImageSanitizer(team.profileImage)}
          width={40}
        />
        <div className="flex flex-col">
          <Typo className="text-white leading-tight" fontVariant="p4">
            {team.name}
          </Typo>
          <span
            className="text-[#22222] text-sm font-poppins"
            style={{ color: '#22222', opacity: 0.5 }}
          >
            {team.lastPlayed
              ? new Date(team.lastPlayed).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
              : ''}
          </span>
        </div>
      </div>
    </Link>
  )
}
