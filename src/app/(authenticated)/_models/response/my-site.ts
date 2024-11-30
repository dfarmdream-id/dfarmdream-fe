export interface MySiteResponse {
  message: string
  data: Daum[]
  status: number
}

export interface Daum {
  id: string
  userId: string
  siteId: string
  deletedAt: any
  createdAt: string
  updatedAt: string
  site: Site
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
