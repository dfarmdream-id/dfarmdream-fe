export interface CageRackListResponse {
  message: string;
  data: Data;
  status: number;
}

export interface GetRackResponse {
  message: string;
  data: Daum;
  status: number;
}

export interface Data {
  data: Daum[];
  meta: Meta;
}
export interface Daum {
  id: string
  name: string
  cageId: string
  batchId: string;
  deletedAt: any
  createdAt: string
  updatedAt: string
  cage: Cage
  batch: Batch
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
  site: Site
}

export interface Batch {
  id: string;
  name: string;
  status: string;
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
