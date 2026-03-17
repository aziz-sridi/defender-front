export type NotificationCategory = 'social' | 'competitions' | 'news'

export interface Notification {
  _id: string
  userId: string
  message: string
  link?: string
  acceptLink?: string
  declineLink?: string
  createdAt: string
  type?: string
  seen: boolean
  category: NotificationCategory
}
