import { z } from 'zod'

export const discussionQuestionSchema = z.object({
  title: z.string().min(10, 'Question title must be at least 10 characters'),
  body: z.string().min(10, 'Question body must be at least 10 characters'),
  authorName: z.string().optional(),
})

export const discussionAnswerSchema = z.object({
  body: z.string().min(5, 'Answer must be at least 5 characters'),
  authorName: z.string().optional(),
})

export const discussionRouteParamsSchema = z.object({
  id: z.string().cuid('Invalid discussion ID'),
})

export type DiscussionQuestionInput = z.infer<typeof discussionQuestionSchema>
export type DiscussionAnswerInput = z.infer<typeof discussionAnswerSchema>
