import { z } from "zod"

export const createComparisonSchema = z.object({
  name: z.string().min(1, "Comparison name is required").max(100),
  collegeIds: z
    .array(z.string().cuid("Invalid college ID"))
    .min(2, "Select at least 2 colleges")
    .max(3, "You can compare at most 3 colleges")
    .refine((ids) => new Set(ids).size === ids.length, {
      message: "Cannot compare the same college multiple times",
    }),
})

export const addToComparisonSchema = z.object({
  comparisonId: z.string().cuid("Invalid comparison ID").optional(),
  collegeId: z.string().cuid("Invalid college ID"),
})

export type CreateComparisonInput = z.infer<typeof createComparisonSchema>
export type AddToComparisonInput = z.infer<typeof addToComparisonSchema>
