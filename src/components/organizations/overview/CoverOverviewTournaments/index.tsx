'use client'

import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import Trophy from '@/components/ui/Icons/Trophy'
import Button from '@/components/ui/Button'
import Global from '@/components/ui/Icons/Global'
import Star from '@/components/ui/Icons/Star'
import Users from '@/components/ui/Icons/Users'
import Typo from '@/components/ui/Typo'
import { Flag, CheckCircle } from 'lucide-react'
import {
  followOrganization,
  unfollowOrganization,
  updateOrganizationV2,
} from '@/services/organizationService'
import { uploadImage } from '@/services/imageUploadService'
import EditPen from '@/components/ui/Icons/EditPen'
import { organizerImageSanitizer, DEFAULT_IMAGES } from '@/utils/imageUrlSanitizer'

type OrgStaffUser = string | { _id?: string; id?: string }
type OrgStaffMember = { user: OrgStaffUser; role: string }
type OrganizationView = {
  _id?: string
  name?: string
  bannerImage?: string
  logoImage?: string
  rating?: number
  verified?: boolean
  createdBy?: { nickname?: string } | string
  createdAt?: string
  timestamp?: string
  staff?: OrgStaffMember[]
  tournaments?: unknown[]
  followers?: string[]
  socialLinks?: { email?: string }
}

function getSessionUserId(session: unknown): string | undefined {
  if (typeof session === 'object' && session !== null && 'user' in session) {
    const user = (session as { user?: unknown }).user
    if (typeof user === 'object' && user !== null) {
      const maybeUser = user as { _id?: unknown }
      if (typeof maybeUser._id === 'string') {
        return maybeUser._id
      }
    }
  }
  return undefined
}

const CoverOverviewTournaments: React.FC<{ organization: OrganizationView }> = ({
  organization,
}) => {
  const { data: session } = useSession()
  const router = useRouter()
  const [isFollowing, setIsFollowing] = useState(false)
  const [updating, setUpdating] = useState(false)
  const bannerInputRef = useRef<HTMLInputElement | null>(null)
  const logoInputRef = useRef<HTMLInputElement | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | undefined>(organization?.bannerImage)
  const [logoPreview, setLogoPreview] = useState<string | undefined>(organization?.logoImage)

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        if (!organization._id) {
          return
        }
        const uid = getSessionUserId(session)
        if (uid && organization?.followers) {
          setIsFollowing(organization.followers.includes(uid))
        }
      } catch {
        // ignore
      }
    }
    fetchOrganization()
  }, [organization, session])

  // Reset previews when organization prop changes
  useEffect(() => {
    setBannerPreview(organization?.bannerImage)
    setLogoPreview(organization?.logoImage)
  }, [organization?.bannerImage, organization?.logoImage])

  const handleInlineImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'bannerImage' | 'logoImage',
  ) => {
    const file = e.target.files?.[0]
    if (!file || !organization?._id) {
      return
    }
    try {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be < 5MB')
        return
      }
      setUpdating(true)
      const { imageUrl } = await uploadImage(file)
      if (type === 'bannerImage') {
        setBannerPreview(imageUrl)
      } else {
        setLogoPreview(imageUrl)
      }
      await updateOrganizationV2(organization._id, { [type]: imageUrl })
      toast.success('Image updated')
    } catch {
      toast.error('Failed to update image')
    } finally {
      setUpdating(false)
      if (e.target) {
        e.target.value = ''
      }
    }
  }

  const handleFollowClick = async () => {
    try {
      if (!organization._id) {
        return
      }
      if (isFollowing) {
        await unfollowOrganization(organization._id)
        setIsFollowing(false)
        toast.success(`You have unfollowed ${organization?.name}`)
      } else {
        await followOrganization(organization._id)
        setIsFollowing(true)
        toast.success(`You are now following ${organization?.name}`)
      }
    } catch {
      toast.error('Failed to follow the organization')
    }
  }

  const getCreationYear = (dateString: string | undefined) => {
    if (!dateString) {
      return 'Unknown'
    }
    try {
      const year = new Date(dateString).getFullYear()
      return isNaN(year) ? 'Unknown' : year.toString()
    } catch {
      return 'Unknown'
    }
  }

  const sessionUserId = getSessionUserId(session)
  const isAdminOrFounder = Boolean(
    organization?.staff?.some(staffMember => {
      const staffUserId =
        typeof staffMember.user === 'string'
          ? staffMember.user
          : staffMember.user?._id || staffMember.user?.id
      return (
        staffUserId === sessionUserId &&
        (staffMember.role === 'Admin' || staffMember.role === 'Founder')
      )
    }),
  )

  return (
    <div className="px-1 md:px-2 w-full rounded-lg overflow-hidden relative">
      <div className="w-full">
        <div className="w-full">
          <div className="relative h-[280px] sm:h-[320px] md:h-[420px] mx-1 md:mx-2 rounded-lg overflow-hidden bg-gray-800 group">
            <Image
              fill
              alt={`${organization?.name || 'Organization'} banner`}
              className={`object-cover object-top md:object-center transition-all duration-300 ${
                isAdminOrFounder ? 'group-hover:brightness-75 cursor-pointer' : ''
              }`}
              src={organizerImageSanitizer(
                (bannerPreview || organization?.bannerImage || '') as string,
                DEFAULT_IMAGES.TOURNAMENT,
              )}
              onClick={() => isAdminOrFounder && bannerInputRef.current?.click()}
              priority
            />
            {isAdminOrFounder && (
              <button
                aria-label="Change banner image"
                className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/40 transition-colors group/banner"
                disabled={updating}
                type="button"
                onClick={() => bannerInputRef.current?.click()}
              >
                <span className="opacity-0 group-hover/banner:opacity-100 transition-opacity flex items-center justify-center w-16 h-16 rounded-full bg-black/60 text-white">
                  {updating ? (
                    <span className="text-xs font-poppins">...</span>
                  ) : (
                    <EditPen className="size-7" />
                  )}
                </span>
              </button>
            )}
            <input
              ref={bannerInputRef}
              accept="image/*"
              className="hidden"
              type="file"
              onChange={e => handleInlineImageChange(e, 'bannerImage')}
            />
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="bg-[#1e1e1e] p-4 flex flex-col md:flex-row items-center gap-5 relative -mt-12 sm:-mt-14 md:-mt-16 rounded-lg mx-1 md:mx-2">
          {/* Logo and Rating */}
          <div className="relative flex-shrink-0 -mt-12 sm:-mt-14 md:-mt-16">
            <div className="relative size-36 md:size-44 lg:size-52 rounded-full border-4 border-[#3c82f6] bg-gray-900 p-1 group">
              <Image
                alt={`${organization?.name || 'Organization'} logo`}
                className={`size-full rounded-full object-cover transition-all duration-300 ${
                  isAdminOrFounder ? 'group-hover:brightness-75 cursor-pointer' : ''
                }`}
                height={500}
                src={organizerImageSanitizer(
                  (logoPreview || organization?.logoImage || '') as string,
                  DEFAULT_IMAGES.ORGANIZATION,
                )}
                width={500}
                onClick={() => isAdminOrFounder && logoInputRef.current?.click()}
              />
              {isAdminOrFounder && (
                <button
                  aria-label="Change logo"
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full bg-black/40 text-white text-xs font-poppins"
                  disabled={updating}
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                >
                  <EditPen className="size-5" />
                </button>
              )}
              <input
                ref={logoInputRef}
                accept="image/*"
                className="hidden"
                type="file"
                onChange={e => handleInlineImageChange(e, 'logoImage')}
              />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-[#3c82f6] text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-bold">
              <Typo as="span" color="white" fontVariant="p4">
                {organization?.rating || '0'}
              </Typo>
              <Star className="size-3 md:size-4 fill-current" />
            </div>
          </div>

          {/* Middle Info Section */}
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex flex-col items-center md:items-start w-full">
              <div className="flex items-center gap-2 w-full justify-center md:justify-start">
                <Typo
                  as="h3"
                  className="font-bold"
                  color="white"
                  fontFamily="poppins"
                  fontVariant="h3"
                >
                  {organization?.name || 'Organization'}
                </Typo>
                <div className="hidden md:inline-flex ml-2">
                  {organization?.verified ? (
                    <div className="flex items-center gap-1 bg-blue-500 text-white px-3 md:px-4 text-xs md:text-sm py-1 rounded-full font-poppins">
                      <CheckCircle className="size-3 md:size-4" />
                      <span>Verified</span>
                    </div>
                  ) : (
                    <span className="bg-[#D62755] text-white px-4 md:px-6 text-xs md:text-sm py-0.5 rounded-full font-poppins">
                      Unverified
                    </span>
                  )}
                </div>
              </div>
              {/* Mobile badge (below name) */}
              <div className="mt-2 flex md:hidden w-full justify-center">
                {organization?.verified ? (
                  <div className="flex items-center gap-1 bg-blue-500 text-white px-3 text-xs py-1 rounded-full font-poppins">
                    <CheckCircle className="size-3" />
                    <span>Verified</span>
                  </div>
                ) : (
                  <span className="bg-[#D62755] text-white px-4 text-xs py-0.5 rounded-full font-poppins">
                    Unverified
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-1 text-gray-400 text-xs mt-2">
              <div className="flex items-center gap-1">
                <Flag className="size-4 md:size-5 lg:size-7 text-gray-400" />
                <Typo as="span" color="grey" fontFamily="poppins" fontVariant="p5">
                  {(organization as any)?.country || 'Global'}
                </Typo>
              </div>
              <Typo as="span" color="grey" fontFamily="poppins" fontVariant="p5">
                This organisation Created by
                {typeof organization?.createdBy === 'object' && organization?.createdBy !== null
                  ? ` ${(organization.createdBy as { nickname?: string }).nickname ?? ''}`
                  : ''}{' '}
                since {getCreationYear(organization?.timestamp)}
              </Typo>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-gray-300 text-xs md:text-sm mt-3">
              {organization?.socialLinks?.email && (
                <Button
                  className="text-white transition-colors"
                  href={organization.socialLinks.email}
                  icon={<Global className="size-3 md:size-4" />}
                  iconOrientation="left"
                  label={organization.socialLinks.email.replace(/https?:\/\//, '')}
                  size="xxs"
                  textClassName="text-defendrRed font-poppins pl-2"
                  variant="text"
                />
              )}
              <div className="flex items-center gap-1 md:gap-1.5">
                <Users className="size-3 md:size-4" />
                <Typo as="span" color="ghostGrey" fontFamily="poppins" fontVariant="p4">
                  {(organization as any)?.nbFollowers ?? 0} Followers
                </Typo>
              </div>
              <div className="flex items-center gap-1 md:gap-1.5">
                <span className="size-3 md:size-4">
                  <Users />
                </span>
                <Typo as="span" color="ghostGrey" fontFamily="poppins" fontVariant="p4">
                  {organization?.staff?.length ?? 0} Staff Members
                </Typo>
              </div>
              <div className="flex items-center gap-1 md:gap-1.5">
                <Trophy className="size-3 md:size-4" />
                <Typo as="span" color="ghostGrey" fontFamily="poppins" fontVariant="p4">
                  {organization?.tournaments?.length ?? 37} Tournaments
                </Typo>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0 mt-4 md:hidden lg:hidden">
            {isAdminOrFounder ? (
              <>
                <Button
                  className="hover:bg-opacity-90 transition-all px-1.5 py-0.5 text-xs"
                  label="Manage"
                  size="xxs"
                  variant="contained-black"
                  onClick={() => router.push(`/organization/${organization._id}/Edit`)}
                />
                <Button
                  className="hover:bg-opacity-90 transition-all px-1.5 py-0.5 text-xs"
                  label="Create"
                  size="xxs"
                  variant="contained-red"
                  onClick={() => router.push(`/tournament`)}
                />
              </>
            ) : (
              <>
                <Button
                  className="hover:bg-opacity-90 transition-all px-1.5 py-0.5 text-xs"
                  label={isFollowing ? 'Following' : 'Follow'}
                  size="xxs"
                  variant="contained-red"
                  onClick={handleFollowClick}
                />
                <Button
                  className="hover:bg-opacity-90 transition-all px-1.5 py-0.5 text-xs"
                  disabled={true}
                  label="Subscribe"
                  size="xxs"
                  variant="contained-green"
                />
              </>
            )}
          </div>

          <div className="hidden md:flex lg:flex items-center px-5 gap-3 flex-shrink-0 md:mt-0">
            {isAdminOrFounder ? (
              <>
                <Button
                  className="hover:bg-opacity-90 transition-all px-4 py-1 text-sm"
                  label="Manage"
                  size="xxs"
                  variant="contained-black"
                  onClick={() => router.push(`/organization/${organization._id}/Edit`)}
                />
                <Button
                  className="hover:bg-opacity-90 transition-all px-4 py-1 text-sm"
                  label="Create"
                  size="xxs"
                  variant="contained-red"
                  onClick={() => router.push(`/tournament`)}
                />
              </>
            ) : (
              <>
                <Button
                  className="hover:bg-opacity-90 transition-all px-4 py-1 text-sm"
                  label={isFollowing ? 'Following' : 'Follow'}
                  size="xxs"
                  variant="contained-red"
                  onClick={handleFollowClick}
                />
                <Button
                  className="hover:bg-opacity-90 transition-all px-4 py-1 text-sm"
                  disabled={true}
                  label="Subscribe"
                  size="xxs"
                  variant="contained-green"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CoverOverviewTournaments
