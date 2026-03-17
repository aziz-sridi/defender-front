'use client'
import { Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

import ConfirmationModal from '@/components/team/popups/ConfirmationModal'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Inputs'
import { Switch } from '@/components/ui/switch'
import Typo from '@/components/ui/Typo'
import { archiveTeam, transferOwnership, updateTeam } from '@/services/teamService'

interface MembersSectionProps {
  team: any
}

export default function Settings({ team }: MembersSectionProps) {
  const router = useRouter()
  const { data: session } = useSession()

  const [isPublicTeam, setIsPublicTeam] = useState<boolean>(team.isTeamPublic || false)
  const [allowJoinRequests, setAllowJoinRequests] = useState<boolean>(
    team.isJoinRequestsAllowed || false,
  )
  const [teamNotifications, setTeamNotifications] = useState<boolean>(
    team.isTeamNotificationEnabled || false,
  )

  const [search, setSearch] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredUsers, setFilteredUsers] = useState<any[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string>('')

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showTransferModal, setShowTransferModal] = useState(false)

  useEffect(() => {
    setIsPublicTeam(team.isTeamPublic || false)
    setAllowJoinRequests(team.isJoinRequestsAllowed || false)
    setTeamNotifications(team.isTeamNotificationEnabled || false)
  }, [team])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  useEffect(() => {
    const filtered =
      team?.teamroster
        ?.filter((member: any) => member.user?._id !== team.teamowner?.user?._id) // exclude current owner
        ?.filter((member: any) =>
          (member.user?.nickname || member.user?.fullname || '')
            .toLowerCase()
            .includes(search.toLowerCase()),
        )
        .map((m: any) => m.user) || []

    setFilteredUsers(filtered)
  }, [search, team])

  const onCancelChanges = () => {
    setIsPublicTeam(team.isTeamPublic || false)
    setAllowJoinRequests(team.isJoinRequestsAllowed || false)
    setTeamNotifications(team.isTeamNotificationEnabled || false)
  }

  const onSaveChanges = async () => {
    const formdata = new FormData()
    formdata.append('isTeamPublic', String(isPublicTeam))
    formdata.append('isJoinRequestsAllowed', String(allowJoinRequests))
    formdata.append('isTeamNotificationEnabled', String(teamNotifications))
    try {
      await updateTeam(team._id, formdata)
      toast.success('Team settings updated successfully!')
    } catch (error) {
      toast.error('Failed to update team settings. Please try again.')
    }
  }

  const deleteTeam = async () => {
    try {
      await archiveTeam(team._id)
      toast.success('Team deleted successfully!')
      setShowDeleteModal(false)

      // Redirect to user's teams section in profile
      if (session?.user?._id) {
        router.push(`/user/${session.user._id}/profile?tab=Teams`)
      } else {
        router.push('/profile?tab=Teams')
      }
    } catch (error) {
      toast.error('Failed to delete team. Please try again.')
    }
  }

  const transferOwner = async () => {
    if (!selectedUserId) {
      toast.warning('Please select a user to transfer ownership to.')
      return
    }
    try {
      await transferOwnership(team._id, selectedUserId)
      toast.success('Team ownership transferred successfully!')
      setShowTransferModal(false)
    } catch (error) {
      toast.warning('Failed to transfer team ownership. Please try again.')
    }
  }

  const handleSelectUser = (user: any) => {
    setSelectedUserId(user._id)
    setSearch(user.nickname || user.fullname || 'Unknown User')
    setShowSuggestions(false)
  }

  return (
    <div className="bg-[#212529] rounded-xl mx-auto p-7 sm:p-10 flex flex-col gap-4 max-w-7xl">
      <div className="sm:flex gap-4 absolute right-10 top-36">
        <Button
          className="font-poppins hidden w-auto pb-10 sm:block"
          label="cancel"
          variant="contained-black"
          onClick={onCancelChanges}
        />
        <Button
          className="font-poppins w-auto hidden pb-10 sm:block"
          label="save changes"
          variant="contained-red"
          onClick={onSaveChanges}
        />
      </div>

      <div className="flex flex-col gap-1 mt-10">
        <Typo as="h1" className="text-lg" color="white" fontFamily="poppins" fontVariant="h3">
          Privacy & visibility
        </Typo>
        <Typo className="text-gray-500 text-sm md:text-[17px] mt-2" fontFamily="poppins">
          Control who can see your organization and its details
        </Typo>
      </div>

      <div className="flex justify-between">
        <div className="flex flex-col gap-1">
          <Typo as="h4" className="text-lg" color="white" fontFamily="poppins" fontVariant="h4">
            Public team
          </Typo>
          <Typo className="text-gray-500 text-sm md:text-[17px] mt-2" fontFamily="poppins">
            Allow your team profile to be visible to everyone
          </Typo>
        </div>
        <Switch checked={isPublicTeam} onCheckedChange={setIsPublicTeam} />
      </div>

      <div className="flex justify-between">
        <div className="flex flex-col gap-1">
          <Typo as="h4" className="text-lg" color="white" fontFamily="poppins" fontVariant="h4">
            Allow Request to join
          </Typo>
          <Typo className="text-gray-500 text-sm md:text-[17px] mt-2" fontFamily="poppins">
            Let users request to join your team.
          </Typo>
        </div>
        <Switch checked={allowJoinRequests} onCheckedChange={setAllowJoinRequests} />
      </div>

      <div className="flex justify-between">
        <div className="flex flex-col gap-1">
          <Typo as="h4" className="text-lg" color="white" fontFamily="poppins" fontVariant="h4">
            Team notification
          </Typo>
          <Typo className="text-gray-500 text-sm md:text-[17px] mt-2" fontFamily="poppins">
            Send notifications to all team members for important events
          </Typo>
        </div>
        <Switch checked={teamNotifications} onCheckedChange={setTeamNotifications} />
      </div>

      <div className="mt-5 border border-red-700 rounded-2xl gap-4 p-7 md:p-10 flex flex-col">
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
            These actions cannot be undone. Please be certain.
          </Typo>
        </div>

        <div ref={containerRef} className="relative mt-4">
          <Input
            className="w-full bg-[#312f31] border-0 rounded-full p-3 text-white font-poppins"
            placeholder="Type a name to transfer ownership..."
            value={search}
            onChange={value => {
              setSearch(value)
              setShowSuggestions(true)
            }}
          />
          {showSuggestions && filteredUsers.length > 0 && (
            <ul className="absolute w-full bg-[#312f31] mt-1 rounded-xl shadow-lg max-h-40 overflow-y-auto z-10">
              {filteredUsers.map(user => (
                <li
                  key={user._id}
                  className="px-4 py-2 hover:bg-[#444] cursor-pointer text-white font-poppins"
                  onClick={() => handleSelectUser(user)}
                >
                  {user.nickname || user.fullname || 'Unknown User'}
                </li>
              ))}
            </ul>
          )}
        </div>

        <Button
          className="font-poppins w-full mt-4"
          label="Transfer Team Ownership"
          textClassName="text-sm md:text-md text-red-700"
          variant="outlined-red"
          onClick={() => setShowTransferModal(true)}
        />

        <Button
          className="font-poppins w-full text-white mt-2"
          icon={<Trash2 className="w-4 h-4 text-white" />}
          iconOrientation="left"
          label="Delete Team"
          textClassName="text-sm md:text-md"
          variant="contained-red"
          onClick={() => setShowDeleteModal(true)}
        />
      </div>
      <div className="flex gap-4 mt-10 justify-center items-center sm:hidden pb-10">
        <Button
          className="font-poppins w-auto"
          label="cancel"
          variant="contained-dark"
          onClick={onCancelChanges}
        />
        <Button
          className="font-poppins w-auto"
          label="save changes"
          variant="contained-red"
          onClick={onSaveChanges}
        />
      </div>

      {showDeleteModal && (
        <ConfirmationModal
          isOpen={showDeleteModal}
          message="Are you sure you want to delete this team? This action cannot be undone."
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={deleteTeam}
        />
      )}

      {showTransferModal && (
        <ConfirmationModal
          disabled={!selectedUserId}
          isOpen={showTransferModal}
          message={`Are you sure you want to transfer ownership to ${search}? This action is irreversible.`}
          onCancel={() => setShowTransferModal(false)}
          onConfirm={transferOwner}
        />
      )}
    </div>
  )
}
