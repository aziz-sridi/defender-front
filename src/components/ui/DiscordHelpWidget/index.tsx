'use client'

import React from 'react'

const DISCORD_URL = 'https://discord.gg/MUH37GjXd9'
const STORAGE_KEY = 'defendr:hideDiscordHelpWidget'

export default function DiscordHelpWidget(): React.ReactElement | null {
  const [hidden, setHidden] = React.useState<boolean>(false)
  const [mounted, setMounted] = React.useState(false)
  const [expanded] = React.useState(true)

  React.useEffect(() => {
    try {
      const v = typeof window !== 'undefined' ? sessionStorage.getItem(STORAGE_KEY) : null
      setHidden(v === '1')
    } catch {}
    setMounted(true)
  }, [])

  // No auto-expand; keep icon-only by default

  const dismiss = React.useCallback(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, '1')
    } catch {}
    setHidden(true)
  }, [])

  if (!mounted || hidden) return null

  return (
    <div
      aria-live="polite"
      className="fixed z-[60] bottom-4 right-4 sm:bottom-6 sm:right-6 select-none"
      role="complementary"
    >
      <div className="relative group">
        {/* Static pill with icon + text */}
        <a
          aria-label="Need help? Join our Discord server"
          title="Need help? Join our server"
          className={`flex items-center gap-3 rounded-full shadow-lg shadow-black/30 bg-[#232428] border border-white/10 transition-transform hover:scale-[1.02] hover:border-defendrRed/40 pr-4 pl-2 py-2`}
          href={DISCORD_URL}
          rel="noopener noreferrer"
          target="_blank"
        >
          {/* Discord logo - inline SVG */}
          <span className="h-9 w-9 rounded-full bg-[#5865F2] flex items-center justify-center flex-shrink-0">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 fill-white"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
          </span>
          <div className="text-white text-sm font-semibold leading-5">
            Need help? <span className="text-[#5865F2]">Join our server</span>
          </div>
        </a>

        {/* Dismiss button */}
        <button
          aria-label="Dismiss Discord help"
          className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-black/60 text-white/80 hover:text-white hover:bg-black/80 border border-white/10 grid place-items-center"
          onClick={dismiss}
          type="button"
        >
          ×
        </button>
      </div>
    </div>
  )
}
