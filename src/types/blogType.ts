export interface Blog {
  _id: string
  blog_title: string
  content: string
  coverImage?: string
  meta_title?: string
  meta_description?: string
  meta_keywords?: string
  excerpt?: string
  category?: string
  featured?: boolean
  tags?: string[]
  publishedAt?: string
  viewCount?: number
  created_by?: string
  createdAt: string
  updatedAt: string
}
