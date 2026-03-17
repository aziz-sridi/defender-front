'use client'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import DropHeader from '@/components/home/DropHeader'
import Navbar from '@/components/home/Navbar'
import SearchCard from '@/components/home/Navbar/SearchCard'
import Building from '@/components/ui/Icons/Building'
import CalendarEmpty from '@/components/ui/Icons/CalendarEmpty'
import Game from '@/components/ui/Icons/Game'
import Home from '@/components/ui/Icons/Home'
import Org from '@/components/ui/Icons/Org'
import Plus from '@/components/ui/Icons/Plus'
import Search from '@/components/ui/Icons/Search'
import Team from '@/components/ui/Icons/Team'
import TrophyMini from '@/components/ui/Icons/TrophyMini'
import Blog from '@/components/ui/Icons/Blog'

const Chevron = ({ open }: { open: boolean }) => (
  <svg
    aria-hidden="true"
    className={`inline ml-1 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
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

// Public nav items shown when logged out
const navItems = [
  { title: 'Home', link: '/', icon: <Home /> },
  { title: 'Create', dropdown: 'create', icon: <Plus /> },
  { title: 'Explore', dropdown: 'explore', icon: <Building /> },
  { title: 'Blogs', link: '/blogs', icon: <Blog /> },
  { title: 'Pricing', link: '/pricing', icon: <DiamondIcon /> },
]

const NavBarAccount = () => {
  const { status } = useSession()
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null)
  const [searchActive, setSearchActive] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  // Authenticated users get the full logged-in navbar
  if (status === 'authenticated') {
    return <Navbar />
  }

  const enter = (key: string) => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout)
      setDropdownTimeout(null)
    }
    setOpenDropdown(key)
  }
  const leave = () => {
    const t = setTimeout(() => setOpenDropdown(null), 200)
    setDropdownTimeout(t)
  }

  return (
    <header className="w-full relative z-50">
      <nav className="w-full px-4 lg:px-6 2xl:px-20 py-3 lg:py-4 flex justify-between items-center bg-[#161616]">
        {/* Left: logo + desktop nav */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex-shrink-0">
            <Image
              alt="DEFENDR"
              height={40}
              width={160}
              src="https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/defendr_elements/Frame%201171275156.png"
              className="h-6 xl:h-8 w-auto"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden xl:flex items-center gap-0.5 ml-2">
            {navItems.map(item =>
              item.dropdown ? (
                <div
                  key={item.title}
                  className="relative"
                  onMouseEnter={() => enter(item.dropdown!)}
                  onMouseLeave={leave}
                >
                  <button
                    className={`flex items-center gap-1.5 px-3 py-2 rounded text-sm font-semibold font-poppins transition-colors duration-150 ${
                      openDropdown === item.dropdown
                        ? 'text-white bg-white/5'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="opacity-70">{item.icon}</span>
                    {item.title}
                    <Chevron open={openDropdown === item.dropdown} />
                  </button>

                  {/* Create dropdown */}
                  {item.dropdown === 'create' && openDropdown === 'create' && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-[#1e1e1e] border border-white/[0.08] rounded-xl shadow-2xl z-50 py-1.5">
                      {createLinks.map(cl => (
                        <Link
                          key={cl.link}
                          href={cl.link}
                          className="flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors duration-100 group"
                        >
                          <span className="mt-0.5 text-gray-400 group-hover:text-white transition-colors">
                            {cl.icon}
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-white font-poppins">
                              {cl.title}
                            </p>
                            <p className="text-xs text-gray-500 font-poppins mt-0.5">
                              {cl.description}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Explore dropdown — 2 columns */}
                  {item.dropdown === 'explore' && openDropdown === 'explore' && (
                    <div className="absolute top-full left-0 mt-2 w-[380px] bg-[#1e1e1e] border border-white/[0.08] rounded-xl shadow-2xl z-50 overflow-hidden">
                      <div className="grid grid-cols-2">
                        {/* Discover */}
                        <div className="p-3 border-r border-white/[0.05]">
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-2 pb-2 font-poppins">
                            Discover
                          </p>
                          {discoverLinks.map(dl => (
                            <Link
                              key={dl.link}
                              href={dl.link}
                              className="flex items-center gap-2.5 px-2 py-2.5 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-colors duration-100 group"
                            >
                              <span className="text-gray-500 group-hover:text-defendrRed transition-colors">
                                {dl.icon}
                              </span>
                              <span className="text-sm font-medium font-poppins">{dl.title}</span>
                            </Link>
                          ))}
                        </div>
                        {/* Quick links for logged-out visitors */}
                        <div className="p-3">
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-2 pb-2 font-poppins">
                            Platform
                          </p>
                          {[
                            { title: 'About', link: '/about' },
                            { title: 'Pricing', link: '/pricing' },
                            { title: 'Academy', link: '/academy' },
                            { title: 'Contact', link: '/contact' },
                          ].map(pl => (
                            <Link
                              key={pl.link}
                              href={pl.link}
                              className="flex items-center px-2 py-2.5 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-colors duration-100 text-sm font-medium font-poppins"
                            >
                              {pl.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.title}
                  href={item.link!}
                  className="flex items-center gap-1.5 px-3 py-2 rounded text-sm font-semibold font-poppins text-gray-300 hover:text-white hover:bg-white/5 transition-colors duration-150"
                >
                  <span className="opacity-70">{item.icon}</span>
                  {item.title}
                </Link>
              ),
            )}
          </nav>
        </div>

        {/* Right: hamburger on mobile / search + auth on desktop */}
        <div className="flex items-center gap-2">
          {/* ✦ Mobile only — hamburger opens the drawer */}
          <div className="xl:hidden">
            <DropHeader showAuthButtons />
          </div>

          {/* ✦ Desktop only — search + auth buttons */}
          <div className="hidden xl:flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchActive(true)}
              className="flex items-center gap-2.5 w-52 px-3 h-9 rounded-lg bg-white/5 border border-white/10 text-gray-500 hover:bg-white/8 hover:border-white/20 hover:text-gray-400 transition-all duration-200 cursor-pointer group"
              aria-label="Open search"
            >
              <Search className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="text-sm font-poppins flex-1 text-left">Search...</span>
              <kbd className="text-[10px] font-mono text-gray-600 bg-white/5 border border-white/8 px-1.5 py-0.5 rounded group-hover:text-gray-500 transition-colors">
                ⌘K
              </kbd>
            </button>
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-semibold font-poppins rounded-lg border border-white/20 text-white hover:bg-white/5 hover:border-white/30 transition-all duration-150 whitespace-nowrap"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 text-sm font-semibold font-poppins rounded-lg bg-defendrRed text-white hover:bg-defendrRed/90 transition-colors duration-150 whitespace-nowrap"
            >
              Sign up
            </Link>
          </div>
        </div>
      </nav>

      {searchActive && (
        <div className="fixed inset-0 bg-black/80 z-[999999] flex items-center justify-center p-4">
          <SearchCard
            value={searchValue}
            onChange={setSearchValue}
            onClose={() => setSearchActive(false)}
          />
        </div>
      )}
    </header>
  )
}

export default NavBarAccount
