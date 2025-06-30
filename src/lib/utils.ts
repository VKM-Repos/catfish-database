import { clsx, type ClassValue } from 'clsx'
import { UserRole } from 'src/types'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const states = [
  'Abia',
  'Adamawa',
  'Akwa Ibom',
  'Anambra',
  'Bauchi',
  'Bayelsa',
  'Benue',
  'Borno',
  'Cross River',
  'Delta',
  'Ebonyi',
  'Edo',
  'Ekiti',
  'Enugu',
  'FCT - Abuja',
  'Gombe',
  'Imo',
  'Jigawa',
  'Kaduna',
  'Kano',
  'Katsina',
  'Kebbi',
  'Kogi',
  'Kwara',
  'Lagos',
  'Nasarawa',
  'Niger',
  'Ogun',
  'Ondo',
  'Osun',
  'Oyo',
  'Plateau',
  'Rivers',
  'Sokoto',
  'Taraba',
  'Yobe',
  'Zamfara',
]

export const roleQueryMap: Record<string, string[]> = {
  FARMER: ['farmers'],
  CLUSTER_MANAGER: ['cluster-managers'],
}

export function removeSymbols(str: keyof typeof UserRole) {
  const newStr = str.replace(/[-,[_\]]/g, ' ')
  return newStr
}

/**
 * Converts a string like "HYBRID_CATFISH_FEED" to "Hybrid Catfish Feed"
 */
export function formatLabel(str: string) {
  if (!str) return ''
  return str
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function formatLatLng(lat: string, lng: string) {
  const latDirection = parseFloat(lat) >= 0 ? 'N' : 'S'
  const lngDirection = parseFloat(lng) >= 0 ? 'E' : 'W'

  const formattedLat = `${Math.abs(parseFloat(lat)).toFixed(4)}° ${latDirection}`
  const formattedLng = `${Math.abs(parseFloat(lng)).toFixed(4)}° ${lngDirection}`

  return `${formattedLat}, ${formattedLng}`
}

export function mergePondsWithTotalFishQuantity(ponds: any, batches: any) {
  return ponds?.content.map((pond: any) => {
    const relatedBatches = batches?.content.filter((batch: any) => batch.pond.id === pond.id)
    const quantity = relatedBatches.reduce((sum: any, b: any) => sum + (Number(b.quantity) || 0), 0)

    return {
      ...pond,
      quantity,
    }
  })
}

export function formatNumberWithCommas(number: number) {
  return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth',
  })
}

export function getInitials(str: string) {
  return str
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
}

export function formatPrice(value: number | string | undefined | null): string {
  if (value === undefined || value === null || isNaN(Number(value))) return '-'

  const number = Number(value)
  return number
    .toLocaleString('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
    .replace('NGN', '₦')
}
