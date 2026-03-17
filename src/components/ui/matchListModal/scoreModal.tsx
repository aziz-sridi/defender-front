import React from 'react'
import Image from 'next/image'
import { StaticImageData } from 'next/image'

import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
interface Props {
  isOpen: boolean
  onClose: () => void
  team1Score: number
  team2Score: number
  setTeam1Score: (score: number) => void
  setTeam2Score: (score: number) => void
  onSubmit?: () => void
  match: {
    team1: { name: string; logo: string | StaticImageData }
    team2: { name: string; logo: string | StaticImageData }
  } | null
}

export default function ScoreModal({
  isOpen,
  onClose,
  match,
  team1Score,
  team2Score,
  setTeam1Score,
  setTeam2Score,
  onSubmit,
}: Props) {
  if (!match) {
    return null
  }

  return (
    <Modal className="max-w-md" isOpen={isOpen} title="Set Score" onClose={onClose}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              alt={match.team1.name}
              className="rounded-full"
              height={40}
              src={match.team1.logo}
              width={40}
            />
            <span className="text-white font-poppins font-medium">{match.team1.name}</span>
          </div>
          <span className="text-defendrGrey text-xl font-bold">VS</span>
          <div className="flex items-center gap-3">
            <span className="text-white font-poppins font-medium">{match.team2.name}</span>
            <Image
              alt={match.team2.name}
              className="rounded-full"
              height={40}
              src={match.team2.logo}
              width={40}
            />
          </div>
        </div>

        <div className="flex items-center justify-center gap-8">
          <input
            className="w-16 h-16 text-2xl font-bold text-center bg-defendrLightBlack border border-defendrGrey rounded-lg text-white focus:border-defendrRed outline-none"
            min="0"
            type="number"
            value={team1Score}
            onChange={e => setTeam1Score(Number(e.target.value))}
          />
          <span className="text-defendrGrey text-2xl font-bold">:</span>
          <input
            className="w-16 h-16 text-2xl font-bold text-center bg-defendrLightBlack border border-defendrGrey rounded-lg text-white focus:border-defendrRed outline-none"
            min="0"
            type="number"
            value={team2Score}
            onChange={e => setTeam2Score(Number(e.target.value))}
          />
        </div>

        <div className="flex justify-center gap-4">
          <Button
            className="px-8"
            label="Cancel"
            size="xxs"
            variant="outlined-grey"
            onClick={onClose}
          />
          <Button
            className="px-8"
            label="Submit"
            size="xxs"
            variant="contained-red"
            onClick={onSubmit}
          />
        </div>
      </div>
    </Modal>
  )
}
