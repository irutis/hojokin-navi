import affiliatesData from '@/data/affiliates.json'

type Affiliate = {
  id: string
  name: string
  description: string
  color: string
  fallback_url: string
}

const ICON_MAP: Record<string, string> = {
  'freee-kaikei': '💚',
  'moneyforward-cloud': '💙',
  'moneyforward-kaishaseturitu': '🏢',
}

const COLOR_MAP: Record<string, { dot: string; badge: string }> = {
  green:  { dot: 'bg-green-500', badge: 'text-green-700 bg-green-50 border-green-200' },
  blue:   { dot: 'bg-blue-500',  badge: 'text-blue-700 bg-blue-50 border-blue-200'   },
  purple: { dot: 'bg-purple-500', badge: 'text-purple-700 bg-purple-50 border-purple-200' },
}

export default function AffiliateBanners() {
  const affiliates = affiliatesData as Affiliate[]

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-gray-400 font-medium">申請サポートツール</span>
        <span className="text-[10px] text-gray-400 border border-gray-300 rounded px-1 py-0.5 leading-none">PR</span>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {affiliates.map((affiliate) => {
          const icon = ICON_MAP[affiliate.id] ?? '📦'
          const colors = COLOR_MAP[affiliate.color] ?? COLOR_MAP.blue
          return (
            <a
              key={affiliate.id}
              href={affiliate.fallback_url}
              rel="nofollow noopener noreferrer"
              target="_blank"
              className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all group"
            >
              <span className="text-xl shrink-0">{icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 leading-tight">{affiliate.name}</p>
                <p className="text-xs text-gray-500 mt-0.5 truncate">{affiliate.description}</p>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-lg border shrink-0 ${colors.badge} group-hover:opacity-80`}>
                無料で試す →
              </span>
            </a>
          )
        })}
      </div>
    </div>
  )
}
