import { useEffect, useState } from 'react'

import Typo from '@/components/ui/Typo'

export default function Chat({ user }: { user: any }) {
  const [chatSettings, setChatSettings] = useState()
  const [chatOnTournamentLobby, setChatOnTournamentLobby] = useState<boolean>(true)
  const [chatWithFriends, setChatWithFriends] = useState<boolean>(true)
  const [filterLanguage, setFilterLanguage] = useState<boolean>(true)

  useEffect(() => {
    if (user && user.chatSettings) {
      setChatSettings(user.chatSettings)
      setChatOnTournamentLobby(user.chatSettings.chatOnTournamentLobby || false)
      setChatWithFriends(user.chatSettings.chatWithFriends || false)
      setFilterLanguage(user.chatSettings.filterLanguage || false)
    }
  }, [user])
  if (!user) {
    return (
      <div className="bg-[#212529] flex flex-col p-10 gap-12 rounded-xl md:pb-40">
        <Typo
          as="p"
          className="font-semibold text-md md:text-lg"
          color="white"
          fontFamily="poppins"
          fontVariant="p1"
          fontWeight="regular"
        >
          Chat Settings
        </Typo>
      </div>
    )
  }
  const handleNotificationChange = async (
    type: 'chatOnTournamentLobby' | 'chatWithFriends' | 'filterLanguage',
    value: boolean,
  ) => {
    /* try { */
    if (type === 'chatOnTournamentLobby') {
      setChatOnTournamentLobby(value)
    }
    if (type === 'chatWithFriends') {
      setChatWithFriends(value)
    }
    if (type === 'filterLanguage') {
      setFilterLanguage(value)
    }
  }
  return (
    <div className="bg-[#212529] flex flex-col p-10 gap-12 rounded-xl md:pb-40">
      <Typo
        as="p"
        className="font-semibold text-md md:text-lg"
        color="white"
        fontFamily="poppins"
        fontVariant="p1"
        fontWeight="regular"
      >
        Chat Settings
      </Typo>
      <div className="flex flex-col gap-10">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col gap-1">
            <Typo
              as="p"
              className="font-semibold text-sm md:text-md"
              color="white"
              fontFamily="poppins"
              fontVariant="p1"
              fontWeight="regular"
            >
              Chat On Tournament Lobby
            </Typo>
            <Typo as="p" className="text-gray-400 pt-2" fontVariant="p5">
              check in news , updates or contact tournament admin
            </Typo>
          </div>
          <input
            checked={chatOnTournamentLobby}
            className="accent-[#D62755] bg-[#D62755] w-4 h-4 text-[#D62755] "
            type="checkbox"
            onChange={() =>
              handleNotificationChange('chatOnTournamentLobby', !chatOnTournamentLobby)
            }
          />
        </div>

        <div className="flex flex-row justify-between">
          <div className="flex flex-col gap-1">
            <Typo
              as="p"
              className="font-semibold text-sm md:text-md"
              color="white"
              fontFamily="poppins"
              fontVariant="p1"
              fontWeight="regular"
            >
              Chat With Friends
            </Typo>
            <Typo as="p" className="text-gray-400 pt-2" fontVariant="p5">
              texting with your friends and followers
            </Typo>
          </div>
          <input
            checked={chatWithFriends}
            className="accent-[#D62755] bg-[#D62755] w-4 h-4 text-[#D62755] "
            type="checkbox"
            onChange={() => handleNotificationChange('chatWithFriends', !chatWithFriends)}
          />
        </div>

        <div className="flex flex-row justify-between">
          <div className="flex flex-col gap-1">
            <Typo
              as="p"
              className="font-semibold text-sm md:text-md"
              color="white"
              fontFamily="poppins"
              fontVariant="p1"
              fontWeight="regular"
            >
              Filter Language
            </Typo>
            <Typo as="p" className="text-gray-400 pt-2" fontVariant="p5">
              filter any bad language that means any sexism , racism , ...
            </Typo>
          </div>
          <input
            checked={filterLanguage}
            className="accent-[#D62755] bg-[#D62755] w-4 h-4 text-[#D62755] "
            type="checkbox"
            onChange={() => handleNotificationChange('filterLanguage', !filterLanguage)}
          />
        </div>
      </div>
    </div>
  )
}
