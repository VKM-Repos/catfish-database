import { z } from 'zod'

export const totalFishSchema = z.object({
  availableFish: z.number(),
  soldFish: z.number(),
})

export const totalRevenueSchema = z.array(
  z.object({
    intervalLabel: z.string(),
    totalRevenue: z.number(),
  }),
)

export const averageWeightSchema = z.array(
  z.object({
    intervalLabel: z.string(),
    totalWeight: z.number(),
    totalRevenue: z.number(),
    totalQuantity: z.number(),
    averageSellingPrice: z.number(),
    averageFishWeight: z.number(),
  }),
)

export const survivalRateSchema = z.array(
  z.object({
    intervalLabel: z.string(),
    mortalityRate: z.number(),
    survivalRate: z.number(),
  }),
)
