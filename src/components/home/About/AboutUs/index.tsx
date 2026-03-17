import Image from 'next/image'
import { useState } from 'react'

import { AboutPartenair } from '@/components/home/About'
import Typo from '@/components/ui/Typo'

const AboutUs = () => {
  const [selectedActor, setSelectedActor] = useState<number | null>(null)

  // Partner names corresponding to the logos
  const partnerNames = [
    'The Dot',
    'Makers Factory',
    'Tacir',
    'Logo Center',
    'Mentor',
    'WSH',
    'Challengers Land',
    'TT',
    'JSK Esports',
    'Maghroumin',
  ]

  const actorData = [
    {
      title: 'Players',
      subtitle: 'Gamers & Competitors',
      icon: '👤',
      iconBg: 'bg-gradient-to-br from-defendrRed to-red-600',
      titleColor: 'text-defendrRed',
      cardStyle: 'border-defendrRed/50 bg-gradient-to-br from-red-900/20 to-red-600/20',
      description:
        'Everything you need to grow as a competitive gamer, from profiles to professional opportunities.',
      features: [
        {
          title: 'Player Profiles',
          description:
            'Every player has a dedicated profile showcasing their journey — XP, level, match history, achievements, and NFTs. Profiles act as digital esports résumés.',
          icon: '👤',
        },
        {
          title: 'Ranked Leaderboards',
          description:
            'Track skill and performance across different games, tournaments, and regions. Foster competition and reward excellence in the MENA esports scene.',
          icon: '🏆',
        },
        {
          title: 'XP System',
          description:
            'Earn XP by participating in matches, completing missions, and engaging with the community. XP defines your growth path and unlocks new tiers.',
          icon: '⭐',
        },
        {
          title: 'Missions & Quests',
          description:
            'Turn every gaming session into an adventure with daily and weekly quests designed to keep you engaged and rewarded.',
          icon: '🎯',
        },
        {
          title: 'Gamification Tokens',
          description:
            'Blue Tokens earned in tournaments for prestige, Red Tokens from missions usable in store or for NFTs.',
          icon: '🪙',
        },
        {
          title: 'NFT Achievements',
          description:
            'Earn collectible NFTs representing unique achievements, victories, and milestones as permanent digital trophies on the blockchain.',
          icon: '🏅',
        },
        {
          title: 'Wallet & Rewards System',
          description:
            'Secure integrated wallet to receive prize money, store tokens, convert between currencies, and withdraw cash from winnings.',
          icon: '💳',
        },
        {
          title: 'Store (defendr.store)',
          description:
            'Hub for redeeming rewards — digital skins, passes, exclusive NFTs, and merchandise powered by Red and Blue tokens.',
          icon: '🛒',
        },
        {
          title: 'Path-to-Pro System',
          description:
            'Top-performing players get scouted by professional teams through DEFENDR stats — creating a real path from community to pro.',
          icon: '🚀',
        },
        {
          title: 'Spectator & Fan Missions',
          description:
            'Complete event-based missions like predictions, watch-time challenges, and trivia to earn tokens or NFTs.',
          icon: '👀',
        },
      ],
    },
    {
      title: 'Tournament Organizers',
      subtitle: 'Event Creators & Managers',
      icon: '🏆',
      iconBg: 'bg-gradient-to-br from-defendrRed to-red-600',
      titleColor: 'text-defendrRed',
      cardStyle: 'border-defendrRed/50 bg-gradient-to-br from-red-900/20 to-red-600/20',
      description:
        'Complete tools to create, manage, and grow successful esports tournaments and events.',
      features: [
        {
          title: 'Tournament Creation Tools',
          description:
            'Instantly create tournaments — online or LAN — customize rules, set prizes, and manage participants with automation.',
          icon: '🎮',
        },
        {
          title: 'Bracket Management',
          description:
            'Smart bracket generation with live updates, automatic score tracking, and result validation to save time and ensure fairness.',
          icon: '📊',
        },
        {
          title: 'Registration & Payment Integration',
          description:
            'Players register instantly and pay through secure gateways or platform wallet — simplifying entry for free and paid tournaments.',
          icon: '💳',
        },
        {
          title: 'Organizer Dashboard',
          description:
            'Centralized control hub for managing all tournaments, players, and finances — complete with analytics, engagement metrics, and support tools.',
          icon: '📈',
        },
        {
          title: 'Sponsor Integration',
          description:
            'Brands can directly connect with events via the platform — sponsoring tournaments, offering prizes, or integrating branded missions.',
          icon: '🤝',
        },
        {
          title: 'Prize Pool System',
          description:
            "Automated and transparent prize distribution through DEFENDR's wallet ensures trust and instant rewards for players and organizers.",
          icon: '💰',
        },
        {
          title: 'Leaderboard for Organizers',
          description:
            'Organizers compete! Ranked by event quality, player engagement, and total XP distributed — building a reputation-driven network.',
          icon: '🏅',
        },
        {
          title: 'Event Pages & Calendars',
          description:
            'Centralized platform for all upcoming tournaments and events — online or offline — allowing easy discovery, registration, and tracking.',
          icon: '📅',
        },
        {
          title: 'Live Match Tracking & Statistics',
          description:
            'Real-time tracking of match data, including kills, assists, scores, and player metrics, displayed in live feeds and summaries.',
          icon: '📊',
        },
        {
          title: 'Analytics Dashboard',
          description:
            'Insightful analytics for organizers — engagement rates, user demographics, conversions, and event performance results.',
          icon: '📈',
        },
      ],
    },
    {
      title: 'Teams',
      subtitle: 'Team Builders & Managers',
      icon: '👥',
      iconBg: 'bg-gradient-to-br from-defendrRed to-red-600',
      titleColor: 'text-defendrRed',
      cardStyle: 'border-defendrRed/50 bg-gradient-to-br from-red-900/20 to-red-600/20',
      description:
        'Build, manage, and compete as a team with comprehensive team management tools and analytics.',
      features: [
        {
          title: 'Team System',
          description:
            'Form, join, and manage esports teams directly on DEFENDR — complete with shared stats, logos, and performance tracking.',
          icon: '👥',
        },
        {
          title: 'Team Analytics',
          description:
            'Comprehensive team performance analytics, chemistry metrics, and improvement insights to optimize team dynamics.',
          icon: '📊',
        },
        {
          title: 'Team Tournaments',
          description:
            'Participate in team-based tournaments with coordinated strategies, shared finances, and team ranking systems.',
          icon: '🏆',
        },
        {
          title: 'Strategy Planning Tools',
          description:
            'Advanced tools for team strategy planning, match analysis, and tactical preparation for competitive success.',
          icon: '🎯',
        },
        {
          title: 'Team Financial Management',
          description:
            'Manage team finances, prize distributions, and sponsorship deals with transparent financial tracking and reporting.',
          icon: '💰',
        },
        {
          title: 'Professional Scouting',
          description:
            'Get noticed by professional organizations through team performance metrics and automated scouting notifications.',
          icon: '🔍',
        },
        {
          title: 'Contract Management',
          description:
            'Professional contract templates, negotiation support, and career advancement tools for team members.',
          icon: '📋',
        },
        {
          title: 'Team Communication Tools',
          description:
            'Integrated communication platform for team coordination, practice scheduling, and strategy discussions.',
          icon: '💬',
        },
        {
          title: 'Performance Tracking',
          description:
            'Individual and team performance metrics, improvement tracking, and skill development analytics.',
          icon: '📈',
        },
        {
          title: 'Career Support',
          description:
            'Comprehensive career development support for team members transitioning to professional esports careers.',
          icon: '🚀',
        },
      ],
    },
    {
      title: 'Brands & Partners',
      subtitle: 'Business & Marketing',
      icon: '💼',
      iconBg: 'bg-gradient-to-br from-defendrRed to-red-600',
      titleColor: 'text-defendrRed',
      cardStyle: 'border-defendrRed/50 bg-gradient-to-br from-red-900/20 to-red-600/20',
      description:
        "Leverage DEFENDR's platform for brand partnerships, marketing, and business growth in the esports ecosystem.",
      features: [
        {
          title: 'White-Label Version',
          description:
            "Fully customize DEFENDR's infrastructure under your own identity while keeping DEFENDR's technology backbone.",
          icon: '🏷️',
        },
        {
          title: 'Analytics Dashboard',
          description:
            'Insightful analytics for partners — engagement rates, user demographics, conversions, and campaign results.',
          icon: '📊',
        },
        {
          title: 'Sponsorship Marketplace',
          description:
            'Connect with event organizers — matching audience demographics, game genres, and event scales for optimized sponsorships.',
          icon: '🤝',
        },
        {
          title: 'Ad & Media Placement',
          description:
            'Feature your content within tournaments, event pages, or fan missions — seamlessly integrated for maximum visibility.',
          icon: '📺',
        },
        {
          title: 'Web3 Integration (Hedera)',
          description:
            'Use Hedera to power NFTs, token transactions, and DAO governance — ensuring transparency, low fees, and sustainability.',
          icon: '⛓️',
        },
        {
          title: 'E-Wallet Integration',
          description:
            'Secure, integrated wallet system for all platform transactions — from prize payouts to token exchanges.',
          icon: '💳',
        },
        {
          title: 'Smart Contracts for Tournaments',
          description:
            'Secure every prize and reward with smart contracts — guaranteeing automatic distribution and eliminating fraud risk.',
          icon: '🔒',
        },
        {
          title: 'AI-Powered Match Predictions & Scouting',
          description:
            'Machine learning analyzes player stats to predict outcomes, recommend strategies, and identify rising talents.',
          icon: '🤖',
        },
        {
          title: 'Open API for Brands & Partners',
          description:
            "DEFENDR's open API allows enterprises to integrate esports data, tournaments, and gamification directly into their ecosystem.",
          icon: '🔌',
        },
        {
          title: 'Brand Integration Tools',
          description:
            'Comprehensive tools for brand integration, custom missions, branded tournaments, and targeted marketing campaigns.',
          icon: '🎯',
        },
      ],
    },
  ]

  return (
    <>
      <div className="border border-[#161616] rounded-3xl p-8 my-6 max-w-full mx-auto">
        <div className="w-full max-container flexCenter flex-col gap-2 mt-2 px-10">
          <Typo
            as="h2"
            className="text-center capitalize text-[32px] font-normal"
            fontFamily="poppins"
            fontVariant="custom"
          >
            About us
          </Typo>

          <div className="flex flex-col gap-6 text-center max-w-4xl mx-auto mt-4">
            <Typo
              as="p"
              className="text-[16px] xl:text-[18px] font-normal leading-relaxed text-gray-200"
              fontFamily="poppins"
              fontVariant="custom"
            >
              The platform of gamers, for gamers by gamers, we are defendr. The platform that brings
              the esports world to life; for all gamers, players, esports enthusiasts, organizers
              and communities.
            </Typo>
            <Typo
              as="p"
              className="text-[16px] xl:text-[18px] font-normal leading-relaxed text-gray-300"
              fontFamily="poppins"
              fontVariant="custom"
            >
              At defendr, we're all about defending the interests of the MENA region when it comes
              to esports. We cater to players of all levels and organizers, with a wide range of
              game titles across genres. From thrilling battles to epic quests and much more. For
              brands, publishers, and tournament organizers, we are your partners in play in all
              ways that matter.
            </Typo>
            <Typo
              as="p"
              className="text-[16px] xl:text-[18px] font-normal leading-relaxed text-gray-300"
              fontFamily="poppins"
              fontVariant="custom"
            >
              Join defendr in this journey. The platform will make the process smoother and easier
              with features to ensure that you have everything you need to set up and run
              tournaments, with none of the hassle.
            </Typo>
          </div>

          <Typo
            as="h2"
            className="text-defendrRed capitalize text-[28px] font-normal mt-8"
            fontFamily="poppins"
            fontVariant="custom"
          >
            Platform Features by Role
          </Typo>

          {/* Actor Selection */}
          <div className="w-full mb-10 mt-6 max-w-6xl mx-auto">
            <div className="flex flex-wrap items-center justify-center gap-2 p-2 bg-[#1A1A1A] rounded-2xl border border-gray-800">
              {actorData.map((actor, index) => {
                const isSelected = selectedActor === index
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedActor(isSelected ? null : index)}
                    className={`flex items-center gap-3 px-6 py-3.5 rounded-xl transition-all duration-300 flex-1 min-w-[200px] justify-center sm:justify-start ${
                      isSelected
                        ? 'bg-[#2A2A2A] border border-gray-700'
                        : 'border border-transparent hover:bg-[#222] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'bg-defendrRed text-white' : 'bg-gray-800 text-gray-400'}`}
                    >
                      <span className="text-xl">{actor.icon}</span>
                    </div>
                    <div className="text-left">
                      <Typo
                        as="h4"
                        className={`text-sm sm:text-base font-medium transition-colors duration-300 ${isSelected ? 'text-white' : 'text-gray-300'}`}
                        fontFamily="poppins"
                      >
                        {actor.title}
                      </Typo>
                      <Typo
                        as="p"
                        className={`text-xs mt-0.5 hidden sm:block transition-colors duration-300 ${isSelected ? 'text-gray-400' : 'text-gray-500'}`}
                        fontFamily="poppins"
                      >
                        {actor.subtitle}
                      </Typo>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Actor Features Display */}
          {selectedActor !== null && (
            <div className="w-full bg-[#1A1A1A] rounded-2xl p-6 sm:p-10 border border-gray-800 mt-4 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex flex-col items-center justify-center text-center mb-12 relative">
                <button
                  onClick={() => setSelectedActor(null)}
                  className="absolute right-0 top-0 text-gray-400 hover:text-white transition-colors duration-200"
                  aria-label="Close features"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <Typo
                  as="h3"
                  className="text-white text-[28px] font-semibold pr-8"
                  fontFamily="poppins"
                  fontVariant="custom"
                >
                  {actorData[selectedActor].title}
                </Typo>
                <Typo
                  as="p"
                  className="text-gray-400 text-[16px] mt-2 max-w-2xl"
                  fontFamily="poppins"
                  fontVariant="custom"
                >
                  {actorData[selectedActor].description}
                </Typo>
              </div>

              {/* Features Grid */}
              <div
                key={selectedActor}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
              >
                {actorData[selectedActor].features.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-[#222] rounded-xl p-6 border border-gray-800 hover:border-defendrRed/30 transition-all duration-300"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="w-12 h-12 rounded-lg bg-[#2A2A2A] border border-gray-700 flex items-center justify-center text-xl shrink-0">
                        <span>{feature.icon || '✨'}</span>
                      </div>

                      <div>
                        <Typo
                          as="h4"
                          className="text-white text-lg font-medium mb-2"
                          fontFamily="poppins"
                        >
                          {feature.title}
                        </Typo>
                        <Typo
                          as="p"
                          className="text-gray-400 text-sm leading-relaxed"
                          fontFamily="poppins"
                        >
                          {feature.description}
                        </Typo>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="w-full py-6 mt-4 px-8 max-w-7xl mx-auto relative overflow-hidden">
          {/* DEFENDR Brand Color Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-defendrRed/10 via-defendrRed/5 to-defendrRed/10 rounded-3xl animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-defendrRed/8 to-transparent rounded-3xl"></div>

          <div className="relative z-10">
            <Typo
              as="h2"
              className="relative capitalize text-center text-white text-[36px] font-normal pb-2 mb-8
              after:absolute after:left-1/2 after:-bottom-2 after:h-1 after:w-40 after:bg-gradient-to-r after:from-defendrRed after:to-defendrRed/80 after:-translate-x-1/2"
              fontFamily="poppins"
              fontVariant="custom"
            >
              We have been featured in
            </Typo>

            {/* Carousel Container */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-defendrRed/20">
              <div className="flex animate-scroll pt-16">
                {/* First set of logos */}
                {AboutPartenair.map((partenair, i) => (
                  <div key={`first-${i}`} className="flex-shrink-0 p-6 group relative">
                    <div className="relative w-32 h-32 rounded-xl bg-gradient-to-br from-gray-700/50 to-gray-800/50 border border-gray-600/50 group-hover:border-defendrRed/50 transition-all duration-500 group-hover:shadow-lg group-hover:shadow-defendrRed/20 group-hover:scale-105 flex items-center justify-center">
                      <Image
                        alt="defendr partner"
                        className="object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500 max-w-24 max-h-24"
                        height={96}
                        src={partenair}
                        width={96}
                      />
                      {/* Hover Glow Effect */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-defendrRed/0 via-defendrRed/20 to-defendrRed/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>

                    {/* Tooltip */}
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                      {partnerNames[i]}
                      {/* Tooltip Arrow */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                ))}

                {/* Duplicate set for seamless loop */}
                {AboutPartenair.map((partenair, i) => (
                  <div key={`second-${i}`} className="flex-shrink-0 p-6 group relative">
                    <div className="relative w-32 h-32 rounded-xl bg-gradient-to-br from-gray-700/50 to-gray-800/50 border border-gray-600/50 group-hover:border-defendrRed/50 transition-all duration-500 group-hover:shadow-lg group-hover:shadow-defendrRed/20 group-hover:scale-105 flex items-center justify-center">
                      <Image
                        alt="defendr partner"
                        className="object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500 max-w-24 max-h-24"
                        height={96}
                        src={partenair}
                        width={96}
                      />
                      {/* Hover Glow Effect */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-defendrRed/0 via-defendrRed/20 to-defendrRed/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>

                    {/* Tooltip */}
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                      {partnerNames[i]}
                      {/* Tooltip Arrow */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                ))}

                {/* Duplicate set for seamless loop */}
                {AboutPartenair.map((partenair, i) => (
                  <div key={`second-${i}`} className="flex-shrink-0 p-6 group relative">
                    <div className="relative w-32 h-32 rounded-xl bg-gradient-to-br from-gray-700/50 to-gray-800/50 border border-gray-600/50 group-hover:border-defendrRed/50 transition-all duration-500 group-hover:shadow-lg group-hover:shadow-defendrRed/20 group-hover:scale-105 flex items-center justify-center">
                      <Image
                        alt="defendr partner"
                        className="object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500 max-w-24 max-h-24"
                        height={96}
                        src={partenair}
                        width={96}
                      />
                      {/* Hover Glow Effect */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-defendrRed/0 via-defendrRed/20 to-defendrRed/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>

                    {/* Tooltip */}
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                      {partnerNames[i]}
                      {/* Tooltip Arrow */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Gradient Fade Edges */}
              <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-800/80 to-transparent pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-800/80 to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AboutUs
