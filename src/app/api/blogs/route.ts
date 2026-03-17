import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

const ADMIN_API_BASE_URL = 'https://api-dash.defendr.gg'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    // Build query parameters for public blogs endpoint
    const params = new URLSearchParams()

    // Add optional parameters
    if (searchParams.get('page')) params.set('page', searchParams.get('page')!)
    if (searchParams.get('limit')) params.set('limit', searchParams.get('limit')!)
    if (searchParams.get('search')) params.set('search', searchParams.get('search')!)
    if (searchParams.get('category')) params.set('category', searchParams.get('category')!)
    if (searchParams.get('tags')) params.set('tags', searchParams.get('tags')!)
    if (searchParams.get('tag')) params.set('tags', searchParams.get('tag')!) // Support both 'tag' and 'tags'
    if (searchParams.get('sortBy')) params.set('sortBy', searchParams.get('sortBy')!)
    if (searchParams.get('sortOrder')) params.set('sortOrder', searchParams.get('sortOrder')!)

    // Use the public blogs endpoint: /public/blogs
    const url = `${ADMIN_API_BASE_URL}/public/blogs${params.toString() ? `?${params.toString()}` : ''}`

    console.log('Fetching blogs from:', url)

    try {
      // Use axios for more reliable requests
      const response = await axios.get(url, {
        timeout: 30000,
        headers: {
          Accept: 'application/json',
        },
        validateStatus: () => true, // Don't throw on any status
      })

      console.log('Response status:', response.status, response.statusText)

      if (!(response.status >= 200 && response.status < 300)) {
        const errorData =
          typeof response.data === 'object' ? response.data : { message: response.statusText }
        console.error('API Error Response:', errorData)

        return NextResponse.json(
          {
            success: false,
            error: errorData.message || `Failed to fetch blogs: ${response.statusText}`,
            details: errorData,
            status: response.status,
          },
          { status: response.status },
        )
      }

      const data = response.data
      console.log(
        'Successfully fetched blogs, count:',
        data?.data?.blogs?.length || data?.blogs?.length || 'unknown',
      )
      return NextResponse.json(data, { status: 200 })
    } catch (fetchError: any) {
      console.error('Fetch error:', fetchError)
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to connect to blog API',
          details: fetchError?.message || 'Network error',
          url: url,
        },
        { status: 502 },
      )
    }
  } catch (error: any) {
    console.error('Blog API route error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: error?.message,
      },
      { status: 500 },
    )
  }
}
