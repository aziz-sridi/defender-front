'use client'

import Typo from '@/components/ui/Typo'
import EventPageCard from '@/components/ui/EventPageCard'
import Button from '@/components/ui/Button'

export default function EventsPage() {
  // Events data - can be moved to a service/API later
  const events = [
    {
      id: 'tsf-2025',
      eventName: 'Tunisia Sport Festival 2025',
      imageUrl:
        'https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/defendr_elements/TSF%20Event/1.png',
      redirectUrl: '/tsf',
      prizePool: '23K TND Prizes',
      eventDates: 'November 06 - November 09, 2025',
      isEnded: true,
      tournamentStatus: 'Event Ended',
      description:
        'Join the biggest esports festival in Tunisia with multiple tournaments and exciting prizes',
    },
    {
      id: 'dz-ramadhan-2026',
      eventName: 'DZ Ramadan Champions Tour 2026',
      imageUrl:
        'https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/defendr_elements/partners/DZ%20ORg/dz_ramadhan_event_2026/DZESPORTS%20MAIN.png',
      redirectUrl: '/event/dz-ramadhan',
      prizePool: '365K DZD Prizes',
      eventDates: 'February 23 - March 16, 2026',
      isEnded: false,
      tournamentStatus: 'Registration Open',
      description:
        "Algeria's biggest Ramadan esports series — 5 tournaments across CS2, LoL, R6, Rocket League & Valorant",
    },
  ]

  return (
    <div className="min-h-screen bg-[#161616] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10 md:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <Typo
            as="h1"
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4"
            color="white"
            fontFamily="poppins"
            fontVariant="h1"
          >
            Events
          </Typo>
          <Typo
            as="p"
            className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto"
            fontFamily="poppins"
            fontVariant="p2"
          >
            Discover and participate in exciting esports events and tournaments
          </Typo>
        </div>

        {/* Events List */}
        <div className="max-w-7xl mx-auto">
          {events.length > 0 ? (
            <div className="space-y-6 sm:space-y-8">
              {events.map(event => (
                <EventPageCard
                  key={event.id}
                  eventName={event.eventName}
                  imageUrl={event.imageUrl}
                  redirectUrl={event.redirectUrl}
                  prizePool={event.prizePool}
                  tournamentStatus={event.tournamentStatus}
                  eventDates={event.eventDates}
                  isEnded={event.isEnded}
                  description={event.description}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 sm:py-20">
              <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-gray-400 text-4xl">📅</span>
              </div>
              <Typo as="h3" color="white" fontFamily="poppins" fontVariant="h4" className="mb-2">
                No Events Available
              </Typo>
              <Typo as="p" color="ghostGrey" fontFamily="poppins" fontVariant="p4">
                Check back later for upcoming events
              </Typo>
            </div>
          )}

          {/* Creation Events Button */}
          <div className="mt-12 flex justify-center">
            <div className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 rounded-xl p-6 sm:p-8 border border-gray-600 max-w-2xl w-full text-center">
              <Typo
                as="h3"
                className="text-xl sm:text-2xl font-bold mb-4"
                color="white"
                fontFamily="poppins"
                fontVariant="h3"
              >
                Create Your Event
              </Typo>
              <Typo
                as="p"
                className="text-gray-300 mb-6 text-base sm:text-lg"
                fontFamily="poppins"
                fontVariant="p3"
              >
                Creation events will be soon available
              </Typo>
              <Button
                label="Coming Soon"
                size="l"
                variant="contained-red"
                className="px-8 py-4 text-lg font-bold"
                disabled={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
