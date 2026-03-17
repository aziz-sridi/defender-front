export interface Message {
  _id: string
  sender: string // User ID (ObjectId)
  content: string
  timestamp: string // ISO Date string
}
