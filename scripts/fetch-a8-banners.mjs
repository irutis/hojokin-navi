/**
 * A8.net バナーHTML自動取得スクリプト
 * 環境変数: A8_EMAIL, A8_PASSWORD
 * 出力: src/data/affiliates.json の banner_html を更新
 */

import { chromium } from 'playwright'
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const AFFILIATES_PATH = join(__dirname, '../src/data/affiliates.json')

const LOGIN_ID = process.env.A8_LOGIN_ID  // A8.netの会員ID（英数字）
const PASSWORD = process.env.A8_PASSWORD

if (!LOGIN_ID || !PASSWORD) {
  console.error('❌ A8_LOGIN_ID と A8_PASSWORD を設定してください')
  process.exit(1)
}

// バナーサイズ優先順（幅x高さ）
const PREFERRED_SIZES = ['468x60', '300x250', '728x90', '320x50']

async function main() {
  const affiliates = JSON.parse(readFileSync(AFFILIATES_PATH, 'utf-8'))

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  })
  const page = await context.newPage()

  try {
    // ─── ログイン ───
    console.log('A8.net にログイン中...')
    await page.goto('https://pub.a8.net/a8v2/asLoginAction.do', { waitUntil: 'domcontentloaded', timeout: 60000 })

    await page.fill('input[name="login"]', LOGIN_ID)
    await page.fill('input[name="passwd"]', PASSWORD)
    await page.click('input[type="submit"]')
    await page.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 }).catch(() => {})

    const currentUrl = page.url()
    console.log('遷移先URL:', currentUrl)
    if (currentUrl.includes('loginAction') || currentUrl.includes('login')) {
      console.error('❌ ログイン失敗。A8_LOGIN_ID（会員ID）とパスワードを確認してください')
      process.exit(1)
    }
    console.log('✅ ログイン成功')

    // ─── 参加中プログラム一覧 ───
    await page.goto('https://pub.a8.net/a8v2/media/partnerProgramListAction.do?act=search&viewPage=', { waitUntil: 'networkidle', timeout: 60000 })
    await page.waitForTimeout(2000)

    let updated = 0
    const PARTNER_LIST_URL = 'https://pub.a8.net/a8v2/media/partnerProgramListAction.do?act=search&viewPage='

    for (const affiliate of affiliates) {
      console.log(`\n🔍 ${affiliate.name} のバナーを検索中...`)

      try {
        // 参加中プログラム一覧でキーワード検索
        await page.goto(
          `${PARTNER_LIST_URL}&keyword=${encodeURIComponent(affiliate.program_name_keyword)}`,
          { waitUntil: 'networkidle', timeout: 60000 }
        )
        await page.waitForTimeout(2000)

        // プログラム行から広告リンクURLを抽出
        const programRows = await page.evaluate(() => {
          const rows = []
          document.querySelectorAll('a[href*="linkAction"]').forEach(a => {
            const row = a.closest('tr') || a.closest('div') || a.closest('li')
            rows.push({ name: row?.textContent?.replace(/\s+/g, ' ').trim().slice(0, 80) ?? '', linkUrl: a.href })
          })
          return rows
        })

        // 最初のlinkActionリンクを使用（キーワード検索済みなので先頭が最関連）
        let linkUrl = programRows[0]?.linkUrl
        if (!linkUrl) {
          console.warn(`  ⚠️ ${affiliate.name} が見つかりませんでした`)
          continue
        }

        if (!linkUrl) {
          console.warn(`  ⚠️ ${affiliate.name} が見つかりませんでした`)
          continue
        }

        // 広告リンクページへ移動（バナー画像タブを探す）
        await page.goto(linkUrl, { waitUntil: 'networkidle', timeout: 60000 })
        await page.waitForTimeout(1000)
        console.log('  広告リンクURL:', page.url())

        // ページ内のタブ・リンクを確認してバナー画像ページへ遷移
        const pageLinks2 = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('a, button, li'))
            .map(el => `${el.tagName} "${el.textContent?.trim()}" href="${el.getAttribute('href') || ''}"`)
            .filter(s => s.includes('バナー') || s.includes('banner') || s.includes('画像') || s.includes('image') || s.includes('img'))
            .slice(0, 20)
        })
        console.log('  バナー関連要素:', pageLinks2.join('\n  '))

        // バナータブ・リンクをクリック
        const bannerTab = await page.locator('a:has-text("バナー"), button:has-text("バナー"), li:has-text("バナー広告"), a[href*="banner"], a[href*="imgLink"]').first()
        if (await bannerTab.count() > 0) {
          await bannerTab.click()
          await page.waitForNavigation({ waitUntil: 'networkidle' }).catch(() => {})
          await page.waitForTimeout(1000)
          console.log('  バナーページURL:', page.url())
        }

        // バナーHTMLをtextareaから取得
        let bannerHtml = ''
        const textareas = await page.locator('textarea').all()
        for (const ta of textareas) {
          const val = await ta.inputValue().catch(() => '')
          if (val.includes('a8.net') && (val.includes('<a ') || val.includes('<img '))) {
            for (const size of PREFERRED_SIZES) {
              const [w, h] = size.split('x')
              if (val.includes(`width="${w}"`) && val.includes(`height="${h}"`)) {
                bannerHtml = val.trim()
                console.log(`  ✅ ${size} バナーをtextareaから取得`)
                break
              }
            }
            // サイズ不明・テキストリンクのみは使用しない
          }
          if (bannerHtml) break
        }

        // textareaになければimgタグから構築
        if (!bannerHtml) {
          const imgs = await page.locator('img[src*="a8.net"], img[src*="a8img"]').all()
          for (const img of imgs) {
            const w = await img.getAttribute('width') || ''
            const h = await img.getAttribute('height') || ''
            for (const size of PREFERRED_SIZES) {
              const [pw, ph] = size.split('x')
              if (w === pw && h === ph) {
                const outer = await img.evaluate((el) => {
                  const a = el.closest('a')
                  return a ? a.outerHTML : el.outerHTML
                })
                bannerHtml = outer
                console.log(`  ✅ imgから ${size} バナーを取得`)
                break
              }
            }
            if (bannerHtml) break
          }
        }

        if (bannerHtml) {
          affiliate.banner_html = bannerHtml
          updated++
        } else {
          console.warn(`  ⚠️ バナーHTMLが見つかりませんでした（フォールバックURLを使用）`)
        }

      } catch (err) {
        console.warn(`  ⚠️ ${affiliate.name} の取得中にエラー: ${err.message}`)
      }

      await new Promise((r) => setTimeout(r, 1000))
    }

    writeFileSync(AFFILIATES_PATH, JSON.stringify(affiliates, null, 2), 'utf-8')
    console.log(`\n✅ 完了: ${updated}/${affiliates.length} 件のバナーを更新`)
    console.log(`📄 ${AFFILIATES_PATH} に保存しました`)

  } finally {
    await browser.close()
  }
}

main().catch((e) => {
  console.error('❌ 予期しないエラー:', e)
  process.exit(1)
})
