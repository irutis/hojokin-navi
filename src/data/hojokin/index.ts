import itDonyu from './it-donyu.json'
import monozukuri from './monozukuri.json'
import jizokuka from './jizokuka.json'
import shorikika from './shorikika.json'

export type Hojokin = {
  slug: string
  name: string
  official_name: string
  category: string
  managing_org: string
  max_amount: number
  subsidy_rate: number
  target_company_size: string[]
  target_industries: string[]
  purpose: string
  deadline: string
  next_expected: string
  eligible_expenses: string[]
  ineligible_expenses: string[]
  eligibility_conditions: string[]
  company_size_limit: Record<string, { capital?: number; employees: number }>
  application_flow: string[]
  rejection_reasons: string[]
  success_tips: string[]
  affiliate_cta: { text: string; url_placeholder: string }
  related_subsidies: string[]
  tags: string[]
  monthly_searches: number
  last_updated: string
}

export const allHojokin: Hojokin[] = [
  itDonyu as Hojokin,
  monozukuri as Hojokin,
  jizokuka as Hojokin,
  shorikika as Hojokin,
]

export function getHojokinBySlug(slug: string): Hojokin | undefined {
  return allHojokin.find((h) => h.slug === slug)
}

export function formatAmount(amount: number): string {
  if (amount >= 10000000) return `${amount / 10000000}千万円`
  if (amount >= 1000000) return `${amount / 1000000}百万円`
  return `${amount.toLocaleString()}円`
}

export function formatRate(rate: number): string {
  return `${Math.round(rate * 100)}%`
}
