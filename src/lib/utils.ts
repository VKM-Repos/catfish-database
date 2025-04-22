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
