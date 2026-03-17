'use client'
import { createContext, useContext, useState } from 'react'
export interface OrganizationData {
  name?: string
  description?: string
  discord?: string
  mail?: string
  staff?: { user: string; role: string }[]
  type?: string
  /** Banner image can now be a File (pre-upload) or a URL string (after upload). */
  bannerImage?: File | string
  /** Logo image can now be a File (pre-upload) or a URL string (after upload). */
  logoImage?: File | string
  facebook?: string
  twitch?: string
  youtube?: string
  instagram?: string
  twitter?: string
  walletId?: string
  /** CIN document may be a File or a URL (if previously uploaded). */
  cinFile?: File | string | null
}
export const OrganizationContext = createContext<{
  organizationData: OrganizationData
  setOrganizationData: React.Dispatch<React.SetStateAction<OrganizationData>>
}>({
  organizationData: {},
  setOrganizationData: () => {},
})
export const useOrganizationContext = () => {
  const context = useContext(OrganizationContext)
  if (!context) {
    throw new Error('useOrganizationContext must be used within an OrganizationProvider')
  }
  return context
}
export const OrganizationProvider = ({ children }: { children: React.ReactNode }) => {
  const [organizationData, setOrganizationData] = useState<OrganizationData>({})
  return (
    <OrganizationContext.Provider value={{ organizationData, setOrganizationData }}>
      {children}
    </OrganizationContext.Provider>
  )
}
