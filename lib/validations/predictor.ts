import { z } from 'zod'

export const predictorSchema = z.object({
  exam: z.string().min(1, 'Exam is required'),
  rank: z.number().int().positive('Rank must be a positive integer'),
})

export type PredictorInput = z.infer<typeof predictorSchema>
