import Image from 'next/image'

import DoubleEliminationSvg from '@/components/assets/tournament/DoubleElimination.svg'
import AppImage from '@/components/ui/Image'

export default function DoubleEliminationIcon() {
  return (
    <div className="w-16 h-12 flex items-center justify-center">
      <AppImage
        alt="Double Elimination"
        className="object-contain"
        height={36}
        src={DoubleEliminationSvg}
        width={48}
      />
    </div>
  )
}
