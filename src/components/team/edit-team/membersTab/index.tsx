'use client'
//import { formatDistanceToNow, subDays } from 'date-fns'
import { CircleX, Eye, Trash, UserPlus, UserRoundPlus } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { userImageSanitizer } from '@/utils/imageUrlSanitizer'

import AddMemberModal from '@/components/team/popups/addMemberModal'
import ChangeRoleModal from '@/components/team/popups/change-role-modal'
import Typo from '@/components/ui/Typo'
import Button from '@/components/ui/Button'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import {
  acceptTeamRequest,
  inviteToTeam,
  declineTeamRequest,
  removePlayerFromTeam,
  removeInvitation,
} from '@/services/teamService'

interface MembersSectionProps {
  team: any
  teamId: string
}
export default function MembersTab({ team, teamId }: MembersSectionProps) {
  const [showAddMemberModal, setShowAddMemberModal] = useState(false)
  const [teamData, setTeamData] = useState()
  const [openRoleModalIdx, setOpenRoleModalIdx] = useState<number | null>(null)
  const [members, setMembers] = useState<any[]>([])
  const [owner, setOwner] = useState<any | null>(null)
  const [invitations, setInvitations] = useState<any[]>([])
  const [requests, setRequests] = useState<any[]>([])
  const [newMember, setNewMember] = useState({ name: '', userId: '', role: 'Member', message: '' })
  const modalRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    //console.log('team from memebers tab', team)
    if (team) {
      setTeamData(team)
      setMembers(team.teamroster)
      setOwner(team.teamowner)
      setInvitations(team.invitations)
      setRequests(team.requests)
      console.log(members)
    }
  }, [team])

  const handleAddMember = () => {
    setShowAddMemberModal(true)
  }
  const handleChangeRole = (idx: number) => {
    setOpenRoleModalIdx(idx)
  }
  const handleCloseRoleModal = () => {
    setOpenRoleModalIdx(null)
  }
  const saveNewMember = async () => {
    if (newMember.name.trim() !== '') {
      try {
        console.log('invited member', team._id, newMember.userId, newMember.role, newMember.message)
        const response = await inviteToTeam(team._id, newMember.userId, newMember.message)
        console.log('response from invite', response)
        toast.success('member invited succefully')
        setNewMember({ name: '', userId: '', role: 'Member', message: '' })
        setShowAddMemberModal(false)
      } catch (error) {
        toast.error('error inviting member')
        console.error('error handling request', error)
      }
    }
  }
  useEffect(() => {
    if (openRoleModalIdx === null) {
      return
    }
    const handleClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setOpenRoleModalIdx(null)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [openRoleModalIdx])
  const onCancelChanges = () => {
    console.log('Cancel changes clicked')
  }
  const acceptRequest = async (id: string) => {
    try {
      const response = await acceptTeamRequest(teamId, id)
      console.log('request accepted ', response)
      toast.success('request accepted')
      setRequests(prevRequests => prevRequests.filter(request => request?.user?._id !== id))
    } catch (error) {
      console.error('error handling request', error)
      toast.error('please try again')
    }
  }
  const declineRequest = async (id: string) => {
    try {
      const response = await declineTeamRequest(teamId, id)
      console.log('request declined ', response)
      toast.success('request declined')
      console.log('request declined successfully')
      setRequests(prevRequests => prevRequests.filter(request => request?.user?._id !== id))
    } catch (error) {
      console.error('error handling request', error)
      toast.error('please try again')
    }
  }
  const removePlayer = async (id: string) => {
    try {
      const response = await removePlayerFromTeam(teamId, id)
      console.log('player removed ', response)
      toast.success('player removed successfully')
      setMembers(prevMembers => prevMembers.filter(member => member?.user?._id !== id))
    } catch (error) {
      toast.error('error removing player')
    }
  }
  const deleteInvitation = async (id: string) => {
    try {
      const response = await removeInvitation(teamId, id)
      console.log('invitation deleted ', response)
      toast.success('invitation deleted successfully')
      setInvitations(prevInvitations => prevInvitations.filter(invitation => invitation._id !== id))
    } catch (error) {
      toast.error('error deleting invitation')
    }
  }
  const viewProfile = (memberId: string) => {
    console.log('View profile:', memberId)
    window.location.href = `/user/${memberId}/profile`
  }
  return (
    <div className="flex flex-col gap-10">
      <div className="bg-[#212529] rounded-2xl flex flex-col p-10 mb-7">
        <div className="flex justify-between mb-4">
          <div className="flex flex-col gap-1">
            <Typo
              as="h1"
              className="text-sm sm:text-sm md:text-lg xl:text-xl"
              color="white"
              fontFamily="poppins"
              fontVariant="h3"
              fontWeight="regular"
            >
              Edit team
            </Typo>
            <Typo
              className="text-gray-500 text-sm md:text-[17px] mt-2 md:mt-0"
              fontFamily="poppins"
            >
              Manage your team's members and their roles
            </Typo>
          </div>
          <div>
            <Button
              className="font-poppins w-auto text-gray-300"
              icon={<UserPlus className="w-4 h-4 text-white" />}
              iconOrientation="left"
              label="Add member"
              textClassName="sm:text-sm text-xs"
              variant="contained-red"
              onClick={handleAddMember}
            />
          </div>
        </div>
        <div className="overflow-x-auto rounded-2xl max-w-full">
          <Table className="!py-10 rounded-xl min-w-[600px]">
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Typo as="p" color="ghostGrey" fontVariant="p4">
                    Member
                  </Typo>
                </TableHead>
                <TableHead className="text-gray-400">
                  <Typo as="p" color="ghostGrey" fontVariant="p4">
                    Role
                  </Typo>
                </TableHead>
                <TableHead className="text-gray-400">
                  <Typo as="p" color="ghostGrey" fontVariant="p4">
                    Joined
                  </Typo>
                </TableHead>
                <TableHead className="text-gray-400">
                  <Typo as="p" color="ghostGrey" fontVariant="p4">
                    Action
                  </Typo>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {/* <div className="w-10 h-10 rounded-full bg-gray-400" /> */}
                      <img
                        className="rounded-full w-10 h-10"
                        src={userImageSanitizer(
                          member?.user?.profileImage || '',
                          '/assets/images/default-user-icon.jpg',
                        )}
                        alt={member?.user?.nickname || 'User'}
                      />
                      <Typo
                        as="p"
                        className="text-xs md:text-[15px]"
                        color="white"
                        fontVariant="p4"
                      >
                        {member?.user?.nickname || 'Unknown User'}
                      </Typo>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Typo className="border border-pink-500 text-gray-300 rounded-xl px-3 py-1 text-xs">
                      {member?.role || 'Member'}
                    </Typo>
                  </TableCell>
                  <TableCell className="text-gray-300">
                    <Typo as="p" className="text-xs md:text-sm" color="white">
                      {new Date(member?.joinedAt || new Date()).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </Typo>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 relative">
                      <Button
                        className="font-poppins w-auto text-gray-300"
                        label="Change role"
                        textClassName="sm:text-sm text-xs"
                        variant="contained-dark"
                        onClick={() => handleChangeRole(idx)}
                      />
                      <Button
                        className="font-poppins w-auto"
                        label="Remove"
                        textClassName="sm:text-sm text-xs text-red-700"
                        variant="outlined-red"
                        onClick={() => removePlayer(member?.user?._id || '')}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      {openRoleModalIdx !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          onClick={handleCloseRoleModal}
        >
          <div onClick={e => e.stopPropagation()}>
            <ChangeRoleModal
              ref={modalRef}
              memberId={members[openRoleModalIdx]?.user?._id || ''}
              memberName={members[openRoleModalIdx]?.user?.nickname || 'Unknown User'}
              teamId={team._id}
            />
          </div>
        </div>
      )}
      <div className="bg-[#212529] p-10 rounded-2xl">
        <div className="flex mb-4 flex-col gap-1">
          <Typo
            as="h1"
            className="text-sm sm:text-sm md:text-lg xl:text-xl"
            color="white"
            fontFamily="poppins"
            fontVariant="h3"
            fontWeight="regular"
          >
            Requests
          </Typo>
          <Typo className="text-gray-500 text-sm mt-2 md:text-[17px] md:mt-0" fontFamily="poppins">
            see who sent a request to join your team
          </Typo>
        </div>
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 rounded-xl max-w-full">
          <Table className="bg-[#212529] !py-10 rounded-xl min-w-[600px]">
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-400">
                  <Typo as="p" color="ghostGrey" fontVariant="p4">
                    Username
                  </Typo>
                </TableHead>
                <TableHead className="text-gray-400">
                  <Typo as="p" color="ghostGrey" fontVariant="p4">
                    Sent
                  </Typo>
                </TableHead>
                <TableHead className="text-gray-400">
                  <Typo as="p" color="ghostGrey" fontVariant="p4">
                    Actions
                  </Typo>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.length === 0 && (
                <TableRow>
                  <TableCell className="text-center text-gray-400 py-4" colSpan={4}>
                    <Typo as="p" className="text-sm" fontFamily="poppins">
                      No requests found
                    </Typo>
                  </TableCell>
                </TableRow>
              )}
              {requests.map((request: any, idx: number) => (
                <TableRow key={idx}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        alt={request?.user?.nickname || 'User'}
                        className="w-10 h-10 rounded-full"
                        src={userImageSanitizer(
                          request?.user?.profileImage || '',
                          '/assets/images/default-user-icon.jpg',
                        )}
                      />
                    </div>
                    <Typo as="p" className="text-xs md:text-[15px]" color="white" fontVariant="p4">
                      {request?.user?.nickname || 'Unknown User'}
                    </Typo>
                  </TableCell>
                  <TableCell className="text-gray-300">
                    <Typo as="p" className="text-xs md:text-sm" color="white">
                      {new Date(request.sentAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </Typo>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        className="font-poppins w-auto text-gray-300"
                        icon={<UserRoundPlus className="w-4 h-4 text-white" />}
                        iconOrientation="left"
                        label="accept"
                        textClassName="sm:text-sm text-xs"
                        variant="contained-dark"
                        onClick={() => acceptRequest(request?.user?._id || '')}
                      />
                      <Button
                        className="w-auto font-poppins"
                        icon={<CircleX className="w-4 h-4 text-red-700" />}
                        iconOrientation="left"
                        label="decline"
                        textClassName="sm:text-sm text-xs text-red-700"
                        variant="outlined-red"
                        onClick={() => declineRequest(request?.user?._id || '')}
                      />
                      <Button
                        className="w-auto font-poppins"
                        icon={<Eye className="w-4 h-4" />}
                        iconOrientation="left"
                        label="view profile"
                        textClassName="sm:text-sm text-xs text-white"
                        variant="contained-dark"
                        onClick={() => viewProfile(request?.user?._id || '')}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="bg-[#212529] p-10 rounded-2xl">
        <div className="flex mb-4 flex-col gap-1">
          <Typo
            as="h1"
            className="text-sm sm:text-sm md:text-lg xl:text-xl"
            color="white"
            fontFamily="poppins"
            fontVariant="h3"
            fontWeight="regular"
          >
            Invitations
          </Typo>
          <Typo className="text-gray-500 text-sm mt-2 md:mt-0 md:text-[17px]" fontFamily="poppins">
            see the invitation you sent
          </Typo>
        </div>
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 rounded-xl max-w-full">
          <Table className="bg-[#212529] !py-10 rounded-xl min-w-[600px]">
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-400">
                  <Typo as="p" color="ghostGrey" fontVariant="p4">
                    Username
                  </Typo>
                </TableHead>
                <TableHead className="text-gray-400">
                  <Typo as="p" color="ghostGrey" fontVariant="p4">
                    Sent
                  </Typo>
                </TableHead>
                <TableHead className="text-gray-400">
                  <Typo as="p" color="ghostGrey" fontVariant="p4">
                    status
                  </Typo>
                </TableHead>
                <TableHead className="text-gray-400">
                  <Typo as="p" color="ghostGrey" fontVariant="p4">
                    Actions
                  </Typo>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invitations.length === 0 && (
                <TableRow>
                  <TableCell className="text-center text-gray-400 py-4" colSpan={4}>
                    No invitations found
                  </TableCell>
                </TableRow>
              )}
              {invitations.map((invitation: any, idx: number) => (
                <TableRow key={idx}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        alt={invitation?.user?.nickname || 'User'}
                        className="w-10 h-10 rounded-full"
                        src={userImageSanitizer(
                          invitation?.user?.profileImage || '',
                          '/assets/images/default-user-icon.jpg',
                        )}
                      />

                      <Typo
                        as="p"
                        className="text-xs md:text-[15px]"
                        color="white"
                        fontVariant="p4"
                      >
                        {invitation?.user?.nickname || 'Unknown User'}
                      </Typo>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-300">
                    <Typo as="p" className="text-xs md:text-sm" color="white">
                      {new Date(invitation.sentAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </Typo>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full border border-yellow-700 outline-yellow-600 text-yellow-700 ">
                        <Typo as="p" className="text-xs md:text-sm" color="yellow" fontVariant="p4">
                          {invitation.status}
                        </Typo>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        className="font-poppins"
                        icon={<Trash className="w-4 h-4 text-red-700" />}
                        iconOrientation="left"
                        label="cancel"
                        size="xxs"
                        textClassName="sm:text-sm text-xs text-red-700"
                        variant="outlined-red"
                        onClick={() => deleteInvitation(invitation._id)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      {showAddMemberModal && (
        <AddMemberModal
          newMember={newMember}
          setNewMember={setNewMember}
          onCancel={() => setShowAddMemberModal(false)}
          onSave={saveNewMember}
        />
      )}
    </div>
  )
}
