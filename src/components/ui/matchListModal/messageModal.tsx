import React from 'react'

import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'

interface Message {
  id: number
  user: string
  message: string
  time: string
}

interface Props {
  isOpen: boolean
  onClose: () => void
  messages: Message[]
  input: string
  setInput: (text: string) => void
  onSend: () => void
}

export default function MessageModal({
  isOpen,
  onClose,
  messages,
  input,
  setInput,
  onSend,
}: Props) {
  return (
    <Modal className="max-w-lg" isOpen={isOpen} title="Chat with Teammates" onClose={onClose}>
      <div className="space-y-4">
        <div className="h-64 bg-defendrBg rounded-lg p-4 overflow-y-auto space-y-3">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.user === 'You' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-3 py-2 rounded-lg ${
                  msg.user === 'You'
                    ? 'bg-defendrRed text-white'
                    : 'bg-defendrLightBlack text-white border border-defendrGrey'
                }`}
              >
                <div className="text-xs text-defendrGrey mb-1 font-poppins">
                  {msg.user} • {msg.time}
                </div>
                <div className="text-sm font-poppins">{msg.message}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            className="flex-1 bg-defendrLightBlack border border-defendrGrey rounded-lg px-3 py-2 text-white placeholder-defendrGrey focus:border-defendrRed outline-none font-poppins"
            placeholder="Type your message..."
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onSend()}
          />
          <Button label="Send" size="xxs" variant="contained-red" onClick={onSend} />
        </div>
      </div>
    </Modal>
  )
}
