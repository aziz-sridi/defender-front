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
export const AVATAR_GRADIENTS = [
  'bg-gradient-to-br from-purple-500 to-pink-500',
  'bg-gradient-to-br from-blue-500 to-cyan-500',
  'bg-gradient-to-br from-green-500 to-emerald-500',
  'bg-gradient-to-br from-orange-500 to-red-500',
  'bg-gradient-to-br from-indigo-500 to-purple-500',
]
export const GRADIENTS = [
  'bg-gradient-to-br from-yellow-400 to-orange-500',
  'bg-gradient-to-br from-purple-500 to-pink-500',
  'bg-gradient-to-br from-blue-500 to-cyan-500',
  'bg-gradient-to-br from-green-500 to-emerald-500',
]
export const NAVSECTIONS = [
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
      { id: 'Game & accounts', label: 'Game & accounts', icon: Gamepad2 },
      { id: 'Chat', label: 'Chat', icon: MessageCircle },
      { id: 'Language', label: 'Language', icon: Globe },
    ],
  },
]
export const TournamentImageGradients = [
  'from-purple-500 to-blue-600',
  'from-blue-500 to-cyan-600',
  'from-green-500 to-teal-600',
  'from-orange-500 to-red-600',
  'from-pink-500 to-purple-600',
  'from-indigo-500 to-purple-600',
]
