'use client'

import Image from 'next/image'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { useContext, useEffect, useRef, useState } from 'react'
import type { ImgHTMLAttributes } from 'react'
import {
  Controller,
  type SubmitErrorHandler,
  type SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { ChevronLeft, Check, Search } from 'lucide-react'

import { OrganizationContext } from '@/components/context/OrganizationContext'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Inputs'
import Xmark from '@/components/ui/Icons/Xmark'
import Typo from '@/components/ui/Typo'
import { DEFAULT_IMAGES, userImageSanitizer } from '@/utils/imageUrlSanitizer'
import { createOrganizationV2, inviteStaffMember } from '@/services/organizationService'
import { getAllUsers } from '@/services/userService'

// FallbackImage
type FallbackImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src: string
  fallbackSrc: string
}
const FallbackImage = ({
  src,
  fallbackSrc,
  alt,
  width,
  height,
  ...props
}: FallbackImageProps & { width?: number; height?: number }) => {
  const [imgSrc, setImgSrc] = useState(src)
  const safeAlt = typeof alt === 'string' ? alt : ''
  const safeWidth = typeof width === 'string' ? parseInt(width, 10) : width
  const safeHeight = typeof height === 'string' ? parseInt(height, 10) : height
  return (
    <Image
      alt={safeAlt}
      height={safeHeight}
      src={imgSrc}
      width={safeWidth}
      {...props}
      onError={() => setImgSrc(fallbackSrc)}
    />
  )
}

const ROLES = ['Admin', 'Bracket Manager', 'Founder'] as const

const staffMemberSchema = z.object({
  user: z.string(),
  role: z.enum(['Admin', 'Founder', 'Bracket Manager']),
})

const organizationFormSchema = z.object({
  name: z.string().min(1, 'Organisation name is required.'),
  logoImage: z.any().refine(file => file, 'Logo is required.'),
  bannerImage: z.any().refine(file => file, 'Banner is required.'),
  staff: z.array(staffMemberSchema),
})

type OrganizationFormData = z.infer<typeof organizationFormSchema>

const ROLE_INFO: Record<string, string> = {
  Founder: 'Full access — can edit everything',
  Admin: 'Can do everything except delete or remove other admins',
  'Bracket Manager': 'Can create/edit tournaments, cannot edit the organisation',
}

interface OrganizeStuffProps {
  onNext: () => void
  onBack?: () => void
}

const OrganizeStuff = ({ onNext, onBack }: OrganizeStuffProps) => {
  const { organizationData } = useContext(OrganizationContext)
  const { data: session } = useSession()

  const [userDetails, setUserDetails] = useState<{
    [key: string]: { nickname: string; profileImage?: string }
  }>({})
  const [newUserRole, setNewUserRole] = useState<string>('Admin')
  const [allUsers, setAllUsers] = useState<
    { _id: string; nickname: string; profileImage?: string }[]
  >([])
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<
    { _id: string; nickname: string; profileImage?: string }[]
  >([])
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationFormSchema),
    defaultValues: {
      name: organizationData.name || '',
      logoImage: organizationData.logoImage || '',
      bannerImage: organizationData.bannerImage || '',
      staff: Array.isArray(organizationData.staff)
        ? organizationData.staff.map(s => {
            const role = (s as { role?: unknown }).role
            const validRoles = ['Admin', 'Founder', 'Bracket Manager'] as const
            const isValidRole = (r: unknown): r is (typeof validRoles)[number] =>
              typeof r === 'string' && (validRoles as readonly string[]).includes(r)
            return {
              user: String((s as { user?: string }).user || ''),
              role: isValidRole(role) ? role : 'Admin',
            }
          })
        : [],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'staff' })

  useEffect(() => {
    reset({
      name: organizationData.name || '',
      logoImage: organizationData.logoImage || '',
      bannerImage: organizationData.bannerImage || '',
      staff: Array.isArray(organizationData.staff)
        ? organizationData.staff.map(s => {
            const role = (s as { role?: unknown }).role
            const validRoles = ['Admin', 'Founder', 'Bracket Manager'] as const
            const isValidRole = (r: unknown): r is (typeof validRoles)[number] =>
              typeof r === 'string' && (validRoles as readonly string[]).includes(r)
            return {
              user: String((s as { user?: string }).user || ''),
              role: isValidRole(role) ? role : 'Admin',
            }
          })
        : [],
    })
  }, [organizationData, reset])

  useEffect(() => {
    if (session?.user && fields.length === 0) {
      const currentUser = session.user as { _id: string; nickname?: string; profileImage?: string }
      append({ user: currentUser._id, role: 'Founder' as const })
      setUserDetails(prev => ({
        ...prev,
        [currentUser._id]: {
          nickname: currentUser.nickname || 'You',
          profileImage: currentUser.profileImage,
        },
      }))
    }
  }, [session, append, fields.length])

  // Close dropdown on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  useEffect(() => {
    getAllUsers()
      .then(u => {
        setAllUsers(u || [])
        setSearchResults(u || [])
      })
      .catch(() => toast.error('Failed to fetch users'))
  }, [session])

  useEffect(() => {
    setSearchResults(
      searchTerm
        ? allUsers.filter(u => u.nickname.toLowerCase().includes(searchTerm.toLowerCase()))
        : allUsers,
    )
  }, [searchTerm, allUsers])

  const handleUserSelect = (user: { _id: string; nickname?: string; profileImage?: string }) => {
    const staffList = watch('staff')
    if (!staffList.some(u => u.user === user._id)) {
      append({ user: user._id, role: newUserRole as 'Admin' | 'Founder' | 'Bracket Manager' })
      setUserDetails(prev => ({
        ...prev,
        [user._id]: { nickname: user.nickname || 'User', profileImage: user.profileImage },
      }))
    }
    setSearchTerm('')
    setIsOpen(false)
  }

  const onSubmit: SubmitHandler<OrganizationFormData> = async data => {
    if (organizationData.type === 'business') {
      onNext()
      return
    }
    const { staff, ...orgDataWithoutStaff } = data
    try {
      const fullData: Record<string, unknown> = { ...organizationData, ...orgDataWithoutStaff }
      const mapToV2 = (obj: Record<string, unknown>) => {
        const basicInfo: Record<string, unknown> = {}
        basicInfo.name = obj.name || data.name || ''
        if (typeof obj.description === 'string') basicInfo.description = obj.description
        if (typeof obj.bio === 'string') basicInfo.description = basicInfo.description || obj.bio
        basicInfo.contactEmail = (obj.email as unknown) || (obj.mail as unknown) || undefined
        if (obj.website) basicInfo.website = obj.website
        const customization: Record<string, unknown> = {}
        if (obj.bannerImage) customization.bannerImage = obj.bannerImage
        if (obj.logoImage) customization.logoImage = obj.logoImage
        if (obj.connectedSocials && typeof obj.connectedSocials === 'object')
          customization.connectedSocials = obj.connectedSocials
        if (obj.socialLinks && typeof obj.socialLinks === 'object')
          customization.socialLinks = obj.socialLinks
        const out: Record<string, unknown> = { basicInfo, customization }
        if (obj.identityVerification && typeof obj.identityVerification === 'object')
          out.identityVerification = obj.identityVerification
        out.orgType = obj.type || obj.orgType || 'club'
        if (obj.settings && typeof obj.settings === 'object') out.settings = obj.settings
        out.timestamp = obj.timestamp || new Date().toISOString()
        out.createdBy = session?.user?._id || 'system'
        return out
      }
      const v2Object = mapToV2(fullData as Record<string, unknown>)
      const hasFile = Object.values(fullData).some(v => v instanceof File)
      if (hasFile) {
        const form = new FormData()
        ;(Object.entries(v2Object) as [string, unknown][]).forEach(([key, value]) => {
          if (value === undefined || value === null) return
          if (key === 'customization' && typeof value === 'object') {
            const cust = value as Record<string, unknown>
            const tmp: Record<string, unknown> = {}
            Object.entries(cust).forEach(([k, v]) => {
              if (v instanceof File) form.append(k, v)
              else if (v !== undefined && v !== null) tmp[k] = v
            })
            form.append('customization', JSON.stringify(tmp))
            return
          }
          if (value instanceof File) form.append(key, value)
          else if (typeof value === 'object') form.append(key, JSON.stringify(value))
          else form.append(key, String(value))
        })
        const result = await createOrganizationV2(form)
        const orgId = result ? result._id || result.organization?._id : undefined
        if (result) {
          if (Array.isArray(staff) && orgId) {
            for (const member of staff) {
              if (member.role !== 'Founder') {
                try {
                  await inviteStaffMember(orgId, member.user, member.role)
                } catch {
                  toast.error(
                    `Failed to invite ${userDetails[member.user]?.nickname || member.user}`,
                  )
                }
              }
            }
          }
          toast.success('Organisation created successfully!')
          if (orgId) window.location.href = `/organization/${orgId}/Profile`
          else onNext()
        } else {
          toast.error('Failed to create organisation.')
        }
        return
      }
      const result = await createOrganizationV2(v2Object)
      const orgId = result ? result._id || result.organization?._id : undefined
      if (result) {
        if (Array.isArray(staff) && orgId) {
          for (const member of staff) {
            if (member.role !== 'Founder') {
              try {
                await inviteStaffMember(orgId, member.user, member.role)
              } catch {
                toast.error(`Failed to invite ${userDetails[member.user]?.nickname || member.user}`)
              }
            }
          }
        }
        toast.success('Organisation created successfully!')
        onNext()
      } else {
        toast.error('Failed to create organisation.')
      }
    } catch {
      toast.error('Failed to submit organisation data.')
    }
  }

  const onInvalid: SubmitErrorHandler<OrganizationFormData> = () =>
    toast.error('Please resolve the errors before submitting.')
  const submitHandler: Parameters<typeof handleSubmit>[0] = onSubmit

  return (
    <form
      className="w-full p-4 sm:p-6 md:p-8 font-poppins"
      onSubmit={handleSubmit(submitHandler, onInvalid)}
    >
      <div className="space-y-7">
        {/* Section header */}
        <div>
          <Typo as="h2" className="text-lg font-bold text-white mb-1" fontFamily="poppins">
            Staff & Permissions
          </Typo>
          <Typo as="p" className="text-gray-500 text-sm" fontFamily="poppins">
            Add team members and assign their roles
          </Typo>
        </div>

        {/* Role info cards */}
        <div className="grid sm:grid-cols-3 gap-3">
          {ROLES.map(role => (
            <div
              key={role}
              className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3"
            >
              <Typo
                as="p"
                className="text-defendrRed font-semibold text-sm mb-0.5"
                fontFamily="poppins"
              >
                {role}
              </Typo>
              <Typo as="p" className="text-gray-500 text-xs leading-relaxed" fontFamily="poppins">
                {ROLE_INFO[role]}
              </Typo>
            </div>
          ))}
        </div>

        {/* Add staff */}
        <div>
          <Typo
            as="label"
            className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2 block"
            fontFamily="poppins"
          >
            Add Staff Member
          </Typo>
          <div className="flex gap-3 flex-col sm:flex-row" ref={dropdownRef}>
            {/* Search - using project Input component */}
            <div className="relative flex-1">
              <Input
                icon={<Search className="w-4 h-4" />}
                iconOrientation="left"
                value={searchTerm}
                onChange={value => {
                  setSearchTerm(value)
                  setIsOpen(true)
                }}
                onFocus={() => setIsOpen(true)}
                placeholder="Search users by nickname…"
                size="m"
                backgroundColor="#1c1c20"
                borderColor="rgba(255,255,255,0.08)"
              />
              {isOpen && searchResults.length > 0 && (
                <div className="absolute z-20 left-0 right-0 mt-1 bg-[#1c1c20] border border-white/[0.08] rounded-xl shadow-2xl shadow-black/60 max-h-52 overflow-y-auto">
                  {searchResults.map(user => (
                    <div
                      key={user._id}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.05] cursor-pointer transition-colors"
                      onClick={() => handleUserSelect(user)}
                    >
                      <Image
                        alt={user.nickname || 'User'}
                        className="w-7 h-7 rounded-full object-cover border border-white/10"
                        height={28}
                        src={userImageSanitizer(
                          user.profileImage as unknown as string,
                          DEFAULT_IMAGES.USER,
                        )}
                        width={28}
                      />
                      <Typo as="span" className="text-sm text-gray-200" fontFamily="poppins">
                        {user.nickname}
                      </Typo>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Role selector */}
            <select
              aria-label="Staff Role"
              className="bg-[#1c1c20] border border-white/[0.08] text-white text-sm font-poppins px-4 h-[50px] rounded-2xl outline-none hover:border-white/20 transition-colors w-full sm:w-44"
              value={newUserRole}
              onChange={e => setNewUserRole(e.target.value)}
            >
              {ROLES.filter(r => r !== 'Founder').map(r => (
                <option key={r} value={r} className="bg-[#1c1c20]">
                  {r}
                </option>
              ))}
            </select>
          </div>
          {errors.staff && (
            <Typo as="p" className="text-red-400 text-xs mt-2" fontFamily="poppins">
              {errors.staff.message}
            </Typo>
          )}
        </div>

        {/* Staff list */}
        {fields.length > 0 && (
          <div className="space-y-2">
            {fields.map((field, index) => {
              const userInfo = userDetails[field.user] || {}
              const isFounder = field.role === 'Founder'
              const profileImage = userInfo.profileImage?.trim() || ''
              const nickname = userInfo.nickname || field.user
              return (
                <div
                  key={field.id}
                  className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3"
                >
                  <FallbackImage
                    alt={nickname}
                    className="w-9 h-9 rounded-full object-cover border border-white/10 flex-shrink-0"
                    fallbackSrc={DEFAULT_IMAGES.USER}
                    height={36}
                    src={userImageSanitizer(profileImage, DEFAULT_IMAGES.USER)}
                    width={36}
                  />
                  <Typo
                    as="span"
                    className="flex-1 text-sm text-white truncate"
                    fontFamily="poppins"
                  >
                    {nickname}
                  </Typo>
                  {isFounder ? (
                    <Typo
                      as="span"
                      className="text-xs text-defendrRed font-semibold bg-defendrRed/10 px-2.5 py-1 rounded-full"
                      fontFamily="poppins"
                    >
                      Founder
                    </Typo>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Controller
                        control={control}
                        name={`staff.${index}.role`}
                        render={({ field: cf }) => (
                          <select
                            {...cf}
                            className="bg-[#1c1c20] border border-white/[0.08] text-white text-xs font-poppins px-2.5 py-1.5 rounded-lg outline-none"
                          >
                            {ROLES.filter(r => r !== 'Founder').map(r => (
                              <option key={r} value={r} className="bg-[#1c1c20]">
                                {r}
                              </option>
                            ))}
                          </select>
                        )}
                      />
                      <Button
                        className="h-7 w-7 !rounded-full !p-0 !min-w-0"
                        icon={<Xmark height="1em" width="1em" />}
                        iconOrientation="left"
                        size="xxxs"
                        type="button"
                        variant="contained-red"
                        onClick={() => remove(index)}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div
        className={`flex mt-8 pt-6 border-t border-white/[0.06] ${onBack ? 'justify-between' : 'justify-end'}`}
      >
        {onBack && (
          <Button
            type="button"
            label="Back"
            variant="outlined-grey"
            icon={<ChevronLeft size={15} />}
            iconOrientation="left"
            className="w-auto px-5"
            size="auto"
            onClick={onBack}
          />
        )}
        <Button
          type="submit"
          label="Create Organisation"
          variant="contained-red"
          icon={<Check size={15} />}
          iconOrientation="right"
          className="w-auto px-8"
          size="auto"
        />
      </div>
    </form>
  )
}

export default OrganizeStuff
