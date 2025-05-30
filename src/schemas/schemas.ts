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
  length: z
    .string()
    .regex(/^\d+(\.\d+)?$/, 'Pond length must be a valid number')
    .optional(),
  breadth: z
    .string()
    .regex(/^\d+(\.\d+)?$/, 'Pond breadth must be a valid number')
    .optional(),
  height: z
    .string()
    .regex(/^\d+(\.\d+)?$/, 'Pond height must be a valid number')
    .optional(),
  size: z.string().regex(/^\d+(\.\d+)?$/, 'Pond size must be a valid number'),
  waterSource: z.string().min(1, { message: 'Please add a water source' }),
  pondType: z.string().min(1, { message: 'Please add pond type' }),
  clusterId: z.string().min(1, 'Cluster ID is required'),
  latitude: z.string().regex(/^-?(90(\.0+)?|[0-8]?\d(\.\d+)?)$/, {
    message: 'Latitude must be a valid number between -90 and 90 (e.g., -18.211',
  }),
  longitude: z.string().regex(/^-?(180(\.0+)?|1[0-7]\d(\.\d+)?|[0-9]?\d(\.\d+)?|[1-9]\d(\.\d+)?)$/, {
    message: 'Longitude must be a valid number between 180 and -180(e.g., 36.8219)',
  }),
  farmerId: z.string().optional(),
})

export const pondResponseSchema = z.object({
  id: z.string().optional(),
  status: z.string().optional(),
  name: z.string(),
  size: z.union([z.string(), z.number()]).transform((val) => String(val)),
  length: z
    .union([z.string(), z.number()])
    .transform((val) => String(val))
    .optional(),
  breadth: z
    .union([z.string(), z.number()])
    .transform((val) => String(val))
    .optional(),
  height: z
    .union([z.string(), z.number()])
    .transform((val) => String(val))
    .optional(),
  latitude: z
    .union([z.string(), z.number()])
    .transform((val) => String(val))
    .optional()
    .nullable(),
  longitude: z
    .union([z.string(), z.number()])
    .transform((val) => String(val))
    .optional()
    .nullable(),
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
  batchName: z.string().min(1, { message: 'Please add a batch name' }).optional(),
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

export const fishBatchSchema = z.object({
  quantity: z.string().regex(/^[-+]?\d+(\.\d+)?$/, {
    message: 'Fish quantity must be a valid number',
  }),
  singleCost: z
    .string()
    .regex(/^[-+]?\d+(\.\d+)?$/, {
      message: 'Fish cost must be a valid number',
    })
    .optional(),
  costOfSupply: z.string().regex(/^[-+]?\d+(\.\d+)?$/, {
    message: 'Fish cost must be a valid number',
  }),
  active: z.boolean(),
})

export const fishBatchResponseSchema = z.object({
  id: z.string().optional(),
  pond: pondResponseSchema,
  feedings: z.array(feedingResponseSchema),
  active: z.boolean().optional(),
  quantity: z.union([z.string(), z.number()]).transform((val) => String(val)),
  latestQuantity: z.union([z.string(), z.number()]).transform((val) => String(val)),
  costOfSupply: z.union([z.string(), z.number()]).transform((val) => String(val)),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const newPondResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  size: z.number(),
  waterSource: z.string(),
  pondType: z.string(),
  clusterName: z.string(),
  farmerName: z.string(),
})

export const newFishBatchResponseSchema = z.object({
  id: z.string(),
  pondId: z.string(),
  quantity: z.union([z.string(), z.number()]).transform((val) => String(val)),
  latestQuantity: z.union([z.string(), z.number()]).transform((val) => String(val)),
  costOfSupply: z.number(),
  active: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  pond: newPondResponseSchema,
})

export const samplingResponseSchema = z.object({
  id: z.string().optional(),
  fishBatchId: z.string().optional(),
  census: z.union([z.string(), z.number()]).transform((val) => String(val)),
  sample: z.union([z.string(), z.number()]).transform((val) => String(val)),
  weight: z.union([z.string(), z.number()]).transform((val) => String(val)),
  mortality: z.union([z.string(), z.number()]).transform((val) => String(val)),
  averageWeightToFish: z.union([z.string(), z.number()]).transform((val) => String(val)),
  weightGain: z.union([z.string(), z.number()]).transform((val) => String(val)),
  feedConsumed: z.union([z.string(), z.number()]).transform((val) => String(val)),
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

export const paginatedFeedingResponseSchema = z.object({
  totalPages: z.number(),
  totalElements: z.number(),
  page: z.number(),
  size: z.number(),
  content: z.array(feedingResponseSchema),
})

export const paginatedSamplingResponseSchema = z.object({
  totalPages: z.number(),
  totalElements: z.number(),
  page: z.number(),
  size: z.number(),
  content: z.array(samplingResponseSchema),
})

export const dailyFeedingSchema = z.object({
  feedType: z.string().optional(),
  pelletSize: z.string().optional(),
  feedQuantity: z.any().optional(),
  // .regex(/^[0-9]+$/, { message: 'Only numbers are allowed' })
  // .transform(Number),
  feedTime: z.string().optional(),
  dissolvedOxygen: z.string().optional(),
  phLevel: z.string().optional(),
  temperature: z.string().optional(),
  ammonia: z.string().optional(),
  nitrite: z.string().optional(),
  nitrate: z.string().optional(),
  alkalinity: z.string().optional(),
  hardness: z.string().optional(),
  waterQualityObservation: z.string().optional(),
  // .min(10, {
  //   message: 'Water quality observation must be at least 10 characters.',
  // }),
})

export const dailyWaterQualitySchema = z.object({
  recordWaterQuality: z.boolean().optional(),
  dissolvedOxygen: z.string().optional(),
  phLevel: z.string().optional(),
  temperature: z.string().optional(),
  ammonia: z.string().optional(),
  nitrite: z.string().optional(),
  nitrate: z.string().optional(),
  alkalinity: z.string().optional(),
  hardness: z.string().optional(),
  observation: z.string().optional(),
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
  numberOfFishSampled: z.any(),
  weightOfFishSampled: z.any().optional(),
  avgWeightFishSampled: z.any().optional(),
  totalWeightGain: z.any(),
  totalFeedConsumed: z.any(),
  numberOfFishMortalityRecorded: z.any(),
  disease: z.string().optional(),
  diseaseObservation: z.string().optional(),
  behavior: z.string().optional(),
  observation: z.string().optional(),
})

export const sortingSchema = z.object({
  splitOccur: z.boolean(),
  reason: z.string().optional(),
  batches: z.array(
    z.object({
      pondId: z.string().optional(),
      quantity: z.any().optional(),
    }),
  ),
  numberOfFishToHarvest: z.string().optional(),
})
// export const sortingSchema = z.object({
//   splitOccur: z.boolean(),
//   reason: z
//     .string()
//     .optional()
//     .superRefine((val, ctx) => {
//       console.log(ctx, val)

//       if (ctx.path[0]. && !val) {
//         ctx.addIssue({
//           code: z.ZodIssueCode.custom,
//           message: 'Reason is required when split occurred',
//         })
//       }
//     }),
//   batches: z
//     .array(
//       z.object({
//         numberOfFishMoved: z.number().min(1, 'Number of fish moved is required'),
//         destinationPond: z.string().min(1, 'Destination pond is required'),
//       }),
//     )
//     .superRefine((val, ctx) => {
//       if (ctx.parent.reason === 'transfer' && (!val || val.length === 0)) {
//         ctx.addIssue({
//           code: z.ZodIssueCode.custom,
//           message: 'Batch details are required for transfers',
//         })
//       }
//     }),
// })
export const harvestSchema = z.object({
  numberOfFishHarvested: z.string(),
  avgWeightOfFishHarvested: z.string(),
  totalWeightHarvested: z.string(),
  totalAmountSold: z.string(),
  harvestObservation: z.string(),
  harvestedBy: z.string(),
})
