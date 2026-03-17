import { DefaultEventsMap } from '@socket.io/component-emitter'
import { io, Socket } from 'socket.io-client'

//const userId = "6602ea9b2c4d66ed6aeab692";

let socket: Socket<DefaultEventsMap, DefaultEventsMap> | null = null

export const initializeSocket = (userId: string) => {
  // Pass userId as query parameter when connecting
  socket = io(process.env.NEXT_PUBLIC_API || 'localhost:4000', {
    query: {
      userId: userId,
    },
  })
}

export const getSocket = () => {
  if (!socket) {
    throw new Error("Socket not initialized. Call 'initializeSocket' first.")
  }

  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
  }
}
