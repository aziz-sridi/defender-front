'use client'

import { followOrganization, unfollowOrganization } from '@/services/organizationService'
import { Plus, Check } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface FollowOrganizationButtonProps {
  followers: number
  organizationId: string
  initialIsFollowing: boolean
}

export default function FollowOrganizationButton({
  followers,
  organizationId,
  initialIsFollowing,
}: FollowOrganizationButtonProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [isLoading, setIsLoading] = useState(false)
  const [currentFollowers, setCurrentFollowers] = useState(followers)

  const handleFollowClick = async () => {
    if (!session?.user?.email) {
      toast.error('You must be signed in to follow')
      router.push('/login?callbackUrl=' + window.location.pathname)
      return
    }

    try {
      setIsLoading(true)
      if (isFollowing) {
        await unfollowOrganization(organizationId)
        setIsFollowing(false)
        setCurrentFollowers(prev => prev - 1)
        toast.success('Unfollowed organization')
      } else {
        await followOrganization(organizationId)
        setIsFollowing(true)
        setCurrentFollowers(prev => prev + 1)
        toast.success('Followed organization')
      }
    } catch (error) {
      console.error('Error toggling follow:', error)
      toast.error('Failed to update follow status')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <p className="text-defendrGhostGrey flex flex-1 ">{currentFollowers} follower</p>
      <button
        type="button"
        onClick={handleFollowClick}
        disabled={isLoading}
        className="bg-defendrBg w-30 text-defendrRed hover:bg-defendrRed hover:text-defendrBg duration-300 rounded-full px-2 py-1 flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isFollowing ? <Check size={16} /> : <Plus size={16} />}
        {isFollowing ? 'Following' : 'Follow'}
      </button>
    </>
  )
}
