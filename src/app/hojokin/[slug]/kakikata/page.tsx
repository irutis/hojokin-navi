import { notFound } from 'next/navigation'
import Link from 'next/link'
import { allHojokin, getHojokinBySlug } from '@/data/hojokin/index'
import type { Metadata } from 'next'

export function generateStaticParams() {
  return allHojokin.map((h) => ({ slug: h.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const h = getHojokinBySlug(slug)
  if (!h) return {}
  return {
    title: `${h.name}の申請書の書き方【採択率を上げる記載例】2026年版`,
    description: `${h.name}の申請書で審査員に刺さる書き方を徹底解説。採択された申請書の特徴・記載例・チェックリスト付き。不採択になりがちなNG表現も紹介。`,
  }
}

// 補助金ごとの申請書ガイドデータ
const kakikataData: Record<string, {
  overview: string
  keyPoints: { title: string; good: string; bad: string }[]
  checklist: string[]
  commonMistakes: { mistake: string; fix: string }[]
  affiliateText: string
  affiliatePlaceholder: string
}> = {
  'it-donyu': {
    overview: 'IT導入補助金の審査では「労働生産性の向上」が最重要評価軸です。具体的な数値目標と、なぜそのITツールが必要なのかの論理的な説明が採択の鍵です。',
    keyPoints: [
      {
        title: '労働生産性の向上目標',
        good: '現在、受発注管理に月40時間かけている。〇〇システム導入後は月10時間に削減（75%削減）し、その時間を営業活動に充てることで売上を年15%向上させる。',
        bad: '業務効率化により生産性が向上する見込みです。',
      },
      {
        title: '現状の課題の具体化',
        good: '現在Excelで在庫管理しており、月3〜4回の記入ミスが発生。先月は誤発注で30万円の損失が生じた。',
        bad: '業務が非効率で課題があります。',
      },
      {
        title: 'ITツール選定の理由',
        good: '3社比較検討の結果、〇〇を選定。自社の製造業特有の工程管理機能と、既存の会計ソフトとのAPI連携が決め手。',
        bad: '機能が豊富で使いやすいため選びました。',
      },
    ],
    checklist: [
      'gBizIDプライムを取得済みか（申請前必須）',
      'SECURITY ACTIONの宣言を完了しているか',
      '労働生産性の向上目標を具体的な数値で記載しているか',
      '交付決定前にツールの発注・契約・支払いをしていないか',
      'IT導入支援事業者と共同申請の準備ができているか',
      '3年間の事業計画（付加価値額・給与支給総額）を作成しているか',
    ],
    commonMistakes: [
      { mistake: '交付決定前にITツールを導入・支払いしてしまう', fix: '必ず「交付決定通知」を受け取ってから発注・契約する' },
      { mistake: 'gBizIDの取得が遅れて申請に間に合わない', fix: '申請を考えたらすぐgBizIDプライムを申請（取得まで2〜3週間）' },
      { mistake: '生産性目標が曖昧（「向上する予定」のみ）', fix: '「時間を○%削減」「売上を○%向上」など具体的な数値を必ず記載' },
    ],
    affiliateText: 'ITツール選びに迷ったら、freeeで会計・バックオフィスを一括デジタル化',
    affiliatePlaceholder: 'AFFILIATE_FREEE',
  },
  'monozukuri': {
    overview: 'ものづくり補助金の審査では「革新性」と「付加価値額の増加計画」が最重要です。既存製品・サービスの単なる改良ではなく、明確な革新性を示すことが採択の条件です。',
    keyPoints: [
      {
        title: '革新性の記載',
        good: '従来の手作業による溶接工程を、当社独自開発のロボットアームと連携させることで、業界初の完全自動化ラインを実現。現状比で不良品率を8%から0.5%以下に削減する。',
        bad: '最新の設備を導入して品質向上を目指します。',
      },
      {
        title: '付加価値額の計算',
        good: '3年後の付加価値額：売上高3億円×（1-原材料費率60%-外注費率10%）= 9,000万円。補助事業前比で年率3%以上増加。',
        bad: '売上が向上し付加価値が増加する見込みです。',
      },
      {
        title: '市場・競合分析',
        good: '対象市場は国内自動車部品市場（年間2兆円規模）。主要競合3社はすべて手作業工程を維持しており、自動化による価格競争力は差別化の核となる。',
        bad: '市場は拡大傾向にあり、需要があります。',
      },
    ],
    checklist: [
      '革新性が明確に記載されているか（単なる設備更新ではないか）',
      '付加価値額の計算式と根拠を記載しているか',
      '3〜5年の事業計画数値（売上・利益・付加価値額）があるか',
      '認定経営革新等支援機関の確認を受けているか',
      '交付決定前に設備の発注・契約をしていないか',
      '競合との差別化が具体的に記載されているか',
    ],
    commonMistakes: [
      { mistake: '「設備の更新・老朽化対応」として申請してしまう', fix: '革新性が必須。「新工法の採用」「新製品の開発」など変革要素を前面に出す' },
      { mistake: '付加価値額の目標が根拠なく記載されている', fix: '計算式（売上-原材料費-外注費等）を明示し、その根拠となる受注見込みを記載' },
      { mistake: '認定支援機関の確認が間に合わない', fix: '申請締切の1ヶ月前には認定支援機関に相談を開始する' },
    ],
    affiliateText: '認定支援機関・専門家への無料相談はミツモアで',
    affiliatePlaceholder: 'AFFILIATE_MITSUMOA',
  },
}

// デフォルトデータ（個別データがない補助金用）
function getDefaultData(name: string) {
  return {
    overview: `${name}の申請書では、具体的な数値目標と現状の課題を明確に記載することが採択の鍵です。審査員は毎年数百件の申請書を審査するため、一目で要点が伝わる構成が重要です。`,
    keyPoints: [
      {
        title: '現状の課題を数値で示す',
        good: '現在〇〇作業に月△時間かかっており、年間□円のコストが発生している。この課題を解決するため...',
        bad: '業務が非効率で課題があります。改善が必要です。',
      },
      {
        title: '目標を具体的な数値で記載',
        good: '補助事業実施後3年で、売上高を現在比20%増（○億円→○億円）、付加価値額を年率3%以上増加させる。',
        bad: '売上向上と付加価値の増加を目指します。',
      },
      {
        title: '実現可能性の根拠を示す',
        good: '既に○社からの引き合いがあり、導入後3ヶ月での受注見込みは○件（見積書添付）。',
        bad: '市場ニーズがあると判断しています。',
      },
    ],
    checklist: [
      '申請要件をすべて満たしているか確認したか',
      '数値目標（売上・付加価値額等）を具体的に記載しているか',
      '現状の課題を定量的に示しているか',
      '交付決定前に発注・契約・支払いをしていないか',
      '必要書類がすべて揃っているか',
      '認定支援機関等の確認が必要な場合、手配しているか',
    ],
    commonMistakes: [
      { mistake: '目標が抽象的（「向上する」「改善する」のみ）', fix: '必ず数値（%・円・時間）で記載する' },
      { mistake: '交付決定前に事業を開始してしまう', fix: '必ず交付決定通知を受け取ってから発注・着手する' },
      { mistake: '申請直前に相談・準備を始める', fix: '申請締切の2〜3ヶ月前から準備を開始する' },
    ],
    affiliateText: '申請書作成を専門家にサポートしてもらう',
    affiliatePlaceholder: 'AFFILIATE_GENERAL',
  }
}

export default async function KakikataPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const h = getHojokinBySlug(slug)
  if (!h) notFound()

  const data = kakikataData[slug] ?? getDefaultData(h.name)

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/" className="text-blue-700 font-bold text-lg">補助金申請ガイド</Link>
          <span className="text-gray-400 mx-2">/</span>
          <Link href={`/hojokin/${slug}`} className="text-gray-600 text-sm hover:underline">{h.name}</Link>
          <span className="text-gray-400 mx-2">/</span>
          <span className="text-gray-600 text-sm">申請書の書き方</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 mb-6">
          <span className="text-xs bg-orange-100 text-orange-700 font-medium px-2 py-1 rounded-full">申請書ガイド</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-3 mb-3">
            {h.name}の申請書の書き方
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed">{data.overview}</p>
        </div>

        {/* 審査員に刺さる書き方 */}
        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">審査員に刺さる書き方：良い例・悪い例</h2>
          <div className="space-y-4">
            {data.keyPoints.map((point, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4">ポイント{i + 1}：{point.title}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <p className="text-xs font-bold text-green-700 mb-2">✅ 採択される書き方</p>
                    <p className="text-sm text-gray-700 leading-relaxed">「{point.good}」</p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                    <p className="text-xs font-bold text-red-600 mb-2">❌ 落とされる書き方</p>
                    <p className="text-sm text-gray-700 leading-relaxed">「{point.bad}」</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* よくある失敗と対策 */}
        <section className="bg-red-50 rounded-2xl p-6 border border-red-100 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">⚠️ よくある失敗と対策</h2>
          <div className="space-y-4">
            {data.commonMistakes.map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-red-100">
                <p className="text-sm font-bold text-red-600 mb-1">❌ {item.mistake}</p>
                <p className="text-sm text-gray-700">→ {item.fix}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 申請前チェックリスト */}
        <section className="bg-blue-50 rounded-2xl p-6 border border-blue-100 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">📋 申請前チェックリスト</h2>
          <p className="text-xs text-gray-500 mb-4">提出前に全項目を確認してください</p>
          <ul className="space-y-3">
            {data.checklist.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                <span className="shrink-0 w-5 h-5 border-2 border-blue-400 rounded mt-0.5"></span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <section className="bg-blue-700 rounded-2xl p-6 text-white text-center mb-6">
          <h2 className="font-bold text-lg mb-2">申請書の作成でお困りですか？</h2>
          <p className="text-blue-200 text-sm mb-4">専門家に依頼することで採択率が大幅に向上します。まずは無料相談から。</p>
          <a
            href="#"
            className="inline-block bg-white text-blue-700 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors"
          >
            {data.affiliateText}
          </a>
        </section>

        <div className="flex gap-4 justify-center">
          <Link href={`/hojokin/${slug}`} className="text-blue-600 text-sm hover:underline">
            ← {h.name}の基本情報に戻る
          </Link>
          <Link href="/" className="text-blue-600 text-sm hover:underline">
            AI診断を受ける →
          </Link>
        </div>
      </div>
    </main>
  )
}
