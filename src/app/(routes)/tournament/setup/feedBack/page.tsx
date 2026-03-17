import Image from 'next/image'
import Link from 'next/link'
import { cookies } from 'next/headers'

import Typo from '@/components/ui/Typo'
import { getReviewsByTournament } from '@/services/review'
import { getUserById } from '@/services/userService'
import ninjaIcon from '@/components/assets/tournament/ninja.jpg'
import Pagination from '@/components/ui/Pagination'

interface FeedbackStats {
  totalFeedback: number
  averageRating: number
  negativeFeedback: number
}

interface DisplayReview {
  id: string
  username: string
  avatar: string
  timeAgo: string
  rating: number
  comment: string
}

const reviewsPerPage = 4

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInHours / 24)

  if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
  }
  if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
  }
  return 'Less than an hour ago'
}

function renderStars(rating: number) {
  return Array.from({ length: 5 }, (_, index) => (
    <span key={index} className={`text-lg ${index < rating ? 'text-defendrRed' : 'text-gray-600'}`}>
      ★
    </span>
  ))
}

type PageProps = {
  searchParams: Promise<{ page?: string | string[] }>
}

export default async function FeedbackPage({ searchParams }: PageProps) {
  // Get tournamentId from cookie (server-side)
  const cookieStore = await cookies()
  const cookieTournamentId = cookieStore.get('createdTournamentId')?.value
  const tournamentId = cookieTournamentId || '6896946e09356e979bc33198'

  // Current page via search params (SSR pagination)
  const sp = await searchParams
  const pageParam = Array.isArray(sp.page) ? sp.page[0] : sp.page
  const currentPage = Math.max(1, Number(pageParam ?? '1') || 1)

  let reviews: DisplayReview[] = []
  let stats: FeedbackStats = { totalFeedback: 0, averageRating: 0, negativeFeedback: 0 }
  let totalPages = 1
  let error: string | null = null

  try {
    const reviewsData = await getReviewsByTournament(tournamentId)
    if (reviewsData && reviewsData.length > 0) {
      const totalFeedback = reviewsData.length
      const averageRating =
        reviewsData.reduce((sum, review) => sum + review.rating, 0) / totalFeedback
      const negativeFeedback = reviewsData.filter(r => r.rating <= 2).length

      stats = {
        totalFeedback,
        averageRating: Math.round(averageRating * 10) / 10,
        negativeFeedback,
      }

      // Resolve usernames on the server
      const displayReviews = await Promise.all(
        reviewsData.map(async (review, index) => {
          let reviewerName = `Participant ${index + 1}`
          if (review.reviewer) {
            try {
              const reviewer = await getUserById(review.reviewer)
              reviewerName = reviewer.fullname || reviewer.nickname || reviewerName
            } catch {
              // ignore user fetch failure per original logic
            }
          }
          return {
            id: review._id,
            username: reviewerName,
            avatar: ninjaIcon.src,
            timeAgo: formatTimeAgo(review.reviewDate),
            rating: review.rating,
            comment: review.feedback || 'No comment provided',
          } as DisplayReview
        }),
      )

      totalPages = Math.max(1, Math.ceil(displayReviews.length / reviewsPerPage))
      const startIndex = (currentPage - 1) * reviewsPerPage
      const endIndex = startIndex + reviewsPerPage
      reviews = displayReviews.slice(startIndex, endIndex)
    }
  } catch (e) {
    error = 'Failed to load reviews. Please try again.'
  }

  return (
    <div className="h-screen bg-defendrBg text-white p-6">
      <div className="flex justify-between items-center mb-8">
        <Typo as="h1" className="text-2xl" color="white" fontFamily="poppins" fontVariant="h1">
          Feedback and rating Section
        </Typo>
        <div className="text-sm text-defendrLightGrey">{`Total Reviews: ${stats.totalFeedback}`}</div>
      </div>

      {/* Error State */}
      {error && (
        <div className="flex justify-center items-center h-64">
          <div className="text-defendrRed text-xl font-poppins">{error}</div>
        </div>
      )}

      {/* Content */}
      {!error && (
        <>
          {/* Statistics */}
          <div className="flex justify-center gap-12 mb-12">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-statTotal flex items-center justify-center mb-4">
                <span className="text-white text-4xl font-bold font-poppins">
                  {stats.totalFeedback}
                </span>
              </div>
              <span className="text-white text-sm font-poppins">Total feedback</span>
            </div>

            <div className="flex flex-col items-center">
              <div
                className={`w-32 h-32 rounded-full bg-statAverage flex items-center justify-center mb-4`}
              >
                <span className="text-white text-4xl font-bold font-poppins">
                  {stats.averageRating}
                </span>
              </div>
              <span className="text-white text-sm font-poppins">Average rating</span>
            </div>

            <div className="flex flex-col items-center">
              <div
                className={`w-32 h-32 rounded-full bg-statNegative flex items-center justify-center mb-4`}
              >
                <span className="text-white text-4xl font-bold font-poppins">
                  {stats.negativeFeedback}
                </span>
              </div>
              <span className="text-white text-sm font-poppins">Negative feedback</span>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mb-8">
            <Typo
              as="h2"
              className="text-xl mb-6"
              color="white"
              fontFamily="poppins"
              fontVariant="h2"
            >
              Reviews
            </Typo>

            {/* No Reviews */}
            {stats.totalFeedback === 0 && (
              <div className="flex justify-center items-center h-32">
                <div className="text-defendrLightGrey text-lg font-poppins">
                  No feedback for the moment
                </div>
              </div>
            )}

            {/* Reviews List */}
            {reviews.length > 0 && (
              <div className="space-y-6">
                {reviews.map(review => (
                  <div key={review.id} className="flex gap-6">
                    <div className="flex flex-col items-center min-w-[120px]">
                      <Image
                        alt={review.username}
                        className="rounded-full object-cover mb-2"
                        height={48}
                        src={review.avatar}
                        width={48}
                      />
                      <span className="text-white font-poppins text-sm text-center">
                        {review.username}
                      </span>
                      <span className="text-defendrLightGrey text-xs text-center">
                        {review.timeAgo}
                      </span>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-defendrLightGrey text-sm leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination (SSR via links) */}
          {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} />}
        </>
      )}
    </div>
  )
}
