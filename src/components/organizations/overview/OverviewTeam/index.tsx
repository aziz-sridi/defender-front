'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

import Level from '@/components/LevelPlayer/Level'
import Typo from '@/components/ui/Typo'
import { updateStaffMember } from '@/services/organizationService'
import { getUserById } from '@/services/userService'

export default function Component({ organization = {} as any }) {
  const { data: session } = useSession()
  const [isNotNormalUser, setIsNotNormalUser] = useState(false)
  const [staffDetails, setStaffDetails] = useState<any[]>([])
  const [saving, setSaving] = useState(false)
  // Save role immediately on select change
  const handleRoleChange = async (staff: any, newRole: string) => {
    setSaving(true)
    try {
      await updateStaffMember(organization._id, staff.user?._id || staff.user, newRole)
      setStaffDetails(prev =>
        prev.map(s => {
          if ((s.user?._id || s.user) === (staff.user?._id || staff.user)) {
            return { ...s, role: newRole }
          }
          return s
        }),
      )
    } catch (e) {
      console.error('Failed to update staff role', e)
    }
    setSaving(false)
  }

  const fetchUserDetails = async (userId: string) => {
    try {
      const response = await getUserById(userId)
      return response?.data
    } catch (error) {
      console.error('Error fetching user details:', error)
      return null
    }
  }

  useEffect(() => {
    const fetchStaffDetails = async () => {
      const staffList = organization?.staff || []
      const staffDataPromises = staffList.map(async (staff: any) => {
        const userDetails = await fetchUserDetails(staff.user?._id || staff.user)
        return {
          ...staff,
          nickname: userDetails?.nickname ?? staff.user?.nickname ?? 'Unknown',
          avatar: userDetails?.avatar || '/assets/organization/default-user-icon.jpg',
        }
      })
      const resolvedStaffDetails = await Promise.all(staffDataPromises)
      setStaffDetails(resolvedStaffDetails)

      const currentUserId = (session as any)?.user?._id
      const Founder = (organization?.staff || []).some((s: any) => {
        const uid = typeof s.user === 'string' ? s.user : s.user?._id || s.user?.id
        return uid === currentUserId && s.role === 'Founder'
      })
      if (Founder) {
        setIsNotNormalUser(true)
      }
    }

    fetchStaffDetails()
  }, [organization?.staff, session])

  const roleBadge = (role?: string) => {
    const base = 'px-2 py-0.5 rounded-full text-xs font-medium'
    if (role === 'Founder') {
      return `${base} bg-rose-500/20 text-rose-300`
    }
    if (role === 'admin' || role === 'Admin') {
      return `${base} bg-indigo-500/20 text-indigo-300`
    }
    if (role?.toLowerCase?.() === 'Founder') {
      return `${base} bg-amber-500/20 text-amber-300`
    }
    return `${base} bg-zinc-700 text-zinc-300`
  }

  return (
    <div className="p-4 md:p-8 flex-1">
      {isNotNormalUser && (
        <div className="p-4 md:p-8">
          <Typo as="p" className="mb-2" color="white" fontVariant="p4">
            <Typo as="span" color="red" fontVariant="p4">
              Founder
            </Typo>{' '}
            created the organization and can edit anything about the organization. No one can change
            this role.
          </Typo>
          <Typo as="p" className="mb-2" color="white" fontVariant="p4">
            <Typo as="span" color="red" fontVariant="p4">
              Admins
            </Typo>{' '}
            can do everything the Founder can except delete the organization or remove other admins.
          </Typo>
          <Typo as="p" className="mb-2" color="white" fontVariant="p4">
            <Typo as="span" color="red" fontVariant="p4">
              Founders
            </Typo>{' '}
            can create and edit tournaments for the organization, but cannot make changes to the
            organization itself.
          </Typo>
          <Typo as="p" className="mb-2" color="white" fontVariant="p4">
            <Typo as="span" color="red" fontVariant="p4">
              Bracket Managers
            </Typo>{' '}
            can report and resolve disputes by changing scores in the organization's tournaments.
          </Typo>
        </div>
      )}

      <div className="p-4 md:p-8">
        <Typo as="h2" className="mb-1" color="white" fontVariant="h2">
          Team
        </Typo>
        <Typo as="p" className="mt-1" color="grey" fontVariant="p6">
          Organization roles and members
        </Typo>
      </div>

      {staffDetails.length === 0 ? (
        <div className="w-full h-40 flex items-center justify-center border-2 border-dashed border-zinc-700 rounded-xl text-zinc-500">
          <Typo as="p" color="grey" fontVariant="p4">
            No staff members yet
          </Typo>
        </div>
      ) : (
        <div className="p-2 md:p-8 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {staffDetails.map((staff, i) => (
            <div
              key={i}
              className="group  bg-zinc-900/60 ring-1 ring-white/10 hover:ring-white/20 transition rounded-xl p-3 md:p-4 flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
                <Level
                  image={staff.avatar || '/assets/organization/default-user-icon.jpg'}
                  levelColor="#D62755"
                  percentage={0}
                  svgWidthHeigth={48}
                />
                <div className="min-w-0">
                  <Typo as="p" className="truncate font-medium" color="white" fontVariant="p4">
                    {staff.nickname}
                  </Typo>
                  <Typo as="span" className={roleBadge(staff.role)} color="grey" fontVariant="p6">
                    {staff.role || 'Member'}
                  </Typo>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                {isNotNormalUser &&
                  (staff.role === 'Founder' ? (
                    <select
                      disabled
                      aria-label="Role"
                      className="rounded-lg px-2 py-1 bg-zinc-800 text-white border border-zinc-600 focus:border-defendrRed/60 outline-none"
                      value={staff.role}
                    >
                      <option value="Founder">Founder</option>
                    </select>
                  ) : (
                    <select
                      aria-label="Change role"
                      className="rounded-lg px-2 py-1 bg-zinc-800 text-white border border-zinc-600 focus:border-defendrRed/60 outline-none"
                      disabled={saving}
                      value={staff.role}
                      onChange={e => handleRoleChange(staff, e.target.value)}
                    >
                      <option value="Admin">Admin</option>
                      <option value="Bracket Manager">Bracket Manager</option>
                    </select>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
