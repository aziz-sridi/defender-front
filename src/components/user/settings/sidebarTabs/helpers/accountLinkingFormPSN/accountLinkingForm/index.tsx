'use client'

import React, { useState } from 'react'
import { toast } from 'sonner'

import Typo from '@/components/ui/Typo'
import Button from '@/components/ui/Button'
import PlatformForm from '@/components/user/settings/sidebarTabs/helpers/accountLinkingFormPSN/PlatformForm'
import validateForm from '@/components/user/settings/sidebarTabs/helpers/accountLinkingFormPSN//validateForm'
import { getInstructionText } from '@/components/user/settings/sidebarTabs/helpers/accountLinkingFormPSN//instructions'

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
    if (!validateForm(account.id, formData)) {
      return
    }

    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      onSuccess(formData)
    } catch (error) {
      toast.error('Failed to connect account. Please try again.')
    } finally {
      setIsLoading(false)
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
          <PlatformForm
            displayName={account.displayName}
            formData={formData}
            platform={account.id}
            onInputChange={handleInputChange}
          />

          <div className="space-y-3 mt-6">
            <Typo as="p" className="text-sm" color="white" fontVariant="p4">
              {getInstructionText(account.id)}
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
