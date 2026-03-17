'use client'

import { useEffect, useState } from 'react'

import { getAllGames } from '@/services/gameService'
import { getAllUsers } from '@/services/userService'
import { getAllTournaments } from '@/services/tournamentService'
import Loader from '@/app/loading'
export default function Stats() {
  const [gamesCount, setGamesCount] = useState<number>(0)
  const [usersCount, setUsersCount] = useState<number>(0)
  const [tournamentsCount, setTournamentsCount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gamesResponse, usersResponse, tournamentsResponse] = await Promise.all([
          getAllGames(),
          getAllUsers(),
          getAllTournaments(),
        ])
        setGamesCount(gamesResponse.length)
        setUsersCount(usersResponse.length)
        setTournamentsCount(tournamentsResponse.pagination.totalTournaments)
      } catch (err) {
        setError('Failed to fetch data. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])
  if (gamesCount === 0 || gamesCount === null || gamesCount === undefined) {
    setGamesCount(100)
  }
  if (usersCount === 0 || usersCount === null || usersCount === undefined) {
    setUsersCount(500)
  }
  if (tournamentsCount === 0 || tournamentsCount === null || tournamentsCount === undefined) {
    setTournamentsCount(50)
  }
  if (isLoading) {
    return <Loader />
  }

  return (
    <section
      className="relative p-5 py-40 bg-center bg-cover bg-no-repeat"
      style={{
        backgroundImage: "url('/assets/Rectangle 2655.png')",
      }}
    >
      {' '}
      <div className="container mx-auto grid gap-7 md:grid-cols-3">
        <div className="text-center p-4">
          <h3 className="text-4xl sm:text-7xl font-bold">{gamesCount}</h3>
          <p className="uppercase font-poppins">games</p>
        </div>
        <div className="text-center p-4">
          <h3 className="text-4xl sm:text-7xl font-bold">{usersCount}</h3>
          <p className="uppercase font-poppins">Users</p>
        </div>
        <div className="text-center p-4">
          <h3 className="text-4xl sm:text-7xl font-bold">{tournamentsCount}</h3>
          <p className="uppercase font-poppins">Tournaments</p>
        </div>
      </div>
    </section>
  )
}
