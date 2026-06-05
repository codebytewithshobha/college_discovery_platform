import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { saveCollegeSchema } from "@/lib/validations/college"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Validate input
    const validatedData = saveCollegeSchema.parse(body)
    
    // Get user ID from session (for now, we'll use a placeholder)
    const userId = body.userId // This should come from session
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }
    
    // Check if college exists
    const college = await prisma.college.findUnique({
      where: { id: validatedData.collegeId },
    })
    
    if (!college) {
      return NextResponse.json(
        { success: false, message: "College not found" },
        { status: 404 }
      )
    }
    
    // Check if already saved
    const existingSaved = await prisma.savedCollege.findUnique({
      where: {
        userId_collegeId: {
          userId,
          collegeId: validatedData.collegeId,
        },
      },
    })
    
    if (existingSaved) {
      return NextResponse.json(
        { success: false, message: "College already saved" },
        { status: 409 }
      )
    }
    
    // Save college
    const savedCollege = await prisma.savedCollege.create({
      data: {
        userId,
        collegeId: validatedData.collegeId,
      },
      include: {
        college: true,
      },
    })
    
    return NextResponse.json(
      { success: true, data: savedCollege },
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
    
    console.error("Save college error:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const userId = searchParams.get("userId")
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }
    
    // Get saved colleges
    const savedColleges = await prisma.savedCollege.findMany({
      where: { userId },
      include: {
        college: {
          include: {
            _count: {
              select: {
                reviews: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    
    return NextResponse.json(
      { success: true, data: savedColleges },
      { status: 200 }
    )
  } catch (error) {
    console.error("Get saved colleges error:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}
