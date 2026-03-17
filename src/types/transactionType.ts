export type TransactionType = 'deposit' | 'withdrawal'

export interface Transaction {
  _id: string
  userId: string
  amount: number
  type: TransactionType
  timestamp: string
}
