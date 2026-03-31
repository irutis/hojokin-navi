import Shindan from '@/components/Shindan'
import HojokinCard from '@/components/HojokinCard'
import AffiliateBanners from '@/components/AffiliateBanners'
import AdUnit from '@/components/AdUnit'
import { allHojokin } from '@/data/hojokin/index'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <span className="font-bold text-xl text-blue-700 shrink-0">補助金申請ガイド</span>
          <nav className="hidden sm:flex items-center gap-1 text-sm">
            <Link href="/gyoshu" className="text-gray-600 hover:text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors font-medium">業種別</Link>
            <Link href="/research" className="text-gray-600 hover:text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors font-medium">採択率データ</Link>
            <Link href="/search" className="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-colors font-medium">全件検索</Link>
          </nav>
          <Link href="/search" className="sm:hidden text-sm bg-blue-600 text-white font-medium px-3 py-1.5 rounded-lg">検索</Link>
        </div>
      </header>

      <section className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-blue-200 text-sm mb-3 font-medium tracking-wide">5問で簡単診断・完全無料</p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
            あなたの会社が使える<br />補助金がわかる
          </h1>
          <p className="text-blue-200 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            業種・従業員数・目的を答えるだけ。AIが最適な補助金を即診断。
            申請方法・不採択理由まで完全ガイド。
          </p>
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-blue-200">
            <span>✓ 登録不要</span>
            <span>✓ 完全無料</span>
            <span>✓ 結果即表示</span>
          </div>
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

      {/* 補助金申請におすすめのツール（アフィリエイト） */}
      <section className="max-w-4xl mx-auto px-4 mt-10">
        <p className="text-xs text-gray-400 mb-3 font-medium uppercase tracking-wide">PR・スポンサー</p>
        <AffiliateBanners />
      </section>

      {/* 業種別ナビ */}
      <section className="max-w-4xl mx-auto px-4 mt-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">業種から探す</h2>
          <Link href="/gyoshu" className="text-sm text-blue-600 hover:underline">すべて見る →</Link>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {[
            { label: '製造業', icon: '🏭', slug: 'seizogyo' },
            { label: '飲食店', icon: '🍽️', slug: 'inshokuten' },
            { label: 'IT', icon: '💻', slug: 'it-joho' },
            { label: '建設業', icon: '🏗️', slug: 'kensetsu' },
            { label: '小売業', icon: '🏪', slug: 'oroshiuri-kouori' },
            { label: '医療介護', icon: '🏥', slug: 'iryo-kaigo' },
            { label: '農業', icon: '🌾', slug: 'norin-suisan' },
            { label: 'サービス', icon: '✂️', slug: 'service' },
          ].map((ind) => (
            <Link
              key={ind.slug}
              href={`/gyoshu/${ind.slug}`}
              className="flex flex-col items-center gap-1 bg-white border border-gray-200 rounded-xl py-3 px-1 hover:border-blue-400 hover:shadow-sm transition-all text-center"
            >
              <span className="text-2xl">{ind.icon}</span>
              <span className="text-xs text-gray-600 font-medium leading-tight">{ind.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 mt-8">
        <AdUnit slot="4567890123" format="horizontal" />
      </section>

      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-800">補助金・助成金ガイド</h2>
          <Link href="/research" className="text-sm text-blue-600 hover:underline">採択率データ →</Link>
        </div>
        <p className="text-gray-500 text-sm mb-6">
          申請条件・不採択理由・採択のコツまで詳しく解説（{allHojokin.length}種類）
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
            <p className="text-3xl font-bold text-blue-700">{allHojokin.length}種</p>
            <p className="text-sm text-gray-500 mt-1">補助金・助成金を完全解説</p>
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

      <footer className="bg-gray-800 text-gray-400 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-4 text-sm mb-4 justify-center">
            <Link href="/gyoshu" className="hover:text-white transition-colors">業種別補助金</Link>
            <Link href="/research" className="hover:text-white transition-colors">採択率データ</Link>
            <Link href="/search" className="hover:text-white transition-colors">全件検索</Link>
            <Link href="/about" className="hover:text-white transition-colors">運営者情報</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">プライバシーポリシー</Link>
          </div>
          <p className="text-center text-xs">
            © 2026 補助金申請ガイド ｜ 本サイトの情報は参考情報です。申請前に必ず公式サイトをご確認ください。
          </p>
        </div>
      </footer>
    </main>
  )
}
