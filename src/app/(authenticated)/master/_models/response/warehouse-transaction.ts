import { CreatedBy } from "./cash-flow";

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
  rackId: string;
  qty: number;
  weight: number;
  type: string;
  createdById: string;
  deletedAt: any;
  createdAt: string;
  createdBy: CreatedBy;
  updatedAt: string;
  cage: Cage;
  rack: Rack;
  site: Site;
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

export interface Rack {
  id: string;
  name: string;
  cageId: string;
  deletedAt: any;
  createdAt: string;
  updatedAt: string;
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
