'use client'
import { Trash } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import Button from '@/components/ui/Button'
import Typo from '@/components/ui/Typo'
import { updateTeam } from '@/services/teamService'
import ImageUploadArea from '@/components/ui/ImageUploadArea'
import { DEFAULT_IMAGES } from '@/utils/imageUrlSanitizer'

interface BrandingSectionProps {
  team: {
    _id?: string
    profileImage?: string
    coverImage?: string
  }
  teamId: string
}

export default function BrandingTab({ team }: BrandingSectionProps) {
  const [logo, setLogo] = useState(team?.profileImage || DEFAULT_IMAGES.TEAM)
  const [cover, setCover] = useState(team?.coverImage || DEFAULT_IMAGES.TEAM_BANNER)
  const [teamData, setTeamData] = useState(team)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (team) {
      setTeamData(team)
      setLogo(team?.profileImage || DEFAULT_IMAGES.TEAM)
      setCover(team?.coverImage || DEFAULT_IMAGES.TEAM_BANNER)
    }
  }, [team])

  const removeLogo = () => setLogo(DEFAULT_IMAGES.TEAM)
  const removeCover = () => setCover(DEFAULT_IMAGES.TEAM_BANNER)

  const onCancelChanges = () => {}

  const onSaveChanges = async () => {
    try {
      setIsSaving(true)
      const teamId = teamData?._id
      if (!teamId) {
        toast.error('Team ID missing')
        return
      }
      await updateTeam(teamId, {
        profileImage: logo,
        coverImage: cover,
      })
      toast.success('Team updated successfully!')
    } catch {
      toast.error('Please try again')
    } finally {
      setIsSaving(false)
    }
  }
  if (!team) {
    return <div>Loading...</div>
  }

  return (
    <div className="bg-[#212529] rounded-xl mx-auto p-7 sm:p-10 flex flex-col gap-4 max-w-7xl">
      <div className="sm:flex gap-4 absolute right-10 top-36">
        <Button
          className="hidden w-auto pb-10 sm:block"
          label="cancel"
          variant="contained-black"
          onClick={onCancelChanges}
        />
        <Button
          className="w-auto hidden pb-10 sm:block"
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
      <div className="flex flex-col justify-center sm:justify-start items-center sm:items-start sm:flex-row sm:gap-20">
        <div className="flex flex-col items-center gap-4">
          <ImageUploadArea
            enableCrop
            isSquare
            acceptedFormats={['image/png', 'image/jpeg', 'image/svg+xml']}
            cropAspectRatio={1}
            dimensions="512x512px"
            existingImage={logo}
            maxSize={5}
            title=""
            onUploaded={({ url }) => setLogo(url)}
          />
          <button
            className="font-poppins p-2 text-xs inline-flex w-auto items-center gap-2 justify-center text-red-600 border rounded-xl border-red-600"
            onClick={removeLogo}
          >
            <Trash className="w-4 h-4 inline" />
            <Typo as="p" color="red" fontFamily="poppins" fontVariant="p4">
              remove logo
            </Typo>
          </button>
        </div>
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
      <div className="flex flex-col gap-3 mt-5">
        <div className="flex flex-col">
          <Typo
            as="h1"
            className="text-sm sm:text-sm md:text-md xl:text-lg"
            color="white"
            fontFamily="poppins"
            fontVariant="h3"
            fontWeight="regular"
          >
            Profile Banner
          </Typo>
          <Typo className="text-gray-500 text-sm md:text-[17px] mt-2 md:mt-0" fontFamily="poppins">
            this will be displayed at the top of your organization profile
          </Typo>
        </div>
        <div className="mt-4">
          <ImageUploadArea
            enableCrop
            acceptedFormats={['image/png', 'image/jpeg', 'image/svg+xml']}
            cropAspectRatio={16 / 5}
            cropHeight={300}
            cropWidth={1600}
            dimensions="1600x500px"
            existingImage={cover}
            maxSize={8}
            title=""
            onUploaded={({ url }) => setCover(url)}
          />
          <div className="flex gap-5 mt-5">
            <button
              className=" p-3 inline-flex items-center gap-2 justify-center  border rounded-xl border-red-600"
              onClick={removeCover}
            >
              <Trash className="w-5 h-5 inline me-2 text-red-600" />
              <Typo as="p" color="red" fontFamily="poppins" fontVariant="p4">
                remove logo
              </Typo>
            </button>
          </div>
        </div>
        <div className="mt-3">
          <Typo className="text-[rgb(244_63_94)] text-sm" fontFamily="poppins">
            Recommended
          </Typo>
          <Typo className="text-gray-400 text-sm mt-2 md:mt-0" fontFamily="poppins">
            :1200x300px. Max 5MB. Formats: JPG,PNG,SVG.
          </Typo>
          <div className="flex gap-4 mt-10 justify-center items-center sm:hidden pb-10">
            <Button
              className="font-poppins w-auto"
              label="cancel"
              variant="contained-dark"
              onClick={onCancelChanges}
            />
            <Button
              className="font-poppins w-auto"
              disabled={isSaving}
              label={isSaving ? 'Saving...' : 'save changes'}
              variant="contained-red"
              onClick={onSaveChanges}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
