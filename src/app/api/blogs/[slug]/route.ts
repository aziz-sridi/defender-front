import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

const ADMIN_API_BASE_URL = 'https://api-dash.defendr.gg'

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params

    // Use the public blogs endpoint with slug: /blogs/public/{slug}
    const url = `${ADMIN_API_BASE_URL}/blogs/public/${slug}`

    console.log('Fetching blog by slug from:', url)

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

      if (response.status === 404) {
        return NextResponse.json(
          {
            success: false,
            error: 'Blog not found',
          },
          { status: 404 },
        )
      }

      if (!(response.status >= 200 && response.status < 300)) {
        const errorData =
          typeof response.data === 'object' ? response.data : { message: response.statusText }
        console.error('API Error Response:', errorData)

        return NextResponse.json(
          {
            success: false,
            error: errorData.message || `Failed to fetch blog: ${response.statusText}`,
            details: errorData,
            status: response.status,
          },
          { status: response.status },
        )
      }

      const data = response.data
      console.log('Successfully fetched blog:', data?.data?.blog_title || data?.blog_title)
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
    console.error('Blog slug API route error:', error)
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
