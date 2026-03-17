import Image from 'next/image'

import RoundRobinSvg from '@/components/assets/tournament/RoundRobin.svg'
import AppImage from '@/components/ui/Image'

export default function RoundRobinIcon() {
  return (
    <div className="w-16 h-12 flex items-center justify-center">
      <AppImage
        alt="Round Robin"
        className="object-contain"
        height={36}
        src={RoundRobinSvg}
        width={48}
      />
    </div>
  )
}
