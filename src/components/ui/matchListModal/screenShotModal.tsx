import React from 'react'
import Image, { StaticImageData } from 'next/image'

import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'

interface Props {
  isOpen: boolean
  onClose: () => void
  match: {
    team1: { name: string; logo: string | StaticImageData }
    team2: { name: string; logo: string | StaticImageData }
  } | null
}

export default function ScreenshotModal({ isOpen, onClose, match }: Props) {
  if (!match) {
    return null
  }

  return (
    <Modal className="max-w-2xl" isOpen={isOpen} title="Enter your message" onClose={onClose}>
      <div className="space-y-6">
        <div className="flex items-center justify-between bg-defendrBg rounded-lg p-4">
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

        <div className="space-y-4">
          <textarea
            className="w-full h-24 bg-defendrLightBlack border border-defendrGrey rounded-lg px-3 py-2 text-white placeholder-defendrGrey focus:border-defendrRed outline-none font-poppins resize-none"
            placeholder="Enter your message here..."
          />
          <textarea
            className="w-full h-24 bg-defendrLightBlack border border-defendrGrey rounded-lg px-3 py-2 text-white placeholder-defendrGrey focus:border-defendrRed outline-none font-poppins resize-none"
            placeholder="Describe what you want to show..."
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button label="Cancel" size="s" variant="outlined-grey" onClick={onClose} />
          <Button label="Submit" size="s" variant="contained-red" />
        </div>
      </div>
    </Modal>
  )
}
