import { ReactElement } from 'react'

import SocialIcon from '@/components/team/helpers/social-icons'

type SocialType = 'url' | 'email' | 'phone'

interface SocialEntry {
  key: string
  label: string
  placeholder: string
  type: SocialType
  svg: ReactElement
  getValue: (team: any) => string
}

const SOCIALS: SocialEntry[] = [
  {
    key: 'twitter',
    label: 'X.com',
    placeholder: 'yourhandle',
    type: 'url',
    svg: <SocialIcon type="twitter" />,
    getValue: (team: any) => team.twitter ?? '',
  },
  {
    key: 'instagram',
    label: 'instagram.com',
    placeholder: 'yourhandle',
    type: 'url',
    svg: <SocialIcon type="instagram" />,
    getValue: (team: any) => team.instagram ?? '',
  },
  {
    key: 'facebook',
    label: 'facebook.com',
    placeholder: 'yourhandle',
    type: 'url',
    svg: <SocialIcon type="facebook" />,
    getValue: (team: any) => team.facebook ?? '',
  },
  {
    key: 'email',
    label: 'email',
    placeholder: 'youremail',
    type: 'email',
    svg: <SocialIcon type="email" />,
    getValue: (team: any) => team.email ?? '',
  },
  {
    key: 'phone',
    label: 'phone',
    placeholder: 'yourphone',
    type: 'phone',
    svg: <SocialIcon type="phone" />,
    getValue: (team: any) => team.phone ?? '',
  },
  {
    key: 'website',
    label: 'website',
    placeholder: 'yourwebsite',
    type: 'url',
    svg: <SocialIcon type="website" />,
    getValue: (team: any) => team.website ?? '',
  },
  {
    key: 'discord',
    label: 'discord',
    placeholder: 'yourserver',
    type: 'url',
    svg: <SocialIcon type="discord" />,
    getValue: (team: any) => team.discord ?? '',
  },
]

export default SOCIALS
