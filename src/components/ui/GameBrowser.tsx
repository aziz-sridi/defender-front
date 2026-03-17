'use client'
import { useEffect, useState } from 'react'

import Button from '@/components/ui/Button'
import GameCard from '@/components/ui/GameCard'
import Typo from '@/components/ui/Typo'
import { getAllGames } from '@/services/gameService'
import { Game } from '@/types/gameType'
import { sanitizeGamesResponse } from '@/utils/sanitizeGamesResponse'

type GameBrowserProps = {
  title?: string
  columns?: number
  showDone?: boolean
  onDone?: (game: Game) => void
}

export default function GameBrowser({
  title = 'GAMES',
  columns = 7,
  showDone = false,
  onDone,
}: GameBrowserProps) {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await getAllGames()
        const cleanGames = sanitizeGamesResponse(response)
        setGames(cleanGames)
      } catch {
        setError('Failed to load games. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchGames()
  }, [])

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
    } catch {
      setError('Failed to load games. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const gridColsClass =
    columns >= 7
      ? 'grid-cols-7'
      : columns === 6
        ? 'grid-cols-6'
        : columns === 5
          ? 'grid-cols-5'
          : columns === 4
            ? 'grid-cols-4'
            : columns === 3
              ? 'grid-cols-3'
              : columns === 2
                ? 'grid-cols-2'
                : 'grid-cols-1'

  return (
    <div className="min-h-screen w-full bg-defendrBg flex flex-col p-8">
      {title && (
        <div className=" mb-8">
          <Typo as="h1" className="font-bold " color="white" fontFamily="poppins" fontVariant="h2">
            {title}
          </Typo>
        </div>
      )}

      <div className="mb-8 flex w-full">
        <div className="relative w-full mx-3">
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

      <div
        className="flex-1 overflow-y-auto pr-2"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#E91E63 #3A3A3A' }}
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
          <div className={`grid gap-6 ${gridColsClass}`}>
            {filteredGames.map((game: Game) => (
              <div key={game._id} className="min-h-[220px] flex flex-col m-2">
                <GameCard
                  simplified
                  game={game}
                  isSelected={selectedGame?._id === game._id}
                  onSelect={() => {
                    if (selectedGame?._id === game._id) {
                      setSelectedGame(null)
                    } else {
                      setSelectedGame(game)
                    }
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fixed position DONE button, only visible when a game is selected */}
      {showDone && onDone && selectedGame && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-24 z-50">
          <Button
            label="DONE"
            size="l"
            variant="contained-red"
            onClick={() => selectedGame && onDone(selectedGame)}
          />
        </div>
      )}
    </div>
  )
}
