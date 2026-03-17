'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TournamentLayoutNavigation = ({ tournamentId }: { tournamentId: string }) => {
  const pathname = usePathname()
  return (
    <nav className="relative grid grid-cols-12 bg-defendrBg">
      <div className="flex gap-4 max-lg:overflow-x-scroll lg:flex-wrap p-4 lg:p-6 col-span-full lg:col-span-8 ">
        {tabs.map(tab => {
          const href =
            tab.id === '' ? `/tournament/${tournamentId}` : `/tournament/${tournamentId}/${tab.id}`

          const isActive =
            tab.id === '' ? pathname === `/tournament/${tournamentId}` : pathname.startsWith(href)
          return (
            <Link
              href={`/tournament/${tournamentId}/${tab.id}`}
              key={tab.id}
              className={`px-4 py-1 whitespace-nowrap rounded-full border-2 hover:border-defendrRed hover:bg-[#370b17] hover:text-defendrRed ${isActive ? 'border-defendrRed bg-[#370b17] text-defendrRed' : 'border-transparent bg-zinc-800 text-white'}`}
            >
              {tab.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

const tabs = [
  { id: '', label: 'Overview' },
  { id: 'rules', label: 'Rules' },
  { id: 'prizes', label: 'Prizes' },
  { id: 'participant', label: 'Participant' },
  { id: 'bracket', label: 'Brackets' },
  { id: 'matches', label: 'Matches' },
  { id: 'live-streaming', label: 'Live Streaming' },
]

export default TournamentLayoutNavigation
