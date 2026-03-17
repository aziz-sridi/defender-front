import { useRouter } from 'next/navigation'

import Typo from '@/components/ui/Typo'
import ArrowLeftWB from '@/components/ui/Icons/ArrowLeftWB'

const PlaceholderWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-[#161616] flex items-center justify-center px-4">
    <div className="bg-[#1F1F1F] rounded-2xl shadow-lg p-8 md:p-12 max-w-md w-full flex flex-col items-center gap-6">
      {children}
    </div>
  </div>
)

export const OrganizationNotFound = () => {
  const router = useRouter()
  return (
    <PlaceholderWrapper>
      <Typo
        as="h1"
        className="text-2xl md:text-3xl"
        color="white"
        fontFamily="poppins"
        fontWeight="bold"
      >
        Organization Not Found
      </Typo>
      <Typo as="p" className="text-center opacity-70" color="white" fontFamily="poppins">
        The organization you are looking for does not exist or has been removed.
      </Typo>
      <button
        className="flex items-center gap-2 bg-defendrRed text-white font-poppins px-6 py-2 rounded-full hover:brightness-110 transition"
        onClick={() => router.push('/')}
      >
        <ArrowLeftWB /> Go Back Home
      </button>
    </PlaceholderWrapper>
  )
}

export const AccessDenied = () => {
  const router = useRouter()
  return (
    <PlaceholderWrapper>
      <Typo
        as="h1"
        className="text-2xl md:text-3xl"
        color="white"
        fontFamily="poppins"
        fontWeight="bold"
      >
        Access Denied
      </Typo>
      <Typo as="p" className="text-center opacity-70" color="white" fontFamily="poppins">
        You don't have permission to edit this organization.
      </Typo>
      <button
        className="flex items-center gap-2 bg-defendrRed text-white font-poppins px-6 py-2 rounded-full hover:brightness-110 transition"
        onClick={() => router.push('/')}
      >
        <ArrowLeftWB /> Go Back Home
      </button>
    </PlaceholderWrapper>
  )
}
