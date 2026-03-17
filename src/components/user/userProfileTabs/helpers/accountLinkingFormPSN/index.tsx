'use client'

import React, { useState } from 'react'
import { toast } from 'sonner'

import Typo from '@/components/ui/Typo'
import Button from '@/components/ui/Button'

interface Account {
  id: string
  name: string
  displayName: string
  bgColor: string
  image: string
}

interface AccountLinkingFormProps {
  account: Account
  onBack: () => void
  onClose: () => void
  onSuccess: (data: any) => void
}

export default function AccountLinkingForm({
  account,
  onBack,
  onClose,
  onSuccess,
}: AccountLinkingFormProps): React.JSX.Element {
  const [formData, setFormData] = useState<any>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
  }

  const handleConnect = async () => {
    const isValid = validateForm(account.id, formData)
    if (!isValid) {
      return
    }

    setIsLoading(true)
    try {
      // Here you would call your API to link the account
      // await linkAccount(account.id, formData)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      onSuccess(formData)
    } catch (error) {
      toast.error('Failed to connect account. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const validateForm = (platform: string, data: any): boolean => {
    switch (platform) {
      case 'psn':
        if (!data.nickname || !data.confirmNickname) {
          toast.error('Please fill in all fields')
          return false
        }
        if (data.nickname !== data.confirmNickname) {
          toast.error('Nicknames do not match')
          return false
        }
        return true

      case 'xbox':
        if (!data.gamertag || !data.confirmGamertag) {
          toast.error('Please fill in all fields')
          return false
        }
        if (data.gamertag !== data.confirmGamertag) {
          toast.error('Gamertags do not match')
          return false
        }
        return true

      case 'battlenet':
        if (!data.battletag || !data.confirmBattletag) {
          toast.error('Please fill in all fields')
          return false
        }
        if (data.battletag !== data.confirmBattletag) {
          toast.error('BattleTags do not match')
          return false
        }
        return true

      case 'riot':
        if (!data.riotId || !data.tagline) {
          toast.error('Please fill in all fields')
          return false
        }
        return true

      case 'discord':
        if (!data.discordUsername || !data.confirmDiscordUsername) {
          toast.error('Please fill in all fields')
          return false
        }
        if (data.discordUsername !== data.confirmDiscordUsername) {
          toast.error('Discord usernames do not match')
          return false
        }
        return true

      default:
        return true
    }
  }

  const renderPlatformForm = () => {
    switch (account.id) {
      case 'psn':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-white mb-2 font-semibold font-poppins">
                PSN Nickname
              </label>
              <input
                className="w-full p-3 bg-[#302F31] text-white rounded-lg border border-gray-600 focus:border-defendrRed focus:outline-none"
                placeholder="Enter your PSN nickname"
                type="text"
                value={formData.nickname || ''}
                onChange={e => handleInputChange('nickname', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-white mb-2 font-semibold font-poppins">
                Confirm PSN Nickname
              </label>
              <input
                className="w-full p-3 bg-[#302F31] text-white rounded-lg border border-gray-600 focus:border-defendrRed focus:outline-none"
                placeholder="Confirm your PSN nickname"
                type="text"
                value={formData.confirmNickname || ''}
                onChange={e => handleInputChange('confirmNickname', e.target.value)}
              />
            </div>
          </div>
        )

      case 'xbox':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-white mb-2 font-semibold font-poppins">
                Xbox Gamertag
              </label>
              <input
                className="w-full p-3 bg-[#302F31] text-white rounded-lg border border-gray-600 focus:border-defendrRed focus:outline-none"
                placeholder="Enter your Xbox Gamertag"
                type="text"
                value={formData.gamertag || ''}
                onChange={e => handleInputChange('gamertag', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-white mb-2 font-semibold font-poppins">
                Confirm Gamertag
              </label>
              <input
                className="w-full p-3 bg-[#302F31] text-white rounded-lg border border-gray-600 focus:border-defendrRed focus:outline-none"
                placeholder="Confirm your Xbox Gamertag"
                type="text"
                value={formData.confirmGamertag || ''}
                onChange={e => handleInputChange('confirmGamertag', e.target.value)}
              />
            </div>
          </div>
        )

      case 'battlenet':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-white mb-2 font-semibold font-poppins">BattleTag</label>
              <input
                className="w-full p-3 bg-[#302F31] text-white rounded-lg border border-gray-600 focus:border-defendrRed focus:outline-none"
                placeholder="Enter your BattleTag (e.g., Player#1234)"
                type="text"
                value={formData.battletag || ''}
                onChange={e => handleInputChange('battletag', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-white mb-2 font-semibold font-poppins">
                Confirm BattleTag
              </label>
              <input
                className="w-full p-3 bg-[#302F31] text-white rounded-lg border border-gray-600 focus:border-defendrRed focus:outline-none"
                placeholder="Confirm your BattleTag"
                type="text"
                value={formData.confirmBattletag || ''}
                onChange={e => handleInputChange('confirmBattletag', e.target.value)}
              />
            </div>
          </div>
        )

      case 'riot':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-white mb-2 font-semibold font-poppins">Riot ID</label>
              <input
                className="w-full p-3 bg-[#302F31] text-white rounded-lg border border-gray-600 focus:border-defendrRed focus:outline-none"
                placeholder="Enter your Riot ID"
                type="text"
                value={formData.riotId || ''}
                onChange={e => handleInputChange('riotId', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-white mb-2 font-semibold">Tagline</label>
              <input
                className="w-full p-3 bg-[#302F31] text-white rounded-lg border border-gray-600 focus:border-defendrRed focus:outline-none"
                placeholder="Enter your tagline (e.g., #NA1)"
                type="text"
                value={formData.tagline || ''}
                onChange={e => handleInputChange('tagline', e.target.value)}
              />
            </div>
          </div>
        )

      case 'discord':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-white mb-2 font-semibold font-poppins">
                Discord Username
              </label>
              <input
                className="w-full p-3 bg-[#302F31] text-white rounded-lg border border-gray-600 focus:border-defendrRed focus:outline-none"
                placeholder="Enter your Discord username"
                type="text"
                value={formData.discordUsername || ''}
                onChange={e => handleInputChange('discordUsername', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-white mb-2 font-semibold font-poppins">
                Confirm Discord Username
              </label>
              <input
                className="w-full p-3 bg-[#302F31] text-white rounded-lg border border-gray-600 focus:border-defendrRed focus:outline-none"
                placeholder="Confirm your Discord username"
                type="text"
                value={formData.confirmDiscordUsername || ''}
                onChange={e => handleInputChange('confirmDiscordUsername', e.target.value)}
              />
            </div>
          </div>
        )

      default:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-white mb-2 font-semibold font-poppins">Username</label>
              <input
                className="w-full p-3 bg-[#302F31] text-white rounded-lg border border-gray-600 focus:border-defendrRed focus:outline-none"
                placeholder={`Enter your ${account.displayName} username`}
                type="text"
                value={formData.username || ''}
                onChange={e => handleInputChange('username', e.target.value)}
              />
            </div>
          </div>
        )
    }
  }

  const getInstructionText = () => {
    switch (account.id) {
      case 'psn':
        return "Please make sure that your main PSN account is connected. You will not be able to change this account since it's linked."
      case 'xbox':
        return "Please make sure that your main Xbox account is connected. You will not be able to change this account since it's linked."
      case 'battlenet':
        return "Please make sure that your main Battle.net account is connected. You will not be able to change this account since it's linked."
      case 'riot':
        return "Please make sure that your main Riot Games account is connected. You will not be able to change this account since it's linked."
      case 'discord':
        return "Please make sure that your main Discord account is connected. You will not be able to change this account since it's linked."
      default:
        return "Please make sure that your main account is connected. You will not be able to change this account since it's linked."
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-[#212529] rounded-lg p-8 relative max-h-[90vh] w-[80vw] max-w-2xl flex flex-col">
        <Button
          className="absolute top-1 right-1 w-1 h-1 text-white hover:text-defendrRed text-xl"
          label="✕"
          variant="contained-black"
          onClick={onClose}
        />

        <div className="flex-shrink-0 mb-6">
          <Button className="mb-4" label="← Back" variant="contained-black" onClick={onBack} />

          <div className="text-center">
            <Typo
              as="h1"
              className="font-bold mb-2"
              color="white"
              fontFamily="poppins"
              fontVariant="h2"
            >
              Account linking
            </Typo>
            <Typo
              as="p"
              className="text-gray-400"
              color="white"
              fontFamily="poppins"
              fontVariant="p3"
            >
              Connect your {account.displayName} account
            </Typo>
          </div>
        </div>

        <div className="flex-1">
          {renderPlatformForm()}

          <div className="space-y-3 mt-6">
            <Typo as="p" className="text-sm" color="white" fontVariant="p4">
              {getInstructionText()}
            </Typo>
            <Typo as="p" className="text-sm text-gray-400" color="white" fontVariant="p4">
              Contact support for any change requests.
            </Typo>
          </div>
        </div>

        <div className="flex-shrink-0 pt-6">
          <Button
            className="w-full"
            disabled={isLoading}
            label={isLoading ? 'CONNECTING...' : `CONNECT ${account.displayName.toUpperCase()}`}
            variant="contained-red"
            onClick={handleConnect}
          />
        </div>
      </div>
    </div>
  )
}
