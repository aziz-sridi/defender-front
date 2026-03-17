'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

import Button from '@/components/ui/Button/index'
import Typo from '@/components/ui/Typo'
import { Game } from '@/types/gameType'
import { getAllGames } from '@/services/gameService'
import GameCard from '@/components/user/userProfileTabs/helpers/linkGameCard'
import { sanitizeGamesResponse } from '@/utils/sanitizeGamesResponse'

interface GameSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onGameSelect: (game: Game) => void
}

export default function GameSelectionModal({
  isOpen,
  onClose,
  onGameSelect,
}: GameSelectionModalProps): React.JSX.Element | null {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchGames = async () => {
      if (!isOpen) {
        return
      }

      setLoading(true)
      setError(null)

      try {
        const response = await getAllGames()
        const cleanGames = sanitizeGamesResponse(response)
        setGames(cleanGames)
      } catch (err) {
        setError('Failed to load games. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchGames()
  }, [isOpen])

  const filteredGames = games.filter((game: Game) =>
    game.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const retryFetchGames = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await getAllGames()
      const cleanGames = sanitizeGamesResponse(response)
      setGames(cleanGames)
    } catch (err) {
      console.error('Retry error:', err)
      setError('Failed to load games. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDone = () => {
    if (selectedGame) {
      //localStorage.setItem('selectedGame', JSON.stringify(selectedGame))
      onGameSelect(selectedGame)
    }
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-defendrBg rounded-lg p-8 relative max-h-[90vh] w-[80vw] max-w-4xl flex flex-col">
        <button
          className="absolute top-6 right-6 text-white hover:text-defendrRed text-xl"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="flex-shrink-0">
          <div className="text-center mb-8">
            <Typo
              as="h1"
              className="font-bold font-poppins text-[2rem] lg:text-md"
              color="red"
              fontVariant="h2"
            >
              Select A GAME
            </Typo>
          </div>

          <div className="mb-8 flex justify-center">
            <div className="relative w-40">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="w-4 h-4 text-defendrGrey"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </div>
              <input
                className="w-full pl-10 pr-4 py-2 bg-defendrLightBlack border border-defendrGrey rounded-lg text-white placeholder-defendrGrey focus:border-defendrRed focus:outline-none text-sm"
                placeholder="Search"
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-6 text-center">
            <Typo as="h3" color="white" fontFamily="poppins" fontVariant="p1">
              Most Recent Games
            </Typo>
          </div>
        </div>
        <div
          className="flex-1 overflow-y-auto mb-8 pr-2"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#E91E63 #3A3A3A',
          }}
        >
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-defendrRed" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <Typo as="p" className="mb-4" color="red" fontVariant="p3">
                {error}
              </Typo>
              <Button label="Retry" size="xxs" variant="contained-red" onClick={retryFetchGames} />
            </div>
          ) : filteredGames.length === 0 ? (
            <div className="flex items-center justify-center h-40">
              <Typo as="p" color="white" fontVariant="p3">
                {searchQuery ? 'No games found matching your search.' : 'No games available.'}
              </Typo>
            </div>
          ) : (
            <div className="grid grid-cols-1  md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredGames.map((game: Game) => (
                <GameCard
                  key={game._id}
                  game={game}
                  isSelected={selectedGame?._id === game._id}
                  onSelect={setSelectedGame}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex-shrink-0 flex justify-center">
          <button
            className={`
          px-12 py-3 rounded-lg font-bold font-poppins text-white transition-all duration-200
          ${
            selectedGame
              ? 'bg-defendrRed hover:bg-red-600 cursor-pointer'
              : 'bg-gray-600 cursor-not-allowed opacity-50'
          }
        `}
            disabled={!selectedGame}
            onClick={handleDone}
          >
            DONE
          </button>
        </div>
      </div>
    </div>
  )
}
