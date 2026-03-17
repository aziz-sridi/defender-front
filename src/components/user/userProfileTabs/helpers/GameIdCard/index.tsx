'use client'
import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { toast } from 'sonner'

import Button from '@/components/ui/Button'
import Typo from '@/components/ui/Typo'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

export default function GameIdCard({ account }: { account: any }) {
  const [copied, setCopied] = useState(false)

  const accountConfigs = {
    battlenet: {
      id: 'battlenet',
      name: 'Battle.net',
      displayName: 'Battle.net ID',
      image: '/battlenet.webp',
      getAccountId: (acc: any) => acc.battletag || acc.battleTag,
      bgColor: 'bg-gradient-to-r from-[#1a2744] to-[#1e3a5f]',
    },
    xbox: {
      id: 'xbox',
      name: 'Xbox',
      displayName: 'Xbox Gamertag',
      image: '/xbox.webp',
      getAccountId: (acc: any) => acc.gamerTag || acc.gamertag,
      bgColor: 'bg-gradient-to-r from-[#1a2e1a] to-[#1e3d1e]',
    },
    psn: {
      id: 'psn',
      name: 'PlayStation',
      displayName: 'PlayStation ID',
      image: '/psn.webp',
      getAccountId: (acc: any) => acc.psnId || acc.username,
      bgColor: 'bg-gradient-to-r from-[#1a2040] to-[#1e2d55]',
    },
    riot: {
      id: 'riot',
      name: 'Riot Games',
      displayName: 'Riot ID',
      image: '/riotGames.webp',
      getAccountId: (acc: any) => {
        const riotid = acc.riotid || acc.riotId
        const tagline = acc.tagline || acc.tagLine
        if (riotid && tagline) return `${riotid}#${tagline}`
        if (riotid) return riotid
        return 'Not linked'
      },
      bgColor: 'bg-gradient-to-r from-[#3a1520] to-[#4a1a28]',
    },
    discord: {
      id: 'discord',
      name: 'Discord',
      displayName: 'Discord',
      image: '/discord.avif',
      getAccountId: (acc: any) => acc.username || acc.displayName,
      bgColor: 'bg-gradient-to-r from-[#2a2d5a] to-[#343870]',
    },
    mobileLegends: {
      id: 'mobileLegends',
      name: 'Mobile Legends',
      displayName: 'Mobile Legends',
      image: '/mobileLegend.png',
      getAccountId: (acc: any) => {
        const gid =
          acc.game_id || acc.igame_id || acc.mobileLegends?.game_id || acc.mobileLegends?.igame_id
        const zid = acc.zone_id || acc.mobileLegends?.zone_id
        if (!gid && !zid) return 'Not linked'
        if (gid && zid) return `${gid} (${zid})`
        return gid ? `${gid}` : `(${zid})`
      },
      bgColor: 'bg-gradient-to-r from-[#0a1a3a] to-[#0d2550]',
    },
  }

  const getAccountInfo = () => {
    if (!account) {
      return null
    }

    // If OverviewTab passed normalized objects { type, data }
    const provider = account.type as string | undefined
    const accData = account.data || account

    if (provider === 'origin' || accData.origin || accData.username) {
      return {
        config: {
          id: 'origin',
          name: 'EA/Origin',
          displayName: 'EA/Origin Account',
          image: '/origin.webp',
          getAccountId: (acc: any) => acc.username || acc.origin?.username,
          bgColor: 'bg-gradient-to-r from-[#3a1520] to-[#4a1a28]',
        },
        data: accData.origin || accData,
        type: 'origin',
      }
    }

    if (provider === 'battlenet' || accData.battleNet || accData.battletag || accData.battleTag) {
      return {
        config: accountConfigs.battlenet,
        data: accData.battleNet || accData,
        type: 'battlenet',
      }
    }

    if (
      provider === 'xbox' ||
      accData.xbox ||
      accData.gamerTag ||
      accData.gamertag ||
      accData.xuid
    ) {
      return {
        config: accountConfigs.xbox,
        data: accData.xbox || accData,
        type: 'xbox',
      }
    }

    if (provider === 'psn' || accData.psn || accData.psnId) {
      return {
        config: accountConfigs.psn,
        data: accData.psn || accData,
        type: 'psn',
      }
    }

    if (
      provider === 'riot' ||
      provider === 'Riotgames' ||
      accData.riot ||
      accData.riotId ||
      accData.Riotgames ||
      accData.riotgames ||
      accData.riotGames
    ) {
      return {
        config: accountConfigs.riot,
        data:
          accData.riot || accData.Riotgames || accData.riotgames || accData.riotGames || accData,
        type: 'riot',
      }
    }

    if (provider === 'discord' || accData.discord) {
      return {
        config: accountConfigs.discord,
        data: accData.discord || accData,
        type: 'discord',
      }
    }

    if (
      provider === 'mobilelegends' ||
      provider === 'mobileLegends' ||
      accData.mobileLegends ||
      accData.game_id ||
      accData.igame_id
    ) {
      return {
        config: accountConfigs.mobileLegends,
        data: accData.mobileLegends || accData,
        type: 'mobileLegends',
      }
    }

    return {
      config: accountConfigs.xbox,
      data: accData,
      type: 'unknown',
    }
  }

  const accountInfo = getAccountInfo()
  if (!accountInfo) {
    return null
  }

  const { config, data } = accountInfo
  const accountId = config.getAccountId(data) || 'Unknown'

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(accountId)
      setCopied(true)
      toast.success('copied to clipboard')
      setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div
      className={`flex items-center gap-3 ${config.bgColor} rounded-xl px-4 py-3 w-full shadow-md border border-white/10`}
    >
      <div className="relative shrink-0">
        <Avatar className="w-10 h-10 border-2 border-white/20">
          <AvatarImage
            alt={`${config.name} Logo`}
            className="object-cover"
            src={data.avatar || config.image}
          />
          <AvatarFallback className="bg-white/10 text-white font-bold text-sm">
            {config.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-white rounded-full flex items-center justify-center">
          <Avatar className="w-3.5 h-3.5">
            <AvatarImage alt={config.name} src={config.image} />
            <AvatarFallback className="text-[8px] bg-primary text-primary-foreground">
              {config.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <Typo
          as="span"
          className="text-white/70 text-xs font-medium"
          fontFamily="poppins"
          fontVariant="p5"
        >
          {config.displayName}
        </Typo>
        <Typo
          as="span"
          className="text-white font-bold text-sm truncate"
          fontFamily="poppins"
          fontVariant="p3"
        >
          {accountId}
        </Typo>
        {data.gamerScore && (
          <Typo
            as="span"
            className="text-white/50 text-[10px]"
            fontFamily="poppins"
            fontVariant="p5"
          >
            Gamerscore: {data.gamerScore.toLocaleString()}
          </Typo>
        )}
      </div>
      <button
        className="shrink-0 bg-white/10 hover:bg-white/20 text-white rounded-full p-1.5 border border-white/20 transition-colors"
        onClick={handleCopy}
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-green-400" />
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  )
}
