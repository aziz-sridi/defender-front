'use client'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

import Trash from '@/components/ui/Icons/Trash'
import Button from '@/components/ui/Button'
import { Switch } from '@/components/ui/switch'
import Typo from '@/components/ui/Typo'
import { archiveOrganization, updateOrganizationV2 } from '@/services/organizationService'
import type { Organization } from '@/types/organizationType'

interface SettingsProps {
  organization: Organization
}
let saveFn: (() => void) | null = null
export function settingsSave() {
  if (saveFn) {
    saveFn()
  }
}
let cancelFn: (() => void) | null = null
export function settingsCancel() {
  if (cancelFn) {
    cancelFn()
  }
}
export default function Settings({ organization }: SettingsProps) {
  const [isPublicOrganization, setIsPublicOrganization] = useState<boolean>(
    organization.public || false,
  )
  const [showSupporters, setShowSupporters] = useState(false)
  const [showEarnings, setShowEarnings] = useState(false)
  const [allowJoinRequests, setAllowJoinRequests] = useState<boolean>(false)
  const [showMembers, setShowMembers] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsPublicOrganization(organization.public || false)
    setAllowJoinRequests(false)
    setShowSupporters(false)
    setShowEarnings(false)
    setShowMembers(false)
  }, [organization])

  const onSaveChanges = async () => {
    const payload = {
      public: isPublicOrganization,
    }
    try {
      await updateOrganizationV2(organization._id, payload)
      toast.success('Organization settings updated successfully!')
    } catch (error) {
      toast.error('Failed to update organization settings. Please try again.')
    }
  }
  saveFn = onSaveChanges
  const onCancelChanges = () => {
    setIsPublicOrganization(organization.public || false)
    setAllowJoinRequests(false)
    setShowSupporters(false)
    setShowEarnings(false)
    setShowMembers(false)
  }
  cancelFn = onCancelChanges
  const deleteOrganization = async () => {
    try {
      await archiveOrganization(organization._id)
      setShowDeleteModal(false)
      toast.success('Organization deleted successfully!')
      router.push('/')
    } catch (error) {
      toast.error('Failed to delete organization. Please try again.')
    }
  }

  return (
    <div className="rounded-2xl flex gap-4 flex-col  p-10 relative">
      <div className="bg-[#212529] rounded-xl p-7 sm:p-10 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <Typo as="h1" className="text-lg" color="white" fontFamily="poppins" fontVariant="h3">
            Privacy & visibility
          </Typo>
          <Typo className="text-gray-500 text-sm md:text-[17px] mt-2" fontFamily="poppins">
            Control who can see your organization and its details.
          </Typo>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <Typo as="h4" className="text-lg" color="white" fontFamily="poppins" fontVariant="h4">
              Public Organization
            </Typo>
            <Typo className="text-gray-500 text-sm" fontFamily="poppins">
              Make your organization visible to everyone on the platform.
            </Typo>
          </div>
          <Switch checked={isPublicOrganization} onCheckedChange={setIsPublicOrganization} />
        </div>

        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <Typo as="h4" className="text-lg" color="white" fontFamily="poppins" fontVariant="h4">
              Show Supporters
            </Typo>
            <Typo className="text-gray-500 text-sm" fontFamily="poppins">
              Display your supporters members publicly
            </Typo>
          </div>
          <Switch checked={showSupporters} onCheckedChange={setShowSupporters} />
        </div>

        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <Typo as="h4" className="text-lg" color="white" fontFamily="poppins" fontVariant="h4">
              Show Earnings
            </Typo>
            <Typo className="text-gray-500 text-sm" fontFamily="poppins">
              Display your organization's tournament earnings publicly.
            </Typo>
          </div>
          <Switch checked={showEarnings} onCheckedChange={setShowEarnings} />
        </div>

        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <Typo as="h4" className="text-lg" color="white" fontFamily="poppins" fontVariant="h4">
              Allow Request to join
            </Typo>
            <Typo className="text-gray-500 text-sm" fontFamily="poppins">
              Let users request to join your organization.
            </Typo>
          </div>
          <Switch checked={allowJoinRequests} onCheckedChange={setAllowJoinRequests} />
        </div>

        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <Typo as="h4" className="text-lg" color="white" fontFamily="poppins" fontVariant="h4">
              Show members
            </Typo>
            <Typo className="text-gray-500 text-sm" fontFamily="poppins">
              Display your organization's members publicly
            </Typo>
          </div>
          <Switch checked={showMembers} onCheckedChange={setShowMembers} />
        </div>
      </div>

      <div className="bg-[#212529] rounded-xl p-7 sm:p-10 flex flex-col gap-4">
        <div className="flex flex-col">
          <Typo
            as="h1"
            className="text-[18px] md:text-lg text-red-700"
            color="white"
            fontFamily="poppins"
            fontVariant="h3"
          >
            Danger Zone
          </Typo>
          <Typo className="text-gray-500 text-sm md:text-[17px] mt-2" fontFamily="poppins">
            Irreversible actions for your organization.
          </Typo>
        </div>

        <div className="mt-4 p-5 bg-[#312f31] rounded-xl flex flex-col items-start gap-4 border border-defendrRed">
          <div className="flex flex-col">
            <Typo
              as="h4"
              className="text-lg text-defendrRed"
              color="white"
              fontFamily="poppins"
              fontVariant="h4"
            >
              Delete Organization
            </Typo>
            <Typo className="text-gray-500 text-sm" fontFamily="poppins">
              Permanently delete your organization and all associated data. This action cannot be
              undone.
            </Typo>
          </div>
          <Button
            className="font-poppins w-auto text-white"
            icon={<Trash className="w-6 h-6 text-white" />}
            iconOrientation="left"
            label="Delete Organization"
            textClassName="text-sm md:text-md"
            variant="contained-red"
            onClick={() => setShowDeleteModal(true)}
          />
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#212529] p-8 rounded-2xl w-full max-w-md flex flex-col gap-6">
            <Typo as="h2" className="text-xl text-white" fontFamily="poppins" fontVariant="h3">
              Confirm Deletion
            </Typo>
            <Typo className="text-gray-400" fontFamily="poppins">
              Are you sure you want to delete this organization? This action cannot be undone.
            </Typo>
            <div className="flex justify-end gap-4">
              <Button
                className="w-auto font-poppins"
                label="Cancel"
                variant="contained-dark"
                onClick={() => setShowDeleteModal(false)}
              />
              <Button
                className="w-auto font-poppins"
                label="Delete"
                variant="contained-red"
                onClick={deleteOrganization}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
