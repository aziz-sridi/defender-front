'use client'

import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'

import { getAllGames, toggleFavoriteGame } from '@/services/gameService'
import { getGameImageUrl } from '@/utils/imageUrlSanitizer'
import Typo from '@/components/ui/Typo'

type Game = {
  _id: string
  name: string
}

export default function Component() {
  const { data: session, update } = useSession()
  const [games, setGames] = useState<Game[]>([])
  const [filteredGames, setFilteredGames] = useState<Game[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedGameIds, setSelectedGameIds] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [initializedFromSession, setInitializedFromSession] = useState(false)

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await getAllGames()
        setGames(response)
        setFilteredGames(response)
      } catch {
        setError('An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchGames()
  }, [])

  useEffect(() => {
    const filtered = games.filter(game =>
      game.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setFilteredGames(filtered)
  }, [searchQuery, games])

  // Initialize selected games from the logged-in user's favorites once
  useEffect(() => {
    const favorites = (session?.user?.favoriteGames as string[] | undefined) || []
    if (!initializedFromSession && favorites.length > 0) {
      setSelectedGameIds(favorites)
      setInitializedFromSession(true)
    }
  }, [session, initializedFromSession])

  const toggleSelect = (id: string) => {
    setSelectedGameIds(prev => (prev.includes(id) ? prev.filter(gid => gid !== id) : [...prev, id]))
  }

  const saveFavoriteGames = async () => {
    if (!session) {
      toast.error('You need to be signed in to save favorites')
      return
    }
    const currentFavorites = (session.user?.favoriteGames as string[] | undefined) || []
    const selectedSet = new Set(selectedGameIds)
    const currentSet = new Set(currentFavorites)

    const toToggle: string[] = []
    // Add newly selected (not in current)
    for (const id of selectedSet) {
      if (!currentSet.has(id)) {
        toToggle.push(id)
      }
    }
    // Remove deselected (in current but not selected)
    for (const id of currentSet) {
      if (!selectedSet.has(id)) {
        toToggle.push(id)
      }
    }

    if (toToggle.length === 0) {
      toast.info('No changes to save')
      return
    }

    setIsSaving(true)
    try {
      const results = await Promise.allSettled(toToggle.map(id => toggleFavoriteGame(id)))
      const failed = results.filter(r => r.status === 'rejected').length
      if (failed === 0) {
        toast.success('Favorite games saved successfully!')
        // Merge updated favorites into session so UI reflects without relog
        await update({
          user: {
            ...(session.user || {}),
            favoriteGames: Array.from(selectedSet),
          },
        })
      } else if (failed === results.length) {
        toast.error('Failed to save favorite games')
      } else {
        toast.error('Some games could not be saved')
      }
    } catch {
      toast.error('Failed to save favorite games')
    } finally {
      setIsSaving(false)
    }
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-red-500">{error}</div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      <Typo
        as="h1"
        className="flex items-center justify-center"
        fontFamily="poppins"
        fontVariant="h1"
      >
        Select Your Favorite Games
      </Typo>
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            className="w-full pl-10 pr-4 py-2 border border-black bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search for games"
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {(() => {
          const current = (session?.user?.favoriteGames as string[] | undefined) || []
          const sameLength = current.length === selectedGameIds.length
          const sameItems =
            sameLength &&
            current.every(id => selectedGameIds.includes(id)) &&
            selectedGameIds.every(id => current.includes(id))
          return !sameItems
        })() && (
          <button
            className="bg-red-500 hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-6 py-2 rounded-md shadow-md transition whitespace-nowrap"
            disabled={isSaving}
            onClick={saveFavoriteGames}
          >
            {isSaving ? 'Saving…' : 'Save your games'}
          </button>
        )}
      </div>

      {/* Games grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {isLoading
          ? Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="aspect-[3/4] animate-pulse bg-gray-200 rounded-lg" />
            ))
          : filteredGames.map(game => (
              <div
                key={game._id}
                className={`group relative aspect-[3/4] rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer border-4 ${
                  selectedGameIds.includes(game._id) ? 'border-red-500' : 'border-transparent'
                }`}
                onClick={() => toggleSelect(game._id)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={game.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  src={getGameImageUrl(game)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="absolute bottom-0 p-4 text-white">
                    <h2>{game.name}</h2>
                  </div>
                </div>
              </div>
            ))}
      </div>
    </div>
  )
}
