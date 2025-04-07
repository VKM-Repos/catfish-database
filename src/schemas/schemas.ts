import { UserRole } from 'src/types'
import { z } from 'zod'

// Define the state schema
const stateSchema = z.object({
  id: z.number(),
  name: z.string(),
})

// Define the user schema
const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  role: z.enum([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CLUSTER_MANAGER, UserRole.FARMER]),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string(),
  address: z.string().nullable(),
  context: z.string().nullable(),
  createdAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
  cluster: z.any().nullable(),
})

// Define the cluster schema
const clusterRequestSchema = z.object({
  name: z.string().min(1, 'Cluster name is required'),
  context: z.string().optional(),
  stateId: z.number().int().min(1, 'State ID is required'),
  description: z.string().min(1, 'Description is required').max(500, 'Description cannot exceed 500 characters'),
  id: z.string().optional(),
})

// Define the cluster response schema
const clusterResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  state: stateSchema,
  description: z.string(),
  context: z.nullable(z.string()),
  createdDate: z.nullable(z.string()),
  lastModifiedDate: z.nullable(z.string()),
  users: z.array(userSchema),
})

// Define the login request schema
const loginRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

// Define the login response schema
const loginResponseSchema = z.object({
  userDto: z.object({
    id: z.string(),
    email: z.string(),
    role: z.enum([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CLUSTER_MANAGER, UserRole.FARMER]),
    firstName: z.string(),
    lastName: z.string(),
    phone: z.string(),
    address: z.string().nullable(),
    context: z.string().nullable(),
    createdAt: z.string().nullable(),
    updatedAt: z.string().nullable(),
    cluster: z.any().nullable(),
  }),
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresAt: z.string(),
})

export { stateSchema, clusterResponseSchema, clusterRequestSchema, userSchema, loginRequestSchema, loginResponseSchema }
