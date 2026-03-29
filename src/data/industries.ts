export type Industry = {
  slug: string
  name: string
  description: string
  icon: string
  recommended_slugs: string[]
  tips: string[]
  monthly_searches: number
}

export const industries: Industry[] = [
  {
    slug: 'seizogyo',
    name: '製造業',
    description: '設備投資・研究開発・省エネ改修など、製造業向けの補助金が充実しています。ものづくり補助金は製造業が最も使いやすい補助金の一つです。',
    icon: '🏭',
    recommended_slugs: ['monozukuri', 'shoene-setsubi', 'shoene-shift', 'go-tech', 'it-donyu', 'innovation-souzou'],
    tips: [
      'ものづくり補助金は製造業が最も採択されやすい補助金。設備投資前に必ず確認する',
      '省エネ補助金（SHIFT事業）は大型設備更新時にセットで申請できる',
      'Go-Tech事業（産学連携）は大学と連携した研究開発に最大1億円',
      '複数の補助金を組み合わせることで自己負担を大幅に減らせる',
    ],
    monthly_searches: 45000,
  },
  {
    slug: 'inshokuten',
    name: '飲食店・飲食業',
    description: '持続化補助金・IT導入補助金が飲食店と相性が良く、POSシステム導入・販路開拓・店舗改装などに活用できます。',
    icon: '🍽️',
    recommended_slugs: ['jizokuka', 'it-donyu', 'shorikika', 'career-up', 'hatarakikata'],
    tips: [
      '持続化補助金でテイクアウト対応・メニュー開発・SNS集客費用を補助できる',
      'IT導入補助金でPOSレジ・予約システム・デリバリー連携ツールを導入できる',
      '従業員をパートから正社員化するとキャリアアップ助成金が使える（1人最大57万円）',
      '食品衛生法・HACCPの設備投資は補助対象になる場合がある',
    ],
    monthly_searches: 38000,
  },
  {
    slug: 'it-joho',
    name: 'IT・情報通信業',
    description: 'ソフトウェア開発・SaaS・AI関連の事業に活用できる補助金。事業再構築補助金・ものづくり補助金・イノベーション補助金が対象になりやすいです。',
    icon: '💻',
    recommended_slugs: ['it-donyu', 'innovation-souzou', 'jigyou-saikouchiku', 'go-tech', 'sogyou'],
    tips: [
      'ものづくり補助金はIT企業も対象。業務システム・AIツール開発に使える',
      'イノベーション創出補助金は技術的な革新性があるサービス開発に向く',
      '創業補助金はスタートアップの初期費用（人件費・外注費等）を補助',
      '電子インボイス補助金で会計・請求書システムの導入コストを抑えられる',
    ],
    monthly_searches: 28000,
  },
  {
    slug: 'kensetsu',
    name: '建設業',
    description: '建設業向けには省力化補助金・IT導入補助金・ものづくり補助金が活用できます。ICT施工・BIM/CIM導入費用も補助対象になります。',
    icon: '🏗️',
    recommended_slugs: ['shorikika', 'it-donyu', 'monozukuri', 'shoene-setsubi', 'career-up'],
    tips: [
      '省力化投資補助金で建設機械・ICT機器の導入費を補助できる',
      'IT導入補助金でBIM/CIM・工程管理ソフト・安全管理システムを導入できる',
      '働き方改革推進支援助成金で時間外労働削減の取組費用を補助できる',
      '週休2日制導入に向けた取組は複数の助成金が使える',
    ],
    monthly_searches: 32000,
  },
  {
    slug: 'oroshiuri-kouori',
    name: '卸売業・小売業',
    description: 'EC構築・在庫管理システム・店舗改装など、卸売・小売業向けの補助金。持続化補助金・IT導入補助金が特に使いやすいです。',
    icon: '🏪',
    recommended_slugs: ['jizokuka', 'it-donyu', 'shorikika', 'jigyou-saikouchiku', 'career-up'],
    tips: [
      '持続化補助金でECサイト構築・チラシ制作・展示会出展費用を補助できる',
      'IT導入補助金でPOS・在庫管理・受発注システムを導入できる',
      '省力化投資補助金で自動搬送ロボット・自動発注システムを導入できる',
      '事業再構築補助金でEC事業・新業態への転換に最大7,000万円',
    ],
    monthly_searches: 25000,
  },
  {
    slug: 'iryo-kaigo',
    name: '医療・介護・福祉',
    description: '介護ロボット・電子カルテ・業務効率化ツールの導入に使える補助金。IT導入補助金・省力化投資補助金・キャリアアップ助成金が主な対象です。',
    icon: '🏥',
    recommended_slugs: ['shorikika', 'it-donyu', 'career-up', 'hatarakikata', 'jinzai-kakuho'],
    tips: [
      '省力化投資補助金で介護ロボット・移乗支援機器の導入費を補助できる',
      'IT導入補助金で電子カルテ・介護記録システムを導入できる',
      'キャリアアップ助成金で非常勤スタッフの正社員化に助成金が出る',
      '人材確保等支援助成金で職員の定着・採用改善の取組を支援',
    ],
    monthly_searches: 20000,
  },
  {
    slug: 'norin-suisan',
    name: '農業・林業・水産業',
    description: '農業次世代人材投資資金・強い農業補助金・スマート農業補助金など、農林水産業向けの支援制度が充実しています。',
    icon: '🌾',
    recommended_slugs: ['chiiki-mirai', 'it-donyu', 'shoene-setsubi', 'joshi-kigyoka'],
    tips: [
      '農業次世代人材投資資金（就農給付金）は50歳未満の新規就農者に年間最大150万円',
      'スマート農業実証プロジェクトでドローン・IoTセンサー導入費を補助',
      '強い農業・担い手づくり総合支援交付金で農業機械・施設整備を支援',
      '地域おこし協力隊と連携した6次産業化事業は地域活性化補助金が使える',
    ],
    monthly_searches: 18000,
  },
  {
    slug: 'service',
    name: 'サービス業（美容・整体・士業等）',
    description: '個人事業主・小規模事業者向けには持続化補助金・IT導入補助金が特に使いやすいです。美容室・整体院・税理士事務所など幅広く対象です。',
    icon: '✂️',
    recommended_slugs: ['jizokuka', 'it-donyu', 'denshi-invoice', 'career-up', 'sogyou'],
    tips: [
      '持続化補助金でホームページ制作・チラシ・SNS広告費用を補助できる（上限200万円）',
      'IT導入補助金で予約システム・顧客管理ツール・会計ソフトを導入できる',
      '電子インボイス補助金でインボイス対応の会計ソフト導入費用を補助',
      'フリーランス・個人事業主でも申請できる補助金が増加している',
    ],
    monthly_searches: 35000,
  },
]

export function getIndustryBySlug(slug: string): Industry | undefined {
  return industries.find((i) => i.slug === slug)
}
