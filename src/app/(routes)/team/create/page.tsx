'use client'

import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  Users,
  Image as ImageIcon,
  Share2,
  ChevronRight,
  ChevronLeft,
  Check,
  Search,
} from 'lucide-react'

import Button from '@/components/ui/Button'
import Input from '@/components/ui/Inputs'
import Typo from '@/components/ui/Typo'
import { getAllGames } from '@/services/gameService'
import { createTeam } from '@/services/teamService'
import ImageUploadArea from '@/components/ui/ImageUploadArea'
import { DEFAULT_IMAGES } from '@/utils/imageUrlSanitizer'

// ── Validation ─────────────────────────────────────────────────────────────
const teamSchema = z.object({
  name: z.string().min(1, 'Team name is required'),
  description: z.string().optional(),
  facebook: z.string().url('Invalid Facebook URL').optional().or(z.literal('')),
  twitter: z.string().url('Invalid Twitter/X URL').optional().or(z.literal('')),
  instagram: z.string().url('Invalid Instagram URL').optional().or(z.literal('')),
  gameId: z.string().min(1, 'Please select a game'),
})
type TeamFormValues = z.infer<typeof teamSchema>

interface GameOption {
  _id: string
  name: string
}

// ── Steps config ────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'Basics', description: 'Name & game', icon: Users },
  { id: 2, label: 'Media', description: 'Logo & banner', icon: ImageIcon },
  { id: 3, label: 'Socials', description: 'Social links', icon: Share2 },
]

// ── Helpers ─────────────────────────────────────────────────────────────────
const FieldLabel = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
  <Typo
    as="label"
    className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1.5 block"
    fontFamily="poppins"
  >
    {children}
    {required && <span className="text-defendrRed ml-1">*</span>}
  </Typo>
)

const FieldError = ({ message }: { message?: string }) =>
  message ? (
    <Typo as="p" className="text-red-400 text-xs mt-1" fontFamily="poppins">
      {message}
    </Typo>
  ) : null

// ── Component ────────────────────────────────────────────────────────────────
export default function CreateTeam() {
  const dropdownRef = useRef<HTMLDivElement>(null)

  const [step, setStep] = useState(1)
  const [logo, setLogo] = useState<string>(DEFAULT_IMAGES.TEAM)
  const [cover, setCover] = useState<string>(DEFAULT_IMAGES.TEAM_BANNER)
  const [games, setGames] = useState<GameOption[]>([])
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [gameSearch, setGameSearch] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { data: session, update } = useSession()
  const router = useRouter()

  interface SessionUserWithTeams {
    teams?: unknown[]
    [k: string]: unknown
  }

  const refreshUser = async (newTeam?: unknown) => {
    const su = session?.user as SessionUserWithTeams | undefined
    const currentTeams = su?.teams ?? []
    if (!newTeam) {
      await update({ user: { ...(su || {}), teams: currentTeams } } as unknown)
      return
    }
    let next = currentTeams
    if (typeof newTeam === 'object' && newTeam) {
      const nt = newTeam as { _id?: string }
      const exists = currentTeams.some(
        t => typeof t === 'object' && t && (t as { _id?: string })._id === nt._id,
      )
      if (!exists) next = [...currentTeams, newTeam]
    } else {
      next = [...currentTeams, newTeam]
    }
    await update({ user: { ...(su || {}), teams: next } } as unknown)
  }

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    watch,
  } = useForm<TeamFormValues>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: '',
      description: '',
      facebook: '',
      twitter: '',
      instagram: '',
      gameId: '',
    },
  })

  useEffect(() => {
    getAllGames()
      .then(r => setGames(r || []))
      .catch(() => setGames([]))
  }, [])

  useEffect(() => {
    if (!dropdownOpen) return
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setDropdownOpen(false)
    }
    window.addEventListener('mousedown', onClick)
    return () => window.removeEventListener('mousedown', onClick)
  }, [dropdownOpen])

  const filteredGames = games.filter(g => g.name.toLowerCase().includes(gameSearch.toLowerCase()))
  const selectedGame = games.find(g => g._id === watch('gameId'))
  const descLen = (watch('description') || '').length

  const goNext = () => {
    if (step === 1) {
      if (!watch('name').trim()) {
        toast.error('Please enter a team name')
        return
      }
      if (!watch('gameId')) {
        toast.error('Please select a game')
        return
      }
    }
    setStep(s => Math.min(s + 1, 3))
  }
  const goPrev = () => setStep(s => Math.max(s - 1, 1))

  const onSubmit = async (data: TeamFormValues) => {
    setSubmitting(true)
    try {
      const payload = {
        name: data.name,
        description: data.description || '',
        game: data.gameId,
        gameId: data.gameId,
        facebook: data.facebook || '',
        twitter: data.twitter || '',
        instagram: data.instagram || '',
        profileImage: logo,
        coverImage: cover,
      }
      const result = await createTeam(payload)
      await refreshUser(result)
      toast.success('Team created successfully!')
      reset()
      setLogo(DEFAULT_IMAGES.TEAM)
      setCover(DEFAULT_IMAGES.TEAM_BANNER)
      router.push('/')
    } catch (err: unknown) {
      interface AxiosE {
        response?: { data?: { message?: string; error?: string } | string }
        message?: string
      }
      const e = err as AxiosE
      const d = e.response?.data
      const msg =
        (typeof d === 'string' && d) ||
        (d as { message?: string })?.message ||
        e?.message ||
        'Failed to create team'
      toast.error(String(msg))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Page header */}
        <div className="mb-10 text-center">
          <Typo
            as="h1"
            className="text-3xl md:text-4xl font-bold text-white mb-2"
            fontFamily="poppins"
            fontVariant="h2"
          >
            Create Your Team
          </Typo>
          <Typo as="p" className="text-gray-400 text-sm" fontFamily="poppins">
            Set up your competitive squad in just a few steps
          </Typo>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center mb-10">
          {STEPS.map((s, i) => {
            const isActive = step === s.id
            const isCompleted = step > s.id
            const Icon = s.icon
            return (
              <div key={s.id} className="flex items-center">
                <button
                  type="button"
                  onClick={() => {
                    if (isCompleted) setStep(s.id)
                  }}
                  className={`flex items-center gap-2 sm:gap-4 px-3 sm:px-5 py-3 sm:py-4 rounded-2xl transition-all duration-300 ${
                    isActive
                      ? 'bg-defendrRed/15 border border-defendrRed/40'
                      : isCompleted
                        ? 'cursor-pointer hover:bg-white/5'
                        : 'opacity-40 cursor-default'
                  }`}
                >
                  <div
                    className={`w-9 h-9 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      isCompleted
                        ? 'bg-green-500/20 text-green-400'
                        : isActive
                          ? 'bg-defendrRed text-white shadow-lg shadow-red-900/40'
                          : 'bg-white/5 text-gray-600'
                    }`}
                  >
                    {isCompleted ? <Check size={16} /> : <Icon size={16} />}
                  </div>
                  <div className="hidden sm:block text-left">
                    <Typo
                      as="p"
                      className={`text-sm font-bold leading-none ${
                        isActive ? 'text-white' : isCompleted ? 'text-green-400' : 'text-gray-600'
                      }`}
                      fontFamily="poppins"
                    >
                      {s.label}
                    </Typo>
                    <Typo as="p" className="text-xs text-gray-500 mt-1" fontFamily="poppins">
                      {s.description}
                    </Typo>
                  </div>
                </button>
                {i < STEPS.length - 1 && (
                  <div
                    className={`w-6 sm:w-14 h-[2px] mx-1 sm:mx-2 rounded-full transition-all duration-500 ${
                      isCompleted ? 'bg-green-500/50' : 'bg-white/10'
                    }`}
                  />
                )}
              </div>
            )
          })}
        </div>

        <div>
          <div className="grid lg:grid-cols-[1fr_280px] gap-6">
            {/* Main content panel */}
            <div className="bg-[#111114] border border-white/[0.07] rounded-2xl p-4 sm:p-6 md:p-8 overflow-hidden">
              {/* STEP 1 — Basics */}
              {step === 1 && (
                <div className="space-y-7">
                  <div>
                    <Typo
                      as="h2"
                      className="text-lg font-bold text-white mb-1"
                      fontFamily="poppins"
                    >
                      Team Basics
                    </Typo>
                    <Typo as="p" className="text-gray-500 text-sm" fontFamily="poppins">
                      Give your team an identity
                    </Typo>
                  </div>

                  {/* Name */}
                  <div>
                    <FieldLabel required>Team Name</FieldLabel>
                    <Controller
                      control={control}
                      name="name"
                      render={({ field }) => (
                        <Input
                          {...field}
                          value={field.value ?? ''}
                          onChange={field.onChange}
                          placeholder="e.g. Shadow Wolves"
                          size="m"
                          backgroundColor="#1c1c20"
                          borderColor={errors.name ? '#ef4444' : 'rgba(255,255,255,0.08)'}
                        />
                      )}
                    />
                    <FieldError message={errors.name?.message} />
                  </div>

                  {/* Game picker */}
                  <div>
                    <FieldLabel required>Select Game</FieldLabel>
                    <div ref={dropdownRef} className="relative">
                      <button
                        type="button"
                        onClick={() => setDropdownOpen(o => !o)}
                        className={`w-full h-[50px] px-5 rounded-2xl border text-sm font-poppins flex items-center justify-between transition-all duration-200 ${
                          errors.gameId
                            ? 'border-red-500 bg-[#1c1c20] text-white'
                            : dropdownOpen
                              ? 'border-defendrRed/60 bg-[#1c1c20] text-white'
                              : 'border-white/[0.08] bg-[#1c1c20] text-white hover:border-white/20'
                        }`}
                      >
                        <span className={selectedGame ? 'text-white' : 'text-gray-500'}>
                          {selectedGame?.name || 'Choose a game…'}
                        </span>
                        <ChevronRight
                          size={16}
                          className={`text-gray-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-90' : ''}`}
                        />
                      </button>

                      {dropdownOpen && (
                        <div className="absolute left-0 right-0 mt-1.5 z-50 bg-[#1c1c20] border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
                          {/* Clean inline search — no nested Input component to avoid double-border */}
                          <div className="p-3 border-b border-white/[0.07]">
                            <div className="flex items-center gap-2.5 bg-[#111114] rounded-xl px-3 py-2.5">
                              <Search size={14} className="text-gray-500 flex-shrink-0" />
                              <input
                                autoFocus
                                className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 outline-none font-poppins"
                                placeholder="Search games…"
                                value={gameSearch}
                                onChange={e => setGameSearch(e.target.value)}
                              />
                            </div>
                          </div>
                          <ul className="max-h-52 overflow-y-auto py-1">
                            {filteredGames.length === 0 ? (
                              <li className="px-4 py-3 text-sm text-gray-500 font-poppins">
                                No games found
                              </li>
                            ) : (
                              filteredGames.map(g => (
                                <li
                                  key={g._id}
                                  className={`px-4 py-2.5 text-sm font-poppins cursor-pointer transition-colors duration-150 ${
                                    watch('gameId') === g._id
                                      ? 'bg-defendrRed/15 text-white font-semibold'
                                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                  }`}
                                  onClick={() => {
                                    setValue('gameId', g._id)
                                    setDropdownOpen(false)
                                    setGameSearch('')
                                  }}
                                >
                                  <div className="flex items-center justify-between">
                                    {g.name}
                                    {watch('gameId') === g._id && (
                                      <Check size={13} className="text-defendrRed" />
                                    )}
                                  </div>
                                </li>
                              ))
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                    <FieldError message={errors.gameId?.message} />
                  </div>

                  {/* Description */}
                  <div>
                    <FieldLabel>Description</FieldLabel>
                    <Controller
                      control={control}
                      name="description"
                      render={({ field }) => (
                        <textarea
                          {...field}
                          value={field.value ?? ''}
                          placeholder="Tell us about your team's goals and playstyle…"
                          maxLength={500}
                          rows={4}
                          className="w-full bg-[#1c1c20] border border-white/[0.08] text-white text-sm font-poppins placeholder-gray-600 rounded-2xl px-5 py-3.5 resize-none focus:outline-none focus:border-white/20 transition-colors duration-200"
                        />
                      )}
                    />
                    <div className="flex justify-end mt-1">
                      <Typo
                        as="span"
                        className={`text-[11px] ${descLen > 450 ? 'text-orange-400' : 'text-gray-600'}`}
                        fontFamily="poppins"
                      >
                        {descLen}/500
                      </Typo>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <Typo
                      as="h2"
                      className="text-lg font-bold text-white mb-1"
                      fontFamily="poppins"
                    >
                      Team Media
                    </Typo>
                    <Typo as="p" className="text-gray-500 text-sm" fontFamily="poppins">
                      Upload a logo and banner to represent your team
                    </Typo>
                  </div>

                  {/* Logo */}
                  <div className="p-3 sm:p-5 bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                      <div>
                        <Typo
                          as="h3"
                          className="text-sm font-semibold text-white"
                          fontFamily="poppins"
                        >
                          Team Logo
                        </Typo>
                        <Typo as="p" className="text-gray-500 text-xs mt-0.5" fontFamily="poppins">
                          512×512px recommended
                        </Typo>
                      </div>
                      <Button
                        label="Reset"
                        size="s"
                        variant="outlined-grey"
                        onClick={() => setLogo(DEFAULT_IMAGES.TEAM)}
                      />
                    </div>
                    <ImageUploadArea
                      acceptedFormats={['image/png', 'image/jpeg', 'image/svg+xml']}
                      cropAspectRatio={1}
                      dimensions="512x512px"
                      enableCrop
                      existingImage={logo}
                      isSquare
                      maxSize={5}
                      title=""
                      onUploaded={({ url }) => setLogo(url)}
                    />
                  </div>

                  {/* Banner */}
                  <div className="p-3 sm:p-5 bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                      <div>
                        <Typo
                          as="h3"
                          className="text-sm font-semibold text-white"
                          fontFamily="poppins"
                        >
                          Team Banner
                        </Typo>
                        <Typo as="p" className="text-gray-500 text-xs mt-0.5" fontFamily="poppins">
                          1600×500px recommended
                        </Typo>
                      </div>
                      <Button
                        label="Reset"
                        size="s"
                        variant="outlined-grey"
                        onClick={() => setCover(DEFAULT_IMAGES.TEAM_BANNER)}
                      />
                    </div>
                    <ImageUploadArea
                      acceptedFormats={['image/png', 'image/jpeg', 'image/svg+xml']}
                      cropAspectRatio={16 / 5}
                      cropHeight={300}
                      cropWidth={1600}
                      dimensions="1600x500px"
                      enableCrop
                      existingImage={cover}
                      maxSize={8}
                      title=""
                      onUploaded={({ url }) => setCover(url)}
                    />
                  </div>
                </div>
              )}

              {/* STEP 3 — Socials */}
              {step === 3 && (
                <div className="space-y-7">
                  <div>
                    <Typo
                      as="h2"
                      className="text-lg font-bold text-white mb-1"
                      fontFamily="poppins"
                    >
                      Social Media
                    </Typo>
                    <Typo as="p" className="text-gray-500 text-sm" fontFamily="poppins">
                      Optional — helps players find and connect with your team
                    </Typo>
                  </div>

                  {/* Facebook */}
                  <div>
                    <FieldLabel>Facebook</FieldLabel>
                    <Controller
                      control={control}
                      name="facebook"
                      render={({ field }) => (
                        <Input
                          {...field}
                          value={field.value ?? ''}
                          onChange={field.onChange}
                          placeholder="https://facebook.com/yourteam"
                          type="url"
                          size="m"
                          backgroundColor="#1c1c20"
                          borderColor={errors.facebook ? '#ef4444' : 'rgba(255,255,255,0.08)'}
                        />
                      )}
                    />
                    <FieldError message={errors.facebook?.message} />
                  </div>

                  {/* Twitter */}
                  <div>
                    <FieldLabel>Twitter / X</FieldLabel>
                    <Controller
                      control={control}
                      name="twitter"
                      render={({ field }) => (
                        <Input
                          {...field}
                          value={field.value ?? ''}
                          onChange={field.onChange}
                          placeholder="https://x.com/yourteam"
                          type="url"
                          size="m"
                          backgroundColor="#1c1c20"
                          borderColor={errors.twitter ? '#ef4444' : 'rgba(255,255,255,0.08)'}
                        />
                      )}
                    />
                    <FieldError message={errors.twitter?.message} />
                  </div>

                  {/* Instagram */}
                  <div>
                    <FieldLabel>Instagram</FieldLabel>
                    <Controller
                      control={control}
                      name="instagram"
                      render={({ field }) => (
                        <Input
                          {...field}
                          value={field.value ?? ''}
                          onChange={field.onChange}
                          placeholder="https://instagram.com/yourteam"
                          type="url"
                          size="m"
                          backgroundColor="#1c1c20"
                          borderColor={errors.instagram ? '#ef4444' : 'rgba(255,255,255,0.08)'}
                        />
                      )}
                    />
                    <FieldError message={errors.instagram?.message} />
                  </div>

                  <Typo
                    as="p"
                    className="text-gray-600 text-xs text-center pt-2"
                    fontFamily="poppins"
                  >
                    By creating a team, you agree to our Terms of Service and Community Guidelines.
                  </Typo>
                </div>
              )}

              {/* Navigation buttons */}
              <div
                className={`flex mt-8 pt-6 border-t border-white/[0.06] ${step > 1 ? 'justify-between' : 'justify-end'}`}
              >
                {step > 1 && (
                  <Button
                    type="button"
                    label="Back"
                    variant="outlined-grey"
                    icon={<ChevronLeft size={15} />}
                    className="w-auto px-5"
                    onClick={goPrev}
                  />
                )}
                {step < 3 ? (
                  <Button
                    type="button"
                    label="Continue"
                    variant="contained-red"
                    icon={<ChevronRight size={15} />}
                    className="w-auto px-6"
                    onClick={goNext}
                  />
                ) : (
                  <Button
                    type="button"
                    label={submitting ? 'Creating…' : 'Create Team'}
                    variant="contained-red"
                    icon={<Check size={15} />}
                    className="w-auto px-8"
                    disabled={submitting}
                    onClick={() => handleSubmit(onSubmit)()}
                  />
                )}
              </div>
            </div>

            {/* Right sidebar: live preview */}
            <div className="hidden lg:flex flex-col gap-4">
              <div className="bg-[#111114] border border-white/[0.07] rounded-2xl overflow-hidden">
                <div
                  className="h-24 bg-cover bg-center"
                  style={{ backgroundImage: `url(${cover})` }}
                />
                <div className="px-4 pb-4 -mt-6">
                  <div className="w-12 h-12 rounded-xl border-2 border-[#111114] overflow-hidden bg-gray-800 mb-2">
                    <img src={logo} alt="Team logo" className="w-full h-full object-cover" />
                  </div>
                  <Typo
                    as="p"
                    className={`font-bold text-sm ${watch('name') ? 'text-white' : 'text-gray-600'}`}
                    fontFamily="poppins"
                  >
                    {watch('name') || 'Your Team Name'}
                  </Typo>
                  <Typo as="p" className="text-xs text-gray-500 mt-0.5" fontFamily="poppins">
                    {selectedGame?.name || 'No game selected'}
                  </Typo>
                  {watch('description') && (
                    <Typo
                      as="p"
                      className="text-[11px] text-gray-400 mt-2 leading-relaxed line-clamp-3"
                      fontFamily="poppins"
                    >
                      {watch('description')}
                    </Typo>
                  )}
                </div>
              </div>

              {/* Progress sidebar */}
              <div className="bg-[#111114] border border-white/[0.07] rounded-2xl p-5 space-y-4">
                <Typo
                  as="p"
                  className="text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  fontFamily="poppins"
                >
                  Progress
                </Typo>
                {STEPS.map(s => {
                  const Icon = s.icon
                  const done = step > s.id
                  const active = step === s.id
                  return (
                    <div key={s.id} className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          done ? 'bg-green-500/20' : active ? 'bg-defendrRed/20' : 'bg-white/5'
                        }`}
                      >
                        {done ? (
                          <Check size={15} className="text-green-400" />
                        ) : (
                          <Icon
                            size={15}
                            className={active ? 'text-defendrRed' : 'text-gray-600'}
                          />
                        )}
                      </div>
                      <div>
                        <Typo
                          as="span"
                          className={`text-sm font-semibold block ${
                            done ? 'text-green-400' : active ? 'text-white' : 'text-gray-600'
                          }`}
                          fontFamily="poppins"
                        >
                          {s.label}
                        </Typo>
                        <Typo as="span" className="text-[11px] text-gray-600" fontFamily="poppins">
                          {s.description}
                        </Typo>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
