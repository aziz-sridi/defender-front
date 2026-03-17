'use client'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

import Typo from '@/components/ui/Typo'
import { FriendsList } from '@/components/user/userProfileTabs/helpers/friends/FriendsList'
import { FriendRequestsSent } from '@/components/user/userProfileTabs/helpers/friends/FriendRequestsSent'
import { FriendRequestsReceived } from '@/components/user/userProfileTabs/helpers/friends/FriendRequestsReceived'
import {
  acceptFriendRequest,
  cancelFriendRequest,
  declineFriendRequest,
  removeFriend,
} from '@/services/userService'

const Friends = ({ friends, user }: { friends: any; user: any }) => {
  // Directly extract friends and requests safely using optional chaining
  const [friendsData, setFriends] = useState(friends ?? [])
  const [friendRequestsReceived, setFriendRequestsReceived] = useState(
    user?.friendRequestsReceived ?? [],
  )
  const [friendRequestsSent, setFriendRequestsSent] = useState(user?.friendRequestsSent ?? [])

  useEffect(() => {
    setFriends(user?.friends ?? [])
    setFriendRequestsReceived(user?.friendRequestsReceived ?? [])
    setFriendRequestsSent(user?.friendRequestsSent ?? [])
  }, [user])

  const handleUnfriend = async (friendId: string) => {
    try {
      await removeFriend(friendId)
      setFriends(prev => prev.filter(friend => friend?._id !== friendId))
      toast.success('Friend removed')
    } catch {
      toast.error('Please try again')
    }
  }

  const handleAcceptRequest = async (requestId: string) => {
    const request = friendRequestsReceived.find(req => req?._id === requestId)
    if (!request) {
      return
    }

    try {
      await acceptFriendRequest(requestId)
      setFriends(prev => [...prev, request])
      setFriendRequestsReceived(prev => prev.filter(req => req?._id !== requestId))
      toast.success('Friend request accepted')
    } catch {
      toast.error('Please try again')
    }
  }

  const handleRejectRequest = async (requestId: string) => {
    try {
      await declineFriendRequest(requestId)
      setFriendRequestsReceived(prev => prev.filter(req => req?._id !== requestId))
      toast.success('Friend request declined')
    } catch {
      toast.error('Please try again')
    }
  }

  const handleCancelRequest = async (requestId: string) => {
    try {
      await cancelFriendRequest(requestId)
      setFriendRequestsSent(prev => prev.filter(req => req?._id !== requestId))
      toast.success('Friend request canceled')
    } catch {
      toast.error('Please try again')
    }
  }

  return (
    <div className="ld:p-6 pb-3">
      <div className="mx-auto space-y-6">
        <div className="flex flex-col gap-5 text-start mb-8">
          <Typo as="p" className="md:text-3xl text-xl font-bold">
            Friends & Requests
          </Typo>
          <Typo className="text-[20px]" color="grey" fontFamily="poppins" fontVariant="p3">
            Manage your friends and friend requests
          </Typo>
        </div>

        <div className="md:space-y-10 flex flex-col md:px-36">
          {friendsData?.length > 0 ? (
            <FriendsList friends={friendsData} onUnfriend={handleUnfriend} />
          ) : (
            <Typo className="mt-3" color="white" fontFamily="poppins" fontVariant="p2">
              No friends yet
            </Typo>
          )}

          {friendRequestsReceived?.length > 0 ? (
            <FriendRequestsReceived
              requests={friendRequestsReceived}
              onAccept={handleAcceptRequest}
              onReject={handleRejectRequest}
            />
          ) : (
            <Typo className="mt-3" color="white" fontFamily="poppins" fontVariant="p2">
              No incoming requests
            </Typo>
          )}

          {friendRequestsSent?.length > 0 ? (
            <FriendRequestsSent requests={friendRequestsSent} onCancel={handleCancelRequest} />
          ) : (
            <Typo className="mt-3" color="white" fontFamily="poppins" fontVariant="p2">
              No pending requests
            </Typo>
          )}
        </div>
      </div>
    </div>
  )
}

export default Friends
