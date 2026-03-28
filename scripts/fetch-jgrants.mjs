/**
 * J-Grants API から補助金データを全件取得するスクリプト
 * Supabase が準備できたら DB に保存する
 */

const BASE_URL = 'https://api.jgrants-portal.go.jp/exp/v1/public'

// 検索キーワード（幅広く取得）
const KEYWORDS = [
  '中小企業',
  'IT',
  '設備',
  '補助金',
  '助成金',
  '創業',
  '事業承継',
  '省エネ',
  '雇用',
  '観光',
]

async function fetchSubsidies(keyword, offset = 0) {
  const params = new URLSearchParams({
    keyword: keyword,
    sort: 'acceptance_end_datetime',
    order: 'DESC',
    acceptance: '1',
    limit: '100',
    offset: String(offset),
  })
  const res = await fetch(`${BASE_URL}/subsidies?${params}`, {
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

async function fetchDetail(id) {
  const res = await fetch(`${BASE_URL}/subsidies/id/${id}`, {
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) return null
  const data = await res.json()
  return data.result?.[0] ?? null
}

async function main() {
  const seen = new Set()
  const allSubsidies = []

  for (const keyword of KEYWORDS) {
    try {
      const data = await fetchSubsidies(keyword)
      const items = data.result ?? []
      console.log(`[${keyword}] ${items.length}件取得`)

      for (const item of items) {
        if (seen.has(item.id)) continue
        seen.add(item.id)
        allSubsidies.push(item)
      }

      // レート制限対策
      await new Promise((r) => setTimeout(r, 300))
    } catch (e) {
      console.error(`[${keyword}] エラー:`, e.message)
    }
  }

  console.log(`\n合計ユニーク件数: ${allSubsidies.length}件`)

  // 上位20件の詳細を取得（サンプル）
  console.log('\n詳細データ取得中...')
  const detailed = []
  for (const item of allSubsidies.slice(0, 5)) {
    const detail = await fetchDetail(item.id)
    if (detail) {
      detailed.push(detail)
      console.log(`  ✓ ${detail.title}`)
    }
    await new Promise((r) => setTimeout(r, 500))
  }

  // 結果をJSONファイルに保存
  const fs = await import('fs')
  fs.writeFileSync(
    'scripts/jgrants-sample.json',
    JSON.stringify({ total: allSubsidies.length, subsidies: allSubsidies.slice(0, 50), detailed }, null, 2)
  )
  console.log('\nscripts/jgrants-sample.json に保存しました')
}

main().catch(console.error)
