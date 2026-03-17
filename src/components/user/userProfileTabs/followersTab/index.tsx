import { useRouter } from 'next/navigation'
import { userImageSanitizer, DEFAULT_IMAGES } from '@/utils/imageUrlSanitizer'

interface UserData {
  _id: string
  nickname: string
  profileImage: string
}

export default function FollowersTab({
  followers,
  following,
}: {
  followers?: UserData[] | null
  following?: UserData[] | null
}) {
  const safeFollowers = Array.isArray(followers) ? followers : []
  const safeFollowing = Array.isArray(following) ? following : []
  const router = useRouter()

  const UserCard = ({ user }: { user: UserData }) => (
    <div
      className="flex items-center gap-3 bg-[#212529] hover:bg-[#2c3036] rounded-xl p-3 cursor-pointer transition-colors duration-200"
      onClick={() => router.push(`/user/${user._id}/profile`)}
    >
      <img
        alt={user.nickname}
        className="w-10 h-10 rounded-full object-cover shrink-0 border border-white/10"
        src={userImageSanitizer(user.profileImage, DEFAULT_IMAGES.USER)}
      />
      <span className="text-sm text-white font-medium font-poppins truncate">{user.nickname}</span>
    </div>
  )

  return (
    <div className="flex flex-col gap-6 p-2 sm:p-4">
      {/* Followers */}
      <section>
        <h2 className="text-white font-bold font-poppins mb-3">
          Followers
          <span className="ml-2 text-gray-500 font-normal text-sm">({safeFollowers.length})</span>
        </h2>
        {safeFollowers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {safeFollowers.map(user => (
              <UserCard key={user._id} user={user} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm font-poppins">No followers yet</p>
        )}
      </section>

      {/* Following */}
      <section>
        <h2 className="text-white font-bold font-poppins mb-3">
          Following
          <span className="ml-2 text-gray-500 font-normal text-sm">({safeFollowing.length})</span>
        </h2>
        {safeFollowing.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {safeFollowing.map(user => (
              <UserCard key={user._id} user={user} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm font-poppins">Not following anyone</p>
        )}
      </section>
    </div>
  )
}
