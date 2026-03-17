'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

import { Game } from '@/types/gameType'
import Typo from '@/components/ui/Typo'
import Button from '@/components/ui/Button'
import {
  addApexLegendsUsername,
  addMobileLegendsUsername,
  addEFootball24Username,
  addRocketLeagueUsername,
} from '@/services/gameService'

interface GamePopupProps {
  game: Game
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

const ChosenGamePopup = ({ game, isOpen, onClose, onSuccess }: GamePopupProps) => {
  const [username, setUsername] = useState('')
  const [platform, setPlatform] = useState('')
  const [region, setRegion] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username.trim()) {
      toast.warning('Please enter a username')
      return
    }

    setIsLoading(true)

    try {
      switch (game.name) {
        case 'Apex Legends':
          if (!platform) {
            toast.warning('Please select a platform')
            return
          }
          const responseApexLegends = await addApexLegendsUsername({ username, platform })
          console.log('response addApexLegendsUsername', responseApexLegends)
          break
        case 'Mobile Legends: Bang Bang':
          if (!region) {
            toast.warning('Please select a region')
            return
          }
          const responseMobileLegends = await addMobileLegendsUsername({ username, region })
          console.log('response addMobileLegendsUsername', responseMobileLegends)
          break
        case 'EA Sports FC 24':
          const responseEFootball24 = await addEFootball24Username({ username })
          console.log('response addEFootball24Username', responseEFootball24)
          break
        case 'Rocket League':
          if (!platform) {
            toast.warning('Please select a platform')
            return
          }
          const responseRocketLeague = await addRocketLeagueUsername({ platform, username })
          console.log('response addRocketLeagueUsername', responseRocketLeague)
          break
        default:
          toast.error('Game not supported')
          return
      }

      toast.success('game linked successfully!')
      onSuccess?.()
      onClose()
    } catch (error: unknown) {
      const e = error as { response?: { data?: { message?: string } } }
      const errorMessage = e.response?.data?.message || 'Failed to link account'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const getPlatformOptions = () => {
    switch (game.name) {
      case 'Apex Legends':
        return [
          { value: 'PSN', label: 'PSN' },
          { value: 'XBOX', label: 'XBOX' },
          { value: 'Origin', label: 'Origin' },
        ]
      case 'Rocket League':
        return [
          { value: 'PSN', label: 'PSN' },
          { value: 'XBOX', label: 'XBOX' },
          { value: 'STEAM', label: 'STEAM' },
          { value: 'EPIC_GAMES', label: 'EPIC_GAMES' },
        ]
      default:
        return []
    }
  }

  const getRegionOptions = () => {
    return [
      { value: 'Select region', label: 'Select region' },
      { value: 'SEA', label: 'Southeast Asia' },
      { value: 'Asia', label: 'Asia' },
      { value: 'NA', label: 'North America' },
      { value: 'EU', label: 'Europe' },
    ]
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#212529] rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <Typo as="h2" className="text-md md:text-lg text-white font-bold" fontVariant="h4">
            {game.name}
          </Typo>
          <button className="text-white hover:text-gray-300 transition-colors" onClick={onClose}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M6 18L18 6M6 6l12 12"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Typo as="p" className="text-sm font-medium mb-2" color="white">
              Username
            </Typo>
            <input
              required
              className="w-full bg-[#1F1F1F] border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none"
              placeholder="Enter your username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>

          {(game.name === 'Apex Legends' || game.name === 'Rocket League') && (
            <div>
              <Typo as="p" className="text-sm font-medium mb-2" color="white">
                Platform
              </Typo>
              <div className="relative">
                <select
                  required
                  className="w-full bg-[#1F1F1F] rounded-lg px-4 py-3 text-white appearance-none focus:outline-none"
                  value={platform}
                  onChange={e => setPlatform(e.target.value)}
                >
                  {getPlatformOptions().map(option => (
                    <option key={option.value} className="text-white" value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M19 9l-7 7-7-7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}
          {game.name === 'Mobile Legends: Bang Bang' && (
            <div>
              <Typo as="p" className="text-sm font-medium mb-2" color="white">
                Region
              </Typo>
              <div className="relative">
                <select
                  required
                  className="w-full bg-[#1F1F1F] rounded-lg px-4 py-3 text-white appearance-none focus:outline-none "
                  value={region}
                  onChange={e => setRegion(e.target.value)}
                >
                  {getRegionOptions().map(option => (
                    <option key={option.value} className="text-white" value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M19 9l-7 7-7-7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}
          {game.name === 'Mobile Legends' && (
            <div>
              <Typo as="p" className="text-sm font-medium mb-2" color="white">
                Region
              </Typo>
              <div className="relative">
                <select
                  required
                  className="w-full bg-[#1F1F1F] rounded-lg px-4 py-3 text-white appearance-none focus:outline-none "
                  value={region}
                  onChange={e => setRegion(e.target.value)}
                >
                  <option className="text-gray-400" value="">
                    Select region
                  </option>
                  {getRegionOptions().map(option => (
                    <option key={option.value} className="text-white" value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M19 9l-7 7-7-7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}

          <Button
            className="w-full text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
            label={isLoading ? 'Submitting...' : 'Submit'}
            type="submit"
            variant="contained-red"
          />
        </form>
      </div>
    </div>
  )
}

export default ChosenGamePopup
