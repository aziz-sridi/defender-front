import {
  User,
  IdCard,
  BadgeDollarSign,
  Shield,
  Bell,
  Gamepad2,
  MessageCircle,
  Globe,
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

const NavButton: React.FC<{
  label: string
  active?: boolean
  onClick?: () => void
  icon: React.ElementType
}> = ({ label, active = false, onClick, icon: Icon }) => (
  <button
    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
      active
        ? 'bg-[#D62555] text-white shadow-md shadow-[#D62555]/25'
        : 'text-gray-400 hover:text-white hover:bg-white/5'
    }`}
    onClick={onClick}
  >
    <Icon className="shrink-0 w-[18px] h-[18px]" />
    <span className="text-left">{label}</span>
  </button>
)

export const UserSidebar: React.FC<{
  items: { id: string; label: string }[]
  activeId: string
  onItemClick?: (id: string) => void
  user: any
}> = ({ activeId, onItemClick, user }) => {
  return (
    <div className="flex flex-col gap-6 sticky top-24">
      {/* User avatar */}
      <div className="flex flex-col items-center gap-2 pb-5 border-b border-white/10">
        <Avatar className="w-14 h-14" imageUrl={user.profileImage} name="A" size={56} />
        <Typo
          as="p"
          className="font-semibold text-sm"
          color="white"
          fontFamily="poppins"
          fontVariant="p3"
        >
          {user?.nickname}
        </Typo>
      </div>

      {/* Nav sections */}
      <div className="flex flex-col gap-5">
        {navSections.map(section => (
          <div key={section.header}>
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2 px-4">
              {section.header}
            </p>
            <div className="flex flex-col gap-0.5">
              {section.items.map(item => (
                <NavButton
                  key={item.id}
                  active={activeId === item.id}
                  icon={item.icon}
                  label={item.label}
                  onClick={() => onItemClick?.(item.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
