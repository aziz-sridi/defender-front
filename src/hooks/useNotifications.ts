/* eslint-disable no-console */
'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import type { Socket } from 'socket.io-client'

import { initSocket } from '@/lib/socket'
import type { Notification } from '@/types/notificationType'
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  sendTestNotification,
} from '@/services/notificationService'

export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const socketRef = useRef<Socket | null>(null)
  const currentUserRef = useRef<string | null>(null)

  // Fetch existing notifications on mount or when userId changes
  useEffect(() => {
    if (!userId) {
      return
    }

    let isMounted = true

    ;(async () => {
      try {
        const data = await getNotifications()
        if (isMounted) {
          setNotifications(data.notifications || [])
        }
      } catch (err) {
        console.debug('[useNotifications] fetch failed', err)
      }
    })()

    return () => {
      isMounted = false
    }
  }, [userId])

  // Initialize socket and listen for new notifications
  useEffect(() => {
    if (!userId) {
      return
    }

    // Reuse existing socket if connected
    let socket: Socket
    if (currentUserRef.current === userId && socketRef.current?.connected) {
      socket = socketRef.current
    } else {
      socket = initSocket(userId)
      socketRef.current = socket
      currentUserRef.current = userId
    }

    const handleNewNotification = (notif: Notification) => {
      setNotifications(prev => {
        // avoid duplicates
        if (prev.some(n => n._id === notif._id)) {
          return prev
        }
        return [notif, ...prev]
      })
    }

    // Re-fetch notifications on connect/reconnect to catch any missed events
    const handleConnected = async () => {
      try {
        const data = await getNotifications()
        if (data && Array.isArray(data.notifications)) {
          setNotifications(data.notifications || [])
        } else {
          setNotifications([]) // fallback to empty if response is malformed
        }
      } catch (err) {
        console.debug('[useNotifications] refresh on connect failed', err)
      }
    }

    // Attach listeners
    socket.on('new-notification', handleNewNotification)
    // socket.on("refresh-notifications", handleConnected)
    socket.on('connect', handleConnected)
    // Diagnostic: log any incoming socket events so we can detect the real event name
    const handleAny = (event: string, ...args: unknown[]) => {
      if (process.env.NODE_ENV === 'development') {
        console.debug('[useNotifications] socket event:', event, args)
        console.debug('[useNotifications] socket connected:', socket.connected, 'id:', socket.id)
      }
    }
    socket.onAny(handleAny)

    return () => {
      socket.off('new-notification', handleNewNotification)
      // socket.off("refresh-notifications", handleConnected)
      socket.off('connect', handleConnected)
      socket.offAny(handleAny)
      // Do NOT disconnect the socket — let it persist
    }
  }, [userId])

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId)
      setNotifications(prev => prev.map(n => (n._id === notificationId ? { ...n, seen: true } : n)))
    } catch (err: unknown) {
      const maybe = err as { status?: number; statusCode?: number; message?: string }
      const status = (maybe.status as number) || (maybe.statusCode as number) || undefined
      if (status === 404) {
        setNotifications(prev =>
          prev.map(n => (n._id === notificationId ? { ...n, seen: true } : n)),
        )
      }
    }
  }, [])

  const markAllAsRead = useCallback(async () => {
    try {
      await markAllNotificationsAsRead()
      setNotifications(prev => prev.map(n => ({ ...n, seen: true })))
    } catch (err) {
      console.debug('[useNotifications] markAllAsRead failed', err)
    }
  }, [])

  const sendTest = useCallback(async () => {
    try {
      await sendTestNotification(userId)
    } catch (err) {
      console.debug('[useNotifications] sendTest failed', err)
    }
  }, [userId])

  const getByCategory = useCallback(
    (category: Notification['category']) => notifications.filter(n => n.category === category),
    [notifications],
  )

  const refreshNotifications = useCallback(async () => {
    if (!userId) {
      return
    }

    try {
      const data = await getNotifications()
      if (data && Array.isArray(data.notifications)) {
        setNotifications(data.notifications || [])
      } else {
        setNotifications([])
      }
    } catch (err) {
      console.debug('[useNotifications] refresh failed', err)
    }
  }, [userId])

  return {
    notifications,
    markAsRead,
    markAllAsRead,
    sendTest,
    getByCategory,
    refreshNotifications,
  }
}
