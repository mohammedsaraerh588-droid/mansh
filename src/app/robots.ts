import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'https://mansh-eta.vercel.app'
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/courses', '/courses/*', '/contact', '/terms', '/privacy'],
        disallow: ['/dashboard/', '/profile', '/api/', '/auth/'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  }
}
