'use client'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

// Icons removed from simplified UI
import Button from '@/components/ui/Button'
import Typo from '@/components/ui/Typo'
import { Game } from '@/types/gameType'
import AccountsPopup from '@/components/user/settings/sidebarTabs/helpers/accountsPopup'
import { getGameById, removeGameFromGameProfiles, toggleFavoriteGame } from '@/services/gameService'

export default function GameAccount({ user }: { user: any }) {
  const [isAccountsModalOpen, setIsAccountsModalOpen] = useState(false)

  // No favorites state in simplified view

  // Hide old connected games fetching/UI (no longer needed for the simplified view)

  const openAccountsModal = () => {
    setIsAccountsModalOpen(true)
  }

  const handleAccountSelect = (_account: string) => {
    setIsAccountsModalOpen(false)
  }
  // Removed game selection UI

  // Removed old Add Game modal logic

  // Removed favorites toggling for this simplified section

  return (
    <div className="bg-[#212529] flex flex-col p-6 sm:p-8 md:p-10 gap-6 md:gap-8 rounded-xl md:pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Typo
          as="p"
          className="font-semibold text-base md:text-lg"
          color="white"
          fontFamily="poppins"
          fontVariant="p1"
          fontWeight="regular"
        >
          Connected Accounts
        </Typo>
      </div>
      {/* Display only linked platform accounts with cleaner UI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-2">
        {/* Discord Account */}
        {user?.socialMediaLinks?.discord !== undefined &&
          user?.socialMediaLinks?.discord !== null && (
            <div className="relative rounded-xl p-4 bg-gradient-to-br from-zinc-800 to-zinc-900 ring-1 ring-white/10 hover:ring-defendrRed/40 transition-all">
              <div className="flex items-center gap-3">
                <div className="shrink-0 h-10 w-10 rounded-lg overflow-hidden bg-zinc-700 flex items-center justify-center">
                  <img alt="Discord" className="h-full w-full object-cover" src="/discord.avif" />
                </div>
                <div className="min-w-0">
                  <Typo as="p" className="font-semibold text-white truncate" fontFamily="poppins">
                    Discord
                  </Typo>
                  <Typo
                    as="p"
                    className="text-gray-300 text-xs sm:text-sm truncate"
                    fontFamily="poppins"
                  >
                    {user?.socialMediaLinks?.discord?.trim()
                      ? user.socialMediaLinks.discord
                      : 'Connected'}
                  </Typo>
                </div>
                <span className="ml-auto inline-flex items-center justify-center h-5 w-5 rounded-full bg-green-500/20 text-green-400 text-xs">
                  ✓
                </span>
              </div>
            </div>
          )}

        {/* Mobile Legends Account */}
        {user?.connectedAcc?.mobilelegends?.game_id &&
          user?.connectedAcc?.mobilelegends?.zone_id && (
            <div className="relative rounded-xl p-4 bg-gradient-to-br from-zinc-800 to-zinc-900 ring-1 ring-white/10 hover:ring-defendrRed/40 transition-all">
              <div className="flex items-center gap-3">
                <div className="shrink-0 h-10 w-10 rounded-lg overflow-hidden bg-zinc-700 flex items-center justify-center">
                  <img
                    alt="Mobile Legends"
                    className="h-full w-full object-cover"
                    src="/mobileLegend.png"
                  />
                </div>
                <div className="min-w-0">
                  <Typo as="p" className="font-semibold text-white truncate" fontFamily="poppins">
                    Mobile Legends
                  </Typo>
                  <Typo as="p" className="text-gray-300 text-xs sm:text-sm" fontFamily="poppins">
                    Game ID: {user.connectedAcc.mobilelegends.game_id}
                  </Typo>
                  <Typo as="p" className="text-gray-300 text-xs sm:text-sm" fontFamily="poppins">
                    Zone ID: {user.connectedAcc.mobilelegends.zone_id}
                  </Typo>
                </div>
                <span className="ml-auto inline-flex items-center justify-center h-5 w-5 rounded-full bg-green-500/20 text-green-400 text-xs">
                  ✓
                </span>
              </div>
            </div>
          )}

        {/* Riot Games Account */}
        {((user?.connectedAcc?.riot?.game_id && user?.connectedAcc?.riot?.tagline) ||
          user?.connectedAcc?.Riotgames?.riotid ||
          user?.connectedAcc?.Riotgames?.tagline) && (
          <div className="relative rounded-xl p-4 bg-gradient-to-br from-zinc-800 to-zinc-900 ring-1 ring-white/10 hover:ring-defendrRed/40 transition-all">
            <div className="flex items-center gap-3">
              <div className="shrink-0 h-10 w-10 rounded-lg overflow-hidden bg-zinc-700 flex items-center justify-center">
                <img
                  alt="Riot Games"
                  className="h-full w-full object-cover"
                  src="/riotGames.webp"
                />
              </div>
              <div className="min-w-0">
                <Typo as="p" className="font-semibold text-white truncate" fontFamily="poppins">
                  Riot Games
                </Typo>
                {user?.connectedAcc?.riot?.game_id && (
                  <Typo as="p" className="text-gray-300 text-xs sm:text-sm" fontFamily="poppins">
                    Game ID: {user.connectedAcc.riot.game_id}
                  </Typo>
                )}
                {user?.connectedAcc?.riot?.tagline && (
                  <Typo as="p" className="text-gray-300 text-xs sm:text-sm" fontFamily="poppins">
                    Tagline: {user.connectedAcc.riot.tagline}
                  </Typo>
                )}
                {user?.connectedAcc?.Riotgames?.riotid && (
                  <Typo as="p" className="text-gray-300 text-xs sm:text-sm" fontFamily="poppins">
                    Riot ID: {user.connectedAcc.Riotgames.riotid}
                  </Typo>
                )}
                {user?.connectedAcc?.Riotgames?.tagline && (
                  <Typo as="p" className="text-gray-300 text-xs sm:text-sm" fontFamily="poppins">
                    Tagline: {user.connectedAcc.Riotgames.tagline}
                  </Typo>
                )}
              </div>
              <span className="ml-auto inline-flex items-center justify-center h-5 w-5 rounded-full bg-green-500/20 text-green-400 text-xs">
                ✓
              </span>
            </div>
          </div>
        )}

        {/* EA/Origin Account */}
        {user?.connectedAcc?.origin?.username && (
          <div className="relative rounded-xl p-4 bg-gradient-to-br from-zinc-800 to-zinc-900 ring-1 ring-white/10 hover:ring-defendrRed/40 transition-all">
            <div className="flex items-center gap-3">
              <div className="shrink-0 h-10 w-10 rounded-lg overflow-hidden bg-zinc-700 flex items-center justify-center">
                <img
                  alt="EA/Origin"
                  className="h-full w-full object-cover"
                  src="https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/defendr_elements/Games%20and%20accounts/ea.png"
                />
              </div>
              <div className="min-w-0">
                <Typo as="p" className="font-semibold text-white truncate" fontFamily="poppins">
                  EA/Origin Account
                </Typo>
                <Typo as="p" className="text-gray-300 text-xs sm:text-sm" fontFamily="poppins">
                  {user.connectedAcc.origin.username}
                </Typo>
              </div>
              <span className="ml-auto inline-flex items-center justify-center h-5 w-5 rounded-full bg-green-500/20 text-green-400 text-xs">
                ✓
              </span>
            </div>
          </div>
        )}
      </div>
      {/* Add Account CTA */}
      <div className="flex justify-center mt-2">
        <Button label="Add Account" variant="contained-red" size="s" onClick={openAccountsModal} />
      </div>

      {/* Popup */}
      <AccountsPopup
        isOpen={isAccountsModalOpen}
        user={user}
        onAccountSelect={handleAccountSelect}
        onClose={() => setIsAccountsModalOpen(false)}
      />
    </div>
  )
}
