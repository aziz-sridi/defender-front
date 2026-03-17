'use client'

import Link from 'next/link'
import Image from 'next/image'
import Typo from '@/components/ui/Typo'

const EconomyPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 px-6 2xl:px-20">
        <div className="max-w-6xl mx-auto text-center">
          <Typo fontFamily="poppins" className="text-5xl md:text-7xl font-bold text-white mb-6">
            🎯 The DEFENDR Economy: Red & Blue Explained
          </Typo>

          <div className="mb-8">
            <Typo fontFamily="poppins" className="text-3xl md:text-4xl font-bold text-white mb-4">
              Two Colors. One Ecosystem. Infinite Ways to Level Up.
            </Typo>
            <Typo
              fontFamily="poppins"
              className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto"
            >
              DEFENDR introduces a dual economy that powers your esports journey — from competition
              to community rewards.
            </Typo>
          </div>

          {/* Visual coins */}
          <div className="flex justify-center items-center gap-8 mb-12">
            <div className="relative">
              <div className="w-24 h-24 rounded-full shadow-2xl animate-pulse">
                <Image
                  src="https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/uploads/bleu.png"
                  alt="DEFENDR Blue Coin"
                  width={96}
                  height={96}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full animate-bounce"></div>
            </div>
            <div className="relative">
              <div className="w-24 h-24 rounded-full shadow-2xl animate-pulse">
                <Image
                  src="https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/uploads/redcoin.png"
                  alt="DEFENDR Red Coin"
                  width={96}
                  height={96}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full animate-bounce"></div>
            </div>
          </div>
        </div>
      </section>

      {/* DEFENDR Blue Section */}
      <section className="py-16 px-6 2xl:px-20 bg-gradient-to-r from-blue-900/20 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full shadow-lg">
                  <Image
                    src="https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/uploads/bleu.png"
                    alt="DEFENDR Blue Coin"
                    width={64}
                    height={64}
                    className="w-full h-full object-contain"
                  />
                </div>
                <Typo fontFamily="poppins" className="text-3xl md:text-4xl font-bold text-white">
                  DEFENDR Blue — Compete for Glory
                </Typo>
              </div>

              <Typo fontFamily="poppins" className="text-lg text-gray-300 mb-6">
                DEFENDR Blue is earned through competitive achievements — by playing tournaments,
                ranking high on leaderboards, and proving your skill. It represents prestige,
                progression, and mastery within the DEFENDR ecosystem.
              </Typo>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <Typo fontFamily="poppins" className="text-gray-300">
                    Earn XP and rank up
                  </Typo>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <Typo fontFamily="poppins" className="text-gray-300">
                    Unlock professional and ranked tournaments
                  </Typo>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <Typo fontFamily="poppins" className="text-gray-300">
                    Access elite missions and exclusive rewards
                  </Typo>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <Typo fontFamily="poppins" className="text-gray-300">
                    Showcase your competitive stats
                  </Typo>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative">
                <div className="w-64 h-64 bg-gradient-to-br from-blue-500/20 to-blue-700/20 rounded-2xl flex items-center justify-center border border-blue-400/30">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full mx-auto mb-4 shadow-2xl">
                      <Image
                        src="https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/uploads/bleu.png"
                        alt="DEFENDR Blue Coin"
                        width={80}
                        height={80}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <Typo fontFamily="poppins" className="text-gray-300 text-sm">
                      Competitive Achievements
                    </Typo>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🏆</span>
                </div>
                <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">📊</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DEFENDR Red Section */}
      <section className="py-16 px-6 2xl:px-20 bg-gradient-to-r from-transparent to-red-900/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 flex justify-center">
              <div className="relative">
                <div className="w-64 h-64 bg-gradient-to-br from-red-500/20 to-red-700/20 rounded-2xl flex items-center justify-center border border-red-400/30">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full mx-auto mb-4 shadow-2xl">
                      <Image
                        src="https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/uploads/redcoin.png"
                        alt="DEFENDR Red Coin"
                        width={80}
                        height={80}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <Typo fontFamily="poppins" className="text-gray-300 text-sm">
                      Rewards & Utility
                    </Typo>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🛒</span>
                </div>
                <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🎁</span>
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full shadow-lg">
                  <Image
                    src="https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/uploads/redcoin.png"
                    alt="DEFENDR Red Coin"
                    width={64}
                    height={64}
                    className="w-full h-full object-contain"
                  />
                </div>
                <Typo fontFamily="poppins" className="text-3xl md:text-4xl font-bold text-white">
                  DEFENDR Red — Play, Earn, and Enjoy
                </Typo>
              </div>

              <Typo fontFamily="poppins" className="text-lg text-gray-300 mb-6">
                DEFENDR Red is your reward and utility currency — gained by completing missions,
                engaging in community challenges, and staying active on the platform. It can be used
                for store purchases, event passes, cosmetics, and even Web3 items (NFTs) when you
                activate blockchain mode.
              </Typo>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <Typo fontFamily="poppins" className="text-gray-300">
                    Buy digital items and cosmetics
                  </Typo>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <Typo fontFamily="poppins" className="text-gray-300">
                    Join special tournaments or events
                  </Typo>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <Typo fontFamily="poppins" className="text-gray-300">
                    Unlock limited-edition NFTs or collectibles
                  </Typo>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <Typo fontFamily="poppins" className="text-gray-300">
                    Redeem for real-world benefits or in-game rewards
                  </Typo>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How They Work Together */}
      <section className="py-16 px-6 2xl:px-20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full shadow-lg">
              <Image
                src="https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/uploads/bleu.png"
                alt="DEFENDR Blue Coin"
                width={64}
                height={64}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="w-16 h-16 rounded-full shadow-lg">
              <Image
                src="https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/uploads/redcoin.png"
                alt="DEFENDR Red Coin"
                width={64}
                height={64}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <Typo fontFamily="poppins" className="text-3xl md:text-4xl font-bold text-white mb-6">
            ⚖️ How They Work Together
          </Typo>

          <Typo fontFamily="poppins" className="text-lg text-gray-300 max-w-4xl mx-auto mb-8">
            Both currencies are interconnected.
            <br />
            Compete to earn Blue. Complete missions to earn Red.
            <br />
            Use your Red to enhance your experience or reinvest in your Blue journey.
            <br />
            Whether you're a pro player or a casual gamer, the balance between both defines your
            growth on DEFENDR.
          </Typo>

          <div className="flex justify-center mb-12">
            <div className="relative w-80 h-40">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-red-500/20 rounded-2xl border border-gray-600/30"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500/30 to-red-500/30 rounded-full flex items-center justify-center">
                  <span className="text-4xl">⚖️</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Web3 Mode Section */}
      <section className="py-16 px-6 2xl:px-20 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">🌐</span>
          </div>

          <Typo fontFamily="poppins" className="text-3xl md:text-4xl font-bold text-white mb-6">
            Web3 Mode (Optional Activation)
          </Typo>

          <Typo fontFamily="poppins" className="text-lg text-gray-300 max-w-4xl mx-auto mb-8">
            Activate Web3 Mode to connect your DEFENDR wallet and transform your Red points into
            digital assets (NFTs). Own your achievements, trade exclusive rewards, and participate
            in community governance through DAO missions.
          </Typo>

          <div className="flex justify-center mb-12">
            <div className="relative w-80 h-40">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl border border-purple-400/30"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-full flex items-center justify-center">
                  <span className="text-4xl">💎</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 2xl:px-20 bg-gradient-to-br from-gray-800 to-black">
        <div className="max-w-6xl mx-auto text-center">
          <Typo fontFamily="poppins" className="text-4xl md:text-5xl font-bold text-white mb-6">
            🚀 Play. Earn. Progress.
            <br />
            Level Up with DEFENDR Red & Blue.
          </Typo>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Link
              href="/tournaments"
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <span className="text-xl">🎮</span>
              <Typo fontFamily="poppins" className="text-lg font-semibold">
                Join a Tournament
              </Typo>
            </Link>

            <Link
              href="/missions"
              className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <span className="text-xl">💎</span>
              <Typo fontFamily="poppins" className="text-lg font-semibold">
                Explore Missions
              </Typo>
            </Link>

            <Link
              href="/store"
              className="px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <span className="text-xl">🛒</span>
              <Typo fontFamily="poppins" className="text-lg font-semibold">
                Visit the Store
              </Typo>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default EconomyPage
