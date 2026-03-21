import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'https://mansh-eta.vercel.app'

  const staticPages: MetadataRoute.Sitemap = [
    { url: base,             lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
    { url: `${base}/courses`, lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/terms`,   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ]

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data: courses } = await supabase
      .from('courses').select('slug,updated_at').eq('status','published')

    const coursePages: MetadataRoute.Sitemap = (courses || []).map(c => ({
      url:              `${base}/courses/${c.slug}`,
      lastModified:     new Date(c.updated_at || new Date()),
      changeFrequency:  'weekly' as const,
      priority:         0.8,
    }))
    return [...staticPages, ...coursePages]
  } catch {
    return staticPages
  }
}
