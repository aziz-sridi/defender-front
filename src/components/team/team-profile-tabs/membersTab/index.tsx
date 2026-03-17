'use client'

import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'

import Button from '@/components/ui/Button'
import Avatar from '@/components/team/helpers/avatar'
import CircularProgressBar from '@/components/team/helpers/circularProgressBar'
import Typo from '@/components/ui/Typo'

interface MembersTabProps {
  isUserTeam: boolean
  team: any
  teamId: string
  onAddMember: () => void
  onViewProfile: (memberId: string) => void
  isUserTeamOwner?: boolean
}

const MembersTab: React.FC<MembersTabProps> = ({
  isUserTeam,
  team,
  teamId,
  onAddMember,
  onViewProfile,
  isUserTeamOwner = false,
}) => {
  const [members, setMembers] = useState<any[]>([])
  const [teamOwner, setTeamOwner] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (!team) {
      return
    }
    if (Array.isArray(team.teamowner) && team.teamowner.length > 0) {
      setTeamOwner(team.teamowner[0])
    }

    setMembers(Array.isArray(team.teamroster) ? team.teamroster : [])
    setLoading(false)
  }, [teamId, team])

  if (loading) {
    return (
      <div className="w-full bg-[#212529] p-6 rounded-[19px] mt-6">
        <div className="text-center text-white font-poppins">Loading members...</div>
      </div>
    )
  }
  return (
    <div className="w-full bg-[#212529] p-6 rounded-[19px] sm:mt-6">
      <div className="flex md:justify-between md:flex-row flex-col md:items-center mb-4">
        <div>
          <Typo className="text-white md:text-lg text-sm mb-4" fontFamily="poppins">
            Team members
          </Typo>
          <Typo className="text-gray-400 text-sm ps-3" fontFamily="poppins">
            Current roster of {members.length} players
          </Typo>
        </div>
        {isUserTeamOwner && (
          <Button
            className="btn-defendr-red w-auto mt-2 md:mt-0 min-w-0"
            icon={<Plus size={14} />}
            iconOrientation="left"
            label="Add Member"
            size="xs"
            textClassName="text-xs text-start"
            variant="contained-red"
            onClick={onAddMember}
          />
        )}
      </div>

      <div className="space-y-6 mt-6">
        {teamOwner && (
          <div
            key={teamOwner?._id || 'owner'}
            className="bg-slate-800/30 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors"
          >
            {/* Mobile Layout */}
            <div className="flex flex-col sm:hidden gap-4">
              <div className="flex items-center gap-3">
                <Avatar
                  imageUrl={teamOwner?.user?.profileImage || ''}
                  name={teamOwner?.user?.nickname || 'Unknown'}
                  size={56}
                />
                <div className="flex-grow">
                  <Typo className="text-white text-base font-medium" fontFamily="poppins">
                    {teamOwner?.user?.fullname || teamOwner?.user?.nickname || 'Unknown'}
                  </Typo>
                  <Typo className="text-[#8692aa] text-sm mt-1" fontFamily="poppins">
                    {teamOwner?.role || 'Owner'}
                  </Typo>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-1">
                  <Typo className="text-white text-sm font-medium" fontFamily="poppins">
                    {teamOwner?.winRate ? teamOwner.winRate.toFixed(1) : 0}% Win Rate
                  </Typo>
                  <Typo className="text-white text-sm font-medium" fontFamily="poppins">
                    {teamOwner?.matches || 0} Matches
                  </Typo>
                </div>
                <Button
                  className="btn-defendr-red px-4 py-2"
                  label="View Profile"
                  size="xs"
                  textClassName="text-sm font-medium"
                  variant="contained-red"
                  onClick={() => onViewProfile(teamOwner?.user?._id || '')}
                />
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:flex items-center gap-4">
              <Avatar
                imageUrl={teamOwner?.user?.profileImage || ''}
                name={teamOwner?.user?.nickname || 'Unknown'}
                size={64}
              />
              <div className="flex-grow">
                <div className="flex items-center gap-3">
                  <Typo className="text-white text-sm min-w-[150px]" fontFamily="poppins">
                    {teamOwner?.user?.nickname || 'Unknown'}
                  </Typo>
                  <Typo
                    className="border border-[#D62755] text-[#ffffff] text-xs px-3 py-0.5 rounded-full"
                    fontFamily="poppins"
                  >
                    {teamOwner?.role || 'Owner'}
                  </Typo>
                </div>
                <Typo className="text-white text-base mt-1" fontFamily="poppins">
                  {teamOwner?.user?.fullname || ''}
                </Typo>
              </div>
              <div className="text-right flex flex-col gap-2">
                <Typo className="text-white text-sm md:text-base font-medium" fontFamily="poppins">
                  {teamOwner?.winRate ? teamOwner.winRate.toFixed(1) : 0} % Win Rate
                </Typo>
                <Typo className="text-white text-sm md:text-base font-medium" fontFamily="poppins">
                  {teamOwner?.matches || 0} Matches
                </Typo>
              </div>
              <div className="flex items-center justify-end">
                <Button
                  className="btn-defendr-red min-w-0"
                  label="View Profile"
                  size="xs"
                  textClassName="text-sm font-regular"
                  variant="contained-red"
                  onClick={() => onViewProfile(teamOwner?.user?._id || '')}
                />
              </div>
            </div>
          </div>
        )}
        {Array.isArray(members) &&
          members.map(member => (
            <div
              key={member._id}
              className="bg-slate-800/30 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors"
            >
              {/* Mobile Layout */}
              <div className="flex flex-col sm:hidden gap-4">
                <div className="flex items-center gap-3">
                  <Avatar
                    imageUrl={member?.user?.profileImage || ''}
                    name={member?.user?.nickname || 'Unknown'}
                    size={56}
                  />
                  <div className="flex-grow">
                    <Typo className="text-white text-base font-medium" fontFamily="poppins">
                      {member?.user?.fullname || member?.user?.nickname || 'Unknown'}
                    </Typo>
                    <Typo className="text-[#8692aa] text-sm mt-1" fontFamily="poppins">
                      {member?.role || 'Member'}
                    </Typo>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col gap-1">
                    <Typo className="text-white text-sm font-medium" fontFamily="poppins">
                      {member?.winRate ? member.winRate.toFixed(1) : 0}% Win Rate
                    </Typo>
                    <Typo className="text-white text-sm font-medium" fontFamily="poppins">
                      {member?.matches || 0} Matches
                    </Typo>
                  </div>
                  <Button
                    className="btn-defendr-red px-4 py-2"
                    label="View Profile"
                    size="xs"
                    textClassName="text-sm font-medium"
                    variant="contained-red"
                    onClick={() => onViewProfile(member?.user?._id || '')}
                  />
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden sm:flex items-center gap-4">
                <Avatar
                  imageUrl={member?.user?.profileImage || ''}
                  name={member?.user?.nickname || 'Unknown'}
                  size={64}
                />
                <div className="flex-grow">
                  <div className="flex items-center gap-3">
                    <Typo className="text-white text-sm min-w-[150px]" fontFamily="poppins">
                      {member?.user?.nickname || 'Unknown'}
                    </Typo>
                    <Typo
                      className="border border-[#D62755] text-[#ffffff] text-xs px-3 py-0.5 rounded-full"
                      fontFamily="poppins"
                    >
                      {member?.role || 'Member'}
                    </Typo>
                  </div>
                  <Typo className="text-white text-base mt-1" fontFamily="poppins">
                    {member?.user?.fullname || ''}
                  </Typo>
                </div>
                <div className="text-right flex flex-col gap-2">
                  <Typo
                    className="text-white text-sm md:text-base font-medium"
                    fontFamily="poppins"
                  >
                    {member?.winRate ? member.winRate.toFixed(1) : 0} % Win Rate
                  </Typo>
                  <Typo
                    className="text-white text-sm md:text-base font-medium"
                    fontFamily="poppins"
                  >
                    {member?.matches || 0} Matches
                  </Typo>
                </div>
                <div className="flex items-center justify-end">
                  <Button
                    className="btn-defendr-red min-w-0"
                    label="View Profile"
                    size="xs"
                    textClassName="text-sm font-regular"
                    variant="contained-red"
                    onClick={() => onViewProfile(member?.user?._id || '')}
                  />
                </div>
              </div>
            </div>
          ))}
        {members.length > 3 && (
          <Button
            className="btn-defendr-red w-full sm:hidden"
            label="expand"
            size="s"
            textClassName="sm:text-lg text-sm"
            variant="contained-red"
          />
        )}
      </div>
    </div>
  )
}

export default MembersTab
