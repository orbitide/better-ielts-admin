export type BackendRole = {
  id: string
  name: string
  description: string
  isActive: boolean
  isSystem: boolean
}

export type BackendPermission = {
  id: string
  name: string
  module: string
  feature: string
  action: string
  description: string
  isActive: boolean
}
