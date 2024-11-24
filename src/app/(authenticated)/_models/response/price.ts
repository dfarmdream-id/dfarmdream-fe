import { Site } from "./cage";

export interface GetPriceListResponse {
  message: string;
  data: Data;
  status: number;
}

export interface GetPriceResponse {
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
  type: string;
  status: string;
  value: number;
  siteId: string;
  site: Site;
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
