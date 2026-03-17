'use client'
import { getUserById } from '@/services/userService'
import { User } from '@/types/userType'
import { ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const WinnerCard = ({ winner, prize }: { winner: string; prize: string }) => {
  const [winnerUser, setWinnerUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWinnerUser = async () => {
      try {
        setLoading(true)
        const user = await getUserById(winner)
        console.log('user ====================================>', user)
        setWinnerUser(user)
      } catch (error) {
        console.error('Error fetching winner user:', error)
        setWinnerUser(null)
      } finally {
        setLoading(false)
      }
    }
    fetchWinnerUser()
  }, [winner])

  if (loading) {
    return (
      <div className="p-4 border-2 border-amber-400 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-10 aspect-square rounded-full bg-gray-700 animate-pulse" />
          <div className="h-6 w-32 bg-gray-700 rounded animate-pulse max-xs:sr-only" />
        </div>
        <div className="flex items-center justify-center gap-6">
          <div className="flex flex-col items-center justify-center">
            <div className="h-4 w-12 bg-gray-700 rounded animate-pulse mb-2" />
            <div className="h-8 w-8 bg-gray-700 rounded animate-pulse" />
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="h-4 w-12 bg-gray-700 rounded animate-pulse mb-2" />
            <div className="h-6 w-16 bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
        <div className="h-10 w-12 bg-gray-700 rounded-lg animate-pulse" />
      </div>
    )
  }

  return (
    <>
      {winnerUser ? (
        <div className="p-4 border-2 border-amber-400 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src={winnerUser?.profileImage || '/assets/default-user-icon.jpg'}
              alt="user pfp"
              width={50}
              height={50}
              className="size-10 aspect-square object-cover rounded-full border border-amber-400"
            />
            <h6 className="text-xl font-semibold max-xs:sr-only">
              {winnerUser?.fullname || 'Unknown User'}
            </h6>
          </div>
          <div className="flex items-center justify-center gap-6">
            <div className="flex flex-col items-center justify-center">
              <p className="text-defendrGhostGrey text-sm">Top 1</p>
              <p className="text-3xl font-semibold">🥇</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <p className="text-defendrGhostGrey text-sm">Prize</p>
              <p className="text-xl font-semibold">{prize}</p>
            </div>
          </div>
          <button
            type="button"
            className="px-2 sm:px-4 py-2 flex items-center justify-center bg-amber-400 text-black rounded-lg text-sm"
          >
            <span className="max-sm:sr-only">View Profile</span>
            <ChevronRight strokeWidth={1.5} />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-800">
          <p className="text-defendrGhostGrey">No winner information available</p>
        </div>
      )}
    </>
  )
}

export default WinnerCard
