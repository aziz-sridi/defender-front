import Button from '@/components/ui/Button'
import Typo from '@/components/ui/Typo'
interface FriendRequest {
  _id: string
  nickname: string
  profileImage: string
}

interface FriendRequestsReceivedProps {
  requests: FriendRequest[]
  onAccept: (requestId: string) => void
  onReject: (requestId: string) => void
}

export const FriendRequestsReceived = ({
  requests,
  onAccept,
  onReject,
}: FriendRequestsReceivedProps) => {
  return (
    <div className="rounded-lg lg:border shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6">
        <Typo fontFamily="poppins" fontVariant="p1">
          Friend Requests Received ({requests.length})
        </Typo>
      </div>
      <div className="lg:p-6 pt-0">
        {requests.length === 0 ? (
          <Typo color="grey" fontVariant="p2">
            No incoming requests
          </Typo>
        ) : (
          <div className="space-y-3">
            {requests.map(request => (
              <div
                key={request._id}
                className="flex flex-col md:flex-row items-center justify-between p-3 border rounded-lg"
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
                <div className="flex mt-5 md:mt-0 gap-6 md:gap-2">
                  <Button
                    className="w-auto"
                    label="Accept"
                    textClassName="font-poppins"
                    variant="contained-green"
                    onClick={() => onAccept(request._id)}
                  />
                  <Button
                    className="w-auto"
                    label="Reject"
                    textClassName="font-poppins"
                    variant="contained-red"
                    onClick={() => onReject(request._id)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
