import { NextApiRequest } from 'next'

import { getAxiosInstance } from '@/lib/api/axiosConfig'
import { ApiErrorType } from '@/lib/api/constants'
import { ApiError } from '@/lib/api/errors'

export const getAllBlogs = async (serverRequest?: NextApiRequest) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest)
    const response = await axiosInstance.get('/blogs/getAll-blogs')
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while fetching blogs',
      undefined,
      error,
    )
  }
}

export const createOrUpdateBlog = async (data: FormData, serverRequest?: NextApiRequest) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.post('/blogs/cu-blog', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while creating or updating the blog',
      undefined,
      error,
    )
  }
}

export const getBlogById = async (id: string, serverRequest?: NextApiRequest) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest)
    const response = await axiosInstance.get(`/blogs/get-blog/${id}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while fetching blog by ID',
      undefined,
      error,
    )
  }
}

export const deleteBlog = async (id: string, serverRequest?: NextApiRequest) => {
  try {
    const axiosInstance = await getAxiosInstance(serverRequest, true)
    const response = await axiosInstance.delete(`/blogs/delete-blog/${id}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      ApiErrorType.NETWORK,
      'Network error occurred while deleting the blog',
      undefined,
      error,
    )
  }
}
