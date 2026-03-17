'use client'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

import SearchCard from '@/components/home/Navbar/SearchCard'
import CalendarEmpty from '@/components/ui/Icons/CalendarEmpty'
import Game from '@/components/ui/Icons/Game'
import Home from '@/components/ui/Icons/Home'
import Logout from '@/components/ui/Icons/Logout'
import Org from '@/components/ui/Icons/Org'
import Plus from '@/components/ui/Icons/Plus'
import Search from '@/components/ui/Icons/Search'
import Settings from '@/components/ui/Icons/Settings'
import Team from '@/components/ui/Icons/Team'
import Trophy from '@/components/ui/Icons/Trophy'
import TrophyMini from '@/components/ui/Icons/TrophyMini'
import Users from '@/components/ui/Icons/Users'
import Blog from '@/components/ui/Icons/Blog'
import Building from '@/components/ui/Icons/Building'
import NotificationBell from '@/components/notifications'
import { getJoinedOrganizations, getAllOrganizations } from '@/services/organizationService'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  userImageSanitizer,
  organizerImageSanitizer,
  DEFAULT_IMAGES,
} from '@/utils/imageUrlSanitizer'
import type { User } from '@/types/userType'

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

const discoverLinks = [
  { title: 'Tournaments', link: '/tournaments', icon: <TrophyMini /> },
  { title: 'Organizations', link: '/organizations', icon: <Org /> },
  { title: 'Games', link: '/games', icon: <Game /> },
  { title: 'Events', link: '/events', icon: <CalendarEmpty /> },
]

const mySpaceLinks = [
  { title: 'My Tournaments', link: '/myTournaments', icon: <TrophyMini /> },
  { title: 'My Organization', link: '/myorganization', icon: <Org /> },
  { title: 'Teams', link: '/team', icon: <Team /> },
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

// Logged-in main nav
const navItems = [
  { title: 'Home', link: '/', icon: <Home /> },
  { title: 'Create', dropdown: 'create', icon: <Plus /> },
  { title: 'Explore', dropdown: 'explore', icon: <Building /> },
  { title: 'Blogs', link: '/blogs', icon: <Blog /> },
  { title: 'Pricing', link: '/pricing', icon: null },
]

const NavBarAccount = () => {
  const { data: session } = useSession()
  const user = session?.user as User | undefined
  const userId = session?.user?._id

  const router = useRouter()
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null)
  const [searchActive, setSearchActive] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [userOrgs, setUserOrgs] = useState<any[]>([])
  const [loadingOrgs, setLoadingOrgs] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSection, setMobileSection] = useState<string | null>(null)

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

  useEffect(() => {
    if (!userId) return
    setLoadingOrgs(true)
    Promise.all([getJoinedOrganizations(), getAllOrganizations().catch(() => [])])
      .then(([joined, all]) => {
        const withRoles = ((joined || []) as any[]).map((org: any) => {
          const myStaff = org?.staff?.find((s: any) => {
            const sid = typeof s.user === 'string' ? s.user : s.user?._id || s.user?.id
            return sid === userId
          })
          return { ...org, role: myStaff?.role || org.role || 'Member' }
        })
        const founded = (Array.isArray(all) ? all : [])
          .filter((o: any) => {
            const cb = typeof o.createdBy === 'string' ? o.createdBy : o.createdBy?._id
            return cb === userId
          })
          .map((o: any) => ({ ...o, role: 'Founder' }))
        const map = new Map<string, any>()
        for (const o of [...withRoles, ...founded])
          map.set(String(o._id), { ...map.get(String(o._id)), ...o })
        setUserOrgs(Array.from(map.values()))
      })
      .catch(() => setUserOrgs([]))
      .finally(() => setLoadingOrgs(false))
  }, [userId])

  const isFounder = userOrgs.some(o => ['Founder', 'Owner', 'founder', 'owner'].includes(o.role))

  const profileMenuItems = [
    { label: 'Profile', icon: Users, href: userId ? `/user/${userId}/profile` : '/' },
    { label: 'My Tournaments', icon: Trophy, href: '/myTournaments' },
    { label: 'My Team', icon: Team, href: userId ? `/user/${userId}/profile?tab=Teams` : '/' },
    { label: 'Settings', icon: Settings, href: userId ? `/user/${userId}/settings` : '/' },
  ]

  const handleSignOut = () => {
    if (typeof window !== 'undefined' && (window as any).__defendrSignOut) {
      ;(window as any).__defendrSignOut()
    }
    signOut({ callbackUrl: '/' })
  }

  return (
    <header className="w-full relative z-[999999]">
      <nav className="w-full px-4 lg:px-6 2xl:px-20 py-3 lg:py-4 flex justify-between items-center bg-[#161616] relative">
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

          {/* Desktop nav links */}
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
                    className={`flex items-center gap-1.5 px-3 py-2 rounded text-sm font-semibold font-poppins transition-colors duration-150 ${openDropdown === item.dropdown ? 'text-white bg-white/5' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}
                  >
                    <span className="opacity-70">{item.icon}</span>
                    {item.title}
                    <Chevron open={openDropdown === item.dropdown} />
                  </button>

                  {/* Create dropdown */}
                  {item.dropdown === 'create' && openDropdown === 'create' && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-[#1e1e1e] border border-white/8 rounded-xl shadow-2xl z-[999999] py-1.5">
                      {createLinks
                        .filter(cl => !(cl.title === 'Organization' && isFounder))
                        .map(cl => (
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
                    <div className="absolute top-full left-0 mt-2 w-[400px] bg-[#1e1e1e] border border-white/8 rounded-xl shadow-2xl z-[999999] overflow-hidden">
                      <div className="grid grid-cols-2">
                        <div className="p-3 border-r border-white/5">
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
                        <div className="p-3">
                          <p className="text-[10px] font-bold text-defendrRed/70 uppercase tracking-widest px-2 pb-2 font-poppins">
                            My Space
                          </p>
                          {mySpaceLinks.map(ml => (
                            <Link
                              key={ml.link}
                              href={ml.link}
                              className="flex items-center gap-2.5 px-2 py-2.5 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-colors duration-100 group"
                            >
                              <span className="text-gray-500 group-hover:text-defendrRed transition-colors">
                                {ml.icon}
                              </span>
                              <span className="text-sm font-medium font-poppins">{ml.title}</span>
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

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Search — same trigger style as logged-out header */}
          <div className="relative hidden xl:flex items-center">
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
          </div>

          {/* Red Coin balance */}
          <div
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-defendrRed/25 bg-black/20 cursor-default"
            title="this is your red points points keep them you'll spend soon enough"
          >
            <Image
              src="https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/uploads/redcoin.png"
              alt="Red Coin"
              width={18}
              height={18}
              className="w-4.5 h-4.5"
            />
            <span className="text-sm font-semibold text-defendrRed font-poppins tabular-nums">
              {session?.user?.redPoints || 0}
            </span>
          </div>

          {/* Notifications */}
          <div className="relative">{userId ? <NotificationBell userId={userId} /> : null}</div>

          {/* Avatar + profile dropdown */}
          <div className="relative" onMouseEnter={() => enter('profile')} onMouseLeave={leave}>
            {/* Avatar — single click = show dropdown, double click = go to profile */}
            <button
              className="relative focus:outline-none group/avatar"
              aria-label="Account menu"
              onClick={() => {
                if (window.innerWidth >= 1024) {
                  // Toggle dropdown on single click (desktop)
                  setOpenDropdown(prev => (prev === 'profile' ? null : 'profile'))
                } else {
                  setMobileMenuOpen(true)
                }
              }}
              onDoubleClick={() => {
                if (window.innerWidth >= 1024 && userId) {
                  router.push(`/user/${userId}/profile`)
                }
              }}
            >
              <Avatar className="w-9 h-9 ring-2 ring-transparent hover:ring-defendrRed transition-all duration-200 cursor-pointer">
                <AvatarImage
                  src={userImageSanitizer(session?.user?.profileImage || '', DEFAULT_IMAGES.USER)}
                  alt={session?.user?.nickname || 'User'}
                />
                <AvatarFallback className="bg-gray-700 text-white text-sm font-semibold">
                  {session?.user?.nickname?.charAt(0)?.toUpperCase() ||
                    session?.user?.email?.charAt(0)?.toUpperCase() ||
                    'U'}
                </AvatarFallback>
              </Avatar>

              {/* Mobile-only hamburger badge */}
              <span className="lg:hidden absolute -bottom-1 -right-1 w-4 h-4 bg-defendrRed rounded-full flex items-center justify-center shadow-md">
                <svg
                  className="w-2.5 h-2.5 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  viewBox="0 0 16 16"
                >
                  <line x1="2" y1="4" x2="14" y2="4" />
                  <line x1="2" y1="8" x2="14" y2="8" />
                  <line x1="2" y1="12" x2="14" y2="12" />
                </svg>
              </span>

              {/* Desktop-only chevron — bottom-right corner, hints dropdown */}
              <span className="hidden lg:flex absolute -bottom-1 -right-1 w-4 h-4 bg-defendrRed rounded-sm items-center justify-center shadow-md shadow-red-900/50 transition-transform duration-200 group-hover/avatar:scale-110">
                <svg
                  className={`w-2.5 h-2.5 text-white transition-transform duration-200 ${openDropdown === 'profile' ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </button>

            {/* Desktop profile dropdown */}
            {openDropdown === 'profile' && (
              <div className="absolute right-0 top-full mt-2.5 w-64 bg-[#1e1e1e] border border-white/8 rounded-xl shadow-2xl z-[999999] py-1.5 hidden lg:block">
                {/* User info */}
                <div className="px-4 py-3 border-b border-white/5">
                  <p className="text-sm font-semibold text-white font-poppins truncate">
                    {session?.user?.nickname ||
                      session?.user?.fullname ||
                      session?.user?.email?.split('@')[0] ||
                      'User'}
                  </p>
                  <p className="text-xs text-gray-500 font-poppins truncate mt-0.5">
                    {session?.user?.email}
                  </p>
                </div>

                {/* Profile links */}
                <div className="py-1.5">
                  {profileMenuItems.map(({ label, icon: Icon, href }) => (
                    <Link
                      key={label}
                      href={href}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors duration-100 font-poppins"
                    >
                      <Icon className="w-4 h-4 opacity-60" /> {label}
                    </Link>
                  ))}
                </div>

                {/* My Orgs */}
                {userOrgs.length > 0 && (
                  <div className="border-t border-white/5 py-1.5">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-4 py-1.5 font-poppins">
                      My Organizations
                    </p>
                    <div className="max-h-28 overflow-y-auto">
                      {userOrgs.map(org => (
                        <Link
                          key={org._id}
                          href={`/organization/${org._id}/Profile`}
                          className="flex items-center gap-2.5 px-4 py-2 hover:bg-white/5 transition-colors duration-100 group"
                        >
                          <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
                            <Image
                              alt={org.name}
                              width={24}
                              height={24}
                              src={organizerImageSanitizer(
                                org.logo || org.profileImage || '',
                                DEFAULT_IMAGES.ORGANIZATION,
                              )}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-sm text-gray-300 group-hover:text-white font-poppins truncate">
                            {org.name}
                          </span>
                          <span className="ml-auto text-[10px] text-gray-600 flex-shrink-0">
                            {['Founder', 'Owner'].includes(org.role) ? 'Founder' : 'Member'}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sign out */}
                <div className="border-t border-white/5 py-1.5">
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors duration-100 w-full font-poppins"
                  >
                    <Logout className="w-4 h-4" /> Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ─── MOBILE FULL-SCREEN DRAWER (logged in) ─── */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/70 z-[999997]"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-[#181818] z-[999998] flex flex-col shadow-2xl">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src={userImageSanitizer(session?.user?.profileImage || '', DEFAULT_IMAGES.USER)}
                    alt={session?.user?.nickname || 'User'}
                  />
                  <AvatarFallback className="bg-gray-700 text-white font-semibold">
                    {session?.user?.nickname?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-white font-poppins">
                    {session?.user?.nickname || session?.user?.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 font-poppins">{session?.user?.email}</p>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
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

            {/* Drawer body */}
            <div className="flex-1 overflow-y-auto py-3">
              {/* Navigation */}
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest px-5 pb-2 font-poppins">
                Navigation
              </p>
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-5 py-3 text-gray-300 hover:text-white hover:bg-white/5 transition-colors font-poppins text-sm font-medium"
              >
                <Home /> Home
              </Link>
              <Link
                href="/blogs"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-5 py-3 text-gray-300 hover:text-white hover:bg-white/5 transition-colors font-poppins text-sm font-medium"
              >
                <Blog /> Blogs
              </Link>

              {/* Discover section */}
              <button
                className="flex items-center justify-between w-full px-5 py-3 text-gray-300 hover:text-white hover:bg-white/5 transition-colors font-poppins text-sm font-medium"
                onClick={() => setMobileSection(mobileSection === 'explore' ? null : 'explore')}
              >
                <span className="flex items-center gap-3">
                  <Building />
                  Explore
                </span>
                <Chevron open={mobileSection === 'explore'} />
              </button>
              {mobileSection === 'explore' && (
                <div className="bg-white/3 border-l-2 border-defendrRed/30 ml-5 mr-3 rounded-r-lg mb-1">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-4 pt-3 pb-1 font-poppins">
                    Discover
                  </p>
                  {discoverLinks.map(dl => (
                    <Link
                      key={dl.link}
                      href={dl.link}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white transition-colors font-poppins text-sm"
                    >
                      <span className="opacity-60">{dl.icon}</span>
                      {dl.title}
                    </Link>
                  ))}
                  <p className="text-[10px] font-bold text-defendrRed/70 uppercase tracking-widest px-4 pt-3 pb-1 font-poppins">
                    My Space
                  </p>
                  {mySpaceLinks.map(ml => (
                    <Link
                      key={ml.link}
                      href={ml.link}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white transition-colors font-poppins text-sm"
                    >
                      <span className="opacity-60">{ml.icon}</span>
                      {ml.title}
                    </Link>
                  ))}
                </div>
              )}

              {/* Create section */}
              <button
                className="flex items-center justify-between w-full px-5 py-3 text-gray-300 hover:text-white hover:bg-white/5 transition-colors font-poppins text-sm font-medium"
                onClick={() => setMobileSection(mobileSection === 'create' ? null : 'create')}
              >
                <span className="flex items-center gap-3">
                  <Plus />
                  Create
                </span>
                <Chevron open={mobileSection === 'create'} />
              </button>
              {mobileSection === 'create' && (
                <div className="bg-white/3 border-l-2 border-defendrRed/30 ml-5 mr-3 rounded-r-lg mb-1">
                  {createLinks
                    .filter(cl => !(cl.title === 'Organization' && isFounder))
                    .map(cl => (
                      <Link
                        key={cl.link}
                        href={cl.link}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-start gap-3 px-4 py-3 text-gray-300 hover:text-white transition-colors"
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

              {/* Account section */}
              <div className="mt-2 border-t border-white/5 pt-3">
                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest px-5 pb-2 font-poppins">
                  Account
                </p>
                {profileMenuItems.map(({ label, icon: Icon, href }) => (
                  <Link
                    key={label}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-5 py-3 text-gray-300 hover:text-white hover:bg-white/5 transition-colors font-poppins text-sm font-medium"
                  >
                    <Icon className="w-4 h-4 opacity-60" /> {label}
                  </Link>
                ))}
              </div>

              {/* My Orgs on mobile */}
              {userOrgs.length > 0 && (
                <div className="mt-2 border-t border-white/5 pt-3">
                  <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest px-5 pb-2 font-poppins">
                    My Organizations
                  </p>
                  {userOrgs.map(org => (
                    <Link
                      key={org._id}
                      href={`/organization/${org._id}/Profile`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-5 py-3 text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
                        <Image
                          alt={org.name}
                          width={28}
                          height={28}
                          src={organizerImageSanitizer(
                            org.logo || org.profileImage || '',
                            DEFAULT_IMAGES.ORGANIZATION,
                          )}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium font-poppins">{org.name}</p>
                        <p className="text-xs text-gray-500 font-poppins">
                          {['Founder', 'Owner'].includes(org.role) ? 'Founder' : 'Member'}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Drawer footer — sign out */}
            <div className="border-t border-white/5 px-5 py-4">
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  handleSignOut()
                }}
                className="flex items-center gap-3 text-sm text-red-400 hover:text-red-300 transition-colors font-poppins w-full"
              >
                <Logout className="w-4 h-4" /> Sign out
              </button>
            </div>
          </div>
        </>
      )}

      {/* Search modal */}
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
