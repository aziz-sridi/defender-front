'use client'
import { useState } from 'react'

import Button from '@/components/ui/Button'
import Typo from '@/components/ui/Typo'

export const EmptyGameConnected = () => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between p-4">
        <Typo as="p" fontFamily="poppins" fontVariant="p4">
          Game ID
        </Typo>
        <Typo as="p" className="cursor-pointer" color="red" fontFamily="poppins" fontVariant="p5">
          Connect Games
        </Typo>
      </div>
      <Typo as="p" color="ghostGrey" fontFamily="poppins" fontVariant="p5">
        No Games connect to this account .
      </Typo>
    </div>
  )
}
