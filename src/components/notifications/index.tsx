'use client'
import { Fragment, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Bell,
  X,
  CheckCheck,
  Users,
  Trophy,
  Star,
  MessageSquare,
  Gift,
  AlertCircle,
  Clock,
} from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

import { useNotifications } from '@/hooks/useNotifications'
import Typo from '@/components/ui/Typo'
import Button from '@/components/ui/Button'
import type { Notification } from '@/types/notificationType'
import {
  acceptOrganizationInvitation,
  declineOrganizationInvitation,
} from '@/services/organizationService'
import { acceptTeamInvitation, declineTeamInvitation } from '@/services/teamService'
import PlayerInvitedOpinionButtons from '../tournament/tournamentJoin/player-invited-opinion-buttons'

// ─── Notification type → icon + accent colour ─────────────────────────────
const TYPE_META: Record<string, { icon: React.ReactNode; accent: string; label: string }> = {
  team_invitation: { icon: <Users size={14} />, accent: 'bg-blue-500', label: 'Team invite' },
  organization_invitation: {
    icon: <Users size={14} />,
    accent: 'bg-purple-500',
    label: 'Org invite',
  },
  team_request: { icon: <Users size={14} />, accent: 'bg-blue-400', label: 'Team request' },
  user_request: { icon: <Users size={14} />, accent: 'bg-blue-400', label: 'Join request' },
  team_enrolled: { icon: <Users size={14} />, accent: 'bg-green-500', label: 'Enrolled' },
  red_points: { icon: <Star size={14} />, accent: 'bg-yellow-500', label: 'Red coins' },
  prize: { icon: <Gift size={14} />, accent: 'bg-yellow-400', label: 'Prize' },
  ticket: { icon: <Trophy size={14} />, accent: 'bg-orange-500', label: 'Ticket' },
  check_in: { icon: <CheckCheck size={14} />, accent: 'bg-green-500', label: 'Check-in' },
  team_removed: { icon: <AlertCircle size={14} />, accent: 'bg-red-500', label: 'Removed' },
  team_rejected: { icon: <AlertCircle size={14} />, accent: 'bg-red-400', label: 'Rejected' },
  team_message: { icon: <MessageSquare size={14} />, accent: 'bg-indigo-500', label: 'Message' },
  follow: { icon: <Users size={14} />, accent: 'bg-pink-500', label: 'Follow' },
  friend_request: { icon: <Users size={14} />, accent: 'bg-pink-400', label: 'Friend request' },
  player_accept_invitation: {
    icon: <CheckCheck size={14} />,
    accent: 'bg-green-500',
    label: 'Accepted',
  },
  player_confirm_accept_invitation: {
    icon: <CheckCheck size={14} />,
    accent: 'bg-green-400',
    label: 'Confirmed',
  },
  player_reject_invitation: { icon: <X size={14} />, accent: 'bg-red-500', label: 'Rejected' },
}

const getTypeMeta = (type?: string) =>
  type && TYPE_META[type]
    ? TYPE_META[type]
    : { icon: <Bell size={14} />, accent: 'bg-gray-500', label: 'Notification' }

const TypesToImages: Record<string, string> = {
  friend_request: 'https://defendr.gg/assets/notifications/join_org_notif.jpg',
  team_invitation: 'https://defendr.gg/assets/notifications/join_org_notif.jpg',
  follow: 'https://defendr.gg/assets/notifications/join_org_notif.jpg',
  team_enrolled: 'https://defendr.gg/assets/notifications/join_org_notif.jpg',
  team_request: 'https://defendr.gg/assets/notifications/join_org_notif.jpg',
  user_request: 'https://defendr.gg/assets/notifications/join_org_notif.jpg',
  accept_organization_invitation: 'https://defendr.gg/assets/notifications/join_org_notif.jpg',
  organization_invitation: 'https://defendr.gg/assets/notifications/join_org_notif.jpg',
}

function formatRelativeTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString()
}

export default function NotificationBell({ userId }: { userId: string }) {
  const router = useRouter()
  const { notifications, markAsRead, markAllAsRead, refreshNotifications } =
    useNotifications(userId)
  const { sendTest } = useNotifications(userId)
  const [processingMap, setProcessingMap] = useState<Record<string, boolean>>({})
  const [dismissedMap, setDismissedMap] = useState<Record<string, boolean>>({})
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all')

  const setProcessing = (id: string, v: boolean) => setProcessingMap(p => ({ ...p, [id]: v }))
  const setDismissed = (id: string, v: boolean) => setDismissedMap(p => ({ ...p, [id]: v }))

  const getErrorMessage = (err: unknown, fallback = 'Something went wrong') => {
    if (typeof err === 'string') return err
    if (typeof err === 'object' && err !== null)
      return (err as { message?: string }).message || fallback
    return fallback
  }

  const getTargetFromNotification = (notif: Notification) => {
    const link = notif.acceptLink || notif.declineLink || notif.link
    if (!link) return { kind: 'unknown' as const }
    const parts = link.split('/').filter(Boolean)
    const notifType = notif.type ? notif.type.toLowerCase() : ''
    if (notifType.includes('organization') && parts[0]?.toLowerCase() === 'organization') {
      if (parts[1]?.toLowerCase().includes('accept'))
        return { kind: 'organization' as const, organizationId: parts[2], notificationId: parts[3] }
      return { kind: 'organization' as const, organizationId: parts[1], notificationId: parts[2] }
    }
    if (notifType.includes('team') && parts[0]?.toLowerCase() === 'team') {
      if (parts[1]?.toLowerCase().includes('accept'))
        return { kind: 'team' as const, teamId: parts[2], notificationId: parts[3] }
      return { kind: 'team' as const, teamId: parts[1] }
    }
    return { kind: 'unknown' as const }
  }

  const isExpired = (notif: Notification) => {
    const r = notif as unknown as { expired?: boolean; expiresAt?: string; expireAt?: string }
    if (r.expired === true) return true
    const maybe = r.expiresAt || r.expireAt
    if (maybe) {
      const d = new Date(maybe)
      if (!isNaN(d.getTime())) return Date.now() > d.getTime()
    }
    return false
  }

  const handleAccept = async (notif: Notification, e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (!notif) return
    const id = notif._id
    setProcessing(id, true)
    setDismissed(id, true)
    try {
      const p = getTargetFromNotification(notif)
      if (p.kind === 'organization' && p.organizationId && p.notificationId)
        await acceptOrganizationInvitation(p.organizationId, p.notificationId)
      else if (p.kind === 'team' && p.teamId) await acceptTeamInvitation(p.teamId)
      await markAsRead(id)
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to accept invitation.'))
      setDismissed(id, false)
    } finally {
      setProcessing(id, false)
    }
  }

  const handleDecline = async (notif: Notification, e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (!notif) return
    const id = notif._id
    setProcessing(id, true)
    setDismissed(id, true)
    try {
      const p = getTargetFromNotification(notif)
      if (p.kind === 'organization' && p.organizationId && p.notificationId)
        await declineOrganizationInvitation(p.organizationId, p.notificationId)
      else if (p.kind === 'team' && p.teamId) await declineTeamInvitation(p.teamId)
      await markAsRead(id)
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to decline invitation.'))
      setDismissed(id, false)
    } finally {
      setProcessing(id, false)
    }
  }

  const unreadNotifications = notifications.filter(n => !n.seen)
  const displayNotifications = activeTab === 'all' ? notifications : unreadNotifications

  const PLAYER_TYPES = [
    'player_reject_invitation',
    'player_confirm_accept_invitation',
    'player_accept_invitation',
    'team_invitation',
  ]

  return (
    <div className="relative">
      {/* ── Bell button ── */}
      <button
        aria-label="Notifications"
        className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200 group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
        {unreadNotifications.length > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-defendrRed text-white text-[10px] font-bold px-1 rounded-full shadow-lg shadow-red-900/40 leading-none">
            {unreadNotifications.length > 99 ? '99+' : unreadNotifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Mobile backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* ── Panel ── */}
          <div className="fixed lg:absolute z-50 lg:z-[999] max-lg:left-2 max-lg:right-2 max-lg:top-16 lg:right-0 lg:top-full lg:mt-2 w-auto lg:w-[460px] rounded-2xl overflow-hidden shadow-2xl shadow-black/60 border border-white/[0.08] bg-[#111114]">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.07]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-defendrRed/15 flex items-center justify-center">
                  <Bell className="w-3.5 h-3.5 text-defendrRed" />
                </div>
                <Typo
                  as="span"
                  className="font-semibold text-white text-sm"
                  fontFamily="poppins"
                  fontVariant="p4"
                >
                  Notifications
                </Typo>
                {unreadNotifications.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded-md bg-defendrRed/15 text-defendrRed text-[10px] font-bold font-poppins">
                    {unreadNotifications.length} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadNotifications.length > 0 && (
                  <Button
                    className="w-auto px-2.5 py-1.5 rounded-lg"
                    icon={<CheckCheck size={12} />}
                    label="Mark all read"
                    textClassName="text-[11px] text-gray-400 font-poppins group-hover:text-white"
                    variant="text"
                    onClick={markAllAsRead}
                  />
                )}
                <Button
                  className="w-7 h-7 p-0 flex items-center justify-center rounded-lg"
                  icon={<X size={14} className="text-gray-500" />}
                  variant="text"
                  onClick={() => setIsOpen(false)}
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/[0.07] bg-[#0d0d10]">
              {(['all', 'unread'] as const).map(tab => (
                <button
                  key={tab}
                  className={`flex-1 py-2.5 text-xs font-semibold font-poppins transition-all duration-200 relative capitalize ${
                    activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === 'all'
                    ? `All (${notifications.length})`
                    : `Unread (${unreadNotifications.length})`}
                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-1/4 right-1/4 h-[2px] rounded-full bg-defendrRed" />
                  )}
                </button>
              ))}
            </div>

            {/* Notification list */}
            <div className="max-h-[400px] overflow-y-auto defendrScroll">
              {displayNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-14 gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-gray-600" />
                  </div>
                  <Typo as="p" className="text-gray-500" fontFamily="poppins" fontVariant="p5">
                    {activeTab === 'unread' ? 'All caught up!' : 'No notifications yet'}
                  </Typo>
                </div>
              ) : (
                displayNotifications.map(n => {
                  const isSpecificType =
                    n.type &&
                    [
                      'player_reject_invitation',
                      'player_confirm_accept_invitation',
                      'player_accept_invitation',
                      'team_invitation_to_join_tournament',
                    ].includes(n.type)

                  return (
                    <Fragment key={n._id}>
                      {isSpecificType ? (
                        <div key={n._id} className="p-2">
                          <p className="py-2" dangerouslySetInnerHTML={{ __html: n.message }}></p>
                          {n.type === 'team_invitation_to_join_tournament' && (
                            <div className="mt-2 space-x-2">
                              <PlayerInvitedOpinionButtons
                                participantId={n.link as string}
                                refreshNotifications={refreshNotifications}
                              />
                            </div>
                          )}
                        </div>
                      ) : (
                        <div
                          key={n._id}
                          className={`border-b border-border/50 p-4 text-sm cursor-pointer transition-all duration-200 hover:bg-white/5 group relative ${
                            n.seen
                              ? 'bg-notification-bg'
                              : 'bg-notification-unread-bg border-l-4 border-l-notification-unread'
                          }`}
                          onClick={() => {
                            // Robust redirect for team join requests
                            let teamId = ''
                            if (
                              (n.type === 'team_request' ||
                                n.type === 'team_invitation' ||
                                n.type === 'user_request' ||
                                (n.message &&
                                  n.message
                                    .toLowerCase()
                                    .includes('requested to join your team'))) &&
                              n.link
                            ) {
                              const parts = n.link.split('/').filter(Boolean)
                              if (parts[0] === 'team' && parts[1]) {
                                teamId = parts[1]
                              }
                              if (!teamId && n.message) {
                                const match = n.message.match(/team ['"']?([a-f0-9]{24})['"']?/i)
                                if (match?.[1]) teamId = match[1]
                              }
                              if (teamId) {
                                router.push(`/team/${teamId}/edit?tab=Members`)
                                return
                              }
                            }
                            markAsRead(n._id)
                          }}
                        >
                          {/* Unread indicator */}
                          {isUnread && (
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-8 rounded-r-full bg-defendrRed" />
                          )}

                          {/* Avatar / icon */}
                          <div className="relative flex-shrink-0">
                            <div className="w-9 h-9 rounded-xl overflow-hidden bg-white/5 flex items-center justify-center">
                              {imgSrc ? (
                                <Image
                                  unoptimized
                                  alt={n.type || 'notification'}
                                  className="object-cover w-full h-full"
                                  height={36}
                                  src={imgSrc}
                                  width={36}
                                />
                              ) : (
                                <span className="text-gray-400">{meta.icon}</span>
                              )}
                            </div>
                            {/* Type badge */}
                            <span
                              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-white ${meta.accent} shadow-md`}
                            >
                              <span className="scale-75">{meta.icon}</span>
                            </span>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            {/* Type label */}
                            <Typo
                              as="p"
                              className={`text-[10px] font-semibold uppercase tracking-wider mb-0.5 ${isUnread ? 'text-defendrRed/80' : 'text-gray-600'}`}
                              fontFamily="poppins"
                            >
                              {meta.label}
                            </Typo>
                            {/* Message */}
                            <Typo
                              as="p"
                              className={`text-xs leading-relaxed ${isUnread ? 'text-gray-200' : 'text-gray-400'}`}
                              fontFamily="poppins"
                            >
                              {n.message}
                            </Typo>

                            {/* Accept / Decline for invitations */}
                            {(n.type === 'team_invitation' ||
                              n.type === 'organization_invitation') &&
                              n.link && (
                                <div className="mt-2.5 flex items-center gap-2">
                                  {!dismissedMap[n._id] ? (
                                    <>
                                      <Button
                                        className="w-auto px-3 py-1 rounded-lg"
                                        label={processingMap[n._id] ? '···' : 'Accept'}
                                        textClassName="text-[11px] font-semibold font-poppins"
                                        variant="contained-red"
                                        disabled={!!processingMap[n._id] || isExpired(n)}
                                        onClick={e => handleAccept(n, e)}
                                      />
                                      <Button
                                        className="w-auto px-3 py-1 rounded-lg"
                                        label={processingMap[n._id] ? '···' : 'Decline'}
                                        textClassName="text-[11px] font-semibold font-poppins text-gray-300"
                                        variant="contained-dark"
                                        disabled={!!processingMap[n._id] || isExpired(n)}
                                        onClick={e => handleDecline(n, e)}
                                      />
                                    </>
                                  ) : (
                                    <Typo
                                      as="span"
                                      className="text-gray-600"
                                      fontFamily="poppins"
                                      fontVariant="p5"
                                    >
                                      Action taken
                                    </Typo>
                                  )}
                                </div>
                              )}

                            {/* Timestamp */}
                            <div className="flex items-center gap-1 mt-2">
                              <Clock size={10} className="text-gray-600" />
                              <Typo
                                as="span"
                                className="text-gray-600"
                                fontFamily="poppins"
                                fontVariant="p5"
                              >
                                {formatRelativeTime(n.createdAt)}
                              </Typo>
                            </div>
                          </div>

                          {/* Unread dot */}
                          {isUnread && (
                            <span className="flex-shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-defendrRed" />
                          )}
                        </div>
                      )}
                    </Fragment>
                  )
                })
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-4 py-2.5 border-t border-white/[0.07] bg-[#0d0d10]">
                <Typo
                  as="p"
                  className="text-center text-gray-600"
                  fontFamily="poppins"
                  fontVariant="p5"
                >
                  {notifications.length} notification{notifications.length !== 1 ? 's' : ''} total
                </Typo>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
