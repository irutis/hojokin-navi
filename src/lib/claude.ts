import Anthropic from '@anthropic-ai/sdk'
import { allHojokin } from '@/data/hojokin/index'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export type ShindanInput = {
  industry: string
  employees: string
  capital: string
  purpose: string
  established_years: string
}

export type ShindanResult = {
  slug: string | null
  name: string
  reason: string
  match_score: number
  caution?: string | null
  official_url?: string | null
}

type LightHojokin = {
  name: string
  managing_org: string
  official_url: string
  max_amount: number
  subsidy_rate: number
  target_size: string[]
  target_industries: string[]
  purposes: string[]
  description: string
  tags: string[]
}

// Tier1: 詳細ページあり（内部リンク）
const tier1Map = Object.fromEntries(
  allHojokin.map((h) => [h.slug, { name: h.name, official_url: h.official_url }])
)

// Tier2: 軽量データ（外部リンク）
function loadTier2(): LightHojokin[] {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('@/data/hojokin-light.json') as LightHojokin[]
  } catch {
    return []
  }
}

// 入力からタグを生成
function inputToTags(input: ShindanInput): string[] {
  const tags: string[] = []

  // 業種マッピング
  const industryMap: Record<string, string[]> = {
    '製造業': ['製造', '設備', 'ものづくり'],
    'IT・ソフトウェア': ['IT', 'DX', 'デジタル', 'ソフトウェア'],
    '小売業': ['小売', '販路', '店舗'],
    '飲食業': ['飲食', '食品', '店舗'],
    '建設業': ['建設', '工事', '住宅'],
    'サービス業': ['サービス', '観光'],
    '卸売業': ['卸売', '流通'],
  }
  tags.push(...(industryMap[input.industry] ?? []))

  // 目的マッピング
  const purposeMap: Record<string, string[]> = {
    'ITツール・システム導入': ['IT', 'DX', 'デジタル', 'システム'],
    '設備・機械の購入': ['設備', '機械', 'ものづくり'],
    'HP・広告・販路拡大': ['販路', '広告', 'HP', 'EC'],
    '省力化・自動化': ['省力化', '自動化', 'ロボット'],
    '新製品・サービス開発': ['研究開発', 'イノベーション', '新製品'],
  }
  tags.push(...(purposeMap[input.purpose] ?? []))

  // 規模
  const emp = input.employees
  if (emp === '1〜5人' || emp === '6〜20人') tags.push('小規模事業者')
  if (emp !== '301人以上') tags.push('中小企業')

  // 設立年数
  if (input.established_years === '1年未満' || input.established_years === '1〜3年') {
    tags.push('創業', 'スタートアップ')
  }

  return [...new Set(tags)]
}

// タグマッチングで候補を絞り込む
function filterByTags(
  items: LightHojokin[],
  inputTags: string[],
  industry: string,
  targetSize: string,
  limit: number
): LightHojokin[] {
  const scored = items.map((item) => {
    let score = 0
    // タグマッチ
    for (const t of inputTags) {
      if (item.tags?.some(tag => tag.includes(t) || t.includes(tag))) score += 2
    }
    // 業種マッチ
    if (item.target_industries?.includes(industry) || item.target_industries?.includes('全業種')) score += 3
    // 規模マッチ
    if (item.target_size?.includes(targetSize) || item.target_size?.includes('中小企業')) score += 2

    return { item, score }
  })

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.item)
}

export async function runShindan(input: ShindanInput): Promise<ShindanResult[]> {
  const tier2 = loadTier2()
  const inputTags = inputToTags(input)

  // 従業員数から規模を判定
  const emp = input.employees
  const targetSize = (emp === '1〜5人' || emp === '6〜20人') ? '小規模事業者' : '中小企業'

  // Tier1を全件含める（36件）
  const tier1List = allHojokin.map(h =>
    `- [詳細あり] ${h.name}（slug: ${h.slug}）: ${h.purpose}、最大${h.max_amount >= 10000 ? Math.round(h.max_amount / 10000) + '万円' : h.max_amount + '円'}`
  ).join('\n')

  // Tier2からタグマッチで上位30件を絞り込む
  const tier2Filtered = filterByTags(tier2, inputTags, input.industry, targetSize, 30)
  const tier2List = tier2Filtered.map(h =>
    `- [外部リンク] ${h.name}（${h.managing_org}）: ${h.description}、最大${h.max_amount > 0 ? Math.round(h.max_amount / 10000) + '万円' : '要確認'}`
  ).join('\n')

  const prompt = `あなたは日本の中小企業補助金・助成金の専門家です。
以下の企業情報をもとに、この企業が実際に申請できる可能性が高い補助金・助成金をランキング形式で5件提示してください。

【企業情報】
- 業種：${input.industry}
- 従業員数：${input.employees}
- 資本金：${input.capital}
- 補助金を使いたい目的：${input.purpose}
- 設立年数：${input.established_years}

【詳細ページあり（推奨）】
${tier1List}

【外部リンク候補】
${tier2List}

【ルール】
1. 詳細ページありの補助金を推薦する場合はslugを使用
2. 外部リンク候補の補助金はslug=null、official_urlを"外部リンク:補助金名"形式で記載
3. リストにない補助金でも適切なものがあればslug=null、official_urlに公式URLを記載
4. 企業の条件を実際に満たせる補助金のみ推薦
5. 必ず5件返す

JSON形式のみで返答:
[
  {
    "slug": "it-donyu または null",
    "name": "補助金名",
    "reason": "適している理由（60字以内）",
    "match_score": 85,
    "caution": "注意点（なければnull）",
    "official_url": "slugがnullの場合のURL"
  }
]`

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  })

  const raw = response.content[0].type === 'text' ? response.content[0].text.trim() : '[]'
  const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  const parsed = JSON.parse(cleaned) as ShindanResult[]

  // 外部リンク候補のURLを解決
  const tier2ByName = Object.fromEntries(tier2Filtered.map(h => [h.name, h.official_url]))

  return parsed.map((r) => {
    // Tier1のslugを検証
    if (r.slug && !tier1Map[r.slug]) {
      return { ...r, slug: null, official_url: r.official_url ?? null }
    }
    // Tier2の外部URLを解決
    if (!r.slug && r.official_url?.startsWith('外部リンク:')) {
      const name = r.official_url.replace('外部リンク:', '')
      const url = tier2ByName[name] ?? null
      return { ...r, official_url: url }
    }
    return r
  })
}
