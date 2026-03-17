'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react'

import { Game } from '@/types/gameType'
import { getGameImageUrl } from '@/utils/imageUrlSanitizer'
import Typo from '@/components/ui/Typo'
import GamePopup from '@/components/user/settings/sidebarTabs/helpers/ChosenGamePopup'

interface GameCardProps {
  game: Game
  isSelected: boolean
  onSelect: (game: Game) => void
}

const GameCard = ({ game, isSelected, onSelect }: GameCardProps) => {
  const imageUrl = getGameImageUrl(game)
  const [imageError, setImageError] = useState(false)
  const [showGamePopup, setShowGamePopup] = useState(false)

  useEffect(() => {
    setImageError(false)
  }, [game._id])

  const onHandleSelect = async (game: Game) => {
    switch (game.name) {
      case 'Apex Legends':
      case 'Mobile Legends: Bang Bang':
      case 'EA Sports FC 24':
      case 'Rocket League':
        setShowGamePopup(true)
        break
      default:
        onSelect(game)
        break
    }
  }

  return (
    <>
      <div
        className={`
          relative w-full h-48 rounded-lg cursor-pointer transition-all duration-200 overflow-hidden
          ${isSelected ? 'ring-2 ring-defendrRed' : 'hover:ring-2 hover:ring-defendrRed'}
        `}
        onClick={() => onHandleSelect(game)}
      >
        <div className="w-full h-full relative">
          {imageUrl && !imageError ? (
            <Image
              fill
              alt={game.name}
              className="object-cover"
              priority={false}
              src={imageUrl}
              unoptimized={false}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-defendrGrey to-defendrLightBlack">
              <Typo as="span" className="text-4xl font-bold" color="white" fontVariant="h2">
                {game.name.charAt(0).toUpperCase()}
              </Typo>
            </div>
          )}

          <div className="absolute inset-0 bg-black bg-opacity-40" />
          <div className="absolute bottom-3 left-3 right-3">
            <Typo
              as="span"
              className="font-bold text-sm"
              color="white"
              fontFamily="poppins"
              fontVariant="p3"
            >
              {game.name}
            </Typo>
          </div>
        </div>
      </div>

      <GamePopup
        game={game}
        isOpen={showGamePopup}
        onClose={() => setShowGamePopup(false)}
        onSuccess={() => onSelect(game)}
      />
    </>
  )
}

export default GameCard
