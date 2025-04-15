import { z } from 'zod'
import { UserRole } from 'src/types'
import { useAuthStore } from 'src/store/auth.store'

export const stateSchema = z.object({
  id: z.number(),
  name: z.string(),
})
const user = useAuthStore.getState().user
export const userSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    id: z.string(),
    email: z.string().email(),
    role: z.enum([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CLUSTER_MANAGER, UserRole.FARMER]),
    firstName: z.string(),
    lastName: z.string(),
    phone: z.string(),
    address: z.string().nullable().optional(),
    accountNonLocked: z.boolean(),
    enabled: z.boolean(),
    banUntil: z.string().nullable().optional(),
    context: z.string().nullable().optional(),
    createdAt: z.string().nullable().optional(),
    updatedAt: z.string().nullable().optional(),
    cluster: clusterSchema.nullable().optional(), // Circular reference resolved via z.lazy
  }),
)

export const clusterSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    id: z.string(),
    name: z.string(),
    state: stateSchema,
    description: z.string(),
    context: z.string().nullable(),
    createdDate: z.string().nullable(),
    lastModifiedDate: z.string().nullable(),
    users: z.array(userSchema).optional().default([]),
  }),
)

export const paginatedUserResponseSchema = z.object({
  totalPages: z.number(),
  totalElements: z.number(),
  page: z.number(),
  size: z.number(),
  content: z.array(userSchema),
})

export const clusterRequestSchema = z.object({
  name: z.string().min(1, 'Cluster name is required'),
  context: z.string().optional(),
  stateId: z.number().int().min(1, 'State ID is required'),
  description: z.string().min(1, 'Description is required').max(500, 'Description cannot exceed 500 characters'),
  id: z.string().optional(),
})

export const clusterResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  state: stateSchema,
  description: z.string(),
  context: z.nullable(z.string()),
  createdDate: z.nullable(z.string()),
  lastModifiedDate: z.nullable(z.string()),
  users: z.nullable(z.array(userSchema)),
})

export const clusterManagerRequestSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  clusterId: z.string().min(1, 'Cluster ID is required'),
  password: z.string().optional(),
  id: z.string().optional(),
})

export const clusterManagerResponseSchema = userSchema

export const farmerRequestSchema = z.object({
  firstName: z
    .string()
    .min(3, 'Field must be at least 3 characters')
    .max(50, 'Field must not be more than 50 characters'),
  lastName: z.string().min(3, 'Field must be at least 3 characters'),
  email: z.string().email().max(50, 'Field must not be more than 50 characters'),
  phone: z
    .string()
    .regex(/^\d+$/, {
      message: 'Phone number must contain only digits (0-9)',
    })
    .min(11, 'Field must be at least 11 digits')
    .max(11, 'Field must not be more than 11 digit'),
  address: z
    .string()
    .min(5, 'Field must be at least 5 characters')
    .max(100, 'Field must not be more than 100 characters'),
  clusterId:
    user?.role === 'SUPER_ADMIN'
      ? z.string().min(1, 'Cluster ID is required')
      : z.string().min(1, 'Cluster ID is required').optional(),
  password: z.string().optional(),
  role: z.string().optional(),
  id: z.string().optional(),
})

export const farmerResponseSchema = userSchema

export const loginRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const loginResponseSchema = z.object({
  userDto: userSchema,
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresAt: z.string(),
})
