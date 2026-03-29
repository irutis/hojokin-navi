import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '運営者情報・お問い合わせ｜補助金申請ガイド',
  description: '補助金申請ガイドの運営者情報およびお問い合わせページです。',
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">運営者情報</h1>

        <div className="bg-white rounded-2xl p-6 space-y-6 text-sm text-gray-700">

          <table className="w-full">
            <tbody className="divide-y divide-gray-100">
              <tr className="py-3">
                <td className="py-3 pr-4 font-medium text-gray-500 w-32 shrink-0">サイト名</td>
                <td className="py-3">補助金申請ガイド</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium text-gray-500">URL</td>
                <td className="py-3">https://hojokin-navi-eta.vercel.app</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium text-gray-500">運営者</td>
                <td className="py-3">SOURO（創路）</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium text-gray-500">所在地</td>
                <td className="py-3">京都府京都市</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium text-gray-500">設立</td>
                <td className="py-3">2025年</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium text-gray-500">事業内容</td>
                <td className="py-3">AI・Webサービスの開発・運営</td>
              </tr>
            </tbody>
          </table>

          <section className="pt-2">
            <h2 className="font-bold text-base text-gray-800 mb-3">サイトについて</h2>
            <p className="leading-relaxed">
              補助金申請ガイドは、中小企業・個人事業主の方が補助金・助成金をスムーズに活用できるよう、AI診断・申請ガイド・不採択事例などの情報を無料で提供するサービスです。
            </p>
          </section>

          <section>
            <h2 className="font-bold text-base text-gray-800 mb-3">お問い合わせ</h2>
            <p className="leading-relaxed mb-3">
              サイトに関するご意見・ご要望・誤情報のご指摘はメールにてお受けしております。
            </p>
            <a
              href="mailto:contact@souro.jp"
              className="inline-block bg-blue-600 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors text-sm"
            >
              メールで問い合わせる
            </a>
          </section>

          <section className="text-xs text-gray-400 pt-4 border-t border-gray-100 leading-relaxed">
            <p>当サイトに掲載している補助金情報は公開情報をもとに作成しておりますが、内容の正確性・最新性を保証するものではありません。申請の際は必ず各補助金の公式ページをご確認ください。</p>
          </section>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-blue-600 hover:underline">← トップページへ戻る</Link>
        </div>
      </div>
    </main>
  )
}
