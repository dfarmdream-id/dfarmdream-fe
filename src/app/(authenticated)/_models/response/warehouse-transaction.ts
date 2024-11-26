export interface GetWarehouseTransactionListResponse {
  message: string;
  data: Data;
  status: number;
}

export interface GetWarehouseTransactionResponse {
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
  siteId: string;
  code: string;
  cageId: string;
  qty: number;
  weight: number;
  type: string;
  createdById: string;
  deletedAt: any;
  createdAt: string;
  updatedAt: string;
  category: string;
  priceId?: string;
  cage: Cage;
  site: Site;
  createdBy: CreatedBy;
  items: Item[];
  price?: Price;
}

export interface Cage {
  id: string;
  name: string;
  deletedAt: any;
  createdAt: string;
  updatedAt: string;
  siteId: string;
  width: number;
  height: number;
  capacity: number;
  status: string;
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

export interface CreatedBy {
  id: string;
  email: string;
  username: string;
  fullName: string;
  password: string;
  identityId: any;
  phone: string;
  address: string;
  photoProfile: any;
  status: string;
  deletedAt: any;
  createdAt: string;
  updatedAt: string;
  positionId: string;
}

export interface Item {
  id: string;
  code: string;
  qty: number;
  rackId: string;
  createdById: string;
  deletedAt: any;
  createdAt: string;
  updatedAt: string;
  warehouseTransactionId: string;
}

export interface Price {
  id: string;
  name: string;
  type: string;
  status: string;
  value: number;
  siteId: string;
  deletedAt: any;
  createdAt: string;
  updatedAt: string;
}

export interface Meta {
  limit: number;
  page: number;
  totalData: number;
  totalPage: number;
}
