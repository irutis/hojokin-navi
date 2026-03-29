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

const EMAIL = process.env.A8_EMAIL
const PASSWORD = process.env.A8_PASSWORD

if (!EMAIL || !PASSWORD) {
  console.error('❌ A8_EMAIL と A8_PASSWORD を設定してください')
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
    await page.goto('https://www.a8.net/a8v2/authManualLogin.f4d', { waitUntil: 'domcontentloaded', timeout: 60000 })
    await page.waitForTimeout(3000)

    // デバッグ用: ページHTMLのform要素を確認
    const formHtml = await page.evaluate(() => {
      const inputs = document.querySelectorAll('input')
      return Array.from(inputs).map(el => `name="${el.name}" type="${el.type}" id="${el.id}"`).join('\n')
    })
    console.log('フォーム要素:\n', formHtml)

    // 複数のセレクタを試みる
    const emailSelectors = [
      'input[name="login_id"]',
      'input[name="loginId"]',
      'input[name="email"]',
      'input[name="mail"]',
      'input[type="email"]',
      'input[name="id"]',
      '#login_id',
      '#loginId',
      '#email',
    ]
    const passwordSelectors = [
      'input[name="password"]',
      'input[name="passwd"]',
      'input[name="pass"]',
      'input[type="password"]',
      '#password',
      '#passwd',
    ]

    let emailFilled = false
    for (const sel of emailSelectors) {
      const el = await page.locator(sel).first()
      if (await el.count() > 0) {
        await el.fill(EMAIL)
        console.log(`✅ メール入力: ${sel}`)
        emailFilled = true
        break
      }
    }
    if (!emailFilled) {
      await page.screenshot({ path: '/tmp/a8-login-debug.png' })
      console.error('❌ メール入力欄が見つかりません')
      process.exit(1)
    }

    let passFilled = false
    for (const sel of passwordSelectors) {
      const el = await page.locator(sel).first()
      if (await el.count() > 0) {
        await el.fill(PASSWORD)
        console.log(`✅ パスワード入力: ${sel}`)
        passFilled = true
        break
      }
    }
    if (!passFilled) {
      console.error('❌ パスワード入力欄が見つかりません')
      process.exit(1)
    }

    await page.click('input[type="submit"], button[type="submit"]')
    await page.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 }).catch(() => {})

    const currentUrl = page.url()
    console.log('遷移先URL:', currentUrl)
    if (currentUrl.includes('authManualLogin') || currentUrl.includes('login')) {
      console.error('❌ ログイン失敗。認証情報を確認してください')
      process.exit(1)
    }
    console.log('✅ ログイン成功')

    // ─── 参加中プログラム一覧 ───
    await page.goto('https://www.a8.net/a8v2/siteProgram.f4d?action=list&status=2', { waitUntil: 'networkidle' })

    let updated = 0

    for (const affiliate of affiliates) {
      console.log(`\n🔍 ${affiliate.name} のバナーを検索中...`)

      try {
        // プログラム名でリンクを探す
        const programLink = await page.locator(`a:has-text("${affiliate.program_name_keyword}")`).first()
        const exists = await programLink.count() > 0

        if (!exists) {
          // 検索でも試みる
          await page.goto(
            `https://www.a8.net/a8v2/siteProgram.f4d?action=list&status=2&keyword=${encodeURIComponent(affiliate.program_name_keyword)}`,
            { waitUntil: 'networkidle' }
          )
        }

        // プログラムページへ移動
        const link = await page.locator(`a:has-text("${affiliate.program_name_keyword}")`).first()
        if (await link.count() === 0) {
          console.warn(`⚠️ ${affiliate.name} が見つかりませんでした`)
          continue
        }

        // 広告素材ページへ
        const href = await link.getAttribute('href')
        const programId = href?.match(/program_id=(\d+)/)?.[1] || href?.match(/pid=(\d+)/)?.[1]

        if (!programId) {
          // プログラムページを開いて素材リンクを探す
          await link.click()
          await page.waitForNavigation({ waitUntil: 'networkidle' }).catch(() => {})
          const materialLink = await page.locator('a:has-text("広告素材"), a:has-text("バナー"), a[href*="material"]').first()
          if (await materialLink.count() > 0) {
            await materialLink.click()
            await page.waitForNavigation({ waitUntil: 'networkidle' }).catch(() => {})
          }
        } else {
          await page.goto(
            `https://www.a8.net/a8v2/siteProgramBanner.f4d?program_id=${programId}`,
            { waitUntil: 'networkidle' }
          )
        }

        // バナーHTMLを取得
        let bannerHtml = ''

        for (const size of PREFERRED_SIZES) {
          const [width, height] = size.split('x')

          // テキストエリアやコードブロックからHTMLを探す
          const codeBlocks = await page.locator('textarea, .banner-code, input[type="text"][value*="a8.net"]').all()

          for (const block of codeBlocks) {
            const val = await block.inputValue().catch(() => '') || await block.textContent().catch(() => '') || ''
            if (val.includes(`width="${width}"`) && val.includes(`height="${height}"`)) {
              bannerHtml = val.trim()
              break
            }
            // widthxheight形式
            if (val.includes(`${width}x${height}`) || val.includes(`${width}×${height}`)) {
              bannerHtml = val.trim()
              break
            }
          }

          if (bannerHtml) {
            console.log(`  ✅ ${size} バナーを取得`)
            break
          }
        }

        if (!bannerHtml) {
          // img タグから直接取得を試みる
          const imgs = await page.locator('img[src*="a8.net"]').all()
          for (const img of imgs) {
            const src = await img.getAttribute('src') || ''
            const w = await img.getAttribute('width') || ''
            const h = await img.getAttribute('height') || ''

            for (const size of PREFERRED_SIZES) {
              const [pw, ph] = size.split('x')
              if (w === pw && h === ph) {
                const parentA = await img.locator('xpath=..').first()
                const parentTag = await parentA.evaluate((el) => el.tagName.toLowerCase())
                if (parentTag === 'a') {
                  bannerHtml = await parentA.evaluate((el) => el.outerHTML)
                  console.log(`  ✅ imgから ${size} バナーを取得`)
                  break
                }
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

      // 参加中プログラム一覧に戻る
      await page.goto('https://www.a8.net/a8v2/siteProgram.f4d?action=list&status=2', { waitUntil: 'networkidle' }).catch(() => {})
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
