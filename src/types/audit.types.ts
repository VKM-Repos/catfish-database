export type Audit = {
  id: string
  timestamp: string // ISO string
  actionType: 'CREATE' | 'UPDATE' | 'DELETE' // or `string` if dynamic
  entityType: string
  entityId: string
  userId: string
  username: string
  oldValue: Record<string, any> | string | null
  newValue: Record<string, any> | string | null
  description: string
  ipAddress: string
  userAgent: string
}
