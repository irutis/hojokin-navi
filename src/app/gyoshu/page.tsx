import type { Metadata } from 'next'
import Link from 'next/link'
import { industries } from '@/data/industries'
import { getHojokinBySlug, formatAmount } from '@/data/hojokin/index'

export const metadata: Metadata = {
  title: '業種別 補助金・助成金一覧【2026年最新】製造業・飲食店・IT・建設業など',
  description: '製造業・飲食店・IT・建設業・医療・農業など業種別に使える補助金・助成金を厳選紹介。各業種のおすすめ補助金と申請ポイントを解説。',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: '業種別補助金一覧',
  description: '業種別におすすめの補助金・助成金を紹介',
  numberOfItems: industries.length,
  itemListElement: industries.map((ind, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: `${ind.name}向け補助金`,
    url: `https://hojokin-navi-eta.vercel.app/gyoshu/${ind.slug}`,
  })),
}

export default function GyoshuIndexPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/" className="text-blue-700 font-bold text-lg">補助金申請ガイド</Link>
          <span className="text-gray-400 mx-2">/</span>
          <span className="text-gray-600 text-sm">業種別補助金</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
            業種別 補助金・助成金一覧【2026年最新】
          </h1>
          <p className="text-gray-600">
            あなたの業種に合った補助金を選んでください。各業種ごとに採択されやすい補助金を厳選・解説しています。
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {industries.map((ind) => {
            const topHojokin = ind.recommended_slugs
              .slice(0, 2)
              .map((slug) => getHojokinBySlug(slug))
              .filter((h): h is NonNullable<typeof h> => h !== undefined)

            return (
              <Link
                key={ind.slug}
                href={`/gyoshu/${ind.slug}`}
                className="block bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:border-blue-400 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{ind.icon}</span>
                  <div>
                    <h2 className="font-bold text-gray-800">{ind.name}</h2>
                    <p className="text-xs text-gray-400">おすすめ {ind.recommended_slugs.length}種</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{ind.description}</p>
                <div className="space-y-1">
                  {topHojokin.map((h) => (
                    <div key={h.slug} className="flex items-center justify-between text-xs">
                      <span className="text-gray-700 font-medium">{h.name}</span>
                      <span className="text-blue-600">最大{formatAmount(h.max_amount)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-right">
                  <span className="text-xs text-blue-600 font-medium">詳細を見る →</span>
                </div>
              </Link>
            )
          })}
        </div>

        <section className="bg-blue-700 rounded-2xl p-6 text-white text-center">
          <h2 className="font-bold text-lg mb-2">業種がわからない？AI診断で最適な補助金を特定</h2>
          <p className="text-blue-200 text-sm mb-4">5問に答えるだけ。あなたに合った補助金を即診断します</p>
          <Link
            href="/"
            className="inline-block bg-white text-blue-700 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors"
          >
            無料AI診断を受ける →
          </Link>
        </section>
      </div>
    </main>
  )
}
