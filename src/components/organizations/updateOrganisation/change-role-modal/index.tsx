'use client'
import { useState, forwardRef } from 'react'
import { toast } from 'sonner'

import Button from '@/components/ui/Button'
import Typo from '@/components/ui/Typo'
import { updateStaffMember } from '@/services/organizationService'
import type { OrganizationRole } from '@/types/organizationType'

type Role = Exclude<OrganizationRole, 'Founder'>

interface Props {
  memberName: string
  memberId: string
  organizationId: string
  defaultRole?: Role
  onClose: () => void
}

const ChangeRoleModal = forwardRef<HTMLDivElement, Props>(
  ({ memberName, memberId, organizationId, defaultRole = 'Admin', onClose }, ref) => {
    const [role, setRole] = useState<Role>(defaultRole)

    const handleRoleChange = async (e: React.FormEvent) => {
      e.preventDefault()
      try {
        await updateStaffMember(organizationId, memberId, role)
        toast.success(`Role changed to ${role} for ${memberName}`)
        onClose()
      } catch (error) {
        toast.error('Failed to change role. Please try again.')
      }
    }

    const Option = ({ value }: { value: Role }) => (
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          checked={role === value}
          className="accent-pink-500"
          name="role"
          type="radio"
          value={value}
          onChange={() => setRole(value)}
        />
        <span>{value}</span>
      </label>
    )

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
        <div
          ref={ref}
          className="bg-defendrBg rounded-xl p-6 sm:p-8 w-full max-w-md mx-4 flex flex-col gap-6"
        >
          <Typo
            as="h1"
            className="text-lg sm:text-2xl"
            color="white"
            fontFamily="poppins"
            fontVariant="h3"
            fontWeight="regular"
          >
            Change Member Role
          </Typo>
          <Typo className="text-white text-sm" fontFamily="poppins">
            Set the role for {memberName}
          </Typo>
          <form className="space-y-4" onSubmit={handleRoleChange}>
            <Option value="Admin" />
            <Option value="Bracket Manager" />
            <div className="flex justify-end gap-4 mt-4">
              <Button
                className="w-auto btn-defendr-grey"
                label="Cancel"
                size="s"
                textClassName="sm:text-sm text-xs"
                variant="outlined-grey"
                onClick={onClose}
              />
              <Button
                className="w-auto btn-defendr-red"
                label="Save"
                size="s"
                textClassName="sm:text-sm text-xs"
                type="submit"
                variant="contained-red"
              />
            </div>
          </form>
        </div>
      </div>
    )
  },
)

ChangeRoleModal.displayName = 'ChangeRoleModal'

export default ChangeRoleModal
