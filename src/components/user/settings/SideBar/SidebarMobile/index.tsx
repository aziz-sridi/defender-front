import { useRouter } from 'next/navigation'
import {
  User,
  IdCard,
  BadgeDollarSign,
  Shield,
  Bell,
  Gamepad2,
  MessageCircle,
  Globe,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react'

import Avatar from '@/components/avatar'
import Typo from '@/components/ui/Typo'

const navSections = [
  {
    header: 'User Settings',
    items: [
      { id: 'My Account', label: 'My Account', icon: User },
      { id: 'Profile', label: 'Profile', icon: IdCard },
      { id: 'Subscription', label: 'Subscription', icon: BadgeDollarSign },
    ],
  },
  {
    header: 'Security',
    items: [{ id: 'Security', label: 'Security', icon: Shield }],
  },
  {
    header: 'App Settings',
    items: [
      { id: 'Notification', label: 'Notification', icon: Bell },
      { id: 'Game-accounts', label: 'Game Accounts', icon: Gamepad2 },
      { id: 'Chat', label: 'Chat', icon: MessageCircle },
      { id: 'Language', label: 'Language', icon: Globe },
    ],
  },
]

interface UserSidebarMobileProps {
  authenticatedUserId: string | null
  items: any[]
  activeId: string
  onItemClick: (id: string) => void
  innerRef?: React.RefObject<HTMLDivElement | null>
  user: any
}

export const UserSidebarMobile: React.FC<UserSidebarMobileProps> = ({
  authenticatedUserId,
  activeId,
  onItemClick,
  user,
}) => {
  const router = useRouter()

  return (
    <div className="flex flex-col gap-5">
      {/* User card */}
      <div className="flex items-center gap-3 bg-[#212529] rounded-2xl p-4">
        <Avatar className="w-12 h-12 shrink-0" imageUrl={user.profileImage} name="A" size={48} />
        <div className="flex-1 min-w-0">
          <Typo
            as="p"
            className="font-semibold text-sm truncate"
            color="white"
            fontFamily="poppins"
          >
            {user?.nickname}
          </Typo>
          <button
            className="flex items-center gap-1 text-[#D62555] text-xs font-medium mt-0.5"
            onClick={() => {
              if (authenticatedUserId) {
                router.push(`/user/${authenticatedUserId}/profile`)
              }
            }}
          >
            <ArrowLeft className="w-3 h-3" />
            Back to profile
          </button>
        </div>
      </div>

      {/* Nav sections */}
      <div className="flex flex-col gap-4">
        {navSections.map(section => (
          <div key={section.header}>
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2 px-1">
              {section.header}
            </p>
            <div className="flex flex-col gap-1">
              {section.items.map(item => {
                const Icon = item.icon
                const active = activeId === item.id
                return (
                  <button
                    key={item.id}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      active
                        ? 'bg-[#D62555] text-white'
                        : 'bg-[#212529] text-gray-400 hover:text-white active:bg-[#2c3036]'
                    }`}
                    onClick={() => onItemClick(item.id)}
                  >
                    <Icon className="shrink-0 w-5 h-5" />
                    <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
                    <ChevronRight className="w-4 h-4 opacity-40" />
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
