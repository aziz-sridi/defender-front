'use client'
import { useState, useEffect, useRef } from 'react'
import { toast } from 'sonner'

import UserPlus from '@/components/ui/Icons/UserPlus'
import { getUserById } from '@/services/userService'
import { userImageSanitizer } from '@/utils/imageUrlSanitizer'
import AddMemberModal from '@/components/organizations/updateOrganisation/addMemberModal'
import ChangeRoleModal from '@/components/organizations/updateOrganisation/change-role-modal'
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
  inviteStaffMember,
  removeStaffMember,
  readStaffMembers,
} from '@/services/organizationService'

interface MembersSectionProps {
  organization: any
  organizationId: string
}
export default function MembersTab({ organization, organizationId }: MembersSectionProps) {
  const [showAddMemberModal, setShowAddMemberModal] = useState(false)
  const [openRoleModalIdx, setOpenRoleModalIdx] = useState<number | null>(null)
  const [members, setMembers] = useState<any[]>([])
  const [invitations, setInvitations] = useState<any[]>([])
  const [newMember, setNewMember] = useState({ name: '', userId: '', role: 'Admin', message: '' })
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (organization) {
      const enrichMembers = async () => {
        const rawStaff = organization.staff || []
        const enriched = await Promise.all(
          rawStaff.map(async (member: any) => {
            let userData = member.user
            // If user is just a string ID, fetch the full user object
            if (typeof userData === 'string') {
              try {
                userData = await getUserById(userData)
              } catch {
                userData = { _id: userData, nickname: 'Unknown' }
              }
            }
            return {
              ...member,
              user: userData || { _id: '', nickname: 'Unknown' },
            }
          }),
        )
        setMembers(enriched)
      }
      enrichMembers()
      if (organization.invitations) {
        fetchInvitations(organization.invitations)
      }
    }
  }, [organization])

  const fetchInvitations = async (rawInvitations: any[]) => {
    try {
      const enriched = await Promise.all(
        rawInvitations.map(async inv => {
          try {
            const userData = await getUserById(inv.user)
            return {
              ...inv,
              user: userData || { _id: inv.user, nickname: 'Unknown', profileImage: '' },
            }
          } catch {
            return { ...inv, user: { _id: inv.user, nickname: 'Unknown', profileImage: '' } }
          }
        }),
      )
      setInvitations(enriched)
    } catch {
      setInvitations([])
    }
  }

  const handleAddMember = () => setShowAddMemberModal(true)
  const handleChangeRole = (idx: number) => setOpenRoleModalIdx(idx)
  const handleCloseRoleModal = () => setOpenRoleModalIdx(null)

  const saveNewMember = async () => {
    if (newMember.name.trim() !== '') {
      try {
        await inviteStaffMember(organization._id, newMember.userId, newMember.role)
        toast.success('Member invited successfully')
        setNewMember({ name: '', userId: '', role: 'Admin', message: '' })
        setShowAddMemberModal(false)
      } catch {
        toast.error('Error inviting member')
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

  const removePlayer = async (id: string) => {
    try {
      await removeStaffMember(organizationId, id)
      toast.success('Member removed successfully')
      setMembers(prev => prev.filter(member => member.user?._id !== id))
    } catch {
      toast.error('Error removing member')
    }
  }

  const resendInvitation = async (invitation: any) => {
    try {
      await inviteStaffMember(organization._id, invitation.user._id, invitation.role || 'Admin')
      toast.success('Invitation resent successfully')
    } catch {
      toast.error('Failed to resend invitation')
    }
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
              Edit organization
            </Typo>
            <Typo
              className="text-gray-500 text-sm md:text-[17px] mt-2 md:mt-0"
              fontFamily="poppins"
            >
              Manage your organization's members and their roles
            </Typo>
          </div>
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

        <div className="overflow-x-auto rounded-2xl max-w-full">
          <Table className="!py-10 rounded-xl min-w-[600px] w-full">
            <TableHeader className="hidden sm:table-header-group">
              <TableRow>
                <TableHead>
                  <Typo as="p" color="ghostGrey" fontFamily="poppins" fontVariant="p4b">
                    Member
                  </Typo>
                </TableHead>
                <TableHead>
                  <Typo as="p" color="ghostGrey" fontFamily="poppins" fontVariant="p4b">
                    Role
                  </Typo>
                </TableHead>
                <TableHead>
                  <Typo as="p" color="ghostGrey" fontFamily="poppins" fontVariant="p4b">
                    Joined
                  </Typo>
                </TableHead>
                <TableHead>
                  <Typo as="p" color="ghostGrey" fontFamily="poppins" fontVariant="p4b">
                    Action
                  </Typo>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member, idx) => (
                <TableRow
                  key={idx}
                  className="flex flex-col sm:table-row border-b border-gray-700 sm:border-none"
                >
                  <TableCell className="flex items-center gap-3">
                    <img
                      src={userImageSanitizer(member.user?.profileImage || member.user?.avatar)}
                      alt={member.user?.nickname || 'Member'}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10 flex-shrink-0"
                      onError={e => {
                        const target = e.target as HTMLImageElement
                        target.src = userImageSanitizer('')
                      }}
                    />
                    <Typo
                      as="p"
                      className="text-xs md:text-[15px]"
                      color="white"
                      fontFamily="poppins"
                    >
                      {member.user?.nickname || 'Unknown'}
                    </Typo>
                  </TableCell>
                  <TableCell>
                    <Typo className="border border-pink-500 text-gray-300 rounded-xl px-3 py-1 text-xs">
                      {member.role}
                    </Typo>
                  </TableCell>
                  <TableCell>
                    <Typo as="p" className="text-xs md:text-sm" color="white" fontFamily="poppins">
                      {(() => {
                        const dateStr =
                          member.joinedAt || member.createdAt || member.dateJoined || member.addedAt
                        if (dateStr) {
                          const d = new Date(dateStr)
                          if (!isNaN(d.getTime())) {
                            return d.toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          }
                        }
                        return 'N/A'
                      })()}
                    </Typo>
                  </TableCell>
                  <TableCell>
                    {member.role === 'Founder' || member.role === 'Owner' ? (
                      <Typo
                        as="p"
                        className="text-xs md:text-sm text-gray-400"
                        fontFamily="poppins"
                      >
                        No actions available
                      </Typo>
                    ) : (
                      <div className="flex gap-4 relative flex-wrap">
                        <Button
                          className="font-poppins w-auto text-gray-300"
                          label="Change role"
                          textClassName="sm:text-sm text-xs"
                          variant="contained-red"
                          onClick={() => handleChangeRole(idx)}
                        />
                        {openRoleModalIdx === idx && (
                          <ChangeRoleModal
                            defaultRole={member.role}
                            memberId={member.user?._id}
                            memberName={member.user?.nickname || 'Unknown'}
                            organizationId={organization._id}
                            onClose={() => setOpenRoleModalIdx(null)}
                          />
                        )}

                        <Button
                          className="font-poppins w-auto"
                          label="Remove"
                          textClassName="sm:text-sm text-xs text-red-700"
                          variant="outlined-red"
                          onClick={() => removePlayer(member.user?._id || '')}
                        />
                      </div>
                    )}
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
          <Table className="bg-[#212529] !py-10 rounded-xl min-w-[600px] w-full">
            <TableHeader className="hidden sm:table-header-group">
              <TableRow>
                <TableHead>
                  <Typo as="p" color="ghostGrey" fontFamily="poppins" fontVariant="p4b">
                    Username
                  </Typo>
                </TableHead>
                <TableHead>
                  <Typo as="p" color="ghostGrey" fontFamily="poppins" fontVariant="p4b">
                    Sent
                  </Typo>
                </TableHead>
                <TableHead>
                  <Typo as="p" color="ghostGrey" fontFamily="poppins" fontVariant="p4b">
                    Status
                  </Typo>
                </TableHead>
                {/*<TableHead><Typo as="p" fontFamily='poppins' color="ghostGrey" fontVariant="p4b">Actions</Typo></TableHead>*/}
              </TableRow>
            </TableHeader>
            <TableBody>
              {invitations.length === 0 ? (
                <TableRow>
                  <TableCell className="text-center text-gray-400 py-8" colSpan={3}>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
                        <span className="text-gray-400 text-2xl">📧</span>
                      </div>
                      <Typo as="p" className="text-gray-400 font-poppins" fontVariant="p4">
                        No invitations yet
                      </Typo>
                      <Typo as="p" className="text-gray-500 font-poppins text-sm" fontVariant="p5">
                        Invite members to join your organization
                      </Typo>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                invitations.map((invitation: any, idx: number) => (
                  <TableRow
                    key={idx}
                    className="flex flex-col sm:table-row border-b border-gray-700 sm:border-none"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-400 overflow-hidden">
                          <img
                            alt={invitation.user?.nickname || 'User'}
                            className="w-full h-full object-cover rounded-full"
                            src={
                              invitation.user?.profileImage &&
                              invitation.user.profileImage !== 'PROFILE.jpeg'
                                ? invitation.user.profileImage
                                : '/noBg.png'
                            }
                          />
                        </div>
                        <Typo
                          as="p"
                          className="text-xs md:text-[15px]"
                          color="white"
                          fontFamily="poppins"
                          fontVariant="p4b"
                        >
                          {invitation.user?.nickname || 'Unknown User'}
                        </Typo>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Typo
                        as="p"
                        className="text-xs md:text-sm"
                        color="white"
                        fontFamily="poppins"
                      >
                        {invitation.sentAt
                          ? new Date(invitation.sentAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : 'N/A'}
                      </Typo>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full border border-yellow-700 text-yellow-700">
                          <Typo
                            as="p"
                            className="text-xs md:text-sm"
                            color="yellow"
                            fontFamily="poppins"
                            fontVariant="p4b"
                          >
                            {invitation.status || 'Pending'}
                          </Typo>
                        </div>
                      </div>
                    </TableCell>
                    {/* <TableCell>
                    <div className="flex gap-2">
                      <Button
                        className="font-poppins w-auto"
                        label="Resend"
                        textClassName="sm:text-sm text-xs"
                        variant="contained-dark"
                        onClick={() => resendInvitation(invitation)}
                      />
                    </div>
                  </TableCell>//it shows an error that's the user already invited*/}
                  </TableRow>
                ))
              )}
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
