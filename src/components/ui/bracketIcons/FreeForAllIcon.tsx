import Image from 'next/image'

import FreeForAllSvg from '@/components/assets/tournament/FreeForAll.svg'
import AppImage from '@/components/ui/Image'

export default function FreeForAllIcon() {
  return (
    <div className="w-16 h-12 flex items-center justify-center">
      <AppImage
        alt="Free For All"
        className="object-contain"
        height={36}
        src={FreeForAllSvg}
        width={48}
      />
    </div>
  )
}
