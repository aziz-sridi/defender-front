import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export const initSocket = (userId: string): Socket => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.defendr.gg', {
      query: { userId: userId },
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      forceNew: false,
    })

    socket.on('connect', () => {
      // Reduced logging for production
      if (process.env.NODE_ENV === 'development') {
        console.log(`Socket connected for user ${userId}`)
      }
    })

    socket.on('welcome', (message: string) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('👋', message)
      }
    })

    socket.on('connect_error', (error: Error) => {
      // Only log critical errors, not network timeouts
      if (process.env.NODE_ENV === 'development' && !error.message.includes('timeout')) {
        console.warn('Socket connection issue:', error.message)
      }
    })

    socket.on('disconnect', reason => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`Socket disconnected: ${reason}`)
      }
    })

    socket.on('reconnect', attemptNumber => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`Socket reconnected after ${attemptNumber} attempts`)
      }
    })

    socket.on('reconnect_error', error => {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Socket reconnection failed:', error.message)
      }
    })
  }
  return socket
}

export const getSocket = (): Socket | null => socket

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect()
    socket = null
    console.log(' Socket disconnected')
  }
}
