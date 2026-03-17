'use client'

import { useState } from 'react'
import { Lock, Check, X, Languages } from 'lucide-react'

type Language = 'en' | 'fr'

export default function OrangePartnerDocs() {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState(false)
  const [language, setLanguage] = useState<Language>('en')

  const translations = {
    en: {
      loginTitle: 'Orange Partner Access',
      loginSubtitle: 'Enter password to view API documentation',
      loginPlaceholder: 'Enter password',
      loginButton: 'Access Documentation',
      loginError: 'Incorrect password',
      headerTitle: 'Orange Partner Portal',
      headerSubtitle: 'SaaS Tournament & Bracket API (v1)',
      headerDescription:
        'Multi-tenant bracket/tournament engine as a SaaS with a clean HTTP API that can power DEFENDR admin tooling and external clients.',
      goalsTitle: 'Goals',
      goals: [
        'Multi-tenant by default: every request is scoped to an account (SaaS customer/org)',
        'Provide core tournament primitives (participants → seeding → bracket generation → match results → standings)',
        'Keep endpoints predictable and testable: JSON-in / JSON-out with clear validation rules',
        'Offer operational quality for SaaS: API keys, rate limiting, logging, error format, versioning, OpenAPI',
      ],
      nonGoalsTitle: 'Non-goals (v1)',
      nonGoals: [
        'Full payments/billing automation beyond a minimal status gate',
        'Real-time live scoring client SDKs (can come later; sockets optional)',
        'Full esports rulesets per game (map pools, bans/picks, etc.) beyond a minimal validation baseline',
      ],
      tenancyTitle: 'Tenancy Model',
      tenancyRulesTitle: 'Tenancy Rules',
      tenancyRules: [
        'Every request must resolve to an accountId',
        'Primary auth: x-api-key maps to an account',
        'The service is designed as an engine: you send JSON, you get JSON back',
        'No database persistence in v1: all operations are stateless, request → response',
      ],
      suggestedEntitiesTitle: 'Suggested Entities (SaaS-minimal)',
      apiConventionsTitle: 'API Conventions',
      versioning: 'Versioning',
      versioningDesc: 'Prefix all routes with',
      requestMetadata: 'Request/Trace Metadata',
      requestMetadataDesc: 'Accept x-request-id (generate if missing); return it in responses',
      idempotency: 'Idempotency',
      idempotencyDesc: 'For create/commit endpoints, support Idempotency-Key header',
      security: 'Security / Privacy',
      securityDesc: 'API keys are write-only; store hash only; mask keys in lists',
      errorFormat: 'Error Format',
      endpointCatalogTitle: 'Endpoint Catalog',
      authAccountsTitle: 'Auth / Accounts',
      platformMetaTitle: 'Platform / Meta',
      tournamentsTitle: 'Tournaments',
      bracketsSingleTitle: 'Brackets – Single Elimination',
      bracketsDoubleTitle: 'Brackets – Double Elimination',
      bracketsGroupsTitle: 'Brackets – Groups / Round Robin',
      matchesTitle: 'Matches',
      prizesTitle: 'Prizes',
      roundsTitle: 'Rounds',
      teamsParticipantsTitle: 'Teams / Participants / Orgs / Users (Helpers)',
      infrastructureTitle: 'Cross-cutting / Infrastructure',
      deliveryRoadmapTitle: 'Delivery Roadmap',
      phase0Title: 'Phase 0 — SaaS foundation (weeks 1-2)',
      phase0Desc:
        'Project setup/tooling, error format, logging, OpenAPI baseline. /v1/health, /v1/meta. Accounts + API key lifecycle + auth hook.',
      phase1Title: 'Phase 1 — Tournament planning & seeding (weeks 3-4)',
      phase1Desc:
        '/v1/games, /v1/formats (config-driven). /v1/tournaments/plan and /v1/participants/normalize. /v1/tournaments/seed.',
      phase2Title: 'Phase 2 — Single elimination (weeks 5-7)',
      phase2Desc:
        '/v1/brackets/single/generate + /update. /v1/matches/validate-result + /apply-result.',
      phase3Title: 'Phase 3 — Double elimination + groups (weeks 8-10)',
      phase3Desc:
        'Double elimination generation/update. Groups generation/update + standings. /v1/rounds/generate + /v1/rounds/standing.',
      phase4Title: 'Phase 4 — Scheduling + prizes + docs polish (weeks 11-12)',
      phase4Desc:
        'Match scheduling constraints. Prize allocation/simulation. Docs/examples, hardening (load tests, timeouts, edge cases).',
      exitCriteria: 'Exit criteria:',
      exitCriteria0:
        'external client can authenticate and hit health/meta reliably; keys can be issued/revoked safely.',
      exitCriteria1:
        'given participants + constraints, service returns a stable normalized config and seeded list.',
      exitCriteria2:
        'clients can run a full single-elim tournament end-to-end (compute bracket, apply results).',
      feedbackTitle: 'Feedback & Notes',
      timelineFlexibilityTitle: '⏱️ Timeline Flexibility',
      timelineFlexibilityDesc:
        'If the negotiation process requires additional time, we are prepared to extend our deadline to ensure proper alignment and delivery quality.',
      futureServicesTitle: '🚀 Future Services & Expansion',
      futureServicesDesc:
        'We can add future services such as shop integration, esports leagues management, merchandise systems, ticketing platforms, and other ecosystem features as the partnership evolves.',
      footerCopyright: '© 2026 DEFENDR - Orange Partner Documentation',
      footerConfidential: 'Confidential & Proprietary',
      endpoint: 'Endpoint',
      purpose: 'Purpose',
      time: 'Time',
    },
    fr: {
      loginTitle: 'Accès Partenaire Orange',
      loginSubtitle: 'Entrez le mot de passe pour voir la documentation API',
      loginPlaceholder: 'Entrez le mot de passe',
      loginButton: 'Accéder à la Documentation',
      loginError: 'Mot de passe incorrect',
      headerTitle: 'Portail Partenaire Orange',
      headerSubtitle: 'API SaaS de Tournoi & Bracket (v1)',
      headerDescription:
        "Moteur de bracket/tournoi multi-tenant en tant que SaaS avec une API HTTP propre qui peut alimenter les outils d'administration DEFENDR et les clients externes.",
      goalsTitle: 'Objectifs',
      goals: [
        'Multi-tenant par défaut : chaque requête est limitée à un compte (client/org SaaS)',
        'Fournir des primitives de tournoi de base (participants → classement → génération de bracket → résultats de match → classements)',
        'Garder les endpoints prévisibles et testables : JSON-in / JSON-out avec des règles de validation claires',
        "Offrir une qualité opérationnelle pour SaaS : clés API, limitation de débit, journalisation, format d'erreur, versioning, OpenAPI",
      ],
      nonGoalsTitle: 'Non-objectifs (v1)',
      nonGoals: [
        "Automatisation complète des paiements/facturation au-delà d'une porte de statut minimale",
        'SDK clients de score en direct en temps réel (peut venir plus tard ; sockets optionnels)',
        "Règles complètes d'esports par jeu (pools de cartes, interdictions/sélections, etc.) au-delà d'une base de validation minimale",
      ],
      tenancyTitle: 'Modèle de Location',
      tenancyRulesTitle: 'Règles de Location',
      tenancyRules: [
        'Chaque requête doit être résolue en un accountId',
        'Authentification principale : x-api-key mappe à un compte',
        'Le service est conçu comme un moteur : vous envoyez du JSON, vous recevez du JSON',
        'Pas de persistance de base de données en v1 : toutes les opérations sont sans état, requête → réponse',
      ],
      suggestedEntitiesTitle: 'Entités Suggérées (SaaS-minimal)',
      apiConventionsTitle: 'Conventions API',
      versioning: 'Versioning',
      versioningDesc: 'Préfixer toutes les routes avec',
      requestMetadata: 'Métadonnées de Requête/Trace',
      requestMetadataDesc:
        'Accepter x-request-id (générer si manquant) ; le retourner dans les réponses',
      idempotency: 'Idempotence',
      idempotencyDesc: "Pour les endpoints de création/commit, supporter l'en-tête Idempotency-Key",
      security: 'Sécurité / Confidentialité',
      securityDesc:
        'Les clés API sont en écriture seule ; stocker uniquement le hash ; masquer les clés dans les listes',
      errorFormat: "Format d'Erreur",
      endpointCatalogTitle: "Catalogue d'Endpoints",
      authAccountsTitle: 'Auth / Comptes',
      platformMetaTitle: 'Plateforme / Meta',
      tournamentsTitle: 'Tournois',
      bracketsSingleTitle: 'Brackets – Élimination Simple',
      bracketsDoubleTitle: 'Brackets – Élimination Double',
      bracketsGroupsTitle: 'Brackets – Groupes / Round Robin',
      matchesTitle: 'Matchs',
      prizesTitle: 'Prix',
      roundsTitle: 'Rounds',
      teamsParticipantsTitle: 'Équipes / Participants / Orgs / Utilisateurs (Assistants)',
      infrastructureTitle: 'Transversal / Infrastructure',
      deliveryRoadmapTitle: 'Feuille de Route de Livraison',
      phase0Title: 'Phase 0 — Fondation SaaS (semaines 1-2)',
      phase0Desc:
        "Configuration du projet/outils, format d'erreur, journalisation, base OpenAPI. /v1/health, /v1/meta. Comptes + cycle de vie de clé API + hook d'authentification.",
      phase1Title: 'Phase 1 — Planification et classement de tournoi (semaines 3-4)',
      phase1Desc:
        '/v1/games, /v1/formats (piloté par configuration). /v1/tournaments/plan et /v1/participants/normalize. /v1/tournaments/seed.',
      phase2Title: 'Phase 2 — Élimination simple (semaines 5-7)',
      phase2Desc:
        '/v1/brackets/single/generate + /update. /v1/matches/validate-result + /apply-result.',
      phase3Title: 'Phase 3 — Élimination double + groupes (semaines 8-10)',
      phase3Desc:
        "Génération/mise à jour d'élimination double. Génération/mise à jour de groupes + classements. /v1/rounds/generate + /v1/rounds/standing.",
      phase4Title: 'Phase 4 — Planification + prix + polissage docs (semaines 11-12)',
      phase4Desc:
        'Contraintes de planification de match. Allocation/simulation de prix. Docs/exemples, durcissement (tests de charge, délais, cas limites).',
      exitCriteria: 'Critères de sortie :',
      exitCriteria0:
        "le client externe peut s'authentifier et atteindre health/meta de manière fiable ; les clés peuvent être émises/révoquées en toute sécurité.",
      exitCriteria1:
        'étant donné les participants + contraintes, le service retourne une configuration normalisée stable et une liste classée.',
      exitCriteria2:
        'les clients peuvent exécuter un tournoi complet à élimination simple de bout en bout (calcul du bracket, application des résultats).',
      feedbackTitle: 'Retours & Notes',
      timelineFlexibilityTitle: '⏱️ Flexibilité du Calendrier',
      timelineFlexibilityDesc:
        'Si le processus de négociation nécessite du temps supplémentaire, nous sommes prêts à prolonger notre échéance pour assurer un alignement et une qualité de livraison appropriés.',
      futureServicesTitle: '🚀 Services Futurs & Expansion',
      futureServicesDesc:
        "Nous pouvons ajouter des services futurs tels que l'intégration de boutique, la gestion de ligues esports, les systèmes de marchandise, les plateformes de billetterie et d'autres fonctionnalités d'écosystème au fur et à mesure que le partenariat évolue.",
      footerCopyright: '© 2026 DEFENDR - Documentation Partenaire Orange',
      footerConfidential: 'Confidentiel & Propriétaire',
      endpoint: 'Endpoint',
      purpose: 'Objectif',
      time: 'Temps',
    },
  }

  const t = translations[language]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'orange arena') {
      setIsAuthenticated(true)
      setError(false)
    } else {
      setError(true)
      setTimeout(() => setError(false), 2000)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100">
        <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl border border-orange-200">
          {/* Language Switcher */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
              className="flex items-center gap-2 px-3 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg transition-all font-semibold text-sm"
            >
              <Languages className="w-4 h-4" />
              {language === 'en' ? 'FR' : 'EN'}
            </button>
          </div>
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
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
                  error ? 'border-red-500 bg-red-50' : 'border-orange-200 focus:border-orange-500'
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
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {t.loginButton}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center p-2">
                <img
                  src="https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/defendr_elements/Partners/images.png"
                  alt="Orange Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-4xl font-bold">{t.headerTitle}</h1>
                <p className="text-orange-100 mt-1">{t.headerSubtitle}</p>
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
          <p className="text-orange-50 max-w-3xl">{t.headerDescription}</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-orange-100">
          {/* Goals Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
                1
              </span>
              {t.goalsTitle}
            </h2>
            <ul className="space-y-3">
              {t.goals.map((goal, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{goal}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Non-Goals Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
                2
              </span>
              {t.nonGoalsTitle}
            </h2>
            <ul className="space-y-3">
              {t.nonGoals.map((goal, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <X className="w-6 h-6 text-orange-300 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{goal}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Tenancy Model */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
                3
              </span>
              {t.tenancyTitle}
            </h2>
            <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-lg mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">{t.tenancyRulesTitle}</h3>
              <ul className="space-y-2">
                {t.tenancyRules.map((rule, idx) => (
                  <li key={idx} className="text-gray-700">
                    • {rule}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-white to-orange-50 border border-orange-200 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">{t.suggestedEntitiesTitle}</h3>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-orange-100">
                  <code className="text-orange-600 font-semibold">Account:</code>
                  <p className="text-gray-700 mt-1">
                    id, name, email, status (active|paused|disabled), createdAt
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-orange-100">
                  <code className="text-orange-600 font-semibold">ApiKey:</code>
                  <p className="text-gray-700 mt-1">
                    id, accountId, name (optional), prefix (for display), hash, lastUsedAt,
                    revokedAt, createdAt
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* API Conventions */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
                4
              </span>
              {t.apiConventionsTitle}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                <h3 className="font-bold text-gray-800 mb-2">{t.versioning}</h3>
                <p className="text-gray-700">
                  {t.versioningDesc}{' '}
                  <code className="bg-white px-2 py-1 rounded text-orange-600">/v1/...</code>
                </p>
              </div>
              <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                <h3 className="font-bold text-gray-800 mb-2">{t.requestMetadata}</h3>
                <p className="text-gray-700">{t.requestMetadataDesc}</p>
              </div>
              <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                <h3 className="font-bold text-gray-800 mb-2">{t.idempotency}</h3>
                <p className="text-gray-700">{t.idempotencyDesc}</p>
              </div>
              <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                <h3 className="font-bold text-gray-800 mb-2">{t.security}</h3>
                <p className="text-gray-700">{t.securityDesc}</p>
              </div>
            </div>

            <div className="mt-6 bg-gray-900 text-gray-100 p-6 rounded-lg">
              <h3 className="font-bold text-orange-400 mb-3">{t.errorFormat}</h3>
              <pre className="text-sm overflow-x-auto">
                {`{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "seed must be an integer",
    "details": [{ 
      "path": "participants[0].seed", 
      "issue": "Expected integer" 
    }]
  },
  "requestId": "..."
}`}
              </pre>
            </div>
          </section>

          {/* Endpoint Catalog */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
                5
              </span>
              {t.endpointCatalogTitle}
            </h2>

            {/* Auth / Accounts */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-orange-600 mb-4">{t.authAccountsTitle}</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-orange-500 text-white">
                      <th className="p-3 text-left font-semibold">{t.endpoint}</th>
                      <th className="p-3 text-left font-semibold">{t.purpose}</th>
                      <th className="p-3 text-left font-semibold">{t.time}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-orange-100 hover:bg-orange-50">
                      <td className="p-3">
                        <code className="text-orange-600">POST /v1/accounts</code>
                      </td>
                      <td className="p-3 text-gray-700">Create a SaaS account</td>
                      <td className="p-3 text-gray-700">1–2 days</td>
                    </tr>
                    <tr className="border-b border-orange-100 hover:bg-orange-50">
                      <td className="p-3">
                        <code className="text-orange-600">
                          POST /v1/accounts/:accountId/api-keys
                        </code>
                      </td>
                      <td className="p-3 text-gray-700">Generate API key</td>
                      <td className="p-3 text-gray-700">2 days</td>
                    </tr>
                    <tr className="border-b border-orange-100 hover:bg-orange-50">
                      <td className="p-3">
                        <code className="text-orange-600">
                          GET /v1/accounts/:accountId/api-keys
                        </code>
                      </td>
                      <td className="p-3 text-gray-700">List API keys (masked)</td>
                      <td className="p-3 text-gray-700">1 day</td>
                    </tr>
                    <tr className="border-b border-orange-100 hover:bg-orange-50">
                      <td className="p-3">
                        <code className="text-orange-600">
                          DELETE /v1/accounts/:accountId/api-keys/:keyId
                        </code>
                      </td>
                      <td className="p-3 text-gray-700">Revoke API key</td>
                      <td className="p-3 text-gray-700">0.5–1 day</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Platform / Meta */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-orange-600 mb-4">{t.platformMetaTitle}</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-orange-500 text-white">
                      <th className="p-3 text-left font-semibold">{t.endpoint}</th>
                      <th className="p-3 text-left font-semibold">{t.purpose}</th>
                      <th className="p-3 text-left font-semibold">{t.time}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-orange-100 hover:bg-orange-50">
                      <td className="p-3">
                        <code className="text-orange-600">GET /v1/health</code>
                      </td>
                      <td className="p-3 text-gray-700">Health check</td>
                      <td className="p-3 text-gray-700">0.5 day</td>
                    </tr>
                    <tr className="border-b border-orange-100 hover:bg-orange-50">
                      <td className="p-3">
                        <code className="text-orange-600">GET /v1/meta</code>
                      </td>
                      <td className="p-3 text-gray-700">Service metadata</td>
                      <td className="p-3 text-gray-700">0.5 day</td>
                    </tr>
                    <tr className="border-b border-orange-100 hover:bg-orange-50">
                      <td className="p-3">
                        <code className="text-orange-600">GET /v1/games</code>
                      </td>
                      <td className="p-3 text-gray-700">Supported games/modes</td>
                      <td className="p-3 text-gray-700">1 day</td>
                    </tr>
                    <tr className="border-b border-orange-100 hover:bg-orange-50">
                      <td className="p-3">
                        <code className="text-orange-600">GET /v1/formats</code>
                      </td>
                      <td className="p-3 text-gray-700">Supported formats</td>
                      <td className="p-3 text-gray-700">1 day</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tournaments */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-orange-600 mb-4">{t.tournamentsTitle}</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-orange-500 text-white">
                      <th className="p-3 text-left font-semibold">{t.endpoint}</th>
                      <th className="p-3 text-left font-semibold">{t.purpose}</th>
                      <th className="p-3 text-left font-semibold">{t.time}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-orange-100 hover:bg-orange-50">
                      <td className="p-3">
                        <code className="text-orange-600">POST /v1/tournaments/create</code>
                      </td>
                      <td className="p-3 text-gray-700">Create a new tournament</td>
                      <td className="p-3 text-gray-700">2–3 days</td>
                    </tr>
                    <tr className="border-b border-orange-100 hover:bg-orange-50">
                      <td className="p-3">
                        <code className="text-orange-600">POST /v1/tournaments/plan</code>
                      </td>
                      <td className="p-3 text-gray-700">Normalize tournament definition</td>
                      <td className="p-3 text-gray-700">3–4 days</td>
                    </tr>
                    <tr className="border-b border-orange-100 hover:bg-orange-50">
                      <td className="p-3">
                        <code className="text-orange-600">POST /v1/tournaments/seed</code>
                      </td>
                      <td className="p-3 text-gray-700">Seed participants</td>
                      <td className="p-3 text-gray-700">2–3 days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Brackets - Single Elimination */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-orange-600 mb-4">{t.bracketsSingleTitle}</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-orange-500 text-white">
                      <th className="p-3 text-left font-semibold">{t.endpoint}</th>
                      <th className="p-3 text-left font-semibold">{t.purpose}</th>
                      <th className="p-3 text-left font-semibold">{t.time}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-orange-100 hover:bg-orange-50">
                      <td className="p-3">
                        <code className="text-orange-600">POST /v1/brackets/single/generate</code>
                      </td>
                      <td className="p-3 text-gray-700">Generate bracket</td>
                      <td className="p-3 text-gray-700">4–6 days</td>
                    </tr>
                    <tr className="border-b border-orange-100 hover:bg-orange-50">
                      <td className="p-3">
                        <code className="text-orange-600">POST /v1/brackets/single/update</code>
                      </td>
                      <td className="p-3 text-gray-700">Apply results</td>
                      <td className="p-3 text-gray-700">4 days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Brackets - Double Elimination */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-orange-600 mb-4">{t.bracketsDoubleTitle}</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-orange-500 text-white">
                      <th className="p-3 text-left font-semibold">{t.endpoint}</th>
                      <th className="p-3 text-left font-semibold">{t.purpose}</th>
                      <th className="p-3 text-left font-semibold">{t.time}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-orange-100 hover:bg-orange-50">
                      <td className="p-3">
                        <code className="text-orange-600">POST /v1/brackets/double/generate</code>
                      </td>
                      <td className="p-3 text-gray-700">Generate bracket</td>
                      <td className="p-3 text-gray-700">4–6 days</td>
                    </tr>
                    <tr className="border-b border-orange-100 hover:bg-orange-50">
                      <td className="p-3">
                        <code className="text-orange-600">POST /v1/brackets/double/update</code>
                      </td>
                      <td className="p-3 text-gray-700">Apply results</td>
                      <td className="p-3 text-gray-700">4–6 days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Brackets - Groups / Round Robin */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-orange-600 mb-4">{t.bracketsGroupsTitle}</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-orange-500 text-white">
                      <th className="p-3 text-left font-semibold">{t.endpoint}</th>
                      <th className="p-3 text-left font-semibold">{t.purpose}</th>
                      <th className="p-3 text-left font-semibold">{t.time}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-orange-100 hover:bg-orange-50">
                      <td className="p-3">
                        <code className="text-orange-600">POST /v1/brackets/groups/generate</code>
                      </td>
                      <td className="p-3 text-gray-700">Generate group stage</td>
                      <td className="p-3 text-gray-700">4–6 days</td>
                    </tr>
                    <tr className="border-b border-orange-100 hover:bg-orange-50">
                      <td className="p-3">
                        <code className="text-orange-600">POST /v1/brackets/groups/update</code>
                      </td>
                      <td className="p-3 text-gray-700">Apply results & standings</td>
                      <td className="p-3 text-gray-700">4 days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Matches */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-orange-600 mb-4">{t.matchesTitle}</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-orange-500 text-white">
                      <th className="p-3 text-left font-semibold">{t.endpoint}</th>
                      <th className="p-3 text-left font-semibold">{t.purpose}</th>
                      <th className="p-3 text-left font-semibold">{t.time}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-orange-100 hover:bg-orange-50">
                      <td className="p-3">
                        <code className="text-orange-600">POST /v1/matches/validate-result</code>
                      </td>
                      <td className="p-3 text-gray-700">Validate score structure</td>
                      <td className="p-3 text-gray-700">2 days</td>
                    </tr>
                    <tr className="border-b border-orange-100 hover:bg-orange-50">
                      <td className="p-3">
                        <code className="text-orange-600">POST /v1/matches/apply-result</code>
                      </td>
                      <td className="p-3 text-gray-700">Validate + apply result</td>
                      <td className="p-3 text-gray-700">2–3 days</td>
                    </tr>
                    <tr className="border-b border-orange-100 hover:bg-orange-50">
                      <td className="p-3">
                        <code className="text-orange-600">POST /v1/matches/schedule</code>
                      </td>
                      <td className="p-3 text-gray-700">Schedule matches</td>
                      <td className="p-3 text-gray-700">4–6 days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Prizes */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-orange-600 mb-4">{t.prizesTitle}</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-orange-500 text-white">
                      <th className="p-3 text-left font-semibold">{t.endpoint}</th>
                      <th className="p-3 text-left font-semibold">{t.purpose}</th>
                      <th className="p-3 text-left font-semibold">{t.time}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-orange-100 hover:bg-orange-50">
                      <td className="p-3">
                        <code className="text-orange-600">POST /v1/prizes/allocate</code>
                      </td>
                      <td className="p-3 text-gray-700">Compute prize allocation</td>
                      <td className="p-3 text-gray-700">3–4 days</td>
                    </tr>
                    <tr className="border-b border-orange-100 hover:bg-orange-50">
                      <td className="p-3">
                        <code className="text-orange-600">POST /v1/prizes/simulate</code>
                      </td>
                      <td className="p-3 text-gray-700">Simulate prizes</td>
                      <td className="p-3 text-gray-700">1 day</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Rounds */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-orange-600 mb-4">{t.roundsTitle}</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-orange-500 text-white">
                      <th className="p-3 text-left font-semibold">{t.endpoint}</th>
                      <th className="p-3 text-left font-semibold">{t.purpose}</th>
                      <th className="p-3 text-left font-semibold">{t.time}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-orange-100 hover:bg-orange-50">
                      <td className="p-3">
                        <code className="text-orange-600">POST /v1/rounds/generate</code>
                      </td>
                      <td className="p-3 text-gray-700">Derive rounds from bracket</td>
                      <td className="p-3 text-gray-700">1 day</td>
                    </tr>
                    <tr className="border-b border-orange-100 hover:bg-orange-50">
                      <td className="p-3">
                        <code className="text-orange-600">POST /v1/rounds/standing</code>
                      </td>
                      <td className="p-3 text-gray-700">Compute standings</td>
                      <td className="p-3 text-gray-700">2–3 days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Teams / Participants / Orgs / Users */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-orange-600 mb-4">
                {t.teamsParticipantsTitle}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-orange-500 text-white">
                      <th className="p-3 text-left font-semibold">{t.endpoint}</th>
                      <th className="p-3 text-left font-semibold">{t.purpose}</th>
                      <th className="p-3 text-left font-semibold">{t.time}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-orange-100 hover:bg-orange-50">
                      <td className="p-3">
                        <code className="text-orange-600">POST /v1/participants/normalize</code>
                      </td>
                      <td className="p-3 text-gray-700">Normalize participant shape</td>
                      <td className="p-3 text-gray-700">0.5–1 day</td>
                    </tr>
                    <tr className="border-b border-orange-100 hover:bg-orange-50">
                      <td className="p-3">
                        <code className="text-orange-600">POST /v1/teams/validate</code>
                      </td>
                      <td className="p-3 text-gray-700">Validate rosters vs rules</td>
                      <td className="p-3 text-gray-700">1–1.5 days</td>
                    </tr>
                    <tr className="border-b border-orange-100 hover:bg-orange-50">
                      <td className="p-3">
                        <code className="text-orange-600">POST /v1/orgs/config/validate</code>
                      </td>
                      <td className="p-3 text-gray-700">Validate org config</td>
                      <td className="p-3 text-gray-700">1 day</td>
                    </tr>
                    <tr className="border-b border-orange-100 hover:bg-orange-50">
                      <td className="p-3">
                        <code className="text-orange-600">POST /v1/users/permissions/evaluate</code>
                      </td>
                      <td className="p-3 text-gray-700">Evaluate user permissions</td>
                      <td className="p-3 text-gray-700">2–3 days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Cross-cutting / Infrastructure */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-orange-600 mb-4">{t.infrastructureTitle}</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-orange-500 text-white">
                      <th className="p-3 text-left font-semibold">Item</th>
                      <th className="p-3 text-left font-semibold">{t.purpose}</th>
                      <th className="p-3 text-left font-semibold">{t.time}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-orange-100 hover:bg-orange-50">
                      <td className="p-3">
                        <strong className="text-orange-600">Project setup & tooling</strong>
                      </td>
                      <td className="p-3 text-gray-700">Initialize Fastify/TS project</td>
                      <td className="p-3 text-gray-700">3–4 days</td>
                    </tr>
                    <tr className="border-b border-orange-100 hover:bg-orange-50">
                      <td className="p-3">
                        <strong className="text-orange-600">Rate limiting per API key</strong>
                      </td>
                      <td className="p-3 text-gray-700">Middleware/hook</td>
                      <td className="p-3 text-gray-700">1–2 days</td>
                    </tr>
                    <tr className="border-b border-orange-100 hover:bg-orange-50">
                      <td className="p-3">
                        <strong className="text-orange-600">Docs & examples</strong>
                      </td>
                      <td className="p-3 text-gray-700">OpenAPI spec + curl examples</td>
                      <td className="p-3 text-gray-700">1–2 days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Delivery Roadmap */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
                8
              </span>
              {t.deliveryRoadmapTitle}
            </h2>
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-orange-50 to-white border-l-4 border-orange-500 p-6 rounded-r-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{t.phase0Title}</h3>
                <p className="text-gray-700 mb-3">{t.phase0Desc}</p>
                <div className="bg-white p-3 rounded border border-orange-200">
                  <p className="text-gray-900">
                    <strong className="text-orange-600">{t.exitCriteria}</strong> {t.exitCriteria0}
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-white border-l-4 border-orange-500 p-6 rounded-r-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{t.phase1Title}</h3>
                <p className="text-gray-700 mb-3">{t.phase1Desc}</p>
                <div className="bg-white p-3 rounded border border-orange-200">
                  <p className="text-gray-900">
                    <strong className="text-orange-600">{t.exitCriteria}</strong> {t.exitCriteria1}
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-white border-l-4 border-orange-500 p-6 rounded-r-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{t.phase2Title}</h3>
                <p className="text-gray-700 mb-3">{t.phase2Desc}</p>
                <div className="bg-white p-3 rounded border border-orange-200">
                  <p className="text-gray-900">
                    <strong className="text-orange-600">{t.exitCriteria}</strong> {t.exitCriteria2}
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-white border-l-4 border-orange-500 p-6 rounded-r-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-3">{t.phase3Title}</h3>
                <div className="bg-white p-3 rounded border border-orange-200">
                  <p className="text-gray-900">{t.phase3Desc}</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-white border-l-4 border-orange-500 p-6 rounded-r-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-3">{t.phase4Title}</h3>
                <div className="bg-white p-3 rounded border border-orange-200">
                  <p className="text-gray-900">{t.phase4Desc}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Feedback Section */}
          <section className="mb-8">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-8 rounded-2xl shadow-xl">
              <h2 className="text-3xl font-bold mb-6">{t.feedbackTitle}</h2>
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                  <h3 className="font-bold text-orange-100 mb-2">{t.timelineFlexibilityTitle}</h3>
                  <p className="text-orange-50">{t.timelineFlexibilityDesc}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                  <h3 className="font-bold text-orange-100 mb-2">{t.futureServicesTitle}</h3>
                  <p className="text-orange-50">{t.futureServicesDesc}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-orange-100">{t.footerCopyright}</p>
          <p className="text-orange-200 text-sm mt-2">{t.footerConfidential}</p>
        </div>
      </footer>
    </div>
  )
}
