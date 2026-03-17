import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // General crawlers: full access to public content
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/auth/',
          '/user/*/Edit',
          '/organization/*/Edit',
          '/team/*/Edit',
          '/tournament/setup/',
          '/myTournaments/',
          '/myorganization/',
          '/selectGames/',
          '/verifmail/',
        ],
      },
      {
        // Block Googlebot from private setup flows
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/auth/',
          '/user/*/Edit',
          '/organization/*/Edit',
          '/team/*/Edit',
          '/tournament/setup/',
          '/myTournaments/',
          '/myorganization/',
          '/selectGames/',
          '/verifmail/',
        ],
      },
    ],
    sitemap: 'https://defendr.gg/sitemap.xml',
    host: 'https://defendr.gg',
  }
}
