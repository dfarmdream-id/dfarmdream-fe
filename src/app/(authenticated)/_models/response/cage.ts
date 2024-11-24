export interface CageListResponse {
  message: string;
  data: Data;
  status: number;
}

export interface GetCageResponse {
  message: string;
  data: Daum;
  status: number;
}

export interface Data {
  data: Daum[];
  meta: Meta;
}

export interface Daum {
  id: string;
  name: string;
  deletedAt: any;
  createdAt: string;
  updatedAt: string;
  siteId?: string;
  width: number;
  height: number;
  capacity: number;
  status: string;
  site?: Site;
}

export interface Site {
  id: string;
  name: string;
  deletedAt: any;
  createdAt: string;
  updatedAt: string;
  provinceId: any;
  cityId: any;
  districtId: any;
  subDistrictId: any;
  address: string;
}

export interface Meta {
  limit: number;
  page: number;
  totalData: number;
  totalPage: number;
}
