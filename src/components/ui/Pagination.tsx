'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange?: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  // Build visible page numbers: show max 5 with ellipsis
  const getVisiblePages = () => {
    const pages: (number | '...')[] = []

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push('...')
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      for (let i = start; i <= end; i++) pages.push(i)
      if (currentPage < totalPages - 2) pages.push('...')
      pages.push(totalPages)
    }

    return pages
  }

  const visiblePages = getVisiblePages()

  // If onPageChange is provided, use buttons. Otherwise use Links.
  if (onPageChange) {
    return (
      <div className="flex justify-center items-center gap-1.5 flex-wrap py-4">
        <button
          disabled={currentPage === 1}
          className="px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-[#2c3036] text-gray-300 hover:bg-[#383d42] disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={() => onPageChange(currentPage - 1)}
        >
          ← Prev
        </button>

        {visiblePages.map((page, idx) =>
          page === '...' ? (
            <span key={`ellipsis-${idx}`} className="px-2 py-2 text-gray-500 text-sm">
              …
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                page === currentPage
                  ? 'bg-[#D62555] text-white'
                  : 'bg-[#2c3036] text-gray-400 hover:text-white hover:bg-[#383d42]'
              }`}
            >
              {page}
            </button>
          ),
        )}

        <button
          disabled={currentPage === totalPages}
          className="px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-[#2c3036] text-gray-300 hover:bg-[#383d42] disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next →
        </button>
      </div>
    )
  }

  // Link-based fallback (server-side pages)
  return (
    <div className="flex justify-center items-center gap-1.5 flex-wrap py-4">
      <Link
        aria-disabled={currentPage === 1}
        className={cn(
          'px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-[#2c3036]',
          currentPage === 1
            ? 'text-gray-600 pointer-events-none opacity-40'
            : 'text-gray-300 hover:bg-[#383d42]',
        )}
        href={`?page=${Math.max(1, currentPage - 1)}`}
      >
        ← Prev
      </Link>

      {visiblePages.map((page, idx) =>
        page === '...' ? (
          <span key={`ellipsis-${idx}`} className="px-2 py-2 text-gray-500 text-sm">
            …
          </span>
        ) : (
          <Link
            key={page}
            className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
              page === currentPage
                ? 'bg-[#D62555] text-white'
                : 'bg-[#2c3036] text-gray-400 hover:text-white hover:bg-[#383d42]'
            }`}
            href={`?page=${page}`}
          >
            {page}
          </Link>
        ),
      )}

      <Link
        aria-disabled={currentPage === totalPages}
        className={cn(
          'px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-[#2c3036]',
          currentPage === totalPages
            ? 'text-gray-600 pointer-events-none opacity-40'
            : 'text-gray-300 hover:bg-[#383d42]',
        )}
        href={`?page=${Math.min(totalPages, currentPage + 1)}`}
      >
        Next →
      </Link>
    </div>
  )
}
