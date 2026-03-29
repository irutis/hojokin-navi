import { notFound } from 'next/navigation'
import Link from 'next/link'
import { allHojokin, getHojokinBySlug, formatAmount, formatRate } from '@/data/hojokin/index'
import type { Metadata } from 'next'

export function generateStaticParams() {
  return allHojokin.map((h) => ({ slug: h.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const h = getHojokinBySlug(slug)
  if (!h) return {}
  return {
    title: `${h.name}の申請方法・条件・不採択理由【2026年最新】`,
    description: `${h.name}の対象条件、補助額（最大${formatAmount(h.max_amount)}）、申請フロー、よくある不採択理由をわかりやすく解説。${h.purpose}`,
  }
}

export default async function HojokinPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const h = getHojokinBySlug(slug)
  if (!h) notFound()

  const related = allHojokin.filter((r) => h.related_subsidies.includes(r.slug))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${h.name}の申請方法・条件・不採択理由【2026年最新】`,
    description: `${h.name}の対象条件、補助額（最大${formatAmount(h.max_amount)}）、申請フロー、よくある不採択理由をわかりやすく解説。`,
    dateModified: h.last_updated,
    author: { '@type': 'Organization', name: '補助金申請ガイド' },
    publisher: { '@type': 'Organization', name: '補助金申請ガイド' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://hojokin-navi-eta.vercel.app/hojokin/${h.slug}` },
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: h.rejection_reasons.map((reason, i) => ({
      '@type': 'Question',
      name: `${h.name}の不採択理由${i + 1}は？`,
      acceptedAnswer: { '@type': 'Answer', text: reason },
    })),
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/" className="text-blue-700 font-bold text-lg">補助金申請ガイド</Link>
          <span className="text-gray-400 mx-2">/</span>
          <span className="text-gray-600 text-sm">{h.name}</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* タイトル */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 mb-6">
          <span className="text-xs bg-blue-50 text-blue-700 font-medium px-2 py-1 rounded-full">
            {h.category}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-3 mb-2">{h.name}</h1>
          <p className="text-gray-500 text-sm mb-6">{h.official_name} ／ 管轄：{h.managing_org}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <p className="text-xs text-blue-600 mb-1">最大補助額</p>
              <p className="font-bold text-blue-800 text-lg">{formatAmount(h.max_amount)}</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <p className="text-xs text-green-600 mb-1">補助率</p>
              <p className="font-bold text-green-800 text-lg">{formatRate(h.subsidy_rate)}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center col-span-2">
              <p className="text-xs text-gray-500 mb-1">申請締切</p>
              <p className="font-bold text-gray-700 text-sm">{h.deadline}</p>
              <p className="text-xs text-gray-400">{h.next_expected}</p>
            </div>
          </div>
        </div>

        {/* 対象者・目的 */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">📋 対象企業・申請条件</h2>
          <ul className="space-y-2">
            {h.eligibility_conditions.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                {c}
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">対象規模：{h.target_company_size.join('・')}</p>
            <p className="text-xs text-gray-500 mt-1">対象業種：{h.target_industries.join('・')}</p>
          </div>
        </section>

        {/* 補助対象経費 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">✅ 補助対象になる経費</h2>
            <ul className="space-y-2">
              {h.eligible_expenses.map((e, i) => (
                <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-green-500 shrink-0">●</span>{e}
                </li>
              ))}
            </ul>
          </section>
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">❌ 対象外の経費</h2>
            <ul className="space-y-2">
              {h.ineligible_expenses.map((e, i) => (
                <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-red-400 shrink-0">●</span>{e}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* 申請フロー */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6">📍 申請フロー</h2>
          <div className="space-y-3">
            {h.application_flow.map((step, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="shrink-0 w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </div>
                <p className="text-sm text-gray-700 pt-1">{step}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 不採択理由 */}
        <section className="bg-red-50 rounded-2xl p-6 border border-red-100 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">⚠️ よくある不採択理由</h2>
          <p className="text-xs text-gray-500 mb-4">これを知っておくだけで採択率が大きく変わります</p>
          <ul className="space-y-3">
            {h.rejection_reasons.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-red-400 shrink-0 font-bold">{i + 1}.</span>
                {r}
              </li>
            ))}
          </ul>
        </section>

        {/* 採択のコツ */}
        <section className="bg-yellow-50 rounded-2xl p-6 border border-yellow-100 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">💡 採択されるためのコツ</h2>
          <ul className="space-y-3">
            {h.success_tips.map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-yellow-500 shrink-0">★</span>
                {t}
              </li>
            ))}
          </ul>
        </section>

        {/* 申請書の書き方リンク */}
        <section className="bg-orange-50 rounded-2xl p-6 border border-orange-200 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="font-bold text-gray-800 mb-1">📝 申請書の書き方を詳しく知る</h2>
              <p className="text-sm text-gray-600">採択される書き方・落とされる書き方を実例で解説</p>
            </div>
            <Link
              href={`/hojokin/${h.slug}/kakikata`}
              className="shrink-0 bg-orange-500 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-orange-600 transition-colors text-sm"
            >
              書き方ガイドを見る →
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-blue-700 rounded-2xl p-6 text-white text-center mb-6">
          <h2 className="font-bold text-lg mb-2">申請サポートが必要ですか？</h2>
          <p className="text-blue-200 text-sm mb-4">専門家に相談することで採択率が大幅に向上します</p>
          <a
            href={h.affiliate_cta.url}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="inline-block bg-white text-blue-700 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors"
          >
            {h.affiliate_cta.text}
          </a>
        </section>

        {/* 関連補助金 */}
        {related.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-4">関連する補助金</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {related.map((r) => (
                <Link key={r.slug} href={`/hojokin/${r.slug}`} className="block bg-white rounded-xl p-4 border border-gray-200 hover:border-blue-400 transition-colors">
                  <p className="font-bold text-gray-800 mb-1">{r.name}</p>
                  <p className="text-sm text-gray-500">最大 {formatAmount(r.max_amount)} ／ {formatRate(r.subsidy_rate)}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="mt-8 text-center">
          <Link href="/" className="text-blue-600 text-sm hover:underline">← トップに戻る・AI診断を受ける</Link>
        </div>
      </div>
    </main>
  )
}
