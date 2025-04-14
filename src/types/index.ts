// Enums
export * from './enums/user.enum'

// Interfaces
export * from './interfaces/user.interface'
export * from './interfaces/api.interface'
export * from './interfaces/ui.interface'
export * from './interfaces/store.interface'

type User = {
  id: string
  firstName: string
  lastName: string
  phone: string
  address: string
  stateId: string
}

export type ServerErrorType = {
  error: string
  errors: string[]
  message: string
}

export type ClientErrorType = {
  title: string
  message: string
  errors: string[]
}
