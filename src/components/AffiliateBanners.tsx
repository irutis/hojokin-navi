import affiliatesData from '@/data/affiliates.json'

type Affiliate = {
  id: string
  name: string
  description: string
  color: string
  banner_html: string
  fallback_url: string
}

const COLOR_MAP: Record<string, { gradient: string; text: string; button: string }> = {
  green:  { gradient: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700', text: 'text-green-100', button: 'text-green-600' },
  blue:   { gradient: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',     text: 'text-blue-100',  button: 'text-blue-600'  },
  purple: { gradient: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700', text: 'text-purple-100', button: 'text-purple-600' },
}

const ICON_MAP: Record<string, string> = {
  'freee-kaikei': '💚',
  'moneyforward-cloud': '💙',
  'moneyforward-kaishaseturitu': '🏢',
}

function FallbackBanner({ affiliate }: { affiliate: Affiliate }) {
  const colors = COLOR_MAP[affiliate.color] ?? COLOR_MAP.blue
  const icon = ICON_MAP[affiliate.id] ?? '📦'

  return (
    <a
      href={affiliate.fallback_url}
      rel="nofollow noopener noreferrer"
      target="_blank"
      className={`flex items-center gap-4 bg-gradient-to-r ${colors.gradient} rounded-2xl px-5 py-4 transition-all shadow-md hover:shadow-lg active:scale-[0.99]`}
    >
      <div className="bg-white rounded-xl w-12 h-12 flex items-center justify-center shrink-0 shadow-sm">
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-white text-base leading-tight">{affiliate.name}</p>
        <p className={`${colors.text} text-xs mt-0.5`}>{affiliate.description}</p>
      </div>
      <div className={`bg-white ${colors.button} font-bold text-sm px-4 py-2 rounded-xl shrink-0 shadow-sm`}>
        無料で試す →
      </div>
    </a>
  )
}

export default function AffiliateBanners() {
  const affiliates = affiliatesData as Affiliate[]

  return (
    <div className="space-y-3">
      {affiliates.map((affiliate) =>
        affiliate.banner_html ? (
          <div
            key={affiliate.id}
            className="w-full overflow-hidden rounded-2xl shadow-md"
            dangerouslySetInnerHTML={{ __html: affiliate.banner_html }}
          />
        ) : (
          <FallbackBanner key={affiliate.id} affiliate={affiliate} />
        )
      )}
    </div>
  )
}
