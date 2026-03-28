'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShindanResult } from '@/lib/claude'

const STEPS = [
  {
    key: 'industry',
    label: '業種を教えてください',
    options: ['製造業', 'IT・ソフトウェア', '小売業', '飲食業', '建設業', 'サービス業', '卸売業', 'その他'],
  },
  {
    key: 'employees',
    label: '従業員数は？',
    options: ['1〜5人', '6〜20人', '21〜50人', '51〜100人', '101〜300人', '301人以上'],
  },
  {
    key: 'capital',
    label: '資本金は？',
    options: ['個人事業主（資本金なし）', '500万円未満', '500万〜3,000万円', '3,000万〜1億円', '1億〜3億円', '3億円超'],
  },
  {
    key: 'purpose',
    label: '補助金で何をしたいですか？',
    options: ['ITツール・システム導入', '設備・機械の購入', 'HP・広告・販路拡大', '省力化・自動化', '新製品・サービス開発', 'その他'],
  },
  {
    key: 'established_years',
    label: '設立からの年数は？',
    options: ['1年未満', '1〜3年', '3〜10年', '10年以上'],
  },
]

export default function Shindan() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [results, setResults] = useState<ShindanResult[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const current = STEPS[step]

  async function handleSelect(value: string) {
    const newAnswers = { ...answers, [current.key]: value }
    setAnswers(newAnswers)

    if (step < STEPS.length - 1) {
      setStep(step + 1)
    } else {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/shindan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newAnswers),
        })
        const data = await res.json()
        if (data.error) throw new Error(data.error)
        setResults(data.results)
      } catch (e) {
        setError('診断中にエラーが発生しました。もう一度お試しください。')
      } finally {
        setLoading(false)
      }
    }
  }

  function reset() {
    setStep(0)
    setAnswers({})
    setResults(null)
    setError(null)
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-600">AIが最適な補助金を診断中...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={reset} className="text-blue-600 underline">最初からやり直す</button>
      </div>
    )
  }

  if (results) {
    return (
      <div>
        <h3 className="text-xl font-bold mb-6 text-gray-800">診断結果：あなたに合う補助金</h3>
        <div className="space-y-4">
          {results.map((r, i) => (
            <div key={r.slug} className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${i === 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                    {i === 0 ? '最有力' : `第${i + 1}候補`}
                  </span>
                  <span className="font-bold text-gray-800">{r.name}</span>
                </div>
                <span className="text-sm font-bold text-blue-600">{r.match_score}点</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{r.reason}</p>
              {r.caution && (
                <p className="text-xs text-orange-600 bg-orange-50 rounded px-3 py-1 mb-3">
                  ⚠ {r.caution}
                </p>
              )}
              <Link
                href={`/hojokin/${r.slug}`}
                className="text-sm text-blue-600 font-medium hover:underline"
              >
                詳細・申請方法を見る →
              </Link>
            </div>
          ))}
        </div>
        <button onClick={reset} className="mt-6 text-sm text-gray-500 underline">
          もう一度診断する
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex gap-1 mb-6">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? 'bg-blue-600' : 'bg-gray-200'}`}
          />
        ))}
      </div>
      <p className="text-sm text-gray-500 mb-2">{step + 1} / {STEPS.length}</p>
      <h3 className="text-xl font-bold text-gray-800 mb-6">{current.label}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {current.options.map((opt) => (
          <button
            key={opt}
            onClick={() => handleSelect(opt)}
            className="text-left px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-gray-700 font-medium"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}
