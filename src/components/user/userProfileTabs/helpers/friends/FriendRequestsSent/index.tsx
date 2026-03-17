import Button from '@/components/ui/Button'
import Typo from '@/components/ui/Typo'

interface FriendRequest {
  _id: string
  nickname: string
  profileImage: string
}

interface FriendRequestsSentProps {
  requests: FriendRequest[]
  onCancel?: (requestId: string) => void
}

export const FriendRequestsSent = ({ requests, onCancel }: FriendRequestsSentProps) => {
  return (
    <div className="rounded-lg lg:border shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6">
        <Typo fontFamily="poppins" fontVariant="p1">
          Friend Requests Sent ({requests.length})
        </Typo>
      </div>
      <div className="lg:p-6 pt-0">
        {requests.length === 0 ? (
          <Typo color="grey" fontVariant="p2">
            No pending requests
          </Typo>
        ) : (
          <div className="space-y-3">
            {requests.map(request => (
              <div
                key={request._id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <img
                    alt={request.nickname}
                    className="w-10 h-10 rounded-full object-cover"
                    src={
                      request.profileImage === 'PROFILE.jpeg'
                        ? 'https://defendr.gg/assets/images/default-user-icon.jpg'
                        : request.profileImage
                    }
                  />
                  <Typo fontFamily="poppins" fontVariant="p3">
                    {request.nickname}
                  </Typo>
                </div>
                <Typo
                  className="hidden md:block"
                  color="grey"
                  fontFamily="poppins"
                  fontVariant="p3"
                >
                  Request pending
                </Typo>
                {onCancel && (
                  <Button
                    className="w-auto"
                    label="Cancel"
                    textClassName="font-poppins"
                    variant="contained-gray"
                    onClick={() => onCancel(request._id)}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
