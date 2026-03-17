'use client'
import { useState } from 'react'
import { toast } from 'sonner'

import Typo from '@/components/ui/Typo'
import Button from '@/components/ui/Button'
import { changeMemberRole } from '@/services/teamService'

type Role = 'Member' | 'Coach' | 'Capten' | 'Substitute'
interface Props {
  memberName: string
  ref?: React.Ref<HTMLDivElement>
  memberId: string
  teamId: string
  defaultRole?: Role
}
export default function ChangeRoleModal({
  memberName,
  ref,
  memberId,
  teamId,
  defaultRole = 'Member',
}: Props) {
  const [role, setRole] = useState<Role>(defaultRole)
  console.log(
    'ChangeRoleModal mounted with memberName:',
    memberName,
    'memberId:',
    memberId,
    'teamId:',
    teamId,
  )

  const handleRoleChange = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await changeMemberRole(teamId, memberId, role)
      console.log(`Role changed to ${role} for ${memberName}`)
      toast.success(`Role changed to ${role} for ${memberName}`)
    } catch (error) {
      console.error('Error changing role:', error)
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
    <div ref={ref} className="rounded-2xl p-5 bg-black flex flex-col gap-1">
      <Typo
        as="h1"
        className="text-xs sm:text-sm "
        color="white"
        fontFamily="poppins"
        fontVariant="h3"
        fontWeight="regular"
      >
        Member Role
      </Typo>
      <Typo className="text-white text-sm" fontFamily="poppins">
        Set the role for {memberName}
      </Typo>
      <form className="space-y-3" onSubmit={handleRoleChange}>
        <Option value="Member" />
        <Option value="Coach" />
        <Option value="Capten" />
        <Option value="Substitute" />
        <Button
          className="font-poppins w-full text-white"
          iconOrientation="left"
          label="Save"
          textClassName="sm:text-sm text-xs w-auto"
          type="submit"
          variant="contained-red"
        />
      </form>
    </div>
  )
}
