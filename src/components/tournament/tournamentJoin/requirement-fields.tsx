'use client'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { JoinProcess } from '@/types/tournamentType'
import { useSession } from 'next-auth/react'
import { getUserById } from '@/services/userService'
import { Game, GameAccountType } from '@/types/gameType'

type RequirementFieldsProps = {
  joinProcess: JoinProcess
  game?: Game // Add game prop to check requiredAccounts
  onValidationChange: (isValid: boolean, formData?: any) => void
}

const RequirementFields = ({ joinProcess, game, onValidationChange }: RequirementFieldsProps) => {
  const { data: session } = useSession()
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const requiredAccounts = game?.requiredAccounts ?? []
  const requiresCustomAccounts =
    joinProcess.requireCustomGameIdentifier && requiredAccounts.length > 0
  const hasRequiredAccount = (account: GameAccountType) =>
    requiresCustomAccounts && requiredAccounts.includes(account)
  const requiresSteam = joinProcess.requireSteamId || hasRequiredAccount('Steam')
  const requiresEpic = joinProcess.requireEpicGamesUsername || hasRequiredAccount('Epic')
  const requiresRiot = joinProcess.requireRiotId || hasRequiredAccount('Riot')

  const requiredGamePaths: Record<string, string | string[]> = {
    Steam: 'connectedAcc.steam.steamId',
    Epic: 'connectedAcc.epicGames.userId',
    Origin: 'connectedAcc.origin.username',
    Riot: ['connectedAcc.riot.gameName', 'connectedAcc.Riotgames.riotid'],
    'Battle-Net': 'connectedAcc.battleNet.battletag',
    PSN: 'connectedAcc.psn.username',
    XBOX: 'connectedAcc.xbox.gamerTag',
    MobileLegends: 'connectedAcc.mobilelegends.game_id',
    konami: 'connectedAcc.efootball.username',
  }

  const getNestedValue = (obj: any, path: string): any => {
    const parts = path.split('.')
    let value = obj
    for (const part of parts) {
      value = value?.[part]
      if (!value) break
    }
    return value
  }

  // Build dynamic Zod schema based on joinProcess requirements
  const buildSchema = () => {
    const schemaFields: Record<string, z.ZodTypeAny> = {}

    if (joinProcess.requireDiscordUsername) {
      schemaFields.discordUsername = z
        .string()
        .min(2, 'Discord username must be at least 2 characters')
        .max(32, 'Discord username must be at most 32 characters')
    }

    if (requiresEpic) {
      schemaFields.epicGamesUsername = z
        .string()
        .min(3, 'Epic Games username must be at least 3 characters')
        .max(16, 'Epic Games username must be at most 16 characters')
    }

    if (requiresSteam) {
      schemaFields.steamId = z.string().min(1, 'Steam ID is required')
    }

    if (requiresRiot) {
      schemaFields.riotGameName = z.string().min(1, 'Riot game name is required')
      schemaFields.riotTagline = z.string().min(1, 'Riot tagline is required')
    }

    if (joinProcess.requiredPhoneNumber) {
      schemaFields.phoneNumber = z
        .string()
        .min(8, 'Phone number must be at least 8 digits')
        .regex(/^\+?[0-9\s\-()]+$/, 'Invalid phone number format')
    }

    if (joinProcess.requireAgeVerification) {
      schemaFields.dateOfBirth = z.string().refine(
        val => {
          const date = new Date(val)
          const age = Math.floor((Date.now() - date.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
          return age >= 13
        },
        { message: 'You must be at least 13 years old' },
      )
    }

    if (joinProcess.requiredCountry) {
      schemaFields.country = z.string().min(2, 'Country is required')
    }

    if (joinProcess.requiredFullname) {
      schemaFields.fullname = z
        .string()
        .min(2, 'Full name must be at least 2 characters')
        .max(100, 'Full name must be at most 100 characters')
    }

    if (joinProcess.requiredFacebookLink) {
      schemaFields.facebookLink = z
        .string()
        .url('Must be a valid URL')
        .regex(/^https?:\/\/(www\.)?facebook\.com\/.+/i, 'Must be a valid Facebook profile link')
    }

    if (joinProcess.requiredInstagramLink) {
      schemaFields.instagramLink = z
        .string()
        .url('Must be a valid URL')
        .regex(/^https?:\/\/(www\.)?instagram\.com\/.+/i, 'Must be a valid Instagram profile link')
    }

    // Add custom game identifier fields if required
    if (requiresCustomAccounts) {
      requiredAccounts.forEach(account => {
        switch (account) {
          case 'MobileLegends':
            schemaFields.mobileLegends_gameId = z
              .string()
              .min(1, 'Mobile Legends Game ID is required')
            schemaFields.mobileLegends_zoneId = z
              .string()
              .min(1, 'Mobile Legends Zone ID is required')
            break
          case 'Battle-Net':
            schemaFields.battlenet_battletag = z.string().min(1, 'Battle.net Battletag is required')
            break
          case 'PSN':
            schemaFields.psn_username = z.string().min(1, 'PSN Username is required')
            break
          case 'XBOX':
            schemaFields.xbox_gamertag = z.string().min(1, 'Xbox Gamertag is required')
            break
          case 'Origin':
            schemaFields.origin_username = z.string().min(1, 'Origin Username is required')
            break
          case 'konami':
            schemaFields.efootball_username = z.string().min(1, 'eFootball Username is required')
            break
          // Steam, Epic, and Riot are already covered by existing fields
        }
      })
    }

    // If no requirements, return a schema that always validates
    if (Object.keys(schemaFields).length === 0) {
      return z.object({})
    }

    return z.object(schemaFields)
  }

  const schema = buildSchema()
  type FormData = z.infer<typeof schema>

  const {
    register,
    formState: { errors, isValid },
    watch,
    reset,
    trigger,
  } = useForm<any>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })

  const watchedValues = watch()

  // Fetch user data and populate default values
  useEffect(() => {
    const loadUserData = async () => {
      if (!session?.user?._id) {
        setIsLoadingUser(false)
        return
      }

      try {
        const userData = await getUserById(session.user._id)

        // Build default values from user data
        const defaultValues: any = {}

        if (joinProcess.requireDiscordUsername && userData.discordId) {
          defaultValues.discordUsername = userData.discordId
        }

        if (requiresEpic && userData.connectedAcc?.epicGames?.userId) {
          defaultValues.epicGamesUsername = userData.connectedAcc.epicGames.userId
        }

        if (requiresSteam && userData.connectedAcc?.steam?.steamId) {
          defaultValues.steamId = userData.connectedAcc.steam.steamId
        }

        if (requiresRiot) {
          const riotData = userData.connectedAcc?.Riotgames || userData.connectedAcc?.riot
          if (riotData) {
            const riotid = riotData.riotid || riotData.gameName
            const tagline = riotData.tagline || riotData.tagLine
            if (riotid && tagline) {
              defaultValues.riotGameName = riotid
              defaultValues.riotTagline = tagline
            }
          }
        }

        if (joinProcess.requiredPhoneNumber && userData.phone) {
          defaultValues.phoneNumber = String(userData.phone)
        }

        if (joinProcess.requireAgeVerification && userData.datenaiss) {
          defaultValues.dateOfBirth = userData.datenaiss
        }

        if (joinProcess.requiredCountry && userData.country) {
          defaultValues.country = userData.country
        }

        if (joinProcess.requiredFullname && userData.fullname) {
          defaultValues.fullname = userData.fullname
        }

        if (joinProcess.requiredFacebookLink && userData.socialMediaLinks?.facebook) {
          defaultValues.facebookLink = userData.socialMediaLinks.facebook
        }

        if (joinProcess.requiredInstagramLink && userData.socialMediaLinks?.instagram) {
          defaultValues.instagramLink = userData.socialMediaLinks.instagram
        }

        // Load custom game identifier data
        if (requiresCustomAccounts) {
          requiredAccounts.forEach(account => {
            const path = requiredGamePaths[account]
            if (!path) return

            let value = null

            // Handle multiple possible paths (for Riot)
            if (Array.isArray(path)) {
              for (const p of path) {
                const v = getNestedValue(userData, p)
                if (v) {
                  value = v
                  break
                }
              }
            } else {
              value = getNestedValue(userData, path)
            }

            if (value) {
              switch (account) {
                case 'MobileLegends':
                  defaultValues.mobileLegends_gameId = value
                  if (userData.connectedAcc?.mobilelegends?.zone_id) {
                    defaultValues.mobileLegends_zoneId = userData.connectedAcc.mobilelegends.zone_id
                  }
                  break
                case 'Battle-Net':
                  defaultValues.battlenet_battletag = value
                  break
                case 'PSN':
                  defaultValues.psn_username = value
                  break
                case 'XBOX':
                  defaultValues.xbox_gamertag = value
                  break
                case 'Origin':
                  defaultValues.origin_username = value
                  break
                case 'konami':
                  defaultValues.efootball_username = value
                  break
                case 'Steam':
                  defaultValues.steamId = value
                  break
                case 'Epic':
                  defaultValues.epicGamesUsername = value
                  break
                case 'Riot':
                  const riotData = userData.connectedAcc?.Riotgames || userData.connectedAcc?.riot
                  if (riotData) {
                    const riotid = riotData.riotid || riotData.gameName
                    const tagline = riotData.tagline || riotData.tagLine
                    if (riotid && tagline) {
                      defaultValues.riotGameName = riotid
                      defaultValues.riotTagline = tagline
                    }
                  }
                  break
              }
            }
          })
        }

        // Reset form with default values
        reset(defaultValues)

        // Trigger validation to enable confirm button if all fields are valid
        setTimeout(() => {
          trigger()
        }, 0)
      } catch (error) {
        console.error('Error loading user data:', error)
      } finally {
        setIsLoadingUser(false)
      }
    }

    loadUserData()
  }, [session?.user?._id, joinProcess, game, reset, trigger])

  // Watch all fields to trigger validation
  useEffect(() => {
    onValidationChange(isValid, watchedValues)
  }, [isValid, watchedValues, onValidationChange])

  // If no requirements, mark as valid immediately
  useEffect(() => {
    if (Object.keys(schema.shape).length === 0) {
      onValidationChange(true, {})
    }
  }, [schema, onValidationChange])

  // If no requirements, don't render anything
  if (Object.keys(schema.shape).length === 0) {
    return null
  }

  // Show loading state while fetching user data
  if (isLoadingUser) {
    return (
      <div className="w-full space-y-4 px-4 py-6">
        <div className="flex items-center justify-center gap-2 text-gray-400">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-defendrRed"></div>
          <span className="text-sm">Loading your information...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-4 px-4 py-6">
      <p className="text-sm text-gray-400">
        Please provide the following information to complete your registration
      </p>

      <div className="space-y-4">
        {joinProcess.requiredFullname && (
          <div className="flex flex-col gap-1">
            <label htmlFor="fullname" className="text-sm font-medium text-white">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="fullname"
              type="text"
              placeholder="John Doe"
              {...register('fullname')}
              className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder:text-gray-500 focus:outline-none focus:border-defendrRed"
            />
            {errors.fullname && (
              <span className="text-xs text-red-500">{String(errors.fullname.message)}</span>
            )}
          </div>
        )}

        {joinProcess.requireDiscordUsername && (
          <div className="flex flex-col gap-1">
            <label htmlFor="discordUsername" className="text-sm font-medium text-white">
              Discord Username <span className="text-red-500">*</span>
            </label>
            <input
              id="discordUsername"
              type="text"
              placeholder="username#1234"
              {...register('discordUsername')}
              className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder:text-gray-500 focus:outline-none focus:border-defendrRed"
            />
            {errors.discordUsername && (
              <span className="text-xs text-red-500">{String(errors.discordUsername.message)}</span>
            )}
          </div>
        )}

        {requiresEpic && (
          <div className="flex flex-col gap-1">
            <label htmlFor="epicGamesUsername" className="text-sm font-medium text-white">
              Epic Games Username <span className="text-red-500">*</span>
            </label>
            <input
              id="epicGamesUsername"
              type="text"
              placeholder="YourEpicName"
              {...register('epicGamesUsername')}
              className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder:text-gray-500 focus:outline-none focus:border-defendrRed"
            />
            {errors.epicGamesUsername && (
              <span className="text-xs text-red-500">
                {String(errors.epicGamesUsername.message)}
              </span>
            )}
          </div>
        )}

        {requiresSteam && (
          <div className="flex flex-col gap-1">
            <label htmlFor="steamId" className="text-sm font-medium text-white">
              Steam ID <span className="text-red-500">*</span>
            </label>
            <input
              id="steamId"
              type="text"
              placeholder="76561198012345678"
              {...register('steamId')}
              className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder:text-gray-500 focus:outline-none focus:border-defendrRed"
            />
            {errors.steamId && (
              <span className="text-xs text-red-500">{String(errors.steamId.message)}</span>
            )}
          </div>
        )}

        {requiresRiot && (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-white">
              Riot ID <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <input
                  id="riotGameName"
                  type="text"
                  placeholder="Game Name"
                  {...register('riotGameName')}
                  className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder:text-gray-500 focus:outline-none focus:border-defendrRed"
                />
                {errors.riotGameName && (
                  <span className="text-xs text-red-500">
                    {String(errors.riotGameName.message)}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <input
                  id="riotTagline"
                  type="text"
                  placeholder="TAG"
                  {...register('riotTagline')}
                  className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder:text-gray-500 focus:outline-none focus:border-defendrRed"
                />
                {errors.riotTagline && (
                  <span className="text-xs text-red-500">{String(errors.riotTagline.message)}</span>
                )}
              </div>
            </div>
          </div>
        )}

        {joinProcess.requiredPhoneNumber && (
          <div className="flex flex-col gap-1">
            <label htmlFor="phoneNumber" className="text-sm font-medium text-white">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              id="phoneNumber"
              type="tel"
              placeholder="+1 234 567 8900"
              {...register('phoneNumber')}
              className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder:text-gray-500 focus:outline-none focus:border-defendrRed"
            />
            {errors.phoneNumber && (
              <span className="text-xs text-red-500">{String(errors.phoneNumber.message)}</span>
            )}
          </div>
        )}

        {joinProcess.requireAgeVerification && (
          <div className="flex flex-col gap-1">
            <label htmlFor="dateOfBirth" className="text-sm font-medium text-white">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              id="dateOfBirth"
              type="date"
              {...register('dateOfBirth')}
              className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder:text-gray-500 focus:outline-none focus:border-defendrRed"
            />
            {errors.dateOfBirth && (
              <span className="text-xs text-red-500">{String(errors.dateOfBirth.message)}</span>
            )}
          </div>
        )}

        {joinProcess.requiredCountry && (
          <div className="flex flex-col gap-1">
            <label htmlFor="country" className="text-sm font-medium text-white">
              Country <span className="text-red-500">*</span>
            </label>
            <input
              id="country"
              type="text"
              placeholder="United States"
              {...register('country')}
              className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder:text-gray-500 focus:outline-none focus:border-defendrRed"
            />
            {errors.country && (
              <span className="text-xs text-red-500">{String(errors.country.message)}</span>
            )}
          </div>
        )}

        {joinProcess.requiredFacebookLink && (
          <div className="flex flex-col gap-1">
            <label htmlFor="facebookLink" className="text-sm font-medium text-white">
              Facebook Profile <span className="text-red-500">*</span>
            </label>
            <input
              id="facebookLink"
              type="url"
              placeholder="https://facebook.com/username"
              {...register('facebookLink')}
              className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder:text-gray-500 focus:outline-none focus:border-defendrRed"
            />
            {errors.facebookLink && (
              <span className="text-xs text-red-500">{String(errors.facebookLink.message)}</span>
            )}
          </div>
        )}

        {joinProcess.requiredInstagramLink && (
          <div className="flex flex-col gap-1">
            <label htmlFor="instagramLink" className="text-sm font-medium text-white">
              Instagram Profile <span className="text-red-500">*</span>
            </label>
            <input
              id="instagramLink"
              type="url"
              placeholder="https://instagram.com/username"
              {...register('instagramLink')}
              className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder:text-gray-500 focus:outline-none focus:border-defendrRed"
            />
            {errors.instagramLink && (
              <span className="text-xs text-red-500">{String(errors.instagramLink.message)}</span>
            )}
          </div>
        )}

        {/* Custom Game Identifier Fields */}
        {hasRequiredAccount('MobileLegends') && (
          <>
            <div className="flex flex-col gap-1">
              <label htmlFor="mobileLegends_gameId" className="text-sm font-medium text-white">
                Mobile Legends Game ID <span className="text-red-500">*</span>
              </label>
              <input
                id="mobileLegends_gameId"
                type="text"
                placeholder="Enter your Game ID"
                {...register('mobileLegends_gameId')}
                className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder:text-gray-500 focus:outline-none focus:border-defendrRed"
              />
              {errors.mobileLegends_gameId && (
                <span className="text-xs text-red-500">
                  {String(errors.mobileLegends_gameId.message)}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="mobileLegends_zoneId" className="text-sm font-medium text-white">
                Mobile Legends Zone ID <span className="text-red-500">*</span>
              </label>
              <input
                id="mobileLegends_zoneId"
                type="text"
                placeholder="Enter your Zone ID"
                {...register('mobileLegends_zoneId')}
                className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder:text-gray-500 focus:outline-none focus:border-defendrRed"
              />
              {errors.mobileLegends_zoneId && (
                <span className="text-xs text-red-500">
                  {String(errors.mobileLegends_zoneId.message)}
                </span>
              )}
            </div>
          </>
        )}

        {hasRequiredAccount('Battle-Net') && (
          <div className="flex flex-col gap-1">
            <label htmlFor="battlenet_battletag" className="text-sm font-medium text-white">
              Battle.net Battletag <span className="text-red-500">*</span>
            </label>
            <input
              id="battlenet_battletag"
              type="text"
              placeholder="PlayerName#1234"
              {...register('battlenet_battletag')}
              className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder:text-gray-500 focus:outline-none focus:border-defendrRed"
            />
            {errors.battlenet_battletag && (
              <span className="text-xs text-red-500">
                {String(errors.battlenet_battletag.message)}
              </span>
            )}
          </div>
        )}

        {hasRequiredAccount('PSN') && (
          <div className="flex flex-col gap-1">
            <label htmlFor="psn_username" className="text-sm font-medium text-white">
              PSN Username <span className="text-red-500">*</span>
            </label>
            <input
              id="psn_username"
              type="text"
              placeholder="YourPSNName"
              {...register('psn_username')}
              className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder:text-gray-500 focus:outline-none focus:border-defendrRed"
            />
            {errors.psn_username && (
              <span className="text-xs text-red-500">{String(errors.psn_username.message)}</span>
            )}
          </div>
        )}

        {hasRequiredAccount('XBOX') && (
          <div className="flex flex-col gap-1">
            <label htmlFor="xbox_gamertag" className="text-sm font-medium text-white">
              Xbox Gamertag <span className="text-red-500">*</span>
            </label>
            <input
              id="xbox_gamertag"
              type="text"
              placeholder="YourGamertag"
              {...register('xbox_gamertag')}
              className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder:text-gray-500 focus:outline-none focus:border-defendrRed"
            />
            {errors.xbox_gamertag && (
              <span className="text-xs text-red-500">{String(errors.xbox_gamertag.message)}</span>
            )}
          </div>
        )}

        {hasRequiredAccount('Origin') && (
          <div className="flex flex-col gap-1">
            <label htmlFor="origin_username" className="text-sm font-medium text-white">
              Origin Username <span className="text-red-500">*</span>
            </label>
            <input
              id="origin_username"
              type="text"
              placeholder="YourOriginName"
              {...register('origin_username')}
              className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder:text-gray-500 focus:outline-none focus:border-defendrRed"
            />
            {errors.origin_username && (
              <span className="text-xs text-red-500">{String(errors.origin_username.message)}</span>
            )}
          </div>
        )}

        {hasRequiredAccount('konami') && (
          <div className="flex flex-col gap-1">
            <label htmlFor="efootball_username" className="text-sm font-medium text-white">
              eFootball Username <span className="text-red-500">*</span>
            </label>
            <input
              id="efootball_username"
              type="text"
              placeholder="YoureFballName"
              {...register('efootball_username')}
              className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder:text-gray-500 focus:outline-none focus:border-defendrRed"
            />
            {errors.efootball_username && (
              <span className="text-xs text-red-500">
                {String(errors.efootball_username.message)}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default RequirementFields
