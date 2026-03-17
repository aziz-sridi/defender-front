'use client'

import { useState, useEffect, useRef } from 'react'
import { Send } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'

import { sendMessageToBot, getChatHistory } from '@/services/chatBot'
import { MessageIcon, CloseIcon } from '@/components/ui/iconsIconify'
import Typo from '@/components/ui/Typo'

interface Message {
  role: 'user' | 'bot'
  content: string
  timestamp: string
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [sessionId, setSessionId] = useState<string>('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let storedSession = localStorage.getItem('chatSessionId')
    if (!storedSession) {
      storedSession = uuidv4()
      localStorage.setItem('chatSessionId', storedSession)
    }
    setSessionId(storedSession)
    ;(async () => {
      try {
        const history = await getChatHistory(storedSession!)
        console.log('Chat history:', history)
        if (history?.messages?.length > 0) {
          const formatted = history.messages.map((msg: any) => ({
            role: msg.sender,
            content: msg.text,
            timestamp: msg.timestamp || new Date().toISOString(),
          }))
          setMessages(formatted)
        } else {
          console.log('no history')
          setMessages([
            {
              role: 'bot',
              content: 'Hello, I am your DefBot assistant. What can I do for you today?',
              timestamp: new Date().toISOString(),
            },
          ])
        }
      } catch (error) {
        console.error(error)
      }
    })()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || !sessionId) {
      return
    }

    const newMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    }
    setMessages(prev => [...prev, newMessage])
    const userInput = input
    setInput('')

    try {
      const res = await sendMessageToBot({ message: userInput, sessionId })
      const botMessage: Message = {
        role: 'bot',
        content: res?.reply,
        timestamp: new Date().toISOString(),
      }
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Bot error:', error)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          className="bg-defendrSilver text-white p-6 rounded-full shadow-lg hover:bg-defendrSilver transition animate-bounce"
          onClick={() => setIsOpen(true)}
        >
          <MessageIcon />
        </button>
      )}

      {isOpen && (
        <div className="w-80 h-96 bg-defendrSilver rounded-2xl shadow-xl flex flex-col">
          <div className="bg-defendrLightBlack text-white p-3 flex justify-between items-center rounded-t-2xl">
            <span className="font-bold">Guardian</span>
            <button onClick={() => setIsOpen(false)}>
              <CloseIcon />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] px-3 py-2 rounded-xl w-auto text-sm break-words ${
                    msg.role === 'user'
                      ? 'bg-red-800 text-gray-900'
                      : 'bg-defendrLightBlack text-white'
                  }`}
                >
                  <Typo fontFamily="poppins" fontVariant="p5">
                    {msg.content}
                  </Typo>
                  <div className="text-xs text-gray-400 mt-1 text-right">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t flex items-center">
            <input
              className="flex-1 border rounded-full px-3 py-2 text-sm outline-none"
              placeholder="Type your message..."
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button
              className="ml-2 bg-defendrLightBlack text-white p-2 rounded-full"
              onClick={handleSend}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
