'use client'
import { useEffect, useState } from 'react'
import {
  Share2,
  Pencil,
  Plus,
  Check,
  BadgeCheck,
  BadgeX,
  X,
  UserPlus,
  UserMinus,
} from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Typo from '@/components/ui/Typo'
import Button from '@/components/ui/Button'
import {
  cancelFriendRequest,
  followUser,
  sendFriendRequest,
  unfollowUser,
} from '@/services/userService'

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { userImageSanitizer, userBannerSanitizer, DEFAULT_IMAGES } from '@/utils/imageUrlSanitizer'

interface ProfileBannerUserProps {
  currentUserId: string | null
  isUserProfile: boolean
  user: any
  membership?: any
  onShareClick?: () => void
  onGiftClick?: () => void
  onBackClick?: () => void
  onRequestJoinClick?: () => void
}
const ProfileBannerUser: React.FC<ProfileBannerUserProps> = ({
  currentUserId,
  isUserProfile,
  user,
  membership,
  onShareClick,
}) => {
  const router = useRouter()
  const [isFollowing, setIsFollowing] = useState(false)
  const [isFriend, setIsFriend] = useState(false)
  const [isFriendRequestSent, setIsFriendRequestSent] = useState(false)
  const [isFriendRequestReceived, setIsFriendRequestReceived] = useState(false)
  useEffect(() => {
    const checkStatus = async () => {
      if (!user) {
        router.push('/404')
      }
      try {
        setIsFollowing(user.followers?.some((req: any) => req._id === currentUserId) || false)

        setIsFriend(user.friends?.includes(currentUserId))

        setIsFriendRequestSent(
          user?.friendRequestsReceived?.some((req: any) => req._id === currentUserId) || false,
        )
        setIsFriendRequestReceived(
          user.friendRequestsSent?.some((req: any) => req._id === currentUserId) || false,
        )
      } catch (error) {
        console.error('Failed to get user by nickname:', error)
      }
    }

    checkStatus()
  }, [user])
  const isUserVerified = user && user.verifmail === true && user.activated === true

  const onEditProfile = () => {
    router.push(`/user/${user._id}/settings`)
  }
  const addFriend = async () => {
    try {
      const response = await sendFriendRequest(user._id)
      toast.success('friend request sent')
      setIsFriendRequestSent(true)
    } catch (error) {
      toast.error('You cannot send a friend request to yourself')
    }
  }
  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await unfollowUser(user._id)
        toast.success(`You unfollowed ${user.nickname}`)
      } else {
        await followUser(user._id)
        toast.success(`You're now following ${user.nickname}`)
      }
      setIsFollowing(!isFollowing)
    } catch (error) {
      toast.error('You cannot follow yourself')
    }
  }
  const cancelFriendRequestF = async () => {
    try {
      //api call
      const response = await cancelFriendRequest(user._id)
      toast.success('friend request cancelled')
      setIsFriendRequestSent(false)
    } catch (error) {
      toast.error('error cancelling friend request, please try again')
    }
  }

  return (
    <div className="relative h-72.5 md:h-87.5 w-full bg-defendrBlack lg:ps-12 text-white overflow-hidden pt-10 pb-6">
      <div className="absolute inset-0 w-full h-87.5 bg-center bg-no-repeat bg-cover z-0">
        <div
          className="w-full h-87.5"
          style={{
            backgroundImage: `url(${userBannerSanitizer(user?.coverImage)})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10 flex flex-col items-start h-auto mt-3 px-4 sm:hidden">
        <div className="flex items-center gap-4 w-full">
          <div className="relative shrink-0">
            <Avatar className="w-20 h-20 border-4 border-defendrBlack">
              <AvatarImage
                src={userImageSanitizer(user?.profileImage, DEFAULT_IMAGES.USER)}
                alt={user.nickname}
                className="w-full h-full object-cover"
              />
              <AvatarFallback className="bg-[#bdb6b6] text-gray-800 font-bold text-lg">
                {user?.nickname?.charAt(0)?.toUpperCase() ||
                  user?.fullname?.charAt(0)?.toUpperCase() ||
                  'U'}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#23272B] rounded-full px-2 py-0.5 text-center text-white font-bold text-xs border-2 border-defendrRed z-10">
              {user?.level || 0}
            </div>
          </div>
          <div className="flex flex-col flex-1 min-w-0 gap-2.5 p-4 rounded-xl bg-[#212529]">
            <div className="relative mb-1">
              {membership?.membershipLevel.name && (
                <Typo
                  className="bg-defendrRed text-white md:text-md text-sm rounded-full px-3 py-1"
                  fontFamily="poppins"
                >
                  {membership?.membershipLevel.name}
                </Typo>
              )}
            </div>
            <div className="flex items-center justify-between w-full gap-x-4">
              <Typo className="md:text-lg font-regular text-sm" fontFamily="poppins">
                {user.nickname}
              </Typo>
              {isUserVerified ? (
                <div className="flex gap-4 mt-1">
                  <Typo className="text-xs font-semibold leading-loose" fontFamily="poppins">
                    <BadgeCheck className="inline mb-1 me-1 text-defendrGreen" size={30} />
                    verified
                  </Typo>
                </div>
              ) : (
                <div className="flex gap-4 mt-1">
                  <Typo className="text-xs font-semibold leading-loose" fontFamily="poppins">
                    <BadgeX className="inline mb-1 me-1 text-defendrRed" size={16} />
                    not verified
                  </Typo>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1 text-defendrLightGrey text-sm">
              <Typo className="text-sm md:text-md" fontFamily="poppins">
                Member since{' '}
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </Typo>
            </div>
            <div className="flex items-center w-full bg-red-400/20 gap-3 p-1 rounded-full relative overflow-hidden">
              {/* Progress background bar */}
              <div
                className="absolute left-0 top-0 h-full bg-[#D62755] rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(
                    100,
                    ((user?.progress || 0) / (user?.progressMax || 1)) * 100,
                  )}%`,
                }}
              />

              <div className="flex items-center justify-between relative z-10 flex-1 px-3 py-1">
                <Typo className="font-bold" fontFamily="poppins" fontVariant="p2">
                  {user?.level || 0}
                </Typo>
                <Typo className="me-5 mt-1" fontFamily="poppins" fontVariant="p6">
                  {user?.progress || 0}/{user?.progressMax || 1}
                </Typo>
              </div>

              <div className="flex items-center justify-center bg-[#D62755] relative z-10 gap-x-4 rounded-full px-3 py-1">
                <Typo className="font-bold" fontFamily="poppins" fontVariant="p2">
                  {(Number(user?.level) || 0) + 1}
                </Typo>
              </div>
            </div>
            <div className="flex flex-col gap-3 w-full">
              {!isUserProfile ? (
                <>
                  <div className="flex gap-2 w-full">
                    <button
                      className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-poppins transition-all duration-200 cursor-pointer ${
                        isFollowing
                          ? 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                          : 'bg-[#D62555] text-white hover:bg-[#c01e4a] shadow-lg shadow-[#D62555]/25'
                      }`}
                      onClick={handleFollowToggle}
                    >
                      {isFollowing ? (
                        <UserMinus className="w-4 h-4" />
                      ) : (
                        <UserPlus className="w-4 h-4" />
                      )}
                      {isFollowing ? 'Unfollow' : 'Follow'}
                    </button>

                    {isFriend ? (
                      <button
                        disabled
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-poppins bg-green-500/15 text-green-400 border border-green-500/20 cursor-default"
                      >
                        <Check className="w-4 h-4" />
                        Friends
                      </button>
                    ) : isFriendRequestSent ? (
                      <button
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-poppins bg-white/10 text-white border border-white/10 transition-all duration-200 cursor-pointer"
                        onClick={cancelFriendRequestF}
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    ) : (
                      <button
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-poppins bg-white/10 text-white border border-white/15 transition-all duration-200 cursor-pointer"
                        onClick={addFriend}
                      >
                        <Plus className="w-4 h-4" />
                        Add Friend
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex gap-2 w-full">
                    <button
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-poppins bg-[#D62555] text-white hover:bg-[#c01e4a] transition-all duration-200 cursor-pointer"
                      onClick={onShareClick}
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      Share
                    </button>
                    <button
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-poppins bg-white/10 text-white hover:bg-white/20 border border-white/10 transition-all duration-200 cursor-pointer"
                      onClick={onEditProfile}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Edit Profile
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* layout for sm and up */}
      <div className="hidden sm:flex relative z-50 px-4 sm:px-10 py-4 sm:py-6 items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar className="w-32 h-32 border-4 border-defendrBlack">
              <AvatarImage
                src={userImageSanitizer(user?.profileImage, DEFAULT_IMAGES.USER)}
                alt={user.nickname}
                className="w-full h-full object-cover"
              />
              <AvatarFallback className="bg-[#bdb6b6] text-gray-800 font-bold text-2xl">
                {user?.nickname?.charAt(0)?.toUpperCase() ||
                  user?.fullname?.charAt(0)?.toUpperCase() ||
                  'U'}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#23272B] rounded-full px-3 py-1 text-center text-white font-bold text-sm border-2 border-defendrRed z-10">
              {user?.level || 0}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="relative">
              {membership?.membershipLevel.name && (
                <Typo
                  className="bg-defendrRed text-white text-xs rounded-full px-3 py-1 ml-2"
                  fontFamily="poppins"
                >
                  {membership?.membershipLevel.name}
                </Typo>
              )}
            </div>
            <div className="bg-[#212529] p-6 rounded-[19px] mb-4 w-full min-w-75 max-w-87.5 md:w-112.5 h-auto text-center flex flex-col gap-3 justify-center">
              <div className="flex items-center gap-4">
                <Typo
                  as="p"
                  color="white"
                  fontFamily="poppins"
                  fontVariant="p1"
                  fontWeight="regular"
                >
                  {user.nickname}
                </Typo>
                {isUserVerified ? (
                  <div className="flex gap-4 mt-1">
                    <Typo className="text-xs font-semibold leading-loose" fontFamily="poppins">
                      <BadgeCheck className="inline mb-1 me-1 text-defendrGreen" size={16} />
                      verified
                    </Typo>
                  </div>
                ) : (
                  <div className="flex gap-4 mt-1">
                    <Typo className="text-xs font-semibold leading-loose" fontFamily="poppins">
                      <BadgeX className="inline mb-1 me-1 text-defendrRed" size={16} />
                      not verified
                    </Typo>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-start font-poppins text-xs sm:text-sm text-defendrGhostGrey">
                <Typo className="text-sm pt-1" fontFamily="poppins">
                  Member since since{' '}
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </Typo>
              </div>
              <div className="flex items-center w-full bg-red-400/20 gap-3 p-1 rounded-full relative overflow-hidden">
                {/* Progress background bar */}
                <div
                  className="absolute left-0 top-0 h-full bg-[#D62755] rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      100,
                      ((user?.progress || 0) / (user?.progressMax || 1)) * 100,
                    )}%`,
                  }}
                />

                <div className="flex items-center justify-between relative z-10 flex-1 px-3 py-1">
                  <Typo className="font-bold" fontFamily="poppins" fontVariant="p2">
                    {user?.level || 0}
                  </Typo>
                  <Typo className="me-5 mt-1" fontFamily="poppins" fontVariant="p6">
                    {user?.progress || 0}/{user?.progressMax || 1}
                  </Typo>
                </div>

                <div className="flex items-center justify-center bg-[#D62755] relative z-10 gap-x-4 rounded-full px-3 py-1">
                  <Typo className="font-bold" fontFamily="poppins" fontVariant="p2">
                    {(Number(user?.level) || 0) + 1}
                  </Typo>
                </div>
              </div>

              <div className="flex flex-row gap-3 w-full max-w-md justify-center">
                {!isUserProfile ? (
                  <div className="flex flex-col gap-3 w-full">
                    <div className="flex justify-center gap-3 w-full">
                      <button
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold font-poppins transition-all duration-200 cursor-pointer ${
                          isFollowing
                            ? 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                            : 'bg-[#D62555] text-white hover:bg-[#c01e4a] shadow-lg shadow-[#D62555]/25'
                        }`}
                        onClick={handleFollowToggle}
                      >
                        {isFollowing ? (
                          <UserMinus className="w-4 h-4" />
                        ) : (
                          <UserPlus className="w-4 h-4" />
                        )}
                        {isFollowing ? 'Unfollow' : 'Follow'}
                      </button>

                      {isFriend ? (
                        <button
                          disabled
                          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold font-poppins bg-green-500/15 text-green-400 border border-green-500/20 cursor-default"
                        >
                          <Check className="w-4 h-4" />
                          Friends
                        </button>
                      ) : isFriendRequestSent ? (
                        <button
                          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold font-poppins bg-white/10 text-white hover:bg-red-500/20 hover:text-red-400 border border-white/10 hover:border-red-500/20 transition-all duration-200 cursor-pointer"
                          onClick={cancelFriendRequestF}
                        >
                          <X className="w-4 h-4" />
                          Cancel Request
                        </button>
                      ) : (
                        <button
                          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold font-poppins bg-white/10 text-white hover:bg-[#D62555] hover:shadow-lg hover:shadow-[#D62555]/25 border border-white/15 hover:border-[#D62555] transition-all duration-200 cursor-pointer"
                          onClick={addFriend}
                        >
                          <Plus className="w-4 h-4" />
                          Add Friend
                        </button>
                      )}
                    </div>

                    {/* Follower count */}
                    <div className="flex items-center justify-center gap-1.5 text-sm font-poppins">
                      <span className="text-white font-bold">
                        {user.followers?.length?.toLocaleString() || 0}
                      </span>
                      <span className="text-gray-400">Followers</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex w-full px-5 justify-between">
                    <Button
                      className="w-auto font-poppins hover:bg-opacity-90 transition-all"
                      icon={<Share2 className="text-white w-4 h-4" />}
                      iconOrientation="left"
                      label="share"
                      textClassName="text-xs"
                      variant="contained-red"
                      onClick={onShareClick}
                    />
                    <Button
                      className="w-auto font-poppins hover:bg-opacity-90 transition-all"
                      icon={<Pencil className="text-white w-4 h-4" />}
                      iconOrientation="left"
                      label="edit profile"
                      textClassName="text-xs"
                      variant="contained-red"
                      onClick={onEditProfile}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileBannerUser
