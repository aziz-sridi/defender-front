'use client'
import { useState } from 'react'
import { toast } from 'sonner'

import Button from '@/components/ui/Button'
import Typo from '@/components/ui/Typo'
import { updateProfile } from '@/services/userService'

const AddSocialMediaModal = ({
  platforms,
  socialMediaLinks = {},
  onClose,
}: {
  platforms: any
  socialMediaLinks: Record<string, string>
  onClose: () => void
}) => {
  // initialize state with existing socials or empty string
  const [links, setLinks] = useState<Record<string, string>>(
    platforms.reduce(
      (acc: Record<string, string>, platform: string) => {
        acc[platform] = socialMediaLinks[platform] || ''
        return acc
      },
      {} as Record<string, string>,
    ),
  )

  const handleChange = (platform: string, value: string) => {
    setLinks((prev: Record<string, string>) => ({ ...prev, [platform]: value }))
  }

  const handleSave = async () => {
    const formdata = new FormData()
    Object.entries(links).forEach(([platform, url]) => {
      if (url && url.trim() !== '') {
        formdata.append(platform, url.trim())
      }
    })

    try {
      await updateProfile(formdata)
      toast.success('Social media updated')
    } catch (error) {
      toast.error('Error updating social media')
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1a1d20] p-6 rounded-lg shadow-lg w-[28rem] max-h-[90vh] overflow-y-auto">
        <Typo className="text-white text-lg font-semibold mb-4" fontFamily="poppins">
          Manage Social Media
        </Typo>

        {platforms.map((platform: string) => (
          <div key={platform} className="mb-4">
            <Typo className="block mb-2 text-gray-300 text-sm" fontFamily="poppins">
              {platform.charAt(0).toUpperCase() + platform.slice(1)}
            </Typo>
            <input
              className="w-full p-2 rounded bg-[#2a2d31] text-white border border-gray-600 focus:ring-2 focus:ring-pink-600"
              placeholder="http://"
              type="url"
              value={links[platform]}
              onChange={e => handleChange(platform, e.target.value)}
            />
          </div>
        ))}

        <div className="flex justify-end mt-4 gap-2">
          <Button
            className="px-3 py-1 rounded w-auto text-white"
            label="cancel"
            variant="contained-dark"
            onClick={onClose}
          />
          <Button className="px-3 py-1 rounded w-auto" label="save" onClick={handleSave} />
        </div>
      </div>
    </div>
  )
}

export default AddSocialMediaModal
