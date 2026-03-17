'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Search, Filter, Building, Users, Calendar } from 'lucide-react'

import Typo from '@/components/ui/Typo'
import Button from '@/components/ui/Button'
import Loader from '@/app/loading'
import { getAllOrganizations } from '@/services/organizationService'
import OrganizationCard from '@/components/ui/OrganizationCard'
import Pagination from '@/components/ui/Pagination'

interface Organization {
  _id: string
  name: string
  description?: string
  foundedYear?: number
  logo?: string
  logoImage?: string
  bannerImage?: string
  coverImage?: string
  staff?: any[]
  staffCount?: number
  memberCount?: number
  tournaments?: any[]
  tournamentCount?: number
  socialMediaFollowers?: number
  followers?: any[]
  nbFollowers?: number
  location?: string
  website?: string
  isVerified?: boolean
  achieved?: boolean
  createdAt?: string
  establishedDate?: string
  createdBy?: any
}

type FoundedYearFilter = 'all' | '2020+' | '2015+' | '2010+' | '2005+' | '2000+'
type SizeFilter = 'all' | 'small' | 'medium' | 'large'

export default function OrganizationsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session } = useSession()

  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFoundedYear, setSelectedFoundedYear] = useState<FoundedYearFilter>('all')
  const [selectedSize, setSelectedSize] = useState<SizeFilter>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(9)

  // Initialize current page from URL parameters
  useEffect(() => {
    const pageParam = searchParams.get('page')
    if (pageParam) {
      const page = parseInt(pageParam, 10)
      if (page > 0) {
        setCurrentPage(page)
      }
    }
  }, [searchParams])

  // Fetch organizations
  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const organizationsData = await getAllOrganizations()
        setOrganizations(organizationsData || [])
      } catch (error) {
        console.error('Failed to fetch organizations:', error)
        setOrganizations([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Filter organizations based on criteria
  const filteredOrganizations = useMemo(() => {
    let filtered = organizations

    // Filter out archived organizations (achieved: true)
    filtered = filtered.filter(org => !org.achieved)

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        org =>
          org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          org.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          org.location?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Founded year filter
    if (selectedFoundedYear !== 'all') {
      const yearThreshold = parseInt(selectedFoundedYear.replace('+', ''))
      filtered = filtered.filter(org => {
        if (!org.foundedYear) return false
        return org.foundedYear >= yearThreshold
      })
    }

    // Size filter
    if (selectedSize !== 'all') {
      filtered = filtered.filter(org => {
        const staffCount = org.staffCount || 0
        switch (selectedSize) {
          case 'small':
            return staffCount < 10
          case 'medium':
            return staffCount >= 10 && staffCount < 50
          case 'large':
            return staffCount >= 50
          default:
            return true
        }
      })
    }

    // Sort by creation date DESC (newest first)
    filtered = filtered.sort((a, b) => {
      // Try multiple date fields: establishedDate, createdAt, or extract from MongoDB _id
      const getDateA = () => {
        if (a.establishedDate) return new Date(a.establishedDate).getTime()
        if (a.createdAt) return new Date(a.createdAt).getTime()
        // Extract timestamp from MongoDB ObjectId (first 8 characters are timestamp)
        if (a._id && a._id.length >= 8) {
          const timestamp = parseInt(a._id.substring(0, 8), 16) * 1000
          return timestamp
        }
        return 0
      }

      const getDateB = () => {
        if (b.establishedDate) return new Date(b.establishedDate).getTime()
        if (b.createdAt) return new Date(b.createdAt).getTime()
        // Extract timestamp from MongoDB ObjectId (first 8 characters are timestamp)
        if (b._id && b._id.length >= 8) {
          const timestamp = parseInt(b._id.substring(0, 8), 16) * 1000
          return timestamp
        }
        return 0
      }

      const dateA = getDateA()
      const dateB = getDateB()
      return dateB - dateA // DESC order
    })

    return filtered
  }, [organizations, searchQuery, selectedFoundedYear, selectedSize])

  // Pagination
  const totalPages = Math.ceil(filteredOrganizations.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedOrganizations = filteredOrganizations.slice(startIndex, startIndex + itemsPerPage)

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedFoundedYear, selectedSize])

  const handleFilterChange = (filterType: string, value: string) => {
    switch (filterType) {
      case 'foundedYear':
        setSelectedFoundedYear(value as FoundedYearFilter)
        break
      case 'size':
        setSelectedSize(value as SizeFilter)
        break
    }

    // Reset to page 1 when filters change
    setCurrentPage(1)

    // Update URL to remove page parameter when filters change
    const url = new URL(window.location.href)
    url.searchParams.delete('page')
    window.history.pushState({}, '', url.toString())
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })

    // Update URL with page parameter
    const url = new URL(window.location.href)
    url.searchParams.set('page', page.toString())
    window.history.pushState({}, '', url.toString())
  }

  const handleViewOrganization = (orgId: string) => {
    router.push(`/organization/${orgId}/Profile`)
  }

  const handleRequestToJoin = (orgId: string) => {
    // TODO: Implement request to join functionality
    console.log('Request to join organization:', orgId)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-white">
        <Loader />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#161616] text-white">
      <div className="max-w-[1400px] mx-auto p-4 sm:p-6 md:p-10">
        {/* Header */}
        <div className="mb-8">
          <Typo as="h1" fontFamily="poppins" fontVariant="h1" className="mb-2">
            Organizations
          </Typo>
          <Typo as="p" color="ghostGrey" fontFamily="poppins" fontVariant="p4">
            Discover and join esports organizations from around the world
          </Typo>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search organizations..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
                // Update URL to remove page parameter when searching
                const url = new URL(window.location.href)
                url.searchParams.delete('page')
                window.history.pushState({}, '', url.toString())
              }}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-defendrRed focus:border-transparent"
            />
          </div>

          {/* Filter Row */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Founded Year Filter */}
            <div className="flex items-center gap-2 w-full sm:w-auto sm:min-w-[200px]">
              <Calendar className="h-5 w-5 text-gray-400 flex-shrink-0" />
              <select
                value={selectedFoundedYear}
                onChange={e => handleFilterChange('foundedYear', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-defendrRed"
              >
                <option value="all">All Founded Years</option>
                <option value="2020+">2020+</option>
                <option value="2015+">2015+</option>
                <option value="2010+">2010+</option>
                <option value="2005+">2005+</option>
                <option value="2000+">2000+</option>
              </select>
            </div>

            {/* Size Filter */}
            <div className="flex items-center gap-2 w-full sm:w-auto sm:min-w-[200px]">
              <Users className="h-5 w-5 text-gray-400 flex-shrink-0" />
              <select
                value={selectedSize}
                onChange={e => handleFilterChange('size', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-defendrRed"
              >
                <option value="all">All Sizes</option>
                <option value="small">Small (1-9 staff)</option>
                <option value="medium">Medium (10-49 staff)</option>
                <option value="large">Large (50+ staff)</option>
              </select>
            </div>

            {/* Clear Filters */}
            <Button
              label="Clear Filters"
              size="s"
              variant="outlined-grey"
              onClick={() => {
                setSearchQuery('')
                setSelectedFoundedYear('all')
                setSelectedSize('all')
                setCurrentPage(1)
                // Update URL to remove all parameters when clearing filters
                const url = new URL(window.location.href)
                url.searchParams.delete('page')
                window.history.pushState({}, '', url.toString())
              }}
              className="w-full sm:w-auto"
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <Typo as="p" color="ghostGrey" fontFamily="poppins" fontVariant="p5">
            Showing {paginatedOrganizations.length} of {filteredOrganizations.length} organizations
          </Typo>
        </div>

        {/* Organizations Grid */}
        {paginatedOrganizations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-8 mb-8">
            {paginatedOrganizations.map(organization => (
              <OrganizationCard
                key={organization._id}
                organization={organization}
                onViewOrganization={() => handleViewOrganization(organization._id)}
                onRequestToJoin={() => handleRequestToJoin(organization._id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-gray-400 text-4xl">🏢</span>
            </div>
            <Typo as="h3" color="white" fontFamily="poppins" fontVariant="h4" className="mb-2">
              No Organizations Found
            </Typo>
            <Typo as="p" color="ghostGrey" fontFamily="poppins" fontVariant="p4">
              Try adjusting your filters or search terms
            </Typo>
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  )
}
