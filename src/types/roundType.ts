export interface Round {
  bracket: string
  number: number
  matches: string[]
  status: 'Not Started' | 'Ongoing' | 'Completed'
  sets: 1 | 3 | 5
  createdAt: string
  isFinal: boolean
}
