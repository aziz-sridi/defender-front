import Image from 'next/image'
import Typo from '@/components/ui/Typo'
import { Game } from '@/types/gameType'
import { getGameImageUrl } from '@/utils/imageUrlSanitizer'
import { useEffect, useState } from 'react'

interface SimplifiedGameCardProps {
  game: Game
  isSelected: boolean
  onSelect: (game: Game) => void
}

const SimplifiedGameCard = ({ game, isSelected, onSelect }: SimplifiedGameCardProps) => {
  const imageUrl = getGameImageUrl(game)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    setImageError(false)
  }, [game?._id])

  const platforms = game.platforms || []

  return (
    <div
      className={`
        relative w-full rounded-xl cursor-pointer transition-all duration-300 overflow-hidden group
        ${
          isSelected
            ? 'ring-2 ring-defendrRed scale-[1.02] shadow-lg shadow-red-900/20'
            : 'hover:ring-2 hover:ring-defendrRed/60 hover:scale-[1.02]'
        }
      `}
      onClick={() => onSelect(game)}
    >
      {/* Game Image — 3:4 aspect ratio for a tall card feel */}
      <div className="relative w-full aspect-[3/4] overflow-hidden">
        {imageUrl && !imageError ? (
          <>
            <Image
              fill
              alt={game.name}
              className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
              priority={false}
              src={imageUrl}
              unoptimized={false}
              onError={() => setImageError(true)}
            />
            {/* Dark gradient at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            <Typo
              as="span"
              className="text-4xl font-bold opacity-40"
              color="white"
              fontVariant="h2"
            >
              {game.name ? game.name.charAt(0).toUpperCase() : '?'}
            </Typo>
          </div>
        )}

        {/* Overlaid info at bottom of image */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <Typo
            as="h3"
            className="font-bold text-sm leading-tight line-clamp-2 drop-shadow-lg"
            color="white"
            fontFamily="poppins"
            fontVariant="p3"
          >
            {game.name}
          </Typo>

          {/* Platform badges */}
          {platforms.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {platforms.slice(0, 2).map((p, i) => (
                <span
                  key={i}
                  className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-white/15 text-white/80 backdrop-blur-sm"
                >
                  {p}
                </span>
              ))}
              {platforms.length > 2 && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-white/10 text-white/60">
                  +{platforms.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SimplifiedGameCard
