import { NextApiRequest } from 'next'
import axios, { AxiosInstance } from 'axios'

import { ApiErrorType } from '@/lib/api/constants'
import { ApiError } from '@/lib/api/errors'
import type { Blog } from '@/types/blogType'

// Admin Dashboard API Base URL
const ADMIN_API_BASE_URL = 'https://api-dash.defendr.gg'

// Create axios instance for blog API (direct call to admin API)
const getBlogAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: ADMIN_API_BASE_URL,
    timeout: 30000,
    headers: {
      Accept: 'application/json',
    },
  })

  // Add error interceptor for better error handling
  instance.interceptors.response.use(
    response => response,
    (error: any) => {
      console.error('Blog API Error:', {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
        url: error?.config?.url,
      })
      throw error
    },
  )

  return instance
}

// ===========================================
// PUBLIC BLOG SERVICE
// ===========================================
export const publicBlogService = {
  // Get all published blogs - fetch JSON directly and parse it
  async getAllBlogs(
    params?: {
      page?: number
      limit?: number
      search?: string
      category?: string
      tag?: string
    },
    serverRequest?: NextApiRequest,
  ) {
    try {
      const axiosInstance = getBlogAxiosInstance()

      // Build query parameters
      const queryParams: any = {}
      if (params?.page) queryParams.page = params.page
      if (params?.limit) queryParams.limit = params.limit
      if (params?.search) queryParams.search = params.search
      if (params?.category) queryParams.category = params.category
      if (params?.tag) queryParams.tag = params.tag

      // Fetch JSON directly from the endpoint
      const response = await axiosInstance.get('/public/blogs', { params: queryParams })

      // Parse the JSON response - handle different possible formats
      let blogs: Blog[] = []
      let pagination = null

      // Try different response structures
      if (response.data?.success && response.data?.data) {
        // Format: { success: true, data: { blogs: [], pagination: {} } }
        blogs = Array.isArray(response.data.data.blogs) ? response.data.data.blogs : []
        pagination = response.data.data.pagination || null
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        // Format: { data: [] }
        blogs = response.data.data
        pagination = response.data.pagination || null
      } else if (Array.isArray(response.data)) {
        // Format: [] (direct array)
        blogs = response.data
      } else if (response.data?.blogs && Array.isArray(response.data.blogs)) {
        // Format: { blogs: [], pagination: {} }
        blogs = response.data.blogs
        pagination = response.data.pagination || null
      } else if (response.data?.results && Array.isArray(response.data.results)) {
        // Format: { results: [], pagination: {} }
        blogs = response.data.results
        pagination = response.data.pagination || null
      }

      // Apply client-side filtering if API didn't handle it
      let filteredBlogs = blogs

      if (params?.search) {
        const searchLower = params.search.toLowerCase()
        filteredBlogs = filteredBlogs.filter(
          (blog: Blog) =>
            blog.blog_title?.toLowerCase().includes(searchLower) ||
            blog.excerpt?.toLowerCase().includes(searchLower) ||
            blog.content?.toLowerCase().includes(searchLower),
        )
      }

      if (params?.category) {
        filteredBlogs = filteredBlogs.filter((blog: Blog) => blog.category === params.category)
      }

      if (params?.tag) {
        filteredBlogs = filteredBlogs.filter(
          (blog: Blog) => blog.tags && blog.tags.includes(params.tag!),
        )
      }

      // Handle pagination
      if (pagination) {
        // Use API pagination
        return {
          blogs: filteredBlogs,
          pagination,
        }
      } else {
        // Client-side pagination
        const page = params?.page || 1
        const limit = params?.limit || 12
        const startIndex = (page - 1) * limit
        const endIndex = startIndex + limit
        const paginatedBlogs = filteredBlogs.slice(startIndex, endIndex)
        const totalPages = Math.ceil(filteredBlogs.length / limit)

        return {
          blogs: paginatedBlogs,
          pagination: {
            currentPage: page,
            totalPages,
            totalItems: filteredBlogs.length,
            itemsPerPage: limit,
          },
        }
      }
    } catch (error: any) {
      console.error('Error fetching blogs:', error)

      if (error instanceof ApiError) {
        throw error
      }

      // Extract more detailed error information
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Network error occurred while fetching blogs'

      const statusCode = error?.response?.status

      if (statusCode >= 400 && statusCode < 500) {
        throw new ApiError(
          ApiErrorType.CLIENT,
          errorMessage,
          statusCode,
          error,
          error?.response?.data,
        )
      }

      throw new ApiError(
        ApiErrorType.NETWORK,
        errorMessage,
        statusCode,
        error,
        error?.response?.data,
      )
    }
  },

  // Get blog by slug - fetch JSON directly and return the blog object
  async getBlogBySlug(slug: string, serverRequest?: NextApiRequest): Promise<Blog> {
    try {
      const axiosInstance = getBlogAxiosInstance()

      // Fetch blog JSON by slug
      const response = await axiosInstance.get(`/blogs/public/${slug}`)

      // Parse the JSON response - handle different possible formats
      let blog: Blog | null = null

      if (response.data?.success && response.data?.data) {
        // Format: { success: true, data: { ...blog } }
        blog = response.data.data
      } else if (response.data?._id || response.data?.slug) {
        // Format: { ...blog } (direct blog object)
        blog = response.data
      } else if (response.data?.data?._id) {
        // Format: { data: { ...blog } }
        blog = response.data.data
      }

      if (!blog) {
        throw new ApiError(ApiErrorType.CLIENT, 'Blog not found', 404, undefined, undefined)
      }

      return blog
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError(
        ApiErrorType.NETWORK,
        'Network error occurred while fetching blog by slug',
        undefined,
        error,
      )
    }
  },

  // Get blog categories from admin dashboard API
  async getCategories(serverRequest?: NextApiRequest) {
    try {
      const axiosInstance = getBlogAxiosInstance()

      // Extract categories from published blogs
      const response = await axiosInstance.get('/public/blogs', { params: { limit: 1000 } })

      let blogs: Blog[] = []
      if (response.data?.success && response.data?.data?.blogs) {
        blogs = response.data.data.blogs
      } else if (Array.isArray(response.data)) {
        blogs = response.data
      } else if (response.data?.blogs && Array.isArray(response.data.blogs)) {
        blogs = response.data.blogs
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        blogs = response.data.data
      } else if (response.data?.results && Array.isArray(response.data.results)) {
        blogs = response.data.results
      }

      const categories = new Set<string>()
      blogs.forEach((blog: Blog) => {
        if (blog.category) {
          categories.add(blog.category)
        }
      })

      return Array.from(categories).sort()
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError(
        ApiErrorType.NETWORK,
        'Network error occurred while fetching categories',
        undefined,
        error,
      )
    }
  },

  // Get blog tags from admin dashboard API
  async getTags(serverRequest?: NextApiRequest) {
    try {
      const axiosInstance = getBlogAxiosInstance()

      // Extract tags from published blogs
      const response = await axiosInstance.get('/public/blogs', { params: { limit: 1000 } })

      let blogs: Blog[] = []
      if (response.data?.success && response.data?.data?.blogs) {
        blogs = response.data.data.blogs
      } else if (Array.isArray(response.data)) {
        blogs = response.data
      } else if (response.data?.blogs && Array.isArray(response.data.blogs)) {
        blogs = response.data.blogs
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        blogs = response.data.data
      } else if (response.data?.results && Array.isArray(response.data.results)) {
        blogs = response.data.results
      }

      const tags = new Set<string>()
      blogs.forEach((blog: Blog) => {
        if (blog.tags && Array.isArray(blog.tags)) {
          blog.tags.forEach(tag => tags.add(tag))
        }
      })

      return Array.from(tags).sort()
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError(
        ApiErrorType.NETWORK,
        'Network error occurred while fetching tags',
        undefined,
        error,
      )
    }
  },
}
