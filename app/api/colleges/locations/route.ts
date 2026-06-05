import { NextRequest, NextResponse } from "next/server"
import { getCitySuggestions } from "@/lib/india-locations"

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q") ?? undefined
  const cities = getCitySuggestions(query)

  return NextResponse.json({
    success: true,
    data: cities,
  })
}
