'use client'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Bell } from 'lucide-react'

import Typo from '@/components/ui/Typo'
import { updateProfile } from '@/services/userService'

interface ToggleProps {
  checked: boolean
  onChange: () => void
}

const Toggle = ({ checked, onChange }: ToggleProps) => (
  <button
    type="button"
    className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ${
      checked ? 'bg-[#D62555]' : 'bg-[#3a3f45]'
    }`}
    onClick={onChange}
  >
    <span
      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
        checked ? 'translate-x-5' : 'translate-x-0'
      }`}
    />
  </button>
)

export default function Notification({ user }: { user: any }) {
  const [competitions, setCompetitions] = useState<boolean>(false)
  const [social, setSocial] = useState<boolean>(false)
  const [defendrNews, setDefendrNews] = useState<boolean>(false)

  useEffect(() => {
    if (user?.notificationSettings) {
      setCompetitions(user.notificationSettings.competitions || false)
      setSocial(user.notificationSettings.social || false)
      setDefendrNews(user.notificationSettings.news || false)
    }
  }, [user])

  const handleNotificationChange = async (
    type: 'social' | 'competitions' | 'news',
    value: boolean,
  ) => {
    try {
      if (type === 'social') setSocial(value)
      if (type === 'competitions') setCompetitions(value)
      if (type === 'news') setDefendrNews(value)

      const formData = new FormData()
      formData.append('social_notifications', (type === 'social' ? value : social).toString())
      formData.append(
        'competitions_notifications',
        (type === 'competitions' ? value : competitions).toString(),
      )
      formData.append('news_notifications', (type === 'news' ? value : defendrNews).toString())
      await updateProfile(formData)
      toast.success('Notification settings updated!')
    } catch (error) {
      toast.error('Failed to update notification settings')
    }
  }

  const notificationOptions = [
    {
      key: 'social' as const,
      label: 'Social',
      description: 'Updates on your social activity',
      value: social,
    },
    {
      key: 'competitions' as const,
      label: 'Competitions',
      description: 'Updates on your competitions activity, tournament invites',
      value: competitions,
    },
    {
      key: 'news' as const,
      label: 'Defendr News',
      description: 'New features, services — also sent via email',
      value: defendrNews,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-blue-500/15 rounded-xl flex items-center justify-center">
          <Bell className="w-4 h-4 text-blue-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white font-poppins">Notifications</h2>
          <p className="text-xs text-gray-500 font-poppins">
            Choose what you want to be notified about
          </p>
        </div>
      </div>

      {/* Card */}
      <div className="bg-[#212529] rounded-2xl border border-white/[0.06] overflow-hidden">
        <div className="divide-y divide-white/[0.06]">
          {notificationOptions.map(opt => (
            <div key={opt.key} className="flex items-center justify-between gap-4 p-5 sm:p-6">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white font-poppins">{opt.label}</p>
                <p className="text-xs text-gray-500 mt-0.5 font-poppins">{opt.description}</p>
              </div>
              <Toggle
                checked={opt.value}
                onChange={() => handleNotificationChange(opt.key, !opt.value)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
