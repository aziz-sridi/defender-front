'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import Typo from '@/components/ui/Typo'
import ArrowLeftWB from '@/components/ui/Icons/ArrowLeftWB'

const PricingPage = () => {
  const [activeTab, setActiveTab] = useState<'players' | 'organizers'>('players')
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const playerPlans = [
    {
      name: 'DEFENDR FREEMIUM',
      price: 'FREE',
      signupBonus: '30 DF',
      weeklyBonus: '—',
      features: [
        'Free Access To Defendr',
        '30 Defendr Points On Sign Up',
        'Participate In Tournaments And Challenges If They Are Free',
        'Standard Prize Winnings',
        'Watch Streams And Content On The Site',
      ],
      popular: false,
    },
    {
      name: 'DEFENDR NINJA',
      price: 'Coming Soon',
      signupBonus: '50 DF',
      weeklyBonus: '250 DF',
      features: [
        'Ninja Access To DEFENDR',
        '50 Bonus DF Points On Activation',
        '250 DF Points Weekly',
        'Watch Streamers And Other Content On Site',
        'Participate in 1 Paid Tournaments (1 Soul Remainning)',
        'Ninja Level Prize Winnings-Win More DF Points (+15%)',
        'Get X3 Boxes Contain Random Rewards',
        'Get Exclusively Content',
        'Missions Ninja Level',
        'Limted Stats Access',
      ],
      popular: true,
    },
    {
      name: 'DEFENDR KRATOS',
      price: 'Coming Soon',
      signupBonus: '130 DF',
      weeklyBonus: '900 DF',
      features: [
        'Kratos Access To DEFENDR',
        '130 Bonus DF Points On Activiation',
        '900 DF Points Monthly Reward',
        'Watch Streamers And Other Content On Site',
        'Participate In 1 Paid Tournaments And Challenges (1 Souls)',
        'Kratos Level Prize Winnings-Win More DF Points (+30%)',
        'Get X5 Boxes Contain Random Rewards',
        'Get +1 Advanced Tournament Organization',
        'Missions Kratos Level',
        'Advanced Stats Access',
      ],
      popular: false,
    },
  ]

  const organizerPlans = [
    {
      name: 'ORGANIZER FREEMIUM',
      price: 'FREE',
      signupBonus: '100 DF',
      weeklyBonus: '100 DF',
      features: [
        'Free Access To Defendr',
        '130 Defendr Points On Creating Organisation',
        'Create Tournaments With Free Entry Fees',
        'DF Points Cash Winning',
        'Integrate Stream Panel in Tournament',
        '256 Maximum Teams Can Join In',
      ],
      popular: false,
    },
    {
      name: 'DEFENDR ORGANIZER',
      price: 'Coming Soon',
      signupBonus: '2500 DF',
      weeklyBonus: '15000 DF',
      features: [
        'Organizer Access To Defendr',
        '2500 Bonus DF Points On Sign Up',
        '15000 DF Monthly',
        'Integrate Stream Panel in Org',
        'Get X5 Boxes Contai Random Rewards',
        'Organize Paid Tournaments',
        'Get Premium Missions',
        '264 Maximum Teams Can Join In',
        'Exclusivity To Use E-Wallet',
        'Integrate Design Pack?',
        'Integrate Anticheat?',
      ],
      popular: false,
    },
  ]

  const currentPlans = activeTab === 'players' ? playerPlans : organizerPlans

  return (
    <div className="min-h-screen bg-defendrBg">
      {/* Main Content */}
      <div className="px-6 2xl:px-20 py-12">
        {/* Title Section */}
        <div className="text-center mb-12">
          <Typo
            as="h1"
            className="text-white text-[48px] md:text-[64px] font-normal mb-4"
            fontFamily="poppins"
            fontVariant="custom"
          >
            Our Pricing plans
          </Typo>
          <Typo
            as="p"
            className="text-white text-[18px] md:text-[20px] font-normal"
            fontFamily="poppins"
            fontVariant="custom"
          >
            All the defendr memberships details are here!
          </Typo>
        </div>

        {/* Tab Selector */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-800 rounded-lg p-1 flex">
            <button
              onClick={() => setActiveTab('players')}
              className={`px-6 py-3 rounded-md transition-all duration-300 ${
                activeTab === 'players'
                  ? 'bg-defendrRed text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Players
            </button>
            <button
              onClick={() => setActiveTab('organizers')}
              className={`px-6 py-3 rounded-md transition-all duration-300 ${
                activeTab === 'organizers'
                  ? 'bg-defendrRed text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Organizers
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 max-w-7xl mx-auto">
          {currentPlans.map((plan, index) => (
            <div
              key={index}
              onClick={() => setSelectedPlan(plan.name)}
              className={`relative bg-gray-800 rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:scale-105 ${
                selectedPlan === plan.name
                  ? 'border-2 border-defendrRed'
                  : 'border-2 border-transparent'
              } ${
                selectedPlan === plan.name ? 'ring-2 ring-defendrRed/30 bg-gray-700' : ''
              } focus:outline-none focus:ring-0`}
            >
              {plan.popular && (
                <div className="absolute -top-3 -right-3 bg-defendrRed text-white px-4 py-2 rounded-lg text-sm font-semibold transform rotate-12 shadow-lg">
                  Most Played
                </div>
              )}

              {/* Plan Name with Red Underline */}
              <div className="mb-6">
                <Typo
                  as="h3"
                  className="text-defendrRed text-xl font-semibold mb-2"
                  fontFamily="poppins"
                  fontVariant="custom"
                >
                  {plan.name}
                </Typo>
                <div className="w-full h-0.5 bg-defendrRed"></div>
              </div>

              {/* Bonuses */}
              {plan.signupBonus && plan.signupBonus !== '—' && (
                <div className="mb-6">
                  <div className="flex justify-between items-center">
                    <Typo
                      as="span"
                      className="text-white text-sm"
                      fontFamily="poppins"
                      fontVariant="custom"
                    >
                      Signup Bonus
                    </Typo>
                    <div className="w-px h-4 bg-white mx-2"></div>
                    <Typo
                      as="span"
                      className="text-white text-sm"
                      fontFamily="poppins"
                      fontVariant="custom"
                    >
                      Weekly Bonus
                    </Typo>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <Typo
                      as="span"
                      className="text-defendrRed font-semibold"
                      fontFamily="poppins"
                      fontVariant="custom"
                    >
                      {plan.signupBonus}
                    </Typo>
                    <div className="w-px h-4 bg-white mx-2"></div>
                    <Typo
                      as="span"
                      className="text-defendrRed font-semibold"
                      fontFamily="poppins"
                      fontVariant="custom"
                    >
                      {plan.weeklyBonus}
                    </Typo>
                  </div>
                </div>
              )}

              {/* Features */}
              <div className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start gap-3">
                    <div className="w-4 h-4 bg-defendrRed rounded-full mt-1 flex-shrink-0 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <Typo
                      as="span"
                      className="text-white text-sm"
                      fontFamily="poppins"
                      fontVariant="custom"
                    >
                      {feature}
                    </Typo>
                  </div>
                ))}
              </div>

              {/* Red Separator Line */}
              <div className="w-full h-0.5 bg-defendrRed mb-4"></div>

              {/* Price */}
              <div className="text-center">
                <Typo
                  as="span"
                  className="text-defendrRed text-2xl font-bold"
                  fontFamily="poppins"
                  fontVariant="custom"
                >
                  {plan.price}
                </Typo>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Comparison Table */}
        <div className="max-w-7xl mx-auto mb-16">
          <div className="text-center mb-12">
            <Typo
              as="h2"
              className="text-white text-[36px] font-normal mb-4"
              fontFamily="poppins"
              fontVariant="custom"
            >
              Compare Plans
            </Typo>
            <Typo
              as="p"
              className="text-gray-400 text-lg"
              fontFamily="poppins"
              fontVariant="custom"
            >
              Choose the plan that fits your gaming needs
            </Typo>
          </div>

          {/* Comparison Table */}
          <div className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="text-left p-6">
                      <Typo
                        as="span"
                        className="text-white font-semibold"
                        fontFamily="poppins"
                        fontVariant="custom"
                      >
                        Features
                      </Typo>
                    </th>
                    {activeTab === 'players' ? (
                      <>
                        <th className="text-center p-6">
                          <Typo
                            as="span"
                            className="text-white font-semibold"
                            fontFamily="poppins"
                            fontVariant="custom"
                          >
                            FREEMIUM
                          </Typo>
                        </th>
                        <th className="text-center p-6">
                          <Typo
                            as="span"
                            className="text-white font-semibold"
                            fontFamily="poppins"
                            fontVariant="custom"
                          >
                            NINJA
                          </Typo>
                        </th>
                        <th className="text-center p-6">
                          <Typo
                            as="span"
                            className="text-white font-semibold"
                            fontFamily="poppins"
                            fontVariant="custom"
                          >
                            KRATOS
                          </Typo>
                        </th>
                      </>
                    ) : (
                      <>
                        <th className="text-center p-6">
                          <Typo
                            as="span"
                            className="text-white font-semibold"
                            fontFamily="poppins"
                            fontVariant="custom"
                          >
                            FREEMIUM
                          </Typo>
                        </th>
                        <th className="text-center p-6">
                          <Typo
                            as="span"
                            className="text-white font-semibold"
                            fontFamily="poppins"
                            fontVariant="custom"
                          >
                            PREMIUM
                          </Typo>
                        </th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {activeTab === 'players' ? (
                    <>
                      <tr className="border-b border-gray-700">
                        <td className="p-6">
                          <Typo
                            as="span"
                            className="text-white"
                            fontFamily="poppins"
                            fontVariant="custom"
                          >
                            Access to DEFENDR
                          </Typo>
                        </td>
                        <td className="p-6 text-center text-defendrRed">✓</td>
                        <td className="p-6 text-center text-defendrRed">✓</td>
                        <td className="p-6 text-center text-defendrRed">✓</td>
                      </tr>
                      <tr className="border-b border-gray-700">
                        <td className="p-6">
                          <Typo
                            as="span"
                            className="text-white"
                            fontFamily="poppins"
                            fontVariant="custom"
                          >
                            DF Points on Signup
                          </Typo>
                        </td>
                        <td className="p-6 text-center">
                          <Typo
                            as="span"
                            className="text-white"
                            fontFamily="poppins"
                            fontVariant="custom"
                          >
                            30 DF
                          </Typo>
                        </td>
                        <td className="p-6 text-center">
                          <Typo
                            as="span"
                            className="text-white"
                            fontFamily="poppins"
                            fontVariant="custom"
                          >
                            50 DF
                          </Typo>
                        </td>
                        <td className="p-6 text-center">
                          <Typo
                            as="span"
                            className="text-white"
                            fontFamily="poppins"
                            fontVariant="custom"
                          >
                            130 DF
                          </Typo>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-700">
                        <td className="p-6">
                          <Typo
                            as="span"
                            className="text-white"
                            fontFamily="poppins"
                            fontVariant="custom"
                          >
                            Weekly/Monthly DF Points
                          </Typo>
                        </td>
                        <td className="p-6 text-center">
                          <Typo
                            as="span"
                            className="text-gray-400"
                            fontFamily="poppins"
                            fontVariant="custom"
                          >
                            —
                          </Typo>
                        </td>
                        <td className="p-6 text-center">
                          <Typo
                            as="span"
                            className="text-white"
                            fontFamily="poppins"
                            fontVariant="custom"
                          >
                            250 DF/week
                          </Typo>
                        </td>
                        <td className="p-6 text-center">
                          <Typo
                            as="span"
                            className="text-white"
                            fontFamily="poppins"
                            fontVariant="custom"
                          >
                            900 DF/month
                          </Typo>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-700">
                        <td className="p-6">
                          <Typo
                            as="span"
                            className="text-white"
                            fontFamily="poppins"
                            fontVariant="custom"
                          >
                            Paid Tournament Access
                          </Typo>
                        </td>
                        <td className="p-6 text-center">
                          <Typo
                            as="span"
                            className="text-gray-400"
                            fontFamily="poppins"
                            fontVariant="custom"
                          >
                            —
                          </Typo>
                        </td>
                        <td className="p-6 text-center">
                          <Typo
                            as="span"
                            className="text-white"
                            fontFamily="poppins"
                            fontVariant="custom"
                          >
                            1/week
                          </Typo>
                        </td>
                        <td className="p-6 text-center">
                          <Typo
                            as="span"
                            className="text-white"
                            fontFamily="poppins"
                            fontVariant="custom"
                          >
                            1 Tournament + 1 Challenge
                          </Typo>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-700">
                        <td className="p-6">
                          <Typo
                            as="span"
                            className="text-white"
                            fontFamily="poppins"
                            fontVariant="custom"
                          >
                            DF Bonus per Win
                          </Typo>
                        </td>
                        <td className="p-6 text-center">
                          <Typo
                            as="span"
                            className="text-gray-400"
                            fontFamily="poppins"
                            fontVariant="custom"
                          >
                            —
                          </Typo>
                        </td>
                        <td className="p-6 text-center">
                          <Typo
                            as="span"
                            className="text-white"
                            fontFamily="poppins"
                            fontVariant="custom"
                          >
                            +15%
                          </Typo>
                        </td>
                        <td className="p-6 text-center">
                          <Typo
                            as="span"
                            className="text-white"
                            fontFamily="poppins"
                            fontVariant="custom"
                          >
                            +30%
                          </Typo>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-700">
                        <td className="p-6">
                          <Typo
                            as="span"
                            className="text-white"
                            fontFamily="poppins"
                            fontVariant="custom"
                          >
                            Loot Boxes
                          </Typo>
                        </td>
                        <td className="p-6 text-center">
                          <Typo
                            as="span"
                            className="text-gray-400"
                            fontFamily="poppins"
                            fontVariant="custom"
                          >
                            —
                          </Typo>
                        </td>
                        <td className="p-6 text-center">
                          <Typo
                            as="span"
                            className="text-white"
                            fontFamily="poppins"
                            fontVariant="custom"
                          >
                            x3 Weekly
                          </Typo>
                        </td>
                        <td className="p-6 text-center">
                          <Typo
                            as="span"
                            className="text-white"
                            fontFamily="poppins"
                            fontVariant="custom"
                          >
                            x5 Monthly
                          </Typo>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-700">
                        <td className="p-6">
                          <Typo
                            as="span"
                            className="text-white"
                            fontFamily="poppins"
                            fontVariant="custom"
                          >
                            Missions Level
                          </Typo>
                        </td>
                        <td className="p-6 text-center">
                          <Typo
                            as="span"
                            className="text-white"
                            fontFamily="poppins"
                            fontVariant="custom"
                          >
                            Freemium
                          </Typo>
                        </td>
                        <td className="p-6 text-center">
                          <Typo
                            as="span"
                            className="text-white"
                            fontFamily="poppins"
                            fontVariant="custom"
                          >
                            Ninja
                          </Typo>
                        </td>
                        <td className="p-6 text-center">
                          <Typo
                            as="span"
                            className="text-white"
                            fontFamily="poppins"
                            fontVariant="custom"
                          >
                            Kratos
                          </Typo>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-6">
                          <Typo
                            as="span"
                            className="text-white"
                            fontFamily="poppins"
                            fontVariant="custom"
                          >
                            Stats Access
                          </Typo>
                        </td>
                        <td className="p-6 text-center">
                          <Typo
                            as="span"
                            className="text-gray-400"
                            fontFamily="poppins"
                            fontVariant="custom"
                          >
                            —
                          </Typo>
                        </td>
                        <td className="p-6 text-center">
                          <Typo
                            as="span"
                            className="text-white"
                            fontFamily="poppins"
                            fontVariant="custom"
                          >
                            Limited
                          </Typo>
                        </td>
                        <td className="p-6 text-center">
                          <Typo
                            as="span"
                            className="text-white"
                            fontFamily="poppins"
                            fontVariant="custom"
                          >
                            Advanced
                          </Typo>
                        </td>
                      </tr>
                    </>
                  ) : (
                    <>
                      <tr className="border-b border-gray-700">
                        <td className="p-6">
                          <Typo
                            as="span"
                            className="text-white"
                            fontFamily="poppins"
                            fontVariant="custom"
                          >
                            Max Bracket Size
                          </Typo>
                        </td>
                        <td className="p-6 text-center">
                          <Typo
                            as="span"
                            className="text-white"
                            fontFamily="poppins"
                            fontVariant="custom"
                          >
                            84
                          </Typo>
                        </td>
                        <td className="p-6 text-center">
                          <Typo
                            as="span"
                            className="text-white"
                            fontFamily="poppins"
                            fontVariant="custom"
                          >
                            512
                          </Typo>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-700">
                        <td className="p-6">
                          <Typo
                            as="span"
                            className="text-white"
                            fontFamily="poppins"
                            fontVariant="custom"
                          >
                            Paid Tournaments
                          </Typo>
                        </td>
                        <td className="p-6 text-center">
                          <Typo
                            as="span"
                            className="text-gray-400"
                            fontFamily="poppins"
                            fontVariant="custom"
                          >
                            —
                          </Typo>
                        </td>
                        <td className="p-6 text-center">
                          <Typo
                            as="span"
                            className="text-white"
                            fontFamily="poppins"
                            fontVariant="custom"
                          >
                            2 Default
                          </Typo>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-700">
                        <td className="p-6">
                          <Typo
                            as="span"
                            className="text-white"
                            fontFamily="poppins"
                            fontVariant="custom"
                          >
                            Standard Tournaments
                          </Typo>
                        </td>
                        <td className="p-6 text-center">
                          <Typo
                            as="span"
                            className="text-white"
                            fontFamily="poppins"
                            fontVariant="custom"
                          >
                            1/month
                          </Typo>
                        </td>
                        <td className="p-6 text-center">
                          <Typo
                            as="span"
                            className="text-white"
                            fontFamily="poppins"
                            fontVariant="custom"
                          >
                            3 Default
                          </Typo>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-700">
                        <td className="p-6">
                          <Typo
                            as="span"
                            className="text-white"
                            fontFamily="poppins"
                            fontVariant="custom"
                          >
                            Advanced Tournaments
                          </Typo>
                        </td>
                        <td className="p-6 text-center">
                          <Typo
                            as="span"
                            className="text-white"
                            fontFamily="poppins"
                            fontVariant="custom"
                          >
                            1/3 months
                          </Typo>
                        </td>
                        <td className="p-6 text-center">
                          <Typo
                            as="span"
                            className="text-white"
                            fontFamily="poppins"
                            fontVariant="custom"
                          >
                            3 Default
                          </Typo>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-700">
                        <td className="p-6">
                          <Typo
                            as="span"
                            className="text-white"
                            fontFamily="poppins"
                            fontVariant="custom"
                          >
                            Leaderboards
                          </Typo>
                        </td>
                        <td className="p-6 text-center">
                          <Typo
                            as="span"
                            className="text-gray-400"
                            fontFamily="poppins"
                            fontVariant="custom"
                          >
                            —
                          </Typo>
                        </td>
                        <td className="p-6 text-center text-defendrRed">✓</td>
                      </tr>
                      <tr className="border-b border-gray-700">
                        <td className="p-6">
                          <Typo
                            as="span"
                            className="text-white"
                            fontFamily="poppins"
                            fontVariant="custom"
                          >
                            Matchmaking
                          </Typo>
                        </td>
                        <td className="p-6 text-center">
                          <Typo
                            as="span"
                            className="text-gray-400"
                            fontFamily="poppins"
                            fontVariant="custom"
                          >
                            —
                          </Typo>
                        </td>
                        <td className="p-6 text-center text-defendrRed">✓</td>
                      </tr>
                      <tr className="border-b border-gray-700">
                        <td className="p-6">
                          <Typo
                            as="span"
                            className="text-white"
                            fontFamily="poppins"
                            fontVariant="custom"
                          >
                            Tournament Templates
                          </Typo>
                        </td>
                        <td className="p-6 text-center">
                          <Typo
                            as="span"
                            className="text-gray-400"
                            fontFamily="poppins"
                            fontVariant="custom"
                          >
                            —
                          </Typo>
                        </td>
                        <td className="p-6 text-center text-defendrRed">✓</td>
                      </tr>
                      <tr>
                        <td className="p-6">
                          <Typo
                            as="span"
                            className="text-white"
                            fontFamily="poppins"
                            fontVariant="custom"
                          >
                            Missions & Quests
                          </Typo>
                        </td>
                        <td className="p-6 text-center">
                          <Typo
                            as="span"
                            className="text-gray-400"
                            fontFamily="poppins"
                            fontVariant="custom"
                          >
                            —
                          </Typo>
                        </td>
                        <td className="p-6 text-center text-defendrRed">✓</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Coming Soon Button - Only show when plan is selected */}
      {selectedPlan && (
        <div className="fixed bottom-0 left-0 right-0 bg-defendrBg border-t border-gray-700 p-4 z-50">
          <div className="max-w-7xl mx-auto flex justify-center">
            <button
              onClick={() => setSelectedPlan(null)}
              className="bg-defendrRed text-white px-8 py-3 rounded-lg font-semibold hover:bg-defendrRed/80 transition-colors"
            >
              <Typo as="span" fontFamily="poppins" fontVariant="custom">
                Coming Soon
              </Typo>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PricingPage
