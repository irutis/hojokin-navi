import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '補助金検索｜全国の補助金・助成金を一覧で検索',
  description: '現在募集中の補助金・助成金を業種・地域・金額で検索。J-Grantsの全データをリアルタイムで表示。',
}

export const revalidate = 3600 // 1時間ごとに再生成

function formatAmount(amount: number | null): string {
  if (!amount || amount === 0) return '金額未定'
  if (amount >= 100000000) return `${Math.round(amount / 100000000)}億円`
  if (amount >= 10000000) return `${Math.round(amount / 10000000) / 10}千万円`
  if (amount >= 10000) return `${Math.round(amount / 10000)}万円`
  return `${amount.toLocaleString()}円`
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '随時'
  const d = new Date(dateStr)
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ area?: string; q?: string }>
}) {
  const { area, q } = await searchParams

  let query = supabase
    .from('subsidies')
    .select('*')
    .order('acceptance_end', { ascending: true })
    .limit(100)

  if (q) {
    query = query.ilike('title', `%${q}%`)
  }
  if (area && area !== '全国') {
    query = query.or(`target_area.ilike.%${area}%,target_area.ilike.%全国%`)
  }

  const { data: subsidies, error, count } = await query

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-blue-700 font-bold text-lg">補助金申請ガイド</Link>
          <span className="text-xs text-gray-400">J-Grants公式データ連携</span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">補助金・助成金を検索</h1>
        <p className="text-gray-500 text-sm mb-6">現在募集中の補助金をリアルタイムで表示（J-Grants公式データ）</p>

        {/* 検索フォーム */}
        <form className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              name="q"
              defaultValue={q}
              placeholder="キーワード（例：IT導入、設備投資）"
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400"
            />
            <select
              name="area"
              defaultValue={area}
              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400"
            >
              <option value="">全国・都道府県</option>
              <option value="全国">全国</option>
              {['北海道','青森県','岩手県','宮城県','秋田県','山形県','福島県','茨城県','栃木県','群馬県','埼玉県','千葉県','東京都','神奈川県','新潟県','富山県','石川県','福井県','山梨県','長野県','岐阜県','静岡県','愛知県','三重県','滋賀県','京都府','大阪府','兵庫県','奈良県','和歌山県','鳥取県','島根県','岡山県','広島県','山口県','徳島県','香川県','愛媛県','高知県','福岡県','佐賀県','長崎県','熊本県','大分県','宮崎県','鹿児島県','沖縄県'].map(pref => (
                <option key={pref} value={pref}>{pref}</option>
              ))}
            </select>
            <button
              type="submit"
              className="bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-blue-800 transition-colors text-sm"
            >
              検索
            </button>
          </div>
        </form>

        {error ? (
          <div className="text-center py-12 text-gray-500">
            <p>データを取得中です。しばらくお待ちください。</p>
            <Link href="/" className="text-blue-600 text-sm mt-4 block hover:underline">← トップに戻る</Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">{subsidies?.length ?? 0}件表示</p>
            <div className="space-y-3">
              {subsidies?.map((s) => (
                <div key={s.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:border-blue-300 transition-colors">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex-1">
                      <h2 className="font-bold text-gray-800 text-sm mb-2 leading-snug">{s.title}</h2>
                      <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                        <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{s.target_area ?? '全国'}</span>
                        {s.target_employees && (
                          <span className="bg-gray-100 px-2 py-0.5 rounded-full">{s.target_employees}</span>
                        )}
                        {s.acceptance_end && (
                          <span className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full">
                            締切: {formatDate(s.acceptance_end)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-blue-700 text-sm">{formatAmount(s.subsidy_max_limit)}</p>
                      {s.detail_url && (
                        <a
                          href={s.detail_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-gray-400 hover:text-blue-600 mt-1 block"
                        >
                          公式サイト →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {(!subsidies || subsidies.length === 0) && (
              <div className="text-center py-12 text-gray-500">
                <p className="mb-2">該当する補助金が見つかりませんでした</p>
                <Link href="/search" className="text-blue-600 text-sm hover:underline">検索条件をリセット</Link>
              </div>
            )}
          </>
        )}

        <div className="mt-8 text-center">
          <Link href="/" className="text-blue-600 text-sm hover:underline">← AI診断でピッタリの補助金を探す</Link>
        </div>
      </div>
    </main>
  )
}
