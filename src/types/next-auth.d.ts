import 'next-auth'
import 'next-auth/jwt'
import type { User as CustomUser } from './userType'

declare module 'next-auth' {
  interface Session {
    accessToken?: string
    user?: CustomUser
  }

  interface User extends CustomUser {
    accessToken?: string
    token?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string
    user?: CustomUser
  }
}
