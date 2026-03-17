import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://defendr.gg'
  const now = new Date()

  // Priority 1.0 — Homepage
  const homepage: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ]

  // Priority 0.9 — Core conversion pages (high-value for players & organizers)
  const corePages: MetadataRoute.Sitemap = [
    '/signup',
    '/login',
    '/tournaments',
    '/organizations',
    '/events',
    '/games',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }))

  // Priority 0.8 — Important platform pages
  const platformPages: MetadataRoute.Sitemap = [
    '/pricing',
    '/saas',
    '/apps',
    '/academy',
    '/blogs',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Priority 0.7 — Company & community pages
  const companyPages: MetadataRoute.Sitemap = [
    '/about',
    '/contact',
    '/faq',
    '/jobs',
    '/brand-assets',
    '/event/dz-ramadhan',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Priority 0.3 — Legal pages (indexed but low priority)
  const legalPages: MetadataRoute.Sitemap = ['/privacy', '/terms'].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: 'yearly' as const,
    priority: 0.3,
  }))

  return [...homepage, ...corePages, ...platformPages, ...companyPages, ...legalPages]
}
