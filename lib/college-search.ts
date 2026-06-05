import { buildLocationWhereConditions, expandLocationSearchTerms } from '@/lib/india-locations'

type PrismaWhere = Record<string, unknown>

export function buildCollegeSearchWhere(filters: {
  search?: string
  location?: string
  minRating?: number
  minFees?: number
  maxFees?: number
}): PrismaWhere {
  const where: PrismaWhere = {}
  const andConditions: PrismaWhere[] = []

  if (filters.search) {
    const searchTerms = expandLocationSearchTerms(filters.search)
    const orConditions: PrismaWhere[] = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      ...buildLocationWhereConditions(filters.search),
    ]

    for (const term of searchTerms) {
      if (term !== filters.search) {
        orConditions.push({ name: { contains: term, mode: 'insensitive' } })
      }
    }

    andConditions.push({ OR: orConditions })
  }

  if (filters.location) {
    const locationConditions = buildLocationWhereConditions(filters.location)
    if (locationConditions.length > 0) {
      andConditions.push({ OR: locationConditions })
    }
  }

  if (andConditions.length === 1) {
    Object.assign(where, andConditions[0])
  } else if (andConditions.length > 1) {
    where.AND = andConditions
  }

  if (filters.minRating !== undefined) {
    where.rating = { gte: filters.minRating }
  }

  if (filters.minFees !== undefined || filters.maxFees !== undefined) {
    const fees: { gte?: number; lte?: number } = {}
    if (filters.minFees !== undefined) fees.gte = filters.minFees
    if (filters.maxFees !== undefined) fees.lte = filters.maxFees
    where.fees = fees
  }

  return where
}
