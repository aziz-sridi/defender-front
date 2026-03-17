'use client'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import Button from '@/components/ui/Button'
import Input from '@/components/ui/Inputs'
import Typo from '@/components/ui/Typo'
import { updateOrganizationV2 } from '@/services/organizationService'

interface GeneralSectionProps {
  organization: any
  organizationId: string
}

interface FormValues {
  name: string
  description: string
  email: string
  phone: string
  website: string
}
let saveFn: (() => void) | null = null
export function generalSave() {
  if (saveFn) {
    saveFn()
  }
}
let cancelFn: (() => void) | null = null
export function generalCancel() {
  if (cancelFn) {
    cancelFn()
  }
}
export default function GeneralSection({ organization, organizationId }: GeneralSectionProps) {
  const { register, handleSubmit, setValue, reset, watch } = useForm<FormValues>({
    defaultValues: {
      name: '',
      description: '',
      email: '',
      phone: '',
      website: '',
    },
  })

  useEffect(() => {
    if (organization) {
      setValue('name', organization?.name || '')
      setValue('description', organization?.bio || '')
      setValue('email', organization?.email || '')
      setValue('phone', organization?.phone || '')
      setValue('website', organization?.website || '')
    }
  }, [organization, setValue])

  const onSaveChanges = async (data: FormValues) => {
    try {
      const payload = {
        name: data.name,
        bio: data.description, // Backend expects 'bio' field
        email: data.email,
        phoneNumber: data.phone, // Backend expects 'phoneNumber'
        website: data.website,
      }

      await updateOrganizationV2(organizationId, payload)
      toast.success('Organization updated successfully')
      reset(data)
    } catch (error) {
      toast.error('Error updating organization')
    }
  }
  useEffect(() => {
    saveFn = handleSubmit(onSaveChanges)
    return () => {
      saveFn = null
    }
  }, [handleSubmit])
  const onCancelChanges = () => {
    reset({
      name: organization?.name || '',
      description: organization?.bio || '',
      email: organization?.email || '',
      phone: organization?.phone || '',
      website: organization?.website || '',
    })
  }
  cancelFn = onCancelChanges

  return (
    <form
      className="flex flex-col gap-6 pb-10 max-w-7xl mx-auto relative"
      onSubmit={handleSubmit(onSaveChanges)}
    >
      <div className="bg-[#212529] rounded-xl p-7 sm:p-10 flex flex-col gap-4">
        <Typo
          as="label"
          className="text-sm md:text-base text-white font-medium"
          fontFamily="poppins"
        >
          Organization Name
        </Typo>
        <Input
          backgroundColor="#2A2D31"
          placeholder="Enter organization name"
          textClassName="font-poppins"
          value={watch('name')}
          onChange={val => setValue('name', val)}
        />
        <Typo as="div" className="text-gray-500 text-xs">
          Full name of your organization
        </Typo>

        <Typo
          as="label"
          className="text-sm md:text-base text-white font-medium"
          fontFamily="poppins"
        >
          Description
        </Typo>
        <textarea
          className="resize-none text-white border border-[#302F31] rounded-2xl bg-[#2A2D31] px-4 py-2 text-sm sm:text-base font-poppins placeholder-gray-500 focus:border-defendrRed focus:ring-2 focus:ring-defendrRed/40 hover:border-defendrRed/60"
          placeholder="A brief description of your organization (max 500 characters)"
          rows={5}
          value={watch('description')}
          onChange={e => setValue('description', e.target.value)}
        />
        <Typo as="div" className="text-gray-500 text-xs">
          A brief description of your organization (max 500 characters)
        </Typo>
      </div>
      <div className="bg-[#212529] rounded-xl p-7 sm:p-10 flex flex-col gap-6">
        <Typo
          as="label"
          className="text-sm md:text-base text-white font-medium"
          fontFamily="poppins"
        >
          Email Address
        </Typo>
        <Input
          backgroundColor="#2A2D31"
          placeholder="Enter email"
          textClassName="font-poppins"
          type="email"
          value={watch('email')}
          onChange={val => setValue('email', val)}
        />
        <Typo
          as="label"
          className="text-sm md:text-base text-white font-medium"
          fontFamily="poppins"
        >
          Phone Number
        </Typo>
        <Input
          backgroundColor="#2A2D31"
          placeholder="Enter phone"
          textClassName="font-poppins"
          type="tel"
          value={watch('phone')}
          onChange={val => setValue('phone', val)}
        />

        <Typo
          as="label"
          className="text-sm md:text-base text-white font-medium"
          fontFamily="poppins"
        >
          Website
        </Typo>
        <Input
          backgroundColor="#2A2D31"
          placeholder="Enter website"
          textClassName="font-poppins"
          type="url"
          value={watch('website')}
          onChange={val => setValue('website', val)}
        />
      </div>
    </form>
  )
}
