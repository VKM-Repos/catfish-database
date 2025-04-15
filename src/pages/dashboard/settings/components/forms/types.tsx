import { Dispatch, SetStateAction } from 'react'
import { ClientErrorType } from 'src/types'

export interface CustomFormProps<T = any> {
  title?: string
  form: T
  onSubmit: (data: T) => void
  error: ClientErrorType | null
  setOpen: Dispatch<SetStateAction<boolean>>
  loading: boolean
}
