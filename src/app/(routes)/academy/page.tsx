import Link from 'next/link'

import './academy.css'

export const metadata = {
  title: 'Defendr Academy | Level Up Your Esports Career',
  description:
    'Discover how Defendr Academy empowers aspiring professionals with esports bootcamps, expert-led training, and specialized tracks including referee and organizer certification.',
}

type Pillar = {
  title: string
  description: string
  bullets: string[]
}

const pillars: Pillar[] = [
  {
    title: 'Future-Ready Bootcamps',
    description:
      'Intensive, outcomes-driven programs that move participants from raw talent to industry-ready professionals.',
    bullets: [
      'Hands-on projects that simulate real tournament environments',
      'Mentorship from seasoned esports staff, coaches, and strategists',
      'Actionable career blueprints to help you land your first role',
    ],
  },
  {
    title: 'Expert-Led Training',
    description:
      "Learn directly from Defendr's ecosystem of tournament operators, broadcast crews, and performance coaches.",
    bullets: [
      'Live workshops, VOD libraries, and playbook templates',
      'Specialist tracks covering talent management, production, and analytics',
      'Access to office hours for feedback on your tournament or player projects',
    ],
  },
  {
    title: 'Specialized Pathways',
    description:
      "Choose the path that fits your ambition and build niche expertise that today's esports organizations demand.",
    bullets: [
      'Leadership tracks for aspiring general managers and head coaches',
      'Technical tracks for bracket admins, referees, and league operations',
      'Community tracks for social, partnerships, and fan experience leads',
    ],
  },
]

const refereeOrganizerHighlights: string[] = [
  'Rules interpretation, dispute resolution, and fair-play systems',
  'End-to-end tournament logistics, sponsor alignment, and talent booking',
  'Crisis management, broadcast coordination, and player relations',
]
type FloatingCharacter = {
  title: string
  subtitle: string
  position: string
  accent: string
  duration: string
  delay: string
}

const floatingCharacters: FloatingCharacter[] = [
  {
    title: 'Valorant Strat Lead',
    subtitle: 'Executes map control game plans with unrivaled comms discipline.',
    position: 'top-[10%] left-[4%]',
    accent: 'from-[#ff4655]/40 via-[#9b51e0]/20 to-transparent',
    duration: '14s',
    delay: '0s',
  },
  {
    title: 'League Macro Coach',
    subtitle: 'Guides teams through Baron setups and cross-map pressure calls.',
    position: 'top-[18%] right-[8%]',
    accent: 'from-[#0ac8b9]/40 via-[#005bea]/20 to-transparent',
    duration: '16s',
    delay: '3s',
  },
  {
    title: 'Rocket League Engineer',
    subtitle: 'Designs boost routes and rotation drills for highlight reels.',
    position: 'top-[48%] left-[12%]',
    accent: 'from-[#f2994a]/40 via-[#eb5757]/20 to-transparent',
    duration: '18s',
    delay: '1.5s',
  },
  {
    title: 'CS2 Stage Marshal',
    subtitle: 'Keeps clutch rounds fair with instant rulings and match resets.',
    position: 'bottom-[18%] right-[12%]',
    accent: 'from-[#f2c94c]/40 via-[#333333]/20 to-transparent',
    duration: '20s',
    delay: '4s',
  },
]

const AcademyPage = () => {
  return (
    <main className="min-h-screen bg-[#0f0f0f]">
      <div className="relative overflow-hidden bg-gradient-to-b from-[#1d1d1d] via-[#141414] to-[#0f0f0f]">
        <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 pb-24 pt-20 text-white lg:px-12">
          <header className="relative max-w-3xl space-y-6">
            <span className="inline-flex rounded-full border border-defendrRed/40 bg-defendrRed/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-defendrRed">
              Defendr Academy
            </span>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Esports is more than play. Build the skills to lead the next wave.
            </h1>
            <p className="text-lg text-gray-300">
              Defendr Academy equips aspiring pros, staff, and creators with real-world training.
              Our immersive bootcamps and expert-guided pathways help you master operations,
              leadership, and production so you can turn your passion into a career-defining edge.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="https://docs.google.com/forms/d/e/1FAIpQLSfIftTupJPmDj2UMtz9tGiYI3-hG1TeuC4Gf5VGkIymjgQl-g/viewform?fbclid=IwY2xjawOCpMhleHRuA2FlbQIxMABicmlkETFXSERjRkxhSmxuWkowRURic3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHjdEjnORzHDqFgC9keg1OL9NNLXuPJ_bNCz2iTFuU-jR1l1Ql2tF15H9nw7Y_aem_I0P7IYFavDf_tHRgCwMJiQ"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-defendrRed bg-defendrRed px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-defendrRed/90"
              >
                Register Interest
              </Link>
              <Link
                href="#referee-organizer"
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white transition hover:border-white hover:text-defendrRed"
              >
                Explore Tracks
              </Link>
            </div>

            <div className="pointer-events-none absolute inset-0 -z-[1] hidden xl:block">
              {floatingCharacters.map(character => (
                <div
                  key={character.title}
                  className={`academy-floating-card absolute ${character.position} w-64 rounded-2xl border border-white/10 bg-black/50 p-4 text-sm text-gray-200 shadow-lg backdrop-blur-lg`}
                  style={{
                    animationDuration: character.duration,
                    animationDelay: character.delay,
                  }}
                >
                  <div
                    className={`pointer-events-none absolute inset-0 -z-[1] rounded-2xl bg-gradient-to-br ${character.accent}`}
                  />
                  <div className="relative space-y-2">
                    <p className="text-xs uppercase tracking-[0.3em] text-defendrRed">
                      Game Specialist
                    </p>
                    <h3 className="text-lg font-semibold text-white">{character.title}</h3>
                    <p className="text-xs text-gray-200">{character.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </header>

          <section className="grid gap-8 lg:grid-cols-3">
            {pillars.map(pillar => (
              <article
                key={pillar.title}
                className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-white/5 p-8 backdrop-blur-sm transition hover:border-defendrRed/60 hover:bg-defendrRed/5"
              >
                <h2 className="text-2xl font-semibold text-white">{pillar.title}</h2>
                <p className="text-gray-300">{pillar.description}</p>
                <ul className="space-y-3 text-sm text-gray-400">
                  {pillar.bullets.map(item => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-1 inline-block h-2 w-2 flex-none rounded-full bg-defendrRed" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </section>

          <section id="referee-organizer" className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
            <div className="space-y-6">
              <h2 className="text-3xl font-semibold text-white">
                New pilot: Esports Referee &amp; Organizer training
              </h2>
              <p className="text-gray-300">
                We are gathering interest for two focused programs that teach the backbone skills of
                competitive esports. Whether you want to own the stage as a tournament organizer or
                safeguard fair play as a referee, our curriculum prepares you with the systems,
                checklists, and decision-making frameworks used by professionals.
              </p>
              <ul className="space-y-3 text-sm text-gray-300">
                {refereeOrganizerHighlights.map(point => (
                  <li key={point} className="flex gap-3">
                    <span className="mt-1 inline-block h-2 w-2 flex-none rounded-full bg-defendrRed" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  href="https://docs.google.com/forms/d/e/1FAIpQLSfIftTupJPmDj2UMtz9tGiYI3-hG1TeuC4Gf5VGkIymjgQl-g/viewform?fbclid=IwY2xjawOCpMhleHRuA2FlbQIxMABicmlkETFXSERjRkxhSmxuWkowRURic3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHjdEjnORzHDqFgC9keg1OL9NNLXuPJ_bNCz2iTFuU-jR1l1Ql2tF15H9nw7Y_aem_I0P7IYFavDf_tHRgCwMJiQ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-defendrRed bg-defendrRed px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-defendrRed/90"
                >
                  Join the Pilot
                </Link>
                <Link
                  href="mailto:academy@defendr.gg"
                  className="rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white transition hover:border-white hover:text-defendrRed"
                >
                  Talk to our team
                </Link>
              </div>
            </div>

            <aside className="relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-defendrRed/20 via-transparent to-black/40 p-8 text-gray-200 shadow-lg">
              <h3 className="text-xl font-semibold text-white">
                Why esports careers are just getting started
              </h3>
              <p className="mt-4 text-sm text-gray-300">
                Esports is one of the fastest-growing industries in the world. Organizations of
                every size now hire referees, production leads, partnership managers, and event
                operators to deliver unforgettable competition experiences. Defendr Academy gives
                you the structure and community to earn those roles.
              </p>
              <div className="mt-6 rounded-xl border border-white/10 bg-black/30 p-6 text-sm text-gray-300">
                <p className="font-semibold text-white">What you get:</p>
                <ul className="mt-3 space-y-2">
                  <li>• Guided tracks tailored to your career goals</li>
                  <li>• Community scrims, VOD reviews, and live feedback</li>
                  <li>• Early access to Defendr ecosystem opportunities</li>
                </ul>
              </div>
            </aside>
          </section>

          <section className="rounded-2xl border border-white/5 bg-white/5 p-10 text-gray-200 backdrop-blur">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-semibold text-white">Ready to build your path?</h2>
                <p className="text-gray-300">
                  Share your goals in our interest form and we&apos;ll reach out with schedules,
                  pricing, and pre-work so you can hit the ground running. Bring your passion -
                  Defendr Academy will supply the systems, mentors, and community to help you
                  thrive.
                </p>
              </div>
              <div className="flex flex-col items-start gap-4 rounded-2xl border border-defendrRed/40 bg-defendrRed/10 p-6">
                <p className="text-sm uppercase tracking-wider text-defendrRed">
                  Step 1: Tell us about you
                </p>
                <Link
                  href="https://docs.google.com/forms/d/e/1FAIpQLSfIftTupJPmDj2UMtz9tGiYI3-hG1TeuC4Gf5VGkIymjgQl-g/viewform?fbclid=IwY2xjawOCpMhleHRuA2FlbQIxMABicmlkETFXSERjRkxhSmxuWkowRURic3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHjdEjnORzHDqFgC9keg1OL9NNLXuPJ_bNCz2iTFuU-jR1l1Ql2tF15H9nw7Y_aem_I0P7IYFavDf_tHRgCwMJiQ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-defendrRed bg-defendrRed px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-defendrRed/90"
                >
                  Complete the interest form
                </Link>
                <p className="text-xs text-gray-400">
                  We&apos;ll follow up with program details, enrollment steps, and next available
                  cohort dates.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

export default AcademyPage
