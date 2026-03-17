'use client'

import Image from 'next/image'
import { useState } from 'react'
import { X, Calendar, Users, Star, Gamepad2, ExternalLink } from 'lucide-react'

import Typo from '@/components/ui/Typo'
import Button from '@/components/ui/Button'
import { getGameImageUrl } from '@/utils/imageUrlSanitizer'
import { Game, GamePlatform } from '@/types/gameType'

interface Tournament {
  _id: string
  name: string
  game?: {
    _id: string
    name: string
  }
}

interface GamePopupModalProps {
  game: Game
  tournaments: Tournament[]
  onClose: () => void
  onViewTournaments: () => void
}

export default function GamePopupModal({
  game,
  tournaments,
  onClose,
  onViewTournaments,
}: GamePopupModalProps) {
  const [imageError, setImageError] = useState(false)
  const gameImageUrl = getGameImageUrl(game)

  // Extract game data from IGDB data
  const gameGenre = game.igdbData?.genres?.[0]?.name || 'Unknown'
  const gamePlatforms = game.platforms || []
  const gameDeveloper =
    game.igdbData?.involved_companies?.find((company: any) => company.developer)?.company?.name ||
    'Unknown'
  const gamePublisher =
    game.igdbData?.involved_companies?.find((company: any) => company.publisher)?.company?.name ||
    'Unknown'
  const gameReleaseDate = game.igdbData?.first_release_date

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return 'Not specified'
    try {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date(timestamp * 1000))
    } catch {
      return 'Not specified'
    }
  }

  const renderStars = (rating?: number) => {
    if (!rating) return null
    const stars = Math.round(rating / 2) // Convert 10-point scale to 5-star scale
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`}
          />
        ))}
        <span className="text-gray-400 text-sm ml-2">({rating}/10)</span>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative border-b border-gray-700/20 p-6">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-white text-2xl font-bold"
          >
            ×
          </button>

          <div className="flex items-start gap-6">
            {/* Game Cover */}
            <div className="flex-shrink-0">
              <div className="relative w-32 h-40 rounded-lg overflow-hidden">
                {gameImageUrl && !imageError ? (
                  <Image
                    fill
                    alt={game.name}
                    className="object-cover"
                    src={gameImageUrl}
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-defendrGrey to-defendrLightBlack flex items-center justify-center">
                    <Typo as="span" className="text-4xl font-bold" color="white" fontVariant="h2">
                      {game.name?.charAt(0).toUpperCase() || '?'}
                    </Typo>
                  </div>
                )}
              </div>
            </div>

            {/* Game Info */}
            <div className="flex-1">
              <Typo
                as="h2"
                className="text-3xl font-bold text-white mb-2"
                fontFamily="poppins"
                fontVariant="h2"
              >
                {game.name}
              </Typo>

              <div className="flex items-center gap-4 mb-4">
                {gameGenre && gameGenre !== 'Unknown' && (
                  <Typo
                    as="span"
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full"
                    fontFamily="poppins"
                    fontVariant="p5"
                  >
                    {gameGenre}
                  </Typo>
                )}
                {gamePlatforms.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {gamePlatforms.slice(0, 3).map((platform, index) => (
                      <Typo
                        key={index}
                        as="span"
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded-full"
                        fontFamily="poppins"
                        fontVariant="p4"
                      >
                        {platform}
                      </Typo>
                    ))}
                    {gamePlatforms.length > 3 && (
                      <Typo
                        as="span"
                        className="px-3 py-1 bg-gray-600 text-white text-sm rounded-full"
                        fontFamily="poppins"
                        fontVariant="p4"
                      >
                        +{gamePlatforms.length - 3}
                      </Typo>
                    )}
                  </div>
                )}
              </div>

              {renderStars(game.rating)}

              <div className="mt-4 space-y-2">
                {gameDeveloper && gameDeveloper !== 'Unknown' && (
                  <div className="flex items-center gap-2">
                    <Gamepad2 className="h-4 w-4 text-gray-400" />
                    <Typo as="span" color="ghostGrey" fontFamily="poppins" fontVariant="p5">
                      Developer: <span className="text-white">{gameDeveloper}</span>
                    </Typo>
                  </div>
                )}

                {gamePublisher && gamePublisher !== 'Unknown' && (
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                    <Typo as="span" color="ghostGrey" fontFamily="poppins" fontVariant="p5">
                      Publisher: <span className="text-white">{gamePublisher}</span>
                    </Typo>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <Typo as="span" color="ghostGrey" fontFamily="poppins" fontVariant="p5">
                    Release Date: <span className="text-white">{formatDate(gameReleaseDate)}</span>
                  </Typo>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <Typo as="span" color="ghostGrey" fontFamily="poppins" fontVariant="p5">
                    Tournaments: <span className="text-white">{tournaments.length}</span>
                  </Typo>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="p-6">
          <h3 className="text-xl font-semibold text-white mb-4 font-poppins">Description</h3>
          <div className="bg-gray-700/30 rounded-lg p-4">
            <Typo
              as="p"
              color="white"
              fontFamily="poppins"
              fontVariant="p4"
              className="leading-relaxed"
            >
              {game.description || 'No description available for this game.'}
            </Typo>
          </div>
        </div>

        {/* Tournaments Section */}
        {tournaments.length > 0 && (
          <div className="p-6 border-t border-gray-700/20">
            <h3 className="text-xl font-semibold text-white mb-4 font-poppins">
              Available Tournaments ({tournaments.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {tournaments.slice(0, 6).map(tournament => (
                <div
                  key={tournament._id}
                  className="bg-gray-700/30 rounded-lg p-3 hover:bg-gray-700/50 transition-colors"
                >
                  <Typo
                    as="p"
                    color="white"
                    fontFamily="poppins"
                    fontVariant="p5"
                    className="font-medium"
                  >
                    {tournament.name}
                  </Typo>
                </div>
              ))}
              {tournaments.length > 6 && (
                <div className="bg-gray-700/30 rounded-lg p-3 flex items-center justify-center">
                  <Typo as="p" color="ghostGrey" fontFamily="poppins" fontVariant="p5">
                    +{tournaments.length - 6} more tournaments
                  </Typo>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="border-t border-gray-700/20 p-6">
          <div className="flex justify-center gap-4">
            <Button
              label="View Tournaments"
              size="m"
              variant="contained-red"
              onClick={onViewTournaments}
              fontFamily="poppins"
            />
            <Button
              label="Close"
              size="m"
              variant="outlined-grey"
              onClick={onClose}
              fontFamily="poppins"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
