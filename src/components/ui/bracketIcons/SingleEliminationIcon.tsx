import Image from 'next/image'

import SingleEliminationSvg from '@/components/assets/tournament/singleElimination.svg'
import AppImage from '@/components/ui/Image'

export default function SingleEliminationIcon() {
  return (
    <div className="w-16 h-12 flex items-center justify-center">
      <AppImage
        alt="Single Elimination"
        className="object-contain"
        height={36}
        src={SingleEliminationSvg}
        width={48}
      />
    </div>
  )
}
