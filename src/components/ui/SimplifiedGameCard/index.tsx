import Image from 'next/image'
import { useEffect, useState } from 'react'

import Typo from '@/components/ui/Typo'
import { Game } from '@/types/gameType'
import { getGameImageUrl } from '@/utils/imageUrlSanitizer'

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

  return (
    <div
      className={`
        relative w-full rounded-lg cursor-pointer transition-all duration-200 overflow-hidden
        ${isSelected ? 'ring-2 ring-defendrRed scale-[1.03]' : 'hover:ring-2 hover:ring-defendrRed hover:scale-[1.03]'}
      `}
      onClick={() => onSelect(game)}
    >
      {/* Game Image - Improved display */}
      <div className="w-full h-64 relative rounded-t-lg overflow-hidden">
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
            {/* Subtle shadow at bottom */}
            <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-black/40 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-defendrGrey to-defendrLightBlack">
            <Typo as="span" className="text-4xl font-bold" color="white" fontVariant="h2">
              {game.name ? game.name.charAt(0).toUpperCase() : '?'}
            </Typo>
          </div>
        )}
      </div>

      {/* Game Name in Gray Box Below Image */}
      <div className="bg-defendrGrey px-4 py-3 rounded-b-lg">
        <Typo
          as="span"
          className="font-bold text-sm text-center block"
          color="white"
          fontFamily="poppins"
          fontVariant="p3"
        >
          {game.name}
        </Typo>
      </div>
    </div>
  )
}

export default SimplifiedGameCard
