'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

import TournamentModal from '@/components/tournament/TournamentModal'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/input'
import { updateProfile } from '@/services/userService'
import { linkOriginAccount } from '@/services/originService'
import { linkMobileLegendsAccount } from '@/services/MobileLegendService'
import { linkRiotGamesAccount } from '@/services/riotGamesService'
import {
  hasAgeInfo,
  hasEpicAccount,
  hasRiotAccount,
  hasSteamAccount,
  hasVerifiedEmail,
} from '@/lib/tournament/requirements'
import {
  getAccountTypeDisplayName,
  getAccountConnectionInstructions,
} from '@/utils/gameRequirements'
import type { Tournament } from '@/types/tournamentType'
import type { User } from '@/types/userType'
import FormNumberInput from '@/components/ui/FormNumberInput'

interface RequirementItem {
  id: string
  label: string
  satisfied: boolean
  actionLabel?: string
  onAction?: () => void
  description?: string
  editable?: boolean
  value?: string
  onChange?: (v: string) => void
  priority?: 'high' | 'medium' | 'low'
}

interface RequirementsCheckModalProps {
  open: boolean
  onClose: () => void
  tournament: Tournament
  user?: User
  /** Whether the current user is the owner of their team (for team tournaments) */
  isTeamOwner?: boolean
  onContinue: () => void
  onUpdateUser?: (patch: Partial<User>) => Promise<void> | void
}

interface FormData {
  fullName: string
  discord: string
  birthYear: string
  birthMonth: string
  birthDay: string
  originUsername: string
  mobileLegendsId: string
  mobileLegendsZone: string
  riotId: string
  riotTagline: string
}

// Helper function to check if a game is a Riot Games title
const isRiotGame = (gameName?: string): boolean => {
  if (!gameName) return false

  const gameNameLower = gameName.toLowerCase().trim()

  // Check for various Riot Games titles and their common variations
  const riotGamePatterns = [
    'league of legends',
    'league of legend',
    'lol',
    'league',
    'valorant',
    'val',
    'legends of runeterra',
    'runeterra',
    'teamfight tactics',
    'tft',
    'wild rift',
    'rift',
  ]

  return riotGamePatterns.some(pattern => gameNameLower.includes(pattern))
}

/**
 * Optimized modal for tournament requirements with mobile-first design and improved UX.
 * Features: consolidated state management, better performance, mobile responsiveness, and accessibility.
 */
const RequirementsCheckModal = ({
  open,
  onClose,
  tournament,
  user,
  isTeamOwner,
  onContinue,
  onUpdateUser: _onUpdateUser,
}: RequirementsCheckModalProps) => {
  const [_updating, setUpdating] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    discord: '',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    originUsername: '',
    mobileLegendsId: '',
    mobileLegendsZone: '',
    riotId: '',
    riotTagline: '',
  })
  const router = useRouter()
  const { data: session, update } = useSession()

  // Helper to safely read Mobile Legends account from possibly inconsistent shapes
  function getMobileLegendsFrom(obj: unknown): { id: string; zone: string } | null {
    if (!obj || typeof obj !== 'object') {
      return null
    }
    const o = obj as any
    const acc =
      o.connectedAcc || o.connectedacc || (o.user && (o.user.connectedAcc || o.user.connectedacc))
    if (!acc || typeof acc !== 'object') {
      return null
    }
    // accept mobileLegends or mobilelegends or mobile_legends
    const ml = acc.mobileLegends || acc.mobilelegends || acc.mobile_legends
    if (!ml || typeof ml !== 'object') {
      return null
    }
    // accept igame_id or game_id
    const id = ml.igame_id || ml.game_id || ml.gameId || ''
    const zone = ml.zone_id || ml.zoneId || ml.zone || ''
    return { id: String(id || ''), zone: String(zone || '') }
  }
  useEffect(() => {
    if (user) {
      // Parse datenaiss (MM/DD/YYYY)
      let birthYear = '',
        birthMonth = '',
        birthDay = ''
      if (user.datenaiss) {
        const birthdayParts = user.datenaiss.split('/')
        birthMonth = birthdayParts[0] || ''
        birthDay = birthdayParts[1] || ''
        birthYear = birthdayParts[2] || ''
      }

      const connectedAcc = user.connectedAcc as any

      setFormData({
        fullName: user.fullname || '',
        discord: user.socialMediaLinks?.discord || '',
        birthYear,
        birthMonth,
        birthDay,
        originUsername: user.connectedAcc?.origin?.username || '',
        mobileLegendsId: getMobileLegendsFrom(user)?.id || '',
        mobileLegendsZone: getMobileLegendsFrom(user)?.zone || '',
        riotId:
          connectedAcc?.Riotgames?.riotid ||
          connectedAcc?.riotgames?.riotid ||
          connectedAcc?.riotGames?.riotid ||
          '',
        riotTagline:
          connectedAcc?.Riotgames?.tagline ||
          connectedAcc?.riotgames?.tagline ||
          connectedAcc?.riotGames?.tagline ||
          '',
      })
    }
  }, [user])

  // Memoized requirement creation with better performance
  const requirements: RequirementItem[] = useMemo(() => {
    const jp = tournament.joinProcess
    const items: RequirementItem[] = []

    // High priority requirements first
    if (jp.requireVerifiedEmail) {
      items.push({
        id: 'verifiedEmail',
        label: 'Verified Email',
        satisfied: hasVerifiedEmail(user),
        actionLabel: hasVerifiedEmail(user) ? undefined : 'Verify',
        onAction: () => {
          toast.info('Please try to re-login to get the verified email completed.')
        },
        description: 'Organizer requires a verified email address.',
        priority: 'high',
      })
    }

    if (!user?.fullname) {
      items.push({
        id: 'fullname',
        label: 'Full Name',
        satisfied: Boolean(formData.fullName.trim()),
        editable: true,
        value: formData.fullName,
        onChange: v => setFormData(prev => ({ ...prev, fullName: v })),
        description: 'Your full name is required for tournament participation.',
        priority: 'high',
      })
    }

    if (jp.requireAgeVerification) {
      // Check if user has existing data OR has entered data in the form
      const hasExistingAge = Boolean(user?.datenaiss)
      const hasFormAge = Boolean(formData.birthYear && formData.birthMonth && formData.birthDay)

      // Only satisfied if all fields are filled and the date is valid
      let satisfied = false
      if (hasExistingAge) {
        satisfied = hasAgeInfo(user)
      } else if (hasFormAge) {
        // Check if date is valid
        const y = Number(formData.birthYear)
        const m = Number(formData.birthMonth)
        const d = Number(formData.birthDay)
        const date = new Date(y, m - 1, d)
        satisfied = date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d
      }

      items.push({
        id: 'age',
        label: 'Date of Birth',
        satisfied: satisfied || (hasExistingAge && hasAgeInfo(user)),
        editable: !hasExistingAge,
        value:
          !hasExistingAge && formData.birthYear && formData.birthMonth && formData.birthDay
            ? `${formData.birthYear}-${formData.birthMonth.padStart(2, '0')}-${formData.birthDay.padStart(2, '0')}`
            : undefined,
        onChange: undefined, // handled below with custom UI
        description: 'Date of birth is required for age verification.',
        priority: 'high',
      })
    }

    if (jp.requireDiscordUsername) {
      items.push({
        id: 'discord',
        label: 'Discord Username',
        satisfied: Boolean(formData.discord.trim()),
        editable: true,
        value: formData.discord,
        onChange: (v: string) => setFormData(prev => ({ ...prev, discord: v })),
        description: 'Discord username is required for team communication.',
        priority: 'medium',
      })
    }

    // Game account requirements - Riot Games (League of Legends, VALORANT, etc.)

    if (jp.requireCustomGameIdentifier && isRiotGame(tournament.game?.name)) {
      // Read Riot ID/Tagline from user session (accept multiple shapes)
      const connectedAcc = user?.connectedAcc as any
      const riotAcc =
        connectedAcc?.Riotgames || connectedAcc?.riotgames || connectedAcc?.riotGames || {}
      const riotIdVal = riotAcc.riotid || ''
      const riotTagVal = riotAcc.tagline || ''

      // Check if user has existing data OR has entered data in the form
      const hasExistingRiotId = Boolean(riotIdVal)
      const hasFormRiotId = Boolean(formData.riotId?.trim())
      const hasExistingRiotTag = Boolean(riotTagVal)
      const hasFormRiotTag = Boolean(formData.riotTagline?.trim())

      items.push({
        id: 'riotId',
        label: 'Riot ID',
        satisfied: hasExistingRiotId || hasFormRiotId,
        editable: !hasExistingRiotId,
        value: formData.riotId || '',
        onChange: v => setFormData(prev => ({ ...prev, riotId: v })),
        description: 'Enter your Riot ID (e.g., username).',
        priority: 'medium',
      })
      items.push({
        id: 'riotTagline',
        label: 'Riot Tagline',
        satisfied: hasExistingRiotTag || hasFormRiotTag,
        editable: !hasExistingRiotTag,
        value: formData.riotTagline || '',
        onChange: v => setFormData(prev => ({ ...prev, riotTagline: v })),
        description: 'Enter your Riot Tagline (e.g., #NA1).',
        priority: 'medium',
      })
    }

    // Game account requirements

    if (jp.requireSteamId) {
      items.push({
        id: 'steam',
        label: 'Steam Account',
        satisfied: hasSteamAccount(user),
        actionLabel: hasSteamAccount(user) ? undefined : 'Connect',
        onAction: () => {
          const userId = user?._id
          const path = userId
            ? `/user/${userId}/settings/Game-accounts/steam`
            : '/user/settings/Game-accounts/steam'
          router.push(path)
        },
        description: 'Steam account must be linked for this game.',
        priority: 'medium',
      })
    }

    if (jp.requireEpicGamesUsername) {
      items.push({
        id: 'epic',
        label: 'Epic Games Account',
        satisfied: hasEpicAccount(user),
        actionLabel: hasEpicAccount(user) ? undefined : 'Connect',
        onAction: () => {
          const userId = user?._id
          const path = userId
            ? `/user/${userId}/settings/Game-accounts/epicgames`
            : '/user/settings/Game-accounts/epicgames'
          router.push(path)
        },
        description: 'Epic Games account must be linked for this game.',
        priority: 'medium',
      })
    }

    // Check for Mobile Legends with different possible names
    const isMobileLegendsGame =
      tournament.game?.name === 'MobileLegends' ||
      tournament.game?.name === 'Mobile Legends' ||
      tournament.game?.name === 'Mobile Legends: Bang Bang' ||
      tournament.game?.name?.toLowerCase().includes('mobile') ||
      tournament.game?.name?.toLowerCase().includes('legends')

    if ((jp.requireGameAccount || jp.requireCustomGameIdentifier) && isMobileLegendsGame) {
      const ml = getMobileLegendsFrom(user)
      const hasExistingId = Boolean(ml?.id)
      const hasFormId = Boolean(formData.mobileLegendsId?.trim())
      const hasExistingZone = Boolean(ml?.zone)
      const hasFormZone = Boolean(formData.mobileLegendsZone?.trim())

      items.push({
        id: 'mobileLegendsId',
        label: 'Mobile Legends ID',
        satisfied: hasExistingId || hasFormId,
        editable: !hasExistingId,
        value: formData.mobileLegendsId || '',
        onChange: v => setFormData(prev => ({ ...prev, mobileLegendsId: v })),
        description: 'Enter your Mobile Legends ID.',
        priority: 'medium',
      })
      items.push({
        id: 'mobileLegendsZone',
        label: 'Mobile Legends Zone',
        satisfied: hasExistingZone || hasFormZone,
        editable: !hasExistingZone,
        value: formData.mobileLegendsZone || '',
        onChange: v => setFormData(prev => ({ ...prev, mobileLegendsZone: v })),
        description: 'Enter your Mobile Legends Zone.',
        priority: 'medium',
      })
    }

    if (jp.requireRankRating) {
      items.push({
        id: 'rank',
        label: 'Rank Rating',
        satisfied: false,
        actionLabel: 'Add',
        onAction: () => {
          const userId = user?._id
          const path = userId
            ? `/user/${userId}/settings/Game-accounts/rank`
            : '/user/settings/Game-accounts/rank'
          router.push(path)
        },
        description: 'Rank rating information is required.',
        priority: 'low',
      })
    }

    if (jp.requireCustomGameIdentifier) {
      const gameRequiredAccounts = tournament.game?.requiredAccounts || []

      if (gameRequiredAccounts.length > 0) {
        // Show individual account requirements for the game
        gameRequiredAccounts.forEach((accountType, index) => {
          const displayName = getAccountTypeDisplayName(accountType)
          const instructions = getAccountConnectionInstructions(accountType)
          const acctKey = String(accountType).toLowerCase()
          if (acctKey === 'origin') {
            items.push({
              id: `gameAccount_${accountType}_${index}`,
              label: `${displayName} Account`,
              satisfied: Boolean((formData.originUsername || '').trim()),
              editable: true,
              value: formData.originUsername || '',
              onChange: v => setFormData(prev => ({ ...prev, originUsername: v })),
              description: instructions,
              priority: 'medium',
            })
          }
        })
      } else {
        // Fallback for games without specific account requirements
        items.push({
          id: 'customGameIdentifier',
          label: 'Custom Game Identifier',
          satisfied: false,
          actionLabel: 'Add',
          onAction: () => {
            const userId = user?._id
            const path = userId
              ? `/user/${userId}/settings/Game-accounts/customGameIdentifier`
              : '/user/settings/Game-accounts/customGameIdentifier'
            router.push(path)
          },
          description: 'Custom game identifier is required for this tournament.',
          priority: 'medium',
        })
      }
    }

    // Sort by priority: high -> medium -> low
    return items.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      return priorityOrder[a.priority || 'medium'] - priorityOrder[b.priority || 'medium']
    })
  }, [tournament, user, formData, router])

  const allSatisfied = requirements.every(r => r.satisfied)
  const hasEditableFields = requirements.some(r => r.editable)

  // Consolidated update function to avoid code duplication
  const updateUserData = useCallback(
    async (data: Partial<FormData>) => {
      setUpdating(true)
      try {
        const patch: Partial<User> = {}
        const payload: Record<string, unknown> = {}
        let hasProfileChanges = false
        const jp = tournament.joinProcess

        // Handle regular profile updates - only if they're required and changed
        if (data.fullName?.trim() && user?.fullname !== data.fullName.trim()) {
          patch.fullname = data.fullName.trim()
          payload.fullname = data.fullName.trim()
          hasProfileChanges = true
        }

        // Handle Discord - only if required and changed
        if (jp.requireDiscordUsername && data.discord?.trim()) {
          const discordVal = data.discord.trim()
          const existingDiscord =
            ((session?.user as any)?.socialMediaLinks?.discord as string | undefined) ||
            (user?.socialMediaLinks?.discord as string | undefined)
          if (existingDiscord !== discordVal) {
            payload.discord = discordVal
            patch.socialMediaLinks = {
              ...user?.socialMediaLinks,
              discord: discordVal,
            }
            hasProfileChanges = true
          }
        }

        // Handle date of birth - only if required and not already set
        if (
          jp.requireAgeVerification &&
          !user?.datenaiss &&
          data.birthYear &&
          data.birthMonth &&
          data.birthDay
        ) {
          const datenaiss = `${data.birthMonth.padStart(2, '0')}/${data.birthDay.padStart(2, '0')}/${data.birthYear}`
          payload.datenaiss = datenaiss
          patch.datenaiss = datenaiss
          hasProfileChanges = true
        }

        // Handle Origin account - only if required and changed
        if (jp.requireCustomGameIdentifier && data.originUsername?.trim()) {
          const originUsername = data.originUsername.trim()
          const existingOrigin =
            ((session?.user as any)?.connectedAcc?.origin?.username as string | undefined) ||
            (user?.connectedAcc?.origin?.username as string | undefined)

          const normalizedExisting = (existingOrigin || '').trim().toLowerCase()
          const normalizedNew = originUsername.trim().toLowerCase()

          if (!normalizedExisting || normalizedExisting !== normalizedNew) {
            try {
              await linkOriginAccount(originUsername)
              await update({
                user: {
                  ...session?.user,
                  connectedAcc: {
                    ...(session?.user as any)?.connectedAcc,
                    origin: {
                      ...(session?.user as any)?.connectedAcc?.origin,
                      username: originUsername,
                    },
                  },
                },
              })
              setFormData(prev => ({ ...prev, originUsername }))
              try {
                router.refresh()
              } catch {}
              toast.success('Origin account linked successfully')
            } catch (error) {
              console.error('Failed to link Origin account:', error)
              const msg = (error as any)?.response?.data?.message || 'Failed to link Origin account'
              toast.error(msg)
              throw error
            }
          }
        }

        // Handle Mobile Legends account - only if required and changed
        const isMobileLegendsGame =
          tournament.game?.name === 'MobileLegends' ||
          tournament.game?.name === 'Mobile Legends' ||
          tournament.game?.name === 'Mobile Legends: Bang Bang' ||
          tournament.game?.name?.toLowerCase().includes('mobile') ||
          tournament.game?.name?.toLowerCase().includes('legends')

        if (
          isMobileLegendsGame &&
          data.mobileLegendsId &&
          data.mobileLegendsZone &&
          (jp.requireGameAccount || jp.requireCustomGameIdentifier)
        ) {
          const mlId = (data.mobileLegendsId || '').trim()
          const mlZone = (data.mobileLegendsZone || '').trim()
          const existingML = getMobileLegendsFrom(user)

          if (
            mlId &&
            mlZone &&
            (!existingML?.id || existingML.id !== mlId || existingML.zone !== mlZone)
          ) {
            try {
              await linkMobileLegendsAccount({ game_id: mlId, zone_id: mlZone })
              await update({
                user: {
                  ...session?.user,
                  connectedAcc: {
                    ...(session?.user as any)?.connectedAcc,
                    // camelCase shape
                    mobileLegends: {
                      igame_id: mlId,
                      zone_id: mlZone,
                      game_id: mlId,
                    },
                    // lowercase shape (some sessions use this)
                    mobilelegends: {
                      game_id: mlId,
                      zone_id: mlZone,
                    },
                  },
                },
              })
              setFormData(prev => ({
                ...prev,
                mobileLegendsId: mlId,
                mobileLegendsZone: mlZone,
              }))
              try {
                router.refresh()
              } catch {}
              toast.success('Mobile Legends account linked successfully')
            } catch (error) {
              console.error('Failed to link Mobile Legends account:', error)
              const msg =
                (error as any)?.response?.data?.message || 'Failed to link Mobile Legends account'
              toast.error(msg)
              throw error
            }
          }
        }

        // Handle Riot account - only if required and changed (for Riot games only)
        if (jp.requireCustomGameIdentifier && isRiotGame(tournament.game?.name)) {
          const riotId = (data.riotId || '').trim()
          const riotTag = (data.riotTagline || '').trim()
          const connectedAcc = user?.connectedAcc as any
          const existingRiot =
            connectedAcc?.Riotgames || connectedAcc?.riotgames || connectedAcc?.riotGames

          // Only update if we have both values AND they're different from existing
          if (
            riotId &&
            riotTag &&
            (!existingRiot?.riotid ||
              existingRiot.riotid !== riotId ||
              existingRiot.tagline !== riotTag)
          ) {
            try {
              await linkRiotGamesAccount({
                riotid: riotId || existingRiot?.riotid || '',
                tagline: riotTag || existingRiot?.tagline || '',
              })
              await update({
                user: {
                  ...session?.user,
                  connectedAcc: {
                    ...(session?.user as any)?.connectedAcc,
                    Riotgames: {
                      riotid: riotId || existingRiot?.riotid || '',
                      tagline: riotTag || existingRiot?.tagline || '',
                    },
                  },
                },
              })
              setFormData(prev => ({
                ...prev,
                riotId: riotId || existingRiot?.riotid || '',
                riotTagline: riotTag || existingRiot?.tagline || '',
              }))
              try {
                router.refresh()
              } catch {}
              toast.success('Riot account linked successfully')
            } catch (error) {
              console.error('Failed to link Riot account:', error)
              const msg = (error as any)?.response?.data?.message || 'Failed to link Riot account'
              toast.error(msg)
              throw error
            }
          }
        }

        if (hasProfileChanges) {
          if (patch.fullname) {
            payload.fullname = patch.fullname
          }

          try {
            await updateProfile(payload)
          } catch (error) {
            // Log the error but continue with session update
            console.error('Backend profile update failed:', error)
            // Don't rethrow - we want to update the session anyway
          }

          // Always update the session with the new data
          await update({
            user: {
              ...session?.user,
              fullname: data.fullName?.trim() || session?.user?.fullname,
              datenaiss: patch.datenaiss || session?.user?.datenaiss,
              socialMediaLinks: {
                ...(session?.user as any)?.socialMediaLinks,
                ...(patch as any).socialMediaLinks,
              },
              connectedAcc: {
                ...(session?.user as any)?.connectedAcc,
                ...(patch as any).connectedAcc,
              },
            },
          })
          try {
            router.refresh()
          } catch {}

          toast.success('Profile updated successfully')
        } else {
          toast.info('Nothing to update. Your info is already up to date.')
        }
      } catch (error) {
        throw error
      } finally {
        setUpdating(false)
      }
    },
    [user, session, update, router],
  )

  const handleNext = useCallback(async () => {
    // For team tournaments:
    if (tournament.gameMode === 'Team' && user) {
      if (!isTeamOwner) {
        // Team member: save and close
        await updateUserData(formData)
        toast.success(
          'Requirements Done! Create a team or wait for your team owner to join the tournament.',
        )
        onClose()
        return
      } else {
        // Team owner: show confirmation step
        setShowConfirmation(true)
        return
      }
    }
    // Otherwise, show confirmation inline
    setShowConfirmation(true)
  }, [formData, tournament.gameMode, user, updateUserData, onClose, isTeamOwner])

  const handleConfirmData = useCallback(async () => {
    setIsConfirming(true)
    try {
      // Save form data and then continue
      if (hasEditableFields) {
        await updateUserData(formData)
      }
      setShowConfirmation(false)
      setIsConfirming(false)

      // Show appropriate message based on tournament type
      if (tournament.gameMode === 'Team') {
        toast.success('Requirements saved! You can now join the tournament with your team.')
      }
      onContinue?.()
    } catch (error) {
      setIsConfirming(false)
    }
  }, [hasEditableFields, updateUserData, formData, onContinue, tournament.gameMode])

  const handleGoBack = useCallback(() => {
    setShowConfirmation(false)
  }, [])

  return (
    <>
      <TournamentModal
        confirmLabel={
          showConfirmation
            ? isConfirming
              ? 'Saving...'
              : 'Confirm & Continue'
            : allSatisfied
              ? 'Next'
              : undefined
        }
        description={
          showConfirmation
            ? 'Please review your information before proceeding'
            : 'Complete these requirements to join the tournament'
        }
        open={open}
        title={showConfirmation ? 'Confirm Your Information' : 'Tournament Requirements'}
        onClose={showConfirmation ? handleGoBack : onClose}
        onConfirm={showConfirmation ? handleConfirmData : allSatisfied ? handleNext : undefined}
      >
        <div className="w-full space-y-3 sm:space-y-4 max-h-[60vh] overflow-y-auto">
          {!showConfirmation ? (
            <>
              {/* Progress indicator */}
              <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                <span>Requirements Progress</span>
                <span className="font-medium">
                  {requirements.filter(r => r.satisfied).length} / {requirements.length}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
                <div
                  className="bg-gradient-to-r from-defendrRed to-pink-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(requirements.filter(r => r.satisfied).length / requirements.length) * 100}%`,
                  }}
                />
              </div>
            </>
          ) : (
            <>
              {/* Confirmation header */}
              <div className="text-sm text-gray-300 mb-4">
                Please verify that the following information is correct:
              </div>
            </>
          )}

          {/* Requirements list or Confirmation data */}
          <div className="space-y-3 sm:space-y-4">
            {!showConfirmation ? (
              // Show requirements
              requirements.map((req, index) => (
                <div
                  key={req.id}
                  aria-label={`Requirement ${index + 1}: ${req.label}`}
                  className={`
                  relative flex flex-col gap-3 sm:gap-2 border rounded-lg p-3 sm:p-4 transition-all duration-200
                  ${
                    req.satisfied
                      ? 'border-green-500/30 bg-green-500/5'
                      : 'border-white/10 bg-gray-800/30 hover:bg-gray-800/40'
                  }
                  ${req.priority === 'high' ? 'ring-1 ring-defendrRed/20' : ''}
                `}
                  role="region"
                >
                  {/* Header Section */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="text-sm sm:text-base font-medium text-white truncate">
                        {req.label}
                      </span>
                      {req.priority === 'high' && (
                        <span className="text-xs text-defendrRed bg-defendrRed/10 px-1.5 py-0.5 rounded">
                          Required
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {req.satisfied ? (
                        <span className="text-green-400 text-xs bg-green-400/10 px-2 py-1 rounded-full flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              clipRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              fillRule="evenodd"
                            />
                          </svg>
                          Complete
                        </span>
                      ) : (
                        <span className="text-pink-500 text-xs bg-pink-500/10 px-2 py-1 rounded-full flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              clipRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                              fillRule="evenodd"
                            />
                          </svg>
                          Missing
                        </span>
                      )}

                      {!req.satisfied && req.actionLabel && !req.editable && (
                        <Button
                          className="text-xs sm:text-sm px-4 py-2 rounded-full shadow-sm whitespace-nowrap w-auto sm:w-auto"
                          aria-label={`${req.actionLabel} ${req.label}`}
                          label={req.actionLabel}
                          size="s"
                          variant="contained-red"
                          onClick={req.onAction}
                        />
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  {req.description && (
                    <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                      {req.description}
                    </p>
                  )}

                  {/* Input Field */}
                  {req.editable && req.id === 'age' ? (
                    <div className="flex gap-2 w-full">
                      <div className="relative w-1/3">
                        <span className="ms-3 p-2 text-gray-400 font-semibold text-xs">Year</span>
                        <select
                          className="bg-[#2a2a2b] rounded-3xl ps-6 h-10 p-2 text-white w-full appearance-none focus:outline-none border border-white/10"
                          value={formData.birthYear}
                          onChange={e =>
                            setFormData(prev => ({ ...prev, birthYear: e.target.value }))
                          }
                        >
                          <option value="">Year</option>
                          {Array.from({ length: 75 }, (_, i) => 2025 - i).map(y => (
                            <option key={y} value={y.toString()}>
                              {y}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="relative w-1/3">
                        <span className="ms-3 p-2 text-gray-400 font-semibold text-xs">Month</span>
                        <select
                          className="bg-[#2a2a2b] rounded-3xl ps-6 h-10 p-2 text-white w-full appearance-none focus:outline-none border border-white/10"
                          value={formData.birthMonth}
                          onChange={e =>
                            setFormData(prev => ({ ...prev, birthMonth: e.target.value }))
                          }
                        >
                          <option value="">Month</option>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                            <option key={m} value={m.toString().padStart(2, '0')}>
                              {m.toString().padStart(2, '0')}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="relative w-1/3">
                        <span className="ms-3 p-2 text-gray-400 font-semibold text-xs">Day</span>
                        <select
                          className="bg-[#2a2a2b] rounded-3xl ps-6 h-10 p-2 text-white w-full appearance-none focus:outline-none border border-white/10"
                          value={formData.birthDay}
                          onChange={e =>
                            setFormData(prev => ({ ...prev, birthDay: e.target.value }))
                          }
                        >
                          <option value="">Day</option>
                          {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                            <option key={d} value={d.toString().padStart(2, '0')}>
                              {d.toString().padStart(2, '0')}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ) : req.editable && req.id === 'mobileLegendsId' ? (
                    <div className="w-full">
                      <FormNumberInput
                        className="w-full"
                        description="Enter your Mobile Legends ID."
                        label="Mobile Legends ID"
                        onChange={val => req.onChange?.(val.toString())}
                        placeholder="Enter your Mobile Legends ID (numbers only)"
                        value={parseInt(req.value || '0') || 0}
                      />
                    </div>
                  ) : req.editable && req.id === 'mobileLegendsZone' ? (
                    <div className="w-full">
                      <FormNumberInput
                        className="w-full"
                        description="Enter your Mobile Legends Zone."
                        label="Mobile Legends Zone"
                        onChange={val => req.onChange?.(val.toString())}
                        placeholder="Enter your Mobile Legends Zone (numbers only)"
                        value={parseInt(req.value || '0') || 0}
                      />
                    </div>
                  ) : req.editable ? (
                    <div className="w-full">
                      <Input
                        aria-label={`Enter your ${req.label.toLowerCase()}`}
                        className="w-full bg-[#2a2a2b] border border-white/10 hover:bg-[#333] focus:border-defendrRed transition-colors text-sm"
                        placeholder={`Enter your ${req.label.toLowerCase()}`}
                        size="s"
                        textClassName="text-sm"
                        value={req.value || ''}
                        onChange={val => req.onChange?.(val)}
                      />
                    </div>
                  ) : null}
                </div>
              ))
            ) : (
              // Show confirmation data
              <>
                {formData.fullName && (
                  <div className="bg-defendrLightBlack/40 border border-defendrGrey rounded-lg p-3">
                    <div className="text-sm font-medium text-white">Full Name</div>
                    <div className="text-sm text-gray-300 mt-1">{formData.fullName}</div>
                  </div>
                )}

                {formData.discord && (
                  <div className="bg-defendrLightBlack/40 border border-defendrGrey rounded-lg p-3">
                    <div className="text-sm font-medium text-white">Discord Username</div>
                    <div className="text-sm text-gray-300 mt-1">{formData.discord}</div>
                  </div>
                )}

                {formData.birthYear && formData.birthMonth && formData.birthDay && (
                  <div className="bg-defendrLightBlack/40 border border-defendrGrey rounded-lg p-3">
                    <div className="text-sm font-medium text-white">Date of Birth</div>
                    <div className="text-sm text-gray-300 mt-1">
                      {formData.birthMonth.padStart(2, '0')}/{formData.birthDay.padStart(2, '0')}/
                      {formData.birthYear}
                    </div>
                  </div>
                )}

                {formData.originUsername && (
                  <div className="bg-defendrLightBlack/40 border border-defendrGrey rounded-lg p-3">
                    <div className="text-sm font-medium text-white">EA/Origin Account</div>
                    <div className="text-sm text-gray-300 mt-1">{formData.originUsername}</div>
                  </div>
                )}

                {formData.mobileLegendsId &&
                  formData.mobileLegendsZone &&
                  (tournament.game?.name === 'MobileLegends' ||
                    tournament.game?.name === 'Mobile Legends' ||
                    tournament.game?.name === 'Mobile Legends: Bang Bang' ||
                    tournament.game?.name?.toLowerCase().includes('mobile') ||
                    tournament.game?.name?.toLowerCase().includes('legends')) && (
                    <div className="bg-defendrLightBlack/40 border border-defendrGrey rounded-lg p-3">
                      <div className="text-sm font-medium text-white">Mobile Legends Account</div>
                      <div className="text-sm text-gray-300 mt-1">
                        ID: {formData.mobileLegendsId} | Zone: {formData.mobileLegendsZone}
                      </div>
                    </div>
                  )}

                {formData.riotId && formData.riotTagline && isRiotGame(tournament.game?.name) && (
                  <div className="bg-defendrLightBlack/40 border border-defendrGrey rounded-lg p-3">
                    <div className="text-sm font-medium text-white">Riot Games Account</div>
                    <div className="text-sm text-gray-300 mt-1">
                      {formData.riotId}#{formData.riotTagline}
                    </div>
                  </div>
                )}

                <div className="text-xs text-gray-500 mt-4 p-3 bg-gray-800/20 rounded-lg">
                  <p>
                    Click "Confirm & Continue" to save this information and proceed with tournament
                    registration.
                  </p>
                </div>

                {/* Custom Cancel Button */}
                <div className="flex justify-center mt-4">
                  <Button
                    className="px-6"
                    label="Cancel"
                    size="m"
                    variant="black"
                    onClick={handleGoBack}
                  />
                </div>
              </>
            )}
          </div>

          {/* Help text */}
          {!showConfirmation && !allSatisfied && (
            <div className="text-center text-xs text-gray-500 mt-4 p-3 bg-gray-800/20 rounded-lg">
              <p>Complete all requirements above to continue with tournament registration.</p>
            </div>
          )}
        </div>
      </TournamentModal>
    </>
  )
}

export default RequirementsCheckModal
