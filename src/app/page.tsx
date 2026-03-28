import Shindan from '@/components/Shindan'
import HojokinCard from '@/components/HojokinCard'
import { allHojokin } from '@/data/hojokin/index'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <span className="font-bold text-xl text-blue-700">補助金ナビ</span>
            <span className="text-xs text-gray-400 ml-2">中小企業・個人事業主の補助金ガイド</span>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-blue-200 text-sm mb-3 font-medium">5問で簡単診断</p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            あなたの会社が使える<br />補助金がわかる
          </h1>
          <p className="text-blue-200 text-base max-w-xl mx-auto">
            業種・従業員数・目的を答えるだけ。AIが最適な補助金を即診断します。
            申請方法・不採択理由まで完全ガイド。
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 -mt-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">🤖</span>
            <h2 className="text-lg font-bold text-gray-800">AI補助金診断</h2>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">無料</span>
          </div>
          <Shindan />
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">主要補助金ガイド</h2>
        <p className="text-gray-500 text-sm mb-8">
          申請条件・不採択理由・採択のコツまで詳しく解説
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {allHojokin.map((h) => (
            <HojokinCard key={h.slug} h={h} />
          ))}
        </div>
      </section>

      <section className="bg-white border-t border-gray-200 py-12 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-3xl font-bold text-blue-700">4種類</p>
            <p className="text-sm text-gray-500 mt-1">主要補助金を完全解説</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-700">無料</p>
            <p className="text-sm text-gray-500 mt-1">AI診断・全情報閲覧</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-700">毎日</p>
            <p className="text-sm text-gray-500 mt-1">最新情報に自動更新</p>
          </div>
        </div>
      </section>

      <footer className="text-center text-xs text-gray-400 py-8">
        © 2026 補助金ナビ | 本サイトの情報は参考情報です。申請前に必ず公式サイトをご確認ください。
      </footer>
    </main>
  )
}
