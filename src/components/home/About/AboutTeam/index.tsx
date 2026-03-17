import Image from 'next/image'
import Link from 'next/link'

import { devTeamDefendr } from '@/components/home/About'
import { Linkedin } from '@/components/ui/Icons/Linkedin'
import Typo from '@/components/ui/Typo'

const AboutTeam = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-8 py-8 mb-20">
      <div className="text-center mb-16">
        <Typo
          as="h2"
          className="text-white text-[36px] font-normal mb-4 tracking-wide"
          fontFamily="poppins"
          fontVariant="custom"
        >
          The Team
        </Typo>
        <div className="w-32 h-1 bg-gradient-to-r from-transparent via-defendrRed to-transparent mx-auto rounded-full mb-8"></div>
        <Typo
          as="p"
          className="text-gray-300 text-[16px] font-normal max-w-4xl mx-auto leading-relaxed"
          fontFamily="poppins"
          fontVariant="custom"
        >
          Ensuring our gamers and partners have the best experience in defendr is the priority of
          the team. From leaderboards to personalized insights, to getting community feedback at the
          first level to keep everything going. Bigger prize pools, gaming events, and never-ending
          excitement at defendr, we make gaming dreams come true.
        </Typo>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 lg:gap-16 max-w-4xl mx-auto">
        {devTeamDefendr.map((team, index) => (
          <div key={index} className="group relative">
            {/* Main Card */}
            <div className="relative bg-gradient-to-br from-gray-800/40 to-gray-900/60 rounded-[32px] p-8 border border-gray-700/50 backdrop-blur-sm transition-all duration-700 hover:border-defendrRed/60 hover:shadow-2xl hover:shadow-defendrRed/20 hover:-translate-y-2 flex flex-col items-center">
              {/* Profile Image */}
              <div className="relative mb-6 flex justify-center w-full">
                <Link
                  className="relative group/image cursor-pointer block"
                  href={team.linkdIn}
                  target="_blank"
                >
                  <div className="relative w-40 h-40 rounded-full overflow-hidden border-2 border-gray-600/30 group-hover:border-defendrRed/80 transition-all duration-500 shadow-xl">
                    <Image
                      alt={team.fullName}
                      className="object-cover object-top w-full h-full group-hover:scale-110 group-hover:brightness-75 transition-all duration-700"
                      height={200}
                      src={team.src}
                      width={200}
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-defendrRed/0 group-hover:bg-defendrRed/20 transition-all duration-500 rounded-full"></div>
                  </div>

                  {/* LinkedIn Icon floating badge */}
                  <div className="absolute -bottom-2 -right-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <div className="w-12 h-12 bg-defendrRed rounded-full flex items-center justify-center shadow-lg shadow-defendrRed/40 border-4 border-gray-900">
                      <Linkedin className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </Link>
              </div>

              {/* Data Section */}
              <Typo
                as="h3"
                className="text-white text-2xl font-semibold text-center mb-2"
                fontVariant="custom"
                fontFamily="poppins"
              >
                {team.fullName}
              </Typo>

              <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-defendrRed/10 border border-defendrRed/20 text-defendrRed">
                <Typo
                  as="span"
                  className="text-sm font-medium tracking-wide uppercase"
                  fontFamily="poppins"
                  fontVariant="custom"
                >
                  {team.position}
                </Typo>
              </div>

              {/* Subtle background glow */}
              <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-defendrRed/0 via-defendrRed/5 to-defendrRed/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
            </div>

            {/* Outer blur shadow */}
            <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-defendrRed/20 to-defendrRed/5 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-700 -z-10 pointer-events-none"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AboutTeam
