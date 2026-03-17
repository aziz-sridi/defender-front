import Link from 'next/link'

import Typo from '@/components/ui/Typo'
import { BackSVG } from '@/components/user/settings/sidebarTabs/helpers/SvgIcons'

interface BackButtonProps {
  userId: string
}

const BackButton = ({ userId }: BackButtonProps) => {
  return (
    <Link className="absolute pt-5 scale-75" href={`/user/${userId}/settings/Game-accounts`}>
      <button
        className="bg-white text-center lg:w-64 w-56 rounded-2xl h-14 relative text-black lg:text-xl font-poppins group"
        type="button"
      >
        <div className="bg-defendrRed rounded-xl h-12 w-1/6 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-45 lg:group-hover:w-[250px] z-10 duration-500 transition-all">
          <BackSVG />
        </div>
        <Typo
          as="p"
          className="translate-x-6 ml-1 fit-content capitalize overflow-hidden text-sm font-semibold"
          color="black"
          fontFamily="poppins"
          fontVariant="p2"
        >
          profile setting
        </Typo>
      </button>
    </Link>
  )
}

export default BackButton
