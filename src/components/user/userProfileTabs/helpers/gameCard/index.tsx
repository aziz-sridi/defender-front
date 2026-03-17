import React from 'react'

import Typo from '@/components/ui/Typo'
import { VariantImage } from '@/components/ui/VariantImage'

const GameCard = ({
  gamePhoto,
  gameName,
  textColor,
  backgroundColor,
}: {
  gamePhoto: any
  gameName: any
  textColor: any
  backgroundColor: any
}) => {
  return (
    <div
      className={`p-4 rounded-lg flex flex-col items-center justify-center h-[180px] sm:h-[220px] bg-gray-800`}
      style={{ backgroundColor: backgroundColor }}
    >
      <VariantImage
        alt={gameName}
        className="w-24 h-24 object-cover rounded-md mb-3"
        src={gamePhoto}
      />
      <Typo as="p" className={`text-${textColor} mb-1`} fontFamily="poppins" fontVariant="p4">
        {gameName}
      </Typo>
      {/* <div className={`mt-4 w-full h-1 bg-red-800`} /> */}
    </div>
  )
}

export default GameCard
