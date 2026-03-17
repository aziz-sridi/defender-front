'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import Input from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import SettingsIcon from '@/components/ui/Icons/Settings'
import GameIcon from '@/components/ui/Icons/Game'
import WalletIcon from '@/components/ui/Icons/Wallet'
import WarningIcon from '@/components/ui/Icons/warning'
import TeamIcon from '@/components/ui/Icons/Team'
import ShieldIcon from '@/components/ui/Icons/Org' // For shield, using Org as close visual
import RocketIcon from '@/components/ui/Icons/Rocket'

const CATEGORIES = [
  {
    key: 'account',
    title: 'Account Management',
    description: 'For issues related to your Defendr account',
    renderIcon: () => <SettingsIcon height="2.8em" strokeWidth={2.25} className="text-white" />,
  },
  {
    key: 'game-registration',
    title: 'Game Registration',
    description: 'Help linking game accounts',
    renderIcon: () => <GameIcon height="2.8em" fill="#fff" className="text-white" />,
  },
  {
    key: 'subscription',
    title: 'Subscription',
    description: 'Learn about subscription models',
    renderIcon: () => <WalletIcon height="2.7em" strokeWidth={2.25} className="text-white" />,
  },
  {
    key: 'technical-troubles',
    title: 'Technical Troubles',
    description: 'Find troubleshooting here!',
    renderIcon: () => <WarningIcon height={42} width={42} className="text-white" />,
  },
  {
    key: 'organizers',
    title: 'Organizers',
    description: 'Tournament and event organization help',
    renderIcon: () => <TeamIcon height="2.6em" className="text-white" />,
  },
  {
    key: 'defendr-red',
    title: 'Defendr Red',
    description: 'All about Defendr Red features and safety',
    renderIcon: () => (
      <img src="/assets/brandassets/logo3.png" alt="Defendr Red" className="w-14 h-14 mx-auto" />
    ), // Defendr red image
  },
  {
    key: 'defendr-blue',
    title: 'Defendr Blue',
    description: 'All about Defendr Blue features and protection',
    renderIcon: () => (
      <img
        src="https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/defendr_elements/bleu.png"
        alt="Defendr Blue"
        className="w-14 h-14 mx-auto"
      />
    ), // Defendr blue external image
  },
  {
    key: 'web3',
    title: 'WEB3',
    description: 'Learn about WEB3/crypto features in Defendr',
    renderIcon: () => <RocketIcon height="2.7em" className="text-white" />, // Web3 rocket
  },
  {
    key: 'id-verification',
    title: 'ID Verification',
    description: 'Verify your identity for full Defendr access',
    renderIcon: () => <SettingsIcon height="2.8em" strokeWidth={2.25} className="text-white" />,
  },
]

export default function UserGuidePlatformPage() {
  const [query, setQuery] = useState('')

  const filtered = CATEGORIES.filter(
    c =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.description.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#16171a] via-[#181b1e] to-[#1B232A] pb-20">
      <div className="max-w-6xl mx-auto py-14 px-4">
        <header className="mb-10 flex flex-col items-center text-center">
          <h1 className="text-5xl font-bold text-primary mb-2 tracking-tight">
            Defendr Help Center
          </h1>
          <p className="text-xl font-medium mb-8 text-gray-400 max-w-2xl">
            Find answers, step-by-step guides, and video walkthroughs for Defendr's most powerful
            features. Everything you need to get started, manage your account, and resolve any
            issues—right here.
          </p>
          <div className="w-full md:w-2/3 mb-8">
            <Input
              value={query}
              onChange={setQuery}
              placeholder="Search for your needs"
              size="xl"
              className="bg-[#17191C] border-[#2A2F34] text-white"
            />
          </div>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filtered.map(cat => (
            <Link key={cat.key} href={`/support/guide/${cat.key}`}>
              <Card className="group min-h-[250px] flex flex-col items-center justify-center bg-[#1F2428] border-[#23282f] shadow-lg transition-all duration-200 transform hover:-translate-y-2 hover:shadow-2xl hover:bg-[#242C33] focus:ring-2 ring-[#D62555] cursor-pointer">
                <CardHeader className="items-center text-center flex flex-col flex-1 justify-center">
                  <div className="flex items-center justify-center w-20 h-20 mb-4">
                    {cat.renderIcon()}
                  </div>
                  <CardTitle className="text-white text-lg mb-2 tracking-wide">
                    {cat.title}
                  </CardTitle>
                  <CardDescription className="text-gray-400 text-xs max-w-xs mx-auto">
                    {cat.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </section>

        <section className="mt-16 flex flex-col items-center text-center">
          <div className="bg-[#181d21]/70 border border-[#262f33] rounded-2xl px-6 py-7 max-w-2xl shadow-lg">
            <h3 className="text-2xl font-bold mb-2 text-primary">Need more help?</h3>
            <p className="text-gray-200 mb-4">
              Can't find what you're looking for? Reach out to our support team, visit the FAQ, or
              join our Discord server for real-time assistance.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-2">
              <a
                href="/support"
                className="rounded-lg px-5 py-2 font-semibold bg-primary text-white hover:bg-pink-600 transition"
              >
                Contact Support
              </a>
              <a
                href="/faq"
                className="rounded-lg px-5 py-2 font-semibold bg-primary text-white hover:bg-pink-600 transition"
              >
                FAQ
              </a>
              <a
                href="https://discord.com/invite/mkMczXC5nD"
                target="_blank"
                rel="noopener"
                className="rounded-lg px-5 py-2 font-semibold bg-[#404eed] text-white hover:bg-[#5865f2] transition"
              >
                Join Discord
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
