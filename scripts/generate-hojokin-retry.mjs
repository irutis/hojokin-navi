/**
 * 失敗したバッチの再生成（小分け）
 */
import Anthropic from '@anthropic-ai/sdk'
import { writeFileSync, readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUTPUT_PATH = join(__dirname, '../src/data/hojokin-light.json')

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const existing = JSON.parse(readFileSync(OUTPUT_PATH, 'utf-8'))
const existingNames = existing.map(h => h.name)

const BATCHES = [
  { theme: '雇用・人材（キャリアアップ・両立支援・障害者雇用以外の厚生労働省助成金）', count: 20 },
  { theme: '働き方改革・有給休暇・育児・介護と仕事の両立支援（厚生労働省）', count: 20 },
  { theme: '設備投資・省エネ・脱炭素・製造業DX（経済産業省・NEDO）', count: 25 },
  { theme: 'ITシステム・クラウド・デジタル化・EC・サイバーセキュリティ（中小企業庁）', count: 25 },
]

async function generateBatch(theme, count, existingNames) {
  const prompt = `あなたは日本の補助金・助成金の専門家です。
テーマ「${theme}」に関する実在する日本の補助金・助成金を${count}件、JSONで出力してください。

除外（既収録）: ${existingNames.slice(-50).join(', ')}

形式:
[{"name":"正式名称","managing_org":"管轄省庁","official_url":"公式URL","max_amount":数値,"subsidy_rate":数値,"target_size":["小規模事業者"],"target_industries":["全業種"],"purposes":["雇用・人材"],"description":"30字以内説明","tags":["タグ1","タグ2"]}]

実在する補助金のみ。JSONのみ返答。`

  const response = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 6000,
    messages: [{ role: 'user', content: prompt }],
  })

  const raw = response.content[0].text.trim()
  const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  return JSON.parse(cleaned)
}

async function main() {
  let allData = [...existing]

  for (const batch of BATCHES) {
    console.log(`\n生成中: ${batch.theme} (${batch.count}件)`)
    try {
      const items = await generateBatch(batch.theme, batch.count, existingNames)
      console.log(`  → ${items.length}件取得`)
      allData.push(...items)
      existingNames.push(...items.map(i => i.name))
      await new Promise(r => setTimeout(r, 2000))
    } catch (e) {
      console.error(`  エラー: ${e.message}`)
    }
  }

  writeFileSync(OUTPUT_PATH, JSON.stringify(allData, null, 2), 'utf-8')
  console.log(`\n✅ 完了: 合計${allData.length}件`)
}

main().catch(e => { console.error(e); process.exit(1) })
