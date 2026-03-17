'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import Image from 'next/image'
import { ArrowLeft, Building2, Check, ArrowRight, ShieldAlert } from 'lucide-react'

import { getJoinedOrganizations } from '@/services/organizationService'
import { Organization } from '@/types/organizationType'
import Typo from '@/components/ui/Typo'
import Button from '@/components/ui/Button'
import { organizerImageSanitizer, DEFAULT_IMAGES } from '@/utils/imageUrlSanitizer'

interface OrganizationSelectorProps {
  onOrganizationSelect: (organizationId: string) => void
}

export default function OrganizationSelector({ onOrganizationSelect }: OrganizationSelectorProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrgId, setSelectedOrgId] = useState<string>('')

  useEffect(() => {
    const fetchUserOrganizations = async () => {
      if (!session?.user?._id) {
        router.push('/login?callbackUrl=/tournament')
        return
      }

      setLoading(true)
      try {
        const [joined, all] = await Promise.all([
          getJoinedOrganizations(),
          import('@/services/organizationService')
            .then(s => s.getAllOrganizations())
            .catch(() => []),
        ])

        const orgs = joined || []
        const withRoles = (orgs as any[]).map((org: any) => {
          // derive role from staff array if missing or unreliable
          const myStaff = org?.staff?.find((staffMember: any) => {
            const staffUserId =
              typeof staffMember.user === 'string'
                ? staffMember.user
                : staffMember.user?._id || staffMember.user?.id
            return staffUserId === session.user._id
          })
          const role = myStaff?.role || org.role || 'Member'
          return { ...org, role }
        })

        // Also include any organizations founded by the user (createdBy == user id)
        const founded = (Array.isArray(all) ? all : []).filter((org: any) => {
          const createdBy = typeof org.createdBy === 'string' ? org.createdBy : org.createdBy?._id
          return createdBy === session.user._id
        })
        const foundedNormalized = founded.map((org: any) => ({ ...org, role: 'Founder' }))

        // Merge unique by _id, prefer joined info
        const map = new Map<string, any>()
        for (const o of [...withRoles, ...foundedNormalized]) {
          map.set(String(o._id), { ...map.get(String(o._id)), ...o })
        }
        const merged = Array.from(map.values())

        // Filter organizations where user has admin/founder permissions
        const adminOrgs = merged.filter((org: any) => {
          const role = org.role?.toLowerCase()
          return role === 'admin' || role === 'founder'
        })

        setOrganizations(adminOrgs)
      } catch (error) {
        console.error('Failed to fetch user organizations:', error)
        toast.error('Failed to load organizations')
        setOrganizations([])
      } finally {
        setLoading(false)
      }
    }

    fetchUserOrganizations()
  }, [session?.user?._id, router])

  const handleOrganizationSelect = (orgId: string) => {
    setSelectedOrgId(orgId)
  }

  const handleContinue = () => {
    if (!selectedOrgId) {
      toast.error('Please select an organization')
      return
    }
    onOrganizationSelect(selectedOrgId)
  }

  const handleBack = () => {
    router.push('/tournament')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-defendrBg flex items-center justify-center">
        <div className="text-white text-xl">Loading organizations...</div>
      </div>
    )
  }

  if (organizations.length === 0) {
    return (
      <div className="min-h-screen bg-[#161616] flex items-center justify-center p-6">
        <div className="bg-[#1a1d21] border border-white/5 shadow-2xl rounded-3xl p-10 max-w-md w-full relative overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-defendrRed/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />

          <div className="text-center relative z-10">
            <div className="w-20 h-20 mx-auto mb-6 bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/20 shadow-inner">
              <ShieldAlert className="w-10 h-10 text-defendrRed" strokeWidth={1.5} />
            </div>

            <Typo as="h2" className="text-white font-bold text-2xl mb-3" fontFamily="poppins">
              No Organization Access
            </Typo>
            <Typo
              as="p"
              className="text-gray-400 text-sm mb-8 leading-relaxed"
              fontFamily="poppins"
            >
              You need Admin or Founder permissions in an organization to create tournaments. Please
              create a new organization or ask an existing one for admin access.
            </Typo>

            <div className="flex flex-col gap-3">
              <Button
                label="Browse Organizations"
                variant="outlined-grey"
                size="l"
                className="w-full justify-center"
                fontFamily="poppins"
                onClick={() => router.push('/organizations')}
              />
              <Button
                label="Create Organization"
                variant="contained-red"
                size="l"
                className="w-full justify-center"
                fontFamily="poppins"
                onClick={() => router.push('/organization')}
              />
              <button
                onClick={handleBack}
                className="mt-2 text-sm text-gray-500 hover:text-white transition-colors font-poppins font-medium"
              >
                Back to Tournament
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#161616]">
      {/* Mobile Message */}
      <div className="lg:hidden flex items-center justify-center min-h-screen p-6">
        <div className="bg-[#1a1d21] border border-blue-500/20 rounded-3xl p-8 max-w-md w-full backdrop-blur-sm shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />

          <div className="relative z-10">
            <div className="flex items-center gap-5 mb-6">
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 shadow-inner flex-shrink-0">
                <svg className="w-7 h-7 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <Typo
                as="h2"
                className="text-white font-bold text-xl leading-snug"
                fontFamily="poppins"
              >
                Get Computer View
              </Typo>
            </div>

            <Typo
              as="p"
              className="text-gray-400 text-sm leading-relaxed mb-6"
              fontFamily="poppins"
            >
              Tournament creation is optimized for desktop experience. Please use a computer for the
              best tournament setup experience.
            </Typo>

            <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl">
              <Typo
                as="p"
                className="text-blue-300/80 text-xs leading-relaxed"
                fontFamily="poppins"
              >
                💡 <strong>Tip:</strong> Switch to desktop view to access all tournament creation
                features including organization selection, game selection, and tournament setup.
              </Typo>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Content */}
      <div className="hidden lg:block relative">
        <div className="max-w-5xl mx-auto px-6 py-12 relative z-10">
          {/* Header */}
          <div className="mb-10 flex flex-col gap-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors w-fit group"
            >
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              <Typo as="span" className="font-medium" fontFamily="poppins">
                Back to Tournament
              </Typo>
            </button>
            <div>
              <Typo as="h1" className="text-4xl font-bold text-white mb-2" fontFamily="poppins">
                Select Organization
              </Typo>
              <Typo as="p" className="text-gray-400 text-lg" fontFamily="poppins">
                Choose the organization for which you want to create a tournament. You need Admin or
                Founder permissions.
              </Typo>
            </div>
          </div>

          {/* Organization List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
            {organizations.map(org => {
              const isSelected = selectedOrgId === org._id
              const isFounder = org.role?.toLowerCase() === 'founder'

              return (
                <div
                  key={org._id}
                  onClick={() => handleOrganizationSelect(org._id)}
                  className={`relative bg-[#1a1d21] border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 group overflow-hidden ${
                    isSelected
                      ? 'border-defendrRed shadow-[0_0_20px_rgba(226,58,99,0.15)] bg-defendrRed/[0.03]'
                      : 'border-white/5 hover:border-gray-500/50 hover:bg-[#202428]'
                  }`}
                >
                  {/* Subtle red glow at bottom if selected */}
                  {isSelected && (
                    <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-defendrRed/10 rounded-full blur-2xl pointer-events-none" />
                  )}

                  <div className="flex items-start gap-5 relative z-10">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#111] flex items-center justify-center flex-shrink-0 shadow-inner">
                      {org.logoImage || (org as any).logo || (org as any).profileImage ? (
                        <Image
                          src={organizerImageSanitizer(
                            org.logoImage || (org as any).logo || (org as any).profileImage || '',
                            DEFAULT_IMAGES.ORGANIZATION,
                          )}
                          alt={org.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <Building2 className="w-8 h-8 text-gray-600" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-2">
                        <Typo
                          as="h3"
                          className="text-white font-semibold text-lg lg:text-xl truncate"
                          fontFamily="poppins"
                        >
                          {org.name}
                        </Typo>
                        <span
                          className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold tracking-wider uppercase border backdrop-blur-sm ${
                            isFounder
                              ? 'bg-red-500/10 text-red-400 border-red-500/20'
                              : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          }`}
                        >
                          {org.role}
                        </span>
                      </div>

                      {org.bio ? (
                        <Typo
                          as="p"
                          className="text-gray-400 text-sm line-clamp-2 mt-1"
                          fontFamily="poppins"
                        >
                          {org.bio}
                        </Typo>
                      ) : (
                        <Typo
                          as="p"
                          className="text-gray-500 text-sm line-clamp-1 italic mt-1"
                          fontFamily="poppins"
                        >
                          No description provided
                        </Typo>
                      )}
                    </div>

                    {/* Checkmark circle */}
                    <div
                      className={`w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-300 mt-1 ${
                        isSelected
                          ? 'border-defendrRed bg-defendrRed shadow-[0_0_10px_rgba(226,58,99,0.5)]'
                          : 'border-white/10 group-hover:border-white/30'
                      }`}
                    >
                      {isSelected && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Continue Button */}
          <div className="flex justify-end pt-4 border-t border-white/5">
            <Button
              label="Continue to Game Selection"
              variant={selectedOrgId ? 'contained-red' : 'outlined-grey'}
              size="l"
              icon={
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              }
              iconPosition="right"
              onClick={handleContinue}
              disabled={!selectedOrgId}
              className={`rounded-xl px-8 transition-all duration-300 group ${
                !selectedOrgId
                  ? 'opacity-50 cursor-not-allowed bg-gray-800 border-gray-700 hover:bg-gray-800'
                  : ''
              }`}
              fontFamily="poppins"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
