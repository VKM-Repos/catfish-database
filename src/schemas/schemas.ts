import { z } from 'zod'
import { UserRole } from 'src/types'

export const stateSchema = z.object({
  id: z.number(),
  name: z.string(),
})

export const phoneSchema = z.string().regex(/^\d{11}$/, 'Must be an 11-digit number')

export const clusterSchema = z.object({
  id: z.string(),
  name: z.string().min(3, { message: 'Name must not be less than 3 characters' }),
  state: stateSchema,
  description: z.string().min(3, { message: 'Description must not be less than 3 characters' }),
  context: z.string().nullable(),
  createdDate: z.string().nullable(),
  lastModifiedDate: z.string().nullable(),
})

export const userSchema = z.object({
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
  cluster: clusterSchema.nullable().optional(),
})

export const paginatedUserResponseSchema = z.object({
  totalPages: z.number(),
  totalElements: z.number(),
  page: z.number(),
  size: z.number(),
  content: z.array(userSchema),
})

export const clusterRequestSchema = z.object({
  name: z.string().min(3, 'Cluster name must not be less than 3 characters'),
  context: z.string().optional(),
  stateId: z.number().int().min(1, 'State ID is required'),
  description: z
    .string()
    .min(3, 'Description must not be less than 3 characters')
    .max(500, 'Description cannot exceed 500 characters'),
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
})

export const clusterManagerRequestSchema = z.object({
  firstName: z.string().min(3, { message: 'First name must not be less than 3 characters' }),
  lastName: z.string().min(3, { message: 'Last name must not be less than 3 characters' }),
  email: z.string().email('Please enter a valid email address'),
  phone: phoneSchema,
  clusterId: z.string().min(1, 'Cluster ID is required'),
  password: z.string().optional(),
  id: z.string().optional(),
})

export const clusterManagerResponseSchema = userSchema

export const farmerRequestSchema = z.object({
  firstName: z.string().min(3, { message: 'First name must not be less than 3 characters' }),
  lastName: z.string().min(3, { message: 'First name must not be less than 3 characters' }),
  email: z.string().email('Please enter a valid email address'),
  phone: phoneSchema,
  address: z.string().min(3, { message: 'Address must not be less than 3 characters' }),
  clusterId: z.string().min(1, 'Cluster ID is required'),
  password: z.string().optional(),
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
