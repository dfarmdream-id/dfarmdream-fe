export interface ProfileResponse {
  message: string
  data: Data
  status: number
}

export interface Data {
  id: string
  email: string
  username: string
  fullName: string
  password: string
  identityId: any
  photoProfile:string
  phone: string
  address: string
  status: string
  deletedAt: any
  createdAt: string
  updatedAt: string
  positionId: string
  roles: Role[]
  site: Site
}

export interface Role {
  id: string
  userId: string
  roleId: string
  deletedAt: any
  createdAt: string
  updatedAt: string
  role: Role2
}

export interface Role2 {
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
  code: string
  createdAt: string
  updatedAt: string
}

export interface Site {
  id: string
  name: string
  deletedAt: any
  createdAt: string
  updatedAt: string
  provinceId: any
  cityId: any
  districtId: any
  subDistrictId: any
  address: string
}
