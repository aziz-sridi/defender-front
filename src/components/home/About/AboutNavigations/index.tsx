'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'

import AboutInvestors from '@/components/home/About/AboutInvestors'
import AboutTeam from '@/components/home/About/AboutTeam'
import AboutUs from '@/components/home/About/AboutUs'
const buttonsNavigation = ['about', 'team', 'advisors']

const AboutNavigations = () => {
  const [aboutButton, setAboutButton] = useState('about')
  const renderComponent = () => {
    switch (aboutButton) {
      case 'about':
        return <AboutUs />
      case 'team':
        return <AboutTeam />
      case 'advisors':
        return <AboutInvestors />
      default:
        return null
    }
  }
  const { data } = useSession()
  return (
    <section
      className={`w-full flexCenter flex-col gap-6 ${data !== null ? 'my-10' : 'mt-10 mb-20'} `}
    >
      {/* Modern Glassmorphic Pill Navigation */}
      <nav className="flex items-center justify-center p-1.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-md mb-4 shadow-xl">
        {buttonsNavigation.map((button, i) => (
          <button
            key={i}
            className={`relative px-5 py-2.5 sm:px-8 sm:py-3 rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 font-poppins ${
              aboutButton === button
                ? 'text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
            onClick={() => setAboutButton(button)}
          >
            {aboutButton === button && (
              <div className="absolute inset-0 bg-defendrRed rounded-full -z-10 shadow-[0_0_15px_rgba(226,58,99,0.5)]"></div>
            )}
            <span className="relative z-10">{button}</span>
          </button>
        ))}
      </nav>

      <div className="w-full flex-1">{renderComponent()}</div>
    </section>
  )
}

export default AboutNavigations
