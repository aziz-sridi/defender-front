'use client'

import { useState } from 'react'
import { Lock, Check, X, Languages, Users, Trophy, Target, Zap } from 'lucide-react'

type Language = 'en' | 'fr'

export default function GamefyPartnerDocs() {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState(false)
  const [language, setLanguage] = useState<Language>('en')

  const translations = {
    en: {
      loginTitle: 'Gamefy Academy Access',
      loginSubtitle: 'Enter password to view partnership proposal',
      loginPlaceholder: 'Enter password',
      loginButton: 'Access Documentation',
      loginError: 'Incorrect password',
      headerTitle: 'DEFENDR.gg × Gamefy Academy',
      headerSubtitle: 'Strategic Partnership Proposal',
      executiveSummary: 'Executive Summary',
      partnershipType: 'Partnership Type',
      partnershipTypeValue: 'Strategic Platform + Production Collaboration',
      coreOffer: 'Core Offer',
      coreOfferValue: 'Infinity Premium Membership + Event & Production Partnership',
      whatDefendrProvides: 'What DEFENDR.gg Provides',
      whatGamefyProvides: 'What Gamefy Academy Provides',
      commercialStructure: 'Commercial Structure (Simple & Transparent)',
      mutualBenefits: 'Mutual Benefits',
      introduction: 'Introduction',
      sharedVision: 'Shared Vision',
      partnershipObjectives: 'Partnership Objectives',
      keySynergy: 'Key Synergy Areas',
      tournamentInfra: 'Tournament & League Infrastructure',
      playerDevelopment: 'Player Development & Performance Tracking',
      exclusiveLeagues: 'Exclusive Gamefy Academy Leagues',
      monetization: 'Monetization & Revenue Sharing',
      branding: 'Branding & Marketing Collaboration',
      discountedPlan: 'Discounted Premium Subscription (Infinity Plan)',
      operationalFormula: 'Operational & Revenue Formula',
      legalFramework: 'Legal Framework & Terms',
      signature: 'Signature & Acceptance',
      footerCopyright: '© 2026 DEFENDR.gg - Gamefy Academy Partnership',
      footerConfidential: 'Confidential & Proprietary',
    },
    fr: {
      loginTitle: 'Accès Gamefy Academy',
      loginSubtitle: 'Entrez le mot de passe pour voir la proposition de partenariat',
      loginPlaceholder: 'Entrez le mot de passe',
      loginButton: 'Accéder à la Documentation',
      loginError: 'Mot de passe incorrect',
      headerTitle: 'DEFENDR.gg × Gamefy Academy',
      headerSubtitle: 'Proposition de Partenariat Stratégique',
      executiveSummary: 'Résumé Exécutif',
      partnershipType: 'Type de Partenariat',
      partnershipTypeValue: 'Plateforme Stratégique + Collaboration de Production',
      coreOffer: 'Offre Principale',
      coreOfferValue: 'Abonnement Premium Infinity + Partenariat Événements & Production',
      whatDefendrProvides: 'Ce que DEFENDR.gg Fournit',
      whatGamefyProvides: 'Ce que Gamefy Academy Fournit',
      commercialStructure: 'Structure Commerciale (Simple & Transparente)',
      mutualBenefits: 'Avantages Mutuels',
      introduction: 'Introduction',
      sharedVision: 'Vision Partagée',
      partnershipObjectives: 'Objectifs du Partenariat',
      keySynergy: 'Domaines de Synergie Clés',
      tournamentInfra: 'Infrastructure de Tournois & Ligues',
      playerDevelopment: 'Développement des Joueurs & Suivi des Performances',
      exclusiveLeagues: 'Ligues Exclusives Gamefy Academy',
      monetization: 'Monétisation & Partage des Revenus',
      branding: 'Collaboration de Marque & Marketing',
      discountedPlan: 'Abonnement Premium à Prix Réduit (Plan Infinity)',
      operationalFormula: 'Formule Opérationnelle & Revenus',
      legalFramework: 'Cadre Juridique & Conditions',
      signature: 'Signature & Acceptation',
      footerCopyright: '© 2026 DEFENDR.gg - Partenariat Gamefy Academy',
      footerConfidential: 'Confidentiel & Propriétaire',
    },
  }

  const t = translations[language]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'gamefy') {
      setIsAuthenticated(true)
      setError(false)
    } else {
      setError(true)
      setTimeout(() => setError(false), 2000)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-indigo-100">
        <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl border border-purple-200">
          {/* Language Switcher */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
              className="flex items-center gap-2 px-3 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-all font-semibold text-sm"
            >
              <Languages className="w-4 h-4" />
              {language === 'en' ? 'FR' : 'EN'}
            </button>
          </div>
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
              <Lock className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">{t.loginTitle}</h1>
          <p className="text-center text-gray-600 mb-8">{t.loginSubtitle}</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={t.loginPlaceholder}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all ${
                  error ? 'border-red-500 bg-red-50' : 'border-purple-200 focus:border-purple-500'
                }`}
              />
              {error && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                  <X className="w-4 h-4" /> {t.loginError}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {t.loginButton}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">{t.headerTitle}</h1>
                <p className="text-purple-100 mt-1">{t.headerSubtitle}</p>
              </div>
            </div>
            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-all font-semibold"
            >
              <Languages className="w-5 h-5" />
              {language === 'en' ? 'FR' : 'EN'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-purple-100">
          {/* Executive Summary */}
          <section className="mb-12">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-8 rounded-2xl shadow-xl mb-8">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <span className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <Target className="w-6 h-6" />
                </span>
                {t.executiveSummary}
              </h2>
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                  <p className="text-purple-100 font-semibold mb-2">{t.partnershipType}</p>
                  <p className="text-white text-lg">
                    Strategic Platform + Production Collaboration
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                  <p className="text-purple-100 font-semibold mb-2">{t.coreOffer}</p>
                  <p className="text-white text-lg">
                    Infinity Premium Membership + Event & Production Partnership
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gradient-to-br from-purple-50 to-white border-l-4 border-purple-500 p-6 rounded-r-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-600" />
                  {t.whatDefendrProvides}
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      Premium platform access (AI, tournaments, leagues)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Full tournament & league infrastructure</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Player performance tracking and rankings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      Promotion and visibility within the DEFENDR ecosystem
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-white border-l-4 border-indigo-500 p-6 rounded-r-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600" />
                  {t.whatGamefyProvides}
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Professional event hosting & management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Streaming and broadcast production</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Event moderation and execution</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Esports talent development</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-100 to-indigo-100 border border-purple-200 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">{t.commercialStructure}</h3>
              <div className="space-y-3">
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-gray-900">
                    <strong className="text-purple-600">100 TND / month:</strong> Infinity Premium
                    Membership (mandatory)
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-gray-900">
                    <strong className="text-purple-600">
                      Hosting / streaming / production services:
                    </strong>{' '}
                    Optional, invoiced per event
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-gray-900">
                    <strong className="text-purple-600">10% discount</strong> on Gamefy services for
                    DEFENDR events
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-gray-900">
                    <strong className="text-purple-600">No mandatory revenue sharing</strong> in the
                    core agreement
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-6 rounded-r-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">{t.mutualBenefits}</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Predictable costs and scalable operations</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    Increased visibility and credibility for both brands
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    New revenue streams without operational friction
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Long-term ecosystem growth</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Introduction */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                1
              </span>
              {t.introduction}
            </h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                This proposal outlines a strategic partnership between <strong>DEFENDR.gg</strong>,
                an esports tournament and ecosystem platform, and <strong>Gamefy Academy</strong>,
                an esports academy specializing in player training and event organization.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                The goal of this partnership is to combine training, competition, performance
                tracking, and visibility into a unified pathway that supports player development and
                sustainable esports growth.
              </p>
            </div>
          </section>

          {/* Shared Vision */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                2
              </span>
              {t.sharedVision}
            </h2>
            <div className="space-y-4">
              <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-lg">
                <p className="text-gray-800">
                  <strong>Gamefy Academy</strong> develops competitive talent through coaching,
                  training programs, and academy-led events.
                </p>
              </div>
              <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-r-lg">
                <p className="text-gray-800">
                  <strong>DEFENDR.gg</strong> structures esports competition through tournament
                  management, rankings, player statistics, and ecosystem connectivity.
                </p>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 p-6 rounded-lg">
                <p className="text-gray-800 font-semibold mb-3">Together, we aim to:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Build structured esports career pathways</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      Elevate the professionalism of academy competitions
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      Provide measurable value to players, coaches, and sponsors
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Partnership Objectives */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                3
              </span>
              {t.partnershipObjectives}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                'Professionalize Gamefy Academy tournaments using DEFENDR infrastructure',
                'Track and showcase player performance and progression',
                'Create exclusive academy leagues and circuits',
                'Generate shared revenue opportunities',
                'Increase visibility for both brands',
              ].map((objective, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-purple-50 to-white border border-purple-200 p-4 rounded-lg"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">{idx + 1}</span>
                    </div>
                    <p className="text-gray-700 text-sm">{objective}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Key Synergy Areas */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                4
              </span>
              {t.keySynergy}
            </h2>

            {/* 4.1 Tournament Infrastructure */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-purple-600 mb-4">4.1 {t.tournamentInfra}</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                  <h4 className="font-bold text-gray-800 mb-3">DEFENDR.gg will provide:</h4>
                  <ul className="space-y-2">
                    {[
                      'Tournament creation and management tools',
                      'Automated brackets and match workflows',
                      'Player and team registration systems',
                      'Rankings, leaderboards, and seasonal leagues',
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-purple-600 flex-shrink-0 mt-1" />
                        <span className="text-gray-700 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
                  <h4 className="font-bold text-gray-800 mb-3">Gamefy Academy will:</h4>
                  <ul className="space-y-2">
                    {[
                      'Organize and promote events',
                      'Ensure competitive integrity and coaching oversight',
                      'Manage player participation',
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-1" />
                        <span className="text-gray-700 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-4 bg-gradient-to-r from-purple-100 to-indigo-100 p-4 rounded-lg border border-purple-300">
                <p className="text-gray-900 font-semibold">
                  ✨ Result: Gamefy tournaments powered by DEFENDR.gg
                </p>
              </div>
            </div>

            {/* 4.2 Player Development */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-purple-600 mb-4">4.2 {t.playerDevelopment}</h3>
              <div className="bg-gradient-to-br from-white to-purple-50 border border-purple-200 p-6 rounded-lg">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      Academy players compete on DEFENDR-hosted events
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      Match results and statistics are recorded on player profiles
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      Players build a verified competitive history
                    </span>
                  </li>
                </ul>
                <div className="mt-4 bg-white p-4 rounded-lg border border-purple-200">
                  <p className="text-gray-800 font-semibold mb-2">Benefits:</p>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Coaches monitor progression over time</li>
                    <li>• Players gain a competitive "performance CV"</li>
                    <li>• Talent identification becomes data-driven</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 4.3 Exclusive Leagues */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-purple-600 mb-4">4.3 {t.exclusiveLeagues}</h3>
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 p-6 rounded-lg">
                <p className="text-gray-800 font-semibold mb-4">Jointly create:</p>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-white p-4 rounded-lg border border-purple-200">
                    <p className="text-purple-600 font-bold">Gamefy Academy League</p>
                    <p className="text-sm text-gray-600">(seasonal)</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-purple-200">
                    <p className="text-indigo-600 font-bold">Skill-based divisions</p>
                    <p className="text-sm text-gray-600">Beginner / Intermediate / Elite</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-purple-200">
                    <p className="text-purple-600 font-bold">Internal academy cups</p>
                    <p className="text-sm text-gray-600">and open community tournaments</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-purple-200">
                    <p className="text-gray-800 font-semibold mb-2">DEFENDR.gg manages:</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• League systems</li>
                      <li>• Rankings and rewards</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-indigo-200">
                    <p className="text-gray-800 font-semibold mb-2">Gamefy Academy manages:</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Coaching support</li>
                      <li>• Talent evaluation and promotion</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* 4.6 Pricing Table */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-purple-600 mb-4">4.6 {t.discountedPlan}</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow">
                  <thead>
                    <tr className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white">
                      <th className="p-4 text-left font-semibold">Item</th>
                      <th className="p-4 text-left font-semibold">Public Market Value</th>
                      <th className="p-4 text-left font-semibold">Gamefy Academy Offer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Infinity Premium Access', '250+ TND / month', '100 TND / month'],
                      ['AI Tools & Analytics', 'Included', 'Included'],
                      ['Unlimited Tournaments & Events', 'Limited / Paid', 'Unlimited'],
                      ['League & Ranking Systems', 'Add-on', 'Included'],
                      ['Organizer & Coach Dashboards', 'Premium', 'Included'],
                      ['Technical Support', 'Standard', 'Priority'],
                    ].map((row, idx) => (
                      <tr key={idx} className="border-b border-purple-100 hover:bg-purple-50">
                        <td className="p-4 font-medium text-gray-800">{row[0]}</td>
                        <td className="p-4 text-gray-700">{row[1]}</td>
                        <td className="p-4 text-purple-600 font-semibold">{row[2]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                <p className="text-gray-900">
                  <strong className="text-green-600">Key Value:</strong> Gamefy Academy receives a
                  heavily discounted, unlimited-access professional platform designed for scale.
                </p>
              </div>
            </div>

            {/* 4.7 Operational Formula */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-purple-600 mb-4">
                4.7 {t.operationalFormula}
              </h3>
              <div className="space-y-4">
                <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-lg">
                  <h4 className="font-bold text-gray-800 mb-2">
                    A. Platform Access & Management (Mandatory)
                  </h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>
                      • Gamefy Academy subscribes to the Infinity Premium Plan (for 2026 season or
                      till end of partnership)
                    </li>
                    <li>
                      • Fixed cost: <strong className="text-purple-600">100 TND / month</strong>
                    </li>
                    <li>• Unlimited access to AI tools, tournaments, leagues, and dashboards</li>
                  </ul>
                </div>
                <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-r-lg">
                  <h4 className="font-bold text-gray-800 mb-2">
                    B. Event Hosting, Streaming & Production Services (Optional)
                  </h4>
                  <p className="text-gray-700 mb-2">
                    Gamefy Academy may provide additional services for DEFENDR events:
                  </p>
                  <ul className="space-y-1 text-gray-700">
                    <li>• On-site or online event hosting</li>
                    <li>• Live streaming & broadcast management</li>
                    <li>• Event production, moderation, and logistics</li>
                  </ul>
                  <div className="mt-3 bg-white p-3 rounded border border-indigo-200">
                    <p className="text-gray-800">
                      <strong className="text-indigo-600">Commercial terms:</strong>
                    </p>
                    <p className="text-sm text-gray-700">
                      Services invoiced separately • DEFENDR gets 10% partnership discount
                    </p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 p-6 rounded-lg">
                  <h4 className="font-bold text-gray-800 mb-2">
                    E. Why This Collaboration Model Works
                  </h4>
                  <ul className="space-y-2">
                    {[
                      'Clear separation between SaaS access and services',
                      'Predictable costs for Gamefy Academy',
                      'Flexible monetization for both parties',
                      'Long-term strategic alignment without operational friction',
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Legal Framework */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                5
              </span>
              {t.legalFramework}
            </h2>
            <div className="space-y-6">
              {[
                {
                  title: '5.1 Nature of the Agreement',
                  content:
                    'This document constitutes a partnership proposal and commercial framework. Upon acceptance by both parties, it may serve as the basis for a formal Partnership Agreement or Memorandum of Understanding (MoU). Nothing in this proposal shall be construed as creating a joint venture, employment relationship, or exclusive obligation, unless expressly stated in a signed contract.',
                },
                {
                  title: '5.2 Partnership Duration & Renewal',
                  content:
                    'Initial term: Twelve (12) months from the effective date of signature. The partnership may be renewed for successive 12-month periods upon mutual written agreement. A strategic review will be conducted at 6 months to assess performance and alignment. Either party may terminate the partnership with thirty (30) days written notice.',
                },
                {
                  title: '5.3 Confidentiality',
                  content:
                    'Both parties agree to treat as confidential any non-public, commercial, technical, or strategic information exchanged within the scope of this partnership, unless disclosure is required by law or authorized in writing.',
                },
                {
                  title: '5.4 Intellectual Property',
                  content:
                    'Each party retains full ownership of its respective intellectual property, including but not limited to trademarks, logos, platforms, content, and proprietary technologies. Any co-branded materials or promotional assets shall be used solely for the purposes of this partnership.',
                },
                {
                  title: '5.5 Governing Law',
                  content:
                    'This partnership shall be governed and interpreted in accordance with the laws of the applicable jurisdiction agreed upon by both parties at the time of contract signature.',
                },
              ].map((section, idx) => (
                <div key={idx} className="bg-gray-50 border-l-4 border-gray-400 p-6 rounded-r-lg">
                  <h4 className="font-bold text-gray-800 mb-2">{section.title}</h4>
                  <p className="text-gray-700 text-sm">{section.content}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Signature Section */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                6
              </span>
              {t.signature}
            </h2>
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 p-6 rounded-lg">
              <p className="text-gray-700 mb-6">
                By signing below, both parties acknowledge that they have reviewed and agreed to the
                principles, commercial terms, and collaboration framework described in this
                document.
              </p>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg border border-purple-300">
                  <h3 className="font-bold text-purple-600 mb-4">For DEFENDR.gg</h3>
                  <div className="space-y-4 text-sm text-gray-700">
                    <div>
                      <p className="font-semibold">Name:</p>
                      <div className="border-b-2 border-gray-300 mt-2 h-8"></div>
                    </div>
                    <div>
                      <p className="font-semibold">Title:</p>
                      <div className="border-b-2 border-gray-300 mt-2 h-8"></div>
                    </div>
                    <div>
                      <p className="font-semibold">Signature:</p>
                      <div className="border-b-2 border-gray-300 mt-2 h-8"></div>
                    </div>
                    <div>
                      <p className="font-semibold">Date:</p>
                      <div className="border-b-2 border-gray-300 mt-2 h-8"></div>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-indigo-300">
                  <h3 className="font-bold text-indigo-600 mb-4">For Gamefy Academy</h3>
                  <div className="space-y-4 text-sm text-gray-700">
                    <div>
                      <p className="font-semibold">Name:</p>
                      <div className="border-b-2 border-gray-300 mt-2 h-8"></div>
                    </div>
                    <div>
                      <p className="font-semibold">Title:</p>
                      <div className="border-b-2 border-gray-300 mt-2 h-8"></div>
                    </div>
                    <div>
                      <p className="font-semibold">Signature:</p>
                      <div className="border-b-2 border-gray-300 mt-2 h-8"></div>
                    </div>
                    <div>
                      <p className="font-semibold">Date:</p>
                      <div className="border-b-2 border-gray-300 mt-2 h-8"></div>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-center text-sm text-gray-600 mt-6 italic">
                This document is intended to serve as a professional partnership proposal and a
                foundation for a formal agreement.
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-purple-100">{t.footerCopyright}</p>
          <p className="text-purple-200 text-sm mt-2">{t.footerConfidential}</p>
        </div>
      </footer>
    </div>
  )
}
