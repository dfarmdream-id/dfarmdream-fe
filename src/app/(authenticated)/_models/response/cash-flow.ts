export interface GetCashFlowListResponse {
  message: string
  data: Data
  status: number
}

export interface GetCashFlowResponse {
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
  code: string
  name: string
  amount: number
  type: string
  siteId: string
  cageId: string
  remark: string
  cashFlowCategoryId: string
  createdById: string
  status: string
  deletedAt: any
  createdAt: string
  updatedAt: string
  category: Category
  cage: Cage
  createdBy: CreatedBy
  site: Site
}

export interface Category {
  id: string
  code: string
  name: string
  deletedAt: any
  createdAt: string
  updatedAt: string
}

export interface Cage {
  id: string
  name: string
  deletedAt: any
  createdAt: string
  updatedAt: string
  siteId: string
  width: number
  height: number
  capacity: number
  status: string
}

export interface CreatedBy {
  id: string
  email: string
  username: string
  fullName: string
  password: string
  identityId: any
  phone: string
  address: string
  status: string
  deletedAt: any
  createdAt: string
  updatedAt: string
  positionId: string
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

export interface Meta {
  limit: number
  page: number
  totalData: number
  totalPage: number
}
