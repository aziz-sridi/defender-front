import { getToken } from 'next-auth/jwt'
import { getSession } from 'next-auth/react'
import type { NextApiRequest } from 'next'
import type { NextRequest } from 'next/server'
import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import DiscordProvider from 'next-auth/providers/discord'

import { loginWithEmail, loginWithGoogle } from '@/services/authService'
import { User } from '@/types/userType'

import { isServer } from './constants'

export const fetchToken = async (
  serverRequest?: NextApiRequest | NextRequest,
): Promise<string | null> => {
  if (isServer && serverRequest) {
    const token = await getToken({
      req: serverRequest as unknown as NextApiRequest,
      secret: process.env.NEXTAUTH_SECRET,
    })

    return token?.accessToken ? String(token.accessToken) : null
  }

  if (!isServer) {
    const session = await getSession()
    return session?.accessToken ?? null
  }

  return null
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        token: { label: 'Token', type: 'text' },
      },

      async authorize(credentials) {
        try {
          // Token-based authentication (for email verification)
          if (credentials?.token) {
            const { tokenSignInWithToken } = await import('@/services/userService')
            const data = await tokenSignInWithToken(credentials.token)
            if (!data) {
              return null
            }
            return {
              ...data.user,
              id: data.user._id || data.user.id,
              accessToken: data.token,
              expires: data.expires,
            }
          }

          // Email/password authentication
          if (credentials?.email && credentials?.password) {
            const data = await loginWithEmail(credentials.email, credentials.password)
            if (!data) {
              return null
            }
            return {
              ...data.user,
              accessToken: data.token,
              expires: data.expires,
            }
          }

          return null
        } catch (error) {
          return null
        }
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
              params: {
                prompt: 'consent',
                access_type: 'offline',
                response_type: 'code',
              },
            },

            async profile(_, tokens) {
              try {
                const data = await loginWithGoogle(tokens.access_token as string)
                const { _id, ...rest } = data.user
                return {
                  _id,
                  id: _id,
                  ...rest,
                  accessToken: data.token,
                  expires: data.expires,
                }
              } catch (error: any) {
                // Extract the backend error message to forward to the login page via NextAuth's error param
                const status = error?.response?.status
                const message = error?.response?.data?.message || error?.message || ''
                if (
                  status === 409 ||
                  message.toLowerCase().includes('already') ||
                  message.toLowerCase().includes('exist')
                ) {
                  throw new Error('EmailAlreadyExists')
                }
                throw new Error('OAuthAccountError')
              }
            },
          }),
        ]
      : []),

    ...(process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET
      ? [
          DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,

            authorization: {
              params: {
                scope: 'identify email',
                prompt: 'consent',
                response_type: 'code',
              },
            },

            profile: async (_, tokens) => {
              try {
                const { loginWithDiscord } = await import('@/services/authService')
                const data = await loginWithDiscord(tokens.access_token as string)
                const { _id, ...rest } = data.user
                return {
                  id: _id,
                  _id,
                  ...rest,
                  accessToken: data.token,
                  expires: data.expires,
                  isNewUser: data.user.fullname === data.user.nickname,
                }
              } catch (error: any) {
                const status = error?.response?.status
                const message = error?.response?.data?.message || error?.message || ''
                if (
                  status === 409 ||
                  message.toLowerCase().includes('already') ||
                  message.toLowerCase().includes('exist')
                ) {
                  throw new Error('EmailAlreadyExists')
                }
                throw new Error('OAuthAccountError')
              }
            },
          }),
        ]
      : []),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user, trigger, session, account }) {
      if (user) {
        const userWithAccessToken = user as unknown as User & { accessToken?: string }
        if (userWithAccessToken.accessToken) {
          token.accessToken = userWithAccessToken.accessToken
        }

        // Only store essential fields in the JWT to keep the session cookie under 4096 bytes.
        // The full user object from the backend has 57+ fields (including password hash,
        // OAuth tokens, followers arrays, etc.) which bloats the cookie beyond the browser limit.
        // Any component that needs full user data should fetch it via getUserById() instead.
        token.user = {
          _id: userWithAccessToken._id,
          email: userWithAccessToken.email,
          nickname: userWithAccessToken.nickname,
          isDefaultNickname: userWithAccessToken.isDefaultNickname,
          profileImage: userWithAccessToken.profileImage,
          roles: userWithAccessToken.roles,
          organization: userWithAccessToken.organization,
          joinedOrganizations: userWithAccessToken.joinedOrganizations,
          teams: userWithAccessToken.teams,
          membershipLevel: userWithAccessToken.membershipLevel,
          membershipPeriod: userWithAccessToken.membershipPeriod,
          verifmail: userWithAccessToken.verifmail,
          activated: userWithAccessToken.activated,
          redPoints: userWithAccessToken.redPoints,
          following: userWithAccessToken.following,
          createdAt: userWithAccessToken.createdAt,
          updatedAt: userWithAccessToken.updatedAt,
          // Store only game IDs, not full Game objects (igdbData can be huge)
          favoriteGames: userWithAccessToken.favoriteGames?.map((g: unknown) =>
            typeof g === 'string' ? g : (g as { _id: string })?._id,
          ),
          // Strip OAuth tokens from connectedAcc — only keep display info
          connectedAcc: userWithAccessToken.connectedAcc
            ? {
                Riotgames: userWithAccessToken.connectedAcc.Riotgames
                  ? {
                      riotid: userWithAccessToken.connectedAcc.Riotgames.riotid,
                      tagline: userWithAccessToken.connectedAcc.Riotgames.tagline,
                    }
                  : undefined,
                mobileLegends: userWithAccessToken.connectedAcc.mobileLegends,
                battleNet: userWithAccessToken.connectedAcc.battleNet
                  ? {
                      battletag: userWithAccessToken.connectedAcc.battleNet.battletag,
                      region: userWithAccessToken.connectedAcc.battleNet.region,
                    }
                  : undefined,
                steam: userWithAccessToken.connectedAcc.steam
                  ? {
                      steamId: userWithAccessToken.connectedAcc.steam.steamId,
                      username: userWithAccessToken.connectedAcc.steam.username,
                    }
                  : undefined,
              }
            : undefined,
          // Only keep discord from socialMediaLinks (only field used from session)
          socialMediaLinks: userWithAccessToken.socialMediaLinks
            ? { discord: userWithAccessToken.socialMediaLinks.discord }
            : undefined,
        } as unknown as User

        if (account?.provider === 'google') {
          token.isNewGoogleUser = true
        }
      }

      // Check if token is expired and refresh if needed
      const now = Math.floor(Date.now() / 1000)
      if (token.exp && typeof token.exp === 'number' && token.exp < now) {
        // Instead of returning null immediately, try to refresh the token
        // For now, we'll extend the token for a short period to prevent immediate redirects
        // In a production environment, you should implement proper token refresh
        const extendedExp = now + 60 * 60 // Extend by 1 hour
        return {
          ...token,
          exp: extendedExp,
        }
      }

      if (trigger === 'update') {
        const updateData = session as unknown
        if (
          updateData &&
          typeof updateData === 'object' &&
          'user' in (updateData as Record<string, unknown>) &&
          (updateData as Record<string, unknown>).user
        ) {
          const incomingUser = (updateData as { user: Partial<User> }).user
          // Merge update data but only keep essential fields to prevent re-bloating
          const merged = {
            ...(token.user as User),
            ...incomingUser,
          }
          token.user = {
            _id: merged._id,
            email: merged.email,
            nickname: merged.nickname,
            isDefaultNickname: merged.isDefaultNickname,
            profileImage: merged.profileImage,
            roles: merged.roles,
            organization: merged.organization,
            joinedOrganizations: merged.joinedOrganizations,
            teams: merged.teams,
            membershipLevel: merged.membershipLevel,
            membershipPeriod: merged.membershipPeriod,
            verifmail: merged.verifmail,
            activated: merged.activated,
            redPoints: merged.redPoints,
            following: merged.following,
            favoriteGames: merged.favoriteGames?.map((g: unknown) =>
              typeof g === 'string' ? g : (g as { _id: string })?._id,
            ),
            connectedAcc: merged.connectedAcc
              ? {
                  Riotgames: merged.connectedAcc.Riotgames
                    ? {
                        riotid: merged.connectedAcc.Riotgames.riotid,
                        tagline: merged.connectedAcc.Riotgames.tagline,
                      }
                    : undefined,
                  mobileLegends: merged.connectedAcc.mobileLegends,
                  battleNet: merged.connectedAcc.battleNet
                    ? {
                        battletag: merged.connectedAcc.battleNet.battletag,
                        region: merged.connectedAcc.battleNet.region,
                      }
                    : undefined,
                  steam: merged.connectedAcc.steam
                    ? {
                        steamId: merged.connectedAcc.steam.steamId,
                        username: merged.connectedAcc.steam.username,
                      }
                    : undefined,
                }
              : undefined,
            socialMediaLinks: merged.socialMediaLinks
              ? { discord: merged.socialMediaLinks.discord }
              : undefined,
          } as unknown as User
        }
      }

      return token
    },
    async session({ session, token }) {
      // If token is null (expired), return session without user to force re-authentication
      if (!token) {
        return {
          ...session,
          user: undefined,
          accessToken: undefined,
        }
      }

      // Check if token is expired but still valid for a short grace period
      const now = Math.floor(Date.now() / 1000)
      if (token.exp && typeof token.exp === 'number' && token.exp < now) {
        // If token is expired by more than 5 minutes, force re-authentication
        const gracePeriod = 5 * 60 // 5 minutes
        if (now - token.exp > gracePeriod) {
          return {
            ...session,
            user: undefined,
            accessToken: undefined,
          }
        }
        // Otherwise, allow the session to continue
      }

      session.accessToken = token.accessToken as string
      session.user = {
        ...(token.user as User),
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === 'production'
          ? `__Secure-next-auth.session-token`
          : `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}
