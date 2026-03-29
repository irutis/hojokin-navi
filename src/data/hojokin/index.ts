import itDonyu from './it-donyu.json'
import monozukuri from './monozukuri.json'
import jizokuka from './jizokuka.json'
import shorikika from './shorikika.json'
import jigyouSaikouchiku from './jigyou-saikouchiku.json'
import shoeneSetsubi from './shoene-setsubi.json'
import chikiMirai from './chiiki-mirai.json'
import denshiInvoice from './denshi-invoice.json'
import souzokuJigyo from './souzoku-jigyo.json'
import koyoChousei from './koyo-chosei.json'
import tokuteiKibo from './tokutei-kibo.json'
import innovationSouzou from './innovation-souzou.json'
import careerUp from './career-up.json'
import hatarakikata from './hatarakikata.json'
import trialKoyo from './trial-koyo.json'
import sogyou from './sogyou.json'
import jinzaiKakuho from './jinzai-kakuho.json'
import goTech from './go-tech.json'
import kaigaiTenkai from './kaigai-tenkai.json'
import shoeneShift from './shoene-shift.json'
import joshiKigyoka from './joshi-kigyoka.json'

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
  company_size_limit: Record<string, { capital?: number | null; employees: number | null }>
  application_flow: string[]
  rejection_reasons: string[]
  success_tips: string[]
  official_url: string
  affiliate_cta: { text: string; url_placeholder: string; url: string }
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
  jigyouSaikouchiku as Hojokin,
  shoeneSetsubi as Hojokin,
  chikiMirai as Hojokin,
  denshiInvoice as Hojokin,
  souzokuJigyo as Hojokin,
  koyoChousei as Hojokin,
  tokuteiKibo as Hojokin,
  innovationSouzou as Hojokin,
  careerUp as Hojokin,
  hatarakikata as Hojokin,
  trialKoyo as Hojokin,
  sogyou as Hojokin,
  jinzaiKakuho as Hojokin,
  goTech as Hojokin,
  kaigaiTenkai as Hojokin,
  shoeneShift as Hojokin,
  joshiKigyoka as Hojokin,
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
