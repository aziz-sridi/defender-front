'use client'
import { Shield } from 'lucide-react'

import { PasswordSection } from '@/components/user/settings/sidebarTabs/helpers/passwordSection'
import { TwoFactorSection } from '@/components/user/settings/sidebarTabs/helpers/TwoFactorAuth'

export default function Security({ user }: { user: any }) {
  return (
    <div className="space-y-6">
      {/* Section header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-orange-500/15 rounded-xl flex items-center justify-center">
          <Shield className="w-4 h-4 text-orange-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white font-poppins">Account Security</h2>
          <p className="text-xs text-gray-500 font-poppins">
            Protect your account with these settings
          </p>
        </div>
      </div>

      {/* Card */}
      <div className="bg-[#212529] rounded-2xl border border-white/[0.06] overflow-hidden">
        <div className="divide-y divide-white/[0.06]">
          <div className="p-5 sm:p-6">
            <PasswordSection />
          </div>
          <div className="p-5 sm:p-6">
            <TwoFactorSection user={user} />
          </div>
        </div>
      </div>
    </div>
  )
}
