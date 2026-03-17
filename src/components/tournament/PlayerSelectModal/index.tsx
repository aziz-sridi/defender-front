import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

import { userImageSanitizer } from '@/utils/imageUrlSanitizer'
import Button from '@/components/ui/Button'
import Typo from '@/components/ui/Typo'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip'
import {
  hasVerifiedEmail,
  hasAgeInfo,
  hasDiscord,
  hasRiotAccount,
  hasSteamAccount,
  hasEpicAccount,
  hasGameProfile,
  hasRequiredAccountType,
} from '@/lib/tournament/requirements'
import type { User } from '@/types/userType'
import type { JoinProcess as TournamentJoinProcess } from '@/types/tournamentType'
import type { Game } from '@/types/gameType'

interface PlayerDisplay {
  _id: string
  name: string
  avatarUrl?: string
  role?: string
  user?: User
}

interface PlayerSelectModalProps {
  open: boolean
  players: PlayerDisplay[]
  maxPlayers: number
  onClose: () => void
  onJoin: (selectedPlayers: PlayerDisplay[]) => void | Promise<void>
  joinProcess: TournamentJoinProcess
  gameId?: string
  game?: Game
}

interface PlayerWithIssue extends PlayerDisplay {
  issues: string[]
}

function getPlayerIssues(
  player: PlayerDisplay,
  joinProcess?: TournamentJoinProcess,
  gameId?: string,
  game?: Game,
): string[] {
  const issues: string[] = []
  const user = player.user

  if (!player.name || player.name.length < 2) {
    issues.push('Name too short')
  }
  if (!player.avatarUrl) {
    issues.push('No avatar set')
  }

  if (!user || !joinProcess) {
    return issues
  }

  if (joinProcess.requireVerifiedEmail && !hasVerifiedEmail(user)) {
    issues.push('Email not verified')
  }

  if (joinProcess.requireAgeVerification && !hasAgeInfo(user)) {
    issues.push('Missing age/birth date')
  }

  if (joinProcess.requireDiscordUsername && !hasDiscord(user)) {
    issues.push('Discord not connected')
  }

  if (joinProcess.requireRiotId && !hasRiotAccount(user)) {
    issues.push('Riot account not linked')
  }

  if (joinProcess.requireSteamId && !hasSteamAccount(user)) {
    issues.push('Steam account not linked')
  }

  if (joinProcess.requireEpicGamesUsername && !hasEpicAccount(user)) {
    issues.push('Epic Games account not linked')
  }

  if (joinProcess.requireGameAccount && gameId && !hasGameProfile(user, gameId)) {
    issues.push('Game account not linked')
  }

  if (joinProcess.linkGameRequired && !hasEpicAccount(user)) {
    issues.push('Epic account required')
  }

  if (joinProcess.requireRankRating) {
    issues.push('Rank rating required')
  }

  if (joinProcess.requireCustomGameIdentifier) {
    // Check for specific game account requirements
    const gameRequiredAccounts = game?.requiredAccounts || []
    if (gameRequiredAccounts.length > 0) {
      const missingAccounts = gameRequiredAccounts.filter(
        accountType => !hasRequiredAccountType(user, accountType),
      )
      if (missingAccounts.length > 0) {
        issues.push(`Required game accounts: ${missingAccounts.join(', ')}`)
      }
    } else {
      // Accept any non-empty object in connectedAcc or gameProfiles as a valid identifier
      const hasValidConnectedAcc = Object.values(user?.connectedAcc || {}).some(
        acc => acc && typeof acc === 'object' && Object.keys(acc).length > 0,
      )
      const hasValidGameProfile = Array.isArray(user?.gameProfiles)
        ? user.gameProfiles.some(
            profile => profile && typeof profile === 'object' && Object.keys(profile).length > 0,
          )
        : false
      if (!hasValidConnectedAcc && !hasValidGameProfile) {
        issues.push('Custom game identifier required')
      }
    }
  }

  return issues
}

const PlayerSelectModal: React.FC<PlayerSelectModalProps> = ({
  open,
  players,
  maxPlayers,
  onClose,
  onJoin,
  joinProcess,
  gameId,
  game,
}) => {
  const [selected, setSelected] = useState<string[]>([])
  const [subs, setSubs] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const playersWithIssues: PlayerWithIssue[] = useMemo(
    () =>
      players.map(p => ({
        ...p,
        issues: getPlayerIssues(p, joinProcess, gameId, game),
      })),
    [players, joinProcess, gameId, game],
  )

  // Main player selection
  const handleToggle = (id: string) => {
    setSelected(prev => {
      if (prev.includes(id)) {
        return prev.filter(pid => pid !== id)
      }
      // Prevent selecting as main if already sub
      if (subs.includes(id)) {
        return prev
      }
      if (prev.length < maxPlayers) {
        return [...prev, id]
      }
      return prev
    })
  }

  // Subs selection
  const handleToggleSub = (id: string) => {
    setSubs(prev => {
      if (prev.includes(id)) {
        return prev.filter(pid => pid !== id)
      }
      // Prevent selecting as sub if already main
      if (selected.includes(id)) {
        return prev
      }
      if (prev.length < (joinProcess.numberOfSubstitutes || 0)) {
        return [...prev, id]
      }
      return prev
    })
  }

  // Main must be exactly maxPlayers, subs can be 0 to max allowed
  const canJoin =
    selected.length === maxPlayers &&
    subs.length >= 0 &&
    subs.length <= (joinProcess.numberOfSubstitutes || 0)

  const selectedPlayers = useMemo(
    () => playersWithIssues.filter(p => selected.includes(p._id)),
    [selected, playersWithIssues],
  )
  const selectedSubs = useMemo(
    () => playersWithIssues.filter(p => subs.includes(p._id)),
    [subs, playersWithIssues],
  )
  // Get just the IDs for API
  const selectedPlayerIds = useMemo(() => selectedPlayers.map(p => p._id), [selectedPlayers])
  const selectedSubIds = useMemo(() => selectedSubs.map(p => p._id), [selectedSubs])

  const handleJoin = async () => {
    if (!canJoin) {
      return
    }
    setIsSubmitting(true)
    try {
      // Pass main and subs as separate arrays for API
      await onJoin({
        teamMembers: selectedPlayerIds,
        substituteMembers: selectedSubIds,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to join tournament'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setSelected([])
      setSubs([])
      onClose()
    }
  }

  return (
    <TooltipProvider>
      <Dialog
        open={open}
        onOpenChange={isOpen => {
          if (!isOpen && !isSubmitting) {
            handleClose()
          }
        }}
      >
        <DialogContent className="bg-[#23272b] text-white border-neutral-700 p-0 shadow-2xl max-w-[700px] w-[98vw]">
          <DialogHeader className="px-6 pt-5 pb-0">
            <DialogTitle className="text-[20px] font-poppins">
              <Typo as="span" className="!text-[20px]" fontFamily="poppins" fontVariant="h5">
                SELECT PLAYERS
              </Typo>
            </DialogTitle>
            <Typo as="p" className="text-xs mt-1" fontVariant="p5">
              SELECT PLAYERS TO BUY TICKETS FOR THEM
            </Typo>
          </DialogHeader>
          <div className="p-6 pt-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate" style={{ borderSpacing: 0 }}>
                <thead>
                  <tr className="text-gray-300 text-xs">
                    <th className="py-2 w-[48px]"> </th>
                    <th className="py-2 w-[180px]">
                      <Typo as="span" fontVariant="p5">
                        Name
                      </Typo>
                    </th>
                    <th className="py-2 w-[120px]">
                      <Typo as="span" fontVariant="p5">
                        Issues
                      </Typo>
                    </th>
                    <th className="py-2 w-[120px]">
                      <Typo as="span" fontVariant="p5">
                        Players{' '}
                        <span className="text-xs">
                          {selected.length}/{maxPlayers}
                        </span>
                      </Typo>
                    </th>
                    {joinProcess.numberOfSubstitutes > 0 && (
                      <th className="py-2 w-[120px]">
                        <Typo as="span" fontVariant="p5">
                          Subs{' '}
                          <span className="text-xs">
                            {subs.length}/{joinProcess.numberOfSubstitutes}
                          </span>
                        </Typo>
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {playersWithIssues.map(player => (
                    <tr key={player._id} className="border-b border-[#3a3c40]">
                      <td className="py-2 pr-2">
                        <Image
                          unoptimized
                          alt="avatar"
                          className="w-8 h-8 rounded-full"
                          height={32}
                          src={userImageSanitizer(player.avatarUrl || '')}
                          width={32}
                        />
                      </td>
                      <td className="py-2 pr-2">
                        <Typo as="span" fontVariant="p4" fontWeight="bold">
                          {player.name}
                        </Typo>
                        {player.role && (
                          <Typo as="span" className="text-xs" color="ghostGrey" fontVariant="p5">
                            {player.role}
                          </Typo>
                        )}
                      </td>
                      <td className="py-2 pr-2">
                        <div className="flex gap-2 items-center relative">
                          {player.issues.length > 0 ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="inline-block cursor-pointer">
                                  <AlertTriangle className="w-6 h-6 text-yellow-400" />
                                </span>
                              </TooltipTrigger>
                              <TooltipContent
                                align="center"
                                className="z-[9999] bg-black/80 text-white w-[420px] max-w-[600px] px-8 py-5 backdrop-blur-sm"
                                side="top"
                              >
                                <Typo as="span" className="block mb-2" fontVariant="p4b">
                                  Issues:
                                </Typo>
                                <ul className="list-disc ml-4 mt-1">
                                  {player.issues.map((issue, i) => (
                                    <li key={i} className="mb-1">
                                      <Typo as="span" fontVariant="p5b">
                                        {issue}
                                      </Typo>
                                    </li>
                                  ))}
                                </ul>
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <span className="inline-block">
                              <CheckCircle2 className="w-6 h-6 text-green-500" />
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2 pr-2">
                        <input
                          checked={selected.includes(player._id)}
                          className="accent-[#e23a63] w-5 h-5"
                          disabled={
                            player.issues.length > 0 ||
                            (selected.length >= maxPlayers && !selected.includes(player._id)) ||
                            subs.includes(player._id)
                          }
                          type="checkbox"
                          onChange={() => handleToggle(player._id)}
                        />
                      </td>
                      {joinProcess.numberOfSubstitutes > 0 && (
                        <td className="py-2 pr-2">
                          <input
                            checked={subs.includes(player._id)}
                            className="accent-[#e23a63] w-5 h-5"
                            disabled={
                              player.issues.length > 0 ||
                              (subs.length >= joinProcess.numberOfSubstitutes &&
                                !subs.includes(player._id)) ||
                              selected.includes(player._id)
                            }
                            type="checkbox"
                            onChange={() => handleToggleSub(player._id)}
                          />
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <Button
                className="!w-auto !h-auto px-4 py-2"
                disabled={isSubmitting}
                label="Cancel"
                size="xxs"
                variant="black"
                onClick={handleClose}
              />
              <Button
                className="!w-auto !h-auto px-4 py-2"
                disabled={!canJoin || isSubmitting}
                label={isSubmitting ? 'Joining...' : 'Join'}
                size="xxs"
                variant="contained-red"
                onClick={handleJoin}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}

export default PlayerSelectModal
