export type Cluster = {
  id: string
  name: string
  state: {
    id: number
    name: string
  }
  description: string | null
  context: string | null
  createdDate: string | null
  lastModifiedDate: string | null
}
