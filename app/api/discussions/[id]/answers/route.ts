import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { discussionAnswerSchema, discussionRouteParamsSchema } from '@/lib/validations/discussion'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = discussionRouteParamsSchema.parse(params)
    const question = await prisma.discussionQuestion.findUnique({
      where: { id },
      include: {
        answers: {
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!question) {
      return NextResponse.json(
        { success: false, message: 'Question not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: question.answers }, { status: 200 })
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid question ID',
          errors: (error as any).errors,
        },
        { status: 400 }
      )
    }

    console.error('Discussion answer fetch error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = discussionRouteParamsSchema.parse(params)
    const body = await req.json()
    const validated = discussionAnswerSchema.parse(body)
    const authorName = validated.authorName?.trim() || 'Anonymous'

    const question = await prisma.discussionQuestion.findUnique({ where: { id } })
    if (!question) {
      return NextResponse.json(
        { success: false, message: 'Question not found' },
        { status: 404 }
      )
    }

    const answer = await prisma.discussionAnswer.create({
      data: {
        questionId: id,
        body: validated.body,
        authorName,
      },
    })

    return NextResponse.json({ success: true, data: answer }, { status: 201 })
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

    console.error('Discussion answer creation error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
