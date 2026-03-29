import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'プライバシーポリシー｜補助金申請ガイド',
  description: '補助金申請ガイドのプライバシーポリシーです。',
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">プライバシーポリシー</h1>

        <div className="bg-white rounded-2xl p-6 space-y-6 text-sm text-gray-700 leading-relaxed">

          <section>
            <h2 className="font-bold text-base text-gray-800 mb-2">個人情報の取り扱いについて</h2>
            <p>補助金申請ガイド（以下「当サイト」）は、ユーザーのプライバシーを尊重し、個人情報の保護に努めます。当サイトは、補助金・助成金に関する情報提供を目的としており、ユーザーから個人情報を収集する機能は設けておりません。</p>
          </section>

          <section>
            <h2 className="font-bold text-base text-gray-800 mb-2">アクセス解析ツールについて</h2>
            <p>当サイトでは、Googleによるアクセス解析ツール「Googleアナリティクス」を使用しています。このGoogleアナリティクスはCookieを使用してデータを収集しており、収集するデータは匿名であり、個人を特定するものではありません。詳細は<a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Googleのプライバシーポリシー</a>をご確認ください。</p>
          </section>

          <section>
            <h2 className="font-bold text-base text-gray-800 mb-2">広告について</h2>
            <p>当サイトでは、Google AdSenseおよびA8.netの広告を掲載しています。これらの広告配信にあたり、Cookieを使用してユーザーの興味に応じた広告が表示される場合があります。Cookieを無効にする方法やGoogleアドセンスに関する詳細は<a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">こちら</a>をご確認ください。</p>
          </section>

          <section>
            <h2 className="font-bold text-base text-gray-800 mb-2">免責事項</h2>
            <p>当サイトの情報は可能な限り正確な情報を掲載するよう努めておりますが、内容の正確性・安全性・有用性を保証するものではありません。補助金の申請にあたっては、必ず公式情報をご確認ください。当サイトの情報を利用したことで生じた損害について、当サイトは一切の責任を負いません。</p>
          </section>

          <section>
            <h2 className="font-bold text-base text-gray-800 mb-2">著作権</h2>
            <p>当サイトに掲載されているコンテンツの著作権は当サイト運営者に帰属します。無断転載・複製を禁じます。</p>
          </section>

          <section>
            <h2 className="font-bold text-base text-gray-800 mb-2">プライバシーポリシーの変更</h2>
            <p>本ポリシーの内容は、必要に応じて変更することがあります。変更後のプライバシーポリシーは当ページに掲載した時点で効力を生じます。</p>
          </section>

          <p className="text-gray-400 text-xs pt-4 border-t border-gray-100">最終更新日：2026年3月29日</p>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-blue-600 hover:underline">← トップページへ戻る</Link>
        </div>
      </div>
    </main>
  )
}
