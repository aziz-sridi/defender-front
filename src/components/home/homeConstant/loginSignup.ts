import AppelIcon from '@/components/ui/Icons/auth/AppelIcon'
import BattleNetIcon from '@/components/ui/Icons/auth/BattleNetIcon'
import DiscordIcon from '@/components/ui/Icons/auth/DiscordIcon'
import FacebookIcon from '@/components/ui/Icons/auth/FacebookIcon'
import GoogleIcon from '@/components/ui/Icons/auth/GoogleIcon'
import TwitchIcon from '@/components/ui/Icons/auth/TwitchIcon'

import { JSX } from 'react'

type HexColor = `#${string}`
type RgbColor = `rgb(${number}, ${number}, ${number})`
type RgbaColor = `rgba(${number}, ${number}, ${number}, ${number})`

type CssColor = HexColor | RgbColor | RgbaColor

type Px = `${number}px`

export interface SignUpLoginElement {
  readonly logo: (props: React.SVGProps<SVGSVGElement>) => JSX.Element
  readonly name: string
  readonly backgroundColor: CssColor
  readonly provider: string
  readonly height: Px
  readonly text: string
  readonly textColor: CssColor
}

export const signUpDefendr: SignUpLoginElement[] = [
  {
    logo: GoogleIcon,
    name: 'Google',
    backgroundColor: '#FFFFFF',
    provider: 'google',
    height: '25px',
    text: 'Sign Up With Google',
    textColor: '#161617',
  },

  {
    logo: DiscordIcon,
    name: 'Discord',
    backgroundColor: '#5865F2',
    provider: 'discord',
    height: '25px',
    text: 'Sign Up With Discord',
    textColor: '#00000',
  },
  // {
  //   logo: FacebookIcon,
  //   name: 'FaceBook',
  //   color: '#1877F2',
  //   provider: 'facebook',
  //   height: '25px',
  // },
  // {
  //   logo: TwitchIcon,
  //   name: 'Twitch',
  //   color: '#6441A5',
  //   provider: 'twitch',
  //   height: '25px',
  // },
  // {
  //   logo: BattleNetIcon,
  //   name: 'Battle.net',
  //   color: '#0089FC',
  //   provider: 'battlenet',
  //   height: '25px',
  // },
]

export const loginDefendr: SignUpLoginElement[] = [
  {
    logo: GoogleIcon,
    name: 'Google',
    backgroundColor: '#FFFFFF',
    provider: 'google',
    height: '25px',
    text: 'Sign In With Google',
    textColor: '#161617',
  },

  {
    logo: DiscordIcon,
    name: 'Discord',
    backgroundColor: '#5865F2',
    provider: 'discord',
    height: '25px',
    text: 'Sign In With Discord',
    textColor: '#00000',
  },

  // {
  //   logo: BattleNetIcon,
  //   name: 'Battle.net',
  //   color: '#0073DE',
  //   provider: 'google',
  // },
  // {
  //   logo: DiscordIcon,
  //   name: 'Discord',
  //   color: '#7289DA',
  //   provider: 'discord',
  // },
  // {
  //   logo: TwitchIcon,
  //   name: 'Twitch',
  //   color: '#6441A5',
  //   provider: 'twitch',
  // },
  // {
  //   logo: FacebookIcon,
  //   name: 'FaceBook',
  //   color: '#3B5998',
  //   provider: 'facebook',
  // },
  // {
  //   logo: GoogleIcon,
  //   name: 'Google',
  //   color: '#D73D32',
  //   provider: 'google',
  // },
  // {
  //   logo: BattleNetIcon,
  //   name: 'Battle.net',
  //   color: '#0073DE',
  //   provider: 'battlenet',
  // },
]
