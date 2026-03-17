import CountdownTimer from '@/components/tournament/CountdownTimer'
import type { Metadata } from 'next'
import JoinModal from '@/components/tournament/tournamentJoin/join-modal'
import TournamentLayoutNavigation from '@/components/ui/NavigationBar/tournament-layout-navigation'
import FollowOrganizationButton from '@/components/tournament/FollowOrganizationButton'
import { getTournamentById } from '@/services/tournamentService'
import { Tournament } from '@/types/tournamentType'
import { Trophy } from 'lucide-react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/api/auth'
import Image from 'next/image'
import { notFound, redirect } from 'next/navigation'
import React from 'react'
import Link from 'next/link'

type TournamentLayoutProps = Readonly<{
  children: React.ReactNode
  params: Promise<{ id: string }>
}>

export async function generateMetadata({ params }: TournamentLayoutProps): Promise<Metadata> {
  const { id } = await params
  const tournament: Tournament = await getTournamentById(id)

  if (!tournament) {
    return {
      title: 'Tournament Not Found',
    }
  }

  const prizeValue = tournament.prizes?.reduce((acc, prize) => acc + prize.value, 0) || 0
  const prizeStr =
    prizeValue > 0
      ? ` with a dynamic prize pool of ${prizeValue} ${tournament.prizes?.[0]?.currency || 'TND'}`
      : ''

  return {
    title: `${tournament.name} — ${tournament.game.name} Tournament`,
    description: `Join the ${tournament.name} esports tournament for ${tournament.game.name}${prizeStr}. Compete against other players and teams on DEFENDR.GG.`,
    openGraph: {
      title: `${tournament.name} | DEFENDR.GG`,
      description: `Competing in ${tournament.game.name}? Join ${tournament.name}${prizeStr}. Sign up now!`,
      images: [
        {
          url:
            tournament.coverImage ||
            'https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/defendr_elements/defendr.png',
          width: 1200,
          height: 630,
        },
      ],
    },
  }
}

const TournamentLayout = async ({ children, params }: TournamentLayoutProps) => {
  const session = await getServerSession(authOptions)
  const { id: tournamentId } = await params
  const tournament: Tournament = await getTournamentById(tournamentId)
  if (!tournament) {
    return notFound()
  }
  // tournament.isClosed = false
  // tournament.startDate = new Date('2026-03-25').toISOString()
  return (
    <>
      {/* header of tournament layout */}
      <section className="relative overflow-hidden lg:h-[50vh] bg-defendrBg/ flex items-end">
        <Image
          src={tournament.coverImage}
          alt={`${tournament.name} cover`}
          width={800}
          height={600}
          className="absolute size-full cover z-0 lg:mask-l-from-10%"
        />
        <div className="size-full z-10 px-8 py-4 flex items-center justify-between flex-col max-lg:bg-defendrBg/70">
          <div className="w-full flex text-center lg:text-start items-center lg:items-start justify-center lg:justify-between">
            <div className="space-y-4">
              <div>
                <h1 className="text-4xl font-black">{tournament.name}</h1>
                <p className="text-defendrGhostGrey text-sm">{tournament.game.name} tournament</p>
              </div>
              <div className="mt-4 hidden lg:flex">
                {[0, 1, 2].map(i => (
                  <Image
                    key={i}
                    src={
                      tournament.participants[i]
                        ? tournament.participants[i].team?.profileImage ||
                          tournament.participants[i].user?.profileImage?.replaceAll(
                            'PROFILE.jpeg',
                            '',
                          ) ||
                          '/assets/default-user-icon.jpg'
                        : '/assets/default-user-icon.jpg'
                    }
                    alt="team pfp"
                    width={45}
                    height={45}
                    className="rounded-full border-2 border-defendrRed"
                    style={{
                      transform: `translateX(-${15 * i}px)`,
                    }}
                  />
                ))}
                <div
                  className=" px-4 h-11 grid place-items-center bg-[color-mix(in_srgb,var(--color-defendrRed)_40%,var(--color-black))]  text-defendrRed border-2 border-defendrRed rounded-full"
                  style={{
                    transform: `translateX(-${15 * 3}px)`,
                  }}
                >
                  {tournament.participants.length} participants
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="flex items-center justify-center w-fit gap-4">
                  <div>
                    <Trophy size={40} className="text-amber-400" strokeWidth={1} />
                    <p className="text-xs text-defendrGhostGrey text-center">PRIZE</p>
                  </div>
                  {tournament.prizes && (
                    <h4 className="text-6xl font-black">
                      <span className="text-transparent [-webkit-text-stroke:1px_var(--color-amber-400)]">
                        {tournament.prizes.reduce((acc, prize) => acc + prize.value, 0)}
                      </span>
                      <span className="text-sm font-extralight text-amber-400">
                        {tournament.prizes.length > 0 && tournament.prizes[0].currency
                          ? tournament.prizes[0].currency
                          : 'TND'}
                      </span>
                    </h4>
                  )}
                </div>
              </div>
            </div>
            <div className="hidden lg:flex gap-2 bg-black/20 backdrop-blur-md p-4 rounded-xl">
              <Link href={`/organization/${tournament.createdBy._id}/Profile`}>
                <Image
                  src={tournament.createdBy.profileImage || '/assets/default-user-icon.jpg'}
                  alt={`${tournament.createdBy?.name} profile`}
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-defendrRed size-15 aspect-square!"
                />
              </Link>
              <div className="space-y-2">
                <h4 className="leading-6 text-lg font-bold">{tournament.createdBy.name}</h4>
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
          </div>
          <div className="w-full flex flex-col lg:flex-row gap-y-4 items-center lg:items-end justify-between">
            <div className="flex gap-2 items-center justify-center">
              {tournament.isClosed ? (
                <span className="px-4 py-1 rounded-full border border-defendrRed bg-defendrRed/20 backdrop-blur-md text-defendrRed">
                  Tournament Ended
                </span>
              ) : (
                <>
                  {tournament.started ? (
                    <span className="px-4 py-1 rounded-full border border-defendrSilver bg-defendrSilver/20 backdrop-blur-md text-defendrSilver">
                      Started
                    </span>
                  ) : (
                    <span className="px-4 py-1 rounded-full border border-defendrBlue bg-defendrBlue/20 backdrop-blur-md text-defendrBlue">
                      Starting soon
                    </span>
                  )}
                </>
              )}

              <span className="px-4 py-1 rounded-full border border-defendrGreen bg-defendrGreen/20 backdrop-blur-md text-defendrGreen">
                Free entry
              </span>
            </div>

            {tournament.isClosed ? (
              <div className="flex items-center justify-center">
                <p className="px-4 py-1 rounded-full border border-defendrRed bg-[color-mix(in_srgb,var(--color-defendrRed)_40%,var(--color-black))] text-defendrRed">
                  {new Date(tournament.startDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <div className="bg-defendrRed h-0.5 w-20" />
                <p className="px-4 py-1 rounded-full border border-defendrRed bg-[color-mix(in_srgb,var(--color-defendrRed)_40%,var(--color-black))] text-defendrRed">
                  {new Date(
                    new Date(tournament.startDate).getTime() + 7 * 24 * 60 * 60 * 1000,
                  ).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            ) : (
              <div className="flex flex-col-reverse gap-4 lg:flex-col">
                <JoinModal tournament={tournament} />
                {new Date(tournament.startDate) > new Date() && !tournament.isClosed && (
                  <CountdownTimer
                    dateTarget={tournament.startDate}
                    registrationEndDate={tournament.structureProcess?.registrationEndDate}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </section>
      {/* navigation */}
      <TournamentLayoutNavigation tournamentId={tournamentId} />
      <section className="bg-defendrBg px-2 sm:px-4 lg:px-6 py-4">{children}</section>
    </>
  )
}

export default TournamentLayout

// <section className="relative overflow-hidden h-fit lg:h-[50vh] bg-defendrBg flex items-end">
//   {/* cover */}
//   <Image
//     src={tournament.coverImage}
//     alt={`${tournament.name} cover`}
//     width={800}
//     height={600}
//     className="absolute size-full cover z-10"
//   />
//   {/* header content */}
//   <div className="relative z-50 flex flex-col lg:flex-row items-center lg:justify-between w-full h-full lg:h-fit p-8 bg-black/40 backdrop-blur-sm">
//     {/* left side */}
//     <div className="gap-4 flex flex-col-reverse lg:flex-col items-center lg:items-start">
//       {/* tournament name */}
//       <h2 className="text-2xl lg:text-4xl text-center lg:text-start font-extrabold mb-2">
//         {tournament.name}
//       </h2>
//       {/* tournament creator */}
//       <div className="hidden lg:flex gap-2">
//         <Image
//           src={(tournament.createdBy as any).profileImage || '/assets/default-user-icon.jpg'}
//           alt={`${tournament.createdBy?.name} profile`}
//           width={40}
//           height={40}
//           className="rounded-full border-2 border-defendrRed size-[60px] !aspect-square"
//         />
//         <div>
//           <h4 className="leading-6 text-lg font-bold">{tournament.createdBy.name}</h4>
//           <div className="flex items-center justify-center gap-2">
//             <p className="text-defendrGhostGrey">125 follower</p>
//             <button
//               type="button"
//               className="bg-defendrBg text-defendrRed hover:bg-defendrRed hover:text-defendrBg duration-300 rounded-full px-2 py-1 flex items-center justify-center gap-1"
//             >
//               <Plus size={16} />
//               Follow
//             </button>
//           </div>
//         </div>
//       </div>
//       {/* tournament status */}
// <div className="flex items-center justify-center gap-2">
//   {tournament.isClosed ? (
//     <span className="bg-red-700 text-white px-2 py-0.5 rounded-md font-medium text-sm">
//       Tournament Ended
//     </span>
//   ) : (
//     <span className="bg-defendrBlue text-white px-2 py-0.5 rounded-md font-medium text-sm">
//       Starting soon
//     </span>
//   )}
//   <span className="bg-defendrGreen text-white px-2 py-0.5 rounded-md font-medium text-sm">
//     Free entry
//   </span>
// </div>
//     </div>
//     {/* center side */}
//     <div className="max-lg:w-full flex items-center justify-around lg:justify-center gap-8 [text-shadow:0_0_5px_rgba(0,0,0,0.5)]">
//       <div className="text-center">
//         <h4 className="text-lg lg:text-3xl lg:font-semibold text-defendrSilver">
//           Prize Pool
//         </h4>
//         <p className="text-2xl text-defendrRed font-bold">7500 DT</p>
//       </div>
//       <div className="text-center">
//         <h4 className="text-lg lg:text-3xl lg:font-semibold text-defendrSilver">Entry Fee</h4>
//         <p className="text-2xl text-defendrGreen font-bold">Free</p>
//       </div>
//     </div>
//     {/* right side */}
//     <div className="text-center space-y-4 flex flex-col max-lg:flex-1 max-lg:justify-end max-lg:mt-8">
//       {tournament.isClosed ? (
//         <div className='p-8 rounded-2xl bg-zinc-800 lg:bg-transparent max-sm:text-sm'>
//           <div className='flex items-center justify-between gap-24'>
//             <h4>Started</h4>
//             <p>
//               {new Date(tournament.startDate).toLocaleDateString('en-US', {
//                 year: 'numeric',
//                 month: 'long',
//                 day: 'numeric',
//               })}
//             </p>
//           </div>
//           <div className='h-[1px] w-full bg-defendrGhostGrey my-4'/>
//           <div className='flex items-center justify-between gap-24'>
//             <h4>Ended</h4>
//             <p>{new Date(tournament.startDate).toLocaleDateString('en-US', {
//               year: 'numeric',
//               month: 'long',
//               day: 'numeric',
//             })}</p>
//           </div>
//         </div>
//       ) : (
//         <>
//           {/* join button */}
//           <button
//             type="button"
//             className="w-full px-20 py-2 rounded-lg bg-defendrRed hover:bg-defendrHoverRed"
//           >
//             Join Now
//           </button>
//           {/* countdown */}
//           <p>
//             <span className="text-xl font-semibold px-4">00</span>
//             <span className="text-defendrRed">:</span>
//             <span className="text-xl font-semibold px-4">00</span>
//             <span className="text-defendrRed">:</span>
//             <span className="text-xl font-semibold px-4">00</span>
//             <span className="text-defendrRed">:</span>
//             <span className="text-xl font-semibold px-4">00</span>
//           </p>
//           <div className="space-y-2">
//             <p className="text-lg font-semibold">Days : Hours : Minutes : Seconds</p>
//             <p className="text-defendrGhostGrey">Registration ends on Jan, 02, 2025</p>
//           </div>
//         </>
//       )}
//     </div>
//   </div>
// </section>
