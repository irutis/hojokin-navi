import { NextRequest, NextResponse } from 'next/server'
import { runShindan, ShindanInput } from '@/lib/claude'

export async function POST(req: NextRequest) {
  try {
    const body: ShindanInput = await req.json()
    const results = await runShindan(body)
    return NextResponse.json({ results })
  } catch (error) {
    console.error('Shindan error:', error)
    return NextResponse.json({ error: '診断中にエラーが発生しました' }, { status: 500 })
  }
}
