import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { PREFECTURES, getPrefectureBySlug } from '@/data/prefectures'

export async function generateStaticParams() {
  return PREFECTURES.map(p => ({ prefecture: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ prefecture: string }> }): Promise<Metadata> {
  const { prefecture } = await params
  const pref = getPrefectureBySlug(prefecture)
  if (!pref) return {}
  return {
    title: `${pref.name}の補助金一覧｜中小企業・個人事業主が使える補助金2026年版`,
    description: `${pref.name}の中小企業・個人事業主が申請できる補助金を一覧で解説。IT導入補助金・ものづくり補助金・小規模事業者持続化補助金など${pref.capital}の相談窓口情報も掲載。`,
  }
}

const HOJOKIN_LIST = [
  {
    name: 'IT導入補助金',
    max: '最大450万円',
    target: 'ITツール・ソフトウェア導入',
    deadline: '2026年度公募中',
    color: '#1a3a6b',
    bg: '#eff4fb',
  },
  {
    name: 'ものづくり補助金',
    max: '最大1,250万円',
    target: '設備投資・システム構築',
    deadline: '随時公募中',
    color: '#1a5c2e',
    bg: '#f0f7f2',
  },
  {
    name: '小規模事業者持続化補助金',
    max: '最大200万円',
    target: '販路開拓・マーケティング',
    deadline: '年4回公募',
    color: '#7a4200',
    bg: '#fdf5eb',
  },
  {
    name: '事業再構築補助金',
    max: '最大1.5億円',
    target: '新事業展開・業態転換',
    deadline: '要確認',
    color: '#5a1a6b',
    bg: '#f5f0fb',
  },
  {
    name: '省力化投資補助金',
    max: '最大1,500万円',
    target: 'ロボット・AI・自動化設備',
    deadline: '2026年度公募中',
    color: '#1a5c5c',
    bg: '#f0fafa',
  },
]

export default async function HojokinPrefecturePage({ params }: { params: Promise<{ prefecture: string }> }) {
  const { prefecture } = await params
  const pref = getPrefectureBySlug(prefecture)
  if (!pref) notFound()

  return (
    <div className="min-h-screen" style={{ background: '#f8f7f4' }}>
      <header style={{ background: '#1a3a6b' }}>
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3 flex-wrap">
          <Link href="/" style={{ color: '#a8c4e8', fontSize: 14, textDecoration: 'none' }}>ホーム</Link>
          <span style={{ color: '#a8c4e8' }}>›</span>
          <span style={{ color: 'white', fontSize: 14 }}>{pref.name}の補助金</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <span style={{ background: '#eff4fb', color: '#1a3a6b', border: '1px solid #1a3a6b', fontSize: 13, fontWeight: 700, padding: '4px 12px', borderRadius: 20, display: 'inline-block', marginBottom: 12 }}>
          💰 補助金・{pref.region}地方
        </span>

        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1a1a1a', lineHeight: 1.45, marginBottom: 12 }}>
          {pref.name}の補助金一覧【2026年最新】
        </h1>
        <p style={{ color: '#555', fontSize: 16, marginBottom: 8, lineHeight: 1.7 }}>
          {pref.name}の中小企業・個人事業主が申請できる主要補助金をまとめました。{pref.capital}の相談窓口情報もあわせて掲載しています。
        </p>
        <p style={{ color: '#999', fontSize: 13, marginBottom: 32 }}>更新日：2026年3月</p>

        {/* 補助金リスト */}
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a', borderLeft: '4px solid #1a3a6b', paddingLeft: 14, marginBottom: 20 }}>
          {pref.name}で使える主要補助金
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 40 }}>
          {HOJOKIN_LIST.map((h, i) => (
            <div key={i} style={{ background: h.bg, border: `1px solid ${h.color}`, borderRadius: 14, padding: '18px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 18, color: h.color, marginBottom: 6 }}>{h.name}</p>
                  <p style={{ fontSize: 14, color: '#555', marginBottom: 4 }}>対象：{h.target}</p>
                  <p style={{ fontSize: 13, color: '#888' }}>公募状況：{h.deadline}</p>
                </div>
                <span style={{ background: h.color, color: 'white', fontWeight: 700, fontSize: 15, padding: '6px 14px', borderRadius: 20, whiteSpace: 'nowrap' }}>
                  {h.max}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* AI診断CTA */}
        <div style={{ background: '#1a3a6b', borderRadius: 16, padding: '24px', marginBottom: 40, textAlign: 'center' }}>
          <p style={{ color: 'white', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
            {pref.name}の事業者向け：5問でわかる補助金診断
          </p>
          <p style={{ color: '#a8c4e8', fontSize: 14, marginBottom: 18 }}>
            業種・従業員数・目的を答えるだけ。AIがあなたに最適な補助金を提案します。
          </p>
          <Link href="/" style={{ display: 'inline-block', background: 'white', color: '#1a3a6b', fontWeight: 700, fontSize: 16, padding: '14px 32px', borderRadius: 12, textDecoration: 'none' }}>
            無料で補助金を診断する →
          </Link>
        </div>

        {/* 相談窓口 */}
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a', borderLeft: '4px solid #1a3a6b', paddingLeft: 14, marginBottom: 16 }}>
          {pref.name}の補助金相談窓口
        </h2>
        <div style={{ background: 'white', border: '1px solid #ddd', borderRadius: 14, padding: '20px', marginBottom: 40 }}>
          <p style={{ fontSize: 16, lineHeight: 1.9, color: '#333' }}>
            <strong>{pref.capital}商工会議所</strong>：補助金の無料相談・申請サポートを行っています。<br />
            <strong>{pref.name}よろず支援拠点</strong>：中小企業・小規模事業者向けの無料経営相談。補助金申請のアドバイスも対応。<br />
            <strong>中小企業基盤整備機構 {pref.region}本部</strong>：補助金・助成金の情報提供・申請相談。
          </p>
        </div>

        {/* 他都道府県 */}
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>他の都道府県の補助金情報</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {PREFECTURES.filter(p => p.slug !== pref.slug).slice(0, 16).map(p => (
            <Link key={p.slug} href={`/hojokin/pref/${p.slug}`} style={{ background: 'white', border: '1px solid #b0c8e8', borderRadius: 8, padding: '6px 12px', fontSize: 14, color: '#1a3a6b', textDecoration: 'none', fontWeight: 600 }}>
              {p.name}
            </Link>
          ))}
        </div>
      </div>

      <footer className="mt-12 py-8 px-4" style={{ background: '#222' }}>
        <div className="max-w-3xl mx-auto text-center">
          <Link href="/" style={{ color: '#aaa', fontSize: 14, textDecoration: 'none' }}>← トップへ戻る</Link>
          <p style={{ color: '#777', fontSize: 12, marginTop: 12 }}>© 2026 補助金申請ガイド</p>
        </div>
      </footer>
    </div>
  )
}
