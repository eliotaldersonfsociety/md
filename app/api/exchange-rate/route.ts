import { NextResponse } from "next/server"
import { getExchangeRateAction } from "@/db/actions"

export const revalidate = 86400

export async function GET() {
  try {
    const rate = await getExchangeRateAction()
    return NextResponse.json({ rate })
  } catch {
    return NextResponse.json({ rate: 0.00025 }, { status: 500 })
  }
}
