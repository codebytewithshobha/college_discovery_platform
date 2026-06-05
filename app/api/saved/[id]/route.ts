import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = req.nextUrl.searchParams
    const userId = searchParams.get("userId")
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }
    
    // Check if saved college exists and belongs to user
    const savedCollege = await prisma.savedCollege.findFirst({
      where: {
        id: params.id,
        userId,
      },
    })
    
    if (!savedCollege) {
      return NextResponse.json(
        { success: false, message: "Saved college not found" },
        { status: 404 }
      )
    }
    
    // Delete saved college
    await prisma.savedCollege.delete({
      where: { id: params.id },
    })
    
    return NextResponse.json(
      { success: true, message: "College removed from saved" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Remove saved college error:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}
