'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Trophy,
  Users,
  Zap,
  Shield,
  Code,
  Server,
  BarChart3,
  Gamepad2,
  ArrowRight,
  Check,
  Star,
  Clock,
  Globe,
  Headphones,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

type ServiceCategory = 'all' | 'tournament' | 'business' | 'technical'

interface Service {
  id: string
  title: string
  description: string
  features: string[]
  category: 'tournament' | 'business' | 'technical'
  icon: React.ReactNode
  highlight?: boolean
  deliveryTime: string
}

const services: Service[] = [
  {
    id: 'tournament-api',
    title: 'Tournament & Bracket API',
    description:
      'Multi-tenant bracket/tournament engine as a SaaS with a clean HTTP API that powers your esports infrastructure.',
    features: [
      'Single & Double Elimination Brackets',
      'Round Robin & Swiss Formats',
      'Automatic Seeding & Matchmaking',
      'Real-time Match Results',
      'Prize Pool Management',
      'Multi-tenant Architecture',
    ],
    category: 'tournament',
    icon: <Trophy className="w-8 h-8" />,
    highlight: true,
    deliveryTime: '8-12 weeks',
  },
  {
    id: 'white-label',
    title: 'White-Label Tournament Platform',
    description:
      'Fully customizable tournament platform with your branding, integrated into your existing ecosystem.',
    features: [
      'Custom Branding & Theming',
      'Embedded Widget Integration',
      'Custom Domain Support',
      'Player & Team Management',
      'Leaderboards & Statistics',
      'Social Features Integration',
    ],
    category: 'business',
    icon: <Globe className="w-8 h-8" />,
    deliveryTime: '10-14 weeks',
  },
  {
    id: 'esports-analytics',
    title: 'Esports Analytics Suite',
    description:
      'Comprehensive analytics and insights for players, teams, and tournament organizers.',
    features: [
      'Player Performance Metrics',
      'Team Statistics Dashboard',
      'Match History & Replays',
      'Predictive Analytics',
      'Custom Reports & Exports',
      'API Access for Data',
    ],
    category: 'technical',
    icon: <BarChart3 className="w-8 h-8" />,
    deliveryTime: '6-8 weeks',
  },
  {
    id: 'matchmaking',
    title: 'Smart Matchmaking Engine',
    description:
      'AI-powered matchmaking system that ensures fair and competitive matches for all skill levels.',
    features: [
      'ELO/MMR Rating Systems',
      'Skill-based Matching',
      'Region & Latency Optimization',
      'Anti-smurf Detection',
      'Queue Management',
      'Custom Ranking Algorithms',
    ],
    category: 'tournament',
    icon: <Users className="w-8 h-8" />,
    deliveryTime: '4-6 weeks',
  },
  {
    id: 'game-integration',
    title: 'Game Integration Services',
    description:
      'Seamless integration with popular game APIs for automatic match tracking and verification.',
    features: [
      'Riot Games API Integration',
      'Steam/Valve Integration',
      'Epic Games Support',
      'Custom Game Adapters',
      'Match Verification',
      'Anti-cheat Compatibility',
    ],
    category: 'technical',
    icon: <Gamepad2 className="w-8 h-8" />,
    deliveryTime: '3-5 weeks',
  },
  {
    id: 'infrastructure',
    title: 'Esports Infrastructure',
    description:
      'Scalable cloud infrastructure designed specifically for esports and gaming applications.',
    features: [
      'High Availability Setup',
      'Global CDN Distribution',
      'Real-time WebSocket Support',
      'Auto-scaling Architecture',
      'DDoS Protection',
      '99.9% Uptime SLA',
    ],
    category: 'technical',
    icon: <Server className="w-8 h-8" />,
    deliveryTime: '2-4 weeks',
  },
  {
    id: 'consulting',
    title: 'Esports Business Consulting',
    description: 'Strategic consulting services to help you launch and grow your esports business.',
    features: [
      'Market Analysis & Strategy',
      'Monetization Planning',
      'Partnership Development',
      'Event Planning Support',
      'Community Building',
      'Growth Optimization',
    ],
    category: 'business',
    icon: <Star className="w-8 h-8" />,
    deliveryTime: 'Ongoing',
  },
  {
    id: 'support',
    title: 'Dedicated Support & Maintenance',
    description: '24/7 technical support and ongoing maintenance for your esports platform.',
    features: [
      '24/7 Technical Support',
      'Dedicated Account Manager',
      'Priority Bug Fixes',
      'Regular Updates & Patches',
      'Performance Monitoring',
      'Security Audits',
    ],
    category: 'business',
    icon: <Headphones className="w-8 h-8" />,
    deliveryTime: 'Ongoing',
  },
]

const pricingTiers = [
  {
    name: 'Starter',
    description: 'Perfect for small tournaments and communities',
    price: 'Custom',
    features: [
      'Up to 500 participants',
      'Basic bracket formats',
      'Standard support',
      'API access (limited)',
      'Basic analytics',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Professional',
    description: 'For growing esports organizations',
    price: 'Custom',
    features: [
      'Up to 5,000 participants',
      'All bracket formats',
      'Priority support',
      'Full API access',
      'Advanced analytics',
      'White-label options',
      'Custom integrations',
    ],
    cta: 'Contact Sales',
    popular: true,
  },
  {
    name: 'Enterprise',
    description: 'For large-scale esports operations',
    price: 'Custom',
    features: [
      'Unlimited participants',
      'All features included',
      '24/7 dedicated support',
      'Custom development',
      'SLA guarantee',
      'On-premise options',
      'Strategic consulting',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
]

const faqs = [
  {
    question: 'How long does it take to integrate the Tournament API?',
    answer:
      'Integration time varies based on your existing infrastructure. Typically, basic integration takes 1-2 weeks, while full integration with custom features can take 4-6 weeks. We provide comprehensive documentation and dedicated support throughout the process.',
  },
  {
    question: 'Can I customize the white-label platform to match my brand?',
    answer:
      'Absolutely! Our white-label solution is fully customizable. You can modify colors, logos, fonts, and even add custom components. We work closely with your team to ensure the platform perfectly represents your brand identity.',
  },
  {
    question: 'What games do you support?',
    answer:
      'We support a wide range of popular esports titles including League of Legends, Valorant, CS2, Dota 2, Fortnite, Rocket League, and many more. We can also develop custom integrations for games not currently supported.',
  },
  {
    question: 'Do you offer a trial or demo?',
    answer:
      'Yes! We offer personalized demos where we showcase our platform capabilities tailored to your specific use case. Contact our sales team to schedule a demo and discuss your requirements.',
  },
  {
    question: 'What kind of support do you provide?',
    answer:
      'We offer tiered support options ranging from standard email support to 24/7 dedicated support with a personal account manager. Enterprise clients receive priority support with guaranteed response times.',
  },
]

export default function SaaSPage() {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('all')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const filteredServices =
    activeCategory === 'all'
      ? services
      : services.filter(service => service.category === activeCategory)

  const categories: { key: ServiceCategory; label: string }[] = [
    { key: 'all', label: 'All Services' },
    { key: 'tournament', label: 'Tournament Solutions' },
    { key: 'business', label: 'Business Services' },
    { key: 'technical', label: 'Technical Services' },
  ]

  return (
    <div className="min-h-screen bg-defendrBg">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-defendrRed/20 via-transparent to-transparent" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-defendrRed/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-defendrRed/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-defendrRed/20 text-defendrRed px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Zap className="w-4 h-4" />
              Enterprise-Grade Esports Solutions
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              DEFENDR{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-defendrRed to-pink-500">
                SaaS
              </span>{' '}
              Services
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-10">
              Power your esports ecosystem with our comprehensive suite of tournament management,
              analytics, and infrastructure solutions.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-defendrRed hover:bg-defendrRed/90 text-white px-8 py-4 rounded-xl font-semibold transition-all hover:scale-105"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#services"
                className="inline-flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-xl font-semibold transition-all"
              >
                Explore Services
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            {[
              { value: '500+', label: 'Tournaments Powered' },
              { value: '1M+', label: 'Players Served' },
              { value: '99.9%', label: 'Uptime SLA' },
              { value: '24/7', label: 'Support Available' },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-defendrRed mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Our Services</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Comprehensive esports solutions designed to scale with your business
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map(category => (
              <button
                key={category.key}
                onClick={() => setActiveCategory(category.key)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeCategory === category.key
                    ? 'bg-defendrRed text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map(service => (
              <div
                key={service.id}
                className={`relative bg-gray-800 rounded-2xl p-8 border transition-all hover:scale-105 hover:shadow-2xl ${
                  service.highlight
                    ? 'border-defendrRed shadow-lg shadow-defendrRed/20'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                {service.highlight && (
                  <div className="absolute -top-3 -right-3 bg-defendrRed text-white px-4 py-1 rounded-full text-xs font-bold">
                    Popular
                  </div>
                )}

                <div className="w-16 h-16 bg-defendrRed/20 rounded-2xl flex items-center justify-center text-defendrRed mb-6">
                  {service.icon}
                </div>

                <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                <p className="text-gray-400 mb-6">{service.description}</p>

                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                  <Clock className="w-4 h-4" />
                  <span>Delivery: {service.deliveryTime}</span>
                </div>

                <ul className="space-y-3 mb-6">
                  {service.features.slice(0, 4).map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-defendrRed flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                  {service.features.length > 4 && (
                    <li className="text-gray-500 text-sm pl-8">
                      +{service.features.length - 4} more features
                    </li>
                  )}
                </ul>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-defendrRed hover:text-white transition-colors font-semibold"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-24 px-6 bg-gray-900/50 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Trusted By Industry Leaders
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Join the growing list of organizations powering their esports with DEFENDR
            </p>
          </div>

          {/* Client Logos Carousel */}
          <div className="relative mb-16">
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-900/50 to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-900/50 to-transparent z-10" />

            <div className="flex gap-12 animate-scroll">
              {[
                {
                  name: 'Orange',
                  logo: 'https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/defendr_elements/Partners/images.png',
                },
                {
                  name: 'Gamefy',
                  logo: 'https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/defendr_elements/Partners/gamefy.png',
                },
                {
                  name: 'JSK',
                  logo: 'https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/defendr_elements/Partners/jsk.png',
                },
                {
                  name: 'Tuntel',
                  logo: 'https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/defendr_elements/Partners/tuntel.png',
                },
                {
                  name: 'TSF',
                  logo: 'https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/defendr_elements/Partners/tsf.png',
                },
                {
                  name: 'Orange',
                  logo: 'https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/defendr_elements/Partners/images.png',
                },
                {
                  name: 'Gamefy',
                  logo: 'https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/defendr_elements/Partners/gamefy.png',
                },
                {
                  name: 'JSK',
                  logo: 'https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/defendr_elements/Partners/jsk.png',
                },
              ].map((client, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-32 h-32 bg-gray-800 rounded-2xl flex items-center justify-center p-4 border border-gray-700 hover:border-defendrRed/50 transition-all hover:scale-110 group"
                >
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Client Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '50+', label: 'Enterprise Clients' },
              { value: '15+', label: 'Countries Served' },
              { value: '98%', label: 'Client Satisfaction' },
              { value: '3x', label: 'Average ROI' },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 bg-gray-800/50 rounded-xl border border-gray-700"
              >
                <div className="text-3xl md:text-4xl font-bold text-defendrRed mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Why Choose DEFENDR?</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Built by gamers, for gamers. We understand the esports industry inside and out.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'Enterprise Security',
                description: 'Bank-grade security with DDoS protection and data encryption.',
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'Lightning Fast',
                description: 'Optimized infrastructure for real-time gaming experiences.',
              },
              {
                icon: <Code className="w-8 h-8" />,
                title: 'Developer Friendly',
                description: 'Clean APIs, comprehensive docs, and dedicated support.',
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: 'Global Scale',
                description: 'Infrastructure designed to handle millions of concurrent users.',
              },
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-defendrRed/20 rounded-2xl flex items-center justify-center text-defendrRed mx-auto mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Flexible Pricing</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Tailored solutions for organizations of all sizes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <div
                key={index}
                className={`relative bg-gray-800 rounded-2xl p-8 border transition-all ${
                  tier.popular
                    ? 'border-defendrRed shadow-lg shadow-defendrRed/20 scale-105'
                    : 'border-gray-700'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-defendrRed text-white px-6 py-1 rounded-full text-sm font-bold">
                    Most Popular
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{tier.description}</p>
                  <div className="text-4xl font-bold text-defendrRed">{tier.price}</div>
                </div>

                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-defendrRed flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/contact"
                  className={`block text-center py-4 rounded-xl font-semibold transition-all ${
                    tier.popular
                      ? 'bg-defendrRed hover:bg-defendrRed/90 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 bg-gray-900/50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-400 text-lg">Got questions? We have answers.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="text-white font-semibold pr-4">{faq.question}</span>
                  {expandedFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-defendrRed flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-400">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-defendrRed/20 to-pink-500/20 rounded-3xl p-12 border border-defendrRed/30">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Power Your Esports Platform?
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Let&apos;s discuss how DEFENDR can help you build and scale your esports business.
              Schedule a free consultation with our team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-defendrRed hover:bg-defendrRed/90 text-white px-8 py-4 rounded-xl font-semibold transition-all hover:scale-105"
              >
                Schedule a Demo
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="mailto:saas@defendr.gg"
                className="inline-flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-xl font-semibold transition-all"
              >
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
