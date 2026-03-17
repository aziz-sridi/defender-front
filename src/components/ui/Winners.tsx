import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import * as XLSX from 'xlsx'

import { BASE_URL } from '@/lib/api/constants'

import Button from '@/components/ui/Button'
import CustomCheckBox from '@/components/ui/customCheckBox'
import Modal from '@/components/ui/Modal'
import { getTournamentById } from '@/services/tournamentService'
import { getUserById } from '@/services/userService'

interface Winner {
  id: string
  rank: number
  nickname: string
  email: string
  country: string
  profileImage?: string
  redPoints?: number
  level?: string
}

interface WinnersProps {
  className?: string
  tournamentId?: string
}

const Winners: React.FC<WinnersProps> = ({ className = '', tournamentId }) => {
  const { data: session } = useSession()
  const [winners, setWinners] = useState<Winner[]>([])
  const [filteredWinners, setFilteredWinners] = useState<Winner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectAll, setSelectAll] = useState(false)
  const [selectedWinners, setSelectedWinners] = useState<string[]>([])
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [filters, setFilters] = useState({
    country: '',
    level: '',
  })

  useEffect(() => {
    const loadWinners = async () => {
      if (!tournamentId || !session?.accessToken) {
        setIsLoading(false)
        return
      }

      try {
        console.log('Loading tournament winners for:', tournamentId)

        const tournament = await getTournamentById(tournamentId)
        console.log('Tournament data:', tournament)

        if (tournament.winner) {
          const winnerIds = Array.isArray(tournament.winner)
            ? tournament.winner
            : [tournament.winner]

          if (winnerIds.length > 0) {
            const winnerPromises = winnerIds.map(async (winnerId: string, index: number) => {
              try {
                const user = await getUserById(winnerId)
                return {
                  id: user._id,
                  rank: index + 1,
                  nickname: user.nickname,
                  email: user.email,
                  country: user.country || 'Not specified',
                  profileImage: user.profileImage,
                  redPoints: user.redPoints || 0,
                  level:
                    user.redPoints > 100
                      ? 'Advanced'
                      : user.redPoints > 50
                        ? 'Intermediate'
                        : 'Beginner',
                }
              } catch (error) {
                console.error('Error fetching winner details:', error)
                return null
              }
            })

            const winnerDetails = await Promise.all(winnerPromises)
            const validWinners = winnerDetails.filter(winner => winner !== null) as Winner[]

            console.log('Loaded winners:', validWinners)
            setWinners(validWinners)
            setFilteredWinners(validWinners)
          } else {
            console.log('Winner array is empty')
            setWinners([])
            setFilteredWinners([])
          }
        } else {
          console.log('No winners found for this tournament')
          setWinners([])
          setFilteredWinners([])
        }
      } catch (error) {
        console.error('Error loading winners:', error)
        setWinners([])
        setFilteredWinners([])
      } finally {
        setIsLoading(false)
      }
    }

    loadWinners()
  }, [tournamentId, session?.accessToken])

  useEffect(() => {
    let filtered = [...winners]

    if (filters.country) {
      filtered = filtered.filter(winner =>
        winner.country.toLowerCase().includes(filters.country.toLowerCase()),
      )
    }

    if (filters.level) {
      filtered = filtered.filter(
        winner => winner.level?.toLowerCase() === filters.level.toLowerCase(),
      )
    }

    setFilteredWinners(filtered)
    setSelectedWinners([])
    setSelectAll(false)
  }, [filters, winners])

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked)
    if (checked) {
      setSelectedWinners(filteredWinners.map(w => w.id))
    } else {
      setSelectedWinners([])
    }
  }

  const handleSelectWinner = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedWinners(prev => [...prev, id])
    } else {
      setSelectedWinners(prev => prev.filter(wId => wId !== id))
      setSelectAll(false)
    }
  }

  const handleApplyFilters = () => {
    console.log('Applying filters:', filters)
    setShowFilterModal(false)
  }

  const handleClearFilters = () => {
    setFilters({ country: '', level: '' })
  }

  const handleDownloadFile = () => {
    try {
      const exportData = filteredWinners.map(winner => ({
        Rank: winner.rank,
        Nickname: winner.nickname,
        Email: winner.email,
        Country: winner.country,
        'Red Points': winner.redPoints || 0,
        Level: winner.level || 'Beginner',
      }))

      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet(exportData)

      XLSX.utils.book_append_sheet(wb, ws, 'Winners')

      const timestamp = new Date().toISOString().split('T')[0]
      const filename = `tournament_winners_${timestamp}.xlsx`

      XLSX.writeFile(wb, filename)

      console.log('Excel file downloaded successfully:', filename)
    } catch (error) {
      console.error('Error downloading Excel file:', error)
      toast.error('Failed to download file. Please try again.')
    }
  }

  return (
    <div className={`bg-defendrBg text-white p-6 ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-white text-2xl font-poppins">Winners</h2>
        <div className="flex gap-3">
          <Button
            className="font-poppins text-sm px-4 py-2 flex items-center gap-2"
            icon={
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  clipRule="evenodd"
                  d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                  fillRule="evenodd"
                />
              </svg>
            }
            iconOrientation="left"
            label="Filters"
            size="xxs"
            variant="contained-red"
            onClick={() => setShowFilterModal(true)}
          />

          <Button
            className="font-poppins text-sm px-4 py-2 flex items-center gap-2"
            icon={
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  clipRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  fillRule="evenodd"
                />
              </svg>
            }
            iconOrientation="left"
            label="Download"
            size="xxs"
            variant="contained-red"
            onClick={handleDownloadFile}
          />
        </div>
      </div>

      <div className="bg-defendrLightBlack rounded-lg overflow-hidden">
        <div className="grid grid-cols-6 gap-12 p-4 border-b border-defendrGrey/20 text-sm font-poppins text-defendrGrey">
          <div className="w-12">
            <CustomCheckBox
              checked={selectAll}
              id="select-all-winners"
              label=""
              onChange={() => handleSelectAll(!selectAll)}
            />
          </div>
          <div className="w-16">Rank</div>
          <div className="w-40">Player</div>
          <div className="w-32">Country</div>
          <div className="w-64">Email</div>
          <div className="w-32 ml-8">Level</div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="text-white font-poppins">Loading winners...</div>
          </div>
        ) : filteredWinners.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-defendrGrey font-poppins">
              {winners.length === 0
                ? 'No winners found for this tournament'
                : 'No winners match the current filters'}
            </div>
          </div>
        ) : (
          filteredWinners.map(winner => (
            <div
              key={winner.id}
              className="grid grid-cols-6 gap-12 p-4 border-b border-defendrGrey/10 hover:bg-defendrGrey/5 transition-colors duration-200"
            >
              <div className="w-12">
                <CustomCheckBox
                  checked={selectedWinners.includes(winner.id)}
                  id={`winner-${winner.id}`}
                  label=""
                  onChange={() =>
                    handleSelectWinner(winner.id, !selectedWinners.includes(winner.id))
                  }
                />
              </div>
              <div className="w-16 text-white font-poppins text-lg">{winner.rank}</div>
              <div className="w-40 flex items-center gap-2">
                <Image
                  alt="Player"
                  className="rounded-full object-cover flex-shrink-0"
                  height={32}
                  src={
                    winner.profileImage
                      ? `${BASE_URL}uploads/${winner.profileImage}`
                      : '/assets/tournament/profileIcon.svg'
                  }
                  width={32}
                />
                <span className="text-white font-poppins text-sm truncate">{winner.nickname}</span>
              </div>
              <div className="w-32 flex items-center gap-2">
                <div className="w-6 h-6 bg-defendrRed rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">
                    {winner.country.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-white text-sm truncate">{winner.country}</span>
              </div>
              <div className="w-64 text-white text-sm truncate">{winner.email}</div>
              <div className="w-32 ml-8 flex items-center">
                <span
                  className={`px-2 py-1 rounded text-xs font-poppins whitespace-nowrap ${
                    winner.level === 'Advanced'
                      ? 'bg-green-600'
                      : winner.level === 'Intermediate'
                        ? 'bg-yellow-600'
                        : 'bg-blue-600'
                  }`}
                >
                  {winner.level}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {showFilterModal && (
        <Modal
          isOpen={showFilterModal}
          showCloseButton={false}
          onClose={() => setShowFilterModal(false)}
        >
          <div className="bg-defendrLightBlack rounded-lg w-72 mx-auto relative flex flex-col justify-center items-center min-h-[400px]">
            <button
              className="absolute top-4 right-4 text-defendrGrey hover:text-white transition-colors z-10"
              onClick={() => setShowFilterModal(false)}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  clipRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  fillRule="evenodd"
                />
              </svg>
            </button>

            <div className="px-6 py-8 w-full">
              <div className="space-y-10 text-center">
                <div className="text-center">
                  <label className="block text-white font-poppins text-lg mb-4">Country</label>
                  <div className="relative">
                    <select
                      className="w-full bg-white border border-defendrGrey rounded-lg px-4 py-3 text-black font-poppins text-sm appearance-none cursor-pointer focus:outline-none focus:border-defendrRed text-center"
                      value={filters.country}
                      onChange={e => setFilters(prev => ({ ...prev, country: e.target.value }))}
                    >
                      <option className="text-gray-500" value="">
                        Select country
                      </option>
                      <option className="text-black" value="Tunisia">
                        Tunisia
                      </option>
                      <option className="text-black" value="France">
                        France
                      </option>
                      <option className="text-black" value="USA">
                        USA
                      </option>
                      <option className="text-black" value="Germany">
                        Germany
                      </option>
                      <option className="text-black" value="Canada">
                        Canada
                      </option>
                      <option className="text-black" value="UK">
                        UK
                      </option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          clipRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 8.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          fillRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <label className="block text-white font-poppins text-lg mb-4">Level</label>
                  <div className="relative">
                    <select
                      className="w-full bg-white border border-defendrGrey rounded-lg px-4 py-3 text-black font-poppins text-sm appearance-none cursor-pointer focus:outline-none focus:border-defendrRed text-center"
                      value={filters.level}
                      onChange={e => setFilters(prev => ({ ...prev, level: e.target.value }))}
                    >
                      <option className="text-gray-500" value="">
                        Select Level
                      </option>
                      <option className="text-black" value="Beginner">
                        Beginner
                      </option>
                      <option className="text-black" value="Intermediate">
                        Intermediate
                      </option>
                      <option className="text-black" value="Advanced">
                        Advanced
                      </option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          clipRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 8.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          fillRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-6 justify-center">
                  <Button
                    className="font-poppins text-sm px-8 py-2"
                    label="Apply"
                    size="xxs"
                    variant="contained-red"
                    onClick={handleApplyFilters}
                  />

                  <Button
                    className="font-poppins text-sm px-8 py-2"
                    label="Clear"
                    size="xxs"
                    variant="outlined-red"
                    onClick={handleClearFilters}
                  />
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default Winners
