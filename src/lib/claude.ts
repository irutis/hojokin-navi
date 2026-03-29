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

// 当サイトが持つ補助金の一覧（slug → 名前・URLのマップ）
const ourSubsidyMap = Object.fromEntries(
  allHojokin.map((h) => [h.slug, { name: h.name, official_url: h.official_url }])
)

const ourSubsidyList = allHojokin
  .map((h) => `- ${h.name}（slug: ${h.slug}）: ${h.purpose}、最大${h.max_amount >= 1000000 ? Math.round(h.max_amount / 10000) + '万円' : h.max_amount + '円'}`)
  .join('\n')

export async function runShindan(input: ShindanInput): Promise<ShindanResult[]> {
  const prompt = `あなたは日本の中小企業補助金・助成金の専門家です。
以下の企業情報をもとに、この企業が実際に申請できる可能性が高い補助金・助成金をランキング形式で提示してください。

【企業情報】
- 業種：${input.industry}
- 従業員数：${input.employees}
- 資本金：${input.capital}
- 補助金を使いたい目的：${input.purpose}
- 設立年数：${input.established_years}

【当サイトで詳細解説している補助金・助成金】
（これらのslugは当サイトの詳細ページにリンクできます）
${ourSubsidyList}

【重要なルール】
1. 上記リストにある補助金を推薦する場合は、必ず対応するslugを使用してください
2. 上記リストにない補助金でもこの企業に適している場合は積極的に推薦してください。その場合はslugをnullにし、official_urlに公式URLを入れてください
3. 企業の実情に合った補助金を正確に推薦してください。条件を満たせない補助金は推薦しないでください
4. 雇用・人材系（助成金）も積極的に含めてください
5. 上位3〜5件を返してください

以下のJSON形式のみで返答してください（説明文・コードブロック不要）：
[
  {
    "slug": "it-donyu または null",
    "name": "補助金・助成金名",
    "reason": "この企業がこの補助金に適している具体的な理由（60字以内）",
    "match_score": 85,
    "caution": "申請上の注意点（なければnull）",
    "official_url": "slugがnullの場合の公式URL（slugがある場合はnull）"
  }
]`

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }],
  })

  const raw = response.content[0].type === 'text' ? response.content[0].text.trim() : '[]'
  const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  const parsed = JSON.parse(cleaned) as ShindanResult[]

  // slugが当サイトに存在するか検証し、存在しない場合はnullに修正
  return parsed.map((r) => {
    if (r.slug && !ourSubsidyMap[r.slug]) {
      return { ...r, slug: null, official_url: r.official_url ?? null }
    }
    return r
  })
}
