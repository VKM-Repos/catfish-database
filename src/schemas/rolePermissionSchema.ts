import { z } from 'zod'

export const roleRequestSchema = z.object({
  id: z.string().optional(), // <-- change this if `id` is only required in edit
  name: z.string(),
  description: z.string(),
  privilegeIds: z.array(z.any()).optional(),
})

export const roleResponseSchema = z.object({
  id: z.string().optional(), // <-- change this if `id` is only required in edit
  name: z.string(),
  description: z.string(),
  privileges: z.array(z.any()),
  // privilegesIds: z.array(z.any()).optional(),
})

export const roleFormSchema = z.object({
  id: z.string().optional(), // <-- change this if `id` is only required in edit
  name: z.string(),
  description: z.string(),
  modules: z.array(z.any()).optional(),
  //   privileges: z.array(z.string()).optional(),
  privilegeIds: z.array(z.any()).optional(),
})
