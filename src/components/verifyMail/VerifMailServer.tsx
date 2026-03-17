import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/api/auth'
import { getUserById } from '@/services/userService'
import VerifMailClient from './VerifMailClient'

export default async function VerifMailServer() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) return null

  const userId = (session.user as any)?._id || (session.user as any)?.id
  if (!userId) return null

  let user: any = null
  try {
    user = await getUserById(userId)
  } catch {
    // If user not found, treat as signup flow (show banner)
    return <VerifMailClient showBanner={true} />
  }

  if (user && user.verifmail === false && user.activated === false) {
    return <VerifMailClient showBanner={true} />
  }
  return null
}
