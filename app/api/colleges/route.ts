import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { buildCollegeSearchWhere } from "@/lib/college-search"
import { collegeFiltersSchema } from "@/lib/validations/college"

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    
    // Parse and validate filters
    const filters = collegeFiltersSchema.parse({
      search: searchParams.get("search") || undefined,
      location: searchParams.get("location") || undefined,
      minRating: searchParams.get("minRating") 
        ? parseFloat(searchParams.get("minRating")!) 
        : undefined,
      minFees: searchParams.get("minFees") 
        ? parseInt(searchParams.get("minFees")!) 
        : undefined,
      maxFees: searchParams.get("maxFees") 
        ? parseInt(searchParams.get("maxFees")!) 
        : undefined,
      page: searchParams.get("page") 
        ? parseInt(searchParams.get("page")!) 
        : 1,
      limit: searchParams.get("limit") 
        ? parseInt(searchParams.get("limit")!) 
        : 12,
    })
    
    const where = buildCollegeSearchWhere(filters)
    
    // Get total count
    const total = await prisma.college.count({ where })
    
    // Get colleges with pagination
    const colleges = await prisma.college.findMany({
      where,
      skip: (filters.page - 1) * filters.limit,
      take: filters.limit,
      select: {
        id: true,
        name: true,
        location: true,
        description: true,
        establishmentYear: true,
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
      orderBy: {
        rating: "desc",
      },
    })
    
    const totalPages = Math.ceil(total / filters.limit)
    
    return NextResponse.json(
      {
        success: true,
        data: colleges,
        pagination: {
          page: filters.page,
          limit: filters.limit,
          total,
          totalPages,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { 
          success: false, 
          message: "Invalid query parameters",
          errors: (error as any).errors,
        },
        { status: 400 }
      )
    }
    
    console.error("Colleges fetch error:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}
