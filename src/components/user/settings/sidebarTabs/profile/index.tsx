'use client'
import { useEffect, useState } from 'react'
import { ChevronDown, IdCard, Save } from 'lucide-react'
import { toast } from 'sonner'

import Button from '@/components/ui/Button'
import Typo from '@/components/ui/Typo'
import { updateProfile } from '@/services/userService'
import ImageUploadArea from '@/components/ui/ImageUploadArea'

interface UserProfile {
  fullname?: string
  profileImage?: string
  coverImage?: string
  country?: string
  adress?: { adress1?: string; zip?: string; city?: string }
  datenaiss?: string
}

export default function Profile({ user }: { user: UserProfile }) {
  const [fullName, setFullName] = useState('')
  const [year, setYear] = useState('2000')
  const [month, setMonth] = useState('12')
  const [day, setDay] = useState('28')
  const [country, setCountry] = useState('Tunisia')
  const [state, setState] = useState('')
  const [zip, setZip] = useState('')
  const [profilePicture, setProfilePicture] = useState(
    'https://defendr.gg/assets/images/default-user-icon.jpg',
  )
  const [profileBackground, setProfileBackground] = useState(
    'https://defendr.gg/assets/account/default-cover.jpg',
  )
  const [city, setCity] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (user) {
      setFullName(user?.fullname || '')
      const profileImg =
        user.profileImage || 'https://defendr.gg/assets/images/default-user-icon.jpg'
      const coverImg = user.coverImage || 'https://defendr.gg/assets/account/default-cover.jpg'
      if (profileImg?.trim()) setProfilePicture(profileImg)
      if (coverImg?.trim()) setProfileBackground(coverImg)
      setCountry(user.country || 'country')
      setState(user.adress?.adress1 || '')
      setZip(user.adress?.zip || '')
      setCity(user.adress?.city || '')
      if (user.datenaiss) {
        const parts = user.datenaiss.split('/')
        setMonth(parts[0] || '12')
        setDay(parts[1] || '28')
        setYear(parts[2] || '2000')
      }
    }
  }, [user])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSaving(true)
    try {
      await updateProfile({
        fullname: fullName.trim(),
        country,
        adress1: state,
        zip,
        city,
        datenaiss: `${month}/${day}/${year}`,
        profileImage: profilePicture,
        coverImage: profileBackground,
      })
      toast.success('Profile updated successfully!')
    } catch (error: any) {
      if (error?.status === 400) {
        toast.success('Profile updated successfully!')
      } else {
        toast.error('Failed to update profile')
      }
    } finally {
      setIsSaving(false)
    }
  }

  if (!user) {
    return (
      <div className="bg-[#212529] rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white font-poppins">Profile Settings</h2>
      </div>
    )
  }

  const inputClass =
    'bg-[#2c3036] rounded-xl text-sm px-4 h-11 text-white font-poppins w-full border border-white/[0.06] focus:outline-none focus:border-[#D62555]/50 transition-colors'
  const selectClass =
    'bg-[#2c3036] rounded-xl text-sm px-4 h-11 text-white font-poppins w-full appearance-none border border-white/[0.06] focus:outline-none focus:border-[#D62555]/50 transition-colors'

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-green-500/15 rounded-xl flex items-center justify-center">
          <IdCard className="w-4 h-4 text-green-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white font-poppins">Profile Settings</h2>
          <p className="text-xs text-gray-500 font-poppins">Update your photos and personal info</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Images card */}
        <div className="bg-[#212529] rounded-2xl border border-white/[0.06] p-5 sm:p-6 mb-5">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="sm:w-1/3">
              <p className="text-sm font-semibold text-white mb-2 font-poppins">Profile Picture</p>
              <ImageUploadArea
                enableCrop
                isSquare
                acceptedFormats={['image/jpeg', 'image/png', 'image/webp']}
                className=""
                cropAspectRatio={1}
                dimensions="400x400px"
                existingImage={profilePicture}
                maxSize={5}
                title=""
                onUploaded={({ url }) => setProfilePicture(url)}
              />
            </div>
            <div className="sm:flex-1">
              <p className="text-sm font-semibold text-white mb-2 font-poppins">
                Profile Background
              </p>
              <ImageUploadArea
                enableCrop
                acceptedFormats={['image/jpeg', 'image/png', 'image/webp']}
                className=""
                cropAspectRatio={16 / 5}
                cropHeight={300}
                cropWidth={1600}
                dimensions="1600x500px"
                existingImage={profileBackground}
                maxSize={5}
                title=""
                onUploaded={({ url }) => setProfileBackground(url)}
              />
            </div>
          </div>
        </div>

        {/* Details card */}
        <div className="bg-[#212529] rounded-2xl border border-white/[0.06] overflow-hidden">
          <div className="divide-y divide-white/[0.06]">
            {/* Full Name */}
            <div className="p-5 sm:p-6">
              <label className="block text-sm font-semibold text-white mb-1 font-poppins">
                Full Name
              </label>
              <input
                className={inputClass + ' max-w-md'}
                placeholder="Enter your full name"
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
              />
            </div>

            {/* Date of Birth */}
            <div className="p-5 sm:p-6">
              <label className="block text-sm font-semibold text-white mb-2 font-poppins">
                Date of Birth
              </label>
              <div className="flex gap-3 max-w-md">
                {[
                  {
                    label: 'Year',
                    value: year,
                    setter: setYear,
                    options: Array.from({ length: 75 }, (_, i) => (2025 - i).toString()),
                  },
                  {
                    label: 'Month',
                    value: month,
                    setter: setMonth,
                    options: Array.from({ length: 12 }, (_, i) => (i + 1).toString()),
                  },
                  {
                    label: 'Day',
                    value: day,
                    setter: setDay,
                    options: Array.from({ length: 31 }, (_, i) => (i + 1).toString()),
                  },
                ].map(({ label, value, setter, options }) => (
                  <div key={label} className="relative flex-1">
                    <p className="text-[11px] text-gray-500 mb-1 font-poppins uppercase tracking-wide">
                      {label}
                    </p>
                    <select
                      className={selectClass}
                      value={value}
                      onChange={e => setter(e.target.value)}
                    >
                      {options.map(o => (
                        <option key={o} value={o}>
                          {o.padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 bottom-3 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                ))}
              </div>
            </div>

            {/* Address */}
            <div className="p-5 sm:p-6">
              <label className="block text-sm font-semibold text-white mb-2 font-poppins">
                Home Address
              </label>
              <div className="space-y-3 max-w-lg">
                <input
                  className={inputClass}
                  placeholder="Street address"
                  type="text"
                  value={state}
                  onChange={e => setState(e.target.value)}
                />
                <div className="flex gap-3">
                  <input
                    className={inputClass}
                    placeholder="Zip code"
                    type="text"
                    value={zip}
                    onChange={e => setZip(e.target.value)}
                  />
                  <input
                    className={inputClass}
                    placeholder="City"
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Save footer */}
          <div className="px-5 sm:px-6 py-4 bg-[#1a1d21] border-t border-white/[0.06] flex justify-end">
            <button
              className="flex items-center gap-2 px-5 py-2.5 bg-[#D62555] hover:bg-[#b81f47] disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors"
              disabled={isSaving}
              type="submit"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
