'use client'

import { Search, X } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

import Input from '@/components/ui/Inputs'
import Button from '@/components/ui/Button'
import Typo from '@/components/ui/Typo'
import { Tournament } from '@/types/tournamentType'
import { ParticipantStatus } from '@/types/participantType'
import { Team } from '@/types/teamType'
import ParticipantCard from '@/components/ui/ParticipantCard'
import { getTeamById } from '@/services/teamService'
import { teamImageSanitizer, imageUrlSanitizer } from '@/utils/imageUrlSanitizer'

type FilterType = ParticipantStatus | 'all'

const TournamentParticipant = ({
  tournament,
  filter = 'all',
  searchQuery = '',
}: {
  tournament: Tournament
  filter?: FilterType
  searchQuery?: string
}) => {
  const router = useRouter()
  const [showTeamModal, setShowTeamModal] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null)
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [mainRosterMembers, setMainRosterMembers] = useState<any[]>([])
  const [substituteRosterMembers, setSubstituteRosterMembers] = useState<any[]>([])
  const [loadingTeam, setLoadingTeam] = useState(false)

  // Helper function to validate and fix image URLs
  const getValidImageSrc = (imageSrc: string | undefined): string | null => {
    if (!imageSrc) return null
    return imageUrlSanitizer(imageSrc, 'user')
  }

  // Handle team click - show team details modal
  const handleTeamClick = async (participant: any) => {
    if (!participant.team?._id) return

    setLoadingTeam(true)
    try {
      const teamData = await getTeamById(participant.team._id)
      setSelectedTeam(teamData)
      setSelectedParticipant(participant)

      // Extract only participant team members grouped as main roster vs subs
      const allMembers: any[] = []
      const mainIds = [...(participant.teamMembers || [])]
      const subIds = [...(participant.substituteMembers || [])]

      // Add team owner if they are participating
      if (teamData.teamowner && teamData.teamowner.length > 0) {
        teamData.teamowner.forEach((owner: any) => {
          const ownerId = typeof owner.user === 'string' ? owner.user : owner.user?._id
          if (mainIds.includes(ownerId) || subIds.includes(ownerId)) {
            allMembers.push({
              ...owner.user,
              role: 'Owner',
              joinedAt: teamData.datecreation,
            })
          }
        })
      }

      // Add team roster members who are participating
      if (teamData.teamroster && teamData.teamroster.length > 0) {
        teamData.teamroster.forEach((member: any) => {
          const memberId = typeof member.user === 'string' ? member.user : member.user?._id
          if (mainIds.includes(memberId) || subIds.includes(memberId)) {
            allMembers.push({
              ...member.user,
              role: 'Member',
              joinedAt: member.joinedAt,
            })
          }
        })
      }
      // Split into main roster and substitutes using ids lists
      setMainRosterMembers(allMembers.filter(m => mainIds.includes(m._id)))
      setSubstituteRosterMembers(allMembers.filter(m => subIds.includes(m._id)))
      setTeamMembers(allMembers)
      setShowTeamModal(true)
    } catch (error) {
      console.error('Failed to fetch team details:', error)
    } finally {
      setLoadingTeam(false)
    }
  }

  const filteredParticipants =
    filter === 'all'
      ? tournament.participants
      : tournament.participants.filter(participant => participant.status === filter)

  const searchedParticipants = searchQuery
    ? filteredParticipants.filter(p =>
        tournament.gameMode === 'Solo'
          ? p.user?.nickname?.toLowerCase().includes(searchQuery.toLowerCase())
          : p.team?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : filteredParticipants

  return (
    <>
      {/* <div className="w-full flex flex-wrap justify-start items-center gap-3">
        <Typo fontVariant="p4">Filter :</Typo>

        <Button
          href="?filter=all"
          label="All"
          selected={filter === 'all'}
          size="xs"
          variant={filter === 'all' ? 'contained-red' : 'outlined-grey'}
        />
        <Button
          href="?filter=Registered"
          label="Registered"
          selected={filter === 'Registered'}
          size="xs"
          variant={filter === 'Registered' ? 'contained-red' : 'outlined-grey'}
        />
        <Button
          href="?filter=Pending"
          label="Pending"
          selected={filter === 'Pending'}
          size="xs"
          variant={filter === 'Pending' ? 'contained-red' : 'outlined-grey'}
        />
        <Button
          href="?filter=Rejected"
          label="Rejected"
          selected={filter === 'Rejected'}
          size="xs"
          variant={filter === 'Rejected' ? 'contained-red' : 'outlined-grey'}
        />

        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <input
            aria-label="Search"
            className="pl-8 pr-4 w-full bg-transparent border border-white/50 outline-none rounded-md h-10 text-sm text-white placeholder-gray-400"
            defaultValue="" // ✅ SSR-friendly, no hydration mismatch
            placeholder="Search..."
            type="search"
          />
        </div>
      </div> */}

      <div>
        <Typo className="mt-16" fontVariant="h4">
          {tournament.gameMode === 'Team' ? 'Teams' : 'Players'} ({tournament.participants.length})
        </Typo>

        <div className="w-full flex flex-wrap justify-start items-center gap-8 mt-5">
          {searchedParticipants.length > 0 ? (
            searchedParticipants.map(participant => {
              const isTeamTournament = tournament.gameMode === 'Team'

              return (
                <div
                  key={participant._id}
                  className={`cursor-pointer transition-transform hover:scale-105 ${
                    isTeamTournament && participant.team?._id ? 'cursor-pointer' : 'cursor-default'
                  }`}
                  onClick={() => {
                    if (isTeamTournament && participant.team?._id) {
                      handleTeamClick(participant)
                    }
                  }}
                >
                  <ParticipantCard participant={participant} />
                </div>
              )
            })
          ) : (
            <Typo
              alignment="center"
              as="p"
              className="w-full regular-16 lg:regular-20"
              fontVariant="p4"
            >
              No {tournament.gameMode === 'Team' ? 'teams' : 'participants'} have joined the
              tournament yet. <br />
              Be the first to join and showcase your{' '}
              {tournament.gameMode === 'Team' ? "team's" : ''} skills!
            </Typo>
          )}
        </div>
      </div>

      {/* Team Details Modal */}
      {showTeamModal && selectedTeam && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="relative border-b border-gray-700/20 p-6">
              <button
                onClick={() => setShowTeamModal(false)}
                className="absolute right-4 top-4 text-gray-400 hover:text-white text-2xl font-bold"
              >
                ×
              </button>

              <div className="flex items-start gap-4">
                {/* Team Avatar */}
                <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                  {teamImageSanitizer(
                    selectedTeam.profileImage || selectedTeam.coverImage || '',
                  ) ? (
                    <Image
                      fill
                      alt={selectedTeam.name || 'Team'}
                      className="object-cover"
                      src={teamImageSanitizer(
                        selectedTeam.profileImage || selectedTeam.coverImage || '',
                      )}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-defendrRed via-defendrBlue to-defendrRed flex items-center justify-center">
                      <span className="text-white font-bold text-2xl">
                        {selectedTeam.name?.charAt(0) || 'T'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Team Info */}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2 font-poppins">
                    {selectedTeam.name}
                  </h2>
                  <div className="text-gray-400 text-sm mb-2 font-poppins">
                    #{selectedTeam._id?.slice(-3) || '000'}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-400 text-sm font-medium font-poppins">
                      Checked In
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Members Section */}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-pink-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">👥</span>
                </div>
                <h3 className="text-lg font-semibold text-white font-poppins">
                  Team members ({teamMembers.length})
                </h3>
              </div>

              {/* Main Roster */}
              <div className="mb-4">
                <h4 className="text-white font-semibold mb-2 font-poppins">
                  Main Roster ({mainRosterMembers.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mainRosterMembers.map((member, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg"
                    >
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
                                : 'bg-gray-600 text-gray-300'
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
                  {mainRosterMembers.length === 0 && (
                    <div className="text-gray-400 text-sm font-poppins">
                      No main roster members listed.
                    </div>
                  )}
                </div>
              </div>

              {/* Substitutes */}
              <div className="mb-6">
                <h4 className="text-white font-semibold mb-2 font-poppins">
                  Substitutes ({substituteRosterMembers.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {substituteRosterMembers.map((member, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg"
                    >
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
                  {substituteRosterMembers.length === 0 && (
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
                      {selectedParticipant?.participationDate
                        ? new Intl.DateTimeFormat('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                          }).format(new Date(selectedParticipant.participationDate))
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="text-gray-400">
                    <span className="font-medium">{teamMembers.length} members</span>
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
                  onClick={() => {
                    router.push(`/team/${selectedTeam._id}/profile`)
                    setShowTeamModal(false)
                  }}
                />
                <Button
                  label="Close"
                  size="s"
                  variant="outlined-grey"
                  className="w-full sm:w-auto"
                  onClick={() => setShowTeamModal(false)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default TournamentParticipant
