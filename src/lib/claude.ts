import Anthropic from '@anthropic-ai/sdk'

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
  slug: string
  name: string
  reason: string
  match_score: number
  caution?: string
}

export async function runShindan(input: ShindanInput): Promise<ShindanResult[]> {
  const prompt = `あなたは日本の中小企業補助金の専門家です。
以下の企業情報をもとに、申請できる可能性が高い補助金をランキング形式で提示してください。

【企業情報】
- 業種：${input.industry}
- 従業員数：${input.employees}
- 資本金：${input.capital}
- 補助金を使いたい目的：${input.purpose}
- 設立年数：${input.established_years}

【対象補助金リスト】
1. IT導入補助金（slug: it-donyu）- ITツール・ソフトウェア導入、最大450万円
2. ものづくり補助金（slug: monozukuri）- 設備投資・革新的製品開発、最大1,250万円
3. 小規模事業者持続化補助金（slug: jizokuka）- 販路拡大、最大200万円（従業員5人以下または20人以下のみ）
4. 省力化投資補助金（slug: shorikika）- 人手不足解消・自動化、最大1,500万円

以下のJSON形式のみで返答してください（説明文不要）：
[
  {
    "slug": "補助金のslug",
    "name": "補助金名",
    "reason": "この企業がこの補助金に適している理由（50字以内）",
    "match_score": 85,
    "caution": "注意点があれば記載（なければnull）"
  }
]

match_scoreは0-100で、申請できる可能性と費用対効果を総合的に評価してください。
上位3件のみ返してください。`

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1000,
    messages: [{ role: 'user', content: prompt }],
  })

  const raw = response.content[0].type === 'text' ? response.content[0].text.trim() : '[]'
  const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  return JSON.parse(cleaned) as ShindanResult[]
}
