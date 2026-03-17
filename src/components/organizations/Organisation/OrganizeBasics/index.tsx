'use client'

import { useContext, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { ChevronRight } from 'lucide-react'

import { OrganizationContext } from '@/components/context/OrganizationContext'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Inputs'
import ImageUploadArea from '@/components/ui/ImageUploadArea'
import Typo from '@/components/ui/Typo'
import { DEFAULT_IMAGES } from '@/utils/imageUrlSanitizer'

interface OrganizeBasicsProps {
  onNext?: () => void
}

const OrganizeBasics = ({ onNext }: OrganizeBasicsProps) => {
  const { organizationData, setOrganizationData } = useContext(OrganizationContext)

  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      name: organizationData.name || '',
      description: organizationData.description || '',
      bannerImage: organizationData.bannerImage || DEFAULT_IMAGES.ORGANIZATION_BANNER,
      logoImage: organizationData.logoImage || DEFAULT_IMAGES.ORGANIZATION,
    },
  })

  const coverImageUrl = watch('bannerImage')
  const profileImageUrl = watch('logoImage')

  useEffect(() => {}, [organizationData])

  interface BasicsFormData {
    name: string
    description: string
    bannerImage: string | File
    logoImage: string | File
  }

  const onSubmit = (formData: BasicsFormData) => {
    if (!formData.name.trim()) {
      toast.error('Organisation name is required')
      return
    }
    const hasBanner = Boolean(
      (typeof formData.bannerImage === 'string' && formData.bannerImage.trim()) ||
        formData.bannerImage instanceof File ||
        (typeof coverImageUrl === 'string' && coverImageUrl !== '/noBg.png'),
    )
    const hasLogo = Boolean(
      (typeof formData.logoImage === 'string' && formData.logoImage.trim()) ||
        formData.logoImage instanceof File ||
        (typeof profileImageUrl === 'string' && profileImageUrl !== '/noBg.png'),
    )
    if (!hasBanner) {
      toast.error('Banner image is required')
      return
    }
    if (!hasLogo) {
      toast.error('Logo image is required')
      return
    }

    setOrganizationData(prev => ({
      ...prev,
      name: formData.name,
      description: formData.description,
      bio: formData.description,
      bannerImage: formData.bannerImage,
      logoImage: formData.logoImage,
    }))
    toast.success('Basics saved!')
    if (typeof onNext === 'function') onNext()
  }

  return (
    <form className="w-full p-4 sm:p-6 md:p-8 font-poppins" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-7">
        {/* Section header */}
        <div>
          <Typo as="h2" className="text-lg font-bold text-white mb-1" fontFamily="poppins">
            Organisation Basics
          </Typo>
          <Typo as="p" className="text-gray-500 text-sm" fontFamily="poppins">
            Give your organisation a name and identity
          </Typo>
        </div>

        {/* Name */}
        <div>
          <Typo
            as="label"
            className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1.5 block"
            fontFamily="poppins"
          >
            Organisation Name <span className="text-defendrRed">*</span>
          </Typo>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <Input
                value={field.value ?? ''}
                onChange={field.onChange}
                placeholder="e.g. Phantom Esports"
                size="m"
                backgroundColor="#1c1c20"
                borderColor="rgba(255,255,255,0.08)"
              />
            )}
          />
        </div>

        {/* Description */}
        <div>
          <Typo
            as="label"
            className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1.5 block"
            fontFamily="poppins"
          >
            Description
          </Typo>
          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <textarea
                className="w-full rounded-2xl px-5 py-4 text-base focus:ring-1 focus:ring-white/20 focus:outline-none placeholder-gray-500 resize-none font-poppins transition-colors"
                style={{
                  backgroundColor: '#1c1c20',
                  borderColor: 'rgba(255,255,255,0.08)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  color: 'white',
                }}
                placeholder="What is your organisation about?"
                rows={5}
                value={field.value || ''}
                onChange={e => field.onChange(e.target.value)}
              />
            )}
          />
        </div>

        {/* Banner */}
        <div>
          <Typo
            as="label"
            className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1.5 block"
            fontFamily="poppins"
          >
            Banner Image <span className="text-defendrRed">*</span>
          </Typo>
          <ImageUploadArea
            enableCrop
            acceptedFormats={['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp']}
            cropAspectRatio={1200 / 300}
            cropHeight={300}
            cropWidth={1200}
            dimensions="1200×300px · Max 5MB · JPG/PNG/WebP"
            existingImage={typeof coverImageUrl === 'string' ? coverImageUrl : null}
            title=""
            onRemove={() => {
              setValue('bannerImage', DEFAULT_IMAGES.ORGANIZATION_BANNER)
              setOrganizationData(prev => ({
                ...prev,
                bannerImage: DEFAULT_IMAGES.ORGANIZATION_BANNER,
              }))
            }}
            onUploaded={({ url }) => {
              setValue('bannerImage', url)
              setOrganizationData(prev => ({ ...prev, bannerImage: url }))
            }}
          />
        </div>

        {/* Logo */}
        <div>
          <Typo
            as="label"
            className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1.5 block"
            fontFamily="poppins"
          >
            Logo <span className="text-defendrRed">*</span>
          </Typo>
          <div className="w-36">
            <ImageUploadArea
              enableCrop
              isSquare
              acceptedFormats={['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp']}
              dimensions="512×512px · Max 5MB"
              existingImage={typeof profileImageUrl === 'string' ? profileImageUrl : null}
              title=""
              onRemove={() => {
                setValue('logoImage', DEFAULT_IMAGES.ORGANIZATION)
                setOrganizationData(prev => ({ ...prev, logoImage: DEFAULT_IMAGES.ORGANIZATION }))
              }}
              onUploaded={({ url }) => {
                setValue('logoImage', url)
                setOrganizationData(prev => ({ ...prev, logoImage: url }))
              }}
            />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-end mt-8 pt-6 border-t border-white/[0.06]">
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

export default OrganizeBasics
