'use client'
/* eslint-disable no-console, @typescript-eslint/no-explicit-any */
import axios from 'axios'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect, useRef } from 'react'
import { toast } from 'sonner'

import Typo from '@/components/ui/Typo'

const OAuthCallback = () => {
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const route = useRouter()
  const hasFetched = useRef(false)

  useEffect(() => {
    if (status === 'authenticated' && code && !hasFetched.current) {
      // Ensure the effect runs only once and session is authenticated
      hasFetched.current = true // Mark as fetched
      const userId = session?.user?._id || (session?.user as any)?.id
      console.log('Full session:', session)
      console.log('Session user:', session?.user)
      console.log('userId', userId)
      const fetchOAuthCallback = async () => {
        try {
          // First API call to get the access token
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API}/BattleNet/oauth/callback?code=${code}&region=EU&test=true`,
          )

          // Extract the access token from the response
          const accessToken = response.data.access_token
          // console.log('Access Token:', accessToken);

          // If the access token is received, make the second API call to link the account
          if (accessToken && session?.user?.accessToken) {
            await axios.post(
              `${process.env.NEXT_PUBLIC_API}/BattleNet/link_account/${accessToken}/EU`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${session.user.accessToken}`, // Using accessToken instead of token
                },
              },
            )
            toast.success('Account linked successfully')
            // console.log('Link Account Response:', linkResponse.data);
            route.push(`/user/${userId}/settings/Game-accounts`)
          } else {
            toast.error('Failed to get access token or user session')
            route.push(`/user/${userId}/settings/Game-accounts`)
          }
        } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            if (error.response) {
              // Server responded with a non-2xx status
              const errorMessage = error.response.data?.message || 'Request failed'
              toast.error(errorMessage)
            } else if (error.request) {
              // Request was made but no response received
              toast.error('No response received from server')
            } else {
              // Something happened while setting up the request
              toast.error('An error occurred during OAuth callback')
            }
          } else {
            // Not an AxiosError at all
            toast.error('An unexpected error occurred')
          }

          route.push(`/user/${userId}/settings/Game-accounts`)
        }
      }

      fetchOAuthCallback()
    }
  }, [code, session, status, route])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="text-center text-white">
        <Typo as="p" className="mb-4" fontVariant="h5">
          OAuth Callback
        </Typo>
        {code && state ? (
          <div className="space-y-2">
            <Typo as="p" fontVariant="p4">
              Processing BattleNet authentication...
            </Typo>
            <Typo as="p" className="text-sm text-gray-400">
              Code: **********
            </Typo>
            <Typo as="p" className="text-sm text-gray-400">
              State: **********
            </Typo>
          </div>
        ) : (
          <Typo as="p" fontVariant="p4">
            Loading...
          </Typo>
        )}
      </div>
    </div>
  )
}

export default OAuthCallback
