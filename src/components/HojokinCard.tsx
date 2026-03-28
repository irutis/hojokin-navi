import Link from 'next/link'
import { Hojokin, formatAmount, formatRate } from '@/data/hojokin/index'

export default function HojokinCard({ h }: { h: Hojokin }) {
  return (
    <Link href={`/hojokin/${h.slug}`} className="block group">
      <div className="border border-gray-200 rounded-xl p-5 bg-white hover:border-blue-400 hover:shadow-md transition-all h-full">
        <div className="flex items-start justify-between mb-3">
          <span className="text-xs bg-blue-50 text-blue-700 font-medium px-2 py-1 rounded-full">
            {h.category}
          </span>
          <span className="text-xs text-gray-400">{h.managing_org}</span>
        </div>
        <h3 className="font-bold text-gray-800 text-lg mb-1 group-hover:text-blue-600 transition-colors">
          {h.name}
        </h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{h.purpose}</p>
        <div className="flex gap-4 text-sm">
          <div>
            <p className="text-gray-400 text-xs">最大補助額</p>
            <p className="font-bold text-gray-800">{formatAmount(h.max_amount)}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">補助率</p>
            <p className="font-bold text-gray-800">{formatRate(h.subsidy_rate)}</p>
          </div>
        </div>
      </div>
    </Link>
  )
}
