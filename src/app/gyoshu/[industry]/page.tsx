import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { industries, getIndustryBySlug } from '@/data/industries'
import { getHojokinBySlug, formatAmount, formatRate } from '@/data/hojokin/index'

export function generateStaticParams() {
  return industries.map((i) => ({ industry: i.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ industry: string }> }): Promise<Metadata> {
  const { industry } = await params
  const ind = getIndustryBySlug(industry)
  if (!ind) return {}
  return {
    title: `${ind.name}が使える補助金一覧【2026年最新】採択率・申請方法を徹底解説`,
    description: `${ind.name}向けのおすすめ補助金${ind.recommended_slugs.length}選。採択されやすい補助金の選び方・申請のコツを解説。${ind.description}`,
  }
}

export default async function IndustryPage({ params }: { params: Promise<{ industry: string }> }) {
  const { industry } = await params
  const ind = getIndustryBySlug(industry)
  if (!ind) notFound()

  const hojokinList = ind.recommended_slugs
    .map((slug) => getHojokinBySlug(slug))
    .filter((h): h is NonNullable<typeof h> => h !== undefined)

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `${ind.name}が使える補助金はどれですか？`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${ind.name}向けの主な補助金は${hojokinList.map(h => h.name).join('・')}などがあります。${ind.description}`,
        },
      },
      {
        '@type': 'Question',
        name: `${ind.name}の補助金申請で気をつけることは？`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: ind.tips[0] + ' ' + ind.tips[1],
        },
      },
    ],
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'トップ', item: 'https://hojokin-navi-eta.vercel.app' },
      { '@type': 'ListItem', position: 2, name: '業種別補助金', item: 'https://hojokin-navi-eta.vercel.app/gyoshu' },
      { '@type': 'ListItem', position: 3, name: `${ind.name}の補助金`, item: `https://hojokin-navi-eta.vercel.app/gyoshu/${ind.slug}` },
    ],
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-2 flex-wrap text-sm">
          <Link href="/" className="text-blue-700 font-bold text-lg">補助金申請ガイド</Link>
          <span className="text-gray-400">/</span>
          <Link href="/gyoshu" className="text-blue-600 hover:underline">業種別</Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600">{ind.name}</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* ヒーロー */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 mb-6">
          <div className="text-4xl mb-3">{ind.icon}</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
            {ind.name}が使える補助金・助成金【2026年最新】
          </h1>
          <p className="text-gray-600 leading-relaxed">{ind.description}</p>
          <div className="mt-4 bg-blue-50 rounded-xl p-4">
            <p className="text-sm text-blue-800 font-medium">
              📋 おすすめ補助金 {hojokinList.length}種を厳選。採択率・補助額・難易度を比較してご紹介します。
            </p>
          </div>
        </div>

        {/* 補助金一覧 */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">{ind.name}向けおすすめ補助金一覧</h2>
          <div className="space-y-4">
            {hojokinList.map((h, i) => (
              <div key={h.slug} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:border-blue-300 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-blue-50 text-blue-700 font-medium px-2 py-0.5 rounded-full">
                        第{i + 1}位
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {h.category}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg mb-1">{h.name}</h3>
                    <p className="text-sm text-gray-500 mb-3">{h.purpose}</p>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <span className="text-blue-700 font-medium">最大 {formatAmount(h.max_amount)}</span>
                      <span className="text-green-700">補助率 {formatRate(h.subsidy_rate)}</span>
                      <span className="text-gray-500">{h.deadline}</span>
                    </div>
                  </div>
                  <Link
                    href={`/hojokin/${h.slug}`}
                    className="shrink-0 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    詳細 →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 業種別ポイント */}
        <section className="bg-yellow-50 rounded-2xl p-6 border border-yellow-100 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">💡 {ind.name}の補助金申請ポイント</h2>
          <ul className="space-y-3">
            {ind.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-yellow-500 shrink-0 font-bold">{i + 1}.</span>
                {tip}
              </li>
            ))}
          </ul>
        </section>

        {/* FAQ */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">よくある質問</h2>
          <div className="space-y-4">
            {faqJsonLd.mainEntity.map((q, i) => (
              <div key={i} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <p className="font-medium text-gray-800 mb-2">Q. {q.name}</p>
                <p className="text-sm text-gray-600 leading-relaxed">A. {q.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-blue-700 rounded-2xl p-6 text-white text-center mb-6">
          <h2 className="font-bold text-lg mb-2">AI診断で自分に合う補助金を5問で特定</h2>
          <p className="text-blue-200 text-sm mb-4">業種・従業員数・目的を答えるだけ。最適な補助金を即時診断</p>
          <Link
            href="/"
            className="inline-block bg-white text-blue-700 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors"
          >
            無料AI診断を受ける →
          </Link>
        </section>

        <div className="text-center">
          <Link href="/gyoshu" className="text-blue-600 text-sm hover:underline">← 他の業種を見る</Link>
        </div>
      </div>
    </main>
  )
}
