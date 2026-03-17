'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import CustomToggleSwitch from '@/components/ui/CustomToggleSwitch'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const isDark = theme === 'dark' || theme === undefined

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  return (
    <div className="flex items-center justify-between p-4 border border-defendrGrey dark:border-defendrGrey border-gray-300 rounded-lg bg-[#302F31] dark:bg-[#302F31] bg-gray-50 transition-colors">
      <div className="flex items-center gap-3">
        {isDark ? (
          <Moon className="w-5 h-5 text-white dark:text-white text-gray-900" />
        ) : (
          <Sun className="w-5 h-5 text-white dark:text-white text-gray-900" />
        )}
        <div className="flex flex-col">
          <span className="text-white dark:text-white text-gray-900 font-medium text-sm font-poppins">
            {isDark ? 'Dark Mode' : 'Light Mode'}
          </span>
          <span className="text-gray-400 dark:text-gray-400 text-gray-600 text-xs font-poppins">
            {isDark ? 'Currently using dark theme' : 'Currently using light theme'}
          </span>
        </div>
      </div>
      <CustomToggleSwitch
        checked={isDark}
        label=""
        onChange={() => {
          toggleTheme()
        }}
      />
    </div>
  )
}
