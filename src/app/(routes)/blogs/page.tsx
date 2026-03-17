'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Eye, Tag, Search, Filter } from 'lucide-react'

import Typo from '@/components/ui/Typo'
import Loader from '@/app/loading'
import Document from '@/components/ui/Icons/Document'
import { publicBlogService } from '@/services/publicBlogService'
import type { Blog } from '@/types/blogType'

export default function BlogsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedTag, setSelectedTag] = useState<string>('all')
  const [categories, setCategories] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 12

  // Initialize from URL parameters
  useEffect(() => {
    const categoryParam = searchParams.get('category')
    const tagParam = searchParams.get('tag')
    const searchParam = searchParams.get('search')
    const pageParam = searchParams.get('page')

    if (categoryParam) setSelectedCategory(categoryParam)
    if (tagParam) setSelectedTag(tagParam)
    if (searchParam) setSearchQuery(searchParam)
    if (pageParam) {
      const page = parseInt(pageParam, 10)
      if (page > 0) setCurrentPage(page)
    }
  }, [searchParams])

  // Fetch blogs
  useEffect(() => {
    async function fetchBlogs() {
      setLoading(true)
      try {
        const params: any = {
          page: currentPage,
          limit: itemsPerPage,
        }
        if (searchQuery) params.search = searchQuery
        if (selectedCategory !== 'all') params.category = selectedCategory
        if (selectedTag !== 'all') params.tag = selectedTag

        const response = await publicBlogService.getAllBlogs(params)

        if (response?.blogs) {
          setBlogs(response.blogs)
          if (response.pagination) {
            setTotalPages(response.pagination.totalPages || 1)
          }
        } else if (Array.isArray(response)) {
          setBlogs(response)
        } else {
          setBlogs([])
        }
      } catch (error) {
        console.error('Failed to fetch blogs:', error)
        setBlogs([])
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [currentPage, searchQuery, selectedCategory, selectedTag])

  // Fetch categories and tags
  useEffect(() => {
    async function fetchFilters() {
      try {
        const [categoriesData, tagsData] = await Promise.all([
          publicBlogService.getCategories().catch(() => []),
          publicBlogService.getTags().catch(() => []),
        ])
        if (Array.isArray(categoriesData)) {
          setCategories(categoriesData)
        }
        if (Array.isArray(tagsData)) {
          setTags(tagsData)
        }
      } catch (error) {
        console.error('Failed to fetch filters:', error)
      }
    }
    fetchFilters()
  }, [])

  // Update URL when filters change
  const updateURL = (updates: {
    category?: string
    tag?: string
    search?: string
    page?: number
  }) => {
    const params = new URLSearchParams()
    if (updates.category && updates.category !== 'all') params.set('category', updates.category)
    if (updates.tag && updates.tag !== 'all') params.set('tag', updates.tag)
    if (updates.search) params.set('search', updates.search)
    if (updates.page && updates.page > 1) params.set('page', updates.page.toString())
    router.push(`/blogs${params.toString() ? `?${params.toString()}` : ''}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    updateURL({ search: searchQuery, category: selectedCategory, tag: selectedTag, page: 1 })
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setCurrentPage(1)
    updateURL({ category, tag: selectedTag, search: searchQuery, page: 1 })
  }

  const handleTagChange = (tag: string) => {
    setSelectedTag(tag)
    setCurrentPage(1)
    updateURL({ category: selectedCategory, tag, search: searchQuery, page: 1 })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return ''
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + '...'
  }

  if (loading && blogs.length === 0) {
    return <Loader />
  }

  return (
    <main className="relative container mx-auto px-4 sm:px-6 lg:px-8 mt-[80px] min-h-screen overflow-hidden">
      {/* Gaming Background Textures */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Animated Grid Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(214, 37, 85, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(214, 37, 85, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'gridMove 20s linear infinite',
          }}
        />

        {/* Floating Gaming Orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-defendrRed/20 to-pink-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-xl animate-bounce"></div>
        <div
          className="absolute top-60 left-1/2 w-20 h-20 bg-gradient-to-r from-green-500/15 to-emerald-500/15 rounded-full blur-lg animate-pulse"
          style={{ animationDelay: '1.5s' }}
        ></div>
        <div
          className="absolute top-80 right-1/4 w-16 h-16 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full blur-md animate-bounce"
          style={{ animationDelay: '0.8s' }}
        ></div>
        <div
          className="absolute bottom-60 left-1/6 w-36 h-36 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '2.2s' }}
        ></div>
        <div
          className="absolute bottom-80 right-1/6 w-22 h-22 bg-gradient-to-r from-rose-500/20 to-pink-500/20 rounded-full blur-lg animate-bounce"
          style={{ animationDelay: '1.8s' }}
        ></div>
        <div
          className="absolute top-1/2 left-1/6 w-18 h-18 bg-gradient-to-r from-amber-500/15 to-yellow-500/15 rounded-full blur-md animate-pulse"
          style={{ animationDelay: '0.3s' }}
        ></div>
        <div
          className="absolute top-1/3 right-1/6 w-26 h-26 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-full blur-xl animate-bounce"
          style={{ animationDelay: '1.2s' }}
        ></div>

        {/* Geometric Shapes - Styled like orbs */}
        <div
          className="absolute top-1/4 left-1/6 w-32 h-32 bg-gradient-to-r from-defendrRed/20 to-pink-500/20 rounded-lg blur-2xl rotate-45 animate-pulse"
          style={{ animationDelay: '2s' }}
        ></div>
        <div
          className="absolute bottom-1/4 right-1/6 w-24 h-24 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg blur-xl rotate-12 animate-bounce"
          style={{ animationDelay: '1s' }}
        ></div>
        <div
          className="absolute top-1/2 right-1/3 w-16 h-16 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-lg blur-lg -rotate-45 animate-pulse"
          style={{ animationDelay: '1.5s' }}
        ></div>
        <div
          className="absolute bottom-1/3 left-1/3 w-20 h-20 bg-gradient-to-r from-teal-500/20 to-green-500/20 rounded-lg blur-xl rotate-30 animate-bounce"
          style={{ animationDelay: '2.5s' }}
        ></div>
        <div
          className="absolute top-3/4 right-1/5 w-14 h-14 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg blur-lg -rotate-12 animate-pulse"
          style={{ animationDelay: '0.7s' }}
        ></div>

        {/* Circuit Lines Pattern */}
        <svg
          className="absolute inset-0 w-full h-full opacity-5"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="circuit"
              x="0"
              y="0"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0,50 Q25,25 50,50 T100,50"
                stroke="rgba(214, 37, 85, 0.3)"
                strokeWidth="1"
                fill="none"
              />
              <path
                d="M50,0 Q75,25 50,50 T50,100"
                stroke="rgba(214, 37, 85, 0.3)"
                strokeWidth="1"
                fill="none"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>

        {/* Pixel Art Style Dots */}
        <div className="absolute top-1/3 left-1/3 w-2 h-2 bg-defendrRed/30 rounded-sm animate-pulse"></div>
        <div
          className="absolute top-2/3 left-2/3 w-2 h-2 bg-blue-500/30 rounded-sm animate-pulse"
          style={{ animationDelay: '0.5s' }}
        ></div>
        <div
          className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-purple-500/30 rounded-sm animate-pulse"
          style={{ animationDelay: '1s' }}
        ></div>
        <div
          className="absolute top-1/4 right-1/2 w-2 h-2 bg-green-500/30 rounded-sm animate-pulse"
          style={{ animationDelay: '1.5s' }}
        ></div>
      </div>
      {/* Header */}
      <div className="text-center py-8 mb-8 relative z-10">
        <Typo
          as="h1"
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4"
          fontFamily="poppins"
          fontVariant="h1"
        >
          DEFENDR Blog
        </Typo>
        <Typo
          as="p"
          className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto"
          fontVariant="p4"
        >
          Stay updated with the latest news, insights, and stories from the esports world
        </Typo>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4 relative z-10">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search blogs..."
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#212529] text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-defendrRed focus:border-transparent transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-defendrRed hover:bg-defendrHoverRed text-white rounded-lg font-semibold transition-colors"
          >
            Search
          </button>
        </form>

        {/* Category and Tag Filters */}
        <div className="flex flex-wrap gap-4 justify-center">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <select
              value={selectedCategory}
              onChange={e => handleCategoryChange(e.target.value)}
              className="px-4 py-2 rounded-lg bg-[#212529] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-defendrRed"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <select
            value={selectedTag}
            onChange={e => handleTagChange(e.target.value)}
            className="px-4 py-2 rounded-lg bg-[#212529] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-defendrRed"
          >
            <option value="all">All Tags</option>
            {tags.map(tag => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="relative z-10">
        {blogs.length === 0 ? (
          <div className="text-center py-16">
            <Typo as="p" className="text-xl text-gray-400" fontVariant="p4">
              No blogs found. Try adjusting your filters.
            </Typo>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {blogs.map(blog => (
                <Link
                  key={blog._id}
                  href={`/blogs/${blog.slug}`}
                  className="group bg-[#212529] rounded-lg overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer"
                >
                  {/* Cover Image */}
                  <div className="relative w-full h-48 overflow-hidden">
                    {blog.coverImage ? (
                      <Image
                        src={blog.coverImage}
                        alt={blog.blog_title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-defendrRed/20 to-defendrGrey flex items-center justify-center">
                        <Document size={48} className="text-gray-600" />
                      </div>
                    )}
                    {blog.featured && (
                      <div className="absolute top-2 right-2 bg-defendrRed text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Featured
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-3">
                    {/* Category */}
                    {blog.category && (
                      <div className="flex items-center gap-2">
                        <Tag size={14} className="text-defendrRed" />
                        <Typo
                          as="span"
                          className="text-sm text-defendrRed font-medium"
                          fontVariant="p5"
                        >
                          {blog.category}
                        </Typo>
                      </div>
                    )}

                    {/* Title */}
                    <Typo
                      as="h3"
                      className="text-xl font-bold text-white group-hover:text-defendrRed transition-colors line-clamp-2"
                      fontFamily="poppins"
                      fontVariant="h5"
                    >
                      {blog.blog_title}
                    </Typo>

                    {/* Excerpt */}
                    {blog.excerpt && (
                      <Typo as="p" className="text-gray-400 text-sm line-clamp-3" fontVariant="p5">
                        {blog.excerpt}
                      </Typo>
                    )}

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-700">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{formatDate(blog.createdAt)}</span>
                      </div>
                      {blog.viewCount !== undefined && (
                        <div className="flex items-center gap-1">
                          <Eye size={14} />
                          <span>{blog.viewCount || 0} views</span>
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {blog.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mb-12">
                <button
                  onClick={() => {
                    const newPage = currentPage - 1
                    setCurrentPage(newPage)
                    updateURL({
                      category: selectedCategory,
                      tag: selectedTag,
                      search: searchQuery,
                      page: newPage,
                    })
                  }}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-[#212529] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-defendrRed transition-colors"
                >
                  Previous
                </button>
                <Typo as="span" className="text-white px-4" fontVariant="p4">
                  Page {currentPage} of {totalPages}
                </Typo>
                <button
                  onClick={() => {
                    const newPage = currentPage + 1
                    setCurrentPage(newPage)
                    updateURL({
                      category: selectedCategory,
                      tag: selectedTag,
                      search: searchQuery,
                      page: newPage,
                    })
                  }}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-[#212529] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-defendrRed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
