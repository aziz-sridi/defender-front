'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Bot,
  Sparkles,
  Eye,
  Wand2,
  Image as ImageIcon,
  ArrowRight,
  Zap,
  Shield,
  Brain,
  Gamepad2,
  Trophy,
  Video,
  Palette,
  MessageSquare,
  Play,
  Star,
  Clock,
  ChevronRight,
} from 'lucide-react'

type AppCategory = 'all' | 'ai' | 'streaming' | 'tournament'

interface App {
  id: string
  name: string
  tagline: string
  description: string
  features: string[]
  category: 'ai' | 'streaming' | 'tournament'
  icon: React.ReactNode
  gradient: string
  status: 'live' | 'beta' | 'coming-soon'
  highlight?: boolean
}

const apps: App[] = [
  {
    id: 'guardian',
    name: 'Guardian',
    tagline: 'AI-Powered Chatbot',
    description:
      'Intelligent chatbot that assists players, answers questions, moderates chat, and provides real-time tournament information. Available 24/7 to enhance your community experience.',
    features: [
      'Natural language understanding',
      'Tournament info & schedules',
      'Player stats lookup',
      'Chat moderation',
      'Multi-language support',
      'Custom commands',
    ],
    category: 'ai',
    icon: <Bot className="w-10 h-10" />,
    gradient: 'from-blue-500 to-cyan-500',
    status: 'live',
    highlight: true,
  },
  {
    id: 'clipper',
    name: 'Hype Clipper',
    tagline: 'AI Highlight Detection',
    description:
      'Revolutionary AI plugin that automatically detects and clips the most hyped moments in your gameplay. Uses advanced audio and visual analysis to capture kills, clutches, and epic plays.',
    features: [
      'Real-time moment detection',
      'Audio hype analysis',
      'Multi-game support',
      'Auto-clip generation',
      'Social media export',
      'Custom sensitivity settings',
    ],
    category: 'ai',
    icon: <Sparkles className="w-10 h-10" />,
    gradient: 'from-purple-500 to-pink-500',
    status: 'beta',
  },
  {
    id: 'observer',
    name: 'Observer',
    tagline: 'LoL Streaming Overlay',
    description:
      'Professional-grade OBS overlay system designed specifically for League of Legends. Customizable overlays, real-time stats, and seamless integration with your streaming setup.',
    features: [
      'Real-time game stats',
      'Custom overlay templates',
      'Champion select display',
      'Kill/death notifications',
      'Team gold tracking',
      'Drag & drop editor',
    ],
    category: 'streaming',
    icon: <Eye className="w-10 h-10" />,
    gradient: 'from-green-500 to-emerald-500',
    status: 'live',
  },
  {
    id: 'agi',
    name: 'DEFENDR AGI',
    tagline: 'Agentic Tournament Creation',
    description:
      'Create complete tournaments through natural conversation. Our AGI understands your requirements and automatically configures brackets, rules, schedules, and prize pools.',
    features: [
      'Natural language setup',
      'Smart rule suggestions',
      'Auto bracket generation',
      'Schedule optimization',
      'Prize pool calculator',
      'One-click deployment',
    ],
    category: 'tournament',
    icon: <Wand2 className="w-10 h-10" />,
    gradient: 'from-orange-500 to-red-500',
    status: 'beta',
    highlight: true,
  },
  {
    id: 'posts-ai',
    name: 'Posts AI',
    tagline: 'Tournament Poster Generator',
    description:
      'Generate stunning tournament posters and graphics in seconds. AI-powered design that matches your brand identity and creates professional marketing materials automatically.',
    features: [
      'Brand-aware generation',
      'Multiple format exports',
      'Social media templates',
      'Custom style training',
      'Batch generation',
      'Edit & refine tools',
    ],
    category: 'ai',
    icon: <ImageIcon className="w-10 h-10" />,
    gradient: 'from-pink-500 to-rose-500',
    status: 'coming-soon',
  },
  {
    id: 'stream-deck',
    name: 'Stream Deck',
    tagline: 'Broadcast Control Center',
    description:
      'Unified control panel for managing your esports broadcasts. Switch scenes, trigger overlays, update scores, and control your entire production from one interface.',
    features: [
      'One-click scene switching',
      'Score management',
      'Overlay triggers',
      'Sound board integration',
      'Multi-platform support',
      'Hotkey customization',
    ],
    category: 'streaming',
    icon: <Video className="w-10 h-10" />,
    gradient: 'from-indigo-500 to-violet-500',
    status: 'coming-soon',
  },
]

const categories: { key: AppCategory; label: string; icon: React.ReactNode }[] = [
  { key: 'all', label: 'All Apps', icon: <Gamepad2 className="w-5 h-5" /> },
  { key: 'ai', label: 'AI Powered', icon: <Brain className="w-5 h-5" /> },
  { key: 'streaming', label: 'Streaming', icon: <Video className="w-5 h-5" /> },
  { key: 'tournament', label: 'Tournament', icon: <Trophy className="w-5 h-5" /> },
]

const statusConfig = {
  live: { label: 'Live', color: 'bg-green-500', textColor: 'text-green-500' },
  beta: { label: 'Beta', color: 'bg-yellow-500', textColor: 'text-yellow-500' },
  'coming-soon': { label: 'Coming Soon', color: 'bg-gray-500', textColor: 'text-gray-400' },
}

export default function AppsPage() {
  const [activeCategory, setActiveCategory] = useState<AppCategory>('all')
  const [hoveredApp, setHoveredApp] = useState<string | null>(null)

  const filteredApps =
    activeCategory === 'all' ? apps : apps.filter(app => app.category === activeCategory)

  return (
    <div className="min-h-screen bg-defendrBg">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-defendrRed/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-purple-500/30">
              <Brain className="w-4 h-4" />
              AI-Powered Platform Apps
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              DEFENDR{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-defendrRed">
                Apps
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-10">
              Supercharge your esports experience with our suite of AI-powered tools, streaming
              overlays, and intelligent automation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#apps"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-xl font-semibold transition-all hover:scale-105"
              >
                Explore Apps
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-xl font-semibold transition-all border border-gray-700"
              >
                Request Early Access
              </Link>
            </div>
          </div>

          {/* Floating App Icons */}
          <div className="hidden lg:block">
            <div className="absolute top-32 left-20 w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30 animate-float">
              <Bot className="w-8 h-8" />
            </div>
            <div
              className="absolute top-48 right-32 w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-500/30 animate-float"
              style={{ animationDelay: '1s' }}
            >
              <Sparkles className="w-7 h-7" />
            </div>
            <div
              className="absolute bottom-32 left-32 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-500/30 animate-float"
              style={{ animationDelay: '2s' }}
            >
              <Eye className="w-6 h-6" />
            </div>
            <div
              className="absolute bottom-48 right-20 w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/30 animate-float"
              style={{ animationDelay: '0.5s' }}
            >
              <Wand2 className="w-8 h-8" />
            </div>
          </div>
        </div>
      </section>

      {/* Apps Section */}
      <section id="apps" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Platform Apps</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Integrated tools designed to enhance every aspect of your esports journey
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map(category => (
              <button
                key={category.key}
                onClick={() => setActiveCategory(category.key)}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeCategory === category.key
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {category.icon}
                {category.label}
              </button>
            ))}
          </div>

          {/* Apps Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredApps.map(app => (
              <div
                key={app.id}
                className={`relative bg-gray-800 rounded-2xl overflow-hidden border transition-all duration-300 ${
                  hoveredApp === app.id ? 'border-gray-600 scale-105 shadow-2xl' : 'border-gray-700'
                } ${app.highlight ? 'ring-2 ring-purple-500/30' : ''}`}
                onMouseEnter={() => setHoveredApp(app.id)}
                onMouseLeave={() => setHoveredApp(null)}
              >
                {/* Gradient Header */}
                <div className={`h-2 bg-gradient-to-r ${app.gradient}`} />

                <div className="p-8">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${app.gradient} rounded-2xl flex items-center justify-center text-white shadow-lg`}
                    >
                      {app.icon}
                    </div>
                    <div
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                        statusConfig[app.status].color
                      } bg-opacity-20 ${statusConfig[app.status].textColor}`}
                    >
                      <div className={`w-2 h-2 rounded-full ${statusConfig[app.status].color}`} />
                      {statusConfig[app.status].label}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-1">{app.name}</h3>
                  <p
                    className={`text-sm font-medium mb-4 bg-gradient-to-r ${app.gradient} bg-clip-text text-transparent`}
                  >
                    {app.tagline}
                  </p>
                  <p className="text-gray-400 mb-6 text-sm leading-relaxed">{app.description}</p>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {app.features.slice(0, 4).map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs text-gray-300">
                        <ChevronRight className="w-3 h-3 text-purple-400" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <Link
                    href={app.status === 'coming-soon' ? '/contact' : `/apps/${app.id}`}
                    className={`inline-flex items-center gap-2 w-full justify-center py-3 rounded-xl font-semibold transition-all ${
                      app.status === 'coming-soon'
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : `bg-gradient-to-r ${app.gradient} text-white hover:opacity-90`
                    }`}
                  >
                    {app.status === 'coming-soon' ? (
                      <>
                        Get Notified
                        <MessageSquare className="w-4 h-4" />
                      </>
                    ) : app.status === 'beta' ? (
                      <>
                        Join Beta
                        <Star className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        Try Now
                        <Play className="w-4 h-4" />
                      </>
                    )}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-24 px-6 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Why DEFENDR Apps?</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Built with cutting-edge AI and designed for the esports ecosystem
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Brain className="w-8 h-8" />,
                title: 'AI-First Design',
                description:
                  'Every app leverages advanced AI to automate and enhance your workflow.',
                gradient: 'from-purple-500 to-pink-500',
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'Real-Time Processing',
                description: 'Instant responses and live updates for seamless experiences.',
                gradient: 'from-yellow-500 to-orange-500',
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'Secure & Private',
                description: 'Your data stays yours. Enterprise-grade security built-in.',
                gradient: 'from-green-500 to-emerald-500',
              },
              {
                icon: <Palette className="w-8 h-8" />,
                title: 'Fully Customizable',
                description: 'Adapt every app to match your brand and preferences.',
                gradient: 'from-blue-500 to-cyan-500',
              },
            ].map((feature, index) => (
              <div key={index} className="text-center group">
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon Teaser */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-defendrRed/10 rounded-3xl p-12 border border-purple-500/20 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Clock className="w-4 h-4" />
                More Apps Coming Soon
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                The Future of Esports Tools
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                We&apos;re constantly building new AI-powered apps to revolutionize how you create,
                manage, and experience esports. Be the first to know when new apps launch.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-xl font-semibold transition-all hover:scale-105"
                >
                  Join Waitlist
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/saas"
                  className="inline-flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-xl font-semibold transition-all border border-gray-700"
                >
                  Explore SaaS Solutions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
