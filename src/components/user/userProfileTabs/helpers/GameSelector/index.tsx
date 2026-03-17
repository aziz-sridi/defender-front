'use client'
import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

import { getAllGames } from '@/services/gameService'
import { getGameImageUrl } from '@/utils/imageUrlSanitizer'
import { VariantImage } from '@/components/ui/VariantImage'
import Typo from '@/components/ui/Typo'

interface GameSelectorProps {
  selectedGame: string
  onGameChange: (game: string) => void
}

const GameSelector: React.FC<GameSelectorProps> = ({ selectedGame, onGameChange }) => {
  const [isGameDropdownOpen, setIsGameDropdownOpen] = useState(false)
  const [games, setGames] = useState<any[]>([])

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const Games = await getAllGames()
        setGames(Games)

        // Pick a random game as default if none is selected
        if (!selectedGame && Games.length > 0) {
          const randomGame = Games[Math.floor(Math.random() * Games.length)]
          onGameChange(randomGame._id)
        }
      } catch (error) {
        console.error('Failed to fetch games:', error)
      }
    }
    fetchGames()
  }, [])

  const handleGameSelect = (gameId: string) => {
    onGameChange(gameId)
    setIsGameDropdownOpen(false)
  }

  const selectedGameData = games.length > 0 ? games.find(g => g._id === selectedGame) : []

  return (
    <div className="w-full max-w-100  z-50 mt-7">
      <div className="relative">
        <button
          className="w-full max-w-87.5 bg-[#212529]  text-white px-8 py-4 mb-7 rounded-[19px] flex items-center justify-between font-poppins text-sm transition-colors"
          onClick={() => setIsGameDropdownOpen(!isGameDropdownOpen)}
        >
          <div className="flex items-center">
            <VariantImage
              alt={selectedGameData?.name || 'Game'}
              className="w-10 h-10 object-contain mr-3"
              src={getGameImageUrl(selectedGameData) || '/game.jpg'}
            />
            <Typo fontFamily="poppins" fontVariant="p4">
              {selectedGameData?.name || 'Select Game'}
            </Typo>
          </div>
          <ChevronDown
            className={`transition-transform ${isGameDropdownOpen ? 'rotate-180' : ''} ml-2`}
            size={26}
          />
        </button>

        {/* Dropdown Menu */}
        {isGameDropdownOpen && (
          <div className="absolute top-full left-0 w-87.5 h-50 overflow-auto bg-gray-800 border border-[#212529] rounded-[19px] mt-1 shadow-lg z-50">
            {games.map(gameOption => (
              <button
                key={gameOption._id}
                className="w-full px-4 py-3 text-left hover:bg-[#212529] flex items-center font-poppins text-sm transition-colors text-white first:rounded-t-[19px] last:rounded-b-[19px]"
                onClick={() => handleGameSelect(gameOption._id)}
              >
                <VariantImage
                  alt={gameOption.name}
                  className="w-10 h-10 object-contain mr-3"
                  src={getGameImageUrl(gameOption)}
                />
                <Typo fontFamily="poppins" fontVariant="p4">
                  {gameOption.name}
                </Typo>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default GameSelector
