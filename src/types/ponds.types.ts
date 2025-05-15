export type pondResponseType = {
  id?: string
  status?: string
  name: string
  size: string
  latitude?: string | null
  longitude?: string | null
  waterSource: string
  pondType: string
  cluster: {
    id: string
    name: string
  }
  farmer: {
    id?: string
    name?: string
  }
  createdAt?: string | null
  updatedAt?: string | null
}

export type feedingResponseType = {
  id?: string
  pondId?: string
  feedType: string
  quantity: string
  frequency: string
  createdAt?: string | null
  updatedAt?: string | null
}

export type fishBatchResponseType = {
  id?: string
  pond: pondResponseType
  feedings: feedingResponseType[]
  quantity: string
  costOfSupply: string
  createdAt?: string | null
  updatedAt?: string | null
}

export type paginatedFishBatchResponseType = {
  totalPages: number
  totalElements: number
  page: number
  size: number
  content: fishBatchResponseType[]
}

export type paginatedPondResponseType = {
  totalPages: number
  totalElements: number
  page: number
  size: number
  content: pondResponseType[]
}
