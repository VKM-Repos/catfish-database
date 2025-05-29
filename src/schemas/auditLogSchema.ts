import { z } from 'zod'

export const auditSchema = z.object({
  id: z.string().uuid(),
  timestamp: z.string(),
  actionType: z.enum(['CREATE', 'UPDATE', 'DELETE']),
  entityType: z.string(),
  entityId: z.string().uuid(),
  userId: z.string().uuid(),
  username: z.string(),
  oldValue: z.union([z.object({}).passthrough(), z.string(), z.null()]),
  newValue: z.union([z.object({}).passthrough(), z.string(), z.null()]),
  description: z.string(),
  ipAddress: z.string(),
  userAgent: z.string(),
})

export const paginatedAuditResponseSchema = z.object({
  totalPages: z.number(),
  totalElements: z.number(),
  page: z.number(),
  size: z.number(),
  content: z.array(auditSchema),
})

export const auditResponseSchema = auditSchema
