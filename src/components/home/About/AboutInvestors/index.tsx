import Image from 'next/image'
import Link from 'next/link'

import { investorsAndAdvisors } from '@/components/home/About'
import { Linkedin } from '@/components/ui/Icons/Linkedin'
import Typo from '@/components/ui/Typo'

const AboutInvestors = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-8 py-8 mb-20">
      {/* Header Section */}
      <div className="text-center mb-16">
        <Typo
          as="h2"
          className="text-white text-[36px] font-normal mb-8 tracking-wide"
          fontFamily="poppins"
          fontVariant="custom"
        >
          Some Of Our Investors And Advisors
        </Typo>
        <div className="w-32 h-1 bg-gradient-to-r from-transparent via-defendrRed to-transparent mx-auto rounded-full"></div>
      </div>

      {/* Investors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
        {investorsAndAdvisors.map((investor, i) => (
          <div key={i} className="group relative">
            {/* Main Card */}
            <div className="relative bg-gradient-to-br from-gray-800/40 to-gray-900/60 rounded-[32px] p-6 border border-gray-700/50 backdrop-blur-sm transition-all duration-700 hover:border-defendrRed/60 hover:shadow-2xl hover:shadow-defendrRed/20 hover:-translate-y-2">
              {/* Profile Image */}
              <div className="relative mb-6 flex justify-center">
                <Link
                  className="relative group/image cursor-pointer block"
                  href={investor.linkdIn}
                  target="_blank"
                >
                  <div className="relative w-36 h-36 rounded-full overflow-hidden border-2 border-gray-600/30 group-hover:border-defendrRed/50 transition-all duration-500 shadow-xl">
                    <Image
                      alt={investor.fullName}
                      className="object-cover object-top w-full h-full group-hover:scale-110 group-hover:brightness-90 transition-all duration-500"
                      height={144}
                      src={investor.src}
                      width={144}
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-defendrRed/0 group-hover:bg-defendrRed/10 transition-all duration-500 rounded-full"></div>
                  </div>

                  {/* LinkedIn Icon */}
                  <div className="absolute -bottom-1 -right-1 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-500">
                    <div className="w-10 h-10 bg-defendrRed rounded-full flex items-center justify-center shadow-lg border-[3px] border-gray-900">
                      <Linkedin className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </Link>
              </div>

              {/* Name */}
              <Typo
                as="h3"
                className="text-white text-xl font-semibold text-center mb-6"
                fontFamily="poppins"
                fontVariant="custom"
              >
                {investor.fullName}
              </Typo>

              {/* Achievements */}
              <div className="space-y-3">
                {investor.achievements.map((achievement, j) => (
                  <div key={j} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-defendrRed rounded-full mt-2 flex-shrink-0 shadow-[0_0_8px_rgba(226,58,99,0.8)]"></div>
                    <Typo
                      as="p"
                      className="text-gray-300 text-sm leading-relaxed"
                      fontFamily="poppins"
                    >
                      {achievement}
                    </Typo>
                  </div>
                ))}
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-defendrRed/0 via-defendrRed/5 to-defendrRed/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
            </div>

            {/* Card Shadow */}
            <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-defendrRed/20 to-defendrRed/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700 -z-10 pointer-events-none"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AboutInvestors
