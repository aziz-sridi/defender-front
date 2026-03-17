'use client'

import React from 'react'
import Image from 'next/image'

import Typo from '@/components/ui/Typo'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import ninjaImage from '@/components/assets/tournament/ninja.jpg'

// Minimal types replicated (could import from page or centralize later)
export interface BasicMatchProfileData {
  id: string
  team1: { name: string; logo: string; score: number }
  team2: { name: string; logo: string; score: number }
  status: string
}

interface MatchProfileContentProps {
  matchData: BasicMatchProfileData
  activeTab: 'chat' | 'screenshots' | 'requests'
  isLoading: boolean
  resolveModalOpen: boolean
  onChangeTab: (tab: 'chat' | 'screenshots' | 'requests') => void
  onCloseResolve: () => void
  // Renderers provided by parent to keep this component presentational
  renderChatTab: () => React.ReactNode
  renderScreenshotsTab: () => React.ReactNode
  renderRequestsTab: () => React.ReactNode
  // Whether current viewer is admin/creator (controls visibility of requests tab & modal)
  isAdminView?: boolean
}

const MatchProfileContent: React.FC<MatchProfileContentProps> = ({
  matchData,
  activeTab,
  isLoading,
  resolveModalOpen,
  onChangeTab,
  onCloseResolve,
  renderChatTab,
  renderScreenshotsTab,
  renderRequestsTab,
  isAdminView = false,
}) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Match Header */}
      <div className="bg-defendrLightBlack border border-defendrGrey rounded-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <Image
              alt={matchData.team1.name}
              className="rounded-full"
              height={40}
              src={ninjaImage}
              width={40}
            />
            <div className="text-center sm:text-left">
              <Typo
                as="h2"
                color="white"
                fontFamily="poppins"
                fontVariant="h4"
                className="sm:text-h3"
              >
                {matchData.team1.name}
              </Typo>
              <Typo
                as="span"
                color="red"
                fontFamily="poppins"
                fontVariant="h3"
                className="sm:text-h2"
              >
                {matchData.team1.score}
              </Typo>
            </div>
          </div>

          <Typo as="span" color="grey" fontFamily="poppins" fontVariant="h3" className="sm:text-h2">
            VS
          </Typo>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="text-center sm:text-right">
              <Typo
                as="h2"
                color="white"
                fontFamily="poppins"
                fontVariant="h4"
                className="sm:text-h3"
              >
                {matchData.team2.name}
              </Typo>
              <Typo
                as="span"
                color="red"
                fontFamily="poppins"
                fontVariant="h3"
                className="sm:text-h2"
              >
                {matchData.team2.score}
              </Typo>
            </div>
            <Image
              alt={matchData.team2.name}
              className="rounded-full"
              height={40}
              src={ninjaImage}
              width={40}
            />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 sm:gap-4 justify-center flex-wrap">
        <Button
          label="Chat"
          size="xs"
          textClassName="font-poppins text-xs sm:text-sm"
          variant={activeTab === 'chat' ? 'contained-red' : 'outlined-grey'}
          onClick={() => onChangeTab('chat')}
        />
        <Button
          label="Screenshots"
          size="xs"
          textClassName="font-poppins text-xs sm:text-sm"
          variant={activeTab === 'screenshots' ? 'contained-red' : 'outlined-grey'}
          onClick={() => onChangeTab('screenshots')}
        />
        <Button
          label="Requests"
          size="xs"
          textClassName="font-poppins text-xs sm:text-sm"
          variant={activeTab === 'requests' ? 'contained-red' : 'outlined-grey'}
          onClick={() => onChangeTab('requests')}
        />
      </div>

      {/* Tab Content */}
      <div className="bg-defendrLightBlack border border-defendrGrey rounded-lg p-3 sm:p-6">
        {activeTab === 'chat' && renderChatTab()}
        {activeTab === 'screenshots' && renderScreenshotsTab()}
        {activeTab === 'requests' && renderRequestsTab()}
      </div>

      {/* Resolve Ticket Modal (admin only) */}
      {isAdminView && (
        <Modal isOpen={resolveModalOpen} onClose={onCloseResolve}>
          <div className="bg-defendrLightBlack p-4 sm:p-6 rounded-lg max-w-sm sm:max-w-md mx-auto">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <Typo
                as="h2"
                color="white"
                fontFamily="poppins"
                fontVariant="h5"
                className="sm:text-h4"
              >
                Resolve Request
              </Typo>
              <button
                className="text-white hover:text-defendrRed transition-colors text-lg sm:text-xl"
                onClick={onCloseResolve}
              >
                ✕
              </button>
            </div>

            <Typo as="p" className="mb-4 sm:mb-6 text-p3 sm:text-p2" color="white" fontVariant="p3">
              Are you sure you want to resolve this request?
            </Typo>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end">
              <Button
                label="Cancel"
                size="xs"
                textClassName="font-poppins"
                variant="outlined-grey"
                onClick={onCloseResolve}
              />
              <Button
                disabled={isLoading}
                label="Resolve"
                size="xs"
                textClassName="font-poppins"
                variant="contained-red"
                onClick={onCloseResolve}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default MatchProfileContent
