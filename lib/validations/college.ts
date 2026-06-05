import { z } from "zod"

export const collegeFiltersSchema = z.object({
  search: z.string().optional(),
  location: z.string().optional(),
  minRating: z.number().min(0).max(5).optional(),
  minFees: z.number().min(0).optional(),
  maxFees: z.number().min(0).optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(12),
})

export const collegeIdSchema = z.object({
  id: z.string().cuid("Invalid college ID"),
})

export const saveCollegeSchema = z.object({
  collegeId: z.string().cuid("Invalid college ID"),
})

export type CollegeFilters = z.infer<typeof collegeFiltersSchema>
export type CollegeIdParams = z.infer<typeof collegeIdSchema>
export type SaveCollegeInput = z.infer<typeof saveCollegeSchema>
