import React, { useEffect, useState } from 'react'
import Image from 'next/image'

import Button from '@/components/ui/Button'

interface TeamModalProps {
  show: boolean
  team: any
  teamMembers: any[]
  mainRosterMembers: any[]
  substituteRosterMembers: any[]
  onClose: () => void
  onViewProfile: (teamId: string) => void
  teamImageSanitizer: (img: string) => string | null
  getValidImageSrc: (img: string | undefined) => string | null
}

import { getTeamById } from '@/services/teamService'

const TeamModal: React.FC<TeamModalProps> = ({
  show,
  team,
  teamMembers,
  mainRosterMembers,
  substituteRosterMembers,
  onClose,
  onViewProfile,
  teamImageSanitizer,
  getValidImageSrc,
}) => {
  const [fullTeam, setFullTeam] = useState<any | null>(team)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // If modal is shown and team is missing key data, fetch full team info
    if (show && team && team._id && (!team.datecreation || !team.members)) {
      setLoading(true)
      getTeamById(team._id)
        .then(data => {
          setFullTeam(data)
        })
        .catch(() => {
          setFullTeam(team)
        })
        .finally(() => setLoading(false))
    } else {
    }
  }, [show, team])

  if (!show || !team) return null

  // Use fullTeam for rendering
  const teamData = fullTeam || team
  const members = teamData.members || teamMembers || []
  const mainRoster = teamData.mainRoster || mainRosterMembers || []
  const substitutes = teamData.substituteRoster || substituteRosterMembers || []

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg shadow-lg w-full max-w-2xl overflow-y-auto max-h-[90vh]">
        {/* Team Members Section */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-pink-500 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">👥</span>
            </div>
            <h3 className="text-lg font-semibold text-white font-poppins">
              Team members ({members.length})
            </h3>
          </div>
          {/* Main Roster */}
          <div className="mb-4">
            <h4 className="text-white font-semibold mb-2 font-poppins">
              Main Roster ({mainRoster.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mainRoster.map((member: any, index: number) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    {getValidImageSrc(member.profileImage) ? (
                      <Image
                        fill
                        alt={member.nickname || member.fullname}
                        className="object-cover"
                        src={getValidImageSrc(member.profileImage) || ''}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {(member.nickname || member.fullname || 'M').charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold font-poppins ${
                          member.role === 'Owner'
                            ? 'bg-pink-600 text-white'
                            : 'bg-green-600 text-white'
                        }`}
                      >
                        {member.role}
                      </span>
                    </div>
                    <div className="text-white font-medium text-sm truncate font-poppins">
                      {member.nickname || member.fullname || `Member ${index + 1}`}
                    </div>
                    <div className="text-gray-400 text-xs truncate font-poppins">
                      {member.nickname || member.fullname}#{member._id?.slice(-4) || '0000'}
                    </div>
                  </div>
                </div>
              ))}
              {mainRoster.length === 0 && (
                <div className="text-gray-400 text-sm font-poppins">
                  No main roster members listed.
                </div>
              )}
            </div>
          </div>

          {/* Substitutes */}
          <div className="mb-6">
            <h4 className="text-white font-semibold mb-2 font-poppins">
              Substitutes ({substitutes.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {substitutes.map((member, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    {getValidImageSrc(member.profileImage) ? (
                      <Image
                        fill
                        alt={member.nickname || member.fullname}
                        className="object-cover"
                        src={getValidImageSrc(member.profileImage) || ''}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {(member.nickname || member.fullname || 'M').charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-1 rounded text-xs font-semibold font-poppins bg-blue-600 text-white">
                        Sub
                      </span>
                    </div>
                    <div className="text-white font-medium text-sm truncate font-poppins">
                      {member.nickname || member.fullname || `Member ${index + 1}`}
                    </div>
                    <div className="text-gray-400 text-xs truncate font-poppins">
                      {member.nickname || member.fullname}#{member._id?.slice(-4) || '0000'}
                    </div>
                  </div>
                </div>
              ))}
              {substitutes.length === 0 && (
                <div className="text-gray-400 text-sm font-poppins">No substitutes listed.</div>
              )}
            </div>
          </div>

          {/* Footer Info */}
          <div className="border-t border-gray-700/20 pt-4">
            <div className="flex justify-between items-center text-sm font-poppins">
              <div className="text-gray-400">
                <span className="font-medium">Registered:</span>{' '}
                <span className="text-white">
                  {teamData.datecreation && !isNaN(new Date(teamData.datecreation).getTime())
                    ? new Intl.DateTimeFormat('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      }).format(new Date(teamData.datecreation))
                    : 'N/A'}
                </span>
              </div>
              <div className="text-gray-400">
                <span className="font-medium">{members.length} members</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t border-gray-700/20 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button
              label="View Team Profile"
              size="s"
              variant="outlined-red"
              className="w-full sm:w-auto"
              onClick={() => onViewProfile(team._id)}
            />
            <Button
              label="Close"
              size="s"
              variant="outlined-grey"
              className="w-full sm:w-auto"
              onClick={onClose}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeamModal
