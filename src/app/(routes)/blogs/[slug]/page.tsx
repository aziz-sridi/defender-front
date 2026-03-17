'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Eye, Tag, ArrowLeft, Share2 } from 'lucide-react'
import Typo from '@/components/ui/Typo'
import Loader from '@/app/loading'
import { publicBlogService } from '@/services/publicBlogService'
import type { Blog } from '@/types/blogType'

export default function BlogDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params?.slug as string
  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBlog() {
      if (!slug) return

      setLoading(true)
      setError(null)
      try {
        const blogData = await publicBlogService.getBlogBySlug(slug)
        setBlog(blogData)
      } catch (err: any) {
        console.error('Failed to fetch blog:', err)
        setError(err?.message || 'Blog not found')
      } finally {
        setLoading(false)
      }
    }

    fetchBlog()
  }, [slug])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const shareBlog = () => {
    if (navigator.share && blog) {
      navigator.share({
        title: blog.blog_title,
        text: blog.excerpt || blog.meta_description,
        url: window.location.href,
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  if (loading) {
    return <Loader />
  }

  if (error || !blog) {
    return (
      <main className="relative container mx-auto px-4 sm:px-6 lg:px-8 mt-[80px] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Typo as="h1" className="text-4xl font-bold mb-4" fontFamily="poppins" fontVariant="h1">
            Blog Not Found
          </Typo>
          <Typo as="p" className="text-gray-400 mb-6" fontVariant="p4">
            {error || 'The blog you are looking for does not exist.'}
          </Typo>
          <Link
            href="/blogs"
            className="inline-block px-6 py-3 bg-defendrRed hover:bg-defendrHoverRed text-white rounded-lg font-semibold transition-colors"
          >
            Back to Blogs
          </Link>
        </div>
      </main>
    )
  }

  return (
    <>
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
                id="circuit-detail"
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
            <rect width="100%" height="100%" fill="url(#circuit-detail)" />
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
        {/* Back Button */}
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors relative z-10"
        >
          <ArrowLeft size={20} />
          <span>Back to Blogs</span>
        </Link>

        {/* Article Header */}
        <article className="max-w-4xl mx-auto relative z-10">
          {/* Category and Featured Badge */}
          <div className="flex items-center gap-4 mb-4">
            {blog.category && (
              <div className="flex items-center gap-2">
                <Tag size={16} className="text-defendrRed" />
                <Typo as="span" className="text-defendrRed font-medium" fontVariant="p4">
                  {blog.category}
                </Typo>
              </div>
            )}
            {blog.featured && (
              <span className="px-3 py-1 bg-defendrRed text-white rounded-full text-sm font-semibold">
                Featured
              </span>
            )}
          </div>

          {/* Title */}
          <Typo
            as="h1"
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
            fontFamily="poppins"
            fontVariant="h1"
          >
            {blog.blog_title}
          </Typo>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 mb-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
            </div>
            {blog.viewCount !== undefined && (
              <div className="flex items-center gap-2">
                <Eye size={16} />
                <span>{blog.viewCount || 0} views</span>
              </div>
            )}
            <button
              onClick={shareBlog}
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <Share2 size={16} />
              <span>Share</span>
            </button>
          </div>

          {/* Cover Image */}
          {blog.coverImage && (
            <div className="relative w-full h-64 sm:h-96 mb-8 rounded-lg overflow-hidden">
              <Image
                src={blog.coverImage}
                alt={blog.blog_title}
                fill
                className="object-cover"
                priority
                unoptimized
              />
            </div>
          )}

          {/* Excerpt */}
          {blog.excerpt && (
            <div className="bg-[#212529] border-l-4 border-defendrRed p-6 mb-8 rounded-r-lg">
              <Typo as="p" className="text-lg text-gray-300 italic" fontVariant="p3">
                {blog.excerpt}
              </Typo>
            </div>
          )}

          {/* Content */}
          <div
            className="prose prose-invert prose-lg max-w-none mb-8 blog-content"
            dangerouslySetInnerHTML={{ __html: blog.content }}
            style={{
              color: '#e5e7eb',
            }}
          />

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8 pt-8 border-t border-gray-700">
              <Typo as="span" className="text-gray-400 mr-2" fontVariant="p4">
                Tags:
              </Typo>
              {blog.tags.map(tag => (
                <Link
                  key={tag}
                  href={`/blogs?tag=${encodeURIComponent(tag)}`}
                  className="px-3 py-1 bg-[#212529] hover:bg-defendrRed text-gray-300 hover:text-white rounded-full text-sm transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          {/* Related Actions */}
          <div className="flex flex-wrap gap-4 pt-8 border-t border-gray-700">
            <Link
              href="/blogs"
              className="px-6 py-3 bg-[#212529] hover:bg-defendrRed text-white rounded-lg font-semibold transition-colors"
            >
              Browse All Blogs
            </Link>
            {blog.category && (
              <Link
                href={`/blogs?category=${encodeURIComponent(blog.category)}`}
                className="px-6 py-3 bg-[#212529] hover:bg-defendrRed text-white rounded-lg font-semibold transition-colors"
              >
                More from {blog.category}
              </Link>
            )}
          </div>
        </article>
      </main>

      {/* Custom Styles for Blog Content */}
      <style jsx global>{`
        .blog-content h1,
        .blog-content h2,
        .blog-content h3,
        .blog-content h4,
        .blog-content h5,
        .blog-content h6 {
          color: #ffffff;
          font-family: 'Poppins', sans-serif;
          margin-top: 2rem;
          margin-bottom: 1rem;
          font-weight: 600;
        }
        .blog-content h1 {
          font-size: 2.5rem;
        }
        .blog-content h2 {
          font-size: 2rem;
        }
        .blog-content h3 {
          font-size: 1.75rem;
        }
        .blog-content p {
          color: #e5e7eb;
          line-height: 1.75;
          margin-bottom: 1.5rem;
        }
        .blog-content a {
          color: #d62555;
          text-decoration: underline;
        }
        .blog-content a:hover {
          color: #ff3366;
        }
        .blog-content ul,
        .blog-content ol {
          color: #e5e7eb;
          margin-left: 2rem;
          margin-bottom: 1.5rem;
        }
        .blog-content li {
          margin-bottom: 0.5rem;
        }
        .blog-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 2rem 0;
        }
        .blog-content blockquote {
          border-left: 4px solid #d62555;
          padding-left: 1.5rem;
          margin: 2rem 0;
          color: #9ca3af;
          font-style: italic;
        }
        .blog-content code {
          background-color: #1f2937;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          color: #fbbf24;
          font-size: 0.9em;
        }
        .blog-content pre {
          background-color: #1f2937;
          padding: 1.5rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 2rem 0;
        }
        .blog-content pre code {
          background-color: transparent;
          padding: 0;
        }
      `}</style>
    </>
  )
}
