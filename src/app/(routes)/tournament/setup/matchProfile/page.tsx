'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { toast } from 'sonner'
import { Icon } from '@iconify/react'

import Typo from '@/components/ui/Typo'
import Button from '@/components/ui/Button'
import { useMatchProfile } from '@/hooks/useMatchProfile'
import { approveScreenshot } from '@/services/matchService'
import { Message } from '@/types/messageType'
import ninjaImage from '@/components/assets/tournament/ninja.jpg'
import skullImage from '@/components/assets/tournament/skull.jpg'

export default function MatchProfilePage() {
  // Track approved screenshots by game and participant, persisted in localStorage
  const [approvedScreenshots, setApprovedScreenshots] = useState<{ [key: string]: boolean }>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('approvedScreenshots')
        return stored ? JSON.parse(stored) : {}
      } catch {
        return {}
      }
    }
    return {}
  })
  const searchParams = useSearchParams()
  const matchId = searchParams.get('matchId')
  const { data: session } = useSession()

  const [activeTab, setActiveTab] = useState<'chat' | 'screenshots' | 'requests'>('chat')
  const [newMessage, setNewMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [zoomedImage, setZoomedImage] = useState<string | null>(null)
  const [currentGameNumber, setCurrentGameNumber] = useState(1)
  const [isGameActive, setIsGameActive] = useState(false)
  const [selectedGameTab, setSelectedGameTab] = useState(1)
  const [team1Score, setTeam1Score] = useState<number | null>(null)
  const [team2Score, setTeam2Score] = useState<number | null>(null)

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

  // Save game state to localStorage whenever it changes
  useEffect(() => {
    // Sync local score state with initial state
    if (state) {
      setTeam1Score(state.team1.score)
      setTeam2Score(state.team2.score)
    }
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
    matchId: matchId || '',
    currentUserId,
    userTeamIds,
    adminContext: true, // This is the admin setup page
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

  // Sync selectedGameTab with currentGameNumber when it changes
  useEffect(() => {
    setSelectedGameTab(currentGameNumber)
  }, [currentGameNumber])

  // Helper to determine message alignment based on teams
  const getMessageAlignment = useCallback(
    (messageSenderId: string) => {
      const senderTeam = getUserTeam(messageSenderId)
      const isAdmin = isUserAdmin(messageSenderId)

      // Admin messages always go right
      if (isAdmin) {
        return 'right'
      }

      // Team-based alignment: Team 1 = left (blue), Team 2 = right (red)
      if (senderTeam === 'team1') {
        return 'left'
      } else if (senderTeam === 'team2') {
        return 'right'
      }

      // For unknown users, align left as default
      return 'left'
    },
    [getUserTeam, isUserAdmin, state, currentUserId, userTeamIds],
  )

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
    } catch (sendError) {
    } finally {
      setIsSubmitting(false)
    }
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

  // Handle start game
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

  // Handle end game
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

  const handleApproveScreenshot = async (winnerId: string, teamName: string) => {
    // Mark screenshot as approved for this game and participant
    const approvalKey = `${selectedGameTab}_${winnerId}`
    if (!matchId || !state) {
      return
    }

    try {
      const result = await approveScreenshot(matchId, winnerId, selectedGameTab)

      // Show success toast notification
      const message = result.match_completed
        ? `🏆 Screenshot approved for ${teamName}! Match completed! Final score: ${result.winner_score}`
        : `✅ Screenshot approved for ${teamName}! Score updated: ${result.winner_score}`

      toast.success(message)

      // Update score in local state so UI updates instantly
      if (winnerId === state.team1.participantId) {
        setTeam1Score(result.winner_score)
      } else if (winnerId === state.team2.participantId) {
        setTeam2Score(result.winner_score)
      }
      // If match completed, update status
      if (result.match_completed) {
        state.status = 'completed'
      }
      // Persist approve state in localStorage and disable button only on success
      setApprovedScreenshots(prev => {
        const updated = { ...prev, [approvalKey]: true }
        try {
          localStorage.setItem('approvedScreenshots', JSON.stringify(updated))
        } catch {}
        return updated
      })
    } catch (error: any) {
      // Show error toast notification with backend message
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        '❌ Error approving screenshot. Please try again.'
      toast.error(errorMsg)
    }
  }

  const renderChatTab = () => (
    <div className="flex flex-col h-[400px] sm:h-[500px]">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-4">
        {isLoading && messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <Typo color="grey" fontVariant="p4">
              Loading messages...
            </Typo>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <Typo color="grey" fontVariant="p4">
              No messages yet
            </Typo>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map(message => {
              // Check if this is a system message
              if (message.content.startsWith('[SYSTEM]')) {
                return (
                  <div key={message._id} className="flex justify-center my-4">
                    <div className="bg-defendrGrey/20 border border-defendrGrey rounded-lg px-4 py-2 max-w-xs text-center">
                      <Typo color="grey" fontVariant="p5" fontWeight="medium">
                        {message.content.replace('[SYSTEM]', '').trim()}
                      </Typo>
                    </div>
                  </div>
                )
              }

              const messageAlignment = getMessageAlignment(message.sender)
              const isAdminUser = isUserAdmin(message.sender)
              const username = getUsername(message.sender)

              // Check if this is an admin message - display in center like system messages
              if (isAdminUser) {
                return (
                  <div key={message._id} className="flex justify-center my-4">
                    <div className="bg-gradient-to-r from-yellow-400/30 via-orange-500/50 to-yellow-400/30 border-2 border-yellow-400 rounded-xl px-6 py-4 max-w-md text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Typo color="white" fontVariant="p5" fontWeight="bold">
                          👑 ADMIN: {username}
                        </Typo>
                        <Typo color="grey" fontVariant="p6">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </Typo>
                      </div>
                      <Typo color="white" fontVariant="p4" fontWeight="medium">
                        {message.content.startsWith('[IMAGE]') ? (
                          <Image
                            unoptimized
                            alt="Admin uploaded image"
                            className="rounded-lg max-w-full h-auto max-h-48 object-cover mx-auto"
                            height={192}
                            src={message.content.replace('[IMAGE]', '')}
                            width={256}
                            onClick={() => setZoomedImage(message.content.replace('[IMAGE]', ''))}
                          />
                        ) : (
                          message.content
                        )}
                      </Typo>
                    </div>
                  </div>
                )
              }
              const senderTeam = getUserTeam(message.sender)
              const isRightAligned = messageAlignment === 'right'

              return (
                <div
                  key={message._id}
                  className={`flex items-start gap-3 ${
                    isRightAligned ? 'flex-row-reverse' : 'flex-row'
                  } ${isRightAligned ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-full overflow-hidden flex items-center justify-center ${
                      isAdminUser
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                        : senderTeam === 'team1'
                          ? 'bg-blue-700'
                          : senderTeam === 'team2'
                            ? 'bg-defendrRed'
                            : 'bg-gray-600'
                    }`}
                  >
                    {isAdminUser ? (
                      <Typo color="white" fontVariant="p4" fontWeight="bold">
                        👑
                      </Typo>
                    ) : senderTeam === 'team1' ? (
                      <Image
                        alt={state?.team1.name || 'Team 1'}
                        className="w-full h-full object-cover"
                        height={32}
                        src={ninjaImage}
                        width={32}
                      />
                    ) : senderTeam === 'team2' ? (
                      <Image
                        alt={state?.team2.name || 'Team 2'}
                        className="w-full h-full object-cover"
                        height={32}
                        src={skullImage}
                        width={32}
                      />
                    ) : (
                      <Typo color="white" fontVariant="p4" fontWeight="bold">
                        {username.charAt(0).toUpperCase()}
                      </Typo>
                    )}
                  </div>

                  {/* Message Content */}
                  <div className={`flex-1 ${isRightAligned ? 'flex flex-col items-end' : ''}`}>
                    <div
                      className={`flex items-center gap-2 mb-2 ${isRightAligned ? 'flex-row-reverse' : ''}`}
                    >
                      <Typo color="white" fontVariant="p4" fontWeight="semibold">
                        {isAdminUser ? '👑 ' : ''}
                        {username}
                        {message.sender === currentUserId ? ' (You)' : ''}
                      </Typo>
                      <Typo color="grey" fontVariant="p5">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </Typo>
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`rounded-3xl max-w-sm inline-block ${
                        message.content.startsWith('[IMAGE]') ? 'p-1' : 'px-4 py-3'
                      } ${
                        isAdminUser
                          ? 'bg-gray-600' // Admin messages in grey
                          : senderTeam === 'team1'
                            ? 'bg-blue-600'
                            : senderTeam === 'team2'
                              ? 'bg-defendrRed'
                              : 'bg-gray-600' // Default grey for unknown
                      }`}
                    >
                      {message.content.startsWith('[IMAGE]') ? (
                        <Image
                          unoptimized
                          alt="Uploaded image"
                          className="rounded-2xl max-w-full h-auto max-h-64 object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          height={256}
                          src={message.content.replace('[IMAGE]', '')}
                          width={300}
                          onClick={() => setZoomedImage(message.content.replace('[IMAGE]', ''))}
                        />
                      ) : (
                        <Typo color="white" fontVariant="p4">
                          {message.content}
                        </Typo>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Typing Indicators */}
            {typingUsers.length > 0 && (
              <div className="flex items-center gap-2">
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
                <Typo color="grey" fontVariant="p5">
                  {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                </Typo>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-defendrRed p-2 sm:p-3 border-t border-defendrGrey">
        <div className="flex items-center gap-1 sm:gap-2">
          <input
            className="flex-1 bg-defendrBg border-0 rounded-full px-3 sm:px-4 py-2 text-white placeholder-gray-400 focus:outline-none text-xs sm:text-sm"
            disabled={isSubmitting}
            placeholder={
              state?.status?.toLowerCase() === 'completed'
                ? 'Admin message (match completed)'
                : 'Enter your message'
            }
            type="text"
            value={newMessage}
            onChange={e => {
              setNewMessage(e.target.value)
              if (e.target.value.trim()) {
                handleTyping()
              }
            }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleSendMessage()
              }
            }}
          />
          <button
            className="text-white hover:text-gray-300 p-1 transition-colors disabled:opacity-50"
            disabled={!newMessage.trim() || isSubmitting}
            onClick={handleSendMessage}
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5 rotate-90" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  )

  // Helper function to organize screenshots by game
  const organizeScreenshotsByGame = () => {
    const imageMessages = messages.filter(msg => msg.content.startsWith('[IMAGE]'))
    const systemMessages = messages.filter(msg => msg.content.startsWith('[SYSTEM]'))

    // Create game periods based on system messages
    const gamePeriods: { gameNumber: number; startTime: string; endTime: string | null }[] = []

    for (let i = 0; i < systemMessages.length; i++) {
      const msg = systemMessages[i]
      const gameMatch = msg.content.match(/Game (\d+)/)

      if (gameMatch) {
        const gameNum = parseInt(gameMatch[1], 10)

        if (msg.content.includes('started') || msg.content.includes('🚀')) {
          // Find if we already have this game period
          let gamePeriod = gamePeriods.find(p => p.gameNumber === gameNum)
          if (!gamePeriod) {
            gamePeriod = { gameNumber: gameNum, startTime: msg.timestamp, endTime: null }
            gamePeriods.push(gamePeriod)
          } else {
            gamePeriod.startTime = msg.timestamp
          }
        } else if (msg.content.includes('ended') || msg.content.includes('🏁')) {
          const gamePeriod = gamePeriods.find(p => p.gameNumber === gameNum)
          if (gamePeriod) {
            gamePeriod.endTime = msg.timestamp
          }
        }
      }
    }

    // Organize screenshots by game
    const gameScreenshots: { [gameNumber: number]: { team1: Message[]; team2: Message[] } } = {}

    // Initialize all detected games
    gamePeriods.forEach(period => {
      gameScreenshots[period.gameNumber] = { team1: [], team2: [] }
    })

    // Also add current game if active
    if (currentGameNumber && !gameScreenshots[currentGameNumber]) {
      gameScreenshots[currentGameNumber] = { team1: [], team2: [] }
    }

    // Assign screenshots to games based on timestamps
    imageMessages.forEach(msg => {
      const msgTime = new Date(msg.timestamp).getTime()
      const senderTeam = getUserTeam(msg.sender)

      // Find which game this screenshot belongs to
      let assignedGame = currentGameNumber // Default to current game

      for (const period of gamePeriods) {
        const startTime = new Date(period.startTime).getTime()
        const endTime = period.endTime ? new Date(period.endTime).getTime() : Date.now()

        if (msgTime >= startTime && msgTime <= endTime) {
          assignedGame = period.gameNumber
          break
        }
      }

      if (gameScreenshots[assignedGame]) {
        if (senderTeam === 'team1') {
          gameScreenshots[assignedGame].team1.push(msg)
        } else if (senderTeam === 'team2') {
          gameScreenshots[assignedGame].team2.push(msg)
        }
      }
    })

    return gameScreenshots
  }

  const renderScreenshotsTab = () => {
    const gameScreenshots = organizeScreenshotsByGame()
    const availableGames = Object.keys(gameScreenshots)
      .map(Number)
      .sort((a, b) => a - b)

    // If no games detected, show at least current game
    if (availableGames.length === 0) {
      availableGames.push(currentGameNumber)
      gameScreenshots[currentGameNumber] = { team1: [], team2: [] }
    }

    const selectedGameData = gameScreenshots[selectedGameTab] || { team1: [], team2: [] }

    const renderParticipantScreenshots = (
      participantImages: Message[],
      participantName: string,
    ) => {
      if (participantImages.length === 0) {
        return (
          <div className="flex items-center justify-center min-h-48 bg-defendrBg rounded-lg">
            <Typo as="p" color="white" fontVariant="p3">
              No screenshot available
            </Typo>
          </div>
        )
      }

      return (
        <div className="space-y-3">
          {participantImages
            .slice()
            .reverse()
            .map((msg, index: number) => {
              // Determine which side this screenshot belongs to (team1 or team2)
              const senderSide = getUserTeam(msg.sender)
              const winnerId =
                senderSide === 'team1' ? state?.team1?.participantId : state?.team2?.participantId
              const winnerName = senderSide === 'team1' ? state?.team1?.name : state?.team2?.name
              // Backend approval check: is there a validated screenshot for this set and participant?
              let isApproved = false
              if (state?.screenshots && winnerId) {
                isApproved = state.screenshots.some(
                  s =>
                    s.setNumber === selectedGameTab &&
                    s.uploadedBy?.toString() === winnerId?.toString() &&
                    s.validated === true,
                )
              }
              return (
                <div key={msg._id || index} className="space-y-2">
                  <div className="bg-defendrBg rounded-lg p-2">
                    <Image
                      unoptimized
                      alt={`${participantName} screenshot`}
                      className="rounded-lg w-full h-48 object-cover cursor-pointer hover:opacity-80 transition-opacity"
                      height={192}
                      src={msg.content.replace('[IMAGE]', '')}
                      width={400}
                      onClick={() => setZoomedImage(msg.content.replace('[IMAGE]', ''))}
                    />
                    <div className="mt-2 text-xs text-defendrGrey">
                      By {getUsername(msg.sender)} • {new Date(msg.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <Button
                      label="Approve"
                      size="xxs"
                      textClassName="font-poppins text-xs"
                      variant="contained-red"
                      disabled={isApproved}
                      onClick={() => {
                        if (!state || isApproved) {
                          return
                        }
                        if (winnerId && winnerName) {
                          handleApproveScreenshot(winnerId, winnerName)
                        }
                      }}
                    />
                  </div>
                </div>
              )
            })}
        </div>
      )
    }

    return (
      <div className="space-y-6 p-6">
        <div className="text-center">
          <Typo as="h3" color="white" fontFamily="poppins" fontVariant="h3">
            Match Screenshots
          </Typo>
        </div>

        {/* Game Tabs */}
        <div className="flex justify-center">
          <div className="bg-defendrLightBlack border border-defendrGrey rounded-lg p-2">
            <div className="flex gap-2">
              {availableGames.map(gameNum => (
                <button
                  key={gameNum}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    selectedGameTab === gameNum
                      ? 'bg-defendrRed text-white'
                      : 'bg-transparent text-defendrGrey hover:text-white hover:bg-defendrGrey/20'
                  }`}
                  onClick={() => setSelectedGameTab(gameNum)}
                >
                  <Typo fontFamily="poppins" fontVariant="p5" fontWeight="bold">
                    Game {gameNum}
                  </Typo>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-defendrLightBlack border border-defendrGrey rounded-lg p-6">
          <div className="flex flex-col lg:flex-row items-start gap-6">
            {/* Participant 1 */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Image
                  alt={state?.team1.name || 'Participant 1'}
                  className="rounded-full"
                  height={30}
                  src={ninjaImage}
                  width={30}
                />
                <Typo as="h4" color="white" fontFamily="poppins" fontVariant="p2">
                  {state?.team1.name || 'Participant 1'}
                </Typo>
              </div>
              {renderParticipantScreenshots(
                selectedGameData.team1,
                state?.team1.name || 'Participant 1',
              )}
            </div>

            {/* VS */}
            <div className="flex items-center justify-center pt-12">
              <div className="bg-defendrLightBlack px-4 py-2 rounded-full border border-defendrGrey">
                <Typo as="span" color="grey" fontFamily="poppins" fontVariant="h3">
                  VS
                </Typo>
              </div>
            </div>

            {/* Participant 2 */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Image
                  alt={state?.team2.name || 'Participant 2'}
                  className="rounded-full"
                  height={30}
                  src={skullImage}
                  width={30}
                />
                <Typo as="h4" color="white" fontFamily="poppins" fontVariant="p2">
                  {state?.team2.name || 'Participant 2'}
                </Typo>
              </div>
              {renderParticipantScreenshots(
                selectedGameData.team2,
                state?.team2.name || 'Participant 2',
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderRequestsTab = () => (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <Typo as="h3" color="white" fontFamily="poppins" fontVariant="h4">
          Match Requests
        </Typo>
      </div>
      <div className="text-center py-8">
        <Typo as="p" color="grey" fontVariant="p2">
          No requests found for this match.
        </Typo>
      </div>
    </div>
  )

  if (!matchId) {
    return (
      <div className="min-h-screen bg-defendrBg flex items-center justify-center">
        <Typo color="red" fontVariant="p3">
          Missing match identifier.
        </Typo>
      </div>
    )
  }

  if (isLoading && !state) {
    return (
      <div className="min-h-screen bg-defendrBg flex items-center justify-center">
        <Typo color="grey" fontVariant="p3">
          Loading match data...
        </Typo>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-defendrBg flex items-center justify-center">
        <Typo color="red" fontVariant="p3">
          Failed to load match. {error}
        </Typo>
      </div>
    )
  }

  if (!state) {
    return (
      <div className="min-h-screen bg-defendrBg flex items-center justify-center">
        <Typo color="grey" fontVariant="p3">
          Match not found.
        </Typo>
      </div>
    )
  }

  // Image zoom modal component
  const renderImageModal = () => {
    if (!zoomedImage) {
      return null
    }

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
        onClick={() => setZoomedImage(null)}
      >
        <div className="relative max-w-4xl max-h-full">
          <Image
            unoptimized
            alt="Zoomed screenshot"
            className="rounded-lg max-w-full max-h-full object-contain"
            height={800}
            src={zoomedImage}
            width={1200}
            onClick={e => e.stopPropagation()}
          />
          <button
            className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all"
            onClick={() => setZoomedImage(null)}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                clipRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                fillRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {renderImageModal()}
      <div className="min-h-screen bg-defendrBg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-4 pt-4">
            <Button
              className="!w-auto px-4"
              label={
                <span className="flex items-center gap-2">
                  <Icon className="w-4 h-4" icon="mdi:arrow-left" />
                  Back to Matches
                </span>
              }
              size="xs"
              variant="outlined-grey"
              onClick={() => window.history.back()}
            />
          </div>
          {/* Header with Match Info */}
          <div className="bg-defendrLightBlack border border-defendrRed rounded-t-lg overflow-hidden">
            {/* Match Status Bar */}
            <div className="bg-defendrBg px-2 sm:px-4 py-2 border-b border-defendrGrey">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Typo className="sm:hidden" color="grey" fontVariant="p6">
                    Match • Admin Setup
                  </Typo>
                  <Typo className="hidden sm:block" color="grey" fontVariant="p5">
                    Match ID: {matchId} • Admin Setup
                  </Typo>
                </div>
                <div className="bg-defendrRed px-3 py-1 rounded-full">
                  <Typo color="white" fontVariant="p6" fontWeight="bold">
                    ● {state.status.toUpperCase()}
                  </Typo>
                </div>
              </div>
            </div>

            {/* Game Management Controls */}
            <div className="bg-defendrLightBlack px-4 py-3 border-b border-defendrGrey">
              <div className="flex items-center justify-center gap-4">
                <Typo color="white" fontVariant="p5" fontWeight="bold">
                  Game {currentGameNumber}
                </Typo>
                {state?.status?.toLowerCase() === 'completed' ? (
                  <div className="bg-defendrGrey/30 px-4 py-2 rounded-md">
                    <Typo color="grey" fontVariant="p6" fontWeight="medium">
                      Match Completed
                    </Typo>
                  </div>
                ) : !isGameActive ? (
                  <Button
                    icon={<Icon icon="mdi:play" />}
                    label="Start Game"
                    size="s"
                    variant="contained-green"
                    onClick={handleStartGame}
                  />
                ) : (
                  <Button
                    icon={<Icon icon="mdi:stop" />}
                    label="End Game"
                    size="s"
                    variant="contained-red"
                    onClick={handleEndGame}
                  />
                )}
                <div className="text-center">
                  <Typo color={isGameActive ? 'red' : 'grey'} fontVariant="p6">
                    {isGameActive ? '● Game Active' : '○ Game Inactive'}
                  </Typo>
                </div>
              </div>
            </div>

            {/* Participant vs Participant Header */}
            <div className="p-3 sm:p-6 bg-defendrLightBlack">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Participant 1 - Left Side */}
                <div className="flex items-center gap-2 sm:gap-4">
                  <Image
                    alt={state.team1.name}
                    className="rounded-full"
                    height={40}
                    src={ninjaImage}
                    width={40}
                  />
                  <div className="text-center sm:text-left">
                    <Typo
                      as="h2"
                      color="white"
                      fontFamily="poppins"
                      fontVariant="h4"
                      className="sm:text-h3"
                    >
                      {state.team1.name}
                    </Typo>
                    <Typo
                      as="span"
                      color="red"
                      fontFamily="poppins"
                      fontVariant="h3"
                      className="sm:text-h2"
                    >
                      {team1Score !== null ? team1Score : state.team1.score}
                    </Typo>
                  </div>
                </div>

                {/* VS Divider */}
                <Typo
                  as="span"
                  color="grey"
                  fontFamily="poppins"
                  fontVariant="h3"
                  className="sm:text-h2"
                >
                  VS
                </Typo>

                {/* Participant 2 - Right Side */}
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="text-center sm:text-right">
                    <Typo
                      as="h2"
                      color="white"
                      fontFamily="poppins"
                      fontVariant="h4"
                      className="sm:text-h3"
                    >
                      {state.team2.name}
                    </Typo>
                    <Typo
                      as="span"
                      color="red"
                      fontFamily="poppins"
                      fontVariant="h3"
                      className="sm:text-h2"
                    >
                      {team2Score !== null ? team2Score : state.team2.score}
                    </Typo>
                  </div>
                  <Image
                    alt={state.team2.name}
                    className="rounded-full"
                    height={40}
                    src={skullImage}
                    width={40}
                  />
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-defendrLightBlack p-2 sm:p-3">
              <div className="flex gap-1 sm:gap-3 justify-center">
                {(['chat', 'screenshots', 'requests'] as const).map(tab => (
                  <Button
                    key={tab}
                    fontFamily="poppins"
                    label={tab.charAt(0).toUpperCase() + tab.slice(1)}
                    selected={activeTab === tab}
                    size="xs"
                    variant="contained-ghostRed"
                    onClick={() => setActiveTab(tab)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-defendrLightBlack border-x border-defendrRed">
            {activeTab === 'chat' && renderChatTab()}
            {activeTab === 'screenshots' && renderScreenshotsTab()}
            {activeTab === 'requests' && renderRequestsTab()}
          </div>

          {/* Additional Match Tools */}

          {/* Bottom Border */}
          <div className="h-1 bg-defendrRed rounded-b-lg" />
        </div>
      </div>
    </>
  )
}
