import Image from 'next/image'
import { Users, Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation'

import Typo from '@/components/ui/Typo'
import { tournamentImageSanitizer, DEFAULT_IMAGES } from '@/utils/imageUrlSanitizer'

export default function TournamentCard({ tournament }: { tournament: any }) {
  const router = useRouter()

  const participantCount = tournament.participants?.length ?? 0
  const maxParticipants = tournament.maxParticipants ?? '?'
  const isFull = typeof maxParticipants === 'number' && participantCount >= maxParticipants

  const formattedDate = tournament.startDate
    ? new Date(tournament.startDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  // Resolve the image URL through the sanitizer so it gets the correct base URL
  const coverSrc = tournamentImageSanitizer(tournament.coverImage, DEFAULT_IMAGES.TOURNAMENT)

  return (
    <div
      className="flex items-start gap-3 bg-[#2c3036] hover:bg-[#32373e] transition-colors duration-200 p-3 sm:p-4 rounded-xl border border-white/5 hover:border-white/10 cursor-pointer group overflow-hidden"
      onClick={() => router.push(`/tournament/${tournament._id}`)}
    >
      {/* Cover image */}
      <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-[#1a1d21]">
        <Image
          unoptimized
          alt="tournament cover"
          src={coverSrc}
          width={64}
          height={64}
          className="w-full h-full object-cover"
          onError={e => {
            ;(e.target as HTMLImageElement).src = DEFAULT_IMAGES.TOURNAMENT
          }}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <Typo
          as="p"
          className="font-semibold text-white truncate text-sm"
          fontFamily="poppins"
          fontVariant="p4"
        >
          {tournament.name}
        </Typo>

        {tournament.description && (
          <Typo
            as="p"
            color="ghostGrey"
            fontFamily="poppins"
            fontVariant="p5"
            className="line-clamp-1 text-xs"
          >
            {tournament.description}
          </Typo>
        )}

        <div className="flex items-center flex-wrap gap-2 mt-0.5">
          {formattedDate && (
            <span className="flex items-center gap-1 text-[11px] text-gray-400">
              <Calendar className="w-3 h-3" />
              {formattedDate}
            </span>
          )}
          <span
            className={`flex items-center gap-1 text-[11px] font-medium ${isFull ? 'text-red-400' : 'text-green-400'}`}
          >
            <Users className="w-3 h-3" />
            {participantCount}/{maxParticipants}
          </span>
        </div>
      </div>
    </div>
  )
}
