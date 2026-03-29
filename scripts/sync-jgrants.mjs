/**
 * J-Grants API → Supabase 同期スクリプト（堅牢版）
 */
import { createClient } from '@supabase/supabase-js'

// 複数の環境変数名に対応
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  ''

const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  ''

const BASE_URL = 'https://api.jgrants-portal.go.jp/exp/v1/public'

// 環境変数チェック
if (!SUPABASE_URL) {
  console.error('❌ エラー: Supabase URLが設定されていません')
  console.error('必要な環境変数: SUPABASE_URL または NEXT_PUBLIC_SUPABASE_URL')
  process.exit(1)
}

if (!SUPABASE_KEY) {
  console.error('❌ エラー: Supabase Keyが設定されていません')
  console.error('必要な環境変数: SUPABASE_SERVICE_KEY')
  process.exit(1)
}

console.log(`✅ Supabase URL: ${SUPABASE_URL.slice(0, 40)}...`)
console.log(`✅ Supabase Key: ${SUPABASE_KEY.slice(0, 20)}...`)

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const KEYWORDS = [
  '中小企業', 'IT', '設備', '補助金', '助成金',
  '創業', '事業承継', '省エネ', '雇用', '観光',
  '農業', '建設', '医療', '福祉', 'デジタル',
]

async function fetchSubsidies(keyword) {
  try {
    const params = new URLSearchParams({
      keyword,
      sort: 'acceptance_end_datetime',
      order: 'DESC',
      acceptance: '1',
      limit: '100',
    })
    const res = await fetch(`${BASE_URL}/subsidies?${params}`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(15000),
    })
    if (!res.ok) {
      console.warn(`⚠️ キーワード「${keyword}」: HTTP ${res.status}`)
      return []
    }
    const data = await res.json()
    return data.result ?? []
  } catch (e) {
    console.warn(`⚠️ キーワード「${keyword}」フェッチ失敗: ${e.message}`)
    return []
  }
}

async function main() {
  console.log('J-Grants → Supabase 同期開始')

  // Supabase接続テスト
  const { error: pingError } = await supabase.from('subsidies').select('id').limit(1)
  if (pingError) {
    console.error('❌ Supabase接続エラー:', pingError.message)
    console.error('テーブルが存在するか、RLSポリシーを確認してください')
    process.exit(1)
  }
  console.log('✅ Supabase接続確認OK')

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

  if (allItems.length === 0) {
    console.warn('⚠️ J-Grants APIから0件取得。APIが変更された可能性があります。')
    process.exit(0)
  }

  let saved = 0
  let errors = 0
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
      errors++
      await new Promise(r => setTimeout(r, 2000))
    } else {
      saved += rows.length
      process.stdout.write(`\r${saved}/${allItems.length}件保存済み`)
    }

    await new Promise(r => setTimeout(r, 300))
  }

  console.log(`\n同期完了: ${saved}件保存 / ${errors}エラー`)
}

main().catch((e) => {
  console.error('❌ 予期しないエラー:', e)
  process.exit(1)
})
