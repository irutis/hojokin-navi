/**
 * J-Grants API → Supabase 同期スクリプト（高速版）
 * 基本データのみ保存してタイムアウトを回避
 */
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const BASE_URL = 'https://api.jgrants-portal.go.jp/exp/v1/public'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const KEYWORDS = [
  '中小企業', 'IT', '設備', '補助金', '助成金',
  '創業', '事業承継', '省エネ', '雇用', '観光',
  '農業', '建設', '医療', '福祉', 'デジタル',
]

async function fetchSubsidies(keyword) {
  const params = new URLSearchParams({
    keyword,
    sort: 'acceptance_end_datetime',
    order: 'DESC',
    acceptance: '1',
    limit: '100',
  })
  const res = await fetch(`${BASE_URL}/subsidies?${params}`, {
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) return []
  const data = await res.json()
  return data.result ?? []
}

async function main() {
  console.log('J-Grants → Supabase 同期開始（高速版）')

  const seen = new Set()
  const allItems = []

  for (const keyword of KEYWORDS) {
    const items = await fetchSubsidies(keyword)
    for (const item of items) {
      if (seen.has(item.id)) continue
      seen.add(item.id)
      allItems.push(item)
    }
    await new Promise(r => setTimeout(r, 200))
  }

  console.log(`取得件数: ${allItems.length}件`)

  // 10件ずつ小さいバッチで保存（タイムアウト回避）
  let saved = 0
  for (let i = 0; i < allItems.length; i += 10) {
    const batch = allItems.slice(i, i + 10)

    const rows = batch.map((item) => ({
      id: item.id,
      title: item.title,
      target_area: item.target_area_search ?? null,
      subsidy_max_limit: item.subsidy_max_limit ?? null,
      acceptance_start: item.acceptance_start_datetime ?? null,
      acceptance_end: item.acceptance_end_datetime ?? null,
      target_employees: item.target_number_of_employees ?? null,
      purpose: null,
      detail_url: null,
      raw_data: item,
      updated_at: new Date().toISOString(),
    }))

    const { error } = await supabase
      .from('subsidies')
      .upsert(rows, { onConflict: 'id' })

    if (error) {
      console.error(`バッチ${i}エラー:`, error.message)
      await new Promise(r => setTimeout(r, 2000))
    } else {
      saved += rows.length
      process.stdout.write(`\r${saved}/${allItems.length}件保存済み`)
    }

    await new Promise(r => setTimeout(r, 300))
  }

  console.log(`\n同期完了: ${saved}件`)
}

main().catch(console.error)
