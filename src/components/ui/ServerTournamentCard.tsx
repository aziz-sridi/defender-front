'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Users, Calendar, ChevronRight, Settings, Eye } from 'lucide-react'

import Typo from '@/components/ui/Typo'
import { tournamentImageSanitizer, DEFAULT_IMAGES } from '@/utils/imageUrlSanitizer'

type Props = {
  tournament: {
    _id: string
    name: string
    description?: string
    startDate?: string
    participants?: unknown[]
    maxParticipants?: number
    coverImage?: string
  }
  view?: 'organized' | 'joined'
}

const formatDate = (iso?: string): string => {
  if (!iso) return 'Date TBD'
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return 'Date TBD'
  }
}

const getStatusInfo = (startDate?: string): { label: string; color: string; bg: string } => {
  if (!startDate) return { label: 'Scheduled', color: 'text-yellow-400', bg: 'bg-yellow-400/10' }
  const now = new Date()
  const start = new Date(startDate)
  const diffDays = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays > 0) {
    if (diffDays <= 3)
      return { label: `In ${diffDays}d`, color: 'text-orange-400', bg: 'bg-orange-400/10' }
    return { label: 'Upcoming', color: 'text-green-400', bg: 'bg-green-400/10' }
  }
  return { label: 'Ongoing', color: 'text-blue-400', bg: 'bg-blue-400/10' }
}

const ServerTournamentCard = ({ tournament, view = 'joined' }: Props) => {
  const participantsCount = Array.isArray(tournament.participants)
    ? tournament.participants.length
    : 0
  const max = tournament.maxParticipants ?? 0
  const fillPct = max > 0 ? Math.min(100, (participantsCount / max) * 100) : 0
  const isFull = max > 0 && participantsCount >= max

  const cover = tournamentImageSanitizer(tournament.coverImage, DEFAULT_IMAGES.TOURNAMENT)
  const status = getStatusInfo(tournament.startDate)

  const href =
    view === 'organized'
      ? `/tournament/setup/info?tid=${tournament._id}`
      : `/tournament/${tournament._id}?tab=overview`

  return (
    <Link href={href} className="group block">
      <div className="relative flex flex-col overflow-hidden rounded-2xl bg-[#212529] border border-white/5 hover:border-white/15 transition-all duration-300 hover:shadow-xl hover:shadow-black/40 hover:-translate-y-0.5">
        {/* Cover image */}
        <div className="relative h-40 w-full overflow-hidden bg-[#1a1d21]">
          <Image
            unoptimized
            alt="tournament cover"
            src={cover}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={e => {
              ;(e.target as HTMLImageElement).src = DEFAULT_IMAGES.TOURNAMENT
            }}
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#212529] via-[#212529]/30 to-transparent" />

          {/* Status badge */}
          <div
            className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.color} backdrop-blur-sm border border-current/20`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {status.label}
          </div>

          {/* View badge */}
          <div className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium bg-black/40 text-white/70 backdrop-blur-sm">
            {view === 'organized' ? 'Organized' : 'Joined'}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-3 p-4">
          {/* Title */}
          <div>
            <h3 className="font-bold text-white text-sm leading-snug line-clamp-1 group-hover:text-defendrRed transition-colors duration-200">
              {tournament.name}
            </h3>
            {tournament.description && (
              <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                {tournament.description}
              </p>
            )}
          </div>

          {/* Date */}
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Calendar className="w-3.5 h-3.5 shrink-0 text-gray-500" />
            <span>{formatDate(tournament.startDate)}</span>
          </div>

          {/* Participants bar */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-gray-400">
                <Users className="w-3.5 h-3.5" />
                <span>
                  <span className={isFull ? 'text-red-400 font-medium' : 'text-white font-medium'}>
                    {participantsCount}
                  </span>
                  {max > 0 && <span className="text-gray-500">/{max}</span>}
                </span>
              </div>
              {max > 0 && (
                <span className={`font-medium ${isFull ? 'text-red-400' : 'text-gray-400'}`}>
                  {isFull ? 'Full' : `${Math.round(fillPct)}%`}
                </span>
              )}
            </div>
            {max > 0 && (
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${isFull ? 'bg-red-500' : 'bg-[#D62555]'}`}
                  style={{ width: `${fillPct}%` }}
                />
              </div>
            )}
          </div>

          {/* CTA */}
          <div
            className={`flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 mt-1
              ${
                view === 'organized'
                  ? 'bg-white/10 text-white group-hover:bg-[#D62555] group-hover:text-white'
                  : 'bg-[#D62555]/10 text-[#D62555] group-hover:bg-[#D62555] group-hover:text-white'
              }`}
          >
            {view === 'organized' ? (
              <>
                <Settings className="w-4 h-4" />
                Manage
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                View Details
              </>
            )}
            <ChevronRight className="w-4 h-4 ml-auto opacity-60 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ServerTournamentCard
