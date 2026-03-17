import { getTournamentById } from '@/services/tournamentService'
import { Tournament } from '@/types/tournamentType'
import NotFound from '@/app/not-found'
import Image from 'next/image'
import {
  ArrowUpRight,
  Calendar,
  ChevronRight,
  CircleCheckBig,
  Clock,
  DollarSign,
  Earth,
  Eye,
  Gamepad2,
  Globe,
  LaptopMinimal,
  LucideProps,
  MessageCircle,
  Network,
  Plus,
  Swords,
  Trophy,
  User,
  UsersRound,
} from 'lucide-react'
import Link from 'next/link'
import DiscordAlt from '@/components/ui/Icons/DiscordAlt'
import Button from '@/components/ui/Button'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/api/auth'
import { cn } from '@/lib/utils'
import FollowOrganizationButton from '@/components/tournament/FollowOrganizationButton'
import { ReactNode } from 'react'
import TimeLineRegisterbtn from '@/components/tournament/tournamentJoin/register-btn-timeline'
import WinnerCard from '@/components/tournament/tournamentJoin/winner-card'
import { getGameImageUrl, imageUrlSanitizer } from '@/utils/imageUrlSanitizer'
import { getGameById } from '@/services/gameService'

/** Resolve game cover: IGDB → sanitized coverImage → local name map → default */
const getGameCoverImage = (game: any): string => {
  // 1. Try IGDB cover (most reliable)
  const igdbUrl = getGameImageUrl(game, '')
  if (igdbUrl) return igdbUrl

  // 2. Try the coverImage field after sanitizing
  const cover = imageUrlSanitizer(game?.coverImage || '', 'general', '')
  if (cover) return cover

  // 3. Local name-based fallback map
  const name = (game?.name || '').toLowerCase().trim()
  const map: Record<string, string> = {
    // League of Legends
    'league of legends': '/assets/newHome/games/1.png',
    lol: '/assets/newHome/games/1.png',
    league: '/assets/newHome/games/1.png',

    // Valorant
    valorant: '/assets/newHome/games/2.png',
    val: '/assets/newHome/games/2.png',

    // Fortnite
    fortnite: '/assets/newHome/games/3.png',
    'fortnite battle royale': '/assets/newHome/games/3.png',

    // Counter-Strike
    'counter-strike': '/assets/newHome/games/4.png',
    'counter strike': '/assets/newHome/games/4.png',
    'cs:go': '/assets/newHome/games/4.png',
    csgo: '/assets/newHome/games/4.png',
    cs: '/assets/newHome/games/4.png',
    cs2: '/assets/newHome/games/4.png',

    // Dota 2
    'dota 2': '/assets/newHome/games/5.png',
    dota: '/assets/newHome/games/5.png',

    // Apex Legends
    'apex legends': '/assets/newHome/games/2.png',
    apex: '/assets/newHome/games/2.png',

    // Overwatch
    overwatch: '/assets/newHome/games/3.png',
    'overwatch 2': '/assets/newHome/games/3.png',

    // Rocket League
    'rocket league': '/assets/newHome/games/4.png',

    // FIFA / EA Sports FC
    fifa: '/assets/newHome/games/5.png',
    'fifa 24': '/assets/newHome/games/5.png',
    'fifa 25': '/assets/newHome/games/5.png',
    'fifa 26': '/assets/newHome/games/5.png',
    'ea sports fc': '/assets/images/game.jpg',
    'ea sports fc 25': '/assets/images/game.jpg',
    'ea fc 25': '/assets/images/game.jpg',
    'fc 25': '/assets/images/game.jpg',
    'ea sports fc 26': '/assets/images/game.jpg',
    'ea fc 26': '/assets/images/game.jpg',
    'fc 26': '/assets/images/game.jpg',

    // Call of Duty
    'call of duty': '/assets/newHome/games/1.png',
    cod: '/assets/newHome/games/1.png',

    // PUBG
    pubg: '/assets/newHome/games/2.png',
    "playerunknown's battlegrounds": '/assets/newHome/games/2.png',

    // Mobile Legends: Bang Bang
    'mobile legends: bang bang': '/mobileLegend.png',
    'mobile legends': '/mobileLegend.png',
    'mobile legends bang bang': '/mobileLegend.png',
    'mobile legend': '/mobileLegend.png',
    mlbb: '/mobileLegend.png',

    // Mortal Kombat
    'mortal kombat 11': '/assets/images/game.jpg',
    'mortal kombat': '/assets/images/game.jpg',
    mk11: '/assets/images/game.jpg',

    // 2XKO (Riot fighting game)
    '2xko': '/assets/images/game.jpg',

    // Tekken
    tekken: '/assets/images/game.jpg',
    'tekken 8': '/assets/images/game.jpg',
    'tekken 7': '/assets/images/game.jpg',

    // eFootball
    efootball: '/assets/images/game.jpg',
    'efootball 2024': '/assets/images/game.jpg',
    'efootball 2025': '/assets/images/game.jpg',
  }

  if (map[name]) return map[name]
  for (const [key, img] of Object.entries(map)) {
    if (name.includes(key) || key.includes(name)) return img
  }

  // 4. Ultimate fallback
  return '/assets/images/default-team-icon.jpg'
}

const TournamentOverview = async ({ params }: { params: Promise<{ id: string }> }) => {
  const session = await getServerSession(authOptions)
  const { id } = await params
  const tournament: Tournament = await getTournamentById(id)
  if (!tournament) {
    return NotFound()
  }

  // Fetch full game data (with IGDB cover) — same source the /games page uses
  let fullGame: any = null
  try {
    if (tournament.game?._id) {
      fullGame = await getGameById(tournament.game._id)
    }
  } catch {
    // Fallback to partial tournament.game if fetch fails
  }

  const now = new Date()
  const gameInfo = [
    {
      icon: ({ ...props }: LucideProps) => <Gamepad2 {...props} />,
      label: 'Game mode',
      value: tournament.gameMode,
    },
    {
      icon: ({ ...props }: LucideProps) => <LaptopMinimal {...props} />,
      label: 'Platform',
      value: tournament.game.platforms?.join(', ') || 'N/A',
    },
    {
      icon: ({ ...props }: LucideProps) => <Globe {...props} />,
      label: 'Server',
      value: tournament.gameSettings?.server || 'N/A',
    },
    {
      icon: ({ ...props }: LucideProps) => <User {...props} />,
      label: 'Free Agents',
      value: tournament.freeAgents ? 'ON' : 'OFF',
    },
    {
      icon: ({ ...props }: LucideProps) => <Earth {...props} />,
      label: 'Region',
      value: tournament.gameSettings?.region || 'N/A',
    },
  ]
  const tournamentInfo = [
    {
      icon: ({ ...props }: LucideProps) => <Trophy {...props} />,
      title: 'Prize Pool',
      value:
        tournament.prizes && tournament.prizes.length > 0
          ? tournament.prizes.reduce((total, prize) => total + prize.value, 0).toLocaleString() +
            ' ' +
            tournament.prizes[0].currency
          : 'N/A',
      isActive: true,
    },
    {
      icon: ({ ...props }: LucideProps) => <DollarSign {...props} />,
      title: 'Entry Fee',
      value:
        tournament.joinProcess.entryFee > 0
          ? `${tournament.joinProcess.entryFee} ${tournament.prizes && tournament.prizes[0] ? tournament.prizes[0].currency : ''}`
          : 'Free',
      isActive: false,
    },
    {
      icon: ({ ...props }: LucideProps) => <Gamepad2 {...props} />,
      title: 'Game Mode',
      value: tournament.gameMode,
      isActive: false,
    },
    {
      icon: ({ ...props }: LucideProps) => <Network {...props} />,
      title: 'Format',
      value: tournament.BracketType.replaceAll('_', ' ') || 'N/A',
      isActive: false,
    },
    {
      icon: ({ ...props }: LucideProps) => <UsersRound {...props} />,
      title: 'Slots',
      value: tournament.maxParticipants.toString() + ' Players',
      isActive: false,
    },
    {
      icon: ({ ...props }: LucideProps) => <Swords {...props} />,
      title: 'Rounds',
      value:
        ((tournament.started || now > new Date(tournament?.structureProcess?.signUpClosing!)) &&
        tournament.participants.length > 0
          ? tournament.participants.length / 2 - 1
          : 'N/A') + ' Total',
      isActive: false,
    },
  ]
  const playersWanted =
    tournament.requestsToJoin?.map(request => ({
      userId: request.user?._id || request.user,
      fullname: (request.user as any)?.fullname || 'Unknown',
      comment: request.message,
      profilePicture: (request.user as any)?.profileImage || '/assets/default-user-icon.jpg',
    })) || []
  return (
    <div className="grid grid-cols-12">
      <div className="col-span-full lg:col-span-8 lg:p-4 space-y-24">
        <div className="space-y-8">
          <h3 className="text-xl lg:text-2xl font-bold">About {tournament.name}</h3>
          <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
            <div className="flex-1 relative overflow-hidden rounded-2xl">
              <Image
                unoptimized
                src={getGameCoverImage(fullGame || tournament.game)}
                alt={tournament.game.name}
                width={150}
                height={250}
                className="absolute size-full object-cover object-top"
              />
              <p className="absolute w-full left-0 bottom-0 bg-black/40 text-center py-2 font-medium">
                {tournament.game.name}
              </p>
            </div>
            {gameInfo.map(info => (
              <div
                key={info.label}
                className="group flex-1 rounded-2xl bg-zinc-800 flex flex-col items-center justify-center aspect-square"
              >
                <p className="text-sm text-defendrGhostGrey flex items-center justify-center flex-col lg:flex-row flex-wrap gap-x-2">
                  {info.icon({ className: 'text-defendrRed size-8 mb-2 lg:mb-0 lg:size-4' })}
                  <span className="whitespace-nowrap text-sm md:text-base">{info.label}</span>
                </p>
                <p className="mt-4 px-2 text-sm lg:text-lg font-bold text-center line-clamp-2">
                  {info.value}
                </p>
              </div>
            ))}
          </div>
          <div className="lg:hidden flex gap-2 bg-zinc-800 p-4 rounded-xl">
            <Image
              src={
                (tournament.createdBy as any).logoImage ||
                'https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/default%20pictures/default%20logo/org.png'
              }
              alt={`${tournament.createdBy?.name} profile`}
              width={40}
              height={40}
              className="rounded-full border-2 border-defendrRed size-15 aspect-square!"
            />
            <div className="space-y-1 w-full">
              <h4 className="leading-6 text-lg font-bold">
                <Link href={`/organization/${tournament.createdBy._id}/Profile`}>
                  {tournament.createdBy.name}
                </Link>
              </h4>
              <div className="flex items-center justify-center gap-2">
                <FollowOrganizationButton
                  followers={tournament.createdBy.followers?.length || 0}
                  organizationId={tournament.createdBy._id}
                  initialIsFollowing={
                    session
                      ? tournament.createdBy.followers?.includes(session.user?._id as string) ||
                        false
                      : false
                  }
                />
              </div>
            </div>
          </div>
          <pre className="text text-justify mb-4 font-family-poppins! text-wrap">
            {tournament.description}
          </pre>
          <div className="grid grid-cols-3 gap-4 lg:hidden">
            {tournamentInfo.slice(-3).map((info, index) => (
              <div
                key={index}
                className="group flex-1 rounded-2xl bg-zinc-800 flex flex-col gap-2 items-center justify-center aspect-square"
              >
                {info.icon({ size: 34, className: 'text-defendrRed' })}
                <p className="text-sm text-defendrGhostGrey">{info.title}</p>
                <p className="whitespace-nowrap truncate w-full px-2 text-center font-medium">
                  {info.value}
                </p>
              </div>
            ))}
          </div>
          <DiscordJoinCard className="lg:hidden" />
        </div>
        <div className="space-y-8">
          <h3 className="text-2xl font-bold">TOURNAMENT TIMELINE</h3>
          <div className="space-y-4">
            <TimeLinePart
              step={1}
              status={
                now > new Date(tournament?.structureProcess?.signUpClosing!)
                  ? 'completed'
                  : new Date(tournament?.structureProcess?.signUpOpening!) > now
                    ? 'upcoming'
                    : 'started'
              }
              title="Registration Opens"
              description="Teams can start registering for the tournament"
              date={new Date(tournament?.structureProcess?.signUpOpening!).toLocaleDateString(
                undefined,
                {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                },
              )}
              time={new Date(tournament?.structureProcess?.signUpOpening!).toLocaleTimeString(
                undefined,
                {
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZoneName: 'short',
                },
              )}
              children={
                <TimeLineRegisterbtn
                  disabled={
                    tournament.started ||
                    new Date() > new Date(tournament?.structureProcess?.signUpClosing!)
                  }
                />
              }
            />
            <TimeLinePart
              step={2}
              status={
                tournament.started || tournament.isClosed
                  ? 'completed'
                  : now < new Date(tournament?.structureProcess?.registrationEndDate!)
                    ? 'upcoming'
                    : 'started'
              }
              title="Check-in"
              description="Final check-in for all registered teams"
              date={new Date(tournament?.structureProcess?.registrationEndDate!).toLocaleDateString(
                undefined,
                {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                },
              )}
              time={new Date(tournament?.structureProcess?.registrationEndDate!).toLocaleTimeString(
                undefined,
                {
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZoneName: 'short',
                },
              )}
              children={
                <a
                  href="https://discord.gg/VN37KQxw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <button
                    type="button"
                    className="px-4 md:px-12 py-2 rounded-xl bg-[#5865F2] text-white font-semibold flex items-center justify-center gap-2 max-md:w-full md:ml-14"
                  >
                    Join Discord Check-in
                    <MessageCircle />
                  </button>
                </a>
              }
            />
            <TimeLinePart
              step={3}
              status={tournament.started ? 'started' : 'upcoming'}
              title="Tournament Begins"
              description="Group stage matches start"
              date="March 00, 2024"
              time="00:00 PM UTC"
            />
            {tournament.BracketType === 'DOUBLE_ELIMINATION' && (
              <>
                <TimeLinePart
                  step={3}
                  status="upcoming"
                  title="Elimination Rounds"
                  description="8 teams advance to elimination bracket"
                  date="March 00, 2024"
                  time="00:00 PM UTC"
                />
                <TimeLinePart
                  step={3}
                  status="upcoming"
                  title="Grand Finals"
                  description="Final match between top 2 teams"
                  date="March 00, 2024"
                  time="00:00 PM UTC"
                />
              </>
            )}
          </div>
        </div>
        {!tournament.winner ? (
          <div className="space-y-8">
            <h3 className="text-2xl font-bold">Prize Distribution</h3>
            <div className="space-y-4">
              {tournament.prizes && tournament.prizes.length > 0 ? (
                tournament.prizes.map((prize, index) => {
                  const getMedalEmoji = (rank: number) => {
                    switch (rank) {
                      case 1:
                        return '🥇'
                      case 2:
                        return '🥈'
                      case 3:
                        return '🥉'
                      default:
                        return '🏆'
                    }
                  }
                  return (
                    <div
                      key={prize._id}
                      className="flex items-center justify-between p-4 rounded-2xl bg-zinc-800"
                    >
                      <p className="space-x-2">
                        <span className="text-2xl">{getMedalEmoji(prize.rank as number)}</span>
                        <span className="text-xl font-medium">
                          {prize.rank === 1
                            ? '1st Place'
                            : prize.rank === 2
                              ? '2nd Place'
                              : prize.rank === 3
                                ? '3rd Place'
                                : `${prize.rank}th Place`}
                        </span>
                      </p>
                      <p className="text-defendrRed font-semibold text-xl">
                        {prize.value.toLocaleString()} {prize.currency}
                      </p>
                    </div>
                  )
                })
              ) : (
                <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-800">
                  <p className="text-defendrGhostGrey">No prize information available</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <h3 className="text-2xl font-bold">Winners & Prizes</h3>
            <div className="space-y-4">
              <WinnerCard
                winner={tournament.winner}
                prize={
                  tournament.prizes && tournament.prizes.length > 0
                    ? `${tournament.prizes[0].value.toLocaleString()} ${tournament.prizes[0].currency}`
                    : 'N/A'
                }
              />
            </div>
          </div>
        )}
      </div>
      <div className="max-lg:hidden col-span-4 px-0 py-6 lg:-translate-y-24 space-y-4">
        <DiscordJoinCard />
        <div className="p-8 bg-zinc-800 space-y-4 rounded-2xl">
          {tournamentInfo.map((info, index) => (
            <div key={index} className="flex items-center gap-4">
              {info.icon({ size: 34, className: 'text-defendrRed' })}
              <div>
                <p className="text-sm text-defendrGhostGrey">{info.title}</p>
                <p
                  className={`text-xl capitalize font-medium ${info.isActive ? 'text-defendrRed' : 'text-white'}`}
                >
                  {info.value.toLowerCase()}
                </p>
              </div>
            </div>
          ))}
        </div>
        {tournament.freeAgents.length > 0 && (
          <div className="p-8 bg-zinc-800 space-y-4 rounded-2xl">
            <h3 className="text-2xl font-bold">Players Wanted</h3>
            <div className="space-y-4">
              {playersWanted.length > 0 ? (
                playersWanted.map((player, index) => (
                  <div key={(player.userId as string) || index} className="flex gap-4">
                    <Image
                      src={player.profilePicture}
                      alt={player.fullname}
                      width={50}
                      height={50}
                      className="size-12 aspect-square object-cover rounded-full"
                    />
                    <div className="p-4 rounded-xl bg-zinc-900 space-y-2 flex-1">
                      <h6 className="text-lg text-medium">{player.fullname}</h6>
                      <p className="text-sm text-defendrGhostGrey">{player.comment}</p>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          label="invite"
                          size="s"
                          className="w-fit rounded-xl [&_span]:max-xl:hidden"
                          variant="contained-red"
                          icon={<Plus size={18} />}
                          iconOrientation="left"
                        />
                        <Button
                          label="Profile"
                          size="s"
                          className="w-fit *:text-defendrRed! rounded-xl [&_span]:max-xl:hidden"
                          variant="outlined-red"
                          icon={<Eye size={18} />}
                          iconOrientation="left"
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-defendrGhostGrey text-center py-4">
                  No free agents looking to join this tournament yet.
                </p>
              )}
            </div>
          </div>
        )}
        <div className="p-8 bg-linear-to-br from-transparent to-defendrRed space-y-4 rounded-2xl">
          <h3 className="text-2xl font-bold">Quick Links</h3>
          <div className="space-y-2 flex flex-col">
            <a href="" target="_blank">
              <Button
                label="Join Discord"
                className="w-full rounded-xl justify-start!"
                variant="contained-black"
                icon={<DiscordAlt fill="#ff000000" stroke="#FFFFFF" width={25} strokeWidth={2} />}
                iconOrientation="left"
              />
            </a>
            <Link href={`/tournament/${tournament._id}/live-streaming`}>
              <Button
                label="Watch live Stream"
                className="w-full rounded-xl justify-start!"
                variant="contained-black"
                icon={<ArrowUpRight strokeWidth={1} />}
                iconOrientation="left"
              />
            </Link>
            <Link href={`/organization/${tournament.createdBy._id}/Profile`}>
              <Button
                label="Contact organizer"
                className="w-full rounded-xl justify-start!"
                variant="contained-black"
                icon={<MessageCircle strokeWidth={1} />}
                iconOrientation="left"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

const DiscordJoinCard = ({
  className,
  discordUrl,
}: {
  className?: string
  discordUrl?: string
}) => {
  return (
    <div
      className={cn(
        'p-4 xl:p-8 bg-[#5865F2] rounded-2xl flex flex-col items-center justif-center gap-4',
        className,
      )}
    >
      <DiscordAlt />
      <p className="text-defendrSilver">Game Mode</p>
      <a
        href={discordUrl || 'https://discord.gg/VN37KQxw'}
        target="_blank"
        className="bg-white text-[#5865F2] flex items-center justify-center gap-1 p-3 w-full rounded-xl font-medium"
      >
        <span>Join for more informations</span>
        <ArrowUpRight />
      </a>
    </div>
  )
}

const StepCircle = ({ step, completed = false }: { step: number; completed?: boolean }) => {
  return (
    <div
      className={`relative size-12 rounded-full text-xl border-2 ${completed ? 'bg-defendrRed text-white' : 'text-defendrRed'} border-defendrRed after:w-0.5 after:h-24 after:left-1/2 after:-translate-x-1/2 after:top-full after:bg-linear-to-b after:from-defendrRed after:to-transparent after:absolute`}
    >
      {completed ? (
        <CircleCheckBig
          size={24}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      ) : (
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-bold">
          {step.toString()}
        </span>
      )}
    </div>
  )
}

const TimeLinePart = ({
  step,
  status,
  title,
  description,
  date,
  time,
  children,
}: {
  step: number
  status: 'completed' | 'started' | 'upcoming'
  title: string
  description: string
  date: string
  time: string
  children?: ReactNode
}) => {
  const statusColor =
    status === 'completed'
      ? 'bg-red-950 text-defendrRed'
      : status === 'started'
        ? 'bg-blue-950 text-blue-400'
        : 'bg-yellow-950 text-yellow-400'
  return (
    <div
      className={`bg-zinc-800 space-y-8 p-4 rounded-2xl overflow-hidden sm:h-50 ${children ? '' : 'pb-12'}`}
    >
      <div className="flex items-start gap-4">
        <StepCircle step={step} completed={status === 'completed'} />
        <div className="flex-1 space-y-6">
          <div>
            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-1">
              <h6 className="text-lg font-bold">{title}</h6>
              <p className={`text-sm self-end w-fit px-4 py-1 rounded-full ${statusColor}`}>
                {status}
              </p>
            </div>
            <p className="text-sm text-defendrGhostGrey">{description}</p>
          </div>

          <div className="flex items-start flex-wrap gap-2">
            {status === 'completed' && <span>Ends:</span>}
            <Calendar size={20} className="text-defendrRed" />
            <span className="whitespace-nowrap">{date}</span>
            <Clock size={20} className="text-defendrRed" />
            <span className="whitespace-nowrap">{time}</span>
          </div>
        </div>
      </div>
      {children}
    </div>
  )
}

export default TournamentOverview
