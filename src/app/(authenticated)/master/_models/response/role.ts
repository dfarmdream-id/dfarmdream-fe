export interface RoleListResponse {
  message: string
  data: Data
  status: number
}

export interface GetRoleResponse {
  message: string
  data: Daum
  status: number
}

export interface Data {
  data: Daum[]
  meta: Meta
}

export interface Daum {
  id: string
  name: string
  deletedAt: any
  createdAt: string
  updatedAt: string
  permissions: Permission[]
}

export interface Permission {
  id: string
  roleId: string
  permissionId: string
  deletedAt: any
  createdAt: string
  updatedAt: string
  permission: Permission2
}

export interface Permission2 {
  id: string
  name: string
  deletedAt: any
  createdAt: string
  updatedAt: string
}

export interface Meta {
  limit: number
  page: number
  totalData: number
  totalPage: number
}
