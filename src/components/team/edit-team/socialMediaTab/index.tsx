'use client'
import { useState } from 'react'
import { toast } from 'sonner'

import SOCIALS from '@/components/team/edit-team/socialConfig'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Inputs'
import Typo from '@/components/ui/Typo'
import { updateTeam } from '@/services/teamService'

interface BrandingSectionProps {
  team: any
}

function validateInput(value: string, type: 'url' | 'email' | 'phone'): boolean {
  if (!value) {
    return true
  }
  switch (type) {
    case 'url':
      try {
        new URL(value)
        return true
      } catch {
        return false
      }
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    case 'phone':
      return /^\+?[0-9\s\-()]{7,}$/.test(value)
    default:
      return true
  }
}

export default function SocialMedia({ team }: BrandingSectionProps) {
  console.log('team', team)
  const [socials, setSocials] = useState(() => {
    const initial: Record<string, string> = {}
    SOCIALS.forEach(s => {
      const val = s.getValue(team)
      initial[s.key] = val ?? ''
    })
    return initial
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const onCancelChanges = () => {
    console.log('Cancel changes clicked')
  }

  const onSaveChanges = async () => {
    for (const social of SOCIALS) {
      const key = social.key
      const value = socials[key]
      const type = social.type ?? 'url'

      if (!validateInput(value, type)) {
        toast.warning(`Please enter a valid ${type.toUpperCase()} for ${social.label}`)
        return
      }
    }

    const formData = new FormData()
    Object.entries(socials).forEach(([key, value]) => {
      formData.append(key, value)
    })
    console.log('Submitting social media data:', Object.fromEntries(formData.entries()))

    try {
      const response = await updateTeam(team._id, formData)
      console.log('Social media updated successfully:', response)
      toast.success('Social media updated successfully!')
    } catch (error) {
      console.error('Error updating social media:', error)
      toast.error('Failed to update social media. Please try again.')
    }
  }

  return (
    <div className="bg-[#212529] rounded-xl mx-auto p-7 sm:p-10 flex flex-col max-w-7xl">
      <div className="sm:flex gap-4 absolute right-10 top-36">
        <Button
          className="font-poppins hidden w-auto pb-10 sm:block"
          label="cancel"
          variant="contained-black"
          onClick={onCancelChanges}
        />
        <Button
          className="font-poppins w-auto hidden pb-10 sm:block"
          disabled={Object.keys(errors).length > 0}
          label="save changes"
          variant="contained-red"
          onClick={onSaveChanges}
        />
      </div>
      <div className="flex mb-4 flex-col">
        <Typo
          as="h1"
          className="text-sm sm:text-sm md:text-lg xl:text-xl"
          color="white"
          fontFamily="poppins"
          fontVariant="h3"
          fontWeight="regular"
        >
          Social Media Profiles
        </Typo>
        <Typo className="text-gray-500 text-sm md:text-[17px] mt-2 md:mt-1" fontFamily="poppins">
          Connect your team's media accounts
        </Typo>
      </div>
      <div className="flex flex-col gap-2">
        {SOCIALS.map(social => {
          const type = social.type ?? 'url'
          return (
            <div key={social.key} className="flex flex-col gap-1">
              {social.svg}
              <div className="flex rounded-2xl border border-white/20 overflow-hidden bg-[#1f1f1f] md:w-full min-w-xl max-w-5xl">
                <div className=" w-32 sm:w-44 bg-[#2a2a2a] px-4 py-2 border-r border-white/20">
                  <Typo className=" md:text-sm text-xs w-full" color="white">
                    {social.label}
                  </Typo>
                </div>
                <Input
                  className="flex-1 px-4 py-2 bg-transparent text-white placeholder-white/40 focus:outline-none border-none focus:border-none"
                  placeholder={social.placeholder}
                  type={type === 'email' ? 'email' : 'url'}
                  value={socials[social.key]}
                  onChange={e => {
                    const value = e.target.value
                    setSocials(prev => ({ ...prev, [social.key]: value }))

                    setErrors(prev => {
                      if (!value || validateInput(value, type)) {
                        const { [social.key]: removed, ...rest } = prev
                        return rest
                      } else {
                        return { ...prev, [social.key]: `Invalid ${type}` }
                      }
                    })
                  }}
                />
              </div>
              {errors[social.key] && (
                <Typo className="text-red-500 text-xs mt-1">{errors[social.key]}</Typo>
              )}
            </div>
          )
        })}
        <div className="flex gap-4 mt-10 justify-center items-center sm:hidden pb-10">
          <Button
            className="font-poppins w-auto"
            label="cancel"
            variant="contained-dark"
            onClick={onCancelChanges}
          />
          <Button
            className="font-poppins w-auto"
            label="save changes"
            variant="contained-red"
            onClick={onSaveChanges}
          />
        </div>
      </div>
    </div>
  )
}
