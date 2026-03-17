import { ReactElement } from 'react'

import { TwitterWB } from '@/components/ui/Icons/TwitterWB'
import { InstagramWB } from '@/components/ui/Icons/InstagramWB'
import { FacebookWB } from '@/components/ui/Icons/FacebookWB'
import { DiscordWB } from '@/components/ui/Icons/DiscordWB'
import { TwitchWB } from '@/components/ui/Icons/TwitchWB'
import { YoutubeWB } from '@/components/ui/Icons/YoutubeWB'
import { Organization } from '@/types/organizationType'
type SocialType = 'url'

interface SocialEntry {
  key: string
  label: string
  placeholder: string
  type: SocialType
  icon: ReactElement
  getValue: (organization: Organization) => string
}

const SOCIALS: SocialEntry[] = [
  {
    key: 'twitter',
    label: 'X.com/',
    placeholder: 'X link',
    type: 'url',
    icon: <TwitterWB />,
    getValue: (organization: Organization) => organization?.socialMediaLinks?.twitter ?? '',
  },
  {
    key: 'instagram',
    label: 'instagram.com/',
    placeholder: 'instagram link',
    type: 'url',
    icon: <InstagramWB />,
    getValue: (organization: Organization) => organization?.socialMediaLinks?.instagram ?? '',
  },
  {
    key: 'facebook',
    label: 'facebook.com/',
    placeholder: 'facebook link',
    type: 'url',
    icon: <FacebookWB />,
    getValue: (organization: Organization) => organization?.socialMediaLinks?.facebook ?? '',
  },
  {
    key: 'discord',
    label: 'discord',
    placeholder: 'yourserver',
    type: 'url',
    icon: <DiscordWB />,
    getValue: (organization: Organization) => organization?.socialMediaLinks?.discord ?? '',
  },
  {
    key: 'twitch',
    label: 'twitch.tv/',
    placeholder: 'twitch link',
    type: 'url',
    icon: <TwitchWB />,
    getValue: (organization: Organization) => organization?.socialMediaLinks?.twitch ?? '',
  },
  {
    key: 'youtube',
    label: 'youtube.com/',
    placeholder: 'youtube link',
    type: 'url',
    icon: <YoutubeWB />,
    getValue: (organization: Organization) => organization?.socialMediaLinks?.youtube ?? '',
  },
]

export default SOCIALS
