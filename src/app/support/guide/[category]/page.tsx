'use client'
import React, { useMemo, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Input from '@/components/ui/input'

// Demo YouTube IDs for placeholder - set real ones as needed
const YOUTUBE_IDS: Record<string, string | undefined> = {
  account: 'mQb4Ny3qfK4', // Example
  'game-registration': 'u5YxYjJfleI',
  subscription: 'z3w7JCu8bXw',
  'technical-troubles': 'mQb4Ny3qfK4',
  organizers: 'u5YxYjJfleI',
  'defendr-red': 'wDeey4H24u0', // Replace with true Defendr Red video
  'defendr-blue': undefined, // no video, show image
}

const STEPS: Record<string, string[]> = {
  account: [
    'Visit the registration page and fill out the form',
    'Verify your email address',
    'Complete your profile with gaming details',
  ],
  'game-registration': [
    'Navigate to your Profile settings',
    'Go to Connected Accounts',
    'Select a game and authorize access',
  ],
  subscription: [
    'Open Billing settings from your account menu',
    'Review and choose your subscription plan',
    'Enter payment details and confirm',
  ],
  'technical-troubles': [
    'Check your internet connection',
    'Clear browser cache and restart',
    'Contact Defendr support if issue persists',
  ],
  organizers: [
    'Open the Organizer dashboard',
    'Create a new tournament and fill in details',
    'Manage participants and monitor event progress',
  ],
  'defendr-red': [
    'Access Defendr Red via your dashboard',
    'Configure risk & safety options for your team/org',
    'Monitor for phishing, scam, or suspicious activities',
    'Reach out to Defendr Red response team if flagged',
  ],
  'defendr-blue': [
    'Enable Defendr Blue protection on your tournament or platform',
    'Customize filters for chat, reports and real-time safety',
    'Get insights and act immediately on flagged incidents',
    'Leverage the Defendr Blue dashboard for all analytics',
  ],
  web3: [
    'Connect your Defendr account to a wallet provider',
    'Authorize and verify your Web3 wallet',
    'Access Web3 rewards and blockchain features',
  ],
}

const FAQS: Record<string, { q: string; a: string }[]> = {
  'defendr-red': [
    {
      q: 'What is Defendr Red?',
      a: 'Defendr Red is an advanced cyber-security suite in Defendr for risk mitigation and deep threat response for teams, tournaments, and organizations.',
    },
    {
      q: 'Who should use Defendr Red?',
      a: 'Tournament organizers, esports orgs, and teams seeking advanced protection.',
    },
    {
      q: 'How does Defendr Red detect phishing or scams?',
      a: 'It combines automated threat intelligence feeds with user-report context.',
    },
    {
      q: 'Do I have to pay for Defendr Red?',
      a: 'Some features may be paid; contact Defendr sales for more info.',
    },
  ],
  'defendr-blue': [
    {
      q: 'What is Defendr Blue?',
      a: 'Defendr Blue defends communities and events in real-time using anti-abuse tech, filters, and pro moderation tools.',
    },
    {
      q: 'Can I use only Defendr Blue for my tournaments?',
      a: 'Yes. You can enable it for all tournaments or just specific events.',
    },
    {
      q: 'Does Defendr Blue require user setup?',
      a: 'Just a simple activation and occasional review of flagged activity.',
    },
    {
      q: 'Can Defendr Blue block hate speech?',
      a: 'Yes, with specialized language models and fast admin notification.',
    },
    { q: 'More info?', a: 'Contact Defendr for a private demo.' },
  ],
}

const BLUE_IMAGE = 'https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/defendr_elements/bleu.png'

export default function CategoryGuidePage() {
  const params = useParams<{ category: string }>()
  const router = useRouter()
  const searchParams = useSearchParams()
  const selected = searchParams.get('t')
  const [filter, setFilter] = useState('')

  const key = params.category as string
  const steps = STEPS[key] || []
  const faqs = FAQS[key] || []
  const youTubeId = YOUTUBE_IDS[key]
  const showImage = key === 'defendr-blue' && !youTubeId

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <section className="bg-[#1F2428] border border-[#2A2F34] rounded-lg p-6">
        <div className="mb-5">
          <a
            href="/support/guide"
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 rounded-md bg-primary text-white text-sm font-semibold hover:opacity-90 transition"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to guide
          </a>
        </div>
        {/* Video or image preview */}
        <div className="mb-6 aspect-video w-full flex items-center justify-center bg-[#151A20] rounded-lg overflow-hidden border border-[#21262C]">
          {youTubeId ? (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${youTubeId}`}
              title="Guide Video"
              frameBorder="0"
              allowFullScreen
              className="w-full h-full min-h-[270px]"
            />
          ) : showImage ? (
            <img
              src={BLUE_IMAGE}
              alt="Defendr Blue"
              className="w-auto h-72 object-contain mx-auto"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-72 text-gray-500">
              No video for this section yet
            </div>
          )}
        </div>

        <h2 className="text-xl font-bold mb-4 text-white capitalize">{key.replace(/-/g, ' ')}</h2>
        <div className="mb-7">
          <ol className="list-decimal ml-8 space-y-2 text-gray-300">
            {steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </div>

        {/* Defendr Red and Blue: Full info and FAQ */}
        {(key === 'defendr-red' || key === 'defendr-blue') && (
          <section className="bg-[#252933] rounded-lg p-6 mt-8">
            <h3 className="text-2xl font-bold text-primary mb-4">
              {key === 'defendr-red' ? 'About Defendr Red' : 'About Defendr Blue'}
            </h3>
            <p className="mb-3 text-gray-100">
              {key === 'defendr-red'
                ? 'Defendr Red is Defendr’s most advanced suite for threat detection and emergency incident response. It offers powerful protection for esports organizations and tournaments against phishing, scams, and digital attacks.'
                : 'Defendr Blue is purpose-built for real-time community defense, providing moderation, abuse filtering, and immediate insight for large gaming events and tournaments.'}
            </p>
            <h4 className="text-primary font-bold mb-2">Main Features</h4>
            <ul className="list-disc pl-5 mb-4 text-gray-100">
              {key === 'defendr-red' ? (
                <>
                  <li>Real-time threat intelligence & incident alerts</li>
                  <li>Phishing, scam, malware detection and interception</li>
                  <li>Automated and manual escalation controls</li>
                  <li>Role-based access for staff and team admins</li>
                  <li>Direct contact with Defendr Red response team</li>
                </>
              ) : (
                <>
                  <li>Chat, social, and content moderation filters</li>
                  <li>Instant reporting & flagging for admins</li>
                  <li>AI-based hate speech prevention</li>
                  <li>Analytic dashboards for all incidents/events</li>
                  <li>Easy onboarding for tournaments or teams</li>
                </>
              )}
            </ul>
            <h4 className="text-primary font-bold mb-2">FAQ</h4>
            <ul className="space-y-2">
              {faqs.length ? (
                faqs.map((f, i) => (
                  <li key={i}>
                    <div className="font-semibold text-gray-200">Q: {f.q}</div>
                    <div className="text-gray-400">A: {f.a}</div>
                  </li>
                ))
              ) : (
                <li className="text-gray-400">No FAQ yet</li>
              )}
            </ul>
          </section>
        )}
      </section>
    </div>
  )
}
