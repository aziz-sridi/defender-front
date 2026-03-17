'use client'
import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'sonner'

import SOCIALS from '@/components/organizations/updateOrganisation/socialConfig'
import Input from '@/components/ui/Inputs'
import Typo from '@/components/ui/Typo'
import { updateOrganizationV2 } from '@/services/organizationService'
import { Organization } from '@/types/organizationType'

function validateUrl(url: string): boolean {
  if (!url) {
    return true
  }
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

let saveFn: (() => void) | null = null
export function socialMediaSave() {
  if (saveFn) {
    saveFn()
  }
}

let cancelFn: (() => void) | null = null
export function socialMediaCancel() {
  if (cancelFn) {
    cancelFn()
  }
}

export default function SocialMedia({ organization }: { organization: Organization }) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<Record<string, string>>({
    defaultValues: SOCIALS.reduce(
      (acc, s) => {
        acc[s.key] = s.getValue(organization) ?? ''
        return acc
      },
      {} as Record<string, string>,
    ),
  })

  const onCancelChanges = () => {
    reset(
      SOCIALS.reduce(
        (acc, s) => {
          acc[s.key] = s.getValue(organization) ?? ''
          return acc
        },
        {} as Record<string, string>,
      ),
    )
  }

  const onSaveChanges = handleSubmit(async values => {
    for (const social of SOCIALS) {
      const value = values[social.key]
      if (!validateUrl(value)) {
        setError(social.key, { type: 'manual', message: `Invalid URL for ${social.label}` })
        return
      } else {
        clearErrors(social.key)
      }
    }
    // Send as JSON object instead of FormData
    const payload = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [key, value ?? '']),
    )
    try {
      await updateOrganizationV2(organization._id, payload)
      toast.success('Social media updated successfully!')
    } catch {
      toast.error('Failed to update social media. Please try again.')
    }
  })

  useEffect(() => {
    saveFn = onSaveChanges
    cancelFn = onCancelChanges
    return () => {
      saveFn = null
      cancelFn = null
    }
  }, [onSaveChanges])

  return (
    <form
      className="bg-[#212529] rounded-xl mx-auto p-5 sm:p-10 flex flex-col max-w-7xl relative"
      onSubmit={onSaveChanges}
    >
      <div className="flex flex-col gap-1 mb-8 mt-6 sm:mt-2">
        <Typo
          as="h1"
          className="text-base sm:text-xl md:text-2xl"
          color="white"
          fontFamily="poppins"
        >
          Social Media Profiles
        </Typo>
        <Typo as="p" className="text-gray-400 text-xs sm:text-base mt-1" fontFamily="poppins">
          Connect your organization's media accounts
        </Typo>
      </div>

      <div className="flex flex-col gap-4 w-full">
        {SOCIALS.map(social => (
          <div
            key={social.key}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 bg-[#23272b] rounded-xl py-1 sm:py-2 px-2 shadow border border-white/10 transition-all duration-200 hover:border-defendrRed"
          >
            <div className="flex items-center gap-2 min-w-[70px] sm:min-w-[90px]">
              <span className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center">
                {social.icon}
              </span>
              <Typo
                as="span"
                className="text-white text-xs sm:text-sm font-poppins whitespace-nowrap"
              >
                {social.label}
              </Typo>
            </div>
            <div className="flex flex-col w-full">
              <Controller
                control={control}
                defaultValue={social.getValue(organization) ?? ''}
                name={social.key}
                render={({ field }) => (
                  <Input
                    {...field}
                    backgroundColor="#2A2D31"
                    className={`w-full max-h-12 px-3 py-2 bg-[#181a1b] text-white placeholder-white/40 focus:outline-none font-poppins rounded-lg border border-transparent focus:border-defendrRed/60 transition-all ${errors[social.key] ? 'border-red-500' : ''}`}
                    placeholder={social.placeholder}
                    type="url"
                  />
                )}
              />
              {errors[social.key] && (
                <Typo as="span" className="text-red-500 text-xs mt-1 ml-1 font-poppins">
                  {errors[social.key]?.message?.toString()}
                </Typo>
              )}
            </div>
          </div>
        ))}
      </div>
    </form>
  )
}
