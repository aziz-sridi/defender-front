import { Team } from '@/types/teamType'

/**
 * Checks if a user is the owner of a team
 * @param team - The team object (can be any object with teamowner property)
 * @param userId - The user ID to check
 * @returns boolean indicating if the user is the team owner
 */
export const isTeamOwner = (team: any, userId: string): boolean => {
  if (!team || !userId || !team.teamowner) {
    return false
  }

  return team.teamowner.some((owner: any) => {
    const ownerUserId = typeof owner.user === 'string' ? owner.user : owner.user?._id
    return ownerUserId === userId && owner.role === 'owner'
  })
}

/**
 * Checks if a user is a member of a team (owner or regular member)
 * @param team - The team object (can be any object with teamowner/teamroster properties)
 * @param userId - The user ID to check
 * @returns boolean indicating if the user is a team member
 */
export const isTeamMember = (team: any, userId: string): boolean => {
  if (!team || !userId) {
    return false
  }

  // Check if user is in teamowner array
  const isOwner = team.teamowner?.some((owner: any) => {
    const ownerUserId = typeof owner.user === 'string' ? owner.user : owner.user?._id
    return ownerUserId === userId
  })

  // Check if user is in teamroster array
  const isMember = team.teamroster?.some((member: any) => {
    const memberUserId = typeof member.user === 'string' ? member.user : member.user?._id
    return memberUserId === userId
  })

  return isOwner || isMember
}
