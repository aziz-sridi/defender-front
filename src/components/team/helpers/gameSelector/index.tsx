'use client'
//only show the game assigned to the team ,no need for dropdown for now cuz we're not updating the game
import type React from 'react'
import { useState, useEffect } from 'react'

import { type TransformedGame } from '@/utils/dataTransformers'
import { getAllGames } from '@/services/gameService'
import { getGameImageUrl } from '@/utils/imageUrlSanitizer'

interface GameSelectorProps {
  selectedGame: any
  onGameChange: (game: string) => void
}

const GameSelector: React.FC<GameSelectorProps> = ({ selectedGame, onGameChange }) => {
  const [isGameDropdownOpen, setIsGameDropdownOpen] = useState(false)
  const [games, setGames] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const gamesFetched = await getAllGames()
        setGames(gamesFetched)
      } catch (error) {
        console.error('Failed to fetch games:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGames()
  }, [])

  const handleGameSelect = (gameName: string) => {
    onGameChange(gameName)
    setIsGameDropdownOpen(false)
  }

  const selectedGameData = games.find(
    g => g.name === (typeof selectedGame === 'string' ? selectedGame : selectedGame?.name),
  )

  if (loading) {
    return (
      <div className="w-full rounded-lg mb-4">
        <div className="w-full max-w-[350px] bg-[#212529] text-white px-8 py-4 mb-7 rounded-[19px] flex items-center justify-center font-poppins text-sm">
          Loading games...
        </div>
      </div>
    )
  }

  return (
    <div className="w-full rounded-lg mb-4 hidden sm:block">
      <div className="relative">
        <button
          className="w-full max-w-[400px]  bg-[#212529] text-white px-8 py-4 mb-7 rounded-[19px] flex items-center justify-between font-poppins text-sm transition-colors"
          onClick={() => setIsGameDropdownOpen(!isGameDropdownOpen)}
        >
          <div className="flex items-center">
            <img
              alt={selectedGame}
              className="w-10 h-10 object-contain mr-3"
              src={getGameImageUrl(selectedGameData) || '/placeholder.JPG?height=28&width=28'}
              onError={e => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                const parent = target.parentElement
                if (parent) {
                  parent.innerHTML = '🎮'
                  parent.style.fontSize = '16px'
                }
              }}
            />
            <span className="text-sm md:text-md">
              {typeof selectedGame === 'string'
                ? selectedGame
                : selectedGame?.name || 'Select Game'}
            </span>
          </div>
          {/* <ChevronDown
            size={26}
            className={`transition-transform ${isGameDropdownOpen ? 'rotate-180' : ''} ml-2`}
          /> */}
        </button>

        {/* Dropdown Menu */}
        {/*  {isGameDropdownOpen && (
          <div className="absolute overflow-scroll h-[350px] top-full left-0 w-auto bg-gray-800 border border-[#212529] rounded-[19px] mt-1 shadow-lg z-20">
            {games.map((gameOption, index) => (
              <button
                key={gameOption._id || (gameOption as any)._id || gameOption.name || index}
                className="w-full px-4 py-3 text-left hover:bg-[#212529] flex items-center font-poppins text-sm transition-colors text-white first:rounded-t-[19px] last:rounded-b-[19px]"
                onClick={() => handleGameSelect(gameOption.name)}
              >
                <img
                  src={getGameImageUrl(gameOption) || '/placeholder.JPG'}
                  alt={gameOption.name}
                  className="w-10 h-10 object-contain mr-3"
                  onError={e => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    const parent = target.parentElement
                    if (parent) {
                      parent.innerHTML = '🎮'
                      parent.style.fontSize = '12px'
                    }
                  }}
                />
                <span>{gameOption.name}</span>
              </button>
            ))} */}
        {/*   </div>
        )} */}
      </div>
    </div>
  )
}

export default GameSelector
