'use client'
import Typo from '@/components/ui/Typo'
import Image from 'next/image'
import { InstagramWB } from '@/components/ui/Icons/InstagramWB'
import { TwitterWB } from '@/components/ui/Icons/TwitterWB'
import { useState, useEffect } from 'react'

export default function JSKPartnerPage() {
  const [selectedAchievement, setSelectedAchievement] = useState<number | null>(null)
  const [imageCarouselIndex, setImageCarouselIndex] = useState(0)

  // Reset image carousel when achievement changes
  useEffect(() => {
    setImageCarouselIndex(0)
  }, [selectedAchievement])

  // Victory Points / Achievements Data
  const victoryPoints = [
    {
      id: 1,
      title: 'First Championship Win',
      date: '2025 Q1',
      score: 85,
      description:
        'Won the first national tournament championship, establishing JSK as a competitive force.',
      image: '/assets/images/game.jpg',
      details:
        'This victory marked the beginning of JSK Esports competitive journey, winning against 32 teams in the national championship.',
      badge: '🏆',
      category: 'Championship',
    },
    {
      id: 2,
      title: 'DEFENDR Partnership',
      date: '2025 Q2',
      score: 90,
      description:
        'Official partnership with DEFENDR platform, opening new opportunities for growth.',
      image: '/assets/images/match.jpg',
      details:
        'Strategic partnership that provides access to advanced tournament management tools and a global esports community.',
      badge: '🤝',
      category: 'Partnership',
    },
    {
      id: 3,
      title: 'Regional Tournament Victory',
      date: '2025 Q3',
      score: 88,
      description: 'Dominating performance in North African Regional Tournament.',
      image: '/assets/images/tournament.jpg',
      details:
        'Achieved first place in the regional tournament, competing against top teams from 5 countries.',
      badge: '🌍',
      category: 'Regional',
    },
    {
      id: 4,
      title: 'Community Milestone',
      date: '2025 Q4',
      score: 82,
      description: 'Reached 1000+ active community members across all platforms.',
      image: '/assets/images/teamCover.jpg',
      details:
        'Built a thriving community of passionate gamers, content creators, and esports enthusiasts.',
      badge: '👥',
      category: 'Community',
    },
    {
      id: 5,
      title: 'International Debut',
      date: '2026 Q1',
      score: 92,
      description: 'First international tournament appearance, making Tunisia proud.',
      image: '/assets/images/prize.jpg',
      details:
        'Represented Tunisia on the international stage, competing against top global teams.',
      badge: '🌐',
      category: 'International',
    },
    {
      id: 6,
      title: 'World Championship Qualification',
      date: '2026 Q2',
      score: 95,
      description: 'Qualified for the World Championship, the ultimate achievement in esports.',
      image: '/assets/images/matchStart.jpg',
      details:
        "Earned qualification through exceptional performance in regional qualifiers, securing a spot among the world's best.",
      badge: '⭐',
      category: 'World Class',
    },
  ]

  return (
    <div className="min-h-screen bg-[#161616] text-white p-4 sm:p-5 md:p-10 relative overflow-hidden">
      {/* Animated Background with Green & White Theme */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating orbs - Green and White theme */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-white/15 to-green-400/20 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-gradient-to-r from-green-600/20 to-teal-500/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-r from-lime-500/20 to-green-500/20 rounded-full blur-xl animate-bounce"></div>

        {/* Additional floating objects - Green variations */}
        <div
          className="absolute top-60 left-1/2 w-20 h-20 bg-gradient-to-r from-emerald-500/15 to-green-500/15 rounded-full blur-lg animate-pulse"
          style={{ animationDelay: '1.5s' }}
        ></div>
        <div
          className="absolute top-80 right-1/4 w-16 h-16 bg-gradient-to-r from-green-400/20 to-white/10 rounded-full blur-md animate-bounce"
          style={{ animationDelay: '0.8s' }}
        ></div>
        <div
          className="absolute bottom-60 left-1/6 w-36 h-36 bg-gradient-to-r from-teal-500/10 to-green-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '2.2s' }}
        ></div>
        <div
          className="absolute bottom-80 right-1/6 w-22 h-22 bg-gradient-to-r from-green-500/20 to-emerald-400/20 rounded-full blur-lg animate-bounce"
          style={{ animationDelay: '1.8s' }}
        ></div>
        <div
          className="absolute top-1/2 left-1/6 w-18 h-18 bg-gradient-to-r from-lime-400/15 to-green-500/15 rounded-full blur-md animate-pulse"
          style={{ animationDelay: '0.3s' }}
        ></div>
        <div
          className="absolute top-1/3 right-1/6 w-26 h-26 bg-gradient-to-r from-green-600/20 to-teal-500/20 rounded-full blur-xl animate-bounce"
          style={{ animationDelay: '1.2s' }}
        ></div>

        {/* Moving particles - Green and white */}
        <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-green-400/40 rounded-full animate-ping"></div>
        <div
          className="absolute top-1/3 right-1/4 w-1 h-1 bg-emerald-400/50 rounded-full animate-ping"
          style={{ animationDelay: '1s' }}
        ></div>
        <div
          className="absolute bottom-1/3 left-1/5 w-1.5 h-1.5 bg-green-300/40 rounded-full animate-ping"
          style={{ animationDelay: '2s' }}
        ></div>
        <div
          className="absolute bottom-1/4 right-1/5 w-1 h-1 bg-white/30 rounded-full animate-ping"
          style={{ animationDelay: '0.5s' }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-lime-400/50 rounded-full animate-ping"
          style={{ animationDelay: '1.5s' }}
        ></div>

        {/* Gradient overlay - Green theme */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-green-900/5 to-emerald-900/10"></div>
      </div>

      <div className="w-full relative z-10">
        {/* Header */}
        <div className="text-center py-10">
          {/* JSK Esports Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-full overflow-hidden shadow-2xl border-4 border-green-500/50 bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-sm group cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-green-500/50 hover:border-green-400">
              <Image
                src="https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/defendr_elements/Partners/482224237_1234397491438649_73528699382115271_n.png"
                alt="JSK Esports Logo"
                fill
                className="object-contain p-2 transition-transform duration-300 group-hover:scale-105 brightness-0 invert"
                style={{ transform: 'scale(1.3)' }}
              />
            </div>
          </div>

          <Typo
            as="h1"
            className="text-4xl sm:text-6xl font-bold mb-4 bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-clip-text text-transparent"
            fontFamily="poppins"
            fontVariant="h1"
          >
            JSK Esports
          </Typo>
          <Typo as="p" className="text-xl text-gray-300 mb-4" fontFamily="poppins" fontVariant="p2">
            Jeunesse Sportive Kairouanaise Esports
          </Typo>
          <Typo
            as="p"
            className="text-lg text-gray-400 mb-8 max-w-3xl mx-auto"
            fontFamily="poppins"
            fontVariant="p3"
          >
            Developing competitive gaming talent and representing Kairouan and Tunisia on national
            and international esports stages.
          </Typo>

          {/* Partner Badge - Redesigned */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="flex items-center gap-2 bg-gradient-to-r from-green-600/30 via-emerald-600/30 to-green-600/30 border-2 border-green-400/50 px-6 py-3 rounded-full backdrop-blur-sm shadow-lg">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <Typo
                as="span"
                className="text-sm sm:text-base font-bold text-green-300"
                fontFamily="poppins"
                fontVariant="p3"
              >
                Verified Partner
              </Typo>
            </div>
            <div className="h-8 w-px bg-green-500/30"></div>
            <div className="flex items-center gap-2 text-gray-300">
              <span className="text-lg">🤝</span>
              <Typo
                as="span"
                className="text-sm sm:text-base"
                fontFamily="poppins"
                fontVariant="p4"
              >
                Powered by DEFENDR
              </Typo>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <a
              href="https://www.instagram.com/jsk.esport/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white px-6 py-3 rounded-lg font-bold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <InstagramWB className="w-5 h-5" />
              <span>Follow on Instagram</span>
              <span>↗</span>
            </a>
            <a
              href="https://x.com/JSK_Esports"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-6 py-3 rounded-lg font-bold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 border border-gray-600"
            >
              <TwitterWB className="w-5 h-5" />
              <span>Follow on X</span>
              <span>↗</span>
            </a>
            <a
              href="https://www.facebook.com/JSKesports"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-6 py-3 rounded-lg font-bold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <span>📘</span>
              <span>Follow on Facebook</span>
              <span>↗</span>
            </a>
          </div>
        </div>

        {/* Partners Logo Slider */}
        <div className="mt-8 mb-12 max-w-7xl mx-auto">
          <Typo
            as="h2"
            className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-300"
            fontFamily="poppins"
            fontVariant="h3"
          >
            JSK Partners
          </Typo>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-green-500/20 p-6">
            {/* Gradient fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#161616] to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#161616] to-transparent z-10 pointer-events-none"></div>

            <div className="flex animate-scroll gap-8">
              {/* First set of logos */}
              {[
                {
                  name: 'JSK Esports',
                  logo: 'https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/defendr_elements/Partners/482224237_1234397491438649_73528699382115271_n.png',
                },
                {
                  name: 'DEFENDR',
                  logo: 'https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/defendr_elements/Partners/482224237_1234397491438649_73528699382115271_n.png',
                },
                {
                  name: 'Partner 1',
                  logo: 'https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/defendr_elements/Partners/482224237_1234397491438649_73528699382115271_n.png',
                },
                {
                  name: 'Partner 2',
                  logo: 'https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/defendr_elements/Partners/482224237_1234397491438649_73528699382115271_n.png',
                },
                {
                  name: 'Partner 3',
                  logo: 'https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/defendr_elements/Partners/482224237_1234397491438649_73528699382115271_n.png',
                },
                {
                  name: 'Partner 4',
                  logo: 'https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/defendr_elements/Partners/482224237_1234397491438649_73528699382115271_n.png',
                },
              ].map((partner, i) => (
                <div key={`first-${i}`} className="flex-shrink-0 group relative">
                  <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-xl bg-gradient-to-br from-gray-700/50 to-gray-800/50 border-2 border-green-500/30 group-hover:border-green-400/70 transition-all duration-500 group-hover:shadow-xl group-hover:shadow-green-500/30 group-hover:scale-110 flex items-center justify-center p-4">
                    <Image
                      alt={partner.name}
                      src={partner.logo}
                      fill
                      className="object-contain filter brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all duration-500 p-4"
                    />
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/0 via-green-500/30 to-green-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>

                  {/* Tooltip */}
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-50 shadow-lg border border-green-500/30">
                    {partner.name}
                    {/* Tooltip Arrow */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
                  </div>
                </div>
              ))}

              {/* Duplicate set for seamless loop */}
              {[
                {
                  name: 'JSK Esports',
                  logo: 'https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/defendr_elements/Partners/482224237_1234397491438649_73528699382115271_n.png',
                },
                {
                  name: 'DEFENDR',
                  logo: 'https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/defendr_elements/Partners/482224237_1234397491438649_73528699382115271_n.png',
                },
                {
                  name: 'Partner 1',
                  logo: 'https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/defendr_elements/Partners/482224237_1234397491438649_73528699382115271_n.png',
                },
                {
                  name: 'Partner 2',
                  logo: 'https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/defendr_elements/Partners/482224237_1234397491438649_73528699382115271_n.png',
                },
                {
                  name: 'Partner 3',
                  logo: 'https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/defendr_elements/Partners/482224237_1234397491438649_73528699382115271_n.png',
                },
                {
                  name: 'Partner 4',
                  logo: 'https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/defendr_elements/Partners/482224237_1234397491438649_73528699382115271_n.png',
                },
              ].map((partner, i) => (
                <div key={`second-${i}`} className="flex-shrink-0 group relative">
                  <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-xl bg-gradient-to-br from-gray-700/50 to-gray-800/50 border-2 border-green-500/30 group-hover:border-green-400/70 transition-all duration-500 group-hover:shadow-xl group-hover:shadow-green-500/30 group-hover:scale-110 flex items-center justify-center p-4">
                    <Image
                      alt={partner.name}
                      src={partner.logo}
                      fill
                      className="object-contain filter brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all duration-500 p-4"
                    />
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/0 via-green-500/30 to-green-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>

                  {/* Tooltip */}
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-50 shadow-lg border border-green-500/30">
                    {partner.name}
                    {/* Tooltip Arrow */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* About Section - Redesigned */}
        <div className="mt-12 max-w-6xl mx-auto mb-12">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Mission Card */}
            <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-green-500/30 hover:border-green-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-2xl">
                  🎯
                </div>
                <Typo
                  as="h3"
                  className="text-2xl font-bold"
                  color="white"
                  fontFamily="poppins"
                  fontVariant="h3"
                >
                  Our Mission
                </Typo>
              </div>
              <Typo
                as="p"
                className="text-gray-200 leading-relaxed"
                fontFamily="poppins"
                fontVariant="p3"
              >
                JSK Esports is the esports division of Jeunesse Sportive Kairouanaise, dedicated to
                developing competitive gaming talent and representing Kairouan and Tunisia on
                national and international esports stages.
              </Typo>
            </div>

            {/* Partnership Card */}
            <div className="bg-gradient-to-br from-emerald-600/20 to-teal-600/20 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-emerald-500/30 hover:border-emerald-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center text-2xl">
                  🤝
                </div>
                <Typo
                  as="h3"
                  className="text-2xl font-bold"
                  color="white"
                  fontFamily="poppins"
                  fontVariant="h3"
                >
                  Partnership
                </Typo>
              </div>
              <Typo
                as="p"
                className="text-gray-200 leading-relaxed"
                fontFamily="poppins"
                fontVariant="p3"
              >
                As an official partner of DEFENDR, JSK Esports brings their passion for competitive
                gaming and community engagement to our platform, creating opportunities for players
                to compete, grow, and excel in the esports ecosystem.
              </Typo>
            </div>
          </div>
        </div>

        {/* Games Section - Redesigned */}
        <div className="mt-12 max-w-7xl mx-auto mb-12">
          <Typo
            as="h2"
            className="text-4xl sm:text-5xl font-bold mb-4 text-center bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-clip-text text-transparent"
            fontFamily="poppins"
            fontVariant="h2"
          >
            Supported Games
          </Typo>
          <Typo
            as="p"
            className="text-lg text-gray-400 mb-10 text-center max-w-2xl mx-auto"
            fontFamily="poppins"
            fontVariant="p3"
          >
            Explore the diverse range of competitive games we support
          </Typo>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[
              'Tekken 8',
              'eFootball',
              'Mobile Legends',
              'VALORANT',
              'League of Legends',
              'Counter-Strike 2',
              'Rocket League',
              'EA FC 26',
              'Teamfight Tactics',
              'NBA 2K',
            ].map((game, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-gray-800/90 via-gray-800/80 to-gray-900/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-green-500/30 hover:border-green-400/70 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/30 overflow-hidden"
              >
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-600/0 via-emerald-600/0 to-teal-600/0 group-hover:from-green-600/20 group-hover:via-emerald-600/20 group-hover:to-teal-600/20 transition-all duration-500 rounded-2xl"></div>

                {/* Content */}
                <div className="relative z-10 flex items-center justify-center min-h-[80px]">
                  {/* Game name */}
                  <Typo
                    as="h3"
                    className="text-lg font-bold text-center text-white group-hover:text-green-400 transition-colors duration-300"
                    fontFamily="poppins"
                    fontVariant="h5"
                  >
                    {game}
                  </Typo>
                </div>

                {/* Hover glow effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-2xl blur-lg opacity-30"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3D Merch Display Section */}
        <div className="mt-12 max-w-6xl mx-auto mb-12">
          <Typo
            as="h2"
            className="text-3xl font-bold mb-8 text-center"
            color="white"
            fontFamily="poppins"
            fontVariant="h2"
          >
            JSK Merchandise
          </Typo>

          <div className="flex justify-center items-center perspective-1000">
            <div
              className="relative w-64 h-64 sm:w-80 sm:h-80 transform-gpu"
              style={{
                transformStyle: 'preserve-3d',
                animation: 'rotate3d 20s linear infinite',
              }}
            >
              {/* 3D Merch Box - Front */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-green-600/90 to-emerald-600/90 rounded-xl border-4 border-green-400/50 shadow-2xl flex items-center justify-center backdrop-blur-sm"
                style={{
                  transform: 'translateZ(100px)',
                  boxShadow: '0 0 30px rgba(34, 197, 94, 0.5)',
                }}
              >
                <div className="text-center p-6">
                  <div className="text-6xl mb-4">👕</div>
                  <Typo
                    as="h3"
                    className="text-2xl font-bold text-white"
                    fontFamily="poppins"
                    fontVariant="h3"
                  >
                    JSK
                  </Typo>
                  <Typo
                    as="p"
                    className="text-green-100 mt-2"
                    fontFamily="poppins"
                    fontVariant="p4"
                  >
                    Official Merch
                  </Typo>
                </div>
              </div>

              {/* 3D Merch Box - Back */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-emerald-600/90 to-teal-600/90 rounded-xl border-4 border-emerald-400/50 shadow-2xl flex items-center justify-center backdrop-blur-sm"
                style={{
                  transform: 'translateZ(-100px) rotateY(180deg)',
                  boxShadow: '0 0 30px rgba(16, 185, 129, 0.5)',
                }}
              >
                <div className="text-center p-6">
                  <div className="text-6xl mb-4">🎮</div>
                  <Typo
                    as="h3"
                    className="text-2xl font-bold text-white"
                    fontFamily="poppins"
                    fontVariant="h3"
                  >
                    ESPORTS
                  </Typo>
                  <Typo
                    as="p"
                    className="text-emerald-100 mt-2"
                    fontFamily="poppins"
                    fontVariant="p4"
                  >
                    Gear & Apparel
                  </Typo>
                </div>
              </div>

              {/* 3D Merch Box - Right */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-green-500/80 to-lime-500/80 rounded-xl border-4 border-green-300/50 shadow-2xl flex items-center justify-center backdrop-blur-sm"
                style={{
                  transform: 'rotateY(90deg) translateZ(100px)',
                  boxShadow: '0 0 30px rgba(132, 204, 22, 0.5)',
                }}
              >
                <div className="text-center p-6">
                  <div className="text-6xl mb-4">🧢</div>
                  <Typo
                    as="h3"
                    className="text-2xl font-bold text-white"
                    fontFamily="poppins"
                    fontVariant="h3"
                  >
                    CAPS
                  </Typo>
                </div>
              </div>

              {/* 3D Merch Box - Left */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-teal-500/80 to-cyan-500/80 rounded-xl border-4 border-teal-300/50 shadow-2xl flex items-center justify-center backdrop-blur-sm"
                style={{
                  transform: 'rotateY(-90deg) translateZ(100px)',
                  boxShadow: '0 0 30px rgba(20, 184, 166, 0.5)',
                }}
              >
                <div className="text-center p-6">
                  <div className="text-6xl mb-4">🎒</div>
                  <Typo
                    as="h3"
                    className="text-2xl font-bold text-white"
                    fontFamily="poppins"
                    fontVariant="h3"
                  >
                    BAGS
                  </Typo>
                </div>
              </div>

              {/* 3D Merch Box - Top */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-emerald-500/70 to-green-500/70 rounded-xl border-4 border-emerald-300/50 shadow-2xl flex items-center justify-center backdrop-blur-sm"
                style={{
                  transform: 'rotateX(90deg) translateZ(100px)',
                  boxShadow: '0 0 30px rgba(34, 197, 94, 0.5)',
                }}
              >
                <div className="text-center p-6">
                  <div className="text-6xl mb-4">🏆</div>
                  <Typo
                    as="h3"
                    className="text-2xl font-bold text-white"
                    fontFamily="poppins"
                    fontVariant="h3"
                  >
                    COLLECTIBLES
                  </Typo>
                </div>
              </div>

              {/* 3D Merch Box - Bottom */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-lime-500/70 to-emerald-500/70 rounded-xl border-4 border-lime-300/50 shadow-2xl flex items-center justify-center backdrop-blur-sm"
                style={{
                  transform: 'rotateX(-90deg) translateZ(100px)',
                  boxShadow: '0 0 30px rgba(132, 204, 22, 0.5)',
                }}
              >
                <div className="text-center p-6">
                  <div className="text-6xl mb-4">💚</div>
                  <Typo
                    as="h3"
                    className="text-2xl font-bold text-white"
                    fontFamily="poppins"
                    fontVariant="h3"
                  >
                    JSK
                  </Typo>
                </div>
              </div>
            </div>
          </div>

          {/* 3D Animation CSS */}
          <style
            dangerouslySetInnerHTML={{
              __html: `
              @keyframes rotate3d {
                0% { transform: rotateY(0deg) rotateX(10deg); }
                100% { transform: rotateY(360deg) rotateX(10deg); }
              }
              .perspective-1000 {
                perspective: 1000px;
                perspective-origin: center center;
              }
              .transform-gpu {
                transform: translateZ(0);
                will-change: transform;
              }
            `,
            }}
          />
        </div>

        {/* Victory Points / Achievements Section - Gamified */}
        <div className="mt-16 sm:mt-20 max-w-7xl mx-auto mb-12">
          <Typo
            as="h2"
            className="text-4xl sm:text-5xl font-bold mb-4 text-center bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-clip-text text-transparent"
            fontFamily="poppins"
            fontVariant="h2"
          >
            Victory Points
          </Typo>
          <Typo
            as="p"
            className="text-xl text-gray-400 mb-8 text-center max-w-2xl mx-auto"
            fontFamily="poppins"
            fontVariant="p2"
          >
            Click on any achievement point to explore our journey of victories
          </Typo>

          {/* Interactive Chart/Graph */}
          <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 sm:p-10 border border-green-500/30 mb-8">
            {/* Chart Background */}
            <div className="relative h-96 w-full">
              {/* Grid Lines */}
              <div className="absolute inset-0 opacity-20">
                <div
                  className="h-full w-full"
                  style={{
                    backgroundImage: `
                    linear-gradient(to right, rgba(34, 197, 94, 0.1) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(34, 197, 94, 0.1) 1px, transparent 1px)
                  `,
                    backgroundSize: '50px 50px',
                  }}
                ></div>
              </div>

              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 pr-2">
                <span>100</span>
                <span>80</span>
                <span>60</span>
                <span>40</span>
                <span>20</span>
                <span>0</span>
              </div>

              {/* Victory Points on Chart */}
              <div className="absolute inset-0 pl-12 pr-4 pb-8 pt-4">
                <svg className="w-full h-full">
                  {/* Connection Lines */}
                  <polyline
                    points={victoryPoints
                      .map((point, i) => {
                        const x = (i / (victoryPoints.length - 1)) * 100
                        const y = 100 - point.score
                        return `${x}%,${y}%`
                      })
                      .join(' ')}
                    fill="none"
                    stroke="rgba(34, 197, 94, 0.3)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>

                {/* Clickable Points */}
                <div className="absolute inset-0 pl-12 pr-4 pb-8 pt-4">
                  {victoryPoints.map((point, index) => {
                    const xPercent = (index / (victoryPoints.length - 1)) * 100
                    const yPercent = 100 - point.score

                    return (
                      <button
                        key={point.id}
                        onClick={() => setSelectedAchievement(point.id)}
                        className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                          selectedAchievement === point.id
                            ? 'scale-150 z-20'
                            : 'hover:scale-125 z-10'
                        }`}
                        style={{
                          left: `${xPercent}%`,
                          top: `${yPercent}%`,
                        }}
                      >
                        <div
                          className={`relative w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br ${
                            selectedAchievement === point.id
                              ? 'from-green-400 to-emerald-500 shadow-2xl shadow-green-500/50'
                              : 'from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500'
                          } border-4 border-[#161616] flex items-center justify-center text-2xl sm:text-3xl cursor-pointer transition-all duration-300`}
                        >
                          <span>{point.badge}</span>
                          {/* Score indicator */}
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 px-2 py-1 rounded text-xs font-bold text-green-400 whitespace-nowrap">
                            {point.score}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* X-axis labels */}
              <div className="absolute bottom-0 left-12 right-4 flex justify-between text-xs text-gray-400 pt-2">
                {victoryPoints.map(point => (
                  <span key={point.id} className="text-center">
                    {point.date}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Achievement Details Modal/Card */}
          {selectedAchievement &&
            (() => {
              const achievement = victoryPoints.find(a => a.id === selectedAchievement)
              if (!achievement) return null

              return (
                <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border-2 border-green-500/50 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-4xl">
                        {achievement.badge}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Typo
                            as="h3"
                            className="text-2xl sm:text-3xl font-bold text-white"
                            fontFamily="poppins"
                            fontVariant="h3"
                          >
                            {achievement.title}
                          </Typo>
                          <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-bold">
                            {achievement.score} pts
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-400">
                          <span>{achievement.date}</span>
                          <span>•</span>
                          <span>{achievement.category}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedAchievement(null)}
                      className="text-gray-400 hover:text-white transition-colors text-2xl"
                    >
                      ×
                    </button>
                  </div>

                  {/* Achievement Image Carousel */}
                  <div className="relative w-full h-64 sm:h-80 rounded-xl overflow-hidden mb-6 border-2 border-green-500/30 group">
                    <div className="relative w-full h-full">
                      {/* Main Image Display */}
                      <div className="relative w-full h-full">
                        <img
                          src={
                            [
                              achievement.image,
                              '/assets/images/match.jpg',
                              '/assets/images/prize.jpg',
                              '/assets/images/teamCover.jpg',
                            ][imageCarouselIndex]
                          }
                          alt={achievement.title}
                          className="w-full h-full object-cover transition-opacity duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      </div>

                      {/* Image Gallery Thumbnails */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                          {[
                            achievement.image,
                            '/assets/images/match.jpg',
                            '/assets/images/prize.jpg',
                            '/assets/images/teamCover.jpg',
                          ].map((img, idx) => (
                            <button
                              key={idx}
                              onClick={() => setImageCarouselIndex(idx)}
                              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                                imageCarouselIndex === idx
                                  ? 'border-green-400 scale-110'
                                  : 'border-gray-600 hover:border-green-500/50'
                              }`}
                            >
                              <img
                                src={img}
                                alt={`Gallery ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Navigation Arrows */}
                      <button
                        onClick={e => {
                          e.stopPropagation()
                          setImageCarouselIndex(prev => (prev > 0 ? prev - 1 : 3))
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white text-xl transition-all opacity-0 group-hover:opacity-100"
                      >
                        ←
                      </button>
                      <button
                        onClick={e => {
                          e.stopPropagation()
                          setImageCarouselIndex(prev => (prev < 3 ? prev + 1 : 0))
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white text-xl transition-all opacity-0 group-hover:opacity-100"
                      >
                        →
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <Typo
                    as="p"
                    className="text-lg text-gray-300 mb-4"
                    fontFamily="poppins"
                    fontVariant="p3"
                  >
                    {achievement.description}
                  </Typo>

                  {/* Details */}
                  <div className="bg-gray-900/50 rounded-xl p-4 border border-green-500/20">
                    <Typo
                      as="p"
                      className="text-gray-200 leading-relaxed"
                      fontFamily="poppins"
                      fontVariant="p3"
                    >
                      {achievement.details}
                    </Typo>
                  </div>
                </div>
              )
            })()}
        </div>

        {/* Community Engagement Section */}
        <div className="mt-12 max-w-2xl mx-auto mb-12">
          <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 rounded-xl p-6 sm:p-8 shadow-2xl border-2 border-green-400/50">
            <div className="text-center">
              <Typo
                as="h3"
                className="text-2xl font-bold mb-4"
                color="white"
                fontFamily="poppins"
                fontVariant="h3"
              >
                🎮 Join the JSK Esports Community
              </Typo>
              <Typo as="p" className="text-gray-100 mb-6" fontFamily="poppins" fontVariant="p3">
                Connect with JSK Esports on social media, participate in community events, and stay
                updated with the latest tournaments and competitions.
              </Typo>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="https://www.instagram.com/jsk.esport/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:from-pink-400 hover:to-purple-500 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <InstagramWB className="w-5 h-5" />
                  <span>Instagram</span>
                  <span>↗</span>
                </a>
                <a
                  href="https://x.com/JSK_Esports"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors duration-200 shadow-lg hover:shadow-xl hover:scale-105 border border-gray-700"
                >
                  <TwitterWB className="w-5 h-5" />
                  <span>X (Twitter)</span>
                  <span>↗</span>
                </a>
                <a
                  href="https://www.facebook.com/JSKesports"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-500 transition-colors duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <span>📘</span>
                  <span>Facebook</span>
                  <span>↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
