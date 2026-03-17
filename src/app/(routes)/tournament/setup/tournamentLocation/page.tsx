'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import Button from '@/components/ui/Button'
import Typo from '@/components/ui/Typo'

type LocationData =
  | { type: 'online'; link: string }
  | { type: 'physical'; place: string }
  | { type: 'hybrid'; place: string; link: string }

export default function TournamentLocationPage() {
  const router = useRouter()
  const [selectedLocation, setSelectedLocation] = useState('')
  const [place, setPlace] = useState('')
  const [link, setLink] = useState('')

  const locationOptions = [
    { value: 'online', label: 'Online Tournament' },
    { value: 'physical', label: 'Physical Location' },
    { value: 'hybrid', label: 'Hybrid (Online + Physical)' },
  ]

  // Save location info to localStorage
  const handleNext = () => {
    const tournamentInfo = localStorage.getItem('tournamentInfo')
    let tournament = {}
    if (tournamentInfo) {
      try {
        tournament = JSON.parse(tournamentInfo)
      } catch {}
    }
    let locationData: LocationData | object = {}
    if (selectedLocation === 'online') {
      locationData = { type: 'online', link }
    } else if (selectedLocation === 'physical') {
      locationData = { type: 'physical', place }
    } else if (selectedLocation === 'hybrid') {
      locationData = { type: 'hybrid', place, link }
    }
    tournament = { ...tournament, location: locationData }
    localStorage.setItem('tournamentInfo', JSON.stringify(tournament))
    router.push('/tournament/setup/tournamentProgress')
  }

  return (
    <div className="text-white p-6">
      <div className="mb-8">
        <Typo as="h1" className="mb-2" color="white" fontFamily="poppins" fontVariant="h3">
          Tournament Location
        </Typo>
        <Typo as="p" className="mb-8" color="grey" fontVariant="p3">
          Set the location for your tournament
        </Typo>
        <div className="space-y-6">
          <div className="space-y-4">
            {locationOptions.map(option => (
              <div
                key={option.value}
                className={`flex items-center p-4 cursor-pointer transition-all duration-200 ${
                  selectedLocation === option.value
                    ? 'text-defendrRed'
                    : 'text-white hover:text-defendrRed'
                }`}
                onClick={() => setSelectedLocation(option.value)}
              >
                <div className="w-6 h-6 rounded-full border-2 border-defendrRed flex items-center justify-center mr-4">
                  {selectedLocation === option.value && (
                    <div className="w-3 h-3 bg-defendrRed rounded-full" />
                  )}
                </div>
                <Typo
                  as="span"
                  color={selectedLocation === option.value ? 'red' : 'white'}
                  fontVariant="p2"
                >
                  {option.label}
                </Typo>
              </div>
            ))}
          </div>
          {selectedLocation === 'online' && (
            <div>
              <Typo as="p" className="mb-3" color="white" fontVariant="p2">
                Link for an invite code
              </Typo>
              <div className="max-w-md">
                <input
                  className="w-full px-4 py-3 bg-defendrLightBlack border border-defendrGrey rounded-lg text-white placeholder-defendrGrey focus:border-defendrRed focus:outline-none"
                  placeholder="Ex: Discord.gg/FSPFrg213"
                  type="text"
                  value={link}
                  onChange={e => setLink(e.target.value)}
                />
              </div>
            </div>
          )}
          {selectedLocation === 'physical' && (
            <div>
              <Typo as="p" className="mb-3" color="white" fontVariant="p2">
                Venue Address
              </Typo>
              <div className="max-w-md">
                <input
                  className="w-full px-4 py-3 bg-defendrLightBlack border border-defendrGrey rounded-lg text-white placeholder-defendrGrey focus:border-defendrRed focus:outline-none"
                  placeholder="Enter venue address"
                  type="text"
                  value={place}
                  onChange={e => setPlace(e.target.value)}
                />
              </div>
            </div>
          )}
          {selectedLocation === 'hybrid' && (
            <>
              <div>
                <Typo as="p" className="mb-3" color="white" fontVariant="p2">
                  Venue/Place
                </Typo>
                <div className="max-w-md">
                  <input
                    className="w-full px-4 py-3 bg-defendrLightBlack border border-defendrGrey rounded-lg text-white placeholder-defendrGrey focus:border-defendrRed focus:outline-none"
                    placeholder="Enter venue address"
                    type="text"
                    value={place}
                    onChange={e => setPlace(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Typo as="p" className="mb-3" color="white" fontVariant="p2">
                  Online Link
                </Typo>
                <div className="max-w-md">
                  <input
                    className="w-full px-4 py-3 bg-defendrLightBlack border border-defendrGrey rounded-lg text-white placeholder-defendrGrey focus:border-defendrRed focus:outline-none"
                    placeholder="Ex: Discord.gg/FSPFrg213"
                    type="text"
                    value={link}
                    onChange={e => setLink(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}
          {selectedLocation && (
            <div className="flex justify-end">
              <Button
                label="Next"
                size="xxs"
                textClassName="font-poppins"
                variant="contained-red"
                onClick={handleNext}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
