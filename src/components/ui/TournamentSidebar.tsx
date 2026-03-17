'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Icon } from '@iconify/react'
import { AlertTriangle, Archive } from 'lucide-react'
import { toast } from 'sonner'

import Button from '@/components/ui/Button'
import Typo from '@/components/ui/Typo'
import ConfirmationModal from '@/components/ui/ConfirmationModal'
import { imageUrlSanitizer } from '@/utils/imageUrlSanitizer'
import { archiveTournament } from '@/services/tournamentService'

const useCompletionStatus = () => {
  const [completionStatus, setCompletionStatus] = useState({
    brackets: false,
    schedule: false,
  })

  useEffect(() => {
    const checkCompletionStatus = () => {
      const bracketSaved = localStorage.getItem('bracketSavedToDatabase')
      const isBracketComplete = bracketSaved === 'true'

      const scheduleSaved = localStorage.getItem('scheduleSavedToDatabase')
      const isScheduleComplete = scheduleSaved === 'true'

      setCompletionStatus(prev => {
        if (prev.brackets !== isBracketComplete || prev.schedule !== isScheduleComplete) {
          return {
            brackets: isBracketComplete,
            schedule: isScheduleComplete,
          }
        }
        return prev
      })
    }

    checkCompletionStatus()

    const handleStorageChange = () => {
      checkCompletionStatus()
    }

    window.addEventListener('storage', handleStorageChange)

    // React instantly to completion events
    const handleSetupProgress = (e: Event) => {
      const detail = (e as CustomEvent<{ step: 'brackets' | 'schedule'; done: boolean }>).detail
      if (!detail) {
        return
      }
      setCompletionStatus(prev => {
        const next = { ...prev }
        if (detail.step === 'brackets') {
          next.brackets = detail.done
        }
        if (detail.step === 'schedule') {
          next.schedule = detail.done
        }
        return next
      })
    }
    window.addEventListener('defendr-setup-progress', handleSetupProgress as EventListener)

    const interval = setInterval(checkCompletionStatus, 30000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('defendr-setup-progress', handleSetupProgress as EventListener)
      clearInterval(interval)
    }
  }, [])

  return completionStatus
}
interface ProfileSectionProps {
  profileImage?: string
  userName: string
  orgName?: string
  orgLogo?: string
  openerRole?: string
  className?: string
}

function ProfileSection({
  profileImage,
  userName,
  orgName,
  orgLogo,
  openerRole,
  className = '',
}: ProfileSectionProps) {
  return (
    <div className={`flex flex-col items-center mb-6 lg:mb-8 ${className}`}>
      {/* Organization logo if available, else fallback to user initial or image */}
      <div className="w-28 h-28 lg:w-36 lg:h-36 bg-gradient-to-br from-defendrRed to-red-600 rounded-full flex items-center justify-center mb-4 shadow-xl overflow-hidden ring-4 ring-defendrRed/20">
        {orgLogo && orgLogo.trim() !== '' ? (
          <a href={orgLogo ? '/organization' : '#'} className="block w-full h-full">
            <Image
              unoptimized
              alt={`${orgName || 'Organization'} logo`}
              className="object-cover w-full h-full"
              height={144}
              src={imageUrlSanitizer(orgLogo, 'organization')}
              width={144}
              onError={e => {
                console.log('Organization logo failed to load:', orgLogo)
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
              }}
            />
          </a>
        ) : profileImage ? (
          <Image
            unoptimized
            alt={`${userName} profile`}
            className="rounded-full object-cover"
            height={144}
            src={imageUrlSanitizer(profileImage, 'user')}
            width={144}
          />
        ) : (
          <Typo
            as="span"
            className="font-bold text-4xl lg:text-5xl"
            color="white"
            fontFamily="poppins"
            fontVariant="h1"
          >
            {(orgName || userName).charAt(0).toUpperCase()}
          </Typo>
        )}
      </div>

      {/* Organization Name */}
      {orgName && (
        <div className="text-center mb-2">
          <Typo
            as="div"
            className="text-sm text-gray-400 font-medium mb-1"
            fontFamily="poppins"
            fontVariant="p4"
          >
            Organization
          </Typo>
          <Typo
            as="h3"
            className="font-semibold text-lg lg:text-xl text-center"
            color="white"
            fontFamily="poppins"
            fontVariant="p2"
          >
            {orgName}
          </Typo>
        </div>
      )}

      {/* Tournament/User Name */}
      <div className="text-center mb-2">
        <Typo
          as="div"
          className="text-sm text-gray-400 font-medium mb-1"
          fontFamily="poppins"
          fontVariant="p4"
        >
          Tournament
        </Typo>
        <Typo
          as="h3"
          className="font-bold text-xl lg:text-2xl text-center"
          color="white"
          fontFamily="poppins"
          fontVariant="h3"
        >
          {userName}
        </Typo>
      </div>

      {/* Role Badge */}
      {openerRole && (
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-defendrRed/20 to-red-600/20 border border-defendrRed/30">
          <Typo
            as="span"
            className="text-xs font-semibold"
            color="defendrRed"
            fontFamily="poppins"
            fontVariant="p4"
          >
            {openerRole}
          </Typo>
        </div>
      )}
    </div>
  )
}

interface SidebarMenuItemProps {
  icon: React.ReactNode
  label: string
  isActive?: boolean
  isNested?: boolean
  hasChildren?: boolean
  isExpanded?: boolean
  onClick?: () => void
  className?: string
  usePoppins?: boolean
  showWarning?: boolean
  isCta?: boolean
}

const SidebarMenuItem = React.memo(function SidebarMenuItem({
  icon,
  label,
  isActive = false,
  isNested = false,
  hasChildren = false,
  isExpanded = false,
  onClick,
  className = '',
  usePoppins = false,
  showWarning = false,
  isCta = false,
}: SidebarMenuItemProps) {
  const ChevronIcon = () => (
    <svg
      className={`transition-transform ${isExpanded ? 'rotate-180' : ''} text-defendrRed`}
      fill="none"
      height="16"
      viewBox="0 0 24 24"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 9L12 15L18 9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  )

  const baseClasses =
    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 font-poppins cursor-pointer select-none ' +
    (isNested ? 'pl-8 text-sm' : 'text-sm')

  const ctaClasses =
    'relative overflow-hidden border border-white/20 font-semibold text-white drop-shadow-md cta-multicolor ' +
    'hover:scale-[1.02] hover:border-white/40 hover:shadow-lg hover:shadow-black/30 active:scale-[0.99] active:shadow-md'

  const activeClasses = isActive
    ? 'text-defendrRed bg-defendrRed/10 border-l-2 border-defendrRed font-medium'
    : 'text-gray-300 hover:text-white hover:bg-defendrLightBlack/80 hover:shadow-md hover:-translate-y-0.5'

  return (
    <>
      {isCta && (
        <style>{`
          .cta-multicolor::before {
            content: '';
            position: absolute;
            inset: 0;
            z-index: 0;
            background: linear-gradient(
              120deg,
              #a855f7 0%,
              #ec4899 20%,
              #f43f5e 35%,
              #f97316 50%,
              #eab308 65%,
              #22d3ee 80%,
              #6366f1 90%,
              #a855f7 100%
            );
            background-size: 300% 300%;
            animation: cta-multicolor-shift 4s ease-in-out infinite;
            opacity: 0.85;
          }
          .cta-multicolor::after {
            content: '';
            position: absolute;
            inset: 0;
            z-index: 0;
            background: linear-gradient(to bottom, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(0,0,0,0.2) 100%);
            pointer-events: none;
          }
          .cta-multicolor > * { position: relative; z-index: 1; }
          @keyframes cta-multicolor-shift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
        `}</style>
      )}
      <button
        className={`${baseClasses} ${isCta ? ctaClasses : activeClasses} ${className}`}
        onClick={onClick}
      >
        <span
          className={`flex-shrink-0 ${isCta ? 'text-white drop-shadow-md' : 'text-defendrRed'}`}
        >
          {icon}
        </span>
        <span className="flex-1 truncate">
          <Typo
            as="span"
            color={isActive && !isCta ? 'red' : isCta ? 'white' : 'white'}
            fontFamily={usePoppins ? 'poppins' : 'poppins'}
            fontVariant="p4"
          >
            {label}
          </Typo>
        </span>
        {showWarning && (
          <span className="flex-shrink-0 ml-1">
            <AlertTriangle className="w-4 h-4 text-yellow-500 transition-all duration-200" />
          </span>
        )}
        {hasChildren && (
          <span className="flex-shrink-0">
            <ChevronIcon />
          </span>
        )}
      </button>
    </>
  )
})

interface MenuItem {
  id: string
  label: string
  icon: React.ReactNode
  hasChildren?: boolean
  children?: MenuItem[]
}

interface TournamentSidebarProps {
  userName?: string
  profileImage?: string
  onTournamentOverview?: () => void
  onSaveDraft?: () => void
  className?: string
}

function TournamentSidebar({
  userName = 'Test',
  profileImage,
  onTournamentOverview,
  onSaveDraft,
  className = '',
}: TournamentSidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(['tournament', 'bracket-claims'])
  const [activeItem, setActiveItem] = useState<string>('information')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const completionStatus = useCompletionStatus()
  const [tid, setTid] = useState<string | null>(null)
  const [tournamentName, setTournamentName] = useState<string>('Tournament')
  const [tournamentLoading, setTournamentLoading] = useState<boolean>(false)
  const [orgHeader, setOrgHeader] = useState<{
    name?: string
    logoImage?: string
    role?: string
  } | null>(null)
  const [showArchiveModal, setShowArchiveModal] = useState<boolean>(false)
  const [isArchiving, setIsArchiving] = useState<boolean>(false)
  const [isFounder, setIsFounder] = useState<boolean>(false)
  const shouldShowWarning = (itemId: string): boolean => {
    const result = (() => {
      switch (itemId) {
        case 'brackets':
          return !completionStatus.brackets
        case 'schedule':
          return !completionStatus.schedule
        default:
          return false
      }
    })()

    return result
  }

  useEffect(() => {
    const pathToItemMap: { [key: string]: string } = {
      '/tournament/setup/info': 'information',
      '/tournament/setup/bracket': 'brackets',
      '/tournament/setup/participationSettings': 'participant-settings',
      '/tournament/setup/prizes': 'prizes',
      '/tournament/setup/rules': 'rules',
      '/tournament/setup/streaming': 'streaming',
      '/tournament/setup/tournamentSchedule': 'schedule',
      '/tournament/setup/tournamentLocation': 'location',
      '/tournament/setup/matchList': 'match-list',
      '/tournament/setup/matchProfile': 'match-list',
      '/tournament/setup/issuesAndClaims': 'issuesAndClaims',
      '/tournament/setup/bracketView': 'bracket-view',
      '/tournament/setup/feedBack': 'feedback-rating',
      '/tournament/setup/picturesUpload': 'pictures-upload',
      '/tournament/setup/manageParticipants': 'manage-participant',
      '/tournament/setup/manageWiners': 'manage-winners',
      '/tournament/setup/tournamentProgress': 'tournament-progress',
    }

    const currentItem = pathToItemMap[pathname]
    if (currentItem) {
      setActiveItem(currentItem)
    }
  }, [pathname])

  // Preserve tournament context across navigation
  // Acquire tid strictly from URL (no localStorage fallback) and fetch tournament meta
  useEffect(() => {
    const paramTid = searchParams?.get('tid')
    if (!paramTid) {
      setTid(null)
      return
    }
    setTid(paramTid)
  }, [searchParams])

  useEffect(() => {
    const loadTournament = async () => {
      if (!tid) {
        return
      }
      setTournamentLoading(true)
      try {
        const { getTournamentById } = await import('@/services/tournamentService')
        let data: unknown | null = await getTournamentById(tid)
        if (!data) {
          // fallback to internal endpoint shape
          try {
            data = await getTournamentById(tid)
          } catch {
            data = null
          }
        }
        if (data && typeof data === 'object') {
          const anyData = data as Record<string, unknown>
          const name =
            (anyData.name as string) || (anyData.tournamentName as string) || 'Tournament'
          setTournamentName(name)
        }
      } catch {
        // silent
      } finally {
        setTournamentLoading(false)
      }
    }
    void loadTournament()
  }, [tid])

  // Load organization header info captured by layout permission check
  useEffect(() => {
    try {
      const raw = localStorage.getItem('defendr:currentSetupOrg')
      if (raw) {
        const parsed = JSON.parse(raw) as {
          name?: string
          logoImage?: string
          role?: string
          id?: string
        }
        console.log('Organization data loaded:', parsed)
        setOrgHeader(parsed)
        // Check if user is a founder
        setIsFounder(parsed.role === 'Founder')
      }
    } catch {
      // ignore
    }
  }, [])

  const getPoppinsItems = () => [
    'information',
    'brackets',
    'participant settings',
    'prizes',
    'rules',
    'streaming',
    'schedule',
    'location',
    'match list',
    'issues & claims',
    'bracket view',
    'feedback & rating',
  ]

  const TournamentIcon = () => <Icon height="16" icon="mdi:tournament" width="16" />
  const BracketIcon = () => <Icon height="16" icon="mdi:tournament" width="16" />
  const PictureIcon = () => <Icon height="16" icon="mdi:image-multiple" width="16" />
  const ParticipantIcon = () => <Icon height="16" icon="mdi:account-group" width="16" />
  const WinnerIcon = () => <Icon height="16" icon="mdi:trophy" width="16" />
  const ProgressIcon = () => <Icon height="16" icon="mdi:progress-clock" width="16" />
  const InfoIcon = () => <Icon height="14" icon="mdi:information" width="14" />

  const ScheduleIcon = () => <Icon height="14" icon="mdi:calendar-clock" width="14" />
  const LocationIcon = () => <Icon height="14" icon="mdi:map-marker" width="14" />
  const StreamIcon = () => <Icon height="14" icon="mdi:video" width="14" />
  const ListIcon = () => <Icon height="14" icon="mdi:format-list-bulleted" width="14" />
  const IssueIcon = () => <Icon height="14" icon="mdi:alert-circle" width="14" />
  const FeedbackIcon = () => <Icon height="14" icon="mdi:star" width="14" />

  const menuItems: MenuItem[] = [
    {
      id: 'tournament',
      label: 'Tournament',
      icon: <TournamentIcon />,
      hasChildren: true,
      children: [
        { id: 'information', label: 'Information', icon: <InfoIcon /> },
        { id: 'brackets', label: 'Brackets', icon: <BracketIcon /> },
        { id: 'participant-settings', label: 'Participant Settings', icon: <ParticipantIcon /> },
        { id: 'prizes', label: 'Prizes', icon: <Icon height="14" icon="mdi:gift" width="14" /> },
        {
          id: 'rules',
          label: 'Rules',
          icon: <Icon height="14" icon="mdi:file-document" width="14" />,
        },
        { id: 'streaming', label: 'Streaming', icon: <StreamIcon /> },
        { id: 'schedule', label: 'Schedule', icon: <ScheduleIcon /> },
        { id: 'location', label: 'Location', icon: <LocationIcon /> },
      ],
    },
    {
      id: 'bracket-claims',
      label: 'Bracket & Claims',
      icon: <BracketIcon />,
      hasChildren: true,
      children: [
        { id: 'match-list', label: 'Match List', icon: <ListIcon /> },
        { id: 'issuesAndClaims', label: 'Issues & Claims', icon: <IssueIcon /> },
        { id: 'bracket-view', label: 'Bracket View', icon: <BracketIcon /> },
        { id: 'feedback-rating', label: 'Feedback & Rating', icon: <FeedbackIcon /> },
      ],
    },
    {
      id: 'pictures-upload',
      label: 'Pictures Upload',
      icon: <PictureIcon />,
    },
    {
      id: 'manage-participant',
      label: 'Manage Participant',
      icon: <ParticipantIcon />,
    },
    {
      id: 'manage-winners',
      label: 'Manage Winners',
      icon: <WinnerIcon />,
    },
    {
      id: 'tournament-progress',
      label: 'Tournament Progress',
      icon: <ProgressIcon />,
    },
  ]

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId],
    )
  }

  const handleItemClick = (itemId: string, hasChildren: boolean = false) => {
    if (hasChildren) {
      toggleExpanded(itemId)
    } else {
      setActiveItem(itemId)
      const navigationMap: { [key: string]: string } = {
        information: '/tournament/setup/info',
        brackets: '/tournament/setup/bracket',
        'participant-settings': '/tournament/setup/participationSettings',
        prizes: '/tournament/setup/prizes',
        rules: '/tournament/setup/rules',
        streaming: '/tournament/setup/streaming',
        schedule: '/tournament/setup/tournamentSchedule',
        location: '/tournament/setup/tournamentLocation',
        'match-list': '/tournament/setup/matchList',
        issuesAndClaims: '/tournament/setup/issuesAndClaims',
        'bracket-view': '/tournament/setup/bracketView',
        'feedback-rating': '/tournament/setup/feedBack',
        'pictures-upload': '/tournament/setup/picturesUpload',
        'manage-participant': '/tournament/setup/manageParticipants',
        'manage-winners': '/tournament/setup/manageWiners',
        'tournament-progress': '/tournament/setup/tournamentProgress',
      }

      if (navigationMap[itemId]) {
        const base = navigationMap[itemId]
        let effectiveTid = tid
        // Fallback to localStorage if tid is missing from URL
        if (!effectiveTid && typeof window !== 'undefined') {
          effectiveTid = localStorage.getItem('createdTournamentId') || ''
        }
        let target = base
        if (effectiveTid) {
          if (base.includes('matchProfile')) {
            const currentParams = new URLSearchParams(window.location.search)
            const matchId = currentParams.get('matchId')
            if (matchId) {
              target = `/tournament/setup/matchProfile?matchId=${encodeURIComponent(matchId)}&tid=${encodeURIComponent(effectiveTid)}`
            } else {
              target = `${base}?tid=${encodeURIComponent(effectiveTid)}`
            }
          } else {
            target = `${base}?tid=${encodeURIComponent(effectiveTid)}`
          }
        }
        router.push(target)
      }
    }
  }

  const handleArchiveTournament = async () => {
    if (!tid) {
      toast.error('No tournament ID found')
      return
    }

    setIsArchiving(true)
    try {
      await archiveTournament(tid)
      toast.success('Tournament archived successfully')
      setShowArchiveModal(false)
      // Redirect to tournaments page or home after archiving
      router.push('/tournaments')
    } catch (error) {
      console.error('Error archiving tournament:', error)
      toast.error('Failed to archive tournament. Please try again.')
    } finally {
      setIsArchiving(false)
    }
  }

  return (
    <div
      className={`w-72 lg:w-80 xl:w-[23rem] bg-defendrLightBlack min-h-screen p-5 lg:p-7 flex flex-col shadow-xl ${className}`}
    >
      <ProfileSection
        profileImage={profileImage}
        userName={tournamentLoading ? 'Loading...' : tournamentName || userName}
        orgLogo={orgHeader?.logoImage}
        orgName={orgHeader?.name}
        openerRole={orgHeader?.role}
      />

      <div className="mb-6 lg:mb-8 flex flex-col items-center gap-3">
        <Button
          className="font-poppins w-56 justify-center"
          label="Tournament Overview"
          size="s"
          type="button"
          variant="outlined-red"
          onClick={() => {
            // If a tournament id exists in URL, open its public overview in a new tab
            try {
              const sp = new URLSearchParams(window.location.search)
              const tid = sp.get('tid')
              if (tid) {
                window.open(`/tournament/${encodeURIComponent(tid)}?tab=overview`, '_blank')
                return
              }
            } catch {
              // fallback
            }
            onTournamentOverview?.()
          }}
        />
        <Button
          className="font-poppins w-56 justify-center"
          label="Save Draft"
          size="s"
          type="button"
          variant="outlined-grey"
          onClick={onSaveDraft}
        />
        {isFounder && (
          <Button
            className="font-poppins w-56 justify-center"
            label="Archive Tournament"
            size="s"
            type="button"
            variant="outlined-red"
            onClick={() => setShowArchiveModal(true)}
            icon={<Archive className="w-4 h-4" />}
          />
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden">
        {menuItems.map(item => (
          <div
            key={item.id}
            className={item.id === 'tournament-progress' ? 'overflow-hidden rounded-lg' : ''}
          >
            <SidebarMenuItem
              hasChildren={item.hasChildren}
              icon={item.icon}
              isActive={activeItem === item.id}
              isCta={item.id === 'tournament-progress'}
              isExpanded={expandedItems.includes(item.id)}
              label={item.label}
              usePoppins={false}
              onClick={() => handleItemClick(item.id, item.hasChildren)}
            />

            {item.hasChildren && expandedItems.includes(item.id) && item.children && (
              <div className="mt-1 space-y-1">
                {item.children.map(child => (
                  <SidebarMenuItem
                    key={child.id}
                    isNested
                    icon={child.icon}
                    isActive={activeItem === child.id}
                    label={child.label}
                    showWarning={shouldShowWarning(child.id)}
                    usePoppins={getPoppinsItems().includes(child.label.toLowerCase())}
                    onClick={() => handleItemClick(child.id)}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Archive Confirmation Modal */}
      <ConfirmationModal
        isOpen={showArchiveModal}
        onClose={() => setShowArchiveModal(false)}
        onConfirm={handleArchiveTournament}
        title="Archive Tournament"
        message={`Are you sure you want to archive "${tournamentName}"? This action cannot be undone and will remove the tournament from public view.`}
        confirmText="Archive Tournament"
        cancelText="Cancel"
        variant="danger"
        isLoading={isArchiving}
      />
    </div>
  )
}

interface TournamentLayoutProps {
  children: React.ReactNode
  userName?: string
  profileImage?: string
  onTournamentOverview?: () => void
  onSaveDraft?: () => void
}

export default function TournamentLayout({
  children,
  userName,
  profileImage,
  onTournamentOverview,
  onSaveDraft,
}: TournamentLayoutProps) {
  const [isNested, setIsNested] = useState<boolean | null>(null)

  useEffect(() => {
    const roots = document.querySelectorAll('[data-tournament-layout-root]')
    setIsNested(roots.length > 0)
  }, [])
  const handleTournamentOverview = () => {
    if (onTournamentOverview) {
      onTournamentOverview()
    }
  }

  const handleSaveDraft = () => {
    if (onSaveDraft) {
      onSaveDraft()
    }
  }

  if (isNested === null) {
    return <>{children}</>
  }
  if (isNested) {
    return <>{children}</>
  }

  return (
    <div data-tournament-layout-root className="flex bg-defendrBg w-full">
      <div className="hidden lg:block">
        <TournamentSidebar
          profileImage={profileImage}
          userName={userName}
          onSaveDraft={handleSaveDraft}
          onTournamentOverview={handleTournamentOverview}
        />
      </div>
      <div className="lg:hidden" />

      <main className="flex-1 p-4 lg:p-10 overflow-x-hidden">{children}</main>
    </div>
  )
}
