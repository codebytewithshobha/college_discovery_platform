import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { discussionQuestionSchema } from '@/lib/validations/discussion'

export async function GET() {
  try {
    const questions = await prisma.discussionQuestion.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        answers: {
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    return NextResponse.json({ success: true, data: questions }, { status: 200 })
  } catch (error) {
    console.error('Discussion fetch error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validated = discussionQuestionSchema.parse(body)
    const authorName = validated.authorName?.trim() || 'Anonymous'

    const question = await prisma.discussionQuestion.create({
      data: {
        title: validated.title,
        body: validated.body,
        authorName,
      },
      include: {
        answers: true,
      },
    })

    return NextResponse.json({ success: true, data: question }, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation error',
          errors: (error as any).errors,
        },
        { status: 400 }
      )
    }

    console.error('Discussion creation error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
