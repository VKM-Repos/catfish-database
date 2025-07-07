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

export const userRequestSchema = z.object({
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
  clusterId: z.string().min(1, 'Cluster ID is required'),
  role: z.string().optional(),
  id: z.string().optional(),
})

export const userResponseSchema = userSchema

export const paginatedUserResponseSchema = z.object({
  totalPages: z.number(),
  totalElements: z.number(),
  page: z.number(),
  size: z.number(),
  content: z.array(userSchema),
})

export const staffUserResponseSchema = z.object({
  totalPages: z.number(),
  totalElements: z.number(),
  page: z.number(),
  size: z.number(),
  content: z.array(userSchema),
})

export const staffRequestSchema = z.object({
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

  password: z.string().optional(),
  // role: z.string().optional(),
  // id: z.string().optional(),
})

export const staffResponseSchema = userSchema

export const roleRequestSchema = z.object({
  id: z.string().optional(), // <-- change this if `id` is only required in edit
  name: z.string(),
  description: z.string(),
  privilegeIds: z.array(z.string()),
})

export const roleResponseSchema = roleRequestSchema

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

// Base schema for form inputs (strings from HTML inputs)
export const pondFormSchema = z.object({
  name: z.string().min(1, 'Pond name is required'),
  size: z.string().optional(), // Will be calculated from dimensions
  waterSource: z.string().min(1, 'Please select a valid water source'),
  pondType: z.string().min(1, 'Please select a pond type'),
  length: z
    .string()
    .min(1, 'Length is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Length must be a positive number'),
  breadth: z
    .string()
    .min(1, 'Breadth is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Breadth must be a positive number'),
  height: z
    .string()
    .min(1, 'Height is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Height must be a positive number'),
  status: z.enum(['Active', 'Inactive']).default('Active'),
  longitude: z
    .string()
    .min(1, 'Longitude is required')
    .refine((val) => !isNaN(Number(val)), 'Longitude must be a valid number'),
  latitude: z
    .string()
    .min(1, 'Latitude is required')
    .refine((val) => !isNaN(Number(val)), 'Latitude must be a valid number'),
  clusterId: z.string().min(1, 'Cluster ID is required'),
  farmerId: z.string().optional(),
})

// Schema for API requests (numbers for backend)
export const pondCreateSchema = z.object({
  name: z.string().min(1, 'Pond name is required'),
  size: z.number().positive('Size must be positive'),
  waterSource: z.enum(['Treated pipe borne water', 'Streams', 'Bore holes', 'Wells', 'Rivers']),
  pondType: z.enum(['Concrete', 'Earthen', 'Plastic', 'Tarpauline']),
  length: z.number().positive('Length must be positive'),
  breadth: z.number().positive('Breadth must be positive'),
  height: z.number().positive('Height must be positive'),
  status: z.enum(['Active', 'Inactive']).default('Active'),
  longitude: z.number(),
  latitude: z.number(),
  clusterId: z.string().min(1, 'Cluster ID is required'),
  farmerId: z.string().optional(),
})

export const pondEditSchema = pondCreateSchema.extend({
  id: z.string().optional(),
})

export const waterSourceEnum = z.enum(['Treated pipe borne water', 'Streams', 'Bore holes', 'Wells', 'Rivers'])

export const pondTypeEnum = z.enum(['Concrete', 'Earthen', 'Plastic', 'Tarpauline'])

// response
export const pondResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  size: z.number(),
  waterSource: waterSourceEnum.optional(), // ← enum, not string
  pondType: pondTypeEnum.optional(), // ← enum, not string
  length: z.number(),
  breadth: z.number(),
  height: z.number(),
  status: z.enum(['Active', 'Inactive']),
  longitude: z.number(),
  latitude: z.number(),
  cluster: z.object({ id: z.string(), name: z.string() }),
  farmer: z.object({ id: z.string(), name: z.string() }),
  createdAt: z.string(),
  updatedAt: z.string(),
})

// Helper function to transform form data to API data
export const transformFormDataToApiData = (formData: z.infer<typeof pondFormSchema>) => {
  return {
    ...formData,
    size: Number(formData.length) * Number(formData.breadth) * Number(formData.height),
    length: Number(formData.length),
    breadth: Number(formData.breadth),
    height: Number(formData.height),
    longitude: Number(formData.longitude),
    latitude: Number(formData.latitude),
  }
}

// Helper function to transform API data to form data
export const transformApiDataToFormData = (apiData: Partial<z.infer<typeof pondCreateSchema>>) => {
  return {
    ...apiData,
    size: apiData.size?.toString() || '',
    length: apiData.length?.toString() || '',
    breadth: apiData.breadth?.toString() || '',
    height: apiData.height?.toString() || '',
    longitude: apiData.longitude?.toString() || '',
    latitude: apiData.latitude?.toString() || '',
  }
}

// Export the form schema as pondSchema for backward compatibility
export const pondSchema = pondFormSchema

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
  supplier: z.string().min(1, { message: 'Please add a supplier name' }).optional(),
  quantity: z.coerce.number().positive('Quantity must be greater than 0'),
  singleCost: z.coerce.number().positive('Cost must be greater than 0'),
  costOfSupply: z.coerce.number().positive(),
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

export const transformFishFormDataToApi = (values: any, ponds: any[]) => {
  const pond = ponds.find((p) => p.name === values.pondId)
  return {
    ...values,
    pondId: pond?.id ?? '',
    quantity: Number(values.quantity),
    singleCost: Number(values.singleCost),
    costOfSupply: Number(values.costOfSupply),
  }
}

export const transformFishApiToForm = (api: any) => ({
  ...api,
  quantity: api.quantity?.toString() ?? '',
  singleCost: api.singleCost?.toString() ?? '',
  costOfSupply: api.costOfSupply?.toString() ?? '',
})

// When creating — all fields required
export const feedTypeCreateSchema = z.object({
  id: z.string().optional(),
  type: z.string().min(1, { message: 'Please select the brand of feed' }),
  sizeInMm: z.number({ required_error: 'Please select a pellet size' }),
  quantityInKg: z.number({ required_error: 'Please enter the quantity of feed' }),
  totalCost: z.string().min(1, { message: 'Please enter total cost' }),
  costPerKg: z.number({ required_error: 'Feed cost per kg must be a number' }),
  // date: z.string().min(1, { message: 'Please select a date' }),
  time: z.string().min(1, { message: 'Please select a time' }).optional(),
})

// When editing — only quantity and cost are required
export const feedTypeEditSchema = z.object({
  id: z.string().optional(),
  type: z.string().optional(),
  sizeInMm: z.number().optional(),
  quantityInKg: z.number({ required_error: 'Please enter the quantity of feed' }),
  totalCost: z.string().optional(),
  costPerKg: z.number({ required_error: 'Feed cost per kg must be a number' }),
  // date: z.string().optional(),
  time: z.string().min(1, { message: 'Please select a time' }).optional(),
})

export const feedTypeResponseSchema = z.object({
  id: z.string(),
  type: z.string(),
  sizeInMm: z.union([z.string(), z.number()]).transform((val) => String(val)),
  quantityInKg: z.union([z.string(), z.number()]).transform((val) => String(val)),
  costPerKg: z.union([z.string(), z.number()]).transform((val) => String(val)),
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
  feedType: z.string().min(1, { message: 'Please select a feed type' }),
  pelletSize: z.string().optional(),
  feedQuantity: z.string().min(1, { message: 'Please enter the quantity of feed' }),
  feedTime: z.string().min(1, { message: 'Please select a feeding time' }),

  // Water quality fields are always present, but can be empty strings unless required
  dissolvedOxygen: z.string().optional(),
  phLevel: z.string().optional(),
  temperature: z.string().optional(),
  ammonia: z.string().optional(),
  nitrite: z.string().optional(),
  alkalinity: z.string().optional(),
  hardness: z.string().optional(),
  observation: z.string().optional(),
})
export const extendedDailyFeedingSchema = (isWaterRequired?: boolean | false) =>
  dailyFeedingSchema.extend({
    feedType: z.string().optional(),
    pelletSize: z.string().optional(),
    feedQuantity: z.string().optional(),
    feedTime: z.string().optional(),
    dissolvedOxygen: isWaterRequired ? z.string().min(1, 'Dissolved Oxygen is required') : z.string().optional(),
    phLevel: isWaterRequired ? z.string().min(1, 'PH Level is required') : z.string().optional(),
    temperature: isWaterRequired ? z.string().min(1, 'Temperature is required') : z.string().optional(),
    ammonia: isWaterRequired ? z.string().min(1, 'Ammonia is required') : z.string().optional(),
    nitrite: isWaterRequired ? z.string().min(1, 'Nitrite is required') : z.string().optional(),
    alkalinity: isWaterRequired ? z.string().min(1, 'Alkalinity is required') : z.string().optional(),
    hardness: isWaterRequired ? z.string().min(1, 'Hardness is required') : z.string().optional(),
    observation: isWaterRequired ? z.string().min(5, 'Water Quality Observations is required') : z.string().optional(),
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
  reason: z.any().optional(),
  batches: z.array(
    z.object({
      pondId: z.string().optional(),
      quantity: z.any().optional(),
    }),
  ),
  quantity: z.any(),
  totalWeightHarvested: z.any(),
  costPerKg: z.any(),
})
// export const sortingSchema = z.object({
//   splitOccur: z.boolean(),
//   reason: z
//     .string()
//     .optional()
//     .superRefine((val, ctx) => {
//       console.log(ctx, val)

//       if (ctx.path[0].&& !val) {
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
  totalWeightHarvested: z.string(),
  costPerKg: z.string(),
})
