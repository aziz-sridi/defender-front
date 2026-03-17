'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useContext, useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { OrganizationContext } from '@/components/context/OrganizationContext'
import Button from '@/components/ui/Button'
import CloudUpload from '@/components/ui/Icons/CloudUpload'
import Delete from '@/components/ui/Icons/Delete'
import Document from '@/components/ui/Icons/Document'
import Typo from '@/components/ui/Typo'
import {
  createOrganization,
  inviteStaffMember,
  createOrganizationV2,
} from '@/services/organizationService'

interface OrganizationVerificationProps {
  onNext: () => void
}

const OrganizationVerification: React.FC<OrganizationVerificationProps> = ({ onNext }) => {
  const { organizationData, setOrganizationData } = useContext(OrganizationContext)
  const { update } = useSession()
  const [pendingNext, setPendingNext] = useState(false)
  const cinInputRef = useRef<HTMLInputElement>(null)

  const schema = z.object({
    cinFile: z.any().refine(f => f, 'CIN document is required'),
    walletId: z.string().min(1, 'Konnect Wallet ID is required'),
  })

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      cinFile: organizationData?.cinFile || null,
      walletId: organizationData?.walletId || '',
    },
  })

  const cinFile = watch('cinFile')
  // watching walletId isn't necessary here as it's controlled by Controller

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setValue('cinFile', file, { shouldValidate: true })
    }
  }

  const removeFile = () => {
    setValue('cinFile', null, { shouldValidate: true })
    if (cinInputRef.current) {
      cinInputRef.current.value = ''
    }
  }

  interface SubmitData {
    cinFile: File | null
    walletId: string
  }
  const onSubmit = async (formData: SubmitData) => {
    // Update the context with the final data
    const finalOrganizationData = {
      ...organizationData,
      cinFile: formData.cinFile,
      walletId: formData.walletId,
    }
    // Add identityVerification details expected by V2
    const identityVerification = {
      status: 'pending',
      updatedAt: new Date().toISOString(),
    }
    const dataToSet = { ...finalOrganizationData, identityVerification }
    setOrganizationData(dataToSet)
    try {
      const { staff, ...orgDataWithoutStaff } = dataToSet
      // Prefer V2 create endpoint if available
      let data
      try {
        // ensure payload matches V2 nested shape
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const od = orgDataWithoutStaff as any
        const basicInfo: Record<string, unknown> = {
          name: od.name,
          description: od.description || od.bio,
          contactEmail: od.email || od.mail,
          website: od.website,
        }
        const customization: Record<string, unknown> = {
          bannerImage: od.bannerImage,
          logoImage: od.logoImage,
          connectedSocials: od.connectedSocials,
          socialLinks: od.socialLinks,
          mediaComplete: od.mediaComplete,
          socialsConnected: od.socialsConnected,
        }
        const v2Payload = {
          basicInfo,
          customization,
          identityVerification: od.identityVerification,
          orgType: od.orgType,
          organizationDetails: od.organizationDetails,
          settings: od.settings,
          staff: od.staff,
        }
        data = await createOrganizationV2(v2Payload)
      } catch {
        // fallback to legacy create
        data = await createOrganization(orgDataWithoutStaff)
      }
      const orgId = data ? data._id || data.organization?._id : undefined
      if (data) {
        if (Array.isArray(staff) && orgId) {
          for (const member of staff) {
            if (member.role !== 'Founder') {
              try {
                await inviteStaffMember(orgId, member.user, member.role)
              } catch {
                toast.error(`Failed to invite staff: ${member.user}`)
              }
            }
          }
        }
        if (orgId) {
          try {
            await update({ organization: orgId })
          } catch {
            // ignore session update failure here
          }
        }
        toast.success('Organization created successfully!')
        onNext()
      } else {
        toast.error('Failed to create organization.')
      }
    } catch {
      toast.error('Failed to submit organization data.')
    }
    setPendingNext(true)
  }

  useEffect(() => {
    if (pendingNext) {
      setPendingNext(false)
    }
  }, [organizationData, pendingNext])

  useEffect(() => {
    if (errors.walletId) {
      toast.error(errors.walletId.message as string)
    }
    if (errors.cinFile) {
      toast.error(errors.cinFile.message as string)
    }
  }, [errors.walletId, errors.cinFile])

  return (
    <form
      className="flex-1 w-4/5 min-h-[600px] flex flex-col px-5 bg-[#212529] rounded-xl mx-auto font-poppins"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flexCenter flex-col gap-5 mt-6 mb-10">
        <Typo
          as="p"
          className="justify-start regular-10 lg:regular-12 text-center text-white"
          fontFamily="poppins"
          fontVariant="p3"
        >
          Organisation business that support money transfert so we need the identity of the owner
        </Typo>

        {/* CIN File Upload */}
        <div className="w-full flexCenter flex-col gap-4 mt-8 px-4">
          <label className="regular-14 lg:regular-16 text-white self-start" htmlFor="cinFile">
            <Typo as="span" fontVariant="p2b">
              CIN
            </Typo>
          </label>
          <div className="w-3/5">
            <label
              className="bg-[#212529] min-h-[40vh] px-4 py-2 rounded-xl border-2 border-defendrRed border-dashed text-white flex-1 flexCenter cursor-pointer transition-all duration-300 shadow-[0_10px_20px_rgba(0,0,0,0.2)]"
              htmlFor="cinFile"
            >
              {cinFile && cinFile.type?.startsWith('image/') ? (
                <div className="flex items-center justify-center w-full h-full">
                  <Image
                    alt="CIN Preview"
                    className="object-contain max-h-40 rounded-lg"
                    height={180}
                    src={URL.createObjectURL(cinFile)}
                    width={180}
                  />
                </div>
              ) : cinFile ? (
                <div className="flex items-center gap-2">
                  <Document className="text-xl text-defendrRed" />
                  <Typo as="span" fontVariant="p5">
                    {cinFile.name}
                  </Typo>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-2xl text-defendrRed">
                    <CloudUpload />
                  </span>
                  <Typo as="span" fontVariant="p5">
                    Browse file to upload
                  </Typo>
                </div>
              )}
            </label>
            <input
              ref={cinInputRef}
              accept=".pdf, .png, .jpeg, .jpg"
              className="hidden"
              id="cinFile"
              type="file"
              onChange={handleFileChange}
            />
            <div className="w-full mt-2">
              <hr className="border-defendrRed" />
              <div className="flexBetween mt-2">
                <span className="text-white/70 regular-12">
                  {cinFile ? (
                    cinFile.type?.startsWith('image/') ? (
                      <div className="flex items-center gap-2">
                        <Image
                          alt="CIN Preview"
                          className="object-contain rounded"
                          height={40}
                          src={URL.createObjectURL(cinFile)}
                          width={40}
                        />
                        <Typo as="span">Image selected</Typo>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Document className="text-xl text-defendrRed" />
                        <Typo as="span">{cinFile.name}</Typo>
                      </div>
                    )
                  ) : (
                    <div className="flex items-center gap-2">
                      <Document className="text-xl text-defendrRed" />
                      <Typo as="span" fontVariant="p5">
                        No file selected
                      </Typo>
                    </div>
                  )}
                </span>
                {cinFile && (
                  <button
                    aria-label="Remove file"
                    className="p-1 rounded-full text-red-500 hover:bg-red-500/20"
                    title="Remove file"
                    type="button"
                    onClick={removeFile}
                  >
                    <Delete className="text-xl" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex items-center gap-6 mt-8 px-4">
          <label className="text-white font-bold" htmlFor="walletId-input">
            Konnect Wallet ID
          </label>
          <Controller
            control={control}
            name="walletId"
            render={({ field }) => (
              <input
                className="bg-[#302F31] px-4 py-2 rounded-2xl placeholder:text-white/70 w-3/5 text-base"
                id="walletId-input"
                placeholder="Wallet ID"
                type="text"
                {...field}
              />
            )}
          />
        </div>
        <div className="w-full flexEnd my-3 mt-10">
          <Button
            className="bg-defendrRed regular-12 md:regular-14 lg:regular-16 px-3 py-1 rounded-lg"
            label="Finish"
            size="xxs"
            type="submit"
          />
        </div>
      </div>
    </form>
  )
}

export default OrganizationVerification
