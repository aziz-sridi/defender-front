import Image from 'next/image'

import SwapSeedSvg from '@/components/assets/tournament/SWAPSeed.svg'
import AppImage from '@/components/ui/Image'

export default function SwapSeedIcon() {
  return (
    <div className="w-16 h-12 flex items-center justify-center">
      <AppImage
        alt="SWAP Seed"
        className="object-contain"
        height={36}
        src={SwapSeedSvg}
        width={48}
      />
    </div>
  )
}
