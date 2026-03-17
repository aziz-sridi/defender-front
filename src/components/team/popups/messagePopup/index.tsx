'use client'

import Button from '@/components/ui/Button'

type MessagePopupProps = {
  opened: boolean
  setOpened: (open: boolean) => void
  message: string
  setMessage: (msg: string) => void
  onSend: (msg: string) => void
}

const MessagePopup = ({ opened, setOpened, message, setMessage, onSend }: MessagePopupProps) => {
  const handleSend = () => {
    if (!message.trim()) {
      return
    }
    onSend(message)
    setMessage('')
    setOpened(false)
  }

  return (
    <>
      {opened && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white">Send a Message</h2>
              <button
                className="text-gray-400 hover:text-white text-xl"
                onClick={() => setOpened(false)}
              >
                &times;
              </button>
            </div>

            <textarea
              className="w-full h-32 border border-gray-700 bg-gray-800 text-white rounded p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write your message..."
              value={message}
              onChange={e => setMessage(e.target.value)}
            />

            <div className="mt-4 text-right">
              <Button
                className=" text-white w-auto px-4 py-2 rounded disabled:opacity-50"
                disabled={!message.trim()}
                label="send"
                onClick={handleSend}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default MessagePopup
