'use client'
import { useState } from 'react'

import Button from '@/components/ui/Button'
import Typo from '@/components/ui/Typo'
import { Game } from '@/types/gameType'
import GamePopup from '@/components/user/userProfileTabs/helpers/gamesPopup'
export const EmptyGameCard = ({ isUserProfile }: { isUserProfile: boolean }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [connectedGames, setConnectedGames] = useState<Game[]>([])
  const handleGameSelect = (game: Game) => {
    if (!connectedGames.find(g => g._id === game._id)) {
      setConnectedGames([...connectedGames, game])
    }
    setIsModalOpen(false)
  }

  const openGameModal = () => {
    setIsModalOpen(true)
  }

  const removeGame = (gameId: string) => {
    setConnectedGames(connectedGames.filter(game => game._id !== gameId))
  }
  return (
    <div className="flex flex-col justify-center items-center gap-3 p-7 bg-[#212529] rounded-[19px]">
      <Typo as="p" fontFamily="poppins" fontVariant="p4">
        Join Tournaments , compete to win and connect with players in order
      </Typo>
      <Typo as="p" fontFamily="poppins" fontVariant="p4">
        to level up your potentiel skill
      </Typo>
      {isUserProfile && (
        <Button
          className="cursor-pointer p-2 mt-2"
          label="Register Game"
          size="xs"
          textClassName="font-poppins"
          variant="contained-red"
          onClick={openGameModal}
        />
      )}
      <GamePopup
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onGameSelect={handleGameSelect}
      />
    </div>
  )
}
