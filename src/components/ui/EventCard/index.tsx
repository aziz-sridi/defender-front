'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Trophy } from 'lucide-react'
import Typo from '@/components/ui/Typo'
import Button from '@/components/ui/Button'

interface EventCardProps {
  eventName: string
  imageUrl: string
  redirectUrl: string
  prizePool?: string
  tournamentStatus?: string
  /** Optional badge (e.g. flag) shown overlaid on the card */
  badge?: React.ReactNode
}

const EventCard: React.FC<EventCardProps> = ({
  eventName,
  imageUrl,
  redirectUrl,
  prizePool,
  tournamentStatus,
  badge,
}) => {
  return (
    <Link href={redirectUrl} className="block group">
      <div className="relative w-full rounded-2xl overflow-hidden border border-white/[0.07] shadow-2xl shadow-black/40 transition-all duration-500 group-hover:border-white/15 group-hover:shadow-black/60">
        {/* Background image — fills entire card */}
        <div className="relative w-full min-h-[220px] sm:min-h-[260px] md:min-h-[280px] flex">
          <Image
            src={imageUrl}
            alt={eventName}
            fill
            className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
            priority
          />

          {/* Gradient veil — stronger at bottom for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 pointer-events-none" />

          {/* Left-side dark veil for text on desktop */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent pointer-events-none sm:hidden md:block" />
        </div>

        {/* Overlaid content */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            {/* Left: text info */}
            <div className="flex flex-col gap-3.5 sm:gap-5">
              {/* Status + badge row */}
              <div className="flex items-center gap-2.5 flex-wrap">
                {badge && <div className="rounded-[4px] overflow-hidden shadow-sm">{badge}</div>}
                {tournamentStatus && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-defendrRed/20 text-rose-300 border border-defendrRed/30 backdrop-blur-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                    {tournamentStatus}
                  </span>
                )}
              </div>

              {/* Event name */}
              <Typo
                as="h2"
                className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight drop-shadow-lg"
                fontFamily="poppins"
                fontVariant="h2"
              >
                {eventName}
              </Typo>

              {/* Prize pool */}
              {prizePool && (
                <div className="flex items-center gap-2">
                  <Trophy size={14} className="text-yellow-400/80 flex-shrink-0" />
                  <Typo
                    as="span"
                    className="text-sm font-semibold text-yellow-300/90"
                    fontFamily="poppins"
                    fontVariant="p4"
                  >
                    {prizePool}
                  </Typo>
                </div>
              )}
            </div>

            {/* Right: CTA button */}
            <div className="flex-shrink-0">
              <Button
                label="View Event"
                variant="contained-red"
                size="s"
                icon={
                  <ArrowRight
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                }
                className="shadow-lg shadow-red-900/40 whitespace-nowrap"
                fontFamily="poppins"
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default EventCard
