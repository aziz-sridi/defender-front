import Button from '@/components/ui/Button'
import Typo from '@/components/ui/Typo'

interface Friend {
  _id: string
  nickname: string
  profileImage: string
}

interface FriendsListProps {
  friends: Friend[]
  onUnfriend: (friendId: string) => void
}

export const FriendsList = ({ friends, onUnfriend }: FriendsListProps) => {
  return (
    <div className="rounded-lg lg:border shadow-sm ">
      <div className="flex flex-col space-y-1.5 p-6">
        <Typo className="text-[18px]" fontFamily="poppins" fontVariant="p1">
          Friends ({friends.length})
        </Typo>
      </div>
      <div className="lg:p-6 pt-0 ">
        {friends.length === 0 ? (
          <Typo color="grey" fontFamily="poppins" fontVariant="p2">
            No friends yet
          </Typo>
        ) : (
          <div className="space-y-3 ">
            {friends.map(friend => (
              <div
                key={friend._id}
                className="flex w-auto items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <img
                    alt={friend.nickname}
                    className="w-10 h-10 rounded-full object-cover"
                    src={
                      friend.profileImage === 'PROFILE.jpeg'
                        ? 'https://defendr.gg/assets/images/default-user-icon.jpg'
                        : friend.profileImage
                    }
                  />
                  <Typo fontFamily="poppins" fontVariant="p3">
                    {friend.nickname}
                  </Typo>
                </div>
                <Button
                  className="w-auto"
                  label="Unfriend"
                  textClassName="font-poppins"
                  variant="contained-gray"
                  onClick={() => onUnfriend(friend._id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
