import { MetadataRoute } from 'next'
import { allHojokin } from '@/data/hojokin/index'
import { industries } from '@/data/industries'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://hojokin-navi-eta.vercel.app'

  const gyoshuPages = industries.map((ind) => ({
    url: `${base}/gyoshu/${ind.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }))

  const hojokinPages = allHojokin.flatMap((h) => [
    {
      url: `${base}/hojokin/${h.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${base}/hojokin/${h.slug}/kakikata`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ])

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${base}/search`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/research`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/gyoshu`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    ...gyoshuPages,
    ...hojokinPages,
  ]
}
