'use client'
import { useState } from 'react'

import Button from '@/components/ui/Button'
import Typo from '@/components/ui/Typo'

export const EmptyTournamentCard = ({ isUserProfile }: { isUserProfile: boolean }) => {
  return (
    <>
      <div className="flex flex-col justify-center items-center gap-3 p-7 bg-[#212529] rounded-[19px]">
        <Typo as="p" fontFamily="poppins" fontVariant="p4">
          Climb the leaderboards to reach top 3 and earn rewards .
        </Typo>
        <Typo as="p" fontFamily="poppins" fontVariant="p4">
          Join and start competing in tournaments today
        </Typo>
        {isUserProfile && (
          <Button
            className="cursor-pointer p-2 mt-2"
            label="Browse Tournaments"
            size="xs"
            textClassName="font-poppins"
            variant="contained-red"
          />
        )}
      </div>
    </>
  )
}
