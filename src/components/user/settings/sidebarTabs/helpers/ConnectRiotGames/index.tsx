'use client'
import { useState } from 'react'
import { toast } from 'sonner'

import Button from '@/components/ui/Button'
import Typo from '@/components/ui/Typo'

const ConnectRiotGames = () => {
  const [isLoading, setIsLoading] = useState(false)

  const handleConnect = () => {
    setIsLoading(true)
    // Directly redirect to backend /riot endpoint (full URL if backend is not same domain)
    window.location.href = 'https://api-dev.defendr.gg/riot'
  }

  return (
    <div className="flex flex-col justify-center items-center gap-10">
      <div className="w-full lg:w-2/3 xl:w-[55%] text-start flex-col gap-10">
        <Typo as="p" className="mb-4" color="darkGrey" fontFamily="poppins" fontVariant="p4">
          Connect your Riot games account
        </Typo>
        <Typo
          as="p"
          className="mt-4 text-left"
          color="darkGrey"
          fontFamily="poppins"
          fontVariant="p5"
        >
          Please make sure that your main account is connected. You will not be able to change this
          account since it's linked.
        </Typo>
        <Typo
          as="p"
          className="mt-6 text-left"
          color="darkGrey"
          fontFamily="poppins"
          fontVariant="p5"
        >
          Contact support for any change requests.
        </Typo>
        <div className="flex justify-center items-center">
          <Button
            className="w-auto rounded-xl font-semibold font-poppins uppercase text-sm mt-10 defendrButtonHover disabled:opacity-50"
            disabled={isLoading}
            label={isLoading ? 'Connecting...' : 'Connect Riot'}
            type="button"
            variant="contained-red"
            onClick={handleConnect}
          />
        </div>
      </div>
    </div>
  )
}

export default ConnectRiotGames
