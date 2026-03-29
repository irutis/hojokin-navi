import affiliatesData from '@/data/affiliates.json'

type Affiliate = {
  id: string
  name: string
  description: string
  color: string
  banner_html: string
  fallback_url: string
}

const ICON_MAP: Record<string, string> = {
  'freee-kaikei': '💚',
  'moneyforward-cloud': '💙',
  'moneyforward-kaishaseturitu': '🏢',
}

const COLOR_MAP: Record<string, { gradient: string; text: string; button: string }> = {
  green:  { gradient: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700', text: 'text-green-100', button: 'text-green-600' },
  blue:   { gradient: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',     text: 'text-blue-100',  button: 'text-blue-600'  },
  purple: { gradient: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700', text: 'text-purple-100', button: 'text-purple-600' },
}

function FallbackBanner({ affiliate }: { affiliate: Affiliate }) {
  const colors = COLOR_MAP[affiliate.color] ?? COLOR_MAP.blue
  const icon = ICON_MAP[affiliate.id] ?? '📦'

  return (
    <a
      href={affiliate.fallback_url}
      rel="nofollow noopener noreferrer"
      target="_blank"
      className={`flex flex-col items-center justify-center gap-3 bg-gradient-to-br ${colors.gradient} rounded-2xl p-5 transition-all shadow-md hover:shadow-lg active:scale-[0.99]`}
      style={{ width: 300, height: 250 }}
    >
      <div className="bg-white rounded-2xl w-16 h-16 flex items-center justify-center shadow-sm">
        <span className="text-3xl">{icon}</span>
      </div>
      <div className="text-center">
        <p className="font-bold text-white text-base leading-tight">{affiliate.name}</p>
        <p className={`${colors.text} text-xs mt-1`}>{affiliate.description}</p>
      </div>
      <div className={`bg-white ${colors.button} font-bold text-sm px-6 py-2 rounded-xl shadow-sm`}>
        無料で試す →
      </div>
    </a>
  )
}

export default function AffiliateBanners() {
  const affiliates = affiliatesData as Affiliate[]

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-gray-400 font-medium">申請サポートツール</span>
        <span className="text-[10px] text-gray-400 border border-gray-300 rounded px-1 py-0.5 leading-none">PR</span>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1" style={{ scrollSnapType: 'x mandatory' }}>
        {affiliates.map((affiliate) =>
          affiliate.banner_html ? (
            <div
              key={affiliate.id}
              className="overflow-hidden rounded-2xl shadow-md border border-gray-100 shrink-0"
              style={{ width: 300, height: 250, scrollSnapAlign: 'start' }}
              dangerouslySetInnerHTML={{ __html: affiliate.banner_html }}
            />
          ) : (
            <div key={affiliate.id} className="shrink-0" style={{ scrollSnapAlign: 'start' }}>
              <FallbackBanner affiliate={affiliate} />
            </div>
          )
        )}
      </div>
    </div>
  )
}
