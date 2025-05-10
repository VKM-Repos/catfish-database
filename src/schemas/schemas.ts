import { z } from 'zod'
import { type User, UserRole } from 'src/types'
import { useAuthStore } from 'src/store/auth.store'

export const stateSchema = z.object({
  id: z.number(),
  name: z.string(),
})

export const phoneSchema = z.string().regex(/^\d{11}$/, 'Must be an 11-digit number')

export const emailSchema = z
  .string()
  .email({ message: 'Please enter a valid email address' })
  .min(1, { message: 'Please fill this field' })

export const passwordSchema = z
  .string()
  .min(8, { message: 'Password must contain at least 8 characters' })
  .refine((value) => /[A-Z]/.test(value), {
    message: 'Must contain at least one uppercase letter',
  })
  .refine((value) => /[a-z]/.test(value), {
    message: 'Must contain at least one lowercase letter',
  })
  .refine((value) => /\d/.test(value), {
    message: 'Must contain at least one number',
  })
  .refine((value) => /[!@#$%^&*(),.?":{}|<>_+\-=/[\]\\/~`']/.test(value), {
    message: 'Must contain at least one symbol',
  })

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
  defaultPassword: z.boolean(),
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
  email: emailSchema,
  phone: phoneSchema,
  clusterId: z.string().min(1, 'Cluster ID is required'),
  password: z.string().optional(),
  id: z.string().optional(),
})

export const clusterManagerResponseSchema = userSchema
const user = useAuthStore.getState().user
console.log(user?.role, '<<<<<<<')

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
      : user?.role === 'CLUSTER_MANAGER'
      ? z.string().min(1, 'Cluster ID is required').optional()
      : z.string().min(1, 'Cluster ID is required').optional(),
  password: z.string().optional(),
  role: z.string().optional(),
  id: z.string().optional(),
})
export const extendedFarmerRequestSchema = (user?: User | null) =>
  farmerRequestSchema.extend({
    clusterId: user?.role === 'SUPER_ADMIN' ? z.string().min(1, 'Cluster ID is required') : z.string().optional(),
  })

export const farmerResponseSchema = userSchema

export const loginRequestSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

export const loginResponseSchema = z.object({
  userDto: userSchema,
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresAt: z.string(),
})

export const profileSchema = z.object({
  firstName: z.string().min(3, { message: 'First name must not be less than 3 characters' }),
  lastName: z.string().min(3, { message: 'Last name must not be less than 3 characters' }),
  phone: phoneSchema,
  address: z.string().min(3, { message: 'Address must not be less than 3 characters' }),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, { message: 'Current password is required' }),
  newPassword: passwordSchema,
})

export const pondSchema = z.object({
  id: z.string().optional(),
  status: z.string().optional(),
  name: z.string().min(3, { message: 'Pond Name must not be less than 3 characters' }),
  size: z.string().regex(/^\d+(\.\d+)?$/, 'Pond size must be a valid number'),
  waterSource: z.string().min(1, { message: 'Please add a water source' }),
  pondType: z.string().min(1, { message: 'Please add pond type' }),
  clusterId: z.string().min(1, 'Cluster ID is required'),
  latitude: z.string().regex(/^[-+]?\d+(\.\d+)?$/, {
    message: 'Latitude must be a valid number (e.g., -18.211',
  }),
  longitude: z.string().regex(/^[-+]?\d+(\.\d+)?$/, {
    message: 'Longitude must be a valid number (e.g., 36.8219)',
  }),
})

export const pondResponseSchema = z.object({
  id: z.string().optional(),
  status: z.string().optional(),
  name: z.string(),
  size: z.union([z.string(), z.number()]).transform((val) => String(val)),
  latitude: z
    .union([z.string(), z.number()])
    .transform((val) => String(val))
    .optional(),
  longitude: z
    .union([z.string(), z.number()])
    .transform((val) => String(val))
    .optional(),
  waterSource: z.string(),
  pondType: z.string(),
  cluster: z.object({
    id: z.string(),
    name: z.string(),
  }),
  farmer: z.object({
    id: z.string().optional(),
    name: z.string().optional(),
  }),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
})

export const paginatedPondResponseSchema = z.object({
  totalPages: z.number(),
  totalElements: z.number(),
  page: z.number(),
  size: z.number(),
  content: z.array(pondResponseSchema),
})

export const fishDetailsSchema = z.object({
  pondId: z.string().min(1, { message: 'Please add a pond name' }),
  quantity: z.string().regex(/^[-+]?\d+(\.\d+)?$/, {
    message: 'Fish quantity must be a valid number',
  }),
  supplier: z.string().min(1, { message: 'Please add a supplier name' }).optional(),
  singleCost: z
    .string()
    .regex(/^[-+]?\d+(\.\d+)?$/, {
      message: 'Fish cost must be a valid number',
    })
    .optional(),
  costOfSupply: z.string().regex(/^[-+]?\d+(\.\d+)?$/, {
    message: 'Fish cost must be a valid number',
  }),
  fishDescription: z.string().min(3, { message: 'Description must not be less than 3 characters' }),
  fishSize: z.string().min(1, { message: 'Please input size of fish' }),
})

export const fishDetailsResponseSchema = z.object({
  id: z.string().optional(),
  pondId: z.string().optional(),
  quantity: z.union([z.string(), z.number()]).transform((val) => String(val)),
  costOfSupply: z.union([z.string(), z.number()]).transform((val) => String(val)),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const feedingResponseSchema = z.object({
  id: z.string().optional(),
  pondId: z.string().optional(),
  feedType: z.string(),
  quantity: z.union([z.string(), z.number()]).transform((val) => String(val)),
  frequency: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const fishBatchResponseSchema = z.object({
  id: z.string().optional(),
  pond: pondResponseSchema,
  feedings: z.array(feedingResponseSchema),
  quantity: z.union([z.string(), z.number()]).transform((val) => String(val)),
  costOfSupply: z.union([z.string(), z.number()]).transform((val) => String(val)),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const paginatedFishDetailsResponseSchema = z.object({
  totalPages: z.number(),
  totalElements: z.number(),
  page: z.number(),
  size: z.number(),
  content: z.array(fishDetailsResponseSchema),
})

export const paginatedFishBatchResponseSchema = z.object({
  totalPages: z.number(),
  totalElements: z.number(),
  page: z.number(),
  size: z.number(),
  content: z.array(fishBatchResponseSchema),
})

export const dailyFeedingSchema = z.object({
  feedType: z.string().min(1, { message: 'Please Select a feed type' }),
  pelletSize: z.string().min(1, { message: 'Please enter a pellet size' }),
  feedQuantity: z.string().min(1, { message: 'Please add a feeding quantity' }),
  feedTime: z.string().min(1, { message: 'Please select feeding time' }),
  dissolvedOxygen: z.string().min(1, { message: 'Please add a dissolved oxygen' }),
  phLevel: z.string().min(1, { message: 'Please add a PH level' }),
  temperature: z.string().min(1, { message: 'Please add a temperature' }),
  ammonia: z.string().min(1, { message: 'Please add a ammonia' }),
  nitrite: z.string().min(1, { message: 'Please add a nitrite' }),
  nitrate: z.string().min(1, { message: 'Please add a nitrate' }),
  alkalinity: z.string().min(1, { message: 'Please add a alkalinity' }),
  hardness: z.string().min(1, { message: 'Please add hardness' }),
  waterQualityObservation: z.string().min(10, {
    message: 'Water quality observation must be at least 10 characters.',
  }),
})

export const maintenanceSchema = z.object({
  maintenance: z.string().min(1, { message: 'Please Select a maintenance' }),
  cost: z
    .string()
    .min(1, { message: 'Cost is field required' })
    .regex(/^[0-9]+$/, { message: 'Only numbers are allowed' })
    .transform(Number),
})

export const samplingSchema = z.object({
  numberOfFishSampled: z.string().min(1, { message: 'Please Select a feed type' }),
  weightOfFishSampled: z.string().min(1, { message: 'Please enter a pellet size' }),
  avgWeightFishSampled: z.string().min(1, { message: 'Please add a feeding quantity' }),
  totalWeightGain: z.string().min(1, { message: 'Please add a feed time' }),
  totalFeedConsumed: z.string().min(1, { message: 'Please add a dissolved oxygen' }),
  numberOfFishMortalityRecorded: z.string().min(1, { message: 'Please add a PH level' }),
  disease: z.string().min(1, { message: 'Please add a temperature' }),
  diseaseObservation: z.string().min(1, { message: 'Please add a ammonia' }),
  behavior: z.string().min(1, { message: 'Please add a nitrite' }),
  observation: z.string().min(1, { message: 'Please add a nitrate' }),
})

export const sortingSchema = z.object({
  splitOccur: z.boolean(),
  transfer: z.boolean(),
  harvest: z.boolean(),
  numberOfFishMovedByTransfer: z.string(),
  destinationPond: z.string(),
  numberOfFishHarvest: z.string(),
})

export const harvestSchema = z.object({
  numberOfFishHarvested: z.string(),
  avgWeightOfFishHarvested: z.string(),
  totalWeightHarvested: z.string(),
  totalAmountSold: z.string(),
  harvestObservation: z.string(),
  harvestedBy: z.string(),
})
