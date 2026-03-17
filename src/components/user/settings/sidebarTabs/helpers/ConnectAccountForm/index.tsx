'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'

import Button from '@/components/ui/Button'
import Typo from '@/components/ui/Typo'
import { fetchPsnProfile } from '@/services/psnService'
import { getXboxProfileByGamertag, linkXboxAccount } from '@/services/xboxService'
import { updateProfile, getUserById } from '@/services/userService'
import { linkMobileLegendsAccount } from '@/services/MobileLegendService'
import { linkOriginAccount } from '@/services/originService'
import { linkRiotGamesAccount } from '@/services/riotGamesService'
import { hasDiscord } from '@/lib/tournament/requirements'

interface ConnectAccountFormProps {
  name: string
}

const ConnectAccountForm = ({ name }: ConnectAccountFormProps) => {
  const router = useRouter()
  const { data: session, update } = useSession()
  // For Discord, default to session value if present
  const [nickname, setNickname] = useState(() => {
    if (name.toLowerCase() === 'discord' && session?.user?.socialMediaLinks?.discord) {
      return session.user.socialMediaLinks.discord
    }
    return ''
  })
  const [confirmNickname, setConfirmNickname] = useState(() => {
    if (name.toLowerCase() === 'discord' && session?.user?.socialMediaLinks?.discord) {
      return session.user.socialMediaLinks.discord
    }
    return ''
  })
  // For Riot Games (League of Legends) - default from session if present
  const isRiotType = ['riotgames', 'riot'].includes(name.toLowerCase().replace(/\s+/g, ''))
  const [riotId, setRiotId] = useState(() => {
    if (
      (name.toLowerCase().replace(/\s+/g, '') === 'riotgames' ||
        name.toLowerCase().replace(/\s+/g, '') === 'riot') &&
      session?.user?.connectedAcc?.Riotgames?.riotid
    ) {
      return session.user.connectedAcc.Riotgames.riotid
    }
    return ''
  })

  const [tagLine, setTagLine] = useState(() => {
    if (
      (name.toLowerCase().replace(/\s+/g, '') === 'riotgames' ||
        name.toLowerCase().replace(/\s+/g, '') === 'riot') &&
      session?.user?.connectedAcc?.Riotgames?.tagline
    ) {
      return session.user.connectedAcc.Riotgames.tagline
    }
    return ''
  })

  // For Mobile Legends (default from session if present)
  const [gameId, setGameId] = useState(() => {
    if (
      name.toLowerCase().replace(/\s+/g, '') === 'mobilelegends' &&
      session?.user?.connectedAcc?.mobileLegends?.game_id
    ) {
      return session.user.connectedAcc.mobileLegends.game_id
    }
    return ''
  })
  const [zoneId, setZoneId] = useState(() => {
    if (
      name.toLowerCase().replace(/\s+/g, '') === 'mobilelegends' &&
      session?.user?.connectedAcc?.mobileLegends?.zone_id
    ) {
      return session.user.connectedAcc.mobileLegends.zone_id
    }
    return ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isDiscordAlreadyConnected, setIsDiscordAlreadyConnected] = useState(false)

  const urlParams = useParams()
  const userId = urlParams.id as string

  // Check if Discord is already connected
  useEffect(() => {
    const checkDiscordConnection = async () => {
      if (name.toLowerCase() === 'discord' && userId) {
        try {
          const userData = await getUserById(userId)
          setUser(userData)
          const discordConnected = Boolean(userData.socialMediaLinks?.discord?.trim())
          setIsDiscordAlreadyConnected(discordConnected)

          if (discordConnected) {
            toast.info('Discord username is already set for your account')
            // Redirect back to game accounts page after a short delay
            setTimeout(() => {
              router.push(`/user/${userId}/settings/Game-accounts`)
            }, 2000)
          }
        } catch (error) {
          console.error('Error checking Discord connection:', error)
        }
      }
    }

    checkDiscordConnection()
  }, [name, userId, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Mobile Legends validation
    if (name.toLowerCase().replace(/\s+/g, '') === 'mobilelegends') {
      if (!gameId.trim() || !zoneId.trim()) {
        toast.warning('Please enter both Game ID and Zone ID')
        return
      }
    } else if (
      name.toLowerCase().replace(/\s+/g, '') === 'riotgames' ||
      name.toLowerCase().replace(/\s+/g, '') === 'riot'
    ) {
      // Riot Games validation
      if (!riotId.trim() || !tagLine.trim()) {
        toast.warning('Please enter both RIOT ID and Tagline')
        return
      }

      // Check if Riot ID and Tagline are identical
      if (riotId.trim() === tagLine.trim()) {
        toast.warning('Riot ID and Tagline cannot be identical. Please enter different values.')
        return
      }

      // Debug logging
      console.log('🔍 Riot ID:', riotId)
      console.log('🔍 Tagline:', tagLine)
      console.log('🔍 Are they identical?', riotId.trim() === tagLine.trim())
    } else {
      if (!nickname.trim()) {
        toast.warning('Please enter your nickname')
        return
      }
      if (nickname !== confirmNickname) {
        toast.warning('Nicknames do not match')
        return
      }
    }

    setIsLoading(true)

    try {
      switch (name.toLowerCase()) {
        case 'battlenet':
          router.replace(`${process.env.NEXT_PUBLIC_API}/BattleNet/oauth?test=true`)
          break

        case 'steam':
          router.replace(`${process.env.NEXT_PUBLIC_API}/Steam/auth`)
          break

        case 'epicgames':
          router.replace(`${process.env.NEXT_PUBLIC_API}/EpicGames/oauth`)
          break

        case 'psn': {
          const psnResponse = await fetchPsnProfile(nickname)
          toast.success('PSN profile added successfully')
          router.push(`/user/${userId}/settings/Game-accounts`)
          break
        }

        case 'xbox': {
          const xboxResponse = await getXboxProfileByGamertag(nickname)
          const linkResponse = await linkXboxAccount(xboxResponse.data.people[0].xuid)
          toast.success('Xbox account linked successfully')
          router.push(`/user/${userId}/settings/Game-accounts`)
          break
        }
        case 'riot':
        case 'riotgames': {
          // Call RiotGamesService with riotId and tagLine
          await linkRiotGamesAccount({ riotid: riotId, tagline: tagLine })
          // Update the session with the new Riot Games data
          await update({
            user: {
              ...session?.user,
              connectedAcc: {
                ...session?.user?.connectedAcc,
                Riotgames: {
                  riotid: riotId,
                  tagline: tagLine,
                },
              },
            },
          })
          toast.success('League of Legends account linked successfully')
          router.push(`/user/${userId}/settings/Game-accounts`)
          break
        }
        case 'mobilelegends': {
          // Call the MobileLegendService with game_id and zone_id
          await linkMobileLegendsAccount({ game_id: gameId, zone_id: zoneId })
          // Update the session with the new Mobile Legends data
          await update({
            user: {
              ...session?.user,
              connectedAcc: {
                ...session?.user?.connectedAcc,
                mobileLegends: {
                  game_id: gameId,
                  zone_id: zoneId,
                },
              },
            },
          })
          toast.success('Mobile Legends account linked successfully')
          router.push(`/user/${userId}/settings/Game-accounts`)
          break
        }

        case 'origin':
        case 'ea':
        case 'ea/origin': {
          // Expect "nickname" to be EA/Origin username
          if (!nickname.trim()) {
            toast.warning('Please enter your EA/Origin username')
            return
          }
          await linkOriginAccount(nickname.trim())
          // Update session cache
          await update({
            user: {
              ...session?.user,
              connectedAcc: {
                ...session?.user?.connectedAcc,
                origin: {
                  username: nickname.trim(),
                },
              },
            },
          })
          toast.success('EA/Origin account linked successfully')
          router.push(`/user/${userId}/settings/Game-accounts`)
          break
        }

        case 'discord': {
          // Check if Discord is already connected before proceeding
          if (isDiscordAlreadyConnected) {
            toast.warning('Discord is already connected to your account')
            router.push(`/user/${userId}/settings/Game-accounts`)
            return
          }

          // Validate Discord username format
          if (!nickname.trim()) {
            toast.warning('Please enter a valid Discord username')
            return
          }

          // Send as JSON object with Discord at root level (matching tournament modal approach)
          const discordPayload = {
            discord: nickname.trim(),
          }
          try {
            await updateProfile(discordPayload)
          } catch (error) {
            // Log the error but continue with session update
            console.error('Backend profile update failed:', error)
            // Don't rethrow - we want to update the session anyway
          }

          // Always update the session with the new Discord data
          await update({
            user: {
              ...session?.user,
              socialMediaLinks: {
                ...session?.user?.socialMediaLinks,
                discord: nickname,
              },
            },
          })
          toast.success('Discord username updated successfully')
          router.push(`/user/${userId}/settings/Game-accounts`)
          break
        }

        default:
          console.error('Unknown platform')
      }
    } catch (error: unknown) {
      const e = error as { response?: { data?: { message?: string } } }
      toast.error(e.response?.data?.message || 'An error occurred while linking the account')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Show message if Discord is already connected
  if (name.toLowerCase() === 'discord' && isDiscordAlreadyConnected) {
    return (
      <div className="flex flex-col justify-center items-center gap-10">
        <div className="w-full lg:w-2/3 xl:w-[55%] text-center flex-col gap-10">
          <Typo as="p" className="mb-4 text-green-400" fontFamily="poppins" fontVariant="p3">
            ✅ Discord Already Connected
          </Typo>
          <Typo as="p" className="mb-4" color="darkGrey" fontFamily="poppins" fontVariant="p4">
            Your Discord account is already linked to your profile.
          </Typo>
          <Typo as="p" className="mb-4" color="darkGrey" fontFamily="poppins" fontVariant="p5">
            Discord: {user?.socialMediaLinks?.discord || 'Connected'}
          </Typo>
          <Typo as="p" className="mb-4" color="darkGrey" fontFamily="poppins" fontVariant="p5">
            Redirecting you back to Game Accounts...
          </Typo>
        </div>
      </div>
    )
  }

  // Render different form fields for Mobile Legends
  const isMobileLegends = name.toLowerCase().replace(/\s+/g, '') === 'mobilelegends'
  const isRiotTypeField =
    name.toLowerCase().replace(/\s+/g, '') === 'riotgames' ||
    name.toLowerCase().replace(/\s+/g, '') === 'riot'
  return (
    <form className="flex flex-col justify-center items-center gap-10" onSubmit={handleSubmit}>
      <div className="w-full lg:w-2/3 xl:w-[55%] text-start flex-col gap-10">
        <Typo as="p" className="mb-4" color="darkGrey" fontFamily="poppins" fontVariant="p4">
          {isMobileLegends
            ? 'Connect your Mobile Legends account'
            : isRiotTypeField
              ? 'Connect your League of Legends account'
              : `Connect your ${name} account`}
        </Typo>

        {isRiotTypeField && (
          <Typo
            as="p"
            className="mb-4 text-sm"
            color="darkGrey"
            fontFamily="poppins"
            fontVariant="p5"
          >
            <strong>Riot ID:</strong> Your in-game username (e.g., "SummonerName")
            <br />
            <strong>Tagline:</strong> Your region tag (e.g., "#NA1", "#EUW1", "#KR1")
          </Typo>
        )}

        {isMobileLegends ? (
          <>
            <input
              required
              className="rounded-2xl w-full bg-[#302F31] px-4 py-2 font-semibold text-white placeholder:text-white/50"
              placeholder="Game ID"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={gameId}
              onChange={e => {
                // Only allow numbers
                const val = e.target.value.replace(/\D/g, '')
                setGameId(val)
              }}
            />
            <input
              required
              className="rounded-2xl w-full bg-[#302F31] my-4 px-4 py-2 font-semibold text-white placeholder:text-white/50"
              placeholder="Zone ID"
              type="text"
              value={zoneId}
              onChange={e => setZoneId(e.target.value)}
            />
          </>
        ) : isRiotTypeField ? (
          <>
            <input
              required
              className="rounded-2xl w-full bg-[#302F31] px-4 py-2 font-semibold text-white placeholder:text-white/50"
              placeholder="RIOT ID (e.g., SummonerName)"
              type="text"
              value={riotId}
              onChange={e => setRiotId(e.target.value)}
            />
            <input
              required
              className="rounded-2xl w-full bg-[#302F31] my-4 px-4 py-2 font-semibold text-white placeholder:text-white/50"
              placeholder="Tagline (e.g., #NA1, #EUW1)"
              type="text"
              value={tagLine}
              onChange={e => setTagLine(e.target.value)}
            />
          </>
        ) : (
          <>
            <input
              required
              className="rounded-2xl w-full bg-[#302F31] px-4 py-2 font-semibold text-white placeholder:text-white/50"
              placeholder="Nickname"
              type="text"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
            />
            <input
              required
              className="rounded-2xl w-full bg-[#302F31] my-4 px-4 py-2 font-semibold text-white placeholder:text-white/50"
              placeholder="Confirm Nickname"
              type="text"
              value={confirmNickname}
              onChange={e => setConfirmNickname(e.target.value)}
            />
          </>
        )}

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
            className="w-auto font-semibold rounded-xl font-poppins uppercase text-sm mt-4 md:mt-10 defendrButtonHover disabled:opacity-50"
            disabled={isLoading}
            label={isLoading ? 'Connecting...' : `Connect ${name}`}
            type="submit"
            variant="contained-red"
          />
        </div>
      </div>
    </form>
  )
}

export default ConnectAccountForm
