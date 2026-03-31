/**
 * マネーフォワード クラウドのinsIdを探す
 * 使い方: A8_LOGIN_ID=xxx A8_PASSWORD=xxx node scripts/find-mf-insid.mjs
 */
import { chromium } from 'playwright'

const LOGIN_ID = process.env.A8_LOGIN_ID
const PASSWORD = process.env.A8_PASSWORD

if (!LOGIN_ID || !PASSWORD) {
  console.error('A8_LOGIN_ID と A8_PASSWORD を設定してください')
  process.exit(1)
}

const browser = await chromium.launch({ headless: false })
const page = await browser.newPage({
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
})

await page.goto('https://pub.a8.net/a8v2/asLoginAction.do', { waitUntil: 'domcontentloaded' })
await page.fill('input[name="login"]', LOGIN_ID)
await page.fill('input[name="passwd"]', PASSWORD)
await page.click('input[type="submit"]')
await page.waitForNavigation({ waitUntil: 'networkidle' }).catch(() => {})

console.log('ログイン完了。提携プログラム一覧を取得中...')

await page.goto('https://pub.a8.net/a8v2/media/partnerProgramListAction.do?act=search&viewPage=1', {
  waitUntil: 'networkidle'
})
await page.waitForTimeout(3000)

// リンクからinsIdを探す
const links = await page.$$eval('a[href*="linkAction"]', els =>
  els.map(a => ({ text: a.textContent?.trim(), href: a.href }))
)

const mfLinks = links.filter(l => l.text?.includes('マネーフォワード') || l.href?.includes('moneyforward'))
console.log('\nマネーフォワード関連リンク:')
mfLinks.forEach(l => console.log(' -', l.text, '→', l.href))

// insIdをURLから抽出
const insIds = links
  .map(l => {
    const m = l.href.match(/insId=([^&]+)/)
    return m ? { insId: m[1], text: l.text } : null
  })
  .filter(Boolean)

console.log('\n全insId一覧（マネーフォワード絞り込み）:')
insIds.filter(i => i.text?.includes('マネーフォワード')).forEach(i =>
  console.log(` - ${i.insId}: ${i.text}`)
)

await browser.close()
