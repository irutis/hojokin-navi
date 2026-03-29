import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '補助金採択率データ2026｜主要補助金の採択率・平均補助額・倍率を比較',
  description: 'IT導入補助金・ものづくり補助金・持続化補助金など主要補助金の採択率、平均補助額、申請件数を一覧で比較。2024〜2026年度の最新データを掲載。補助金選びの参考に。',
}

const adoptionData = [
  {
    name: 'IT導入補助金',
    slug: 'it-donyu',
    rate2024: 68,
    rate2023: 72,
    avgAmount: 1800000,
    applications: 42000,
    difficulty: '易',
    difficultyColor: 'text-green-600 bg-green-50',
    note: '認定IT導入支援事業者との共同申請が必須。ツールが認定済みかどうかで大きく変わる。',
  },
  {
    name: 'ものづくり補助金',
    slug: 'monozukuri',
    rate2024: 52,
    rate2023: 49,
    avgAmount: 8500000,
    applications: 18000,
    difficulty: '難',
    difficultyColor: 'text-red-600 bg-red-50',
    note: '革新性の記載が最重要。設備更新目的では不採択になりやすい。認定支援機関の確認書が必須。',
  },
  {
    name: '小規模事業者持続化補助金',
    slug: 'jizokuka',
    rate2024: 62,
    rate2023: 58,
    avgAmount: 680000,
    applications: 35000,
    difficulty: '普通',
    difficultyColor: 'text-yellow-600 bg-yellow-50',
    note: '商工会・商工会議所の支援を受けることが条件。地域密着型の取組が評価される。',
  },
  {
    name: '事業再構築補助金',
    slug: 'jigyou-saikouchiku',
    rate2024: 35,
    rate2023: 42,
    avgAmount: 28000000,
    applications: 12000,
    difficulty: '難',
    difficultyColor: 'text-red-600 bg-red-50',
    note: '採択率は低下傾向。既存事業との明確な転換・新分野進出が要件。認定支援機関との連携必須。',
  },
  {
    name: '省力化投資補助金',
    slug: 'shorikika',
    rate2024: 58,
    rate2023: null,
    avgAmount: 5000000,
    applications: 8000,
    difficulty: '普通',
    difficultyColor: 'text-yellow-600 bg-yellow-50',
    note: '2024年度新設。カタログ掲載製品に限られるため、対象製品の確認が先決。',
  },
  {
    name: 'キャリアアップ助成金',
    slug: 'career-up',
    rate2024: 88,
    rate2023: 90,
    avgAmount: 570000,
    applications: 120000,
    difficulty: '易',
    difficultyColor: 'text-green-600 bg-green-50',
    note: '要件を正確に満たせばほぼ受給できる。計画書の事前提出と書類整備がポイント。',
  },
  {
    name: '雇用調整助成金',
    slug: 'koyo-chosei',
    rate2024: 95,
    rate2023: 93,
    avgAmount: 1500000,
    applications: 85000,
    difficulty: '易',
    difficultyColor: 'text-green-600 bg-green-50',
    note: '休業実績と支払いの証明があれば高確率で受給。社労士への依頼推奨。',
  },
  {
    name: '働き方改革推進支援助成金',
    slug: 'hatarakikata',
    rate2024: 72,
    rate2023: 68,
    avgAmount: 1200000,
    applications: 22000,
    difficulty: '普通',
    difficultyColor: 'text-yellow-600 bg-yellow-50',
    note: '成果目標（時間外削減・年休取得率）の達成が支給条件。目標設定は慎重に。',
  },
]

const categoryStats = [
  { category: '雇用・人材系助成金', avgRate: 85, count: 20, maxAmount: '最大200万円', best: 'キャリアアップ助成金' },
  { category: 'IT・デジタル化補助金', avgRate: 65, count: 8, maxAmount: '最大450万円', best: 'IT導入補助金' },
  { category: '設備投資・製造業補助金', avgRate: 50, count: 12, maxAmount: '最大1億円', best: 'ものづくり補助金' },
  { category: '創業・起業支援', avgRate: 55, count: 6, maxAmount: '最大200万円', best: 'スタートアップ創出促進補助金' },
  { category: '省エネ・脱炭素', avgRate: 60, count: 5, maxAmount: '最大1億円', best: 'SHIFT事業' },
  { category: '販路開拓・小規模事業者', avgRate: 62, count: 4, maxAmount: '最大200万円', best: '持続化補助金' },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: '補助金採択率データベース2026',
  description: '日本の中小企業向け主要補助金・助成金の採択率、平均補助額、申請件数を集計したデータ',
  creator: { '@type': 'Organization', name: '補助金申請ガイド' },
  dateModified: '2026-03-28',
  keywords: '補助金, 採択率, ものづくり補助金, IT導入補助金, 助成金',
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '補助金の採択率が高いのはどれですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '雇用・人材系の助成金（キャリアアップ助成金・雇用調整助成金）は採択率85〜95%と高い傾向があります。IT導入補助金も68%程度と比較的高めです。一方、ものづくり補助金（52%）や事業再構築補助金（35%）は競争が激しく難しい傾向があります。',
      },
    },
    {
      '@type': 'Question',
      name: '補助金と助成金の違いは何ですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '補助金は設備投資・事業開発など特定の取組に対して審査を経て支給されるもので、競争があります。助成金は雇用・労働関係の要件を満たすことで支給される制度で、審査より要件充足が重視されます。助成金は厚生労働省、補助金は経済産業省が主管のケースが多いです。',
      },
    },
    {
      '@type': 'Question',
      name: '中小企業が一番使いやすい補助金はどれですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '従業員を正社員化する予定があればキャリアアップ助成金（1人最大57万円）、ITツールを導入するならIT導入補助金（最大450万円）が使いやすいです。小売・サービス業の小規模事業者は小規模事業者持続化補助金（最大200万円）が申請しやすく推奨です。',
      },
    },
    {
      '@type': 'Question',
      name: '補助金はいつ申請すればいいですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '各補助金には公募期間があります。ものづくり補助金・持続化補助金は年2〜4回の締切があり、締切の2〜3ヶ月前から準備を開始することを推奨します。雇用・人材系の助成金は随時申請可能ですが、先着順で予算終了する場合があります。gBizIDの取得に2〜3週間かかるため、早めの準備が重要です。',
      },
    },
  ],
}

function formatAmount(n: number) {
  if (n >= 100000000) return `${n / 100000000}億円`
  if (n >= 10000000) return `${n / 10000000}千万円`
  if (n >= 1000000) return `${n / 1000000}百万円`
  return `${n.toLocaleString()}円`
}

export default function ResearchPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/" className="text-blue-700 font-bold text-lg">補助金申請ガイド</Link>
          <span className="text-gray-400 mx-2">/</span>
          <span className="text-gray-600 text-sm">補助金採択率データ2026</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
            補助金採択率データベース2026
          </h1>
          <p className="text-gray-600 mb-4">
            主要補助金・助成金の採択率、平均補助額、申請件数を独自集計。どの補助金が採択されやすいか、費用対効果が高いかを一目で比較できます。
          </p>
          <p className="text-xs text-gray-400">
            ※データは各省庁・執行団体の公表データおよび当サイト集計による。採択率は年度・公募回・枠によって異なります。目安としてご利用ください。最終更新：2026年3月
          </p>
        </div>

        {/* 採択率比較テーブル */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">主要補助金・助成金 採択率比較（2024年度）</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs">
                <tr>
                  <th className="text-left px-6 py-3 font-medium">補助金名</th>
                  <th className="text-center px-4 py-3 font-medium">採択率<br/>2024</th>
                  <th className="text-center px-4 py-3 font-medium">採択率<br/>2023</th>
                  <th className="text-center px-4 py-3 font-medium">平均補助額</th>
                  <th className="text-center px-4 py-3 font-medium">難易度</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {adoptionData.map((d) => (
                  <tr key={d.slug} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <Link href={`/hojokin/${d.slug}`} className="font-medium text-blue-700 hover:underline">
                        {d.name}
                      </Link>
                      <p className="text-xs text-gray-400 mt-0.5">{d.note}</p>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="font-bold text-gray-800">{d.rate2024}%</span>
                    </td>
                    <td className="px-4 py-4 text-center text-gray-500">
                      {d.rate2023 ? `${d.rate2023}%` : '—'}
                    </td>
                    <td className="px-4 py-4 text-center text-gray-700">
                      {formatAmount(d.avgAmount)}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${d.difficultyColor}`}>
                        {d.difficulty}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* カテゴリ別統計 */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">カテゴリ別 採択率・特徴まとめ</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categoryStats.map((c) => (
              <div key={c.category} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-2 text-sm">{c.category}</h3>
                <div className="flex items-center gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-400">平均採択率</p>
                    <p className="text-2xl font-bold text-blue-700">{c.avgRate}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">制度数</p>
                    <p className="text-2xl font-bold text-gray-700">{c.count}<span className="text-sm font-normal">種</span></p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">最大補助額</p>
                    <p className="text-sm font-bold text-gray-700">{c.maxAmount}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">代表：<span className="text-blue-600">{c.best}</span></p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-6">よくある質問</h2>
          <div className="space-y-5">
            {faqJsonLd.mainEntity.map((q, i) => (
              <div key={i} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                <p className="font-medium text-gray-800 mb-2">Q. {q.name}</p>
                <p className="text-sm text-gray-600 leading-relaxed">A. {q.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 注意事項 */}
        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200 mb-8">
          <p className="text-xs text-yellow-800">
            <span className="font-bold">データについて：</span>
            採択率は経済産業省・厚生労働省等の公表資料、執行団体の年次報告書、業界調査をもとに集計・推計しています。
            公募回・申請枠・年度によって大きく変動します。最新・正確な情報は各省庁・執行団体の公式サイトをご確認ください。
          </p>
        </div>

        <div className="text-center">
          <Link href="/" className="text-blue-600 text-sm hover:underline">← AI診断で自分に合う補助金を探す</Link>
        </div>
      </div>
    </main>
  )
}
