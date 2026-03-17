'use client'
import Link from 'next/link'
import { useState } from 'react'

import CalendarEmpty from '@/components/ui/Icons/CalendarEmpty'
import Game from '@/components/ui/Icons/Game'
import Home from '@/components/ui/Icons/Home'
import Org from '@/components/ui/Icons/Org'
import Plus from '@/components/ui/Icons/Plus'
import Team from '@/components/ui/Icons/Team'
import TrophyMini from '@/components/ui/Icons/TrophyMini'
import Building from '@/components/ui/Icons/Building'
import Blog from '@/components/ui/Icons/Blog'
import Bar from '@/components/ui/Icons/bars'

const Chevron = ({ open }: { open: boolean }) => (
  <svg
    aria-hidden="true"
    className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
    fill="none"
    height="14"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2.5"
    viewBox="0 0 24 24"
    width="14"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

const DiamondIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z" />
  </svg>
)

const discoverLinks = [
  { title: 'Tournaments', link: '/tournaments', icon: <TrophyMini /> },
  { title: 'Organizations', link: '/organizations', icon: <Org /> },
  { title: 'Games', link: '/games', icon: <Game /> },
  { title: 'Events', link: '/events', icon: <CalendarEmpty /> },
]

const createLinks = [
  {
    title: 'Team',
    link: '/team/create',
    icon: <Team />,
    description: 'Build your competitive squad',
  },
  {
    title: 'Tournament',
    link: '/tournament',
    icon: <TrophyMini />,
    description: 'Host your own esports event',
  },
  {
    title: 'Organization',
    link: '/organization/create',
    icon: <Org />,
    description: 'Create a tournament org',
  },
]

type DropHeaderProps = {
  showAuthButtons?: boolean
  navItems?: any[]
}

const DropHeader = ({ showAuthButtons = true }: DropHeaderProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [openSection, setOpenSection] = useState<string | null>(null)

  const close = () => {
    setIsOpen(false)
    setOpenSection(null)
  }
  const toggleSection = (s: string) => setOpenSection(prev => (prev === s ? null : s))

  return (
    <>
      <button
        className="p-2 text-gray-400 hover:text-white transition-colors"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
      >
        <Bar />
      </button>

      {isOpen && (
        <>
          {/* backdrop */}
          <div className="fixed inset-0 bg-black/75 z-[9998]" onClick={close} />

          {/* right-side drawer */}
          <div className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-[#181818] z-[9999] flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5">
              <span className="text-white font-semibold text-base font-poppins">Menu</span>
              <button
                onClick={close}
                className="p-1.5 text-gray-500 hover:text-white transition-colors"
                aria-label="Close menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Body — action-first order */}
            <div className="flex-1 overflow-y-auto py-2">
              {/* Home */}
              <Link
                href="/"
                onClick={close}
                className="flex items-center gap-3 px-5 py-3 text-gray-300 hover:text-white hover:bg-white/5 transition-colors font-poppins text-sm font-medium"
              >
                <Home /> Home
              </Link>

              {/* Explore accordion — discovery first */}
              <button
                className="flex items-center justify-between w-full px-5 py-3 text-gray-300 hover:text-white hover:bg-white/5 transition-colors font-poppins text-sm font-medium"
                onClick={() => toggleSection('explore')}
              >
                <span className="flex items-center gap-3">
                  <Building />
                  Explore
                </span>
                <Chevron open={openSection === 'explore'} />
              </button>
              {openSection === 'explore' && (
                <div className="border-l-2 border-defendrRed/30 ml-5 mr-3 rounded-r-lg mb-1">
                  {discoverLinks.map(dl => (
                    <Link
                      key={dl.link}
                      href={dl.link}
                      onClick={close}
                      className="flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:text-white transition-colors font-poppins text-sm"
                    >
                      <span className="opacity-60">{dl.icon}</span>
                      {dl.title}
                    </Link>
                  ))}
                </div>
              )}

              {/* Create accordion */}
              <button
                className="flex items-center justify-between w-full px-5 py-3 text-gray-300 hover:text-white hover:bg-white/5 transition-colors font-poppins text-sm font-medium"
                onClick={() => toggleSection('create')}
              >
                <span className="flex items-center gap-3">
                  <Plus />
                  Create
                </span>
                <Chevron open={openSection === 'create'} />
              </button>
              {openSection === 'create' && (
                <div className="border-l-2 border-defendrRed/30 ml-5 mr-3 rounded-r-lg mb-1">
                  {createLinks.map(cl => (
                    <Link
                      key={cl.link}
                      href={cl.link}
                      onClick={close}
                      className="flex items-start gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors"
                    >
                      <span className="opacity-60 mt-0.5">{cl.icon}</span>
                      <div>
                        <p className="text-sm font-medium font-poppins text-white">{cl.title}</p>
                        <p className="text-xs text-gray-500 font-poppins">{cl.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Divider */}
              <div className="mx-5 my-1 border-t border-white/5" />

              {/* Secondary links */}
              <Link
                href="/tournaments"
                onClick={close}
                className="flex items-center gap-3 px-5 py-3 text-gray-400 hover:text-white hover:bg-white/5 transition-colors font-poppins text-sm"
              >
                <TrophyMini /> Tournaments
              </Link>
              <Link
                href="/blogs"
                onClick={close}
                className="flex items-center gap-3 px-5 py-3 text-gray-400 hover:text-white hover:bg-white/5 transition-colors font-poppins text-sm"
              >
                <Blog /> Blogs
              </Link>
              <Link
                href="/pricing"
                onClick={close}
                className="flex items-center gap-3 px-5 py-3 text-gray-400 hover:text-white hover:bg-white/5 transition-colors font-poppins text-sm"
              >
                <DiamondIcon /> Pricing
              </Link>
            </div>

            {/* Auth buttons */}
            {showAuthButtons && (
              <div className="border-t border-white/5 px-5 py-5 flex gap-3">
                <Link
                  href="/login"
                  onClick={close}
                  className="flex-1 flex items-center justify-center py-2.5 text-sm font-semibold font-poppins rounded bg-white text-defendrRed hover:bg-gray-100 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={close}
                  className="flex-1 flex items-center justify-center py-2.5 text-sm font-semibold font-poppins rounded bg-defendrRed text-white hover:bg-defendrRed/90 transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </>
  )
}

export default DropHeader
