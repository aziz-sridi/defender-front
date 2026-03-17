'use client'
import Image from 'next/image'
import { useParams } from 'next/navigation'

import Typo from '@/components/ui/Typo'
import BackButton from '@/components/user/settings/sidebarTabs/helpers/BackButton'
import ConnectAccountForm from '@/components/user/settings/sidebarTabs/helpers/ConnectAccountForm'
import ConnectRiotGames from '@/components/user/settings/sidebarTabs/helpers/ConnectRiotGames'

const contentType = [
  { name: 'Xbox', src: '/xbox.png' },
  { name: 'Psn', src: '/psn.png' },
  { name: 'Riot', src: '/riotBg.png' },
  { name: 'Battlenet', src: '/battlenet.jpg' },
  { name: 'Discord', src: '/discord.jpg' },
  // Support multiple variants for Mobile Legends
  { name: 'Mobile Legends', src: '/mobileLegend.png' },
  { name: 'MobileLegends', src: '/mobileLegend.png' },
  { name: 'mobilelegends', src: '/mobileLegend.png' },
]

const ConnectAccount = ({ params }: { params: { account: string } }) => {
  const urlParams = useParams()
  const userId = urlParams.id as string

  // Normalize account name for matching
  const normalizedAccount = params.account.replace(/\s+/g, '').toLowerCase()
  const contentTypeItem =
    contentType.find(item => item.name.replace(/\s+/g, '').toLowerCase() === normalizedAccount) ||
    contentType[0]

  return (
    <section className="flex flex-col lg:flex-row md:pt-10 pt-5 overflow-hidden bg-black lg:h-[100vh] relative">
      <div className="h-[50vh] lg:h-full relative lg:flex-1 bg-gray-800 flex items-center justify-center">
        <Image
          fill
          alt="defendr"
          className="object-cover object-center"
          src={contentTypeItem.src}
        />
      </div>

      <BackButton userId={userId} />

      <aside className="flex-1 flex flex-col justify-center items-center gap-10 p-5">
        <Typo as="h3" className="text-center" fontFamily="poppins" fontVariant="h4">
          Account linking
        </Typo>

        <ConnectAccountForm name={params.account} />
      </aside>
    </section>
  )
}

export default ConnectAccount
