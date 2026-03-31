import { MetadataRoute } from 'next'
import { allHojokin } from '@/data/hojokin/index'
import { industries } from '@/data/industries'

export const dynamic = 'force-static'

const LAST_MODIFIED = '2026-03-30T00:00:00.000Z'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://hojokin-navi-eta.vercel.app'

  const gyoshuPages = industries.map((ind) => ({
    url: `${base}/gyoshu/${ind.slug}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }))

  const hojokinPages = allHojokin.flatMap((h) => [
    {
      url: `${base}/hojokin/${h.slug}`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${base}/hojokin/${h.slug}/kakikata`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ])

  return [
    { url: base, lastModified: LAST_MODIFIED, changeFrequency: 'daily', priority: 1.0 },
    { url: `${base}/search`, lastModified: LAST_MODIFIED, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/gyoshu`, lastModified: LAST_MODIFIED, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/about`, lastModified: LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/privacy`, lastModified: LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.5 },
    ...gyoshuPages,
    ...hojokinPages,
  ]
}
