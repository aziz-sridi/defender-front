'use client'
import { useEffect, useState } from 'react'
import { Share, Gift, Info, UserRoundPlus, Heart, User2, Pencil, HeartIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import Button from '@/components/ui/Button'
import Typo from '@/components/ui/Typo'
import { followTeam, likeTeam, unfollowTeam, unlikeTeam, leaveTeam } from '@/services/teamService'
import { teamImageSanitizer, teamBannerSanitizer, DEFAULT_IMAGES } from '@/utils/imageUrlSanitizer'

interface ProfileBannerProps {
  authenticatedUserId: string
  team: any
  isUserTeam: boolean
  onShareClick?: () => void
  onGiftClick?: () => void
  onBackClick?: () => void
  onRequestJoinClick?: () => void
  onGameChange?: (game: string) => void
  onAddMemberClick?: () => void
  isUserTeamOwner?: boolean
  isRequestPending?: boolean
}

const ProfileBanner: React.FC<ProfileBannerProps> = ({
  authenticatedUserId,
  team,
  isUserTeam,
  onShareClick,
  onGiftClick,
  onBackClick,
  onRequestJoinClick,
  onAddMemberClick,
  isUserTeamOwner = false,
  isRequestPending: _isRequestPending,
}) => {
  const [isAFollower, setIsAFollower] = useState(false)
  const [isALiker, setIsALiker] = useState(false)
  const [followers, setFollowers] = useState<number>(team?.followers?.length || 0)
  const [likes, setLikes] = useState<number>(team?.likes?.length || 0)
  const router = useRouter()

  // Only track followers/likes for UI
  useEffect(() => {
    setFollowers(team?.followers?.length || 0)
    setLikes(team?.likes?.length || 0)

    if (
      Array.isArray(team?.followers) &&
      team.followers.some(
        (follower: unknown) => (follower as { _id?: string })?._id === authenticatedUserId,
      )
    ) {
      setIsAFollower(true)
    } else {
      setIsAFollower(false)
    }

    if (Array.isArray(team?.likes) && team.likes.includes(authenticatedUserId)) {
      setIsALiker(true)
    } else {
      setIsALiker(false)
    }
  }, [team, authenticatedUserId])
  const handleLeaveTeam = async () => {
    try {
      await leaveTeam(team._id)
      toast.success('You have left the team')
      router.push('/team')
    } catch {
      toast.error('Failed to leave team. Please try again later.')
    }
  }

  const onEditTeamClick = () => {
    router.push(`/team/${team._id}/edit`)
  }

  const followTeamAction = async () => {
    try {
      if (isAFollower) {
        await unfollowTeam(team._id)
        toast.success('You have unfollowed this team')
        setIsAFollower(false)
      } else {
        await followTeam(team._id)
        toast.success('You are now following this team')
        setIsAFollower(true)
      }
    } catch {
      toast.error('Failed to follow/unfollow team. Please try again later.')
    }
  }

  const likeTeamAction = async () => {
    try {
      if (isALiker) {
        await unlikeTeam(team._id)
        toast.success('You have unliked this team')
        setIsALiker(false)
      } else {
        await likeTeam(team._id)
        toast.success('You liked this team')
        setIsALiker(true)
      }
    } catch {
      toast.error('Failed to like/unlike team. Please try again later.')
    }
  }

  return (
    <div className="relative w-full bg-defendrBlack text-white overflow-hidden pb-6">
      <div className="w-full flex justify-center">
        <div
          className="w-full max-w-md h-32 sm:hidden rounded-2xl bg-center bg-no-repeat bg-cover mt-4"
          style={{
            backgroundImage: `url('${teamBannerSanitizer(team?.coverImage)}')`,
          }}
        />
        <div
          className="hidden sm:block sm:absolute bg-cover bg-center bg-no-repeat mx-auto sm:m-0 rounded-xl opacity-3 w-5/6 h-3/4 sm:w-full sm:h-full"
          style={{
            backgroundImage: `url('${teamBannerSanitizer(team?.coverImage)}')`,
          }}
        />
      </div>

      <div className="w-full flex justify-center sm:hidden">
        <div className="absolute left-1/2 -translate-x-1/2 top-20 z-10">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-defendrBlack bg-[#bdb6b6]">
            <Image
              alt={team.name}
              className="w-full h-full object-cover"
              height={100}
              src={teamImageSanitizer(team?.profileImage, DEFAULT_IMAGES.TEAM)}
              width={100}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start h-auto mt-12 px-4 sm:hidden">
        <div className="flex items-start justify-start gap-2">
          <Typo className="font-regular text-sm font-bold" fontFamily="poppins">
            {team.name}
          </Typo>
          <Typo
            className="bg-defendrRed text-white text-xs rounded-full px-3 py-1"
            fontFamily="poppins"
          >
            {team?.game?.name}
          </Typo>
        </div>
        <div className="flex flex-col items-start gap-1 mt-2 text-defendrGhostGrey text-sm">
          <div className="flex items-center gap-2">
            <Typo className="text-sm md:text-md" fontFamily="poppins">
              member since:
              {new Date(team.datecreation)
                .toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
                .replace(',', '')}
            </Typo>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mt-3">
          {team?.website && (
            <Link
              className="text-defendrRed underline text-xs"
              href={team.website || '#'}
              rel="noopener noreferrer"
              target="_blank"
            >
              {team.website || 'no website provided'}
            </Link>
          )}
          <div className="flex flex-row items-center justify-center gap-5">
            <Typo className="text-xs">
              <User2 className="mr-1 inline" size={14} />
              {followers} followers
            </Typo>
            <Typo className="text-xs">
              <HeartIcon className="mr-1 inline" size={14} />
              {likes} likes
            </Typo>
          </div>
        </div>
        {/* Always show Edit Team if isUserTeam (owner logic handled by parent) */}
        {isUserTeam ? (
          <div className="flex flex-row gap-3 w-full max-w-md mt-4">
            <Button
              className="w-full font-poppins"
              icon={<Pencil size={16} />}
              iconOrientation="left"
              label="edit team"
              size="s"
              textClassName="text-xs"
              variant="contained-red"
              onClick={onEditTeamClick}
            />
            {isUserTeamOwner && onAddMemberClick && (
              <Button
                className="w-full font-poppins"
                icon={<UserRoundPlus size={16} />}
                iconOrientation="left"
                label="add member"
                size="s"
                textClassName="text-xs"
                variant="contained-red"
                onClick={onAddMemberClick}
              />
            )}
          </div>
        ) : Array.isArray(team?.teamroster) &&
          team.teamroster.some((member: any) => {
            if (typeof member === 'string') {
              return member === authenticatedUserId
            }
            if (member.user && typeof member.user === 'object') {
              return member.user._id === authenticatedUserId
            }
            if (member._id) {
              return member._id === authenticatedUserId
            }
            return false
          }) ? (
          <div className="flex flex-row gap-3 w-full max-w-md mt-4">
            <Button
              className="w-full font-poppins"
              icon={<User2 size={16} />}
              iconOrientation="left"
              label="Leave Team"
              size="s"
              textClassName="text-xs"
              variant="contained-red"
              onClick={handleLeaveTeam}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-3 w-full max-w-md mt-4">
            <Button
              className="w-full font-poppins"
              icon={!isAFollower && <Heart className="text-white w-4 h-4" />}
              iconOrientation="left"
              label={isAFollower ? 'Unfollow' : 'Follow'}
              size="s"
              textClassName="text-xs"
              variant="contained-red"
              onClick={followTeamAction}
            />
            {/* Show Request To Join on mobile for non-members */}
            <Button
              className="w-full font-poppins"
              disabled={_isRequestPending}
              icon={<UserRoundPlus size={16} />}
              iconOrientation="left"
              label={_isRequestPending ? 'Request Sent' : 'Request To Join'}
              size="s"
              textClassName="text-xs"
              variant="contained-red"
              onClick={onRequestJoinClick}
            />
          </div>
        )}
      </div>
      {/*desktop */}

      <div className="hidden sm:block relative z-50 px-4 sm:px-8 lg:px-10 py-4 sm:py-3">
        <div className="hidden relative z-10 pb-7 sm:flex flex-row sm:items-center justify-between px-4 sm:px-6 lg:px-12 py-2">
          <div className="flex items-center">
            <button
              className="w-8 h-8 sm:w-9 sm:h-10 rounded-full bg-defendrLightBlack flex items-center justify-center mr-2 hover:bg-[#3a3a3a] transition-colors"
              onClick={onBackClick}
            >
              <Info className="sm:hidden" size={20} />
              <Info className="hidden sm:block" size={20} />
            </button>

            <button
              className="bg-defendrLightBlack hover:bg-[#2a2e33] text-white px-3 sm:px-6 py-1.5 sm:py-2 rounded transition-colors text-sm sm:text-lg justify-center"
              onClick={onBackClick}
            >
              <Typo className="hidden sm:inline text-sm">Click To Return To Profile </Typo>
              <Typo className="sm:hidden">Return To Profile</Typo>
            </button>
          </div>

          {isUserTeam ? (
            <div className="flex flex-col gap-2">
              <Button
                icon={<Pencil size={16} />}
                iconOrientation="left"
                label="Edit Team"
                size="xs"
                variant="contained-red"
                onClick={onEditTeamClick}
              />
            </div>
          ) : Array.isArray(team?.teamroster) &&
            team.teamroster.some((member: unknown) => {
              if (typeof member === 'string') {
                return member === authenticatedUserId
              }
              const m = member as Record<string, unknown>
              if (m.user && typeof m.user === 'object' && (m.user as Record<string, unknown>)._id) {
                return (m.user as Record<string, unknown>)._id === authenticatedUserId
              }
              if (m._id) {
                return m._id === authenticatedUserId
              }
              return false
            }) ? (
            <Button
              className="btn-defendr-red font-poppins"
              icon={<User2 size={16} />}
              iconOrientation="left"
              label="Leave Team"
              size="s"
              variant="contained-red"
              onClick={handleLeaveTeam}
            />
          ) : (
            <Button
              className="btn-defendr-red font-poppins"
              disabled={_isRequestPending}
              icon={<UserRoundPlus size={16} />}
              iconOrientation="left"
              label={_isRequestPending ? 'Request Sent' : 'Request To Join'}
              size="s"
              variant="contained-red"
              onClick={onRequestJoinClick}
            />
          )}
        </div>
        <div className="flex flex-col sm:flex-row ps-4 items-center sm:items-start gap-4 sm:gap-6">
          <div className="relative">
            <div className="w-20 h-20  ms-7 sm:w-32 sm:h-32 lg:w-[150px] lg:h-[150px] rounded-full overflow-hidden">
              <Image
                alt={team.name}
                className="w-full h-full object-cover"
                height={100}
                src={teamImageSanitizer(team?.profileImage, DEFAULT_IMAGES.TEAM)}
                width={100}
              />
            </div>
          </div>
          <div className="bg-[#212529] p-4 sm:p-6 rounded-[19px] w-full sm:min-w-[300px] sm:max-w-[350px] lg:h-auto text-center sm:text-left">
            <Typo as="p" color="white" fontFamily="poppins" fontVariant="p1" fontWeight="regular">
              {team.name}
            </Typo>
            <div className="flex items-center justify-center sm:justify-start text-xs font-poppins text-defendrGhostGrey mb-2">
              <Typo className="pt-2" fontVariant="p5">
                {team?.game?.name || 'Unknown Game'}
              </Typo>
            </div>
            <div className="flex items-center justify-center sm:justify-start font-poppins text-xs sm:text-sm text-defendrGhostGrey mb-4">
              <Typo className="text-sm pt-1" fontFamily="poppins">
                member since :{' '}
                {new Date(team.datecreation)
                  .toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                  .replace(',', '')}
              </Typo>
            </div>
            <div className="flex flex-col sm:flex-row sm:space-x-4">
              <div className="flex gap-2 w-full sm:w-auto mb-2 sm:mb-0">
                <Button
                  aria-label={isAFollower ? 'Unfollow team' : 'Follow team'}
                  className="font-poppins rounded-xl px-4 w-full sm:w-auto"
                  icon={
                    isAFollower ? (
                      <User2 className="text-white w-4 h-4" />
                    ) : (
                      <Heart className="text-white w-4 h-4" />
                    )
                  }
                  iconOrientation="left"
                  label={isAFollower ? 'Unfollow' : 'Follow'}
                  size="s"
                  textClassName="text-xs"
                  variant="contained-red"
                  onClick={followTeamAction}
                />
              </div>
              <button
                className="bg-[#161616] hover:bg-defendrRed px-4 py-2 rounded-xl flex items-center justify-center transition-colors w-full sm:w-auto"
                onClick={onShareClick}
              >
                <Share className="mr-2" size={20} />
                <Typo className="text-sm font-poppins">Share</Typo>
              </button>
            </div>
            {/* KPIs */}
            <div className="mt-3 flex justify-center sm:justify-start gap-2">
              <span className="px-3 py-1 rounded-full bg-[#161616] text-white/90 text-xs inline-flex items-center gap-1">
                <User2 size={14} /> {followers} followers
              </span>
              <span className="px-3 py-1 rounded-full bg-[#161616] text-white/90 text-xs inline-flex items-center gap-1">
                <HeartIcon size={14} /> {likes} likes
              </span>
            </div>
          </div>
          {/* Right-side desktop block removed per UX request */}
        </div>
      </div>
    </div>
  )
}

export default ProfileBanner
