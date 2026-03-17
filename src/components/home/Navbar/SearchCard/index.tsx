import React, { useEffect, useRef } from 'react'
import Link from 'next/link'

import Typo from '@/components/ui/Typo'
import Search from '@/components/ui/Icons/Search'
import Flag from '@/components/ui/Icons/Flag'
import TrophyMini from '@/components/ui/Icons/TrophyMini'
import Users from '@/components/ui/Icons/Users'

interface SearchCardProps {
  value: string
  onChange: (v: string) => void
  onClose: () => void
}

const SUGGESTIONS = [
  { icon: TrophyMini, label: 'Browse Tournaments', href: '/tournaments' },
  { icon: Users, label: 'Find Players', href: '/players' },
  { icon: Flag, label: 'Explore Teams', href: '/teams' },
]

const SearchCard: React.FC<SearchCardProps> = ({ value, onChange, onClose }) => {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Auto-focus
    inputRef.current?.focus()

    // Escape to close
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[999999] flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal card */}
      <div className="relative z-10 w-full max-w-xl mx-4 bg-[#1a1a1f] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden">
        {/* Search row */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.06]">
          <Search className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <input
            ref={inputRef}
            className="flex-1 min-w-0 bg-transparent outline-none text-white text-sm font-poppins placeholder-gray-500"
            placeholder="Type a command or search..."
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
          />
          <button
            type="button"
            onClick={onClose}
            className="w-6 h-6 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors flex-shrink-0"
            aria-label="Close search"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Suggestions */}
        <div className="px-2 py-3 flex flex-col gap-0.5">
          <div className="px-2 pb-2">
            <Typo
              as="p"
              fontVariant="p6"
              color="ghostGrey"
              fontFamily="poppins"
              className="uppercase tracking-widest"
            >
              Suggestions
            </Typo>
          </div>
          {SUGGESTIONS.map(({ icon: Icon, label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition-all duration-150 group"
            >
              <span className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-white/8 flex items-center justify-center flex-shrink-0 transition-colors">
                <Icon className="w-4 h-4" />
              </span>
              <Typo as="span" fontVariant="p5" color="white" fontFamily="poppins">
                {label}
              </Typo>
            </Link>
          ))}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2.5 border-t border-white/[0.06] flex items-center gap-3">
          <span className="text-xs text-gray-600 font-poppins">
            Press{' '}
            <kbd className="px-1.5 py-0.5 bg-white/5 rounded text-gray-400 font-mono text-[10px]">
              ESC
            </kbd>{' '}
            to close
          </span>
        </div>
      </div>
    </div>
  )
}

export default SearchCard
