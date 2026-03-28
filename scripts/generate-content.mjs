/**
 * 自律コンテンツ生成スクリプト
 * GitHub Actionsから毎日実行 → 新しい補助金データを自動生成・追加
 */
import Anthropic from '@anthropic-ai/sdk'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.join(__dirname, '../src/data/hojokin')
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const EXISTING_SLUGS = ['it-donyu', 'monozukuri', 'jizokuka', 'shorikika']

const CANDIDATES = [
  { slug: 'jinzai-kaihatsu', name: '人材開発支援助成金' },
  { slug: 'gyomu-kaizen', name: '業務改善助成金' },
  { slug: 'keizokukoyo', name: '雇用調整助成金' },
  { slug: 'dx-toushi', name: 'DX投資促進税制' },
  { slug: 'midori-innovation', name: 'グリーンイノベーション基金' },
  { slug: 'startup-toushi', name: 'スタートアップ創出促進補助金' },
  { slug: 'jichitai-hojokin', name: '事業再構築補助金' },
  { slug: 'chiiki-mirai', name: '地域未来投資促進補助金' },
]

async function generateHojokinData(slug, name) {
  console.log(`Generating: ${name}`)

  const prompt = `あなたは日本の中小企業補助金の専門家です。
「${name}」について、以下のJSON形式で正確な情報を生成してください。

必ず以下のJSON形式のみで返答してください：
{
  "slug": "${slug}",
  "name": "${name}",
  "official_name": "正式名称",
  "category": "カテゴリ（例：人材育成・設備投資・販路拡大等）",
  "managing_org": "管轄省庁・機関",
  "max_amount": 数値（円）,
  "subsidy_rate": 数値（0〜1の小数）,
  "target_company_size": ["対象規模"],
  "target_industries": ["対象業種"],
  "purpose": "補助金の目的（1文）",
  "deadline": "締切情報",
  "next_expected": "次回公募予定",
  "eligible_expenses": ["対象経費1", "対象経費2"],
  "ineligible_expenses": ["対象外経費1", "対象外経費2"],
  "eligibility_conditions": ["条件1", "条件2", "条件3"],
  "company_size_limit": {"manufacturing": {"employees": 300}},
  "application_flow": ["ステップ1", "ステップ2", "ステップ3"],
  "rejection_reasons": ["不採択理由1", "不採択理由2", "不採択理由3"],
  "success_tips": ["コツ1", "コツ2", "コツ3"],
  "affiliate_cta": {"text": "CTA文言", "url_placeholder": "AFFILIATE_${slug.toUpperCase().replace(/-/g, '_')}"},
  "related_subsidies": ["it-donyu"],
  "tags": ["タグ1", "タグ2", "タグ3"],
  "monthly_searches": 推定月間検索数,
  "last_updated": "${new Date().toISOString().split('T')[0]}"
}`

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  })

  const raw = response.content[0].text.trim()
  const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  return JSON.parse(cleaned)
}

async function main() {
  const toGenerate = CANDIDATES.filter((c) => !EXISTING_SLUGS.includes(c.slug))

  if (toGenerate.length === 0) {
    console.log('No new content to generate.')
    return
  }

  // 1件だけ生成（APIコスト管理）
  const target = toGenerate[0]

  try {
    const data = await generateHojokinData(target.slug, target.name)
    const filePath = path.join(DATA_DIR, `${target.slug}.json`)
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
    console.log(`✅ Generated: ${filePath}`)

    // index.tsに追記が必要なことをログ出力
    console.log(`NEXT: Add import for ${target.slug} to src/data/hojokin/index.ts`)
  } catch (e) {
    console.error(`Failed to generate ${target.name}:`, e)
    process.exit(1)
  }
}

main()
