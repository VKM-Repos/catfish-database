import { z } from 'zod'

export const configSchema = z.object({
  id: z.string().uuid(),
  key: z.string(),
  value: z.string(),
  listValue: z.array(z.string()),
  description: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const paginatedConfigResponseSchema = z.object({
  totalPages: z.number(),
  totalElements: z.number(),
  page: z.number(),
  size: z.number(),
  content: z.array(configSchema),
})

export const configResponseSchema = configSchema

export const configRequestSchema = {
  value: z.string(),
  listValue: z.array(z.any()),
  description: z.string(),
  category: z.string(),
}
