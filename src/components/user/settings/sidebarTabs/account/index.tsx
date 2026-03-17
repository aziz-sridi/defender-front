'use client'

import React, { useState, useEffect } from 'react'
import { ChevronDown, LockKeyhole, User, Save } from 'lucide-react'
import { toast } from 'sonner'

import Button from '@/components/ui/Button'
import Typo from '@/components/ui/Typo'
import { updateProfile } from '@/services/userService'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

export default function Account({ user }: { user: any }) {
  const [email, setEmail] = useState('')
  const [currency, setCurrency] = useState(user?.currency || 'USD')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setEmail(user.email || '')
      setCurrency(user.currency || 'USD')
    }
  }, [user])

  useEffect(() => {
    if (user?.currency) {
      setCurrency(user.currency)
    }
  }, [user?.currency])

  const updateDetails = async () => {
    try {
      setIsLoading(true)
      const formData = new FormData()
      formData.append('email', email)
      formData.append('currency', currency)
      await updateProfile(formData)
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error('Failed to update profile: ' + error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-[#D62555]/15 rounded-xl flex items-center justify-center">
          <User className="w-4 h-4 text-[#D62555]" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white font-poppins">My Account</h2>
          <p className="text-xs text-gray-500 font-poppins">Manage your account details</p>
        </div>
      </div>

      {/* Card */}
      <div className="bg-[#212529] rounded-2xl border border-white/[0.06] overflow-hidden">
        <div className="divide-y divide-white/[0.06]">
          {/* Username */}
          <div className="p-5 sm:p-6">
            <label className="block text-sm font-semibold text-white mb-1 font-poppins">
              Username
            </label>
            <div className="relative max-w-md">
              <input
                readOnly
                className="bg-[#2c3036] rounded-xl text-sm px-4 h-11 text-gray-400 font-poppins w-full border border-white/[0.06] focus:outline-none cursor-not-allowed"
                type="text"
                value={user?.nickname || user?.fullname || ''}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                <LockKeyhole className="w-4 h-4 text-gray-500" />
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2 font-poppins leading-relaxed">
              Your nickname can be changed from the shop for 1,000 Points or for free by Premium
              users.
            </p>
          </div>

          {/* Email */}
          <div className="p-5 sm:p-6">
            <label className="block text-sm font-semibold text-white mb-1 font-poppins">
              Email Address
            </label>
            <div className="max-w-md">
              <input
                className="bg-[#2c3036] rounded-xl text-sm px-4 h-11 text-white font-poppins w-full border border-white/[0.06] focus:outline-none focus:border-[#D62555]/50 transition-colors"
                type="email"
                value={email || ''}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Currency */}
          <div className="p-5 sm:p-6">
            <label className="block text-sm font-semibold text-white mb-1 font-poppins">
              Currency
            </label>
            <div className="relative max-w-md">
              <select
                className="bg-[#2c3036] rounded-xl text-sm px-4 h-11 text-white font-poppins w-full appearance-none border border-white/[0.06] focus:outline-none focus:border-[#D62555]/50 transition-colors"
                value={currency}
                onChange={e => setCurrency(e.target.value)}
              >
                <option value="USD">USD ($)</option>
                <option value="TND">TND (dt)</option>
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </span>
            </div>
          </div>

          {/* Theme */}
          <div className="p-5 sm:p-6">
            <label className="block text-sm font-semibold text-white mb-1 font-poppins">
              Theme
            </label>
            <div className="max-w-md">
              <ThemeToggle />
            </div>
            <p className="text-xs text-gray-500 mt-2 font-poppins">
              Switch between light and dark mode. Saved automatically.
            </p>
          </div>
        </div>

        {/* Save footer */}
        <div className="px-5 sm:px-6 py-4 bg-[#1a1d21] border-t border-white/[0.06] flex justify-end">
          <button
            className="flex items-center gap-2 px-5 py-2.5 bg-[#D62555] hover:bg-[#b81f47] disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors"
            disabled={isLoading}
            onClick={updateDetails}
          >
            <Save className="w-4 h-4" />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
