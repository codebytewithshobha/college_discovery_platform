import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { predictorSchema } from '@/lib/validations/predictor'

const examName = (exam: string) => {
  const normalized = exam.trim().toLowerCase()
  if (normalized.includes('jee')) return 'JEE'
  if (normalized.includes('neet')) return 'NEET'
  if (normalized.includes('cuet')) return 'CUET'
  if (normalized.includes('gate')) return 'GATE'
  return 'OTHER'
}

const getRecommendedRanking = (exam: string, rank: number) => {
  const normalized = examName(exam)

  const rules: Record<string, Array<{ maxRank: number; maxCollegeRank: number }>> = {
    JEE: [
      { maxRank: 100, maxCollegeRank: 50 },
      { maxRank: 500, maxCollegeRank: 120 },
      { maxRank: 2000, maxCollegeRank: 250 },
      { maxRank: 5000, maxCollegeRank: 450 },
      { maxRank: 20000, maxCollegeRank: 750 },
      { maxRank: Number.MAX_SAFE_INTEGER, maxCollegeRank: 1100 },
    ],
    NEET: [
      { maxRank: 100, maxCollegeRank: 40 },
      { maxRank: 500, maxCollegeRank: 100 },
      { maxRank: 1500, maxCollegeRank: 220 },
      { maxRank: 4000, maxCollegeRank: 420 },
      { maxRank: Number.MAX_SAFE_INTEGER, maxCollegeRank: 800 },
    ],
    CUET: [
      { maxRank: 100, maxCollegeRank: 60 },
      { maxRank: 500, maxCollegeRank: 150 },
      { maxRank: 2000, maxCollegeRank: 320 },
      { maxRank: Number.MAX_SAFE_INTEGER, maxCollegeRank: 650 },
    ],
    GATE: [
      { maxRank: 100, maxCollegeRank: 40 },
      { maxRank: 500, maxCollegeRank: 90 },
      { maxRank: 2000, maxCollegeRank: 200 },
      { maxRank: Number.MAX_SAFE_INTEGER, maxCollegeRank: 400 },
    ],
    OTHER: [
      { maxRank: 100, maxCollegeRank: 100 },
      { maxRank: 1000, maxCollegeRank: 250 },
      { maxRank: 5000, maxCollegeRank: 600 },
      { maxRank: Number.MAX_SAFE_INTEGER, maxCollegeRank: 1000 },
    ],
  }

  const config = rules[normalized]
  const match = config.find((entry) => rank <= entry.maxRank)
  return match?.maxCollegeRank ?? config[config.length - 1].maxCollegeRank
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validated = predictorSchema.parse(body)
    const normalizedExam = examName(validated.exam)
    const maxRank = getRecommendedRanking(normalizedExam, validated.rank)
    const colleges = await prisma.college.findMany({
      where: {
        ranking: {
          not: null,
          lte: maxRank,
        },
      },
      orderBy: { ranking: 'asc' },
      take: 8,
      select: {
        id: true,
        name: true,
        location: true,
        ranking: true,
        rating: true,
        fees: true,
        thumbnail: true,
        averagePackage: true,
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    })

    const fallback = colleges.length === 0
      ? await prisma.college.findMany({
          orderBy: { rating: 'desc' },
          take: 6,
          select: {
            id: true,
            name: true,
            location: true,
            ranking: true,
            rating: true,
            fees: true,
            thumbnail: true,
            averagePackage: true,
            _count: { select: { reviews: true } },
          },
        })
      : []

    return NextResponse.json(
      {
        success: true,
        data: {
          exam: normalizedExam,
          rank: validated.rank,
          maxRanking: maxRank,
          recommendations: colleges.length > 0 ? colleges : fallback,
          usedFallback: colleges.length === 0,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid predictor input',
          errors: (error as any).errors,
        },
        { status: 400 }
      )
    }

    console.error('Predictor error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
