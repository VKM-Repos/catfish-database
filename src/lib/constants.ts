import { UserRole } from 'src/types'

export const _ROLES = ['SUPER_ADMIN', 'CLUSTER_MANAGER', 'FARMER', 'FARMER_STAFF'] as const

export const AvailableFeedTypes = {
  PELLETS: 'PELLETS',
  SKRETTING: 'SKRETTING',
  COPPENS: 'COPPENS',
  TOP_FEEDS: 'TOP_FEEDS',
  BLUE_CROWN: 'BLUE_CROWN',
  VITAL_FEEDS: 'VITAL_FEEDS',
  ALLER_AQUA: 'ALLER_AQUA',
  HYBRID_CATFISH_FEED: 'HYBRID_CATFISH_FEED',
  AQUALIS: 'AQUALIS',
  ECOFLOAT: 'ECOFLOAT',
  RAANAN: 'RAANAN',
  DURANTE: 'DURANTE',
  VITAL_FEED: 'VITAL_FEED',
  TOPFEED: 'TOPFEED',
  ANIMAL_CARE: 'ANIMAL_CARE',
  ZEIGLER: 'ZEIGLER',
  CHIKUN_FEED: 'CHIKUN_FEED',
  AMO_BYNG_FEED: 'AMO_BYNG_FEED',
  HYBRID_FEED: 'HYBRID_FEED',
  AF_FEED: 'AF_FEED',
}

export const MaintenanceActivityTypes = {
  LABOR: 'LABOR',
  CHEMICALS: 'CHEMICALS',
  EQUIPMENT: 'EQUIPMENT',
  ENERGY: 'ENERGY',
  CLEANING: 'CLEANING',
  REPAIRS: 'REPAIRS',
  DISINFECTION: 'DISINFECTION',
  OTHER: 'OTHER',
}

export const PelletSizes = ['0.5mm', '1.0mm', '2.0mm', '3.0mm', '4.0mm', '5.0mm', '6.0mm', '7.0mm', '8.0mm']

export interface RoleConfig {
  label: string
  textColor: string
  borderColor: string
  backgroundColor: string
  dotColor: string
  icon?: string // Optional icon class or component
  priority: number // For sorting/hierarchy display
}

export const ROLE_CONFIG: Record<UserRole, RoleConfig> = {
  [UserRole.SUPER_ADMIN]: {
    label: 'Super Admin',
    textColor: 'text-[#651391]',
    borderColor: 'border-[#D0D1D4]',
    backgroundColor: 'bg-[#F0E8F4]',
    dotColor: 'bg-[#651391]',
    priority: 1,
  },
  [UserRole.ADMIN]: {
    label: 'Admin',
    textColor: 'text-[#FF9040]',
    borderColor: 'border-[#FF9040]',
    backgroundColor: 'bg-[#FFF0E5]',
    dotColor: 'bg-[#FF9040]',
    priority: 2,
  },
  [UserRole.CLUSTER_MANAGER]: {
    label: 'Cluster Manager',
    textColor: 'text-[#0DA500]',
    borderColor: 'border-[#0DA500]',
    backgroundColor: 'bg-[#E7F6E5]',
    dotColor: 'bg-[#0DA500]',
    priority: 3,
  },
  [UserRole.FARMER]: {
    label: 'Farmer',
    textColor: 'text-[#000AFF]',
    borderColor: 'border-[#000AFF]',
    backgroundColor: 'bg-[#E5E7FF]',
    dotColor: 'bg-[#000AFF]',
    priority: 4,
  },
  [UserRole.FARMER_STAFF]: {
    label: 'Farmer Staff',
    textColor: 'text-[#FF0000]',
    borderColor: 'border-[#FF0000]',
    backgroundColor: 'bg-[#FFE5E5]',
    dotColor: 'bg-[#FF0000]',
    priority: 5,
  },
}
