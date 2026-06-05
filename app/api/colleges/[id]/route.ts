import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { collegeIdSchema } from "@/lib/validations/college"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate college ID
    const { id } = collegeIdSchema.parse(params)
    
    // Get college with all relations
    const college = await prisma.college.findUnique({
      where: { id },
      include: {
        courses: {
          orderBy: { fees: "asc" },
        },
        reviews: {
          take: 20,
          orderBy: { createdAt: "desc" },
        },
        recruiters: {
          take: 15,
        },
        _count: {
          select: {
            reviews: true,
            courses: true,
          },
        },
      },
    })
    
    if (!college) {
      return NextResponse.json(
        { success: false, message: "College not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { success: true, data: college },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { 
          success: false, 
          message: "Invalid college ID",
          errors: (error as any).errors,
        },
        { status: 400 }
      )
    }
    
    console.error("College fetch error:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}
