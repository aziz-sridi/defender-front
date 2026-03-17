'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import Loader from '@/loading'

const CreateOrganization = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOrganization = async () => {
      if (status === 'loading') {
        return
      }
      if (!session?.user?.organization) {
        router.push('/organization')
        return
      }
      router.push(`/organization/${session?.user?.organization}/Profile`)
      return
    }

    fetchOrganization()
  }, [session, status, router])

  if (status === 'loading' || loading) {
    return <Loader />
  }

  if (error) {
    return (
      <div className="flexCenter h-[80vh] text-red-500">
        <p>Error fetching organization data.</p>
      </div>
    )
  }

  return null
}

export default CreateOrganization
