'use client'

import Image from 'next/image'
import Link from 'next/link'
import Typo from '@/components/ui/Typo'

interface EventPageCardProps {
  eventName: string
  imageUrl: string
  redirectUrl: string
  prizePool?: string
  tournamentStatus?: string
  eventDates?: string
  isEnded?: boolean
  description?: string
}

const EventPageCard: React.FC<EventPageCardProps> = ({
  eventName,
  imageUrl,
  redirectUrl,
  prizePool = '23K TND Prizes',
  tournamentStatus = 'Registration Phase',
  eventDates,
  isEnded = false,
  description,
}) => {
  const statusClass = isEnded
    ? 'bg-gradient-to-r from-gray-600 to-gray-700'
    : 'bg-gradient-to-r from-green-500 to-emerald-600'

  const statusLabel = isEnded ? 'Event Ended' : tournamentStatus

  const ctaClass = isEnded
    ? 'bg-gray-600 hover:bg-gray-700 cursor-not-allowed'
    : 'bg-defendrRed hover:bg-defendrHoverRed'

  const ctaLabel = isEnded ? 'View Event Details' : 'Check the Event'

  return (
    <div className="w-full mb-6">
      <Link href={redirectUrl} className="block">
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-gray-600 max-w-6xl mx-auto">
          {/* Mobile Layout */}
          <div className="flex flex-col sm:hidden">
            <div className="relative h-48 w-full">
              <Image src={imageUrl} alt={eventName} fill className="object-cover" priority />
            </div>
            <div className="p-4 bg-gray-800/50">
              <Typo
                as="h3"
                className="text-white text-xl font-bold mb-3 text-center"
                fontFamily="poppins"
                fontVariant="h3"
              >
                {eventName}
              </Typo>

              {description && (
                <Typo
                  as="p"
                  className="text-gray-400 text-sm text-center mb-3 leading-relaxed"
                  fontFamily="poppins"
                  fontVariant="p5"
                >
                  {description}
                </Typo>
              )}

              {/* Status */}
              <div className="mb-4 flex justify-center">
                <div
                  className={`${statusClass} text-white px-4 py-2 rounded-full font-semibold text-sm shadow-md`}
                >
                  {statusLabel}
                </div>
              </div>

              {/* Event Dates */}
              {eventDates && (
                <div className="mb-4 flex justify-center">
                  <Typo
                    as="p"
                    className="text-gray-300 text-sm text-center"
                    fontFamily="poppins"
                    fontVariant="p4"
                  >
                    {eventDates}
                  </Typo>
                </div>
              )}

              <div className="flex flex-col items-center gap-4">
                {/* Prize Pool */}
                <div className="relative">
                  <div className="bg-gradient-to-r from-gray-600 to-gray-500 text-gray-200 px-4 py-2 rounded-lg font-semibold text-lg shadow-md text-center">
                    {prizePool}
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 text-xs font-bold">💰</span>
                  </div>
                </div>

                {/* CTA */}
                <div
                  className={`${ctaClass} text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-200 text-center w-full transform ${!isEnded ? 'hover:scale-105' : ''}`}
                >
                  {ctaLabel}
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:flex h-80">
            <div className="relative w-2/3">
              <Image src={imageUrl} alt={eventName} fill className="object-cover" priority />
            </div>
            <div className="w-1/3 p-6 bg-gray-800/50 flex flex-col justify-center items-center">
              <Typo
                as="h3"
                className="text-white text-2xl font-bold mb-3 text-center leading-tight"
                fontFamily="poppins"
                fontVariant="h3"
              >
                {eventName}
              </Typo>

              {description && (
                <Typo
                  as="p"
                  className="text-gray-400 text-sm text-center mb-3 leading-relaxed"
                  fontFamily="poppins"
                  fontVariant="p5"
                >
                  {description}
                </Typo>
              )}

              {/* Status */}
              <div className="mb-4">
                <div
                  className={`${statusClass} text-white px-4 py-2 rounded-full font-semibold text-sm shadow-md`}
                >
                  {statusLabel}
                </div>
              </div>

              {/* Event Dates */}
              {eventDates && (
                <div className="mb-4">
                  <Typo
                    as="p"
                    className="text-gray-300 text-sm text-center"
                    fontFamily="poppins"
                    fontVariant="p4"
                  >
                    {eventDates}
                  </Typo>
                </div>
              )}

              <div className="flex flex-col items-center gap-4 w-full">
                {/* Prize Pool */}
                <div className="relative w-full">
                  <div className="bg-gradient-to-r from-gray-600 to-gray-500 text-gray-200 px-4 py-2 rounded-lg font-semibold text-base shadow-md w-full text-center">
                    {prizePool}
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 text-xs font-bold">💰</span>
                  </div>
                </div>

                {/* CTA */}
                <div
                  className={`${ctaClass} text-white px-6 py-3 rounded-xl font-bold text-lg shadow-lg transition-all duration-200 text-center w-full transform ${!isEnded ? 'hover:scale-105' : ''}`}
                >
                  {ctaLabel}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default EventPageCard
