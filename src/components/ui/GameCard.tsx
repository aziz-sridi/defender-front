import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Users, Calendar, Star } from 'lucide-react'

import { Game } from '@/types/gameType'
import { getGameImageUrl } from '@/utils/imageUrlSanitizer'
import Typo from '@/components/ui/Typo'
import Button from '@/components/ui/Button'
import SimplifiedGameCard from './SimplifiedGameCard'

interface GameCardProps {
  game: Game
  isSelected: boolean
  onSelect: (game: Game) => void
  showHoverData?: boolean
  tournaments?: { game?: { _id?: string } }[]
  publishedTournamentCount?: number
  simplified?: boolean // If true, use the user's simplified version
}

const GameCard = ({
  game,
  isSelected,
  onSelect,
  showHoverData = false,
  tournaments = [],
  publishedTournamentCount = 0,
  simplified = false,
}: GameCardProps) => {
  const imageUrl = getGameImageUrl(game)
  const [imageError, setImageError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [showAllPlatforms, setShowAllPlatforms] = useState(false)

  useEffect(() => {
    setImageError(false)
  }, [game?._id])

  // Guard: only render when we definitely have a valid game
  const isValidGame = !!game && typeof game._id === 'string' && typeof game.name === 'string'
  if (!isValidGame) {
    return null
  }

  if (simplified) {
    return <SimplifiedGameCard game={game} isSelected={isSelected} onSelect={onSelect} />
  }

  // Full version (original)
  const gameTournaments = tournaments.filter(t => t.game?._id === game._id)
  const formatDate = (dateString?: string) => {
    if (!dateString) {
      return 'Not specified'
    }
    try {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
      }).format(new Date(dateString))
    } catch {
      return dateString
    }
  }

  // Extract game data from IGDB data
  const gameGenre = game.igdbData?.genres?.[0]?.name || 'Unknown'
  const gamePlatforms = game.platforms || []
  const gameDeveloper =
    game.igdbData?.involved_companies?.find(
      (company: { developer?: boolean; company?: { name?: string } }) => company.developer,
    )?.company?.name || 'Unknown'
  const gameReleaseDate = game.igdbData?.first_release_date

  return (
    <div
      className={`
        relative w-full h-[400px] rounded-lg cursor-pointer transition-all duration-300 overflow-hidden bg-gray-800 flex flex-col
        ${isSelected ? 'ring-2 ring-defendrRed scale-[1.03]' : 'hover:ring-2 hover:ring-defendrRed hover:scale-[1.03]'}
      `}
      onClick={() => onSelect(game)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Game Image */}
      <div className="relative w-full h-[180px] rounded-t-lg overflow-hidden">
        {imageUrl && !imageError ? (
          <>
            <Image
              fill
              alt={game.name}
              className="object-cover object-center transition-transform duration-200"
              priority={false}
              src={imageUrl}
              unoptimized={false}
              onError={() => setImageError(true)}
            />
            {/* Gradient overlay for better readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent pointer-events-none" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-defendrGrey to-defendrLightBlack">
            <Typo as="span" className="text-4xl font-bold" color="white" fontVariant="h2">
              {game.name ? game.name.charAt(0).toUpperCase() : '?'}
            </Typo>
          </div>
        )}

        {/* Hover Data Overlay */}
        {showHoverData && isHovered && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <div className="text-center text-white p-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="h-4 w-4" />
                <Typo as="span" className="font-semibold" fontFamily="poppins" fontVariant="p5">
                  {publishedTournamentCount} Published Tournaments
                </Typo>
              </div>
              {gameGenre && gameGenre !== 'Unknown' && (
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="h-4 w-4" />
                  <Typo as="span" fontFamily="poppins" fontVariant="p5">
                    {gameGenre}
                  </Typo>
                </div>
              )}
              {gameReleaseDate && (
                <div className="flex items-center justify-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <Typo as="span" fontFamily="poppins" fontVariant="p5">
                    {formatDate(new Date(gameReleaseDate * 1000).toISOString())}
                  </Typo>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Game Info */}
      <div className="flex flex-col gap-3 p-4 flex-grow">
        {/* Game Name */}
        <Typo
          as="h2"
          className="text-left text-lg font-semibold"
          color="white"
          fontFamily="poppins"
          fontVariant="h5"
        >
          {game.name}
        </Typo>

        {/* Game Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {gameGenre && gameGenre !== 'Unknown' && (
            <Typo
              as="span"
              className="px-3 py-1 rounded-full text-xs font-medium bg-blue-600 text-white"
              fontFamily="poppins"
              fontVariant="p5"
            >
              {gameGenre}
            </Typo>
          )}
          {gamePlatforms.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {(showAllPlatforms ? gamePlatforms : gamePlatforms.slice(0, 3)).map(
                (platform, index) => (
                  <Typo
                    key={index}
                    as="span"
                    className="px-2 py-1 rounded-full text-xs font-medium bg-green-600 text-white"
                    fontFamily="poppins"
                    fontVariant="p4"
                  >
                    {platform}
                  </Typo>
                ),
              )}
              {gamePlatforms.length > 3 && !showAllPlatforms && (
                <button
                  onClick={e => {
                    e.stopPropagation()
                    setShowAllPlatforms(true)
                  }}
                  className="px-2 py-1 rounded-full text-xs font-medium bg-gray-600 text-white hover:bg-gray-500 transition-colors cursor-pointer"
                >
                  <Typo as="span" fontFamily="poppins" fontVariant="p4">
                    +{gamePlatforms.length - 3}
                  </Typo>
                </button>
              )}
              {showAllPlatforms && gamePlatforms.length > 3 && (
                <button
                  onClick={e => {
                    e.stopPropagation()
                    setShowAllPlatforms(false)
                  }}
                  className="px-2 py-1 rounded-full text-xs font-medium bg-gray-600 text-white hover:bg-gray-500 transition-colors cursor-pointer"
                >
                  <Typo as="span" fontFamily="poppins" fontVariant="p4">
                    Show less
                  </Typo>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Game Details */}
        <div className="flex flex-col gap-2 mb-4">
          {gameDeveloper && gameDeveloper !== 'Unknown' && (
            <div className="flex items-center justify-between">
              <Typo as="span" className="font-poppins text-xs" color="ghostGrey" fontVariant="p5">
                Developer
              </Typo>
              <Typo
                as="span"
                className="font-poppins text-xs text-white truncate max-w-[120px]"
                fontVariant="p5"
              >
                {gameDeveloper}
              </Typo>
            </div>
          )}

          {gameReleaseDate && (
            <div className="flex items-center justify-between">
              <Typo as="span" className="font-poppins text-xs" color="ghostGrey" fontVariant="p5">
                Release Date
              </Typo>
              <Typo as="span" className="font-poppins text-xs" color="white" fontVariant="p5">
                {formatDate(new Date(gameReleaseDate * 1000).toISOString())}
              </Typo>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-2 mt-auto">
          <Button
            label="View Game"
            size="xs"
            variant="contained-red"
            className="w-full"
            fontFamily="poppins"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation()
              onSelect(game)
            }}
          />
        </div>
      </div>
    </div>
  )
}

// GameCard component with tournament count KPI support
export default GameCard
