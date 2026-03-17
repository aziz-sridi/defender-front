'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { getSession } from 'next-auth/react'
import Image from 'next/image'

import Typo from '@/components/ui/Typo'
import Button from '@/components/ui/Button'

interface AccountSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onAccountSelect: (account: string) => void
  user?: any // Add user prop to check connected accounts
}
export default function AccountsPopup({
  isOpen,
  onClose,
  onAccountSelect,
  user,
}: AccountSelectionModalProps): React.JSX.Element | null {
  const router = useRouter()

  const allAccounts = [
    {
      id: 'xbox',
      name: 'XBOX',
      displayName: 'XBOX',
      image: '/xbox.webp',
    },
    {
      id: 'psn',
      name: 'PSN',
      displayName: 'PSN',
      image: '/psn.webp',
    },
    {
      id: 'battlenet',
      name: 'Battlenet',
      displayName: 'Battlenet',
      image: '/battlenet.webp',
    },
    {
      id: 'riot',
      name: 'Riot games',
      displayName: 'Riot games',
      image: '/riotGames.webp',
    },
    {
      id: 'discord',
      name: 'Discord',
      displayName: 'Discord',
      image: '/discord.avif',
    },
    {
      id: 'mobileLegends',
      name: 'Mobile Legends',
      displayName: 'Mobile Legends',
      image: '/mobileLegend.png',
    },
    {
      id: 'origin',
      name: 'EA/Origin',
      displayName: 'EA/Origin',
      image:
        'https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/defendr_elements/Games%20and%20accounts/ea.png',
    },
  ]

  // Filter out Discord if already connected
  const accounts = allAccounts.filter(account => {
    if (account.id === 'discord' && Boolean(user?.socialMediaLinks?.discord?.trim())) {
      return false // Hide Discord if already connected
    }
    return true
  })

  const handleAccountSelect = async (accountId: string) => {
    onAccountSelect(accountId)
    onClose()
    const session = await getSession()
    const userId = session?.user?._id as string
    router.push(`/user/${userId}/settings/Game-accounts/${accountId}`)
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-[#212529] rounded-lg p-8 relative max-h-[90vh] w-[80vw] max-w-4xl flex flex-col">
        <Button
          className="absolute top-1 right-1 w-1 h-1 text-white hover:text-defendrRed w-auto"
          label="✕"
          variant="contained-black"
          onClick={onClose}
        />

        <div className="flex-shrink-0">
          <div className="text-center mb-8">
            <Typo
              as="h3"
              className="text-sm md:text-md font-bold"
              color="white"
              fontFamily="poppins"
              fontVariant="h3"
            >
              SELECT AN ACCOUNT
            </Typo>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {accounts.map(account => (
              <div
                key={account.id}
                className={`
                  relative cursor-pointer transition-all duration-200
                  rounded-lg overflow-hidden h-32
                `}
                onClick={() => handleAccountSelect(account.id)}
              >
                <div className="absolute inset-0">
                  <div className="w-full h-full flex items-center justify-center">
                    <Image
                      fill
                      alt={account.name}
                      className="object-contain object-center"
                      src={account.image}
                    />
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-[#302F31] p-3">
                  <Typo
                    as="p"
                    className="font-semibold text-center"
                    color="white"
                    fontFamily="poppins"
                    fontVariant="p4"
                    fontWeight="regular"
                  >
                    {account.displayName}
                  </Typo>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
