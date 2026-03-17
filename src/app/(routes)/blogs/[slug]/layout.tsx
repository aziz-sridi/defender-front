import type { Metadata } from 'next'
import { publicBlogService } from '@/services/publicBlogService'

type BlogSlugLayoutProps = {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogSlugLayoutProps): Promise<Metadata> {
  const { slug } = await params

  try {
    const blog = await publicBlogService.getBlogBySlug(slug)

    if (!blog) {
      return {
        title: 'Blog Not Found',
        description: 'The article you are looking for could not be found on DEFENDR.GG.',
      }
    }

    return {
      title: blog.meta_title || blog.blog_title,
      description:
        blog.meta_description ||
        blog.excerpt ||
        `Read "${blog.blog_title}" on the DEFENDR.GG esports blog.`,
      keywords: blog.meta_keywords || undefined,
      alternates: {
        canonical: `https://defendr.gg/blogs/${slug}`,
      },
      openGraph: {
        type: 'article',
        title: blog.meta_title || blog.blog_title,
        description: blog.meta_description || blog.excerpt || '',
        url: `https://defendr.gg/blogs/${slug}`,
        siteName: 'DEFENDR.GG',
        publishedTime: blog.publishedAt || blog.createdAt,
        authors: ['DEFENDR.GG'],
        images: blog.coverImage
          ? [
              {
                url: blog.coverImage,
                width: 1200,
                height: 630,
                alt: blog.blog_title,
              },
            ]
          : [
              {
                url: 'https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/defendr_elements/defendr.png',
                width: 1200,
                height: 630,
                alt: 'DEFENDR.GG Esports Blog',
              },
            ],
      },
      twitter: {
        card: 'summary_large_image',
        title: blog.meta_title || blog.blog_title,
        description: blog.meta_description || blog.excerpt || '',
        images: blog.coverImage
          ? [blog.coverImage]
          : ['https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/defendr_elements/defendr.png'],
      },
    }
  } catch {
    return {
      title: 'Esports Blog | DEFENDR.GG',
      description:
        'Read the latest esports news, tournament guides and competitive gaming insights on DEFENDR.GG.',
    }
  }
}

export default function BlogSlugLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
