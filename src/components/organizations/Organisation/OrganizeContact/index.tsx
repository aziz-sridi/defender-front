'use client'

import { useContext, useState } from 'react'
import { toast } from 'sonner'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { OrganizationContext } from '@/components/context/OrganizationContext'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Inputs'
import Typo from '@/components/ui/Typo'
import { DiscordWB } from '@/components/ui/Icons/DiscordWB'
import { FacebookWB } from '@/components/ui/Icons/FacebookWB'
import { YoutubeWB } from '@/components/ui/Icons/YoutubeWB'
import { InstagramWB } from '@/components/ui/Icons/InstgramWB'
import { GmailWB } from '@/components/ui/Icons/GmailWB'
import { TwitchWB } from '@/components/ui/Icons/TwitchWB'
import { TwitterWB } from '@/components/ui/Icons/TwitterWB'

type ContactFieldId =
  | 'discord'
  | 'facebook'
  | 'youtube'
  | 'instagram'
  | 'twitch'
  | 'twitter'
  | 'email'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ContactFields: {
  label: string
  placeholder: string
  icon: React.ComponentType<any>
  id: ContactFieldId
  type: string
  required: boolean
}[] = [
  {
    label: 'Discord',
    placeholder: 'https://discord.gg/yourserver',
    icon: DiscordWB,
    id: 'discord',
    type: 'url',
    required: true,
  },
  {
    label: 'Facebook',
    placeholder: 'https://facebook.com/yourpage',
    icon: FacebookWB,
    id: 'facebook',
    type: 'url',
    required: false,
  },
  {
    label: 'YouTube',
    placeholder: 'https://youtube.com/yourchannel',
    icon: YoutubeWB,
    id: 'youtube',
    type: 'url',
    required: false,
  },
  {
    label: 'Instagram',
    placeholder: 'https://instagram.com/yourhandle',
    icon: InstagramWB,
    id: 'instagram',
    type: 'url',
    required: false,
  },
  {
    label: 'Twitch',
    placeholder: 'https://twitch.tv/yourchannel',
    icon: TwitchWB,
    id: 'twitch',
    type: 'url',
    required: false,
  },
  {
    label: 'X / Twitter',
    placeholder: 'https://x.com/yourhandle',
    icon: TwitterWB,
    id: 'twitter',
    type: 'url',
    required: false,
  },
  {
    label: 'Email',
    placeholder: 'contact@yourorg.com',
    icon: GmailWB,
    id: 'email',
    type: 'email',
    required: false,
  },
]

type Fields = Record<ContactFieldId, string>
type Errors = Partial<Record<ContactFieldId, string>>

interface OrganizeContactProps {
  onNext?: () => void
  onBack?: () => void
}

const OrganizeContact = ({ onNext, onBack }: OrganizeContactProps) => {
  const { organizationData, setOrganizationData } = useContext(OrganizationContext)
  const [fields, setFields] = useState<Fields>({
    discord: organizationData.discord || '',
    facebook: organizationData.facebook || '',
    youtube: organizationData.youtube || '',
    instagram: organizationData.instagram || '',
    twitch: organizationData.twitch || '',
    twitter: organizationData.twitter || '',
    email: organizationData.mail || '',
  })
  const [errors, setErrors] = useState<Errors>({})

  const validate = () => {
    const newErrors: Errors = {}
    if (!fields.discord) {
      newErrors.discord = 'Discord invite link is required'
    } else if (!/^https?:\/\//.test(fields.discord)) {
      newErrors.discord = 'Must be a valid URL starting with https://'
    }
    if (fields.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(fields.email)) {
      newErrors.email = 'Invalid email address'
    }
    ;(['facebook', 'youtube', 'instagram', 'twitch', 'twitter'] as ContactFieldId[]).forEach(
      key => {
        if (fields[key] && !/^https?:\/\//.test(fields[key])) {
          newErrors[key] = 'Must start with https://'
        }
      },
    )
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validate()) {
      toast.error('Please fix the errors in the form.')
      return
    }

    const socialMediaLinks = {
      facebook: fields.facebook || undefined,
      twitter: fields.twitter || undefined,
      instagram: fields.instagram || undefined,
      discord: fields.discord || undefined,
      youtube: fields.youtube || undefined,
      twitch: fields.twitch || undefined,
      email: fields.email || undefined,
    }
    const socialLinks = {
      discord: fields.discord || undefined,
      instagram: fields.instagram || undefined,
      twitch: fields.twitch || undefined,
      twitter: fields.twitter || undefined,
    }
    const connectedSocials = {
      discord: Boolean(fields.discord),
      instagram: Boolean(fields.instagram),
      twitch: Boolean(fields.twitch),
      twitter: Boolean(fields.twitter),
    }

    setOrganizationData(prev => ({
      ...prev,
      discord: fields.discord,
      facebook: fields.facebook,
      youtube: fields.youtube,
      instagram: fields.instagram,
      twitch: fields.twitch,
      twitter: fields.twitter,
      mail: fields.email,
      socialMediaLinks,
      socialLinks,
      connectedSocials,
    }))
    toast.success('Contact information saved!')
    if (typeof onNext === 'function') onNext()
  }

  return (
    <form className="w-full p-4 sm:p-6 md:p-8 font-poppins" onSubmit={onSubmit}>
      <div className="space-y-6">
        {/* Section header */}
        <div>
          <Typo as="h2" className="text-lg font-bold text-white mb-1" fontFamily="poppins">
            Social Links & Contact
          </Typo>
          <Typo as="p" className="text-gray-500 text-sm" fontFamily="poppins">
            Help players find and connect with your organisation
          </Typo>
        </div>

        {/* Fields */}
        {ContactFields.map(item => {
          const Icon = item.icon
          const hasError = errors[item.id]
          return (
            <div key={item.id}>
              <Typo
                as="label"
                className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1.5 block"
                fontFamily="poppins"
              >
                {item.label}
                {item.required && <span className="text-defendrRed ml-1">*</span>}
              </Typo>
              <Input
                icon={<Icon width={18} height={18} />}
                iconOrientation="left"
                value={fields[item.id]}
                onChange={value => setFields(f => ({ ...f, [item.id]: value }))}
                placeholder={item.placeholder}
                type={item.type}
                size="m"
                backgroundColor="#1c1c20"
                borderColor={hasError ? '#ef4444' : 'rgba(255,255,255,0.08)'}
              />
              {hasError && (
                <Typo as="p" className="text-red-400 text-xs mt-1" fontFamily="poppins">
                  {hasError}
                </Typo>
              )}
            </div>
          )
        })}
      </div>

      {/* Navigation */}
      <div
        className={`flex mt-8 pt-6 border-t border-white/[0.06] ${onBack ? 'justify-between' : 'justify-end'}`}
      >
        {onBack && (
          <Button
            type="button"
            label="Back"
            variant="outlined-grey"
            icon={<ChevronLeft size={15} />}
            iconOrientation="left"
            className="w-auto px-5"
            size="auto"
            onClick={onBack}
          />
        )}
        <Button
          type="submit"
          label="Continue"
          variant="contained-red"
          icon={<ChevronRight size={15} />}
          iconOrientation="right"
          className="w-auto px-6"
          size="auto"
        />
      </div>
    </form>
  )
}

export default OrganizeContact
