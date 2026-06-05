import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createComparisonSchema } from "@/lib/validations/comparison"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Validate input
    const validatedData = createComparisonSchema.parse(body)
    
    // Get user ID from session (for now, we'll use a placeholder)
    // In production, this would come from NextAuth session
    const userId = body.userId // This should come from session
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }
    
    // Create comparison with items
    const comparison = await prisma.savedComparison.create({
      data: {
        name: validatedData.name,
        userId,
        items: {
          create: validatedData.collegeIds.map((collegeId) => ({
            collegeId,
          })),
        },
      },
      include: {
        items: {
          include: {
            college: true,
          },
        },
      },
    })
    
    return NextResponse.json(
      { success: true, data: comparison },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { 
          success: false, 
          message: "Validation error",
          errors: (error as any).errors,
        },
        { status: 400 }
      )
    }
    
    console.error("Comparison creation error:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}
