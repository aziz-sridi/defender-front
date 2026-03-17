'use client'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import Typo from '@/components/ui/Typo'
import { updateOrganizationV2 } from '@/services/organizationService'
import ImageUploadArea from '@/components/ui/ImageUploadArea'
import { DEFAULT_IMAGES } from '@/utils/imageUrlSanitizer'

interface OrganizationMinimal {
  _id: string
  logoImage?: string
  bannerImage?: string
}
interface BrandingSectionProps {
  organization: OrganizationMinimal | null
  organizationId: string
}
let saveFn: (() => void) | null = null
export function brandingSave() {
  if (saveFn) {
    saveFn()
  }
}
let cancelFn: (() => void) | null = null
export function brandingCancel() {
  if (cancelFn) {
    cancelFn()
  }
}
export default function BrandingTab({ organization }: BrandingSectionProps) {
  const [logoUrl, setLogoUrl] = useState<string>(
    organization?.logoImage || DEFAULT_IMAGES.ORGANIZATION,
  )
  const [bannerUrl, setBannerUrl] = useState<string>(
    organization?.bannerImage || DEFAULT_IMAGES.ORGANIZATION_BANNER,
  )
  const [organizationData, setOrganizationData] = useState<OrganizationMinimal | null>(null)

  useEffect(() => {
    if (organization) {
      setOrganizationData(organization)
      setLogoUrl(organization?.logoImage || DEFAULT_IMAGES.ORGANIZATION)
      setBannerUrl(organization?.bannerImage || DEFAULT_IMAGES.ORGANIZATION_BANNER)
    }
  }, [organization])
  // Reset functions use URL state now
  const onCancelChanges = () => {
    setLogoUrl(organization?.logoImage || DEFAULT_IMAGES.ORGANIZATION)
    setBannerUrl(organization?.bannerImage || DEFAULT_IMAGES.ORGANIZATION_BANNER)
  }
  cancelFn = onCancelChanges
  const onSaveChanges = async () => {
    try {
      const organizationId = organizationData?._id
      // Guard: need id
      if (!organizationId) {
        toast.error('Missing organization id')
        return
      }
      // Send JSON body with URLs only (backend must accept these fields as strings)
      const payload: Record<string, unknown> = {}
      if (logoUrl && logoUrl !== DEFAULT_IMAGES.ORGANIZATION) {
        // V2 expects `logoImage` instead of `logo`
        payload.logoImage = logoUrl
      }
      if (bannerUrl && bannerUrl !== DEFAULT_IMAGES.ORGANIZATION_BANNER) {
        payload.bannerImage = bannerUrl
      }
      await updateOrganizationV2(organizationId, payload)
      toast.success('Organization updated successfully!')
    } catch {
      toast.error('Please try again')
    }
  }
  saveFn = onSaveChanges
  return (
    <div className="bg-[#212529] rounded-xl mx-auto p-7 sm:p-10 flex flex-col gap-4 max-w-7xl relative">
      <div className="flex mb-4 flex-col">
        <Typo
          as="h1"
          className="text-sm sm:text-sm md:text-lg xl:text-xl"
          color="white"
          fontFamily="poppins"
          fontVariant="h3"
          fontWeight="regular"
        >
          Logo & Branding
        </Typo>
        <Typo className="text-gray-500 text-sm md:text-[17px] mt-2 md:mt-0" fontFamily="poppins">
          Upload your organization's logo and banner images
        </Typo>
      </div>
      <div className="flex mb-4 flex-col">
        <Typo
          as="h1"
          className="text-sm sm:text-sm md:text-md xl:text-lg"
          color="white"
          fontFamily="poppins"
          fontVariant="h3"
          fontWeight="regular"
        >
          Organization Logo
        </Typo>
        <Typo className="text-gray-500 text-sm md:text-[17px] mt-2 md:mt-0" fontFamily="poppins">
          this will be displayed on your profile and throughout the platform
        </Typo>
      </div>
      <div className="flex flex-col sm:flex-row gap-10 sm:gap-20">
        <ImageUploadArea
          enableCrop
          isSquare
          acceptedFormats={['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp']}
          className=""
          dimensions="Square image, at least 512x512px. Max 5MB. JPG/PNG/SVG/WebP"
          existingImage={logoUrl}
          title="Organization Logo"
          onRemove={() => setLogoUrl(DEFAULT_IMAGES.ORGANIZATION)}
          onUploaded={({ url }) => setLogoUrl(url)}
        />
        <ImageUploadArea
          enableCrop
          acceptedFormats={['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp']}
          cropAspectRatio={1200 / 300}
          cropHeight={300}
          cropWidth={1200}
          dimensions="1200x300px. Max 5MB. JPG/PNG/SVG/WebP"
          existingImage={bannerUrl}
          title="Profile Banner"
          onRemove={() => setBannerUrl(DEFAULT_IMAGES.ORGANIZATION_BANNER)}
          onUploaded={({ url }) => setBannerUrl(url)}
        />
      </div>
      <div>
        <div>
          <Typo className="text-[rgb(244_63_94)] text-sm" fontFamily="poppins">
            Recommended
          </Typo>
          <Typo className="text-gray-400 text-sm mt-2 md:mt-0" fontFamily="poppins">
            :Square image,at least 512x512px. Max 2MB. Formats: JPG,PNG,SVG.
          </Typo>
        </div>
      </div>
      {/* Banner upload now handled above with ImageUploadArea */}
    </div>
  )
}
