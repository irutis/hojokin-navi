/**
 * Claude APIで補助金軽量データを生成するスクリプト
 * 使い方: ANTHROPIC_API_KEY=xxx node scripts/generate-hojokin-list.mjs
 */
import Anthropic from '@anthropic-ai/sdk'
import { writeFileSync, readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUTPUT_PATH = join(__dirname, '../src/data/hojokin-light.json')

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// 既存の補助金名（重複を避ける）
const EXISTING = [
  'IT導入補助金', 'ものづくり補助金', '小規模事業者持続化補助金', '省力化投資補助金',
  '事業再構築補助金', '省エネ設備補助金', '地域未来投資促進事業', '電子インボイス推進補助金',
  '事業承継・引継ぎ補助金', '雇用調整助成金', '特定求職者雇用開発助成金', 'イノベーション創造補助金',
  'キャリアアップ助成金', '働き方改革推進支援助成金', 'トライアル雇用助成金', '創業・スタートアップ支援補助金',
  '人材確保等支援助成金', 'Go-Tech事業', '海外展開支援補助金', '省エネシフト支援事業',
  '女性起業家支援補助金', '両立支援等助成金', '業務改善助成金', '人材開発支援助成金',
  '障害者雇用助成金', 'M&A補助金', 'BCP策定支援補助金', 'ZEB推進補助金',
  'インバウンド対応補助金', '中小企業退職金共済', '農業次世代人材投資事業', '特定商工業者補助金',
  'スマート農業推進補助金', 'インボイス対応補助金', 'ものづくりデジタル補助金', '持続化補助金（創造枠）',
]

const BATCHES = [
  {
    theme: '雇用・人材・働き方（厚生労働省系助成金）',
    count: 40,
  },
  {
    theme: '設備投資・省エネ・DX・デジタル化（経済産業省・中小企業庁系）',
    count: 50,
  },
  {
    theme: '創業・スタートアップ・第二創業・事業承継',
    count: 30,
  },
  {
    theme: '農業・林業・水産業・食品加工（農林水産省系）',
    count: 30,
  },
  {
    theme: '観光・インバウンド・地域振興・まちづくり',
    count: 25,
  },
  {
    theme: '医療・介護・福祉・子育て',
    count: 25,
  },
  {
    theme: '環境・脱炭素・再生可能エネルギー',
    count: 25,
  },
  {
    theme: '輸出・海外展開・貿易',
    count: 20,
  },
  {
    theme: '建設・不動産・住宅・リフォーム',
    count: 20,
  },
]

async function generateBatch(theme, count, existingNames) {
  const prompt = `あなたは日本の補助金・助成金の専門家です。
以下のテーマに関する実在する日本の補助金・助成金を${count}件、JSONで出力してください。

テーマ: ${theme}

以下の補助金は既に収録済みなので除外してください:
${existingNames.join(', ')}

各補助金について以下の形式で出力してください:
[
  {
    "name": "補助金・助成金の正式名称",
    "managing_org": "管轄省庁・機関名",
    "official_url": "公式ページURL（実在するもの）",
    "max_amount": 数値（円単位、不明な場合は0）,
    "subsidy_rate": 数値（補助率 0.5 = 50%、不明な場合は0）,
    "target_size": ["小規模事業者", "中小企業", "中堅企業", "大企業" から該当するもの],
    "target_industries": ["製造業", "IT・ソフトウェア", "小売業", "飲食業", "建設業", "サービス業", "卸売業", "農業", "医療・福祉", "観光・宿泊", "運輸・物流", "全業種" から該当するもの],
    "purposes": ["IT導入", "設備投資", "雇用・人材", "省エネ・環境", "販路拡大", "創業", "事業承継", "海外展開", "研究開発", "働き方改革" から該当するもの],
    "description": "30文字以内の一行説明",
    "tags": ["検索キーワードとなるタグを3〜6個"]
  }
]

実在する補助金のみを出力してください。JSONのみを返してください（説明不要）。`

  const response = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 8000,
    messages: [{ role: 'user', content: prompt }],
  })

  const raw = response.content[0].text.trim()
  const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  return JSON.parse(cleaned)
}

async function main() {
  const allNew = []
  const existingNames = [...EXISTING]

  for (const batch of BATCHES) {
    console.log(`\n生成中: ${batch.theme} (${batch.count}件)`)
    try {
      const items = await generateBatch(batch.theme, batch.count, existingNames)
      console.log(`  → ${items.length}件取得`)
      allNew.push(...items)
      existingNames.push(...items.map(i => i.name))
      // API制限回避
      await new Promise(r => setTimeout(r, 2000))
    } catch (e) {
      console.error(`  エラー: ${e.message}`)
    }
  }

  writeFileSync(OUTPUT_PATH, JSON.stringify(allNew, null, 2), 'utf-8')
  console.log(`\n✅ 完了: ${allNew.length}件 → ${OUTPUT_PATH}`)
}

main().catch(e => {
  console.error('❌ エラー:', e)
  process.exit(1)
})
