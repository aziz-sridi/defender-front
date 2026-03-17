'use client'

import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useMemo, useState, useCallback, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Icon } from '@iconify/react'
import { toast } from 'sonner'

import MatchProfileContent from '@/components/match/MatchProfileContent'
import { useMatchProfile } from '@/hooks/useMatchProfile'
import Button from '@/components/ui/Button'
import Typo from '@/components/ui/Typo'
import { uploadImage } from '@/services/imageUploadService'

export default function TournamentMatchProfileDynamicPage() {
  const params = useParams<{ id: string; matchId: string }>()
  const { data: session } = useSession()

  const router = useRouter()

  const matchId = params.matchId

  const [activeTab, setActiveTab] = useState<'chat' | 'screenshots' | 'requests'>('chat')
  const [newMessage, setNewMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [moreMenuOpen, setMoreMenuOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [currentGameNumber, setCurrentGameNumber] = useState(1)
  const [isGameActive, setIsGameActive] = useState(false)
  const moreMenuRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Save game state to localStorage whenever it changes
  useEffect(() => {
    if (!matchId) {
      return
    }

    const gameStateKey = `game_state_${matchId}`
    const gameState = {
      gameNumber: currentGameNumber,
      gameActive: isGameActive,
    }

    localStorage.setItem(gameStateKey, JSON.stringify(gameState))
  }, [matchId, currentGameNumber, isGameActive])

  // Listen for localStorage changes from other tabs/pages + polling for same-tab updates
  useEffect(() => {
    if (!matchId) {
      return
    }

    const gameStateKey = `game_state_${matchId}`
    let lastKnownState = ''

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === gameStateKey && event.newValue) {
        try {
          const { gameNumber, gameActive } = JSON.parse(event.newValue)
          setCurrentGameNumber(gameNumber || 1)
          setIsGameActive(gameActive || false)
          lastKnownState = event.newValue
        } catch {
          // Ignore invalid JSON
        }
      }
    }

    // Polling to catch same-tab changes that storage event won't detect
    const pollForChanges = () => {
      try {
        const currentStorageState = localStorage.getItem(gameStateKey)
        if (currentStorageState && currentStorageState !== lastKnownState) {
          const { gameNumber, gameActive } = JSON.parse(currentStorageState)
          setCurrentGameNumber(gameNumber || 1)
          setIsGameActive(gameActive || false)
          lastKnownState = currentStorageState
        }
      } catch {
        // Ignore errors
      }
    }

    // Initialize lastKnownState
    const initialState = localStorage.getItem(gameStateKey)
    if (initialState) {
      lastKnownState = initialState
    }

    window.addEventListener('storage', handleStorageChange)
    const pollInterval = setInterval(pollForChanges, 1000) // Check every second

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(pollInterval)
    }
  }, [matchId])

  // Extract user + team ids from session
  const currentUserId = useMemo(() => {
    const raw = session?.user as unknown as { _id?: string; id?: string }
    return raw?._id || raw?.id
  }, [session?.user])

  const userTeamIds = useMemo(() => {
    const rawTeams = (session?.user as unknown as { teams?: unknown })?.teams
    if (!Array.isArray(rawTeams)) {
      return []
    }
    return rawTeams
      .map(t => (typeof t === 'string' ? t : t?._id || t?.id))
      .filter((v): v is string => Boolean(v))
  }, [session?.user])

  // Close more menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setMoreMenuOpen(false)
      }
    }

    if (moreMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [moreMenuOpen])

  const {
    state,
    isLoading,
    error,
    messages,
    sendMessage,
    typingUsers,
    emitTyping,
    emitStopTyping,
    getUsername,
    getUserTeam,
    isUserAdmin,
  } = useMatchProfile({
    matchId,
    currentUserId,
    userTeamIds,
    adminContext: false,
  })

  // Detect game state from chat messages and sync localStorage
  useEffect(() => {
    if (!matchId || !messages || messages.length === 0) {
      return
    }

    // Find the latest system message to determine current game state
    const systemMessages = messages.filter(msg => msg.content.startsWith('[SYSTEM]'))
    const latestSystemMessage = systemMessages[systemMessages.length - 1]

    let detectedGameNumber = 1
    let detectedGameActive = false

    if (latestSystemMessage) {
      const content = latestSystemMessage.content

      // Extract game number from messages like "🚀 Game 5 started between..." or "🏁 Game 5 ended between..."
      const gameNumberMatch = content.match(/Game (\d+)/)
      if (gameNumberMatch) {
        const gameNum = parseInt(gameNumberMatch[1], 10)

        if (content.includes('started') || content.includes('🚀')) {
          detectedGameNumber = gameNum
          detectedGameActive = true
        } else if (content.includes('ended') || content.includes('🏁')) {
          detectedGameNumber = gameNum + 1 // Next game after the one that ended
          detectedGameActive = false
        }
      }
    }

    // Only update if the detected state is different from current state
    if (detectedGameNumber !== currentGameNumber || detectedGameActive !== isGameActive) {
      setCurrentGameNumber(detectedGameNumber)
      setIsGameActive(detectedGameActive)

      // Update localStorage too
      const gameStateKey = `game_state_${matchId}`
      const gameState = {
        gameNumber: detectedGameNumber,
        gameActive: detectedGameActive,
      }
      localStorage.setItem(gameStateKey, JSON.stringify(gameState))
    }
  }, [matchId, messages, currentGameNumber, isGameActive])

  // Helper to determine message alignment based on teams
  const getMessageAlignment = useCallback(
    (messageSenderId: string) => {
      const senderTeam = getUserTeam(messageSenderId)
      const currentUserTeam = getUserTeam(currentUserId || '')

      // If organizer/admin, follow team order: Team A = left, Team B = right
      if (state?.isAdminView) {
        return senderTeam === 'team2' ? 'right' : 'left'
      }

      // For participants, show same team on same side
      if (senderTeam && currentUserTeam) {
        return senderTeam === currentUserTeam ? 'right' : 'left'
      }

      // Default: own messages on right, others on left
      return messageSenderId === currentUserId ? 'right' : 'left'
    },
    [getUserTeam, currentUserId, state?.isAdminView],
  )

  // Helper to determine if user is admin
  const isAdmin = useCallback(
    (messageSender: string) => {
      return isUserAdmin(messageSender) || state?.isAdminView
    },
    [isUserAdmin, state?.isAdminView],
  )

  if (!matchId) {
    return <div className="text-defendrRed font-poppins p-6">Missing match identifier.</div>
  }

  if (isLoading && !state) {
    return <div className="text-defendrGrey font-poppins p-6">Loading match…</div>
  }

  if (error) {
    return <div className="text-defendrRed font-poppins p-6">Failed to load match. {error}</div>
  }

  if (!state) {
    return <div className="text-defendrGrey font-poppins p-6">Match not found.</div>
  }

  let typingTimeout: NodeJS.Timeout | null = null

  const handleTyping = () => {
    emitTyping()

    // Clear existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout)
    }

    // Stop typing after 2 seconds of inactivity
    typingTimeout = setTimeout(() => {
      emitStopTyping()
    }, 2000)
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      return
    }

    try {
      setIsSubmitting(true)
      await sendMessage(newMessage)
      setNewMessage('')

      // Clear typing timeout when message is sent
      if (typingTimeout) {
        clearTimeout(typingTimeout)
        typingTimeout = null
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error sending message:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      // eslint-disable-next-line no-console
      console.error('Please select an image file')
      return
    }

    try {
      setIsUploading(true)
      const { imageUrl } = await uploadImage(file)

      // Send image URL as a message through the socket
      await sendMessage(`[IMAGE]${imageUrl}`)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error uploading image:', error)
    } finally {
      setIsUploading(false)
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleStartGame = async () => {
    if (!session?.user || isGameActive) {
      return
    }

    setIsGameActive(true)

    // Send system message
    const team1Name = state?.team1.name || 'Team 1'
    const team2Name = state?.team2.name || 'Team 2'
    const systemMessage = `[SYSTEM] 🚀 Game ${currentGameNumber} started between ${team1Name} and ${team2Name}.`
    try {
      await sendMessage(systemMessage)
      toast.success('Game started successfully!')
    } catch {
      toast.error('Failed to start game')
    }
  }

  const handleEndGame = async () => {
    if (!session?.user || !isGameActive) {
      return
    }

    setIsGameActive(false)
    const gameNumberToEnd = currentGameNumber
    setCurrentGameNumber(prev => prev + 1)

    // Send system message
    const team1Name = state?.team1.name || 'Team 1'
    const team2Name = state?.team2.name || 'Team 2'
    const systemMessage = `[SYSTEM] 🏁 Game ${gameNumberToEnd} ended between ${team1Name} and ${team2Name}.`
    try {
      await sendMessage(systemMessage)
      toast.success('Game ended successfully!')
    } catch {
      toast.error('Failed to end game')
    }
  }

  // Simple renderers (TODO: share richer ones from admin page if needed)
  const renderChatTab = () => (
    <div className="space-y-4">
      {/* Messages Container */}
      <div className="bg-defendrLightBlack border border-defendrGrey rounded-lg p-4 h-96 overflow-y-auto">
        {isLoading && messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-defendrGrey text-sm">Loading messages...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-defendrGrey text-sm">No messages yet</div>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map(message => {
              // Check if this is a system message
              if (message.content.startsWith('[SYSTEM]')) {
                return (
                  <div key={message._id} className="flex justify-center my-4">
                    <div className="bg-gradient-to-r from-defendrRed/20 via-defendrRed/40 to-defendrRed/20 border border-defendrRed/50 rounded-full px-6 py-2 max-w-md">
                      <div className="text-center">
                        <span className="text-white font-poppins text-sm">
                          {message.content.replace('[SYSTEM]', '')}
                        </span>
                        <div className="text-defendrGrey text-xs mt-1">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }

              // Regular message rendering
              const messageAlignment = getMessageAlignment(message.sender)
              const isAdminUser = isAdmin(message.sender)
              const username = getUsername(message.sender)
              const senderTeam = getUserTeam(message.sender)
              const isRightAligned = messageAlignment === 'right'

              // Check if this is an admin message - display in center like system messages
              if (isAdminUser) {
                return (
                  <div key={message._id} className="flex justify-center my-4">
                    <div className="bg-gradient-to-r from-yellow-400/30 via-orange-500/50 to-yellow-400/30 border-2 border-yellow-400 rounded-xl px-6 py-4 max-w-md">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <span className="text-white font-poppins text-sm font-bold">
                            👑 ADMIN: {username}
                          </span>
                          <span className="text-defendrGrey text-xs">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="text-white font-poppins text-sm font-medium">
                          {message.content.startsWith('[IMAGE]') ? (
                            <Image
                              unoptimized
                              alt="Admin uploaded image"
                              className="rounded-lg max-w-full h-auto max-h-48 object-cover mx-auto"
                              height={192}
                              src={message.content.replace('[IMAGE]', '')}
                              width={256}
                            />
                          ) : (
                            message.content
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }

              return (
                <div
                  key={message._id}
                  className={`flex items-start gap-3 ${
                    isRightAligned ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isAdminUser
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                        : senderTeam === 'team1'
                          ? 'bg-blue-500'
                          : senderTeam === 'team2'
                            ? 'bg-defendrRed'
                            : 'bg-gray-600'
                    }`}
                  >
                    <span className="text-white font-poppins text-xs">
                      {username.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  {/* Message Content */}
                  <div className={`flex-1 max-w-xs ${isRightAligned ? 'text-right' : 'text-left'}`}>
                    <div className="flex items-center gap-2 mb-1 justify-start">
                      <span
                        className={`font-poppins text-sm ${
                          isAdminUser
                            ? 'text-yellow-400'
                            : senderTeam === 'team1'
                              ? 'text-blue-400'
                              : senderTeam === 'team2'
                                ? 'text-defendrRed'
                                : 'text-white'
                        }`}
                      >
                        {isAdminUser ? '👑 ' : ''}
                        {username}
                        {message.sender === currentUserId ? ' (You)' : ''}
                      </span>
                      <span className="text-defendrGrey text-xs">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`inline-block rounded-2xl text-sm max-w-xs ${
                        message.content.startsWith('[IMAGE]') ? 'p-1' : 'p-3 break-words'
                      } ${
                        senderTeam === 'team1'
                          ? 'bg-blue-500 text-white'
                          : senderTeam === 'team2'
                            ? 'bg-defendrRed text-white'
                            : 'bg-gray-700 text-white'
                      } ${isAdminUser ? 'border border-yellow-400 shadow-lg' : ''}`}
                    >
                      {message.content.startsWith('[IMAGE]') ? (
                        <Image
                          unoptimized
                          alt="Uploaded image"
                          className="rounded-xl max-w-full h-auto max-h-64 object-cover"
                          height={256}
                          src={message.content.replace('[IMAGE]', '')}
                          width={300}
                        />
                      ) : (
                        message.content
                      )}
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Typing Indicators */}
            {typingUsers.length > 0 && (
              <div className="flex items-center gap-2 text-defendrGrey text-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-defendrGrey rounded-full animate-bounce" />
                  <div
                    className="w-2 h-2 bg-defendrGrey rounded-full animate-bounce"
                    style={{ animationDelay: '0.1s' }}
                  />
                  <div
                    className="w-2 h-2 bg-defendrGrey rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  />
                </div>
                <span>
                  {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="flex gap-3 p-4 bg-defendrLightBlack border-t border-defendrGrey">
        {/* Hidden file input for image uploads */}
        <input
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          type="file"
          onChange={handleImageUpload}
        />
        <input
          className="flex-1 px-4 py-3 bg-defendrBg border border-defendrGrey rounded-xl text-white placeholder-defendrGrey focus:border-defendrRed focus:outline-none transition-colors"
          disabled={
            isSubmitting ||
            (state.status.toLowerCase() === 'completed' && !isUserAdmin(currentUserId || ''))
          }
          placeholder={
            state.status.toLowerCase() === 'completed' && isUserAdmin(currentUserId || '')
              ? 'Admin message (match completed)'
              : state.status.toLowerCase() === 'completed'
                ? 'Match completed - chat disabled'
                : 'Enter your message...'
          }
          type="text"
          value={newMessage}
          onChange={e => {
            setNewMessage(e.target.value)
            if (e.target.value.trim()) {
              handleTyping()
            }
          }}
          onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
        />
        <div className="flex items-stretch gap-2">
          <Button
            className="!w-auto px-5 h-[48px] min-w-[120px] flex gap-2"
            disabled={state.status.toLowerCase() === 'completed'}
            label={
              <span className="flex items-center gap-2">
                {state.status.toLowerCase() === 'completed' ? (
                  <>
                    <Icon className="w-4 h-4" icon="mdi:check-circle-outline" />
                    MATCH COMPLETED
                  </>
                ) : !isGameActive ? (
                  <>
                    <Icon className="w-4 h-4" icon="mdi:play-circle-outline" />
                    START GAME {currentGameNumber}
                  </>
                ) : (
                  <>
                    <Icon className="w-4 h-4" icon="mdi:stop-circle-outline" />
                    END GAME {currentGameNumber}
                  </>
                )}
              </span>
            }
            size="xs"
            textClassName="font-poppins text-sm"
            variant={
              state.status.toLowerCase() === 'completed'
                ? 'outlined-grey'
                : !isGameActive
                  ? 'outlined-red'
                  : 'contained-red'
            }
            onClick={
              state.status.toLowerCase() === 'completed'
                ? undefined
                : !isGameActive
                  ? handleStartGame
                  : handleEndGame
            }
          />
          <Button
            className="!w-auto px-5 h-[48px] min-w-[90px] flex gap-2"
            disabled={
              isSubmitting ||
              !newMessage.trim() ||
              (state.status.toLowerCase() === 'completed' && !isUserAdmin(currentUserId || ''))
            }
            label={
              isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  SENDING
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Icon className="w-4 h-4" icon="mdi:send" />
                  SEND
                </span>
              )
            }
            size="xs"
            textClassName="font-poppins text-sm"
            variant={newMessage.trim() ? 'contained-red' : 'outlined-grey'}
            onClick={handleSendMessage}
          />
          {/* Three dots more menu */}
          <div ref={moreMenuRef} className="relative">
            <button
              aria-expanded={moreMenuOpen}
              aria-haspopup="true"
              className="w-12 h-[48px] flex items-center justify-center rounded-xl border border-defendrGrey text-defendrWhite hover:border-defendrLightGrey transition-colors"
              type="button"
              onClick={() => setMoreMenuOpen(!moreMenuOpen)}
            >
              <Icon className="w-5 h-5" icon="mdi:dots-vertical" />
              <span className="sr-only">More options</span>
            </button>
            {moreMenuOpen && (
              <div className="absolute right-0 bottom-full mb-2 z-20 w-52 bg-defendrLightBlack/95 backdrop-blur-sm border border-defendrGrey rounded-lg shadow-xl p-2 flex flex-col gap-1">
                <button
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-defendrGrey/20 text-left transition-colors"
                  disabled={isUploading}
                  type="button"
                  onClick={() => {
                    setMoreMenuOpen(false)
                    handleUploadClick()
                  }}
                >
                  <Icon className="w-4 h-4 text-defendrRed" icon="mdi:file-upload-outline" />
                  <Typo as="span" color="white" fontFamily="poppins" fontVariant="p5">
                    {isUploading ? 'Uploading...' : 'Upload File'}
                  </Typo>
                </button>
                <button
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-defendrGrey/20 text-left transition-colors"
                  type="button"
                  onClick={() => {
                    setMoreMenuOpen(false)
                    /* TODO: implement create request */
                  }}
                >
                  <Icon className="w-4 h-4 text-defendrRed" icon="mdi:clipboard-plus-outline" />
                  <Typo as="span" color="white" fontFamily="poppins" fontVariant="p5">
                    Create Request
                  </Typo>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  const renderScreenshotsTab = () => (
    <div className="text-defendrGrey text-sm">Screenshots (participant view) coming soon.</div>
  )

  const renderRequestsTab = () => (
    <div className="text-defendrGrey text-sm">Requests list coming soon (read-only here).</div>
  )

  return (
    <div className="p-6">
      <div className="mb-4">
        <Button
          className="!w-auto px-4"
          label={
            <span className="flex items-center gap-2">
              <Icon className="w-4 h-4" icon="mdi:arrow-left" />
              Go back
            </span>
          }
          size="xs"
          variant="outlined-grey"
          onClick={() => router.push(`/tournament/${params?.id}?tab=matches`)}
        />
      </div>
      <MatchProfileContent
        activeTab={activeTab}
        isAdminView={false}
        isLoading={isLoading}
        matchData={{
          id: state.matchId,
          team1: { name: state.team1.name, logo: '', score: state.team1.score },
          team2: { name: state.team2.name, logo: '', score: state.team2.score },
          status: state.status,
        }}
        renderChatTab={renderChatTab}
        renderRequestsTab={renderRequestsTab}
        renderScreenshotsTab={renderScreenshotsTab}
        resolveModalOpen={false}
        onChangeTab={setActiveTab}
        onCloseResolve={() => {}}
      />
    </div>
  )
}
